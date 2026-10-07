import type { MutantDef } from '../content/types';
import { angLerp, clamp, PI, TAU } from '../core/math';
import { STEP } from '../core/loop';
import { Edge, edgeCost, field as fieldFrom } from '../world/nav';
import type { Dyn } from '../world/world';
import { fall, makeBody, settle, walk, type Body } from './body';
import { doorShut, opensItself, routeRules, rulesFor, type Fields, type Walker } from './fields';
import { hurtBy, power, sayOnce, sfx } from './game';
import { sendPlatform, type Door } from './movers';
import { eyeHeight } from './player';
import { simLighting, type Sim } from './sim';
import { soundZone } from './eyes';

/* The cast (engine.md §7, §8): what lives in the station, ported from the first engine's behaviours. Each is a body that
   walks like yours, so it has weight, falls, rides platforms and is stopped by what stops you; they block each other
   and you. They find their way over the nav graph's fields, see along lines of sight scaled by the light you stand in,
   and hear what you do as far as the sound of it carries through the rooms between. */

export type Ai = 'husk' | 'skitter' | 'bloat' | 'thresher' | 'worm' | 'swimmer' | 'grabber' | 'overseer';

interface Stats {
  ai?: Ai; model?: string; green?: boolean;
  hp: number; r: number; cr: number; mass: number;
  /** its body's height */
  h: number;
  opens?: boolean; low?: boolean; noDoors?: boolean; solid?: boolean; fixed?: boolean; swim?: boolean;
}

export const MT: Record<string, Stats> = {
  husk: { hp: 75, r: 0.38, cr: 0.34, mass: 1.2, h: 1.8, opens: true },
  skitter: { hp: 60, r: 0.5, cr: 0.4, mass: 1, h: 0.9, low: true },
  bloat: { hp: 600, r: 1, cr: 0.9, mass: 8, h: 2.4, noDoors: true, solid: true },
  thresher: { hp: 150, r: 0.6, cr: 0.5, mass: 2.5, h: 2.1, solid: true, noDoors: true },
  /* 0.6 high: higher than a step, so you go round one rather than up onto it */
  worm: { hp: 40, r: 0.35, cr: 0.3, mass: 1, h: 0.6, low: true },
  rootworm: { ai: 'worm', model: 'worm', green: true, hp: 40, r: 0.35, cr: 0.3, mass: 1, h: 0.6, low: true },
  swimmer: { ai: 'swimmer', model: 'worm', hp: 40, r: 0.35, cr: 0.3, mass: 1, h: 0.6, swim: true },
  grabber: { hp: 30, r: 0.4, cr: 0, mass: 1, h: 0, fixed: true },
  vine: { ai: 'grabber', model: 'grabber', green: true, hp: 30, r: 0.4, cr: 0, mass: 1, h: 0, fixed: true },
  /* Security's (world.md §8): the growth that was the operations centre, which sees through the cameras; and its hand, a
     thresher made of Security's staff that goes wherever an alarm sounds. Too big for a door frame, it keeps to the halls. */
  overseer: { ai: 'overseer', model: 'bloat', hp: 260, r: 1.1, cr: 0, mass: 8, h: 0, fixed: true },
  hand: { ai: 'thresher', model: 'thresher', hp: 220, r: 0.65, cr: 0.52, mass: 3, h: 2.2, solid: true, noDoors: true },
};

export const DEATH: Record<Ai, string> = {
  husk: 'It beat you the way a person would. Patiently, and with both hands.',
  skitter: 'It folded itself over you, one limb at a time.',
  worm: 'They only ever wanted to hold you.',
  thresher: 'It opened, and you went in.',
  swimmer: 'The water closed over the last of the light.',
  grabber: 'The doorway closed its hands.',
  bloat: 'It sat on you. It did not seem to notice.',
  overseer: 'It had watched you the whole way here.',
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
  /** the overseer's: the zone it sounds when it sees you itself */
  zone: string | null;
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
  /** being knocked back: its slide along the ground, m/s, dying away */
  kx: number; kz: number;
  /** time, for its animation */
  ph: number;
  dead: boolean;
  /** 0..1 of its fall when it dies */
  gone: number;
  /** steps it has stood still: a body at rest is not asked about its footing */
  still: number;
}

const dt = STEP;

export function makeCast(sim: Sim, defs: MutantDef[]): Mutant[] {
  const rnd = (a: number, b?: number) => sim.rng.range(a, b);
  return defs.filter(d => MT[d.type]).map((def, id) => {
    const S = MT[def.type], o = def.opts as Record<string, number | undefined>;
    const body = S.fixed ? null : makeBody(sim.world, def.x, def.y, def.z, S.cr, S.h);
    if (body) {
      /* as the first engine had it: you pass through all but the solid ones, and they stop short of you rather than
         push; so none of them is ever held up by you either */
      const own = body.dyn, you = sim.player.body.dyn;
      body.dyn.soft = !S.solid;
      body.skip = d => d === own || d === you;
    }
    const room = sim.world.roomAt(def.x, def.y + 0.5, def.z)?.id ?? -1;
    const m: Mutant = {
      id, type: def.type, ai: S.ai ?? (def.type as Ai), model: S.model ?? def.type, green: !!S.green, body,
      x: def.x, y: def.y, z: def.z, px: def.x, py: def.y, pz: def.z, yaw: o.yaw ?? rnd(TAU), state: 'idle', st: 0, cd: 0, stun: 0,
      hp: S.hp, max: S.hp, mass: S.mass, r: S.r,
      walker: S.noDoors ? 'big' : S.opens ? 'hands' : 'crawl',
      opens: !!S.opens, low: !!S.low, noDoors: !!S.noDoors, fixed: !!S.fixed, swim: !!S.swim, solid: !!S.solid,
      post: !!o.post, sit: !!o.sit, holt: !!o.holt, big: !!o.big, zone: (def.opts.zone as string | undefined) ?? null, hx: def.x, hz: def.z, room,
      wt: rnd(1, 5), wm: 0, wx: 0, wz: 0, tk: 0, lost: 0, bt: 0, burst: false, flee: 0, ct: rnd(6, 14), cdir: 0, tgt: false,
      grab: 0, tense: 0, blow: null, dest: -1, F: null, stk: 0, fled: false, side: 0, ride: null, spot: -1,
      mv: 0, d: 99, dp: 99, dy: 0, los: false, losAt: -99, hit: 0, kx: 0, kz: 0, ph: rnd(9), dead: false, gone: 0, still: 0,
    };
    return m;
  });
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

/** walk straight toward (tx, tz). True if it got somewhere (or is there). */
function go(sim: Sim, m: Mutant, tx: number, tz: number, spd: number): boolean {
  const b = m.body;
  if (!b) return false;
  let dx = tx - b.x, dz = tz - b.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.05) return true;
  dx /= d; dz /= d;
  m.yaw = angLerp(m.yaw, Math.atan2(dx, dz), Math.min(1, dt * 8));
  const st = Math.min(d, spd * dt);
  /* it stops short of you: close enough to reach, never on top of you */
  const p = sim.player.body, nx = b.x + dx * st, nz = b.z + dz * st, nd = Math.hypot(nx - p.x, nz - p.z);
  if (Math.abs(m.dy) < 1.5 && nd < m.r + 0.3 && nd < m.dp) { m.mv = 0; return true; }
  const ox = b.x, oz = b.z;
  walk(sim.world, b, dx * st, dz * st);
  const moved = Math.hypot(b.x - ox, b.z - oz) >= st * 0.3;
  /* wedged on a corner or against another of them: sidestep, and keep to the same side until it clears. Not round you. */
  if (!moved) {
    if (!m.side) m.side = sim.rng.chance(0.5) ? 1 : -1;
    for (const q of [m.side, -m.side]) {
      const px = b.x, pz = b.z;
      walk(sim.world, b, dz * st * q, -dx * st * q);
      if (Math.hypot(b.x - px, b.z - pz) >= st * 0.3) { m.side = q; m.mv = spd; return false; }
    }
  }
  if (moved) m.side = 0;
  m.mv = moved ? spd : 0;
  return moved;
}

/** the door a spot stands in, if it is shut to this one now: open it by hand if it can, or wait for it */
function doorAhead(sim: Sim, m: Mutant, d: Door): 'go' | 'wait' | 'no' {
  if (d.t > 0.9) return 'go';
  if (m.walker === 'crawl' && d.def.stuck) return 'go';
  const pw = power(sim.game, d.def.circuit);
  if (opensItself(d, pw)) return 'wait'; // it is opening for us
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
  const R = rulesFor(sim, Fs, m.walker);
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
  if (m.dp < 7 && Math.abs(m.dy) < 1 && sight(sim, m)) return go(sim, m, p.x, p.z, spd);
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
  const b = m.body!, st = spd * dt, dx = Math.sin(m.cdir) * st, dz = Math.cos(m.cdir) * st;
  const ox = b.x, oz = b.z;
  walk(sim.world, b, dx, dz);
  m.yaw = m.cdir;
  m.mv = spd;
  return Math.hypot(b.x - ox, b.z - oz) >= st * 0.6;
}

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
const lit = (sim: Sim, x: number, y: number, z: number) => Math.max(...lighting(sim).atPoint(x, y, z)) > LIT;
function litRoom(sim: Sim, id: number): boolean {
  const R = sim.world.rooms[id];
  return Math.max(...lighting(sim).at(id, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2)) > LIT;
}

/** the rooms the cast's rounds can take them to, as the power stands: the lit ones */
export function rounds(sim: Sim): number[] {
  return roamRooms(sim).filter(R => litRoom(sim, R));
}

/** of these rooms, the spot nearest it can get to as the doors stand now (a locked door bars it), or -1. Only the choice
 *  needs the doors; the route there is made as any round's is, and a save keeps the choice. */
function nearestIn(sim: Sim, m: Mutant, rooms: number[]): number {
  const Fs = sim.fields!, from = fieldFrom(Fs.nav, m.spot, rulesFor(sim, Fs, m.walker));
  let best = -1;
  for (const R of rooms) for (const k of Fs.nav.byRoom.get(R) ?? []) if (from[k] < (best < 0 ? Infinity : from[best])) best = k;
  return best;
}

const roamCache = new WeakMap<object, number[]>();
/** rooms worth a walk: not a refuge, not marked off, not a doorway, not a cupboard */
function roamRooms(sim: Sim): number[] {
  let r = roamCache.get(sim.world);
  if (!r) {
    r = sim.world.rooms.filter(R => !R.safe && !R.noroam && !R.doorway && (R.x1 - R.x0) * (R.z1 - R.z0) >= 16).map(R => R.id);
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

function strikes(sim: Sim, m: Mutant, dmg: number): void {
  /* you are on something well above it: it cannot reach */
  if (!m.fixed && sim.player.body.y - m.y > 1.4) return;
  hurtBy(sim.game, dmg, DEATH[m.ai], { x: m.x, z: m.z });
}

const step_ = (sim: Sim, m: Mutant, name: string, big = false) => sfx(sim.game, name, m, big);

/* ---- a blow: wound up, thrown, recovered from

   A blow is three motions, as yours is two. The wind-up is the tell: it is heard, and the thing turns to follow you
   only for the first part of it, then holds the line it has chosen, so a step aside as it commits takes you out of the
   way. The strike is short and goes where it was aimed, carrying the thing forward a little: it lands only on you in
   front of it (an arc about the way it faces), within its reach, and not well above or below it. Then it recovers
   where the blow left it, not moving, not turning, and longer when the blow met nothing. That is your time. */

export type BlowPhase = 'wind' | 'strike' | 'after';
export interface Blow { ph: BlowPhase; t: number; hit: boolean }

export interface BlowKind {
  /** seconds of each motion; recovery after a blow that landed, and after one that met nothing; a rest after that */
  wind: number; strike: number; rec: number; miss: number; cd: number;
  /** how fast it turns to follow you as it winds up, and how far through the wind-up it stops turning */
  turn: number; lock: number;
  /** how near it comes before it begins, how far past its own edge the blow reaches, the cosine of half the arc it
     sweeps, and how far it lunges as it strikes */
  start: number; reach: number; arc: number; lunge: number;
  dmg: number;
  /** what it makes heard as it winds up */
  tell: string;
  big?: boolean;
}

const deg = (a: number) => Math.cos((a * PI) / 180);

export const BLOWS = {
  /* overhead, with one arm: wide, as an arm comes down, and slow to come back from */
  husk: { wind: 0.55, strike: 0.12, rec: 0.5, miss: 0.85, cd: 0.3, turn: 10, lock: 0.7, start: 0.85, reach: 1.0, arc: deg(55), lunge: 0.3, dmg: 20, tell: 'heave' },
  /* it rears and drops on you: narrow, and further forward than it looks */
  skitter: { wind: 0.5, strike: 0.1, rec: 0.4, miss: 0.7, cd: 0.45, turn: 6, lock: 0.6, start: 0.75, reach: 0.75, arc: deg(35), lunge: 0.5, dmg: 22, tell: 'skit' },
  bigSkitter: { wind: 0.7, strike: 0.15, rec: 0.7, miss: 1.1, cd: 0.6, turn: 5, lock: 0.6, start: 1.1, reach: 1.1, arc: deg(45), lunge: 0.6, dmg: 45, tell: 'skit', big: true },
  /* both arms, side to side: hard to get round, but a long time open after */
  thresher: { wind: 0.6, strike: 0.15, rec: 0.9, miss: 1.3, cd: 0.4, turn: 6, lock: 0.65, start: 0.7, reach: 0.9, arc: deg(70), lunge: 0.25, dmg: 45, tell: 'growl', big: true },
  /* a worm's or a swimmer's is hardly a blow: a short rasp, the head lifted and the hand drawn back, then a grab. Quick
     to see, quick to be over: a step back as it lifts is enough */
  worm: { wind: 0.3, strike: 0.08, rec: 0.25, miss: 0.4, cd: 1.0, turn: 8, lock: 0.5, start: 0.7, reach: 0.75, arc: deg(60), lunge: 0.15, dmg: 12, tell: 'rasp' },
  swimmer: { wind: 0.3, strike: 0.08, rec: 0.25, miss: 0.4, cd: 0.9, turn: 8, lock: 0.5, start: 0.7, reach: 0.75, arc: deg(60), lunge: 0.2, dmg: 15, tell: 'rasp' },
} satisfies Record<string, BlowKind>;

/** the blow this one throws, if it throws one */
export function blowKind(m: Mutant): BlowKind | null {
  switch (m.ai) {
    case 'husk': return BLOWS.husk;
    case 'skitter': return m.big ? BLOWS.bigSkitter : BLOWS.skitter;
    case 'thresher': return BLOWS.thresher;
    case 'worm': return BLOWS.worm;
    case 'swimmer': return BLOWS.swimmer;
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

function beginBlow(sim: Sim, m: Mutant, K: BlowKind): void {
  m.blow = { ph: 'wind', t: 0, hit: false };
  step_(sim, m, K.tell, K.big);
}

/** a step of a blow under way; false when there is none, so the behaviour goes on with whatever else it does */
function blowStep(sim: Sim, m: Mutant): boolean {
  const B = m.blow, K = blowKind(m);
  if (!B || !K) return false;
  B.t += dt;
  switch (B.ph) {
    case 'wind':
      if (B.t < K.wind * K.lock) turnTo(sim, m, K.turn);
      if (B.t >= K.wind) { B.ph = 'strike'; B.t = 0; step_(sim, m, 'swing', K.big); }
      break;
    case 'strike': {
      /* the lunge, along the line it chose; not into you if you are already under it */
      if (m.body && m.dp > m.r + 0.3) walk(sim.world, m.body, Math.sin(m.yaw) * (K.lunge / K.strike) * dt, Math.cos(m.yaw) * (K.lunge / K.strike) * dt, 0);
      if (m.body) { m.x = m.body.x; m.z = m.body.z; }
      if (!B.hit && inBlow(sim, m, K)) { B.hit = true; strikes(sim, m, K.dmg); }
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
  m.state = 'hunt'; m.lost = 0; m.post = false; m.dest = -1; step_(sim, m, 'moan');
  return true;
}

/** a zone alarm it hears (sim/eyes.ts): a husk not already after you leaves its rounds, or its post, and goes to the
 *  speaker, as Security's staff were drilled to. The way there is the alarm's, copied: a round makes its next route in
 *  the one it has. */
export function answer(sim: Sim, m: Mutant, spot: number, route: Float32Array): void {
  if (m.dead || m.ai !== 'husk' || (m.state !== 'idle' && m.state !== 'lurk' && m.state !== 'answer') || m.spot < 0) return;
  if (m.state === 'answer' && m.dest === spot) return;
  if (!(route[m.spot] > 2.5)) return; // there already, or no way there
  step_(sim, m, 'mutter');
  m.state = 'answer'; m.post = false; m.dest = spot; m.F = Float32Array.from(route); m.wt = 0; m.stk = 0;
}

/** an alarm, for the overseer's hand: it hears every one, wherever it is, and goes, at a run, by the way its size allows
 *  (no doors). Not while it is already after you. */
export function summon(sim: Sim, m: Mutant, spot: number, route: Float32Array): void {
  if (m.dead || m.type !== 'hand' || !['idle', 'patrol', 'pursue', 'go'].includes(m.state) || m.spot < 0) return;
  if (m.state === 'go' && m.dest === spot) return;
  if (!(route[m.spot] > 2.5) || !Number.isFinite(route[m.spot])) return;
  step_(sim, m, 'roar', true);
  m.state = 'go'; m.dest = spot; m.F = Float32Array.from(route); m.stk = 0; m.st = Infinity;
}

const AI: Record<Ai, (sim: Sim, m: Mutant) => void> = {
  husk(sim, m) {
    const F = sim.fields?.hands, d = m.d;
    switch (m.state) {
      case 'idle': {
        if (notices(sim, m)) break;
        if (!m.post) roam(sim, m, 1.3);
        break;
      }
      case 'answer': {
        /* to the alarm, at a hurry; there, it stands and looks about a while before its rounds again */
        if (notices(sim, m)) break;
        if (!m.F || m.dest < 0 || m.spot === m.dest || m.F[m.spot] < 1.5) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 6, 12); break; }
        if (follow(sim, m, m.F, 2.6, false)) m.stk = 0;
        else if ((m.stk += dt) > 3) { m.stk = 0; m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); }
        break;
      }
      case 'hunt':
        if (blowStep(sim, m)) break;
        if (m.hp < m.max * 0.4 && !m.fled && d > 2.8) { m.state = 'flee'; m.st = 7; m.fled = true; step_(sim, m, 'moan'); break; }
        if (seeP(sim, m, 22)) m.lost = 0; else m.lost += dt;
        if (m.lost > 8) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 5); break; }
        if (inStart(m, BLOWS.husk)) { turnTo(sim, m, 10); if (m.cd <= 0) beginBlow(sim, m, BLOWS.husk); }
        else if (F) chase(sim, m, 3.5, F);
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
        m.ct -= dt;
        if (m.ct < 0) { m.ct = rnd(sim, 7, 15); m.cdir = rnd(sim, TAU); m.tgt = false; m.state = 'charge'; m.st = rnd(sim, 1, 2.2); step_(sim, m, 'roar', true); break; }
        m.wt -= dt;
        if (m.wt < 0) { m.wt = rnd(sim, 4, 9); roomWp(sim, m); }
        go(sim, m, m.wx, m.wz, 1.2);
        if (m.mv && (m.tk -= dt) < 0) { m.tk = 0.62; step_(sim, m, 'hstep', true); }
        break;
      case 'go': {
        /* the hand, to an alarm: it hunts you if it meets you on the way; there, it keeps the place a while */
        if (seeP(sim, m, 16)) { m.state = 'wind'; m.st = 0.75; m.dest = -1; step_(sim, m, 'roar'); break; }
        if (!m.F || m.dest < 0 || m.spot === m.dest || m.F[m.spot] < 2) { m.state = 'patrol'; m.dest = -1; m.wt = 0; m.ct = rnd(sim, 7, 15); break; }
        /* it gives up where it gets no nearer for a while: somewhere it does not fit */
        const near = m.F[m.spot];
        if (near < m.st - 0.5) { m.st = near; m.stk = 0; }
        if (follow(sim, m, m.F, 3.2, false) && m.mv && (m.tk -= dt) < 0) { m.tk = 0.4; step_(sim, m, 'hstep', true); }
        if ((m.stk += dt) > 3) { m.stk = 0; m.state = 'patrol'; m.dest = -1; }
        break;
      }
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
          strikes(sim, m, 45);
          p.kx = Math.sin(m.cdir) * 9; p.kz = Math.cos(m.cdir) * 9;
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
        if (inStart(m, BLOWS.thresher)) { turnTo(sim, m, 4); if (m.cd <= 0) beginBlow(sim, m, BLOWS.thresher); }
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
      if (inStart(m, BLOWS.worm)) {
        if (sim.wormN >= 2) { turnTo(sim, m, 8); if (m.cd <= 0) beginBlow(sim, m, BLOWS.worm); }
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
      if (inStart(m, BLOWS.swimmer)) { turnTo(sim, m, 8); if (m.cd <= 0) beginBlow(sim, m, BLOWS.swimmer); }
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
  /* the operations centre grown into one growth: it sees you itself in its own room and sounds its zone, and what comes near
     its controls it lashes, with the tell of a grabber */
  overseer(sim, m) {
    if (m.zone && seeP(sim, m, 14)) soundZone(sim, m.zone, true);
    if (m.dp < 2.2 && Math.abs(m.dy) < 2.5 && sight(sim, m)) {
      if (m.tense === 0) step_(sim, m, 'growl');
      m.tense += dt;
      if (m.tense > 0.9 && m.cd <= 0) { m.cd = 2; m.tense = 0.01; strikes(sim, m, 22); }
    } else m.tense = Math.max(0, m.tense - dt * 2);
  },

  grabber(sim, m) {
    if (m.grab > 0) m.grab -= dt;
    if (m.dp < 1.5 && Math.abs(m.dy) < 2 && sight(sim, m)) {
      if (m.tense === 0) step_(sim, m, 'skit');
      m.tense += dt;
      if (m.tense > 0.8 && m.cd <= 0) {
        m.cd = 2.4; m.grab = 1; m.tense = 0.01;
        strikes(sim, m, 20);
        sim.player.slow = 1.4;
        sayOnce(sim.game, 'grab', 'The arms are only arms. Whatever is holding on is above them.');
      }
    } else m.tense = Math.max(0, m.tense - dt * 2);
  },
};

/** a step of everything alive */
export function updateCast(sim: Sim): void {
  const b = sim.player.body, Fs = sim.fields;
  let wn = 0;
  for (const m of sim.cast) if (m.ai === 'worm' && !m.dead && m.flee <= 0 && m.dp < 2.6) wn++;
  sim.wormN = wn;
  for (const m of sim.cast) {
    m.px = m.x; m.py = m.y; m.pz = m.z;
    if (m.hit > 0) m.hit = Math.max(0, m.hit - dt * 4);
    if (m.dead) { if (m.gone < 1) m.gone = Math.min(1, m.gone + dt * 2.5); continue; }
    const mb = m.body, resting = !!mb && m.still > 2 && mb.ground && mb.vy === 0 && !mb.on, ox = mb?.x, oz = mb?.z;
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
    /* knocked back: it slides a step's worth over a few steps, not all at once */
    if (mb && (m.kx || m.kz)) {
      walk(sim.world, mb, m.kx * dt, m.kz * dt, 0);
      m.x = mb.x; m.z = mb.z;
      const k = Math.exp(-dt * KNOCK.ease);
      m.kx *= k; m.kz *= k;
      if (Math.hypot(m.kx, m.kz) < 0.05) m.kx = m.kz = 0;
    }
    if (m.stun > 0) m.stun -= dt;
    else AI[m.ai](sim, m);
    if (mb) {
      /* a body that has stood still on firm ground for a few steps stays where it is: its weight would only put it back */
      const moved = mb.x !== ox || mb.z !== oz;
      if (moved || !resting) fall(sim.world, mb, dt);
      m.still = moved ? 0 : m.still + 1;
      m.x = mb.x; m.y = mb.y; m.z = mb.z;
    }
    if (sim.game.ended) return;
  }
}

/** a knock back: how far it slides in all, and how fast the slide dies (per second) */
const KNOCK = { dist: 0.3, ease: 14 };
/** a blow that catches one open, recovering from its own */
const OPEN = { dmg: 1.25, stun: 1.6 };

/** something hit it (a swing at `pow` of full, or a shot) */
export function hitMutant(sim: Sim, m: Mutant, w: { dmg: number; stun: number }, pow: number): void {
  const g = sim.game, p = sim.player.body;
  /* caught recovering from a blow of its own: it takes it worse, and is longer getting over it */
  const open = m.blow?.ph === 'after' ? OPEN : { dmg: 1, stun: 1 };
  m.hp -= w.dmg * (0.3 + 0.7 * pow) * open.dmg;
  /* a jab (pow under 1) stuns it and knocks it back in proportion, a quarter-strength jab a quarter as much; it is
     rocked a little less */
  m.hit = Math.max(m.hit, 0.3 + 0.7 * pow);
  m.stun = Math.max(m.stun, (w.stun * 1.2 * pow * open.stun) / m.mass);
  sfx(g, 'hit');
  /* light enough to be knocked back a step: about 0.3 m from a full blow, slid over a sixth of a second */
  if (m.body && m.mass <= 1.5) {
    const dx = m.x - p.x, dz = m.z - p.z, d = Math.hypot(dx, dz) || 1, v = KNOCK.dist * pow * KNOCK.ease;
    m.kx = (dx / d) * v; m.kz = (dz / d) * v;
  }
  if (m.hp <= 0) { kill(sim, m); return; }
  switch (m.ai) {
    case 'husk':
      /* struck before its blow lands, it loses it; struck after, it is still recovering */
      if (m.blow?.ph !== 'after') m.blow = null;
      if (m.state === 'idle' || m.state === 'lurk') { m.state = 'hunt'; m.lost = 0; m.post = false; }
      else if (m.hp < m.max * 0.4 && !m.fled && sim.rng.chance(0.5)) { m.state = 'flee'; m.st = 7; m.fled = true; m.blow = null; step_(sim, m, 'moan'); }
      break;
    case 'worm': m.flee = 5; m.blow = null; break;
    case 'swimmer': m.flee = 3.5; m.blow = null; break;
    case 'skitter': if (pow > 0.6 && m.blow?.ph !== 'after') m.blow = null; if (m.state === 'idle') { m.state = 'hunt'; m.lost = 0; } break;
    case 'thresher': if (m.state === 'idle' || m.state === 'patrol') { m.state = 'wind'; m.st = 0.5; } break;
    case 'bloat': sayOnce(g, 'bloat', 'It does not seem to notice.'); break;
    default: break;
  }
}

function kill(sim: Sim, m: Mutant): void {
  m.dead = true;
  m.gone = 0;
  m.blow = null;
  m.ride = null;
  sim.game.kills++;
  /* the body goes out of the world: what is left is not in anyone's way */
  if (m.body) {
    const k = sim.world.dyn.indexOf(m.body.dyn);
    if (k >= 0) sim.world.dyn.splice(k, 1);
  }
}
