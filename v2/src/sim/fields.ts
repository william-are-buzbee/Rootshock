import { buildNav, field, type Nav, type Rules } from '../world/nav';
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
   A refuge (`safe`) is only kept out of the cast's rounds; a hunter follows you into one, as it always did. */

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
  /** for each kind of body, the spots too low for it */
  low: Record<Walker, Uint8Array>;
  /** the spots in each door */
  doorSpots: number[][];
  /** the rules each kind walks by, made once a step at most */
  rules: Record<Walker | 'sound', { tick: number; R: Rules }>;
  /** what each field was last made from */
  made: Record<string, string>;
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
  const lowFor = (h: number) => { const a = new Uint8Array(n); for (let i = 0; i < n; i++) if (nav.head[i] < h) a[i] = 1; return a; };
  const doorSpots: number[][] = sim.doors.map(() => []);
  for (let i = 0; i < n; i++) if (nav.door[i] >= 0) doorSpots[nav.door[i]].push(i);
  const rules = (enter: boolean) => ({ tick: -1, R: { blocked: new Uint8Array(n), enter: enter ? new Float32Array(n) : null, lifts: new Uint8Array(sim.platforms.length), drop: enter ? 0 : 0.5 } });
  return {
    nav, crawl: inf(), hands: inf(), big: inf(), sound: inf(), onLift, from: -1, turn: 0,
    low: { crawl: lowFor(HEAD.crawl), hands: lowFor(HEAD.hands), big: lowFor(HEAD.big) }, doorSpots,
    rules: { crawl: rules(false), hands: rules(false), big: rules(false), sound: rules(true) }, made: {},
  };
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

/** the rules for one kind of body as the doors and platforms stand now: made once a step at most, and shared */
export function rulesFor(sim: Sim, F: Fields, who: Walker): Rules {
  const c = F.rules[who];
  if (c.tick === sim.tick) return c.R;
  const R = c.R;
  R.blocked.set(F.low[who]);
  sim.doors.forEach((d, k) => { if (!doorPasses(sim, d, who)) for (const i of F.doorSpots[k]) R.blocked[i] = 1; });
  sim.platforms.forEach((p, k) => { R.lifts[k] = liftPasses(sim, p, who) ? 1 : 0; });
  c.tick = sim.tick;
  return R;
}

/** sound goes where air goes: through open doors freely, through shut ones muffled; not up a lift shaft's ride */
function soundRules(sim: Sim, F: Fields): Rules {
  const R = F.rules.sound.R, e = R.enter!;
  sim.doors.forEach((d, k) => {
    const v = d.t > 0.5 ? 0 : d.def.kind === 'heavy' || d.def.seal ? 12 : 6;
    for (const i of F.doorSpots[k]) e[i] = v;
  });
  return R;
}

/** how far out each field is worth making: past it nothing could use it. A hunt is given up long before 90 m of
 *  corridor; the loudest thing you do (a gun) carries 36. */
const LIMIT = { crawl: 90, hands: 90, big: 90, sound: 40 } as const;
type Which = keyof typeof LIMIT;
const ORDER: Which[] = ['crawl', 'hands', 'big', 'sound'];

/** what a field was last made from: where you stood and how the doors and platforms stood */
function stateKey(sim: Sim, F: Fields, w: Which): string {
  let k = String(F.from);
  if (w === 'sound') { for (const d of sim.doors) k += d.t > 0.5 ? '1' : '0'; return k; }
  const R = rulesFor(sim, F, w);
  sim.doors.forEach((_d, i) => { const s = F.doorSpots[i]; k += s.length && R.blocked[s[0]] ? '0' : '1'; });
  for (const l of R.lifts) k += l;
  return k;
}

/** a step of upkeep: the next field in turn, made again only if you have moved or a door or platform has changed */
export function updateFields(sim: Sim, F: Fields): void {
  const b = sim.player.body, at = F.nav.locate(b.x, b.y, b.z);
  if (at >= 0) F.from = at;
  if (F.from < 0) return;
  const w = ORDER[F.turn++ % 4], key = stateKey(sim, F, w);
  if (F.made[w] === key) return;
  F.made[w] = key;
  field(F.nav, F.from, w === 'sound' ? soundRules(sim, F) : rulesFor(sim, F, w), F[w], LIMIT[w]);
}

/** all four now (at the start, or after a jump in place) */
export function refreshFields(sim: Sim, F: Fields): void {
  for (let k = 0; k < 4; k++) updateFields(sim, F);
}
