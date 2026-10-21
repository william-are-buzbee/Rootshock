import type { MutantDef, RoundStop } from '../content/types';
import { angLerp, clamp, PI, TAU } from '../core/math';
import { STEP } from '../core/loop';
import { Edge, edgeCost, field as fieldFrom } from '../world/nav';
import type { Dyn } from '../world/world';
import { fall, impulse, makeBody, push, settle, shove, slide, steer, walk, type Body, type Slid } from './body';
import { carded, doorShut, makeFields, opensItself, refreshFields, routeRules, rulesFor, soundRules, staffField, type Fields, type Walker } from './fields';
import { end, hurtBy, log, power, sayOnce, sfx } from './game';
import { exposed, struck } from './combat';
import { occupied, sendPlatform, type Door } from './movers';
import { eyeHeight } from './player';
import { closing, DOWN, FALL, LAUNCH, MOVES, POISE, react, regain, RISE, SHOVE, SLAM, type Move } from './moves';
import { riders, simLighting, type Sim } from './sim';
import { bones, knockRag, layRag, makeRag, ragAt, RAG, REFLEX, type Killing, type Rag } from './ragdoll';
import type { V3 } from './sweep';

/* The cast (engine.md §7, §8): what lives in the station, ported from the first engine's behaviours. Each is a body that
   walks like yours, so it has weight, falls, rides platforms and is stopped by what stops you; they block each other
   and you. They find their way over the nav graph's fields, see along lines of sight scaled by the light you stand in,
   and hear what you do as far as the sound of it carries through the rooms between. */

export type Ai = 'husk' | 'skitter' | 'bloat' | 'thresher' | 'worm' | 'swimmer' | 'grabber' | 'patient';

interface Stats {
  ai?: Ai; model?: string; green?: boolean;
  hp: number; r: number; cr: number; mass: number;
  /** what its body weighs (kg), for shoving and being shoved; Infinity for one rooted where it sits */
  kg: number;
  /** how fast it changes its own pace (m/s²): a skitter at once, a thresher slowly (engine.md §6, the cast by velocity) */
  acc: number;
  /** its body's height */
  h: number;
  opens?: boolean; low?: boolean; noDoors?: boolean; solid?: boolean; fixed?: boolean; swim?: boolean;
  /** it carries a flashlight, on: a beam it sees by, and that lights you for everyone else (world.md §8, the night round) */
  torch?: boolean;
}

export const MT: Record<string, Stats> = {
  husk: { hp: 75, r: 0.38, cr: 0.34, mass: 1.2, kg: 80, acc: 18, h: 1.8, opens: true },
  /* one of the changed still walking the night shift's round, its flashlight on (world.md §8, the night round) */
  nightround: { ai: 'husk', model: 'husk', hp: 75, r: 0.38, cr: 0.34, mass: 1.2, kg: 80, acc: 14, h: 1.8, opens: true, torch: true },
  skitter: { hp: 60, r: 0.5, cr: 0.4, mass: 1, kg: 45, acc: 40, h: 0.9, low: true },
  bloat: { hp: 600, r: 1, cr: 0.9, mass: 8, kg: Infinity, acc: 3, h: 2.4, noDoors: true, solid: true },
  thresher: { hp: 150, r: 0.6, cr: 0.5, mass: 2.5, kg: 220, acc: 10, h: 2.1, solid: true, noDoors: true },
  /* 0.6 high: higher than a step, so you go round one rather than up onto it */
  worm: { hp: 40, r: 0.35, cr: 0.3, mass: 1, kg: 25, acc: 8, h: 0.6, low: true },
  rootworm: { ai: 'worm', model: 'worm', green: true, hp: 40, r: 0.35, cr: 0.3, mass: 1, kg: 25, acc: 8, h: 0.6, low: true },
  swimmer: { ai: 'swimmer', model: 'worm', hp: 40, r: 0.35, cr: 0.3, mass: 1, kg: 25, acc: 10, h: 0.6, swim: true },
  grabber: { hp: 30, r: 0.4, cr: 0, mass: 1, kg: Infinity, acc: 0, h: 0, fixed: true },
  /* the other patient in the isolation suite (world.md §8, the opening): awake for days, weak, and no danger to anyone */
  patient: { hp: 20, r: 0.3, cr: 0.28, mass: 1, kg: 55, acc: 6, h: 1.75 },
  vine: { ai: 'grabber', model: 'grabber', green: true, hp: 30, r: 0.4, cr: 0, mass: 1, kg: Infinity, acc: 0, h: 0, fixed: true },
};

export const DEATH: Record<Ai, string> = {
  husk: 'It beat you the way a person would. Patiently, and with both hands.',
  skitter: 'It folded itself over you, one limb at a time.',
  worm: 'They only ever wanted to hold you.',
  thresher: 'It opened, and you went in.',
  swimmer: 'The water closed over the last of the light.',
  grabber: 'The doorway closed its hands.',
  bloat: 'It sat on you. It did not seem to notice.',
  patient: '',
};

/** a ride on a platform: which, which way, and the spot to step off to */
interface Ride { lift: number; up: boolean; to: number; t: number }

export interface Mutant {
  id: number;
  type: string;
  ai: Ai;
  model: string;
  green: boolean;
  /** null for the fixed (a grabber is part of its wall) */
  body: Body | null;
  /** where it is: its body's feet, or its own place */
  x: number; y: number; z: number;
  /** where it was at the start of this step, so it can be drawn between steps */
  px: number; py: number; pz: number;
  yaw: number;
  state: string;
  st: number;
  cd: number;
  stun: number;
  hp: number;
  max: number;
  mass: number;
  r: number;
  walker: Walker;
  opens: boolean; low: boolean; noDoors: boolean; fixed: boolean; swim: boolean; solid: boolean;
  /** a guard that keeps its post until it notices you; one sitting down; one grown over; a big one */
  post: boolean; sit: boolean; holt: boolean; big: boolean;
  /** one of Security's staff, who carries its card (LevelDef.cards; it started in one of Security's zones) */
  cards: boolean;
  /** the door it is going to shut, one it saw left open (an index into Sim.doors), or -1 */
  door: number;
  /** a guard's round: its stops, in order, kept to for good (null for the rest); the stop it is making for */
  round: RoundStop[] | null;
  beat: number;
  /** how many times it has been all the way round; seconds since it last stood at the glass looking in at you */
  lap: number; peered: number;
  /** the other patient's place to hide: where it crouches, under its window */
  hide: { x: number; z: number } | null;
  /** the one of the cast it is dragging (an index into Sim.cast), or -1; metres it has dragged them since the last smear
   *  of blood it left */
  drag: number; trail: number;
  /** seconds left of grafting what it took (the night round, world.md §8); the leaf in it (the other patient) */
  graft: number; grafted: boolean;
  /** its flashlight is on in its hand */
  torch: boolean;
  /** where it started, which it keeps near */
  hx: number; hz: number;
  room: number;
  /* the first engine's timers and flags, by their old names: wait, wander, waypoint, footstep, lost, burst, flee,
     charge clock and direction, targeted, grab, tension */
  wt: number; wm: number; wx: number; wz: number;
  tk: number; lost: number; bt: number; burst: boolean; flee: number; ct: number; cdir: number; tgt: boolean;
  grab: number; tense: number;
  /** a blow under way, or null */
  blow: Blow | null;
  /** a roam: the spot it is making for, and the field to it */
  dest: number;
  F: Float32Array | null;
  stk: number;
  fled: boolean;
  side: number;
  ride: Ride | null;
  /** the nav spot it stands on */
  spot: number;
  /** its speed this step, for its legs and footsteps */
  mv: number;
  /** to you: straight, on the plan, and how far you are above it */
  d: number; dp: number; dy: number;
  /** a line of sight to you, and when it was last looked along */
  los: boolean; losAt: number;
  /** 1 when just hit, dying away */
  hit: number;
  /** what it can take before it reels (sim/moves.ts), seconds since it was last hit, and seconds left of reeling */
  poise: number; pmax: number; calm: number; reel: number;
  /** seconds it has held off, waiting for its turn at you (a husk while another is at you) */
  pat: number;
  /** knocked down (sim/moves.ts, DOWN): seconds left on the floor, then seconds left getting up */
  down: number; rise: number;
  /** how fast it changes its own pace (m/s²); and whether it moved itself this step (if not, it comes to a stop) */
  acc: number; drove: boolean;
  /** time, for its animation */
  ph: number;
  dead: boolean;
  /** 0..1 of its fall when it dies, for those that only fold where they are (a bloat, what grows on a wall) */
  gone: number;
  /** its body gone loose: once it is dead, or while it is knocked down (sim/ragdoll.ts) */
  rag: Rag | null;
  /** dev (the arena's clear): taken out of the world altogether */
  away: boolean;
  /** steps it has stood still: a body at rest is not asked about its footing */
  still: number;
}

const dt = STEP;

export function makeCast(sim: Sim, defs: MutantDef[]): Mutant[] {
  return defs.filter(d => MT[d.type]).map((def, id) => makeMutant(sim, def, id));
}

/** one of the cast, as a level places it, numbered `id` */
function makeMutant(sim: Sim, def: MutantDef, id: number): Mutant {
  const rnd = (a: number, b?: number) => sim.rng.range(a, b);
  {
    const S = MT[def.type], o = def.opts as Record<string, number | undefined>;
    /* every body stops every other, yours too (engine.md §6, F1b); they stop short of you, and shove you when they do not */
    const body = S.fixed ? null : makeBody(sim.world, def.x, def.y, def.z, S.cr, S.h, S.kg);
    const room = sim.world.roomAt(def.x, def.y + 0.5, def.z)?.id ?? -1;
    const m: Mutant = {
      id, type: def.type, ai: S.ai ?? (def.type as Ai), model: S.model ?? def.type, green: !!S.green, body,
      x: def.x, y: def.y, z: def.z, px: def.x, py: def.y, pz: def.z, yaw: o.yaw ?? rnd(TAU), state: (def.opts.state as string | undefined) ?? 'idle', st: 0, cd: 0, stun: 0,
      hp: S.hp, max: S.hp, mass: S.mass, r: S.r,
      walker: S.noDoors ? 'big' : S.opens ? 'hands' : 'crawl',
      opens: !!S.opens, low: !!S.low, noDoors: !!S.noDoors, fixed: !!S.fixed, swim: !!S.swim, solid: !!S.solid,
      post: !!o.post, sit: !!o.sit, holt: !!o.holt, big: !!o.big, hx: def.x, hz: def.z, room,
      cards: !!sim.world.def.cards && !!S.opens && !!sim.world.rooms[room]?.zone, door: -1,
      round: (def.opts.round as RoundStop[] | undefined) ?? null, beat: 0, lap: 0, peered: 99, torch: !!S.torch,
      hide: (def.opts.hide as { x: number; z: number } | undefined) ?? null, drag: -1, trail: 0, graft: 0, grafted: false,
      wt: rnd(1, 5), wm: 0, wx: 0, wz: 0, tk: 0, lost: 0, bt: 0, burst: false, flee: 0, ct: rnd(6, 14), cdir: 0, tgt: false,
      grab: 0, tense: 0, blow: null, dest: -1, F: null, stk: 0, fled: false, side: 0, ride: null, spot: -1,
      mv: 0, d: 99, dp: 99, dy: 0, los: false, losAt: -99, hit: 0, poise: poiseOf(def.type, S.ai, !!o.big), pmax: poiseOf(def.type, S.ai, !!o.big), calm: 99, reel: 0, pat: 0, down: 0, rise: 0, acc: S.acc, drove: false, ph: rnd(9), dead: false, gone: 0, rag: null, away: false, still: 0,
    };
    return m;
  }
}

/** dev (the arena): one of the cast put down where nothing placed it, awake and after you. The ways about the level are
 *  worked out the first time, if no one else needed them. Not for a run that saves: a save knows the level's cast only */
export function spawn(sim: Sim, type: string, x: number, y: number, z: number, opts: Record<string, unknown> = {}): Mutant | null {
  if (!MT[type]) return null;
  const m = makeMutant(sim, { type, x, y, z, opts }, sim.cast.length);
  m.yaw = Math.atan2(sim.player.body.x - x, sim.player.body.z - z);
  sim.cast.push(m);
  if (!sim.fields) { sim.fields = makeFields(sim); refreshFields(sim, sim.fields); }
  if (m.ai === 'husk' || m.ai === 'skitter') { m.state = 'hunt'; m.lost = 0; }
  else if (m.ai === 'thresher') { m.state = 'pursue'; m.st = 1e9; }
  return m;
}

/** what it can take before it reels: by its kind, a big skitter more */
function poiseOf(type: string, ai: Ai | undefined, big: boolean): number {
  const P = POISE as Record<string, number>;
  if ((ai ?? type) === 'skitter' && big) return POISE.bigSkitter;
  return P[type] ?? P[ai ?? ''] ?? POISE.other;
}

/** the bodies of the living, for doors and platforms to know about */
export const castBodies = (sim: Sim): Body[] => sim.cast.filter(m => !m.dead && m.body).map(m => m.body!);

/** those that make a light door open as they come near: anything that walks and fits a door */
export const castMovers = (sim: Sim): Body[] => sim.cast.filter(m => !m.dead && m.body && !m.noDoors).map(m => m.body!);

/* ---- perception */

/** what sight goes through: bodies, and glass */
const seeThrough = (d: Dyn) => d.kind === 'body' || !!d.glass;

/** a clear line from its eye to yours: through no wall, door or crate. Looked along at most every tenth of a second. */
function sight(sim: Sim, m: Mutant): boolean {
  if (sim.tick - m.losAt < 6) return m.los;
  m.losAt = sim.tick;
  const b = sim.player.body, eye = m.fixed ? 2.0 : Math.min(1.6, (m.body?.h ?? 1) * 0.85);
  m.los = sim.world.raycast(m.x, m.y + eye, m.z, b.x, b.y + eyeHeight(sim.player) * 0.9, b.z, seeThrough) >= 1;
  return m.los;
}

/** it sees you: near enough for the light you are in, and nothing in the way */
const seeP = (sim: Sim, m: Mutant, range: number) => m.d < range * sim.game.vis && sight(sim, m);

/** it hears you: what you are doing carries as far as where it stands */
function hears(sim: Sim, m: Mutant): boolean {
  const g = sim.game;
  if (g.noise <= 0 || !sim.fields) return false;
  if (m.spot >= 0) return sim.fields.sound[m.spot] < g.noise;
  return m.d < g.noise * 0.5;
}

/** in the beam of your flashlight */
function inBeam(sim: Sim, m: Mutant): boolean {
  const p = sim.player, b = p.body, cp = Math.cos(p.pitch);
  const fx = -Math.sin(p.yaw) * cp, fy = Math.sin(p.pitch), fz = -Math.cos(p.yaw) * cp;
  const dx = m.x - b.x, dy = m.y + 0.3 - (b.y + eyeHeight(p)), dz = m.z - b.z, d = Math.hypot(dx, dy, dz) || 1;
  return (dx * fx + dy * fy + dz * fz) / d > 0.82 && sight(sim, m);
}

/* ---- moving */

/* Its own feet (engine.md §6, the cast by velocity). Whatever it does, it does by wanting a velocity: it speeds toward it
   as fast as its kind can change pace, so it arrives with way on, brakes to stop, is slow to come back from a knock,
   and shoves what it walks into by what it weighs. Faster than it wants to go (knocked, thrown, carried along), friction
   slows it as it slows you, and a wall it is thrown into hurts it. One step of it, once a step: what the behaviours
   ask for, or, if none of them moved it, coming to a stop. */
function drive(sim: Sim, m: Mutant, wx: number, wz: number, rate = m.acc): Slid & { moved: number; pre: number } {
  const b = m.body!, p = sim.player.body, want = Math.hypot(wx, wz), thrown = Math.hypot(b.vx, b.vz) > want + 0.5;
  if (!b.carried) steer(b, wx, wz, thrown ? FRICTION : rate, dt);
  const vx = b.vx, vz = b.vz, ox = b.x, oz = b.z, r = slide(sim.world, b, dt);
  if (r.hit === p.dyn) shove(b, p, vx, vz, wx, wz, thrown);
  /* thrown into a wall, a door, a crate: it hurts (into another body, it only shoves it) */
  else if (thrown && r.hit && (r.hit === 'world' || r.hit.kind !== 'body') && r.slam > SLAM.min) battered(sim, m, r.slam - SLAM.min, SLAM);
  m.x = b.x; m.z = b.z;
  m.drove = true;
  const moved = Math.hypot(b.x - ox, b.z - oz);
  m.mv = moved / dt > 0.2 ? moved / dt : 0;
  return { ...r, moved, pre: Math.hypot(vx, vz) * dt };
}

/** walk toward (tx, tz) at `spd`, braking to arrive. True if it is there (or as near you as it comes); false if it was
 *  stopped this step and had to step aside */
function go(sim: Sim, m: Mutant, tx: number, tz: number, spd: number): boolean {
  const b = m.body;
  if (!b) return false;
  let dx = tx - b.x, dz = tz - b.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.05) { drive(sim, m, 0, 0); return true; }
  dx /= d; dz /= d;
  m.yaw = angLerp(m.yaw, Math.atan2(dx, dz), Math.min(1, dt * 8));
  /* it stops short of you, close enough to reach, never on top of you: braking in time, by the way it has on */
  const p = sim.player.body, v = Math.hypot(b.vx, b.vz), brake = (v * v) / (2 * Math.max(1, m.acc));
  const ahead = spd * dt + brake, nx = b.x + dx * ahead, nz = b.z + dz * ahead, nd = Math.hypot(nx - p.x, nz - p.z);
  if (Math.abs(m.dy) < 1.5 && nd < m.r + 0.3 && nd < m.dp) { drive(sim, m, 0, 0); return true; }
  /* and slows to arrive where it is going */
  const pace = Math.min(spd, Math.sqrt(2 * Math.max(1, m.acc) * d));
  const r = drive(sim, m, dx * pace, dz * pace);
  /* wedged on a corner or against another of them: sidestep, and keep to the same side until it clears. Not round you. */
  if (r.hit && r.hit !== p.dyn && r.moved < r.pre * 0.3 && r.pre > 1e-3) {
    const st = Math.max(r.pre, pace * dt * 0.5);
    if (!m.side) m.side = sim.rng.chance(0.5) ? 1 : -1;
    for (const q of [m.side, -m.side]) {
      const px = b.x, pz = b.z;
      walk(sim.world, b, dz * st * q, -dx * st * q);
      if (Math.hypot(b.x - px, b.z - pz) >= st * 0.3) { m.side = q; m.x = b.x; m.z = b.z; m.mv = spd; return false; }
    }
    return false;
  }
  m.side = 0;
  return true;
}

/** the door a spot stands in, if it is shut to this one now: open it by hand if it can, or wait for it */
function doorAhead(sim: Sim, m: Mutant, d: Door): 'go' | 'wait' | 'no' {
  if (d.t > 0.9) return 'go';
  if (m.walker === 'crawl' && d.def.stuck) return 'go';
  const pw = power(sim.game, d.def.circuit);
  if (opensItself(d, pw)) return 'wait'; // it is opening for us
  /* a card door: it shows the reader its card, which beeps, and the door lets it through and shuts after */
  if (m.cards && carded(sim, d)) {
    if (!d.open) { d.open = true; sfx(sim.game, 'take', { x: (d.def.x0 + d.def.x1) / 2, y: d.def.y0 + 1.2, z: (d.def.z0 + d.def.z1) / 2 }); }
    d.pass = Math.max(d.pass, 2.5);
    return 'wait';
  }
  if (m.opens && !doorShut(d)) {
    if (!d.open) {
      d.open = true; d.hold = 3;
      sfx(sim.game, 'door', { x: (d.def.x0 + d.def.x1) / 2, y: d.def.y0, z: (d.def.z0 + d.def.z1) / 2 });
    }
    return 'wait';
  }
  return 'no';
}

/** walk a field downhill (or, away, uphill): a spot at a time, working doors and riding platforms on the way */
function follow(sim: Sim, m: Mutant, F: Float32Array, spd: number, away: boolean): boolean {
  const Fs = sim.fields;
  if (!Fs || !m.body) return false;
  if (m.ride) return ride(sim, m, Fs);
  const nav = Fs.nav, i = m.spot;
  if (i < 0) return false;
  const R = rulesFor(sim, Fs, m.walker, m.cards);
  /* downhill: the cheapest way on (the field is float32, so compare scores with each other, not with F[i]);
     uphill (away): the farthest neighbour that is farther than here */
  let bv = away ? F[i] : Infinity, best = -1, be = -1;
  if (away && !Number.isFinite(bv)) return false;
  for (let e = nav.start[i]; e < nav.start[i + 1]; e++) {
    const j = nav.to[e], v = F[j];
    if (!Number.isFinite(v)) continue;
    const c = edgeCost(nav, R, e, j);
    if (c === null) continue;
    const score = away ? v : v + c;
    if (away ? score > bv : score < bv) { bv = score; best = j; be = e; }
  }
  if (best < 0) return false;
  if (nav.kind[be] === Edge.Lift) {
    m.ride = { lift: nav.lift[be], up: nav.y[best] > nav.y[i], to: best, t: 0 };
    return ride(sim, m, Fs);
  }
  /* a door in the way */
  const dr = nav.door[best];
  if (dr >= 0) {
    const a = doorAhead(sim, m, sim.doors[dr]);
    if (a === 'no') return false;
    if (a === 'wait') { m.mv = 0; return true; }
  }
  /* stepping onto a platform: only when it is there to step onto */
  const L = Fs.onLift[best];
  if (L >= 0 && Fs.onLift[i] !== L) {
    const p = sim.platforms[L];
    if (p.moving || p.y > p.def.y0 + 0.01) { callLift(sim, m, L, 0); m.mv = 0; return true; }
  }
  return go(sim, m, nav.x[best], nav.z[best], spd);
}

/** a hand on the call button: send a platform to one end, if it has power and is not already on its way */
function callLift(sim: Sim, m: Mutant, li: number, end: 0 | 1): void {
  const p = sim.platforms[li], c = p.def.call;
  if (!c || !m.opens || p.moving || power(sim.game, c.circuit) <= 0) return;
  if (Math.abs(p.y - (end ? p.def.y1 : p.def.y0)) < 0.01) return;
  sendPlatform(p, end);
  sfx(sim.game, 'door', { x: (p.def.x0 + p.def.x1) / 2, y: p.y, z: (p.def.z0 + p.def.z1) / 2 });
}

/** riding a platform: get on at the near end (calling it if it can), ride, and step off to the spot past it */
function ride(sim: Sim, m: Mutant, Fs: Fields): boolean {
  const R = m.ride!, p = sim.platforms[R.lift], D = p.def, b = m.body!, nav = Fs.nav;
  const near: 0 | 1 = R.up ? 0 : 1, far: 0 | 1 = R.up ? 1 : 0, farY = far ? D.y1 : D.y0;
  const at = (end: 0 | 1) => !p.moving && Math.abs(p.y - (end ? D.y1 : D.y0)) < 0.01;
  R.t += dt;
  if (R.t > 25) { m.ride = null; return false; } // nothing came: give it up
  const s = nav.locate(b.x, b.y, b.z);
  if (s === R.to || (s >= 0 && Math.abs(nav.y[s] - farY) < 0.4 && Fs.onLift[s] !== R.lift && b.on !== p.dyn)) { m.ride = null; return true; }
  if (b.on === p.dyn) {
    if (at(far)) return go(sim, m, nav.x[R.to], nav.z[R.to], 1.8);
    /* to the middle first: at the edge it would catch on the floor above, and the platform would turn back */
    const cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2;
    if (Math.hypot(b.x - cx, b.z - cz) > 0.25) return go(sim, m, cx, cz, 1.8);
    if (!p.moving) callLift(sim, m, R.lift, far); // a platform that goes by itself goes once stood on
    m.mv = 0;
    return true;
  }
  if (at(near)) return go(sim, m, (D.x0 + D.x1) / 2, (D.z0 + D.z1) / 2, 1.8);
  callLift(sim, m, R.lift, near);
  m.mv = 0;
  return true;
}

function chase(sim: Sim, m: Mutant, spd: number, F: Float32Array): boolean {
  const p = sim.player.body;
  /* seen and near: straight at you, unless the way round is far longer than that (a pane of glass between) */
  if (m.dp < 7 && Math.abs(m.dy) < 1 && sight(sim, m) && !(F[m.spot] > m.dp * 1.3 + 1.5)) return go(sim, m, p.x, p.z, spd);
  return follow(sim, m, F, spd, false);
}

function away(sim: Sim, m: Mutant, spd: number, F?: Float32Array): boolean {
  const p = sim.player.body;
  if (sim.fields && follow(sim, m, F ?? sim.fields.crawl, spd, true)) return true;
  const dx = m.x - p.x, dz = m.z - p.z, d = Math.hypot(dx, dz) || 1;
  return go(sim, m, m.x + (dx / d) * 2, m.z + (dz / d) * 2, spd);
}

/** a charge: straight on, whatever is there. False when it hits something. */
function chargeMove(sim: Sim, m: Mutant, spd: number): boolean {
  const r = drive(sim, m, Math.sin(m.cdir) * spd, Math.cos(m.cdir) * spd, CHARGE);
  m.yaw = m.cdir;
  /* into a wall at full tilt: it cannot stop, and it hurts, by how fast it met it (even if it got part of the way first) */
  if (r.hit && r.hit !== sim.player.body.dyn && (r.slam > 1 || r.moved < r.pre * 0.6)) {
    if (r.slam > SLAM.min) battered(sim, m, r.slam - SLAM.min, SLAM);
    return false;
  }
  return true;
}

/** how fast a charge gets going (m/s²): quicker than its walk, never all at once */
const CHARGE = 16;

/** a point somewhere in its own room */
function roomWp(sim: Sim, m: Mutant): void {
  const R = sim.world.rooms[m.room];
  if (!R) { m.wx = m.hx; m.wz = m.hz; return; }
  const pad = Math.min(m.r + 0.3, (R.x1 - R.x0) / 2, (R.z1 - R.z0) / 2);
  m.wx = sim.rng.range(R.x0 + pad, R.x1 - pad);
  m.wz = sim.rng.range(R.z0 + pad, R.z1 - pad);
}

const picked = new WeakMap<Sim, number>();

/** staff still keep rounds, and keep to the light: they hunt by sight (world.md §8). A round goes to a lit room picked at
 *  random; one standing in the dark makes for the nearest lit room it can get to, and with none keeps still until the
 *  light comes. */
function pickDest(sim: Sim, m: Mutant): void {
  const Fs = sim.fields;
  if (!Fs || m.spot < 0) { m.wt = 3; return; }
  /* one new route a step at most, across the whole cast */
  if (picked.get(sim) === sim.tick) { m.wt = 0.05; return; }
  picked.set(sim, sim.tick);
  const rooms = rounds(sim);
  if (!lit(sim, m.x, m.y + 0.5, m.z)) {
    const k = nearestIn(sim, m, rooms);
    if (k < 0) { m.wt = 3; return; }
    m.F = fieldTo(sim, m, k);
    if (!Number.isFinite(m.F[m.spot])) { m.wt = 3; return; }
    m.dest = k;
    return;
  }
  if (!rooms.length) { m.wt = 5; return; }
  const R = sim.rng.pick(rooms), spots = Fs.nav.byRoom.get(R) ?? [];
  if (!spots.length) { m.wt = 0.5; return; }
  const k = sim.rng.pick(spots);
  m.F = fieldTo(sim, m, k);
  if (!m.F || !Number.isFinite(m.F[m.spot])) { m.wt = sim.rng.range(1, 3); return; }
  m.dest = k;
}

function fieldTo(sim: Sim, m: Mutant, k: number): Float32Array {
  const Fs = sim.fields!;
  return fieldFrom(Fs.nav, k, routeRules(sim, Fs, m.walker), m.F ?? undefined);
}

/** after a load: the route to where it was going, made again (it depends on the level's shape alone) */
export function restoreRoute(sim: Sim, m: Mutant): void {
  m.F = sim.fields && m.dest >= 0 ? fieldTo(sim, m, m.dest) : null;
}

/** the level's light as the power stands: what the cast see by (made again when the power changes) */
const lighting = (sim: Sim) => (sim.lighting ??= simLighting(sim));
const LIT = 0.02;
const lit = (sim: Sim, x: number, y: number, z: number) => Math.max(...lighting(sim).seen(x, y, z)) > LIT;
function litRoom(sim: Sim, id: number): boolean {
  return Math.max(...lighting(sim).room(id)) > LIT;
}

/** the rooms the cast's rounds can take them to, as the power stands: the lit ones */
export function rounds(sim: Sim): number[] {
  return roamRooms(sim).filter(R => litRoom(sim, R));
}

/** of these rooms, the spot nearest it can get to as the doors stand now (a locked door bars it), or -1. Only the choice
 *  needs the doors; the route there is made as any round's is, and a save keeps the choice. */
function nearestIn(sim: Sim, m: Mutant, rooms: number[]): number {
  const Fs = sim.fields!, from = fieldFrom(Fs.nav, m.spot, rulesFor(sim, Fs, m.walker, m.cards));
  let best = -1;
  for (const R of rooms) for (const k of Fs.nav.byRoom.get(R) ?? []) if (from[k] < (best < 0 ? Infinity : from[best])) best = k;
  return best;
}

const roamCache = new WeakMap<object, number[]>();
/** rooms worth a walk: not a refuge, not marked off, not armed, not a doorway, not a cupboard */
function roamRooms(sim: Sim): number[] {
  let r = roamCache.get(sim.world);
  if (!r) {
    r = sim.world.rooms.filter(R => !R.safe && !R.noroam && !R.armed && !R.doorway && (R.x1 - R.x0) * (R.z1 - R.z0) >= 16).map(R => R.id);
    roamCache.set(sim.world, r);
  }
  return r;
}

function roam(sim: Sim, m: Mutant, spd: number): void {
  if (m.wt > 0) { m.wt -= dt; return; }
  if (m.dest < 0) { pickDest(sim, m); return; }
  if (m.spot === m.dest || (m.F && m.spot >= 0 && m.F[m.spot] < 1.2)) { m.dest = -1; m.wt = sim.rng.range(3, 10); return; }
  if (!follow(sim, m, m.F!, spd, false)) {
    m.stk += dt;
    if (m.stk > 1.5) { m.stk = 0; m.dest = -1; m.ride = null; m.wt = sim.rng.range(1, 3); }
  } else m.stk = 0;
}

/* ---- hurting you */

/** it lands on you: what it takes of you and of your poise (sim/combat.ts, struck), and the shove it gives you
 *  (kg m/s), or for one that throws you, how fast (m/s). Run into it and it lands harder; back off and softer
 *  (sim/moves.ts, closing); down, harder still */
function strikes(sim: Sim, m: Mutant, dmg: number, poise: number, shove = 0, throws = 0): void {
  const b = sim.player.body;
  /* you are on something well above it: it cannot reach */
  if (!m.fixed && b.y - m.y > 1.4) return;
  const dx = b.x - m.x, dz = b.z - m.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d;
  const k = closing(-(b.vx * ux + b.vz * uz)) * (sim.hands.down > 0 ? DOWN.more : 1);
  hurtBy(sim.game, dmg * k, DEATH[m.ai], { x: m.x, z: m.z });
  const dv = throws || (shove * k) / b.mass, r = struck(sim, poise * k, { x: m.x, z: m.z }, dv);
  log(sim.game, `${m.type} → you  ${(dmg * k).toFixed(0)} dmg  ×${k.toFixed(2)}  shove ${dv.toFixed(1)} m/s  → ${r}  (poise ${(poise * k).toFixed(0)}, ${sim.hands.poise.toFixed(0)}/30 left)`);
  if (shove) impulse(b, ux * shove * k, uz * shove * k);
}

const step_ = (sim: Sim, m: Mutant, name: string, big = false) => sfx(sim.game, name, m, big);

/* ---- taking turns

   Husks come at you one at a time. The one at you is the nearest of those hunting you close by (one mid-blow keeps its
   place); the rest hold off at arm's length and a half, circling, faced to you, until you are open (a blow of yours
   thrown, your arm coming back, or you reeling) or they have waited long enough. Your opening is their turn. */

const WAIT = { ring: 2.4, near: 4, patience: 3 };

/** the husk at you, or -1 */
function frontOf(sim: Sim): number {
  let best = -1, bd = 3.2;
  for (const m of sim.cast) {
    if (m.dead || m.ai !== 'husk' || m.state !== 'hunt' || Math.abs(m.dy) > 1.5) continue;
    const d = m.blow ? -1 : m.dp;
    if (d < bd) { bd = d; best = m.id; }
  }
  return best;
}

/** it holds off: another is at you, you are not open, and it has not waited too long */
function waits(sim: Sim, m: Mutant): boolean {
  return sim.front >= 0 && sim.front !== m.id && !exposed(sim) && m.pat < WAIT.patience && m.dp < WAIT.near;
}

/** `ring` from you, edging round you, faced to you */
function hover(sim: Sim, m: Mutant, ring: number): void {
  const p = sim.player.body, d = m.dp || 1, ux = (m.x - p.x) / d, uz = (m.z - p.z) / d;
  const a = m.id % 2 ? 0.35 : -0.35, c = Math.cos(a), sn = Math.sin(a);
  go(sim, m, p.x + (ux * c - uz * sn) * ring, p.z + (ux * sn + uz * c) * ring, 1.3);
  turnTo(sim, m, 8);
}

/* ---- a blow: wound up, thrown, recovered from

   A blow is three motions, as yours is two. The wind-up is the tell: it is heard, and the thing turns to follow you
   only for the first part of it, then holds the line it has chosen, so a step aside as it commits takes you out of the
   way. The strike is short and goes where it was aimed, carrying the thing forward a little: it lands only on you in
   front of it (an arc about the way it faces), within its reach, and not well above or below it. Then it recovers
   where the blow left it, not moving, not turning, and longer when the blow met nothing. That is your time. */

export type BlowPhase = 'wind' | 'strike' | 'after';
/** `at`: one of the cast it is thrown at (an index into Sim.cast), not you: the night round's, at the other patient */
export interface Blow { ph: BlowPhase; t: number; hit: boolean; at?: number }

/** a blow's motions, reach and weight: the same kind of thing as yours (sim/moves.ts) */
export type BlowKind = Move;

/** the blow this one throws, if it throws one */
export function blowKind(m: Mutant): BlowKind | null {
  switch (m.ai) {
    case 'husk': return MOVES.husk;
    case 'skitter': return m.big ? MOVES.bigSkitter : MOVES.skitter;
    case 'thresher': return MOVES.thresher;
    case 'worm': return MOVES.worm;
    case 'swimmer': return MOVES.swimmer;
    default: return null;
  }
}

/** where it is in its blow: the motion, and how far through it (0..1) */
export function blowAt(m: Mutant): { ph: BlowPhase; q: number } | null {
  const B = m.blow, K = blowKind(m);
  if (!B || !K) return null;
  const dur = B.ph === 'wind' ? K.wind : B.ph === 'strike' ? K.strike : B.hit ? K.rec : K.miss;
  return { ph: B.ph, q: Math.min(1, B.t / dur) };
}

/** how long a wide blow that glanced off a wall leaves it reeling (s), before the long recovery of a blow that met
 *  nothing */
const GLANCED = 0.6;

/** what an arm goes through: other bodies, and nothing else (glass stops it, though sight goes through) */
const onlyBodies = (d: Dyn) => d.kind === 'body';

/** a wall within the arc of its wide blow, at about a metre up, either side, out to most of its reach */
function cramped(sim: Sim, m: Mutant, K: Move): boolean {
  const half = Math.acos(K.arc), R = m.r + K.reach * 0.8, y = m.y + 1;
  for (const e of [-half, half]) {
    const a = m.yaw + e;
    if (sim.world.raycast(m.x, y, m.z, m.x + Math.sin(a) * R, y, m.z + Math.cos(a) * R, onlyBodies) < 1) return true;
  }
  return false;
}

/** how fast a lunge gets going (m/s²): it is thrown, all but at once */
const LUNGE = 120;

/** close enough to begin one */
const inStart = (m: Mutant, K: BlowKind) => m.dp < m.r + K.start && Math.abs(m.dy) < 1.2;

/** you are where the blow goes: in front of it, in its reach, about level with it */
export function inBlow(sim: Sim, m: Mutant, K: BlowKind): boolean {
  const b = sim.player.body, dx = b.x - m.x, dz = b.z - m.z, d = Math.hypot(dx, dz);
  if (d > m.r + K.reach || Math.abs(b.y - m.y) > 1.4) return false;
  /* so close you are inside it: there is no getting round that */
  if (d < m.r) return true;
  return (dx * Math.sin(m.yaw) + dz * Math.cos(m.yaw)) / d >= K.arc;
}

function beginBlow(sim: Sim, m: Mutant, K: BlowKind, at?: number): void {
  m.blow = at === undefined ? { ph: 'wind', t: 0, hit: false } : { ph: 'wind', t: 0, hit: false, at };
  step_(sim, m, K.tell, K.big);
}

/** a step of a blow under way; false when there is none, so the behaviour goes on with whatever else it does */
function blowStep(sim: Sim, m: Mutant): boolean {
  const B = m.blow, K = blowKind(m);
  if (!B || !K) return false;
  B.t += dt;
  /* at another of the cast: turned to them, and it lands where they are, for sure */
  const q = B.at === undefined ? null : sim.cast[B.at];
  if (q) {
    if (B.ph !== 'after') m.yaw = angLerp(m.yaw, Math.atan2(q.x - m.x, q.z - m.z), Math.min(1, dt * K.turn));
    if (B.ph === 'wind' && B.t >= K.wind) { B.ph = 'strike'; B.t = 0; step_(sim, m, 'swing', K.big); }
    else if (B.ph === 'strike' && B.t >= K.strike) { B.hit = true; beaten(sim, q); B.ph = 'after'; B.t = 0; }
    else if (B.ph === 'after' && B.t >= K.rec) m.blow = null;
    return true;
  }
  switch (B.ph) {
    case 'wind':
      if (B.t < K.wind * K.lock) {
        turnTo(sim, m, K.turn);
        /* backed off from: it comes after you, until it has committed */
        if (K.creep && m.body && !inStart(m, K)) drive(sim, m, Math.sin(m.yaw) * K.creep, Math.cos(m.yaw) * K.creep);
      }
      if (B.t >= K.wind) {
        /* a wide blow with a wall in its arc glances off it: nothing lands, and it reels, long open */
        if (K.wide && cramped(sim, m, K)) {
          B.ph = 'after'; B.t = 0; B.hit = false;
          sfx(sim.game, 'blow', { x: m.x, y: m.y + 1, z: m.z });
          step_(sim, m, 'thud', true);
          m.reel = GLANCED; m.stun = Math.max(m.stun, GLANCED);
          break;
        }
        B.ph = 'strike'; B.t = 0; step_(sim, m, 'swing', K.big);
      }
      break;
    case 'strike': {
      /* the lunge, along the line it chose, thrown at once; not into you if you are already under it */
      if (m.body && m.dp > m.r + 0.3) drive(sim, m, Math.sin(m.yaw) * (K.lunge / K.strike), Math.cos(m.yaw) * (K.lunge / K.strike), LUNGE);
      if (!B.hit && inBlow(sim, m, K)) { B.hit = true; strikes(sim, m, K.dmg, K.poise, K.shove); }
      if (B.t >= K.strike) { if (!B.hit) step_(sim, m, 'whiff', K.big); B.ph = 'after'; B.t = 0; }
      break;
    }
    case 'after':
      if (B.t >= (B.hit ? K.rec : K.miss)) { m.blow = null; m.cd = K.cd; }
      break;
  }
  return true;
}

/* ---- the behaviours, as the first engine had them */

const turnTo = (sim: Sim, m: Mutant, k: number) => {
  const p = sim.player.body;
  m.yaw = angLerp(m.yaw, Math.atan2(p.x - m.x, p.z - m.z), Math.min(1, dt * k));
};
const rnd = (sim: Sim, a: number, b?: number) => sim.rng.range(a, b);

/** a husk at rest or on its way somewhere notices you: in front of it and seen, or heard. Then it hunts. */
function notices(sim: Sim, m: Mutant): boolean {
  const p = sim.player.body, facing = m.d < 2.5 || ((p.x - m.x) * Math.sin(m.yaw) + (p.z - m.z) * Math.cos(m.yaw)) / (m.dp || 1) > -0.2;
  if (!((facing && seeP(sim, m, 15)) || hears(sim, m))) return false;
  return hunt(sim, m);
}

/** it has you */
function hunt(sim: Sim, m: Mutant): boolean {
  /* the night round, seeing you where it cannot get to you: to the glass, to look in (PEER); once in a while, and not
     before it has tried your door, if that is one it is on its way to try */
  if (m.round && !reaches(sim, m)) {
    if (m.peered < PEER.again || (m.state === 'round' && triesYours(sim, m))) return false;
    const at = glassSpot(sim, m);
    m.state = 'peer'; m.st = PEER.look; m.wx = at.x; m.wz = at.z; m.peered = 0; m.wt = 0;
    return true;
  }
  m.state = 'hunt'; m.lost = 0; m.post = false; m.dest = -1; step_(sim, m, 'moan');
  return true;
}

/** looking for whoever threw the breaker: a while about the board, slowly, a spot at a time, stopping to look round.
 *  It sees farther than on its rounds, and all round: it is looking (world.md §8, the changed) */
const SEARCH = { time: [14, 20] as const, reach: 6, pace: 1.2, see: 18, look: [1.5, 3] as const };

/** a door left open: one that does not shut itself (slid open by hand with no power to it, or a heavy one left open), was
 *  shut when the place was new, and is open now. One of the staff on its rounds that sees one goes to it, looks through,
 *  and shuts it (world.md §8, the changed). It sees one this far, in front of it, lit, and in plain view, if it is not at
 *  it already; and looks for one every so often, not every step */
const LEFT = { see: 14, near: 2.5, every: 30, look: 2, pace: 1.4 };

const doorMid = (d: Door) => ({ x: (d.def.x0 + d.def.x1) / 2, y: d.def.y0 + 1.2, z: (d.def.z0 + d.def.z1) / 2 });

function leftOpen(sim: Sim, d: Door): boolean {
  const D = d.def;
  if (!d.open || D.open || D.stuck || D.vent || D.seal || D.lift || D.glass || d.pass > 0) return false;
  return D.kind === 'heavy' || power(sim.game, D.circuit) <= 0;
}

/** one on its rounds sees a door left open that nobody is seeing to, and goes to shut it */
function noticesDoor(sim: Sim, m: Mutant): boolean {
  if (!m.cards || m.post || m.spot < 0 || (sim.tick + m.id) % LEFT.every || !sim.fields) return false;
  const eye = Math.min(1.6, (m.body?.h ?? 1) * 0.85);
  for (let k = 0; k < sim.doors.length; k++) {
    const d = sim.doors[k];
    if (!leftOpen(sim, d) || sim.cast.some(q => q.door === k && q.state === 'shut' && !q.dead)) continue;
    const at = doorMid(d), dx = at.x - m.x, dz = at.z - m.z, dp = Math.hypot(dx, dz);
    /* not one it is at: that one it has just opened to go through */
    if (dp < LEFT.near || dp > LEFT.see || Math.abs(at.y - 1.2 - m.y) > 2.5 || (dx * Math.sin(m.yaw) + dz * Math.cos(m.yaw)) / (dp || 1) < 0.35) continue;
    if (!lit(sim, at.x, at.y, at.z) || sim.world.raycast(m.x, m.y + eye, m.z, at.x, at.y, at.z, seeThrough) < 0.97) continue;
    /* to its near side, a step back from the doorway */
    const o = 1.3, D = d.def, s = D.alongX ? Math.sign(m.z - at.z) || 1 : Math.sign(m.x - at.x) || 1;
    const spot = sim.fields.nav.locate(at.x + (D.alongX ? 0 : s * o), at.y - 1.2, at.z + (D.alongX ? s * o : 0));
    if (spot < 0) continue;
    const F = fieldTo(sim, m, spot);
    if (!Number.isFinite(F[m.spot])) continue;
    m.state = 'shut'; m.door = k; m.dest = spot; m.F = F; m.st = LEFT.look; m.stk = 0;
    step_(sim, m, 'mutter');
    return true;
  }
  return false;
}

/** somewhere near where it is searching (wx, wz), on its floor, to walk to next */
function searchSpot(sim: Sim, m: Mutant): number {
  const nav = sim.fields!.nav, near: number[] = [];
  for (let i = 0; i < nav.n; i++) {
    if (Math.abs(nav.y[i] - m.y) < 1 && Math.hypot(nav.x[i] - m.wx, nav.z[i] - m.wz) < SEARCH.reach && Math.hypot(nav.x[i] - m.x, nav.z[i] - m.z) > 1.5) near.push(i);
  }
  return near.length ? near[Math.floor(sim.rng.range(0, near.length))] : -1;
}

/** one of the staff that would answer an alarm: a husk on its rounds or its post, or on its way to one already */
export const free = (m: Mutant): boolean => !m.dead && m.ai === 'husk' && (m.state === 'idle' || m.state === 'round' || m.state === 'lurk' || m.state === 'answer') && m.spot >= 0;

/** the pace they go to an alarm at (m/s): a hurry; faster again with another of them in sight hurrying too, within
 *  `see` metres: one starts and the rest catch it */
const ANSWER = { pace: 2.6, caught: 3.4, see: 16 };

/** a zone alarm it hears (sim/eyes.ts): a husk not already after you leaves its rounds, or its post, and hurries to the
 *  speaker, as Security's staff were drilled to. The way there is the alarm's, copied: a round makes its next route in
 *  the one it has. */
export function answer(sim: Sim, m: Mutant, spot: number, route: Float32Array): void {
  if (!free(m)) return;
  if (m.state === 'answer' && m.dest === spot) return;
  if (!(route[m.spot] > 2.5)) return; // there already, or no way there
  step_(sim, m, 'mutter');
  m.state = 'answer'; m.post = false; m.dest = spot; m.F = Float32Array.from(route); m.wt = 0; m.stk = 0;
}

/** another of them hurrying to an alarm is in its sight: on its way, and going at a hurry's pace */
function hurried(sim: Sim, m: Mutant): boolean {
  const eye = Math.min(1.6, (m.body?.h ?? 1) * 0.85);
  for (const o of sim.cast) {
    if (o === m || o.dead || o.state !== 'answer' || !o.body || Math.hypot(o.body.vx, o.body.vz) < ANSWER.pace * 0.8) continue;
    if (Math.hypot(o.x - m.x, o.z - m.z) > ANSWER.see) continue;
    if (sim.world.raycast(m.x, m.y + eye, m.z, o.x, o.y + eye, o.z, seeThrough) >= 1) return true;
  }
  return false;
}

/* ---- the night round (world.md §8): one of the changed still walking the night shift's round, a stop at a time, its
   flashlight on. It is the one that walks the dark: its beam is what it sees by, so it keeps to its round lit or not. At
   a stop it stands and plays its beam about; at a door on its round it tries the reader with its card, which beeps green
   or red. Taken off its round (it saw you, an alarm, a breaker), it comes back to it where it left off. */

/** its pace on the round (m/s), slow: it is sedated as they all are; after you, slower than the rest; at a stop, how long
 *  it looks about if the stop does not say, how far its beam swings either way (radians) and how fast; between tries at a
 *  reader, and how far either way it sweeps its beam about a room it has opened, or one it has gone into to search; how
 *  far below level it holds the beam
 *  walking; and, drawn off a stop by a noise, how long it stands looking toward it first, its beam on it (sound before
 *  sight: the opening) */
export const ROUND = { pace: 1.0, hunt: 3.0, look: 2.5, sweep: 0.55, into: 0.5, about: 1.5, swing: 1.1, beep: 0.8, pitch: 0.14, roused: 4.5 };

/** the door a stop tries: the nearest within reach of it (not a pane of glass), or -1 */
function stopDoor(sim: Sim, P: RoundStop): number {
  let best = -1, bd = 2.6;
  sim.doors.forEach((d, k) => {
    if (d.def.glass) return;
    const at = doorMid(d), dd = Math.hypot(at.x - P.x, at.z - P.z);
    if (dd < bd && Math.abs(d.def.y0 - P.y) < 1) { bd = dd; best = k; }
  });
  return best;
}

/** it shows the door its card. A dark reader does nothing; a live one beeps, green if the card opens it (and the door
 *  lets it through, as any of the staff's), red if not. True if it opened */
function tryDoor(sim: Sim, m: Mutant, k: number): boolean {
  const d = sim.doors[k], at = doorMid(d);
  if (!d.def.card || power(sim.game, d.def.circuit) <= 0) return false;
  const ok = m.cards && carded(sim, d);
  d.beep = READER; d.beepOk = ok;
  sfx(sim.game, ok ? 'take' : 'deny', at);
  if (ok) { d.open = true; d.pass = Math.max(d.pass, 2.5 + (m.round?.[m.beat % m.round.length].look ?? 0)); }
  return ok;
}
/** how long a reader shows green or red after a card (s) */
export const READER = 0.8;

/** a stop it keeps now: one wanting a circuit live is passed by while it is dead, and one for the first time round only
 *  after that */
const keeps = (sim: Sim, m: Mutant, P: RoundStop) => (!P.need || power(sim.game, P.need) > 0) && (!P.once || m.lap === 0);

/** a step of its round: to the next stop it keeps, then a while there, looking about or at a reader */
function walkRound(sim: Sim, m: Mutant): void {
  const R = m.round!, Fs = sim.fields;
  if (!Fs || m.spot < 0 || !R.length) return;
  const P = R[m.beat % R.length];
  const next = () => { m.beat = (m.beat + 1) % R.length; if (m.beat === 0) m.lap++; m.dest = -1; m.wt = 0; m.st = 0; };
  /* stopped: the beam about, or held on the reader; then the card, as many times as the stop says */
  if (m.wt > 0) {
    const k = P.tries ? stopDoor(sim, P) : -1;
    if (P.graft && m.graft > 0) grafting(sim, m);
    else if (k >= 0) {
      /* at the reader; through a door it opened, its beam swept about the room, side to side */
      const at = doorMid(sim.doors[k]), to = Math.atan2(at.x - m.x, at.z - m.z), sweep = m.st <= 0 && sim.doors[k].open ? Math.sin(m.ph * ROUND.swing * 1.6) * ROUND.into : 0;
      m.yaw = angLerp(m.yaw, to + sweep, Math.min(1, dt * 4));
    } else if (P.about) m.yaw = angLerp(m.yaw, m.wm + Math.sin(m.ph * ROUND.swing * 0.8) * ROUND.about, Math.min(1, dt * 2.5)); // right round the room
    else m.yaw = angLerp(m.yaw, m.wm + Math.sin(m.ph * ROUND.swing) * ROUND.sweep, Math.min(1, dt * 3));
    if ((m.wt -= dt) > 0) return;
    if (P.take) {
      /* the other patient, where they hide: struck, and struck again, and then taken */
      const q = m.drag < 0 ? prey(sim, m) : undefined;
      if (q && m.st > 0) { m.st--; beginBlow(sim, m, MOVES.husk, q.id); m.wt = m.st > 0 ? BEAT.gap : BEAT.grab; return; }
      if (q) { take(sim, m, q); m.wt = P.wait ?? ROUND.look; return; }
    }
    if (m.st > 0 && k >= 0) {
      m.st--;
      /* green: it looks in, its beam into the room, a while; red: a moment, and again if it was to try again */
      if (tryDoor(sim, m, k)) { m.st = 0; m.wt = P.look ?? ROUND.beep; }
      else m.wt = ROUND.beep;
      return;
    }
    next();
    return;
  }
  if (m.dest < 0) {
    if (!keeps(sim, m, P)) { next(); return; }
    const k = Fs.nav.locate(P.x, P.y, P.z);
    if (k < 0) { next(); return; }
    /* one new route a step at most, across the whole cast */
    if (picked.get(sim) === sim.tick) return;
    picked.set(sim, sim.tick);
    m.F = fieldTo(sim, m, k);
    if (!Number.isFinite(m.F[m.spot])) { next(); return; }
    m.dest = k; m.stk = 0;
  }
  if (m.spot === m.dest || m.F![m.spot] < 0.9) {
    /* there: it stops, and looks about (or at the reader); and takes whoever is there to be taken */
    m.dest = -1; m.wm = m.yaw; m.st = P.take ? BEAT.blows : P.tries ?? 0;
    m.wt = P.tries ? P.wait ?? ROUND.beep : P.take ? BEAT.first : P.wait ?? ROUND.look;
    if (P.graft) graftHere(sim, m);
    if (m.wt <= 0) next();
    return;
  }
  if (follow(sim, m, m.F!, P.pace ?? ROUND.pace, false)) m.stk = 0;
  else if ((m.stk += dt) > 4) next(); // it cannot get there as things stand: on to the next
}

/** at a stop where it takes someone: how many times it strikes them first, the moment before the first, between them,
 *  and before it takes hold (s) */
export const BEAT = { blows: 2, first: 0.6, gap: 0.5, grab: 0.9 };

/** the other patient, near where it stops: there to be taken */
const prey = (sim: Sim, m: Mutant) => sim.cast.find(q => !q.dead && q.ai === 'patient' && q.state !== 'dragged' && Math.hypot(q.x - m.x, q.z - m.z) < 4 && Math.abs(q.y - m.y) < 1);

/** a blow of the night round's landing on the other patient: they are rocked by it, and bleed where they are (the pool
 *  is the sim's, so it is there however it is drawn: Sim.pools) */
function beaten(sim: Sim, q: Mutant): void {
  sfx(sim.game, 'struck', { x: q.x, y: q.y + 0.8, z: q.z });
  q.hit = 1; q.reel = 0.5;
  const P = sim.pools.find(p => !p.kind && Math.hypot(p.x - q.x, p.z - q.z) < 0.6);
  if (P) P.r = Math.min(1.4, P.r + 0.5);
  else sim.pools.push({ x: q.x, y: q.y, z: q.z, r: 0.8 });
}

/** the other patient, struck down: out cold (Pia's line: its touch is the opiate, world.md §10), and it takes them by an
 *  ankle and drags them from then on. Alive, and taken (world.md §8, the opening) */
function take(sim: Sim, m: Mutant, q: Mutant): void {
  m.yaw = Math.atan2(q.x - m.x, q.z - m.z); m.wm = m.yaw;
  sfx(sim.game, 'taken', { x: q.x, y: q.y + 1, z: q.z });
  slack(sim, q);
  q.state = 'dragged';
  m.drag = q.id; m.trail = 0;
}

/** out cold: loose, alive, no tone, and out of everyone's way (made again after a load, as a save does not say what is in
 *  the world) */
function slack(sim: Sim, q: Mutant): void {
  q.down = 1e9; q.rise = 0;
  if (!q.rag) q.rag = makeRag(q, null, true);
  if (q.rag) { q.rag.limp = true; q.rag.woke = sim.tick; }
  if (q.body) { const k = sim.world.dyn.indexOf(q.body.dyn); if (k >= 0) sim.world.dyn.splice(k, 1); }
}

/** the graft (world.md §8, the opening): where it stops with what it has dragged, it lets go, kneels over them and puts
 *  the leaf into their arm, which takes a while, the body jerking under it, the suite's lights stuttering (`stutters`)
 *  and the blood spreading round them. Then it leaves them there, out cold. `GRAFT`: how long it takes (s), how long it
 *  looks at its work after, and how often the body jerks; how hard */
export const GRAFT = { time: 6, after: 1.5, jerk: [0.25, 0.7] as const, J: 45 };
function graftHere(sim: Sim, m: Mutant): void {
  const q = sim.cast[m.drag];
  m.drag = -1;
  if (!q || q.dead) return;
  q.state = 'out'; q.grafted = true;
  if (q.rag) q.rag.pin = null;
  const at = q.rag ? ragAt(q.rag) : { x: q.x, y: q.y, z: q.z };
  m.wx = at.x; m.wz = at.z; m.st = 0.4;
  m.graft = GRAFT.time; m.wt = GRAFT.time + GRAFT.after;
  sfx(sim.game, 'graft', { x: at.x, y: at.y + 0.3, z: at.z });
}
/** a step of it: down over the body, its beam on it; the body jerking, and bleeding */
function grafting(sim: Sim, m: Mutant): void {
  m.yaw = angLerp(m.yaw, Math.atan2(m.wx - m.x, m.wz - m.z), Math.min(1, dt * 4));
  const q = sim.cast.find(o => o.grafted && o.state === 'out' && Math.hypot(o.x - m.wx, o.z - m.wz) < 2);
  if (!q?.rag) return;
  bleed(sim, q, 0.3);
  if ((m.st -= dt) > 0) return;
  m.st = sim.rng.range(GRAFT.jerk[0], GRAFT.jerk[1]);
  const B = bones(q.rag.kind), i = Math.floor(sim.rng.range(0, B.names.length - 0.001)), p = q.rag.p;
  knockRag(q.rag, { x: p[i * 3], y: p[i * 3 + 1], z: p[i * 3 + 2] }, { x: sim.rng.range(-0.4, 0.4), y: 1, z: sim.rng.range(-0.4, 0.4) }, GRAFT.J, sim.tick);
}

/** grafting: the suite's lights stutter hard while it does it (render/view.ts, the soundscape) */
export const stutters = (sim: Sim): boolean => sim.cast.some(m => m.graft > 0);

/** blood: a pool spreading under one of the cast where it lies (by `k` metres a second, to as big as a pool gets), and a
 *  smear where a body is dragged (`Sim.pools`; drawn in castView.ts, and walked through, render/prints.ts). Not without
 *  end */
export const BLOOD = { pool: 1.9, most: 220, smear: 0.55 };
function bleed(sim: Sim, q: Mutant, k: number): void {
  const at = q.rag ? ragAt(q.rag) : { x: q.x, y: q.y, z: q.z };
  const P = sim.pools.find(p => !p.kind && Math.hypot(p.x - at.x, p.z - at.z) < 0.7);
  if (P) P.r = Math.min(BLOOD.pool, P.r + k * dt);
  else if (sim.pools.length < BLOOD.most) sim.pools.push({ x: at.x, y: q.y, z: at.z, r: 0.3 });
}
function smear(sim: Sim, x: number, y: number, z: number, yaw: number): void {
  if (sim.pools.length < BLOOD.most) sim.pools.push({ x, y, z, r: 1, kind: 'smear', yaw });
}

/** you, in the opening, within its reach: weak from the days under and nothing in your hands, you are taken as the other
 *  patient was (world.md §8, The opening). The rest of the game it fights as the others do; and not in god mode */
function takesYou(sim: Sim, m: Mutant): boolean {
  const O = sim.opening;
  if (!m.round || !m.torch || !O || O.phase === 'done' || sim.game.ended || sim.game.god) return false;
  const b = sim.player.body;
  m.yaw = Math.atan2(b.x - m.x, b.z - m.z);
  sfx(sim.game, 'taken', { x: b.x, y: b.y + 1, z: b.z });
  end(sim.game, false, 'Its hand closes on your ankle, and where it touches you, you go slack. You are still awake when it starts to drag you.');
  return true;
}

/** dragged by the ankle: its foot in the night round's hand, low behind it, and the rest of it after, on the floor, as
 *  the loose body goes (sim/ragdoll.ts): where it is is where its middle is. It bleeds as it goes, and leaves a smear */
const DRAG = { hand: [0.3, -0.3, 0.42] as const };
function dragged(sim: Sim, m: Mutant): void {
  const d = sim.cast.find(q => q.drag === m.id && !q.dead);
  if (!d || !m.body) return;
  const s = Math.sin(d.yaw), c = Math.cos(d.yaw), [rx, fz, hy] = DRAG.hand;
  /* its right is (cos, -sin) of where it faces (sin, cos) */
  const hx = d.x + rx * c + fz * s, hz = d.z - rx * s + fz * c;
  if (m.rag) { m.rag.pin = { i: bones(m.model).at.footR, x: hx, y: d.y + hy, z: hz }; m.rag.awake = true; m.rag.still = 0; }
  lies(sim, m);
  if ((m.trail += Math.hypot(d.x - d.px, d.z - d.pz)) >= BLOOD.smear) { m.trail = 0; smear(sim, m.x, m.y, m.z, d.yaw); }
}
/** out cold where it lies: its body kept with its loose body's middle, out of everyone's way (made again after a load,
 *  as a save does not say what is in the world) */
function lies(sim: Sim, m: Mutant): void {
  const b = m.body!, k = sim.world.dyn.indexOf(b.dyn);
  if (k >= 0) sim.world.dyn.splice(k, 1);
  if (m.rag) { const at = ragAt(m.rag); b.x = m.x = at.x; b.z = m.z = at.z; b.y = m.y = Math.max(at.y, m.y - 0.5); }
  b.vy = 0; b.vx = b.vz = 0; b.sync();
}

/** the other patient (world.md §8, the opening): at its window, still, until it sees you wake; then banging on the glass
 *  to you, which carries. When that draws the night round's beam onto the hall it stops, points up at it for you, and
 *  crouches under its window: what to fear, and what to do, shown without a word. Found anyway (its door takes a guard's
 *  card), it is struck down where it hides, dragged out and grafted, and left out cold. `BANG`: how often it strikes the glass (s), how far the sound carries
 *  (m); how long it points */
export const BANG = { every: [0.55, 0.95] as const, loud: 40, least: 2.5, warn: 2.8 };
function patient(sim: Sim, m: Mutant): void {
  const b = sim.player.body;
  /* its door opening, early: down at once */
  const opened = sim.doors.some(d => d.t > 0.3 && !d.def.glass && !d.def.open && Math.hypot((d.def.x0 + d.def.x1) / 2 - m.x, (d.def.z0 + d.def.z1) / 2 - m.z) < 3);
  if (opened && (m.state === 'wait' || m.state === 'bang' || m.state === 'warn')) m.state = 'hide';
  const face = (x: number, z: number, k = 3) => { m.yaw = angLerp(m.yaw, Math.atan2(x - m.x, z - m.z), Math.min(1, dt * k)); };
  const to = (P: { x: number; z: number } | null) => !P || Math.hypot(P.x - m.x, P.z - m.z) < 0.25 || (go(sim, m, P.x, P.z, 1.3), m.mv = 1.3, false);
  switch (m.state) {
    case 'bang': {
      /* at the glass, toward you: struck, and struck again, until the noise brings something; and a moment more, the time
         it takes to see the beam come on to the hall (m.tense: it has been heard) */
      face(b.x, b.z);
      m.st += dt;
      if (m.tense && m.st > BANG.least) { m.state = 'warn'; m.st = BANG.warn; break; }
      if ((m.wt -= dt) > 0) break;
      m.wt = sim.rng.range(BANG.every[0], BANG.every[1]);
      const at = { x: m.x + Math.sin(m.yaw) * 0.5, y: m.y + 1.4, z: m.z + Math.cos(m.yaw) * 0.5 };
      sfx(sim.game, 'bang', at);
      if (noiseAt(sim, at.x, m.y, at.z, BANG.loud)) m.tense = 1;
      break;
    }
    case 'warn':
      /* it has seen the beam: still, to you, pointing up at it */
      face(b.x, b.z);
      if ((m.st -= dt) <= 0) m.state = 'hide';
      break;
    case 'hide': {
      /* down under its window, as small as it can make itself, turned to its door */
      if (!to(m.hide)) break;
      const d = sim.doors.find(q => !q.def.glass && !q.def.open && Math.hypot((q.def.x0 + q.def.x1) / 2 - m.x, (q.def.z0 + q.def.z1) / 2 - m.z) < 4);
      if (d) face((d.def.x0 + d.def.x1) / 2, (d.def.z0 + d.def.z1) / 2, 2);
      break;
    }
    case 'dragged':
      dragged(sim, m);
      break;
    case 'out':
      /* out cold where it was left, grafted, bleeding a while yet */
      lies(sim, m);
      bleed(sim, m, 0.012);
      break;
  }
}

/** a sound made somewhere, not by you (the other patient banging): heard by each of the cast it carries to as the air goes
 *  (shut doors muffle it), within `loud` metres. One on its round at a stop turns to it, its beam on it, a while, and then
 *  goes on with its round; one at rest, on the same floor, goes over to look (world.md §8: noise draws them). True if any
 *  on its round heard it */
export function noiseAt(sim: Sim, x: number, y: number, z: number, loud: number): boolean {
  const Fs = sim.fields;
  if (!Fs) return false;
  const spot = Fs.nav.locate(x, y, z);
  if (spot < 0) return false;
  const heard = fieldFrom(Fs.nav, spot, soundRules(sim, Fs), undefined, loud);
  let roused = false;
  for (const m of sim.cast) {
    if (m.dead || m.stun > 0 || m.spot < 0 || m.ai !== 'husk' || !(heard[m.spot] < loud)) continue;
    if (m.state === 'round' && m.wt > 0 && m.st <= 0) {
      if (m.wt > ROUND.roused) { m.wt = ROUND.roused; m.wm = Math.atan2(x - m.x, z - m.z); }
      roused = true;
    } else if (m.state === 'idle' && !m.round && Math.abs(y - m.y) < 1.5) {
      step_(sim, m, 'mutter');
      m.state = 'search'; m.st = rnd(sim, SEARCH.time[0], SEARCH.time[1]); m.dest = -1; m.wx = x; m.wz = z; m.wt = 0; m.post = false;
    }
  }
  return roused;
}

/** seen where it cannot get to you (behind the glass of a room whose door will not take its card): the night round comes
 *  to the glass and looks in at you a while, then goes on with its round. `PEER`: how long it looks, how near the glass it
 *  stands, how long before it will do so again, how near you a door it has yet to try is yours (m), and how many of its
 *  stops ahead it looks for one */
export const PEER = { look: 5, off: 0.55, again: 25, near: 6, ahead: 6 };

/** a door beside you is still to be tried on its round: at the stop it is at (tries left), or one of the next several */
function triesYours(sim: Sim, m: Mutant): boolean {
  const R = m.round!, b = sim.player.body;
  for (let k = 0; k < PEER.ahead; k++) {
    const P = R[(m.beat + k) % R.length];
    if (!P.tries || (k === 0 && m.dest < 0 && m.st <= 0 && m.wt > 0)) continue; // that one tried, and done with
    const d = stopDoor(sim, P);
    if (d >= 0 && Math.hypot((sim.doors[d].def.x0 + sim.doors[d].def.x1) / 2 - b.x, (sim.doors[d].def.z0 + sim.doors[d].def.z1) / 2 - b.z) < PEER.near) return true;
  }
  return false;
}

/** can it get to where you are, as the doors stand, with its card? */
function reaches(sim: Sim, m: Mutant): boolean {
  const Fs = sim.fields;
  if (!Fs || m.spot < 0 || Fs.from < 0) return false;
  if (Number.isFinite(Fs.hands[m.spot])) return true;
  if (m.cards && m.walker === 'hands') return Number.isFinite(staffField(sim, Fs)[m.spot]);
  return Number.isFinite(fieldFrom(Fs.nav, Fs.from, rulesFor(sim, Fs, m.walker, m.cards), undefined, 90)[m.spot]);
}

/** the pane nearest it between it and you, and the spot on its own side of it to look in from; or where it stands */
function glassSpot(sim: Sim, m: Mutant): { x: number; z: number } {
  const b = sim.player.body;
  let best: { x: number; z: number } | null = null, bd = 4;
  for (const d of sim.doors) {
    const D = d.def;
    if (!D.glass || Math.abs(D.y0 - m.y) > 1.5) continue;
    const cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2, dd = Math.hypot(cx - m.x, cz - m.z);
    if (dd > bd) continue;
    /* its side of the pane, toward you across it */
    const nx = D.alongX ? 0 : Math.sign(m.x - cx) || 1, nz = D.alongX ? Math.sign(m.z - cz) || 1 : 0;
    if ((b.x - cx) * nx + (b.z - cz) * nz > 0) continue; // you are on its side: no pane between
    bd = dd; best = { x: cx + nx * PEER.off, z: cz + nz * PEER.off };
  }
  return best ?? { x: m.x, z: m.z };
}

/** its flashlight: from its lens, in its left hand held out before it, along where it looks. Walking it holds the beam
 *  a little down the way ahead; after you, or looking in at you, on you. Drawn (castView.ts) from the same numbers */
export const TORCH = { shoulder: [-0.27, 1.46] as const, arm: 0.66, lead: 0.06 };
export function torchRay(sim: Sim, m: Mutant): { x: number; y: number; z: number; dx: number; dy: number; dz: number; pitch: number } {
  const b = sim.player.body;
  let pitch = ROUND.pitch;
  if (m.state === 'hunt' || m.state === 'peer') {
    const d = Math.max(0.5, m.dp);
    pitch = clamp(Math.atan2(m.y + TORCH.shoulder[1] - (b.y + 1.1), d), -0.6, 0.9);
  } else if (m.graft > 0) pitch = clamp(Math.atan2(TORCH.shoulder[1] - 0.6, Math.max(0.4, Math.hypot(m.wx - m.x, m.wz - m.z))), 0, 1.1); // down on what it grafts
  const s = Math.sin(m.yaw), c = Math.cos(m.yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const [ox, oy] = TORCH.shoulder, L = TORCH.arm + TORCH.lead; // the beam from just past the lens
  /* its own right is (cos, -sin) of where it faces (sin, cos); the shoulder to its left, the hand out along the beam */
  const x = m.x + ox * c + s * cp * L, z = m.z - ox * s + c * cp * L, y = m.y + oy - sp * L;
  return { x, y, z, dx: s * cp, dy: -sp, dz: c * cp, pitch };
}

const AI: Record<Ai, (sim: Sim, m: Mutant) => void> = {
  husk(sim, m) {
    const F = sim.fields?.hands, d = m.d;
    if (m.round) m.peered += dt;
    switch (m.state) {
      case 'idle': {
        if (notices(sim, m) || noticesDoor(sim, m)) break;
        /* one with a round goes back to it, where it left off */
        if (m.round) { m.state = 'round'; m.dest = -1; m.wt = 0; m.st = 0; break; }
        if (!m.post) roam(sim, m, 1.3);
        break;
      }
      case 'round': {
        if (blowStep(sim, m)) break;
        if (notices(sim, m) || noticesDoor(sim, m)) break;
        walkRound(sim, m);
        break;
      }
      case 'peer': {
        /* at the glass, its face to it, looking in at you; then on with its round, past the stop it was at */
        m.peered = 0;
        if (Math.hypot(m.wx - m.x, m.wz - m.z) > 0.15) go(sim, m, m.wx, m.wz, ROUND.pace);
        else turnTo(sim, m, 3);
        if ((m.st -= dt) > 0) break;
        const R = m.round!, P = R[m.beat % R.length];
        if (P.tries) { m.beat = (m.beat + 1) % R.length; if (m.beat === 0) m.lap++; }
        m.state = 'round'; m.dest = -1; m.wt = 0; m.st = 0;
        break;
      }
      case 'answer': {
        /* to the alarm, in a hurry; there, it stands and looks about a while before its rounds again */
        if (notices(sim, m)) break;
        if (!m.F || m.dest < 0 || m.spot === m.dest || m.F[m.spot] < 1.5) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 6, 12); break; }
        if (follow(sim, m, m.F, hurried(sim, m) ? ANSWER.caught : ANSWER.pace, false)) m.stk = 0;
        else if ((m.stk += dt) > 3) { m.stk = 0; m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); }
        break;
      }
      case 'fix': {
        /* a drill: the lights went, so to the board, and the breaker back on (drill(), below) */
        if (notices(sim, m)) break;
        const D = sim.drills.find(q => q.spot === m.dest);
        if (!D || !m.F || m.dest < 0 || !Number.isFinite(m.F[m.spot])) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); break; }
        if (m.spot === m.dest || m.F[m.spot] < 1.5) {
          turnTo(sim, m, 6);
          if ((m.st -= dt) <= 0) {
            /* back on; and someone threw it. It turns from the board and looks about for who */
            restore(sim, D);
            m.state = 'search'; m.st = rnd(sim, SEARCH.time[0], SEARCH.time[1]); m.dest = -1; m.wx = m.x; m.wz = m.z;
            m.wt = rnd(sim, SEARCH.look[0], SEARCH.look[1]); m.wm = m.yaw + Math.PI;
          }
          break;
        }
        m.st = 1.2;
        if (follow(sim, m, m.F, 1.6, false)) m.stk = 0; // to the board, slowly
        else if ((m.stk += dt) > 4) { m.stk = 0; m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); }
        break;
      }
      case 'shut': {
        /* to a door it saw left open: there, it looks through a moment, then shuts it, if it still stands open */
        if (notices(sim, m)) { m.door = -1; break; }
        const d = sim.doors[m.door];
        const done = (wt: number) => { m.state = 'idle'; m.door = -1; m.dest = -1; m.wt = wt; };
        if (!d || !leftOpen(sim, d) || !m.F || m.dest < 0) { done(rnd(sim, 2, 4)); break; }
        if (m.spot === m.dest || m.F[m.spot] < 1.2) {
          const at = doorMid(d);
          m.yaw = angLerp(m.yaw, Math.atan2(at.x - m.x, at.z - m.z), Math.min(1, dt * 4));
          if ((m.st -= dt) > 0) break;
          if (occupied(d, riders(sim))) { m.st = 0.5; break; }
          if (d.def.kind !== 'heavy' || power(sim.game, d.def.circuit) >= 2) { d.open = false; sfx(sim.game, 'door', { ...at, y: d.def.y0 }); }
          done(rnd(sim, 3, 6));
          break;
        }
        if (follow(sim, m, m.F, LEFT.pace, false)) m.stk = 0;
        else if ((m.stk += dt) > 3) done(rnd(sim, 2, 4));
        break;
      }
      case 'search': {
        if (notices(sim, m) || (seeP(sim, m, SEARCH.see) && hunt(sim, m))) break;
        if ((m.st -= dt) <= 0) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); break; }
        /* stopped, looking round: it turns to look one way, slowly */
        if (m.wt > 0) { m.wt -= dt; m.yaw = angLerp(m.yaw, m.wm, Math.min(1, dt * 1.6)); break; }
        if (m.dest < 0 || !m.F) {
          const k = searchSpot(sim, m);
          if (k < 0) { m.wt = 1; break; }
          m.F = fieldTo(sim, m, k);
          if (!Number.isFinite(m.F[m.spot])) { m.F = null; m.wt = 1; break; }
          m.dest = k;
        }
        if (m.spot === m.dest || m.F[m.spot] < 1.2) { m.dest = -1; m.wt = rnd(sim, SEARCH.look[0], SEARCH.look[1]); m.wm = m.yaw + rnd(sim, -2.2, 2.2); break; }
        if (follow(sim, m, m.F, SEARCH.pace, false)) m.stk = 0;
        else if ((m.stk += dt) > 2) { m.stk = 0; m.dest = -1; m.wt = 1; }
        break;
      }
      case 'hunt':
        if (blowStep(sim, m)) break;
        if (m.hp < m.max * 0.4 && !m.fled && d > 2.8) { m.state = 'flee'; m.st = 7; m.fled = true; step_(sim, m, 'moan'); break; }
        if (seeP(sim, m, 22)) m.lost = 0; else m.lost += dt;
        if (m.lost > 8) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 5); break; }
        if (inStart(m, MOVES.husk) && takesYou(sim, m)) break;
        if (inStart(m, MOVES.husk)) { turnTo(sim, m, 10); if (m.cd <= 0) { beginBlow(sim, m, MOVES.husk); m.pat = 0; } }
        else if (waits(sim, m)) { m.pat += dt; hover(sim, m, WAIT.ring); }
        /* one that carries its card comes through the card doors between, if that is the way to you */
        else if (F) chase(sim, m, m.round ? ROUND.hunt : 3.5, m.cards && !Number.isFinite(F[m.spot]) && sim.fields ? staffField(sim, sim.fields) : F);
        break;
      case 'flee':
        m.st -= dt;
        away(sim, m, 4.2, F);
        if (m.st < 0) { m.state = 'lurk'; m.st = rnd(sim, 14, 22); m.dest = -1; m.wt = 0; }
        break;
      case 'lurk':
        m.st -= dt;
        roam(sim, m, 1.6);
        if (m.st < 0) { m.state = 'idle'; m.hp = Math.min(m.max, m.hp + 20); m.fled = false; }
        break;
    }
    if (m.mv > 0 && (m.tk -= dt) < 0) { m.tk = m.mv > 2 ? 0.3 : 0.58; step_(sim, m, 'hstep'); }
  },

  skitter(sim, m) {
    const big = m.big, F = sim.fields?.crawl;
    if (m.state === 'idle') {
      if (seeP(sim, m, big ? 18 : 14) || hears(sim, m)) { m.state = 'hunt'; m.lost = 0; m.bt = 0; step_(sim, m, 'skit'); return; }
      m.wt -= dt;
      if (m.wt < 0) { m.wt = rnd(sim, 2, 7); m.wx = m.hx + rnd(sim, -3, 3); m.wz = m.hz + rnd(sim, -3, 3); m.wm = rnd(sim, 0.3, 0.8); }
      if (m.wm > 0) {
        m.wm -= dt;
        go(sim, m, m.wx, m.wz, big ? 2 : 3);
        if (m.mv && (m.tk -= dt) < 0) { m.tk = big ? 0.2 : 0.11; step_(sim, m, 'tap', big); }
      }
      return;
    }
    if (blowStep(sim, m)) return;
    if (seeP(sim, m, big ? 24 : 18)) m.lost = 0; else m.lost += dt;
    if (m.lost > 9) { m.state = 'idle'; return; }
    m.bt -= dt;
    if (m.bt <= 0) { m.burst = !m.burst; m.bt = m.burst ? rnd(sim, 0.4, 0.9) : rnd(sim, 0.1, 0.4); }
    const K = blowKind(m)!;
    if (inStart(m, K)) { turnTo(sim, m, 6); if (m.cd <= 0) beginBlow(sim, m, K); }
    else if (m.burst && F) {
      chase(sim, m, big ? 4.3 : 5, F);
      if (m.mv && (m.tk -= dt) < 0) { m.tk = big ? 0.16 : 0.09; step_(sim, m, 'tap', big); }
    }
  },

  bloat(sim, m) {
    if (m.sit) return;
    m.wt -= dt;
    if (m.wt < 0) { m.wt = rnd(sim, 9, 18); roomWp(sim, m); m.wm = rnd(sim, 5, 10); }
    if (m.wm > 0) {
      m.wm -= dt;
      go(sim, m, m.wx, m.wz, 0.55);
      if (m.mv && (m.tk -= dt) < 0) { m.tk = 1.1; step_(sim, m, 'hstep', true); }
    }
  },

  thresher(sim, m) {
    const p = sim.player, b = p.body, d = m.d;
    switch (m.state) {
      case 'idle': case 'patrol':
        if (seeP(sim, m, 16) || (hears(sim, m) && sight(sim, m))) { m.state = 'wind'; m.st = 0.75; step_(sim, m, 'roar'); break; }
        /* it charges about its room now and then */
        m.ct -= dt;
        if (m.ct < 0) { m.ct = rnd(sim, 7, 15); m.cdir = rnd(sim, TAU); m.tgt = false; m.state = 'charge'; m.st = rnd(sim, 1, 2.2); step_(sim, m, 'roar', true); break; }
        m.wt -= dt;
        if (m.wt < 0) { m.wt = rnd(sim, 4, 9); roomWp(sim, m); }
        go(sim, m, m.wx, m.wz, 1.2);
        if (m.mv && (m.tk -= dt) < 0) { m.tk = 0.62; step_(sim, m, 'hstep', true); }
        break;
      case 'wind':
        turnTo(sim, m, 6);
        m.st -= dt;
        if (m.st < 0) { m.state = 'charge'; m.st = 3; m.tgt = true; m.cdir = Math.atan2(b.x - m.x, b.z - m.z); }
        break;
      case 'charge': {
        if (m.tgt) { const want = Math.atan2(b.x - m.x, b.z - m.z), da = ((want - m.cdir + PI) % TAU + TAU) % TAU - PI; m.cdir += clamp(da, -1.3 * dt, 1.3 * dt); }
        m.st -= dt;
        if ((m.tk -= dt) < 0) { m.tk = 0.16; step_(sim, m, 'hstep', true); }
        if (m.dp < m.r + 0.55 && Math.abs(m.dy) < 1.4) {
          strikes(sim, m, 45, 60, 0, 9);
          /* it throws you: 9 m/s along its charge, whatever you were doing */
          p.body.vx = 0; p.body.vz = 0; push(p.body, Math.sin(m.cdir) * 9, Math.cos(m.cdir) * 9);
          m.state = 'recover'; m.st = 1.6;
          break;
        }
        const ok = chargeMove(sim, m, 7.4);
        if (!ok) { step_(sim, m, 'thud'); if (d < 10) sim.game.events.push({ type: 'shake', k: 0.3 }); m.state = 'recover'; m.st = 1.4; }
        else if (m.st < 0) { m.state = 'recover'; m.st = 0.8; }
        break;
      }
      case 'recover':
        m.st -= dt;
        if (m.st < 0) {
          if (seeP(sim, m, 18)) { m.state = 'wind'; m.st = 0.5; step_(sim, m, 'roar'); }
          else { m.state = 'pursue'; m.st = m.tgt ? 7 : 0; }
        }
        break;
      case 'pursue':
        if (blowStep(sim, m)) break;
        m.st -= dt;
        if (m.st < 0) { m.state = 'patrol'; break; }
        if (seeP(sim, m, 18) && d > 3.5) { m.state = 'wind'; m.st = 0.5; step_(sim, m, 'roar'); break; }
        if (inStart(m, MOVES.thresher)) { turnTo(sim, m, 4); if (m.cd <= 0) beginBlow(sim, m, MOVES.thresher); }
        else if (sim.fields) chase(sim, m, 2.6, sim.fields.big);
        break;
    }
  },

  worm(sim, m) {
    const g = sim.game, F = sim.fields?.crawl, d = m.d;
    if (m.flee > 0) { m.flee -= dt; away(sim, m, 2.6); return; }
    const flash = g.lightOn && g.light === 'flash', lamp = g.lightOn && g.light === 'lantern';
    /* the light puts it off, its reach too */
    if ((d < 10 && flash && inBeam(sim, m)) || (d < 4.5 && lamp)) { m.blow = null; away(sim, m, 1.5); return; }
    if (blowStep(sim, m)) return;
    if (d < 5 || (d < 13 && sight(sim, m))) {
      if (inStart(m, MOVES.worm)) {
        if (sim.wormN >= 2) { turnTo(sim, m, 8); if (m.cd <= 0) beginBlow(sim, m, MOVES.worm); }
        else sayOnce(g, 'touched', 'It only touches you. Its hand is warm.');
      } else if (F) chase(sim, m, 1.25, F);
      return;
    }
    m.wt -= dt;
    if (m.wt < 0) { m.wt = rnd(sim, 3, 9); m.wx = m.hx + rnd(sim, -2, 2); m.wz = m.hz + rnd(sim, -2, 2); m.wm = rnd(sim, 1, 3); }
    if (m.wm > 0) { m.wm -= dt; go(sim, m, m.wx, m.wz, 0.5); }
  },

  /* the ones that went into the water. light draws them. */
  swimmer(sim, m) {
    const g = sim.game, lamp = g.lightOn && g.light === 'lantern', F = sim.fields?.crawl;
    if (m.flee > 0) { m.flee -= dt; away(sim, m, 3); return; }
    if (blowStep(sim, m)) return;
    if (m.d < (lamp ? 22 : 9)) {
      if (inStart(m, MOVES.swimmer)) { turnTo(sim, m, 8); if (m.cd <= 0) beginBlow(sim, m, MOVES.swimmer); }
      else if (F) {
        chase(sim, m, 2.5, F);
        if (m.mv && (m.tk -= dt) < 0) { m.tk = 0.5; step_(sim, m, 'slosh'); }
      }
      return;
    }
    m.wt -= dt;
    if (m.wt < 0) { m.wt = rnd(sim, 3, 8); m.wx = m.hx + rnd(sim, -5, 5); m.wz = m.hz + rnd(sim, -2, 2); m.wm = rnd(sim, 2, 5); }
    if (m.wm > 0) { m.wm -= dt; go(sim, m, m.wx, m.wz, 0.9); }
  },

  /* the arms are bait. the thing is the head on the wall above them. */
  grabber(sim, m) {
    if (m.grab > 0) m.grab -= dt;
    if (m.dp < 1.5 && Math.abs(m.dy) < 2 && sight(sim, m)) {
      if (m.tense === 0) step_(sim, m, 'skit');
      m.tense += dt;
      if (m.tense > 0.8 && m.cd <= 0) {
        m.cd = 2.4; m.grab = 1; m.tense = 0.01;
        strikes(sim, m, 20, 10);
        sim.player.slow = 1.4;
        sayOnce(sim.game, 'grab', 'The arms are only arms. Whatever is holding on is above them.');
      }
    } else m.tense = Math.max(0, m.tense - dt * 2);
  },
  patient,
};

/* Power-failure drill (world.md §8). The staff were drilled for a dead circuit as for an alarm, and habit is what they have
   left: those caught in the dark when a breaker goes may go to its board and throw it back on. Each one caught has a fair
   chance to go at once, so a crowd nearly always sends someone and one alone may not; any other who is still in the dark
   later goes, its odds climbing until, three minutes on, it surely would. One who reaches the light has stopped noticing.
   That is the whole of their wit: a habit and a hand. They do not hunt whoever did it, cut anything, or mend a cut cable. */
export interface Drill {
  c: string;
  /** the board: where its breaker is, and the spot to stand at it */
  x: number; y: number; z: number; spot: number;
  /** seconds since it went */
  t: number;
  /** each one caught in the dark (its id), and when it would go */
  due: { id: number; at: number }[];
}
const DRILL = { now: 0.25, quick: [1.5, 4], last: 180, first: 30 };

/** does circuit `rc` take its power through `c`? */
function fedBy(sim: Sim, rc: string, c: string): boolean {
  const C = sim.game.station?.circuits;
  for (let k = rc, n = 0; k && n < 8; k = C?.[k]?.feed ?? '', n++) if (k === c) return true;
  return false;
}
const caught = (m: Mutant) => m.ai === 'husk' && !m.dead && !m.post && m.state !== 'hunt' && m.state !== 'fix';

/** a breaker opened by hand at (x, y, z): who it leaves in the dark, and when each would go to throw it back */
export function drill(sim: Sim, c: string, x: number, y: number, z: number): void {
  const F = sim.fields;
  if (!F) return;
  sim.drills = sim.drills.filter(D => D.c !== c);
  sim.lighting = null;
  const due: Drill['due'] = [];
  for (const m of sim.cast) {
    if (!caught(m)) continue;
    const R = sim.world.roomAt(m.x, m.y + 0.5, m.z);
    if (!R || !fedBy(sim, R.circuit, c) || lit(sim, m.x, m.y + 1, m.z)) continue;
    const at = sim.rng.chance(DRILL.now) ? sim.rng.range(DRILL.quick[0], DRILL.quick[1]) : DRILL.first + (DRILL.last - DRILL.first) * Math.sqrt(sim.rng.range(0, 1));
    due.push({ id: m.id, at });
  }
  const spot = F.nav.locate(x, y - 1.3, z);
  if (due.length && spot >= 0) sim.drills.push({ c, x, y, z, spot, t: 0, due });
}

/** the breaker back on: heard, and the light with it */
function restore(sim: Sim, D: Drill): void {
  const C = sim.game.station?.circuits[D.c], g = sim.game;
  sim.drills = sim.drills.filter(q => q !== D);
  if (!C || C.on || C.broken) return;
  C.on = true;
  g.events.push({ type: 'power', loud: false });
  sfx(g, 'clang', { x: D.x, y: D.y, z: D.z });
  const b = sim.player.body;
  if (Math.hypot(b.x - D.x, b.z - D.z) < 24) sayOnce(g, 'drill', 'Somewhere close, a breaker slams home. They remember that much.');
}

function updateDrills(sim: Sim): void {
  for (const D of [...sim.drills]) {
    const C = sim.game.station?.circuits[D.c];
    if (!C || C.on) { sim.drills = sim.drills.filter(q => q !== D); continue; }
    D.t += dt;
    for (const e of D.due) {
      const m = sim.cast[e.id];
      if (e.at < 0 || D.t < e.at) continue;
      e.at = -1;
      /* still in the dark, and free to go: to the board, if it can get there */
      if (!m || !caught(m) || lit(sim, m.x, m.y + 1, m.z) || m.spot < 0 || !sim.fields) continue;
      const F = fieldTo(sim, m, D.spot);
      if (!Number.isFinite(F[m.spot])) continue;
      step_(sim, m, 'mutter');
      m.state = 'fix'; m.post = false; m.dest = D.spot; m.F = F; m.st = 1.2; m.stk = 0;
    }
    D.due = D.due.filter(e => e.at >= 0);
  }
}

/** a step of everything alive */
export function updateCast(sim: Sim): void {
  updateDrills(sim);
  sim.front = frontOf(sim);
  const b = sim.player.body, Fs = sim.fields;
  let wn = 0;
  for (const m of sim.cast) if (m.ai === 'worm' && !m.dead && m.flee <= 0 && m.dp < 2.6) wn++;
  sim.wormN = wn;
  for (const m of sim.cast) {
    m.px = m.x; m.py = m.y; m.pz = m.z;
    if (m.hit > 0) m.hit = Math.max(0, m.hit - dt * 4);
    m.calm += dt;
    m.poise = regain(m.poise, m.pmax, m.calm, dt);
    if (m.reel > 0) m.reel = Math.max(0, m.reel - dt);
    if (m.graft > 0) m.graft = Math.max(0, m.graft - dt);
    /* on the floor, then getting up */
    if (m.down > 0) { m.down = Math.max(0, m.down - dt); if (m.down === 0) m.rise = DOWN.rise; }
    else if (m.rise > 0) m.rise = Math.max(0, m.rise - dt);
    /* up again: its body is its own once more */
    if (m.rag && !m.dead && m.down === 0 && m.rise === 0) m.rag = null;
    if (m.dead) { if (m.gone < 1) m.gone = Math.min(1, m.gone + dt * 2.5); continue; }
    /* one being dragged, or out cold, is put where its loose body is (dragged(), lies(), below): its own feet, falls and
       footing are not asked */
    const towed = m.state === 'dragged' || m.state === 'out';
    const mb = towed ? null : m.body, resting = !!mb && m.still > 2 && mb.ground && mb.vy === 0 && !mb.on, ox = mb?.x, oz = mb?.z;
    if (mb) {
      if (!resting) settle(sim.world, mb);
      m.x = mb.x; m.y = mb.y; m.z = mb.z;
      if (Fs && !m.ride) { const s = Fs.nav.locate(mb.x, mb.y, mb.z); if (s >= 0) m.spot = s; }
    }
    m.cd -= dt;
    const dx = b.x - m.x, dz = b.z - m.z;
    m.dy = b.y - m.y;
    m.dp = Math.hypot(dx, dz);
    m.d = Math.hypot(dx, dz, m.dy);
    m.mv = 0;
    m.ph += dt;
    m.drove = false;
    if (m.stun > 0) m.stun -= dt;
    else AI[m.ai](sim, m);
    /* nothing it did moved it this step (it stands, winds up, reels, lies there): it comes to a stop on its own feet,
       or, faster than it would go, by friction; what it meets meanwhile, it shoves */
    if (mb && !m.dead && !m.drove) drive(sim, m, 0, 0);
    if (mb) mb.carried = false;
    if (m.dead) continue;
    if (mb) {
      /* a body that has stood still on firm ground for a few steps stays where it is: its weight would only put it back */
      const moved = mb.x !== ox || mb.z !== oz;
      /* a fall hurts it as one hurts you */
      if (moved || !resting) { const { impact } = fall(sim.world, mb, dt); if (impact > FALL.min) battered(sim, m, impact - FALL.min, FALL); }
      m.still = moved ? 0 : m.still + 1;
      m.x = mb.x; m.y = mb.y; m.z = mb.z;
    }
    if (sim.game.ended) return;
  }
}

/** what slows one of the cast that something shoved (m/s²): sent back at 4 m/s, it goes about 0.3 m */
const FRICTION = 28;

/** a blow that catches one open, recovering from its own: it hurts more, and takes more of its poise */
const OPEN = { dmg: 1.25, poise: 1.6 };
/** how long a flinch holds it, and a stagger (s); longer caught open */
const HOLD = { flinch: 0.2, stagger: 0.9 };

/** what a hit carries: the harm, the poise it takes, and the shove it gives (kg m/s), all as stood still; the way the
 *  shove goes, if not straight away from you; and what struck, for the hit log */
export interface Hit {
  dmg: number; poise: number; shove?: number; dir?: { x: number; z: number }; by?: string;
  /** where it landed, and the way what struck was going there: what a body killed by it goes loose with */
  at?: V3; way?: V3;
}

/** something hit it: a blow or a shot, landing `k` times as hard as one stood still (sim/moves.ts, closing). It is
 *  shoved away from you by what it weighs: a worm is thrown, a husk sent back a step, a thresher rocked, a bloat not
 *  moved at all. */
export function hitMutant(sim: Sim, m: Mutant, w: Hit, k = 1): void {
  const g = sim.game, p = sim.player.body, ph = m.blow?.ph, open = ph === 'after';
  /* on the floor, it takes a blow harder, and has no footing left to lose */
  if (m.down > 0) k *= DOWN.more;
  m.hp -= w.dmg * k * (open ? OPEN.dmg : 1);
  m.hit = Math.max(m.hit, Math.min(1, k));
  sfx(g, 'hit');
  let v = 0, ux = 0, uz = 0;
  if (m.body && w.shove) {
    const dx = m.x - p.x, dz = m.z - p.z, d = Math.hypot(dx, dz) || 1;
    v = Math.min(SHOVE.most, (w.shove * k) / m.body.mass);
    ux = w.dir ? w.dir.x : dx / d; uz = w.dir ? w.dir.z : dz / d;
    if (v > 0) { m.body.vx += ux * v; m.body.vz += uz * v; }
  }
  const said = (r: string) => log(g, `${w.by ?? 'blow'} → ${m.type}  ${(w.dmg * k * (open ? OPEN.dmg : 1)).toFixed(0)} dmg  ×${k.toFixed(2)}${open ? ' open' : ''}  shove ${v.toFixed(1)} m/s  → ${r}`);
  if (m.hp <= 0) { kill(sim, m, { ux, uz, v, at: w.at, way: w.way }); said('dead'); return; }
  if (m.down > 0) {
    /* the body on the floor takes the blow where it landed (sim/ragdoll.ts) */
    if (m.rag && m.body && w.at && v > 0) knockRag(m.rag, w.at, w.way ?? { x: ux, y: 0, z: uz }, v * m.body.mass, sim.tick);
    /* and its hands come up to its face (sim/ragdoll.ts, REFLEX) */
    if (m.rag) m.rag.guard = REFLEX.guard.time;
    said('down already');
    return;
  }
  /* the ladder (sim/moves.ts): the part of its blow it is in may shrug it off; getting up, it has better footing */
  const K = blowKind(m), armour = !K ? 0 : ph === 'wind' ? K.armour.wind : ph === 'strike' ? K.armour.strike : 0;
  const hitPoise = Math.max(0, w.poise * k * (open ? OPEN.poise : 1) - (m.rise > 0 ? RISE.guard : 0));
  const R = react(m.poise, m.pmax, hitPoise, armour), hold = open ? OPEN.poise : 1;
  m.poise = R.left; m.calm = 0;
  if (R.r === 'stagger' && v >= LAUNCH.dv && m.body) { m.body.vy += LAUNCH.up * v; m.body.ground = false; }
  if (R.r === 'stagger' && v >= DOWN.dv && upright(m)) floored(sim, m, { ux, uz, v, at: w.at, way: w.way });
  else if (R.r === 'stagger') { m.blow = null; m.reel = HOLD.stagger * hold; m.stun = Math.max(m.stun, m.reel); }
  /* a flinch loses a blow on its way; one already thrown, it is still recovering from */
  else if (R.r === 'flinch') { if (!open) m.blow = null; m.stun = Math.max(m.stun, HOLD.flinch * hold); }
  said(`${m.down > 0 ? (v >= LAUNCH.dv ? 'thrown' : 'down') : R.r}  (poise ${hitPoise.toFixed(0)}, ${R.left.toFixed(0)}/${m.pmax} left)`);
  switch (m.ai) {
    case 'husk':
      if (m.state === 'idle' || m.state === 'lurk') { m.state = 'hunt'; m.lost = 0; m.post = false; }
      else if (m.hp < m.max * 0.4 && !m.fled && sim.rng.chance(0.5)) { m.state = 'flee'; m.st = 7; m.fled = true; m.blow = null; step_(sim, m, 'moan'); }
      if (R.r === 'stagger') step_(sim, m, 'moan');
      break;
    case 'worm': m.flee = 5; m.blow = null; break;
    case 'swimmer': m.flee = 3.5; m.blow = null; break;
    case 'skitter': if (m.state === 'idle') { m.state = 'hunt'; m.lost = 0; } break;
    case 'thresher': if (['idle', 'patrol'].includes(m.state)) { m.state = 'wind'; m.st = 0.5; m.dest = -1; } break;
    case 'bloat': sayOnce(g, 'bloat', 'It does not seem to notice.'); break;
    default: break;
  }
}

/** it stands on its feet, so it can be knocked off them: not the low ones (on the floor already), the fixed, or what
 *  nothing moves */
const upright = (m: Mutant): boolean => !!m.body && !m.low && !m.swim && Number.isFinite(m.body.mass);

/** knocked off its feet: down a while, then getting up; nothing it was doing goes on (sim/moves.ts, DOWN). Its body goes
 *  down loose, carrying what floored it, held to where its feet are (sim/ragdoll.ts); it is drawn coming back up out of
 *  that as it rises */
function floored(sim: Sim, m: Mutant, blow: Killing | null = null): void {
  if (RAG.floored) { m.rag = makeRag(m, blow, true); if (m.rag) m.rag.woke = sim.tick; }
  m.blow = null; m.reel = 0;
  m.down = DOWN.time; m.rise = 0;
  m.stun = Math.max(m.stun, DOWN.time + DOWN.rise);
  step_(sim, m, 'thud', true);
}

/** thrown into something solid, or fallen: `over` m/s past what does no harm, and the harm and poise of each (a
 *  slam or a fall, sim/moves.ts). A fall that breaks its poise puts it on the floor */
function battered(sim: Sim, m: Mutant, over: number, r: { dmg: number; poise: number }): void {
  if (m.dead) return;
  if (m.down > 0) over *= DOWN.more;
  log(sim.game, `${r === FALL ? 'fall' : 'slam'} → ${m.type}  ${(over * r.dmg).toFixed(0)} dmg  (${over.toFixed(1)} m/s over)`);
  m.hp -= over * r.dmg;
  m.hit = Math.max(m.hit, 0.6);
  step_(sim, m, 'thud', m.big || m.mass > 2);
  if (m.hp <= 0) { kill(sim, m); return; }
  if (m.down > 0) return;
  const R = react(m.poise, m.pmax, Math.max(0, over * r.poise - (m.rise > 0 ? RISE.guard : 0)), 0);
  m.poise = R.left; m.calm = 0;
  if (R.r === 'stagger' && r === FALL && upright(m)) floored(sim, m);
  else if (R.r === 'stagger') { m.blow = null; m.reel = HOLD.stagger; m.stun = Math.max(m.stun, m.reel); }
  else if (R.r === 'flinch') { m.blow = null; m.stun = Math.max(m.stun, HOLD.flinch); }
}

/** you walked into it: what was not already after you is now */
export function shoved(sim: Sim, m: Mutant): void {
  if (m.dead) return;
  if (m.ai === 'husk' && m.state !== 'hunt' && m.state !== 'flee') { m.state = 'hunt'; m.lost = 0; m.post = false; m.dest = -1; step_(sim, m, 'moan'); }
  else if (m.ai === 'skitter' && m.state === 'idle') { m.state = 'hunt'; m.lost = 0; m.bt = 0; step_(sim, m, 'skit'); }
}

/** dev (the arena): every one of the cast dead at once; with none left alive, the dead taken away */
/** one of the cast long dead, lying where it went to hide (a game that does not begin with the opening: the other
 *  patient, in its corner) */
/** the other patient as the opening leaves them, for a game begun without it: out cold where they were grafted (`at`),
 *  in their blood, and their blood where they hid */
export function leftGrafted(sim: Sim, m: Mutant, at: { x: number; y: number; z: number }): void {
  if (m.dead || !m.body) return;
  if (m.hide) sim.pools.push({ x: m.hide.x, y: m.y, z: m.hide.z, r: 1.3 });
  const b = m.body;
  b.x = m.x = m.px = at.x; b.y = m.y = m.py = at.y; b.z = m.z = m.pz = at.z; b.sync();
  m.rag = layRag(m);
  slack(sim, m);
  m.state = 'out'; m.grafted = true;
  sim.pools.push({ x: at.x, y: at.y, z: at.z, r: BLOOD.pool });
}

export function killAll(sim: Sim): void {
  if (sim.cast.some(m => !m.dead)) { for (const m of sim.cast) if (!m.dead) kill(sim, m); return; }
  for (const m of sim.cast) { m.rag = null; m.away = true; }
}

function kill(sim: Sim, m: Mutant, blow: Killing | null = null, yours = true): void {
  m.dead = true;
  /* what has a body goes loose, carrying what killed it (sim/ragdoll.ts); the rest folds where it is. One already
     down is loose already, and takes the blow where it lies */
  if (m.rag && m.body && blow?.at && blow.v > 0) knockRag(m.rag, blow.at, blow.way ?? { x: blow.ux, y: 0, z: blow.uz }, blow.v * m.body.mass, sim.tick);
  else if (!m.rag) m.rag = makeRag(m, blow);
  if (m.rag) m.rag.woke = sim.tick;
  m.gone = 0;
  m.blow = null;
  m.ride = null;
  if (yours) sim.game.kills++;
  /* the body goes out of the world: what is left is not in anyone's way */
  if (m.body) {
    const k = sim.world.dyn.indexOf(m.body.dyn);
    if (k >= 0) sim.world.dyn.splice(k, 1);
  }
}
