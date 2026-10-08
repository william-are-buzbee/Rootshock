import type { CircuitDef, RoomDef } from '../content/types';
import { BLACK, scale3, type Colour } from '../core/math';
import { LCELL, LOFF, lightField, type LightField } from './lightField';
import type { World } from './world';

export { POOL } from './lightField';

/* Light, as the station has it under its power. Every room is lit by its rule (RoomDef.lit) and its circuit's power, in
   pools under its fittings, and its light reaches past it through its openings; lamps make pools of their own
   (world/lightField.ts has the shape of it all). The renderer draws by the same light, point by point, and the sim reads
   it for how visible you are (engine.md §11). */

/** 2: fed by Gen-1 through a good service connection. 1: its own backup set (dim, halls only, no heavy doors). 0: dead. */
export type PowerLevel = 0 | 1 | 2;
export type Power = (circuit: string) => PowerLevel;

/** the power on a circuit, from the circuits' state and whether Gen-1 runs. A branch has what the circuit feeding it
 *  has, through its connection; any circuit has at least what its own backup set gives. */
export function circuitPower(circuits: Record<string, CircuitDef>, main: boolean, c: string, depth = 0): PowerLevel {
  const C = circuits[c];
  if (!C) return 0;
  const fed: PowerLevel = !C.on || C.broken ? 0 : C.feed ? (depth < 8 ? circuitPower(circuits, main, C.feed, depth + 1) : 0) : main ? 2 : 0;
  return fed || (C.back ? 1 : 0);
}

/** the power on each circuit, from the circuits' state and whether Gen-1 runs */
export function stationPower(circuits: Record<string, CircuitDef>, main: boolean): Power {
  return c => circuitPower(circuits, main, c);
}

/** everything on: for looking at a level as built (?power=full) */
export const fullPower: Power = () => 2;

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

/** the 12 edges of a cube of 2³ points (corner c is x + 2y + 4z): the lower corner, and the axis along it */
const EDGES: [number, number][] = [];
for (let a = 0; a < 3; a++) for (let c = 0; c < 8; c++) if (!(c & (1 << a))) EDGES.push([c, a]);
/** the corners around a point being asked about, and their weights */
const P = new Int32Array(8), W = new Float64Array(8);

export class Lighting {
  readonly field: LightField;
  /** each room's own light, a doorway's from the rooms either side of it */
  private rooms: Colour[] | null = null;
  /** the light at each open point of the field, made when first asked for */
  private col: Float32Array | null = null;
  /** the colour each source is lit by in `col` */
  private lit: Colour[] = [];
  /** how far each door stands open in `col` (0 shut, 1 open) */
  readonly open: Float32Array;
  /** the bricks whose light has changed since last asked (lightVolume.ts) */
  private dirty = new Set<number>();

  /** `taken`: whether a thing lying about has been picked up, so a lamp it gives (a dropped flashlight) is out.
   *  `open`: how far each door stands open (by default, as the level has it) */
  constructor(protected w: World, readonly power: Power, private taken: (item: number) => boolean = () => false, open?: (door: number) => number) {
    this.field = lightField(w);
    this.open = Float32Array.from(w.def.doors, (D, d) => (open ? open(d) : D.open ? 1 : 0));
  }

  /** the rooms that have fittings, and each one's fittings */
  get fixtures(): ReadonlyMap<number, readonly { x: number; y: number; z: number }[]> {
    return this.field.fixtures;
  }

  /** a source's colour: its room's light, or its lamp's (out once the thing that gives it is taken) */
  colourOf(s: number): Colour {
    const S = this.field.sources[s];
    if (S.room >= 0) return roomLight(this.w.rooms[S.room], this.power);
    const L = this.w.def.lamps[S.lamp];
    return L.item !== undefined && this.taken(L.item) ? BLACK : L.colour;
  }

  /** a room's own light under this power; a doorway's, a little less than the rooms either side of it */
  room(id: number): Colour {
    if (!this.rooms) {
      const w = this.w, rooms = w.rooms.map(R => roomLight(R, this.power));
      for (const R of w.rooms) {
        if (!R.doorway) continue;
        const near = w.neighbours(R.id).filter(n => !w.rooms[n].doorway);
        if (!near.length) continue;
        const sum = [0, 0, 0];
        for (const n of near) for (let k = 0; k < 3; k++) sum[k] += rooms[n][k];
        rooms[R.id] = scale3(sum as unknown as Colour, 0.8 / near.length);
      }
      this.rooms = rooms;
    }
    return this.rooms[id] ?? BLACK;
  }

  /** the light at every open point of the field (r, g, b by point) */
  get colours(): Float32Array {
    if (!this.col) {
      const F = this.field;
      this.col = new Float32Array(F.n * 3);
      this.lit = F.sources.map(() => BLACK);
      this.recolour(F.sources.map((_, s) => s));
    }
    return this.col;
  }

  /** these sources may have changed colour: add the difference */
  protected recolour(sources: Iterable<number>): void {
    if (!this.col) return;
    const col = this.col, F = this.field, open = this.open;
    for (const s of sources) {
      const was = this.lit[s], now = this.colourOf(s), r = now[0] - was[0], g = now[1] - was[1], b = now[2] - was[2];
      this.lit[s] = now;
      if (!r && !g && !b) continue;
      const S = F.sources[s];
      for (let k = 0; k < S.pts.length; k++) {
        const i = S.pts[k] * 3, v = S.val[k];
        col[i] += r * v; col[i + 1] += g * v; col[i + 2] += b * v;
      }
      for (const sl of S.slots) this.dirty.add(sl);
      for (let k = 0; k < S.gpts.length; k++) {
        const p = S.gpts[k], i = p * 3, v = S.gval[k] * open[S.gdoor[k]];
        if (!v) continue;
        col[i] += r * v; col[i + 1] += g * v; col[i + 2] += b * v;
        this.dirty.add(F.pslot[p]);
      }
    }
  }

  /** the doors as they stand now (how far each is open): the light through any that has moved changes with it */
  follow(open: (door: number) => number): void {
    const F = this.field;
    for (let d = 0; d < this.open.length; d++) {
      const t = open(d), dt = t - this.open[d];
      if (dt === 0 || (Math.abs(dt) < 1e-3 && t > 0 && t < 1)) continue;
      this.open[d] = t;
      if (!this.col) continue;
      const col = this.col, D = F.doors[d];
      for (let k = 0; k < D.pts.length; k++) {
        const c = this.lit[D.src[k]], v = D.val[k] * dt, p = D.pts[k], i = p * 3;
        if (c === BLACK) continue;
        col[i] += c[0] * v; col[i + 1] += c[1] * v; col[i + 2] += c[2] * v;
        this.dirty.add(F.pslot[p]);
      }
    }
  }

  /** the bricks whose light has changed since last asked */
  changed(): number[] {
    const out = [...this.dirty];
    this.dirty.clear();
    return out;
  }

  /** the light at a point anywhere, blended from the field's points around it that open space joins it to */
  atPoint(x: number, y: number, z: number): Colour {
    const F = this.field, col = this.colours;
    const fx = (x - LOFF) / LCELL, fy = (y - LOFF) / LCELL, fz = (z - LOFF) / LCELL;
    const i = Math.floor(fx), j = Math.floor(fy), k = Math.floor(fz), tx = fx - i, ty = fy - j, tz = fz - k;
    const s = F.slot(i >> 3, j >> 3, k >> 3);
    if (s < 0) return BLACK;
    let best = -1;
    for (let c = 0; c < 8; c++) {
      const ox = c & 1, oy = (c >> 1) & 1, oz = c >> 2;
      P[c] = F.local(s, (i & 7) + ox, (j & 7) + oy, (k & 7) + oz);
      W[c] = (ox ? tx : 1 - tx) * (oy ? ty : 1 - ty) * (oz ? tz : 1 - tz);
      if (P[c] >= 0 && F.flags[P[c]] && (best < 0 || W[c] > W[best])) best = c;
    }
    if (best < 0) return BLACK;
    /* only the corners joined to the nearest open one: none from over a slab or through a wall */
    let reach = 1 << best;
    for (let pass = 0; pass < 3; pass++)
      for (const [c, a] of EDGES) {
        const d = c | (1 << a);
        if (((reach >> c) & 1) !== ((reach >> d) & 1) && P[c] >= 0 && F.flags[P[c]] & (2 << a)) reach |= (1 << c) | (1 << d);
      }
    let r = 0, g = 0, b = 0, sw = 0;
    for (let c = 0; c < 8; c++) {
      if (!((reach >> c) & 1)) continue;
      const p = F.pid[P[c]] * 3;
      r += W[c] * col[p]; g += W[c] * col[p + 1]; b += W[c] * col[p + 2]; sw += W[c];
    }
    return sw > 0 ? [r / sw, g / sw, b / sw] : BLACK;
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
