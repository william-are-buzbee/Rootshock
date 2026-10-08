import { Rng } from '../../core/rng';
import { hex, scale3, type Colour } from '../../core/math';
import type { DoorDef, LevelDef, LitRule, Motes, PropDef, RoomDef, Shape, Start, SurfaceDef } from '../types';

/* The authoring kit. Levels are written as calls on a LevelBuilder; finish() returns plain data.
   Everything random comes from the level's own seed, so a level is dressed the same way every time. */

export interface Palette { fl: number; wl: number; st: number }
export const OPS: Palette = { fl: 0x6a665e, wl: 0x8c887e, st: 0x8a7a4a };
export const SEC: Palette = { fl: 0x55585c, wl: 0x70747a, st: 0x39485a };
export const UTIL: Palette = { fl: 0x505254, wl: 0x6a6d6c, st: 0xb89b2e };
export const CELL: Palette = { fl: 0x4e5052, wl: 0x666a6e, st: 0xa8521e };
export const ROCK: Palette = { fl: 0x4a443c, wl: 0x5a5248, st: 0x5a5248 };
export const WHITE: Colour = [0.8, 0.85, 0.9];
export const DARK: Colour = [0, 0, 0];

export interface RoomOpts {
  y0?: number;
  ht?: number;
  pal?: Palette;
  /** a light that is always on, whatever the power; DARK for none. Shorthand for lit 'always' (or 'none') with lc. */
  light?: Colour;
  /** or light it by the rules (see LitRule) */
  lit?: LitRule;
  lc?: Colour;
  em?: boolean;
  circuit?: string;
  flick?: boolean;
  /** no ceiling fittings */
  nolamp?: boolean;
  /** what hangs in its air, if not dust */
  motes?: Motes;
  /** rock or walkway, not a fitted room: plain walls */
  plain?: boolean;
  /** the roof painted as sky */
  sky?: number | Colour;
  doorway?: boolean;
  safe?: boolean;
  noroam?: boolean;
}

/** a door's rules, beyond where it is (see DoorDef) */
export type DoorOpts = Partial<Omit<DoorDef, 'x0' | 'y0' | 'z0' | 'x1' | 'y1' | 'z1'>>;

export interface PropOpts {
  /** base height; defaults to the floor of the room at (x, z) */
  y?: number;
  ry?: number;
  rz?: number;
  glow?: number;
  /** force solid on or off; by default things of some size near the floor are solid */
  solid?: boolean;
  /** can be pushed and knocked about */
  loose?: boolean;
  pw?: [Colour, Colour];
  pc?: string;
}

/** heights relative to a floor or ceiling, as a function of plan position */
export type Relief = (x: number, z: number) => number;

export class LevelBuilder {
  readonly rng: Rng;
  private def: LevelDef;
  private nolamp = new Set<number>();

  constructor(id: string, name: string, o: { seed?: string; circuit?: string } = {}) {
    this.def = {
      id, name, seed: o.seed ?? id, circuit: o.circuit ?? 'MAIN',
      rooms: [], blocks: [], props: [], colliders: [], surfaces: [], water: [], doors: [], platforms: [],
      lamps: [], signs: [], items: [], notes: [], mutants: [], uses: [], marks: {},
      start: { x: 0, y: 0, z: 0, yaw: 0 },
    };
    this.rng = new Rng(this.def.seed);
  }

  /** an open volume, corners (x0, z0) and (x1, z1). Rooms that touch or overlap are one space where they meet. */
  room(name: string, x0: number, z0: number, x1: number, z1: number, o: RoomOpts = {}): RoomDef {
    const p = o.pal ?? OPS;
    const fixed = o.light !== undefined, dark = fixed && o.light![0] + o.light![1] + o.light![2] === 0;
    const r: RoomDef = {
      id: this.def.rooms.length, name, plain: !!o.plain,
      x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1),
      y0: o.y0 ?? 0, ht: o.ht ?? 3.2,
      floor: hex(p.fl), wall: hex(p.wl), stripe: hex(p.st),
      lit: o.lit ?? (fixed ? (dark ? 'none' : 'always') : 'always'),
      lc: o.lc ?? (fixed ? o.light! : WHITE),
      em: !!o.em, circuit: o.circuit ?? this.def.circuit, flick: !!o.flick, doorway: !!o.doorway, safe: !!o.safe, noroam: !!o.noroam,
      ...(o.sky !== undefined ? { sky: hex(o.sky) } : {}), ...(o.motes && o.motes !== 'dust' ? { motes: o.motes } : {}),
    };
    this.def.rooms.push(r);
    if (o.nolamp) this.nolamp.add(r.id);
    return r;
  }

  /** solid from (x0, y0, z0) to (x1, y1, z1): a platform, a step */
  block(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c: number | Colour): void {
    this.def.blocks.push({
      x0: Math.min(x0, x1), y0: Math.min(y0, y1), z0: Math.min(z0, z1),
      x1: Math.max(x0, x1), y1: Math.max(y0, y1), z1: Math.max(z0, z1), colour: hex(c),
    });
  }

  /** a straight flight of steps, from (x0, z0) to (x1, z1) along one axis, rising from y0 to y1 in `n` steps toward `dir` */
  steps(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, n: number, dir: 'n' | 's' | 'e' | 'w', c: number): void {
    const ax = dir === 'e' || dir === 'w', rev = dir === 'w' || dir === 'n';
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n, top = y0 + (y1 - y0) * (k + 1) / n;
      const a = rev ? 1 - t1 : t0, b = rev ? 1 - t0 : t1;
      if (ax) this.block(x0 + (x1 - x0) * a, y0, z0, x0 + (x1 - x0) * b, top, z1, k % 2 ? c : shade(c, 0.94));
      else this.block(x0, y0, z0 + (z1 - z0) * a, x1, top, z0 + (z1 - z0) * b, k % 2 ? c : shade(c, 0.94));
    }
  }

  prop(shape: Shape, x: number, z: number, sx: number, sy: number, sz: number, c: number | Colour, o: PropOpts = {}): PropDef {
    const floor = this.floorAt(x, z), y = o.y ?? floor;
    const solid = o.solid ?? (shape !== 'ico' && sy >= 0.3 && y - floor < 1.6);
    const p: PropDef = { shape, x, y, z, sx, sy, sz, ry: o.ry ?? 0, rz: o.rz ?? 0, colour: hex(c), glow: o.glow ?? 1, solid: solid || !!o.loose, loose: !!o.loose };
    if (o.pw) { p.pw = o.pw; p.pc = o.pc ?? this.def.circuit; }
    this.def.props.push(p);
    return p;
  }
  box(x: number, z: number, sx: number, sy: number, sz: number, c: number | Colour, o?: PropOpts): PropDef {
    return this.prop('box', x, z, sx, sy, sz, c, o);
  }

  /** a ramp over (x0, z0)-(x1, z1), rising from y0 to y1 toward `dir`: a smooth floor you walk up */
  ramp(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, dir: 'n' | 's' | 'e' | 'w', c: number): void {
    const ax = dir === 'e' || dir === 'w', rev = dir === 'w' || dir === 'n';
    this.surface('floor', x0, z0, x1, z1, (x, z) => {
      const t = ax ? (x - x0) / (x1 - x0) : (z - z0) / (z1 - z0);
      return y0 + (y1 - y0) * (rev ? 1 - t : t);
    }, Math.min(y0, y1), c, true, 0.5);
  }

  /** a cave: a room in rock whose floor and ceiling follow `floor` and `ceil` (metres above y0, and above y0 + ht).
   *  The rock is carved from the lowest floor to the highest ceiling; the surfaces do the rest. */
  cave(name: string, x0: number, z0: number, x1: number, z1: number, o: RoomOpts & { floor?: Relief; ceil?: Relief; res?: number } = {}): RoomDef {
    const y0 = o.y0 ?? 0, ht = o.ht ?? 4, fl = o.floor ?? (() => 0), cl = o.ceil ?? (() => 0), res = o.res ?? 0.5;
    let lo = Infinity, hi = -Infinity;
    for (let z = z0; z <= z1 + 1e-9; z += res) for (let x = x0; x <= x1 + 1e-9; x += res) { lo = Math.min(lo, fl(x, z)); hi = Math.max(hi, cl(x, z)); }
    const snap = (v: number, up: boolean) => (up ? Math.ceil(v / 0.25) : Math.floor(v / 0.25)) * 0.25;
    const bottom = snap(y0 + lo, false), top = snap(y0 + ht + hi, true), p = o.pal ?? ROCK;
    const r = this.room(name, x0, z0, x1, z1, { ...o, pal: p, y0: bottom, ht: top - bottom, plain: true, nolamp: o.nolamp ?? true });
    this.surface('floor', x0, z0, x1, z1, (x, z) => y0 + fl(x, z), bottom - 0.25, p.fl, false, res);
    this.surface('ceiling', x0, z0, x1, z1, (x, z) => y0 + ht + cl(x, z), top + 0.25, scale3(hex(p.wl), 0.6), false, res);
    return r;
  }

  surface(kind: 'floor' | 'ceiling', x0: number, z0: number, x1: number, z1: number, f: Relief, base: number, c: number | Colour, sides: boolean, res: number): void {
    const nx = Math.max(2, Math.round((x1 - x0) / res) + 1), nz = Math.max(2, Math.round((z1 - z0) / res) + 1), h: number[] = [];
    res = Math.max((x1 - x0) / (nx - 1), (z1 - z0) / (nz - 1));
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) h.push(f(x0 + i * res, z0 + j * res));
    const s: SurfaceDef = { kind, x0, z0, x1, z1, res, nx, nz, h, base, colour: hex(c), sides };
    this.def.surfaces.push(s);
  }

  /** a surface given as its lattice of heights, nx by nz corners `res` apart from (x0, z0); masked to some squares if `mask` */
  lattice(kind: 'floor' | 'ceiling', x0: number, z0: number, x1: number, z1: number, res: number, nx: number, nz: number, h: number[], base: number, c: number | Colour, mask?: number[]): void {
    this.def.surfaces.push({ kind, x0, z0, x1, z1, res, nx, nz, h, base, colour: hex(c), sides: false, ...(mask ? { mask } : {}) });
  }

  /** standing water over a rectangle, its surface at `level` */
  water(x0: number, z0: number, x1: number, z1: number, level: number): void {
    this.def.water.push({ x0, z0, x1, z1, level });
  }

  /** a door filling (x0, z0)-(x1, z1) from the floor up `h` metres */
  door(x0: number, z0: number, x1: number, z1: number, h = 2.4, o: DoorOpts = {}): DoorDef {
    const y0 = this.floorAt((x0 + x1) / 2, (z0 + z1) / 2);
    const d: DoorDef = {
      x0, y0, z0, x1, y1: y0 + h, z1, kind: 'light', alongX: x1 - x0 > z1 - z0, open: false, stuck: false, seal: false, vent: false, lift: false,
      circuit: this.def.circuit, ...o,
    };
    this.def.doors.push(d);
    return d;
  }

  /** a platform over (x0, z0)-(x1, z1) that carries what stands on it between heights y0 and y1 */
  platform(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, c = 0xb89b2e, call?: { name: string; circuit: string }): void {
    this.def.platforms.push({ x0, z0, x1, z1, y0, y1, colour: hex(c), ...(call ? { call } : {}) });
  }

  /** an invisible box that bodies cannot enter, base at y (default: the floor) */
  collider(x: number, z: number, sx: number, sy: number, sz: number, y?: number): void {
    const b = y ?? this.floorAt(x, z);
    this.def.colliders.push({ x0: x - sx / 2, y0: b, z0: z - sz / 2, x1: x + sx / 2, y1: b + sy, z1: z + sz / 2 });
  }

  /** a camera (sim/eyes.ts): its lens at (x, y, z), looking along yaw */
  camera(x: number, y: number, z: number, yaw: number, o: { fov: number; range: number; circuit: string; zone: string }): void {
    (this.def.cameras ??= []).push({ x, y, z, yaw, ...o });
  }
  /** a zone's speaker: (x, y, z) the floor under it */
  speaker(zone: string, x: number, y: number, z: number, o: { pa?: string } = {}): void {
    (this.def.speakers ??= []).push({ zone, x, y, z, ...o });
  }
  lamp(x: number, y: number, z: number, r: number, c: Colour, item?: number): void {
    this.def.lamps.push({ x, y, z, r, colour: c, ...(item !== undefined ? { item } : {}) });
  }
  sign(text: string, x: number, y: number, z: number, yaw: number, circuit = this.def.circuit): void {
    this.def.signs.push({ text, x, y, z, yaw, circuit });
  }
  item(id: string, x: number, y: number, z: number, n = 1): void { this.def.items.push({ id, x, y, z, n }); }
  note(key: string, x: number, y: number, z: number): void { this.def.notes.push({ key, x, y, z }); }
  mutant(type: string, x: number, y: number, z: number, opts: Record<string, unknown> = {}): void { this.def.mutants.push({ type, x, y, z, opts }); }
  use(kind: string, x: number, y: number, z: number, opts: Record<string, unknown> = {}): void { this.def.uses.push({ kind, x, y, z, opts }); }
  mark(name: string, x: number, y: number, z: number, yaw: number): void { this.def.marks[name] = { x, y, z, yaw }; }
  /** a ceiling fitting its room's light shines down from */
  fixture(x: number, y: number, z: number): void { (this.def.fixtures ??= []).push({ x, y, z }); }
  /** an air grille in a ceiling */
  vent(x: number, y: number, z: number): void { (this.def.vents ??= []).push({ x, y, z }); }
  /** blood on the floor that can be walked out of */
  stain(x: number, y: number, z: number, r: number): void { (this.def.stains ??= []).push({ x, y, z, r }); }

  /** the level as built so far (for adapters that need to look back at it) */
  get level(): Readonly<LevelDef> {
    return this.def;
  }

  start(x: number, z: number, yaw: number): void {
    this.def.start = { x, y: this.floorAt(x, z), z, yaw } satisfies Start;
  }

  /** the floor under (x, z): the highest room floor, block top or sloped floor there */
  floorAt(x: number, z: number): number {
    let y = -Infinity;
    for (const r of this.def.rooms) if (x >= r.x0 && x < r.x1 && z >= r.z0 && z < r.z1) y = Math.max(y, r.y0);
    for (const b of this.def.blocks) if (x >= b.x0 && x < b.x1 && z >= b.z0 && z < b.z1 && b.y1 > y && b.y0 <= y + 0.01) y = b.y1;
    for (const s of this.def.surfaces) {
      if (s.kind !== 'floor' || x < s.x0 || x > s.x1 || z < s.z0 || z > s.z1) continue;
      const fx = Math.min((x - s.x0) / s.res, s.nx - 1 - 1e-9), fz = Math.min((z - s.z0) / s.res, s.nz - 1 - 1e-9);
      const i = Math.floor(fx), j = Math.floor(fz);
      if (s.mask && !s.mask[j * (s.nx - 1) + i]) continue;
      const u = fx - i, v = fz - j, h = s.h, n = s.nx;
      y = Math.max(y, h[j * n + i] * (1 - u) * (1 - v) + h[j * n + i + 1] * u * (1 - v) + h[(j + 1) * n + i] * (1 - u) * v + h[(j + 1) * n + i + 1] * u * v);
    }
    return y === -Infinity ? 0 : y;
  }

  finish(): LevelDef {
    /* ceiling fittings: a strip light every 6 m, lit if the room is */
    for (const r of this.def.rooms) {
      if (this.nolamp.has(r.id)) continue;
      const dead = r.lit === 'none', w = r.x1 - r.x0, d = r.z1 - r.z0;
      for (let z = r.z0 + Math.min(3, d / 2); z < r.z1; z += 6)
        for (let x = r.x0 + Math.min(3, w / 2); x < r.x1; x += 6)
          this.box(x, z, 1.1, 0.06, 0.3, dead ? 0x2a2c2e : 0xe8eef2, { y: r.y0 + r.ht - 0.07, glow: dead ? 1 : 3, solid: false });
    }
    return this.def;
  }
}

function shade(c: number, k: number): Colour {
  return scale3(hex(c), k);
}
