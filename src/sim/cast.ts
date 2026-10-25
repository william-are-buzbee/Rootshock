import type { MutantDef, RoundStop } from '../content/types';
import { clamp, PI, TAU } from '../core/math';
import { STEP } from '../core/loop';
import { fall, makeBody, push, settle, type Body } from './body';
import { makeFields, refreshFields, type Walker } from './fields';
import { DOWN, FALL, MOVES, POISE, regain } from './moves';
import type { Sim } from './sim';
import type { Rag } from './ragdoll';
import { away, chargeMove, chase, drive, go, rnd, roomWp, step_, turnTo } from './cast/move';
import { hears, inBeam, seeP, sight } from './cast/senses';
import { battered, beginBlow, blowKind, blowStep, frontOf, inStart, strikes, type Blow } from './cast/blows';
import { husk, updateDrills } from './cast/husk';
import { patient, ROUND, swingTorch } from './cast/round';

/* The cast (engine.md §7, §8): what lives in the station, ported from the first engine's behaviours. Each is a body that
   walks like yours, so it has weight, falls, rides platforms and is stopped by what stops you; they block each other
   and you. They find their way over the nav graph's fields, see along lines of sight scaled by the light you stand in,
   and hear what you do as far as the sound of it carries through the rooms between.

   Here: their kinds, their making, and a step of them all. Their parts are in cast/: getting about (move.ts), seeing
   and hearing you (senses.ts), the fight (blows.ts), Security's staff (husk.ts), and the night round and the other
   patient (round.ts). What the rest of the game uses of those parts it takes from here. The parts take only types from
   this file, so the AI table below finds every behaviour made. */
export { restoreRoute, rounds } from './cast/move';
export { blowAt, blowKind, DEATH, hitMutant, inBlow, killAll, shoved, type Blow, type BlowKind, type BlowPhase, type Hit } from './cast/blows';
export { answer, drill, free, type Drill } from './cast/husk';
export { BANG, BEAT, BLOOD, GRAFT, leftGrafted, noiseAt, PEER, READER, ROUND, stutters, TORCH, torchRay } from './cast/round';

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
  /** its flashlight is on in its hand, and how far down it holds it (rad: cast/round.ts, swingTorch) */
  torch: boolean; tp: number;
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
  /** the least way left (m) a roam has come to on its route: one held up is told from one getting on by it */
  near: number;
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
  /** seconds left of being held still by a blow that landed (sim/moves.ts, HITSTOP) */
  stop: number;
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
      round: (def.opts.round as RoundStop[] | undefined) ?? null, beat: 0, lap: 0, peered: 99, torch: !!S.torch, tp: ROUND.pitch,
      hide: (def.opts.hide as { x: number; z: number } | undefined) ?? null, drag: -1, trail: 0, graft: 0, grafted: false,
      wt: rnd(1, 5), wm: 0, wx: 0, wz: 0, tk: 0, lost: 0, bt: 0, burst: false, flee: 0, ct: rnd(6, 14), cdir: 0, tgt: false,
      grab: 0, tense: 0, blow: null, dest: -1, F: null, stk: 0, near: 1e9, fled: false, side: 0, ride: null, spot: -1,
      mv: 0, d: 99, dp: 99, dy: 0, los: false, losAt: -99, hit: 0, stop: 0, poise: poiseOf(def.type, S.ai, !!o.big), pmax: poiseOf(def.type, S.ai, !!o.big), calm: 99, reel: 0, pat: 0, down: 0, rise: 0, acc: S.acc, drove: false, ph: rnd(9), dead: false, gone: 0, rag: null, away: false, still: 0,
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

/* ---- the behaviours, as the first engine had them */

const AI: Record<Ai, (sim: Sim, m: Mutant) => void> = {
  husk,

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
      }
    } else m.tense = Math.max(0, m.tense - dt * 2);
  },
  patient,
};

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
    /* held still by a blow that landed (sim/moves.ts, HITSTOP): nothing about it goes on, and the shove waits. One gone
       loose is held, and its hold run down, with the loose bodies (sim/ragdoll.ts, updateCorpses) */
    if (m.stop > 0) { if (!m.rag) m.stop = Math.max(0, m.stop - dt); continue; }
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
    if (m.torch) swingTorch(sim, m);
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
