import { wstats, type WeaponStats } from '../content/items';
import { clamp } from '../core/math';
import { STEP } from '../core/loop';
import type { Dyn } from '../world/world';
import { hitMutant, type Mutant } from './cast';
import { consume, makeNoise, say, sfx } from './game';
import type { Input } from './input';
import { eyeHeight } from './player';
import type { Sim } from './sim';

export { wstats, type WeaponStats };

/* Your hands (engine.md §8). A swing is two motions: hold to load it, let go to throw it. Let go early and it is a jab:
   quicker to throw, weaker, and it leaves your arm slow to come back, so it pushes something off you but does not
   win a fight. A blow that lands stops the swing for a moment (hit-stop), so you feel it land. A gun fires on the
   press. */

export interface Hands {
  /** seconds a swing has been loading; -1 when not */
  chg: number;
  full: boolean;
  swing: { t: number; dur: number; done: boolean; pow: number } | null;
  /** after a jab, the arm coming back: no new swing until it is in */
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
}

export const makeHands = (): Hands => ({ chg: -1, full: false, swing: null, rec: 0, stop: 0, gcd: 0, kick: 0, muzzle: 0, held: false });

/** a jab: how hard, at the least and as it nears a full load; how long the arm takes to come back */
const JAB = { min: 0.25, max: 0.7, rec: 0.3 };

const dt = STEP;
const wet = (sim: Sim) => sim.player.water !== 'dry';
export const loadTime = (sim: Sim, w: WeaponStats) => (w.time + 0.15) * (wet(sim) ? 1.3 : 1);

export function updateHands(sim: Sim, input: Input): void {
  const h = sim.hands, g = sim.game, w = wstats(g.weapon);
  if (h.gcd > 0) h.gcd -= dt;
  if (h.kick > 0) h.kick = Math.max(0, h.kick - dt * 5);
  if (h.muzzle > 0) h.muzzle -= dt;
  if (h.rec > 0) h.rec -= dt;
  const press = input.attack && !h.held, release = !input.attack && h.held;
  h.held = input.attack;
  if (w.gun) { h.chg = -1; h.swing = null; if (press) fire(sim, w); return; }
  if (press && !h.swing && h.chg < 0 && h.rec <= 0) { h.chg = 0; h.full = false; }
  if (h.chg >= 0) {
    h.chg += dt;
    if (h.chg >= loadTime(sim, w) && !h.full) { h.full = true; sfx(g, 'load'); }
  }
  if (release && h.chg >= 0) {
    const f = h.chg / loadTime(sim, w), pow = f >= 1 ? 1 : JAB.min + (JAB.max - JAB.min) * f;
    h.chg = -1;
    h.swing = { t: 0, dur: (0.2 + 0.05 * w.mass) * (wet(sim) ? 1.3 : 1) * (pow < 1 ? 0.8 : 1), done: false, pow };
    sfx(g, 'swing');
  }
  const s = h.swing;
  if (s) {
    if (h.stop > 0) h.stop -= dt;
    else s.t += dt;
    const q = Math.min(1, s.t / s.dur);
    if (q >= (g.weapon ? 0.45 : 0.4) && !s.done) { s.done = true; strike(sim, w, s.pow); }
    if (q >= 1) { h.swing = null; if (s.pow < 1) h.rec = JAB.rec; }
  }
}

const seeThrough = (d: Dyn) => d.kind === 'body';

/** where you look from and which way */
function aim(sim: Sim) {
  const p = sim.player, b = p.body, cp = Math.cos(p.pitch);
  return { ex: b.x, ey: b.y + eyeHeight(p), ez: b.z, fx: -Math.sin(p.yaw) * cp, fy: Math.sin(p.pitch), fz: -Math.cos(p.yaw) * cp };
}

/** a grabber's head, the only part of it worth hitting */
const headOf = (m: Mutant) => ({ x: m.x + Math.sin(m.yaw) * 0.22, y: m.y + 2.02, z: m.z + Math.cos(m.yaw) * 0.22 });

function strike(sim: Sim, w: WeaponStats, pow: number): void {
  const g = sim.game, b = sim.player.body, A = aim(sim), pfx = -Math.sin(sim.player.yaw), pfz = -Math.cos(sim.player.yaw);
  let best: Mutant | null = null, bd = 1e9;
  for (const m of sim.cast) {
    if (m.dead) continue;
    if (m.fixed) {
      /* only the head counts, and you have to be looking at it */
      const H = headOf(m), hx = H.x - A.ex, hy = H.y - A.ey, hz = H.z - A.ez, hd = Math.hypot(hx, hy, hz);
      if (hd > w.reach + 0.75 || (hx * A.fx + hy * A.fy + hz * A.fz) / hd < 0.88) continue;
      if (hd < bd) { bd = hd; best = m; }
      continue;
    }
    const dx = m.x - b.x, dz = m.z - b.z, d = Math.hypot(dx, dz);
    if (d - m.r > w.reach || Math.abs(b.y - m.y) > 1.8) continue;
    if (d > m.r && (dx * pfx + dz * pfz) / d < 0.6) continue;
    const ty = m.y + Math.min(0.9, (m.body?.h ?? 1) * 0.6);
    if (sim.world.raycast(A.ex, A.ey, A.ez, m.x, ty, m.z, seeThrough) < 1) continue;
    if (d < bd) { bd = d; best = m; }
  }
  if (best) {
    hitMutant(sim, best, w, pow);
    makeNoise(g, 6 + 4 * pow);
    landed(sim, 0.3 + 0.7 * pow);
    return;
  }
  /* nothing there but the wall */
  const r = w.reach - 0.3, cy = A.ey - 0.3;
  if (sim.world.raycast(A.ex, cy, A.ez, A.ex + pfx * r, cy, A.ez + pfz * r, seeThrough) < 1) { sfx(g, 'clang'); makeNoise(g, 8); landed(sim, 0.6); }
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
  if (best) hitMutant(sim, best, { dmg: w.dmg * (big ? clamp(1.2 - bd / range, 0.25, 1) : 1), stun: 0.5 }, 1);
}
