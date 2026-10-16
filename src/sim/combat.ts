import { wstats, type WeaponStats } from '../content/items';
import { clamp } from '../core/math';
import { STEP } from '../core/loop';
import type { Dyn } from '../world/world';
import { hitMutant, type Mutant } from './cast';
import { consume, makeNoise, say, sfx } from './game';
import { push } from './body';
import { closing, POISE, react, REEL, regain, SHOVE, swingOf, type Swing } from './moves';
import type { Input } from './input';
import { eyeHeight } from './player';
import type { Sim } from './sim';

export { wstats, type WeaponStats };

/* Your hands (engine.md §8; §6, F2). A swing is two motions: the arm comes up (the load, as long as the weight in it
   takes), and the blow comes down. Every blow of a weapon is the same blow, in full, at the pace its weight allows:
   click, and it swings as soon as the arm is up; hold, and it stays up until you let go. There are no half blows. A
   blow that lands stops the swing for a moment (hit-stop), so you feel it land. A gun fires on the press.

   Once thrown, a blow is committed (sim/moves.ts): it goes along the line you let it go on, wherever you look after;
   a full one carries you a step forward, and one that meets nothing leaves you longer coming back. A load can be held
   as long as you like, and nothing that hits you takes a load or a blow from you. A hit takes poise, though: enough of
   it and you reel, thrown back and slowed, and cannot start another load until you have your feet. A press while you
   are busy is kept a moment, so a blow can follow a blow. */

export interface Hands {
  /** seconds a swing has been loading; -1 when not */
  chg: number;
  full: boolean;
  /** let go before the arm was up: the blow goes as soon as it is */
  go: boolean;
  /** a swing under way: how far through, how long it takes, whether it has struck, and whether it met anything */
  swing: { t: number; dur: number; done: boolean; missed?: boolean } | null;
  /** the line a thrown blow goes along, fixed as you let it go */
  line: { yaw: number; pitch: number } | null;
  /** after a blow that met nothing, the arm coming back: no new swing until it is in */
  rec: number;
  /** a blow has landed: the swing holds still this long */
  stop: number;
  /** a gun's cooldown */
  gcd: number;
  /** a gun's kick, 1 dying to 0, and its flash */
  kick: number;
  muzzle: number;
  /** the button was down last step */
  held: boolean;
  /** a press while busy, kept this much longer */
  buf: number;
  /** your poise, seconds since you were last hit, and seconds left of reeling */
  poise: number;
  calm: number;
  stag: number;
}

export const makeHands = (): Hands => ({
  chg: -1, full: false, go: false, swing: null, line: null, rec: 0, stop: 0, gcd: 0, kick: 0, muzzle: 0, held: false, buf: 0,
  poise: POISE.you, calm: 99, stag: 0,
});

/** how long a press is kept while you are busy (s) */
const BUF = 0.2;

const dt = STEP;
const wet = (sim: Sim) => sim.player.water !== 'dry';
export const loadTime = (sim: Sim, w: WeaponStats) => (w.time + 0.15) * (wet(sim) ? 1.3 : 1);
const swingFor = (w: WeaponStats) => swingOf(w.kind, w.mass);

/** you are open: a blow of yours thrown, your arm coming back, or you reeling. What waits for its turn goes now. */
export const exposed = (sim: Sim): boolean => {
  const h = sim.hands;
  return h.rec > 0 || h.stag > 0 || !!h.swing?.done;
};

/** your pace as a share of it: a third while you reel (sim/moves.ts, REEL); loading and swinging do not slow you */
export const pace = (sim: Sim): number => (sim.hands.stag > 0 ? REEL.pace : 1);

export function updateHands(sim: Sim, input: Input): void {
  const h = sim.hands, g = sim.game, w = wstats(g.weapon), S = swingFor(w);
  if (h.gcd > 0) h.gcd -= dt;
  if (h.kick > 0) h.kick = Math.max(0, h.kick - dt * 5);
  if (h.muzzle > 0) h.muzzle -= dt;
  if (h.rec > 0) h.rec -= dt;
  if (h.stag > 0) h.stag = Math.max(0, h.stag - dt);
  if (h.buf > 0) h.buf -= dt;
  h.calm += dt;
  h.poise = regain(h.poise, POISE.you, h.calm, dt);
  const press = input.attack && !h.held, release = !input.attack && h.held;
  h.held = input.attack;
  if (w.gun) { h.chg = -1; h.swing = null; if (press && h.stag <= 0) fire(sim, w); return; }
  const free = !h.swing && h.chg < 0 && h.rec <= 0 && h.stag <= 0;
  if (press && !free) h.buf = BUF;
  /* a buffered press starts the load whether or not it is still held: let go already, it is a click */
  if (free && (press || h.buf > 0)) { h.chg = 0; h.full = false; h.go = !input.attack; h.buf = 0; }
  if (h.chg >= 0) {
    h.chg += dt;
    if (release) h.go = true;
    if (h.chg >= loadTime(sim, w) && !h.full) { h.full = true; if (!h.go) sfx(g, 'load'); }
    /* up, and let go of: down it comes, along the way you face now */
    if (h.full && h.go) {
      h.chg = -1; h.full = false; h.go = false;
      h.swing = { t: 0, dur: (0.2 + 0.05 * w.mass) * (wet(sim) ? 1.3 : 1), done: false };
      h.line = { yaw: sim.player.yaw, pitch: sim.player.pitch };
      sfx(g, 'swing');
    }
  }
  const s = h.swing;
  if (s) {
    if (h.stop > 0) h.stop -= dt;
    else s.t += dt;
    const q = Math.min(1, s.t / s.dur);
    if (q >= (g.weapon ? 0.45 : 0.4) && !s.done) { s.done = true; s.missed = !strike(sim, w); lunge(sim, S); }
    if (q >= 1) {
      h.swing = null; h.line = null;
      if (s.missed) h.rec = S.miss;
    }
  }
}

/** a blow carries you a step along it */
function lunge(sim: Sim, S: Swing): void {
  const L = sim.hands.line;
  if (!L || !sim.player.body.ground) return;
  push(sim.player.body, -Math.sin(L.yaw) * S.lunge, -Math.cos(L.yaw) * S.lunge);
}

/** a blow lands on you, with `poise` behind it: the ladder (sim/moves.ts). It takes no load and no blow from you; if
 *  it breaks your poise, you reel: thrown back from it, slowed, and no new load until you have your feet. */
export function struck(sim: Sim, poise: number, from?: { x: number; z: number }): void {
  const h = sim.hands, g = sim.game;
  if (g.ended) return;
  const R = react(h.poise, POISE.you, poise, 0);
  h.poise = R.left; h.calm = 0;
  if (R.r !== 'stagger') return;
  h.stag = REEL.you;
  sfx(g, 'reel');
  g.events.push({ type: 'shake', k: 0.35 });
  const b = sim.player.body;
  if (from) { const dx = b.x - from.x, dz = b.z - from.z, d = Math.hypot(dx, dz) || 1; push(b, (dx / d) * REEL.push, (dz / d) * REEL.push); }
}

const seeThrough = (d: Dyn) => d.kind === 'body';

/** where you look from and which way: for a blow under way, the line it was let go on */
function aim(sim: Sim) {
  const p = sim.player, b = p.body, L = sim.hands.line ?? p, cp = Math.cos(L.pitch);
  return { ex: b.x, ey: b.y + eyeHeight(p), ez: b.z, fx: -Math.sin(L.yaw) * cp, fy: Math.sin(L.pitch), fz: -Math.cos(L.yaw) * cp };
}

/** a grabber's head, the only part of it worth hitting */
const headOf = (m: Mutant) => ({ x: m.x + Math.sin(m.yaw) * 0.22, y: m.y + 2.02, z: m.z + Math.cos(m.yaw) * 0.22 });

/** how well a swing is aimed at a point: how near the crosshair it is, and a little how near you */
function aimedAt(A: ReturnType<typeof aim>, x: number, y: number, z: number): { d: number; score: number } {
  const dx = x - A.ex, dy = y - A.ey, dz = z - A.ez, d = Math.hypot(dx, dy, dz) || 1e-3;
  return { d, score: (dx * A.fx + dy * A.fy + dz * A.fz) / d - 0.08 * d };
}

/* A swing lands on whatever in reach is nearest the crosshair (and, between two about as near it, the nearer one),
   so with two in front of you, you choose which you hit by looking at it. */
function strike(sim: Sim, w: WeaponStats): boolean {
  const g = sim.game, b = sim.player.body, A = aim(sim), yaw = sim.hands.line?.yaw ?? sim.player.yaw, pfx = -Math.sin(yaw), pfz = -Math.cos(yaw);
  let best: Mutant | null = null, bs = -1e9;
  for (const m of sim.cast) {
    if (m.dead) continue;
    if (m.fixed) {
      /* only the head counts, and you have to be looking at it */
      const H = headOf(m), t = aimedAt(A, H.x, H.y, H.z);
      if (t.d > w.reach + 0.75 || t.score + 0.08 * t.d < 0.88) continue;
      if (t.score > bs) { bs = t.score; best = m; }
      continue;
    }
    const dx = m.x - b.x, dz = m.z - b.z, d = Math.hypot(dx, dz);
    if (d - m.r > w.reach || Math.abs(b.y - m.y) > 1.8) continue;
    if (d > m.r && (dx * pfx + dz * pfz) / d < 0.6) continue;
    const ty = m.y + Math.min(0.9, (m.body?.h ?? 1) * 0.6);
    if (sim.world.raycast(A.ex, A.ey, A.ez, m.x, ty, m.z, seeThrough) < 1) continue;
    const t = aimedAt(A, m.x, ty, m.z);
    if (t.score > bs) { bs = t.score; best = m; }
  }
  if (best) {
    /* how fast you and it were closing along the blow: you running in, it coming at you (sim/moves.ts, closing) */
    const you = b.vx * pfx + b.vz * pfz, it = best.fixed ? 0 : -((best.x - best.px) * pfx + (best.z - best.pz) * pfz) / dt;
    hitMutant(sim, best, { dmg: w.dmg, poise: swingFor(w).poise, shove: SHOVE.you * (w.mass + SHOVE.arm) }, closing(you + it));
    makeNoise(g, 10);
    landed(sim, 1);
    return true;
  }
  /* nothing there but the wall */
  const r = w.reach - 0.3, cy = A.ey - 0.3;
  const hit = sim.world.raycast(A.ex, cy, A.ez, A.ex + pfx * r, cy, A.ez + pfz * r, seeThrough);
  if (hit < 1) { sfx(g, 'blow', { x: A.ex + pfx * r * hit, y: cy, z: A.ez + pfz * r * hit }); makeNoise(g, 8); landed(sim, 0.6); return true; }
  return false;
}

/** a blow met something: the swing stops for a moment, and the view takes the jolt */
function landed(sim: Sim, k: number): void {
  sim.hands.stop = 0.035 + 0.035 * k;
  sim.game.events.push({ type: 'impact', k });
}

function fire(sim: Sim, w: WeaponStats): void {
  const h = sim.hands, g = sim.game;
  if (h.gcd > 0) return;
  if (sim.player.under) { say(g, 'It will not fire under water.'); h.gcd = 0.5; return; }
  const i = g.inv.findIndex(s => s.id === w.ammo);
  if (i < 0) { sfx(g, 'deny'); say(g, 'Empty.'); h.gcd = 0.5; return; }
  consume(g, i);
  const big = w.dmg > 50, range = w.range ?? 20;
  h.gcd = w.cd ?? 0.5; h.kick = 1; h.muzzle = 0.06;
  sfx(g, big ? 'boom' : 'shot');
  makeNoise(g, 36);
  g.events.push({ type: 'shake', k: big ? 0.3 : 0.12 });
  const A = aim(sim);
  let best: Mutant | null = null, bd = 1e9;
  for (const m of sim.cast) {
    if (m.dead) continue;
    const dx = m.x - A.ex, dz = m.z - A.ez, d = Math.hypot(dx, dz);
    if (d > range) continue;
    const ty = m.fixed ? headOf(m).y : m.y + Math.min(0.9, (m.body?.h ?? 1) * 0.6), hy = ty - A.ey;
    const dot = (dx * A.fx + hy * A.fy + dz * A.fz) / Math.hypot(dx, hy, dz);
    if (dot < (w.cone ?? 0.98) && d > m.r + 0.8) continue;
    if (sim.world.raycast(A.ex, A.ey, A.ez, m.x, ty, m.z, seeThrough) < 1) continue;
    if (d < bd) { bd = d; best = m; }
  }
  if (best) hitMutant(sim, best, { dmg: w.dmg * (big ? clamp(1.2 - bd / range, 0.25, 1) : 1), poise: big ? 60 : 22, shove: big ? 300 : 40 }, 1);
}
