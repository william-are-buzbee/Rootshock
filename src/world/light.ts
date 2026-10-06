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

/** a room's own light under the given power */
export function roomLight(R: RoomDef, power: Power): Colour {
  if (R.lit === 'always') return R.lc;
  if (R.lit === 'none') return BLACK;
  const l = power(R.circuit);
  return l === 2 ? R.lc : l === 1 && R.em ? scale3(R.lc, 0.4) : BLACK;
}

export class Lighting {
  private rooms: Colour[];
  /** for each room, the lamps that stand in it */
  private lamps = new Map<number, { x: number; z: number; r: number; c: Colour }[]>();

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

  /** the light at a point anywhere: by the room it is in */
  atPoint(x: number, y: number, z: number): Colour {
    const R = this.w.roomAt(x, y, z);
    return R ? this.at(R.id, x, z) : BLACK;
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
