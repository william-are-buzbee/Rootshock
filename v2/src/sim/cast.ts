import type { MutantDef } from '../content/types';
import { angLerp, clamp, PI, TAU } from '../core/math';
import { STEP } from '../core/loop';
import { Edge, edgeCost, field as fieldFrom } from '../world/nav';
import type { Dyn } from '../world/world';
import { fall, makeBody, settle, walk, type Body } from './body';
import { doorShut, opensItself, rulesFor, type Fields, type Walker } from './fields';
import { hurtBy, power, sayOnce, sfx } from './game';
import { sendPlatform, type Door } from './movers';
import { eyeHeight } from './player';
import type { Sim } from './sim';

/* The cast (engine.md §7, §8): what lives in the station, ported from the first engine's behaviours. Each is a body that
   walks like yours, so it has weight, falls, rides platforms and is stopped by what stops you; they block each other
   and you. They find their way over the nav graph's fields, see along lines of sight scaled by the light you stand in,
   and hear what you do as far as the sound of it carries through the rooms between. */

export type Ai = 'husk' | 'skitter' | 'bloat' | 'thresher' | 'worm' | 'swimmer' | 'grabber';

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
};

export const DEATH: Record<Ai, string> = {
  husk: 'It beat you the way a person would. Patiently, and with both hands.',
  skitter: 'It folded itself over you, one limb at a time.',
  worm: 'They only ever wanted to hold you.',
  thresher: 'It opened, and you went in.',
  swimmer: 'The water closed over the last of the light.',
  grabber: 'The doorway closed its hands.',
  bloat: 'It sat on you. It did not seem to notice.',
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
  /** where it started, which it keeps near */
  hx: number; hz: number;
  room: number;
  /* the first engine's timers and flags, by their old names: wait, wander, waypoint, footstep, lost, burst, flee,
     charge clock and direction, targeted, grab, tension, wind-up */
  wt: number; wm: number; wx: number; wz: number;
  tk: number; lost: number; bt: number; burst: boolean; flee: number; ct: number; cdir: number; tgt: boolean;
  grab: number; tense: number; wind: number; windT: number;
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
  /** time, for its animation */
  ph: number;
  dead: boolean;
  /** 0..1 of its fall when it dies */
  gone: number;
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
      post: !!o.post, sit: !!o.sit, holt: !!o.holt, big: !!o.big, hx: def.x, hz: def.z, room,
      wt: rnd(1, 5), wm: 0, wx: 0, wz: 0, tk: 0, lost: 0, bt: 0, burst: false, flee: 0, ct: rnd(6, 14), cdir: 0, tgt: false,
      grab: 0, tense: 0, wind: 0, windT: 1, dest: -1, F: null, stk: 0, fled: false, side: 0, ride: null, spot: -1,
      mv: 0, d: 99, dp: 99, dy: 0, los: false, losAt: -99, hit: 0, ph: rnd(9), dead: false, gone: 0,
    };
    return m;
  });
}

/** the bodies of the living, for doors and platforms to know about */
export const castBodies = (sim: Sim): Body[] => sim.cast.filter(m => !m.dead && m.body).map(m => m.body!);

/** those that make a light door open as they come near: anything that walks and fits a door */
export const castMovers = (sim: Sim): Body[] => sim.cast.filter(m => !m.dead && m.body && !m.noDoors).map(m => m.body!);

/* ---- perception */

const seeThrough = (d: Dyn) => d.kind === 'body';

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
  if (m.opens && !doorShut(d, pw)) {
    if (!d.open) {
      d.open = true; d.hold = 3;
      sfx(sim.game, 'door', { x: (d.def.x0 + d.def.x1) / 2, z: (d.def.z0 + d.def.z1) / 2 });
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
  sfx(sim.game, 'door', { x: (p.def.x0 + p.def.x1) / 2, z: (p.def.z0 + p.def.z1) / 2 });
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

/** staff still keep rounds: pick a room anywhere and walk there */
function pickDest(sim: Sim, m: Mutant): void {
  const Fs = sim.fields;
  if (!Fs || m.spot < 0) { m.wt = 3; return; }
  /* one new route a step at most, across the whole cast */
  if (picked.get(sim) === sim.tick) { m.wt = 0.05; return; }
  picked.set(sim, sim.tick);
  const rooms = roamRooms(sim);
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
  return fieldFrom(Fs.nav, k, rulesFor(sim, Fs, m.walker), m.F ?? undefined);
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
  hurtBy(sim.game, dmg, DEATH[m.ai]);
}

const step_ = (sim: Sim, m: Mutant, name: string, big = false) => sfx(sim.game, name, { x: m.x, z: m.z }, big);

/* ---- the behaviours, as the first engine had them */

const turnTo = (sim: Sim, m: Mutant, k: number) => {
  const p = sim.player.body;
  m.yaw = angLerp(m.yaw, Math.atan2(p.x - m.x, p.z - m.z), Math.min(1, dt * k));
};
const rnd = (sim: Sim, a: number, b?: number) => sim.rng.range(a, b);

const AI: Record<Ai, (sim: Sim, m: Mutant) => void> = {
  husk(sim, m) {
    const p = sim.player.body, F = sim.fields?.hands, d = m.d;
    switch (m.state) {
      case 'idle': {
        const facing = d < 2.5 || ((p.x - m.x) * Math.sin(m.yaw) + (p.z - m.z) * Math.cos(m.yaw)) / (m.dp || 1) > -0.2;
        if ((facing && seeP(sim, m, 15)) || hears(sim, m)) { m.state = 'hunt'; m.lost = 0; m.post = false; step_(sim, m, 'moan'); break; }
        if (!m.post) roam(sim, m, 1.3);
        break;
      }
      case 'hunt':
        if (m.hp < m.max * 0.4 && !m.fled && d > 2.8) { m.state = 'flee'; m.st = 7; m.fled = true; m.wind = 0; step_(sim, m, 'moan'); break; }
        if (seeP(sim, m, 22)) m.lost = 0; else m.lost += dt;
        if (m.lost > 8) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 5); break; }
        if (m.wind > 0) {
          m.wind -= dt;
          if (m.wind <= 0) { if (m.dp < m.r + 1.25 && Math.abs(m.dy) < 1.4) strikes(sim, m, 20); m.cd = 0.9; }
          break;
        }
        if (m.dp < m.r + 0.85 && Math.abs(m.dy) < 1.2) { turnTo(sim, m, 10); if (m.cd <= 0) { m.wind = 0.45; step_(sim, m, 'swing'); } }
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
    if (seeP(sim, m, big ? 24 : 18)) m.lost = 0; else m.lost += dt;
    if (m.lost > 9) { m.state = 'idle'; return; }
    m.bt -= dt;
    if (m.bt <= 0) { m.burst = !m.burst; m.bt = m.burst ? rnd(sim, 0.4, 0.9) : rnd(sim, 0.1, 0.4); }
    if (m.wind > 0) {
      m.wind -= dt;
      turnTo(sim, m, 6);
      if (m.wind <= 0) { m.cd = big ? 1.5 : 1; if (m.dp < m.r + (big ? 1.6 : 1.15) && Math.abs(m.dy) < 1.4) strikes(sim, m, big ? 45 : 22); }
      return;
    }
    if (m.dp < m.r + (big ? 1.1 : 0.75) && Math.abs(m.dy) < 1.2) { if (m.cd <= 0) { m.windT = m.wind = big ? 0.7 : 0.5; step_(sim, m, 'skit'); } }
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
        m.st -= dt;
        if (m.st < 0) { m.state = 'patrol'; break; }
        if (seeP(sim, m, 18) && d > 3.5) { m.state = 'wind'; m.st = 0.5; step_(sim, m, 'roar'); break; }
        if (m.dp < m.r + 0.7 && Math.abs(m.dy) < 1.4) { if (m.cd <= 0) { m.cd = 1.5; strikes(sim, m, 45); } }
        else if (sim.fields) chase(sim, m, 2.6, sim.fields.big);
        break;
    }
  },

  worm(sim, m) {
    const g = sim.game, F = sim.fields?.crawl, d = m.d;
    if (m.flee > 0) { m.flee -= dt; away(sim, m, 2.6); return; }
    const flash = g.lightOn && g.light === 'flash', lamp = g.lightOn && g.light === 'lantern';
    if ((d < 10 && flash && inBeam(sim, m)) || (d < 4.5 && lamp)) { away(sim, m, 1.5); return; }
    if (d < 5 || (d < 13 && sight(sim, m))) {
      if (m.dp < 1.05 && Math.abs(m.dy) < 1) {
        if (sim.wormN >= 2) { if (m.cd <= 0) { m.cd = 1.5; strikes(sim, m, 12); } }
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
    if (m.d < (lamp ? 22 : 9)) {
      if (m.dp < 1.05 && Math.abs(m.dy) < 1.4) { if (m.cd <= 0) { m.cd = 1.4; strikes(sim, m, 15); } }
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
    const mb = m.body;
    if (mb) {
      settle(sim.world, mb);
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
    if (m.stun > 0) m.stun -= dt;
    else AI[m.ai](sim, m);
    if (mb) {
      fall(sim.world, mb, dt);
      m.x = mb.x; m.y = mb.y; m.z = mb.z;
    }
    if (sim.game.ended) return;
  }
}

/** something hit it (a swing at `pow` of full, or a shot) */
export function hitMutant(sim: Sim, m: Mutant, w: { dmg: number; stun: number }, pow: number): void {
  const g = sim.game, p = sim.player.body;
  m.hp -= w.dmg * (0.3 + 0.7 * pow);
  m.hit = 1;
  m.stun = Math.max(m.stun, (w.stun * 1.2 * (0.25 + 0.75 * pow)) / m.mass);
  sfx(g, 'hit');
  /* light enough to be knocked back a step */
  if (m.body && m.mass <= 1.5) {
    const dx = m.x - p.x, dz = m.z - p.z, d = Math.hypot(dx, dz) || 1;
    walk(sim.world, m.body, (dx / d) * 0.3, (dz / d) * 0.3, 0);
    m.x = m.body.x; m.z = m.body.z;
  }
  if (m.hp <= 0) { kill(sim, m); return; }
  switch (m.ai) {
    case 'husk':
      m.wind = 0;
      if (m.state === 'idle' || m.state === 'lurk') { m.state = 'hunt'; m.lost = 0; m.post = false; }
      else if (m.hp < m.max * 0.4 && !m.fled && sim.rng.chance(0.5)) { m.state = 'flee'; m.st = 7; m.fled = true; step_(sim, m, 'moan'); }
      break;
    case 'worm': m.flee = 5; break;
    case 'swimmer': m.flee = 3.5; break;
    case 'skitter': if (pow > 0.6) m.wind = 0; if (m.state === 'idle') { m.state = 'hunt'; m.lost = 0; } break;
    case 'thresher': if (m.state === 'idle' || m.state === 'patrol') { m.state = 'wind'; m.st = 0.5; } break;
    case 'bloat': sayOnce(g, 'bloat', 'It does not seem to notice.'); break;
    default: break;
  }
}

function kill(sim: Sim, m: Mutant): void {
  m.dead = true;
  m.gone = 0;
  m.ride = null;
  sim.game.kills++;
  /* the body goes out of the world: what is left is not in anyone's way */
  if (m.body) {
    const k = sim.world.dyn.indexOf(m.body.dyn);
    if (k >= 0) sim.world.dyn.splice(k, 1);
  }
}
