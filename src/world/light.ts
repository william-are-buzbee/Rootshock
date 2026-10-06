import type { CircuitDef, RoomDef } from '../content/types';
import { BLACK, scale3, type Colour } from '../core/math';
import type { World } from './world';

/* Light, as the first engine had it. Every room is lit by its rule (RoomDef.lit) and its circuit's power; doorways
   borrow from the rooms either side; lamps make pools of their own in their room. The renderer bakes this into the
   level's vertices, and the sim will read the same numbers for how visible you are (engine.md §11). */

/** 2: fed by Gen-1 through a good service connection. 1: its own backup set (dim, halls only, no heavy doors). 0: dead. */
export type PowerLevel = 0 | 1 | 2;
export type Power = (circuit: string) => PowerLevel;

/** the power on each circuit, from the circuits' state and whether Gen-1 runs */
export function stationPower(circuits: Record<string, CircuitDef>, main: boolean): Power {
  return c => {
    const C = circuits[c];
    if (!C) return 0;
    if (main && C.on && !C.broken) return 2;
    return C.back ? 1 : 0;
  };
}

/** everything on: for looking at a level as built (?power=full) */
export const fullPower: Power = () => 2;

/** how a ceiling fitting throws its room's light: down (falling off as the cube of the angle from straight down) and
 *  out (as r² / (r² + d²)); a point gets `base` of its room's light plus `gain` times what its fittings throw at it,
 *  so the floor under a fitting is lit above the room's level and a corner or the ceiling below it. The shader does the
 *  same sum per pixel (render/shader.ts); the sim and everything that moves ask `lit` (engine.md §11). */
export const POOL = { r2: 9, base: 0.55, gain: 1.3 };

/** emergency lighting's cast: amber, so a room on its backup set says so at a glance */
const EMERGENCY: Colour = [1, 0.68, 0.45];

/** a room's own light under the given power. On a backup set, its emergency lights: two fifths as bright, amber, and
 *  (since the cast see by the brightest channel) exactly as easy to be seen by as the white they replace. */
export function roomLight(R: RoomDef, power: Power): Colour {
  if (R.lit === 'always') return R.lc;
  if (R.lit === 'none') return BLACK;
  const l = power(R.circuit);
  if (l === 2) return R.lc;
  if (l !== 1 || !R.em) return BLACK;
  const c: Colour = [R.lc[0] * EMERGENCY[0], R.lc[1] * EMERGENCY[1], R.lc[2] * EMERGENCY[2]], top = Math.max(...c);
  return top > 0 ? scale3(c, (0.4 * Math.max(...R.lc)) / top) : BLACK;
}

export class Lighting {
  private rooms: Colour[];
  /** for each room, the lamps that stand in it */
  private lamps = new Map<number, { x: number; z: number; r: number; c: Colour }[]>();
  /** for each room, its ceiling fittings (not in rooms lit by lamps of their own) */
  private fix = new Map<number, { x: number; y: number; z: number }[]>();

  constructor(private w: World, readonly power: Power) {
    this.rooms = w.rooms.map(R => roomLight(R, power));
    /* a doorway is lit by what is either side of it, a little less */
    for (const R of w.rooms) {
      if (!R.doorway) continue;
      const near = w.neighbours(R.id).filter(n => !w.rooms[n].doorway);
      if (!near.length) continue;
      const sum = [0, 0, 0];
      for (const n of near) for (let k = 0; k < 3; k++) sum[k] += this.rooms[n][k];
      this.rooms[R.id] = scale3(sum as unknown as Colour, 0.8 / near.length);
    }
    for (const L of w.def.lamps) {
      const R = w.roomAt(L.x, L.y + 0.1, L.z) ?? w.roomAt(L.x, L.y + 1, L.z);
      if (!R) continue;
      let a = this.lamps.get(R.id);
      if (!a) this.lamps.set(R.id, (a = []));
      a.push({ x: L.x, z: L.z, r: L.r, c: L.colour });
    }
    for (const F of w.def.fixtures ?? []) {
      const R = w.roomAt(F.x, F.y - 0.3, F.z);
      if (!R || this.lamps.has(R.id)) continue;
      let a = this.fix.get(R.id);
      if (!a) this.fix.set(R.id, (a = []));
      a.push(F);
    }
  }

  /** the rooms that have fittings, and each one's fittings */
  get fixtures(): ReadonlyMap<number, readonly { x: number; y: number; z: number }[]> {
    return this.fix;
  }

  /** how much of its room's light reaches a point, by where it stands to the room's fittings: 1 where it has none */
  pool(room: number, x: number, y: number, z: number): number {
    const F = this.fix.get(room);
    if (!F) return 1;
    let s = 0;
    for (const f of F) {
      const dx = x - f.x, dy = f.y - y, dz = z - f.z;
      if (dy <= 0) continue;
      const d2 = dx * dx + dy * dy + dz * dz, c = dy / Math.sqrt(d2);
      s += (c * c * c * POOL.r2) / (POOL.r2 + d2);
    }
    return POOL.base + POOL.gain * Math.min(s, 1);
  }

  /** the light at a point in a room: its own (or a lamp's), in its fittings' pools */
  lit(room: number, x: number, y: number, z: number): Colour {
    return scale3(this.at(room, x, z), this.pool(room, x, y, z));
  }

  hasLamps(room: number): boolean {
    return this.lamps.has(room);
  }

  /** the light at (x, z) in a room: the room's own, or a lamp's pool where that is brighter */
  at(room: number, x: number, z: number): Colour {
    const base = this.rooms[room] ?? BLACK, lamps = this.lamps.get(room);
    if (!lamps) return base;
    const out: [number, number, number] = [base[0], base[1], base[2]];
    for (const L of lamps) {
      const d = Math.hypot(x - L.x, z - L.z);
      if (d >= L.r) continue;
      const f = 1 - d / L.r;
      for (let k = 0; k < 3; k++) out[k] = Math.max(out[k], L.c[k] * f);
    }
    return out;
  }

  /** the light at a point anywhere: by the room it is in, and where it stands to that room's fittings */
  atPoint(x: number, y: number, z: number): Colour {
    const R = this.w.roomAt(x, y, z);
    return R ? this.lit(R.id, x, y, z) : BLACK;
  }

  /** a fitting's colour: dead or live by its circuit */
  fitting(pw: [Colour, Colour], circuit: string): Colour {
    return pw[this.power(circuit) > 0 ? 1 : 0];
  }

  /** a fitting's colour where it hangs (a light coming on room by room may say otherwise; present/cascade.ts) */
  fittingIn(pw: [Colour, Colour], circuit: string, _room: number): Colour {
    return this.fitting(pw, circuit);
  }
}
