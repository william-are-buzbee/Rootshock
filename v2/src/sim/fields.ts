import { buildNav, Edge, field, type Nav, type Pass } from '../world/nav';
import { power } from './game';
import { locked, type Door, type Platform } from './movers';
import type { Sim } from './sim';

/* How far every spot is from you, for each kind of body, and for sound (engine.md §7, §8). Kept fresh in rotation: one
   field a step, so each is at most a few steps old and no single step pays for all of them.

   Who passes a door (as the first engine had it):
   - crawl: a door that is open, or jammed part open (they go under), or one that opens by itself for anything near;
   - hands: any door a hand can work: not welded, not a panel, not the lift's, not jammed, not heavy, not locked;
   - big: no doors at all. They are too big for the frames.
   Platforms: anything rides one that goes by itself; a hand can call one that has power.
   A refuge is on the graph like anywhere else, so a field still leads to you there; the cast stop at its threshold. */

export type Walker = 'crawl' | 'hands' | 'big';
/** the headroom each needs */
export const HEAD: Record<Walker, number> = { crawl: 1, hands: 1.8, big: 2.2 };

export interface Fields {
  nav: Nav;
  crawl: Float32Array;
  hands: Float32Array;
  big: Float32Array;
  /** how far a sound made where you are travels to each spot: closed doors muffle it */
  sound: Float32Array;
  /** spots on a platform at its low end: which platform, or -1 */
  onLift: Int16Array;
  /** the spot you were on when they were made */
  from: number;
  turn: number;
}

/* the graph depends only on the level's fixed shape, so every run of a level shares one */
const navs = new WeakMap<object, Nav>();

export function makeFields(sim: Sim): Fields {
  const def = sim.world.def;
  let nav = navs.get(def);
  if (!nav) navs.set(def, (nav = buildNav(sim.world, sim.doors.map(d => d.def), sim.platforms.map(p => p.def))));
  const n = nav.n, inf = () => new Float32Array(n).fill(Infinity);
  const onLift = new Int16Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    sim.platforms.forEach((p, k) => {
      const D = p.def;
      if (nav.x[i] > D.x0 && nav.x[i] < D.x1 && nav.z[i] > D.z0 && nav.z[i] < D.z1 && Math.abs(nav.y[i] - D.y0) < 0.4) onLift[i] = k;
    });
  }
  return { nav, crawl: inf(), hands: inf(), big: inf(), sound: inf(), onLift, from: -1, turn: 0 };
}

const isOpen = (d: Door) => d.t > 0.9;
/** a light door on a live circuit, not locked: it opens for whatever comes near */
export const opensItself = (d: Door, pw: number) => {
  const D = d.def;
  return D.kind === 'light' && !(D.stuck || D.vent || D.seal || D.lift) && pw > 0 && !locked(d, pw);
};
/** a door no hand can work */
export const doorShut = (d: Door, pw: number) => {
  const D = d.def;
  return D.seal || D.vent || D.lift || D.stuck || D.kind === 'heavy' || locked(d, pw);
};

/** may a body of this kind enter the door it is walking into? */
export function doorPasses(sim: Sim, d: Door, who: Walker): boolean {
  if (who === 'big') return false;
  if (isOpen(d)) return true;
  const pw = power(sim.game, d.def.circuit);
  if (opensItself(d, pw)) return true;
  return who === 'crawl' ? d.def.stuck : !doorShut(d, pw);
}

/** may it take this platform? */
export function liftPasses(sim: Sim, p: Platform, who: Walker): boolean {
  if (!p.def.call) return true;
  return who === 'hands' && power(sim.game, p.def.call.circuit) > 0;
}

export function passFor(sim: Sim, F: Fields, who: Walker): Pass {
  const head = HEAD[who], nav = F.nav;
  return (_a, b, kind, lift) => {
    if (nav.head[b] < head) return null;
    const dr = nav.door[b];
    if (dr >= 0 && !doorPasses(sim, sim.doors[dr], who)) return null;
    if (kind === Edge.Lift && !liftPasses(sim, sim.platforms[lift], who)) return null;
    return kind === Edge.Drop ? 0.5 : 0;
  };
}

/** sound goes where air goes: through open doors freely, through shut ones muffled; not up a lift shaft's ride */
export function soundPass(sim: Sim, nav: Nav): Pass {
  return (_a, b, kind) => {
    if (kind === Edge.Lift) return null;
    const dr = nav.door[b];
    if (dr < 0) return 0;
    const d = sim.doors[dr];
    if (d.t > 0.5) return 0;
    return d.def.kind === 'heavy' || d.def.seal ? 12 : 6;
  };
}

/** a step of upkeep: refresh one field, the next in turn */
export function updateFields(sim: Sim, F: Fields): void {
  const b = sim.player.body, at = F.nav.locate(b.x, b.y, b.z);
  if (at >= 0) F.from = at;
  if (F.from < 0) return;
  const which = F.turn++ % 4;
  if (which === 0) field(F.nav, F.from, passFor(sim, F, 'crawl'), F.crawl);
  else if (which === 1) field(F.nav, F.from, passFor(sim, F, 'hands'), F.hands);
  else if (which === 2) field(F.nav, F.from, passFor(sim, F, 'big'), F.big);
  else field(F.nav, F.from, soundPass(sim, F.nav), F.sound);
}

/** all four now (at the start, or after a jump in place) */
export function refreshFields(sim: Sim, F: Fields): void {
  for (let k = 0; k < 4; k++) updateFields(sim, F);
}
