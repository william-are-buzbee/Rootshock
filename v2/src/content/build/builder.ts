import { Rng } from '../../core/rng';
import { hex, scale3, type Colour } from '../../core/math';
import type { LevelDef, PropDef, RoomDef, Shape, Start } from '../types';

/* The authoring kit. Levels are written as calls on a LevelBuilder; finish() returns plain data.
   Everything random comes from the level's own seed, so a level is dressed the same way every time. */

export interface Palette { fl: number; wl: number; st: number }
export const OPS: Palette = { fl: 0x6a665e, wl: 0x8c887e, st: 0x8a7a4a };
export const SEC: Palette = { fl: 0x55585c, wl: 0x70747a, st: 0x39485a };
export const UTIL: Palette = { fl: 0x505254, wl: 0x6a6d6c, st: 0xb89b2e };
export const CELL: Palette = { fl: 0x4e5052, wl: 0x666a6e, st: 0xa8521e };
export const WHITE: Colour = [0.8, 0.85, 0.9];
export const DARK: Colour = [0, 0, 0];

export interface RoomOpts {
  y0?: number;
  ht?: number;
  pal?: Palette;
  /** the room's light; DARK for none */
  light?: Colour;
  /** no ceiling fittings */
  nolamp?: boolean;
}

export interface PropOpts {
  /** base height; defaults to the floor of the room at (x, z) */
  y?: number;
  ry?: number;
  rz?: number;
  glow?: number;
  /** force solid on or off; by default things of some size near the floor are solid */
  solid?: boolean;
}

export class LevelBuilder {
  readonly rng: Rng;
  private def: LevelDef;
  private nolamp = new Set<number>();

  constructor(id: string, name: string, seed?: string) {
    this.def = { id, name, seed: seed ?? id, rooms: [], blocks: [], props: [], colliders: [], start: { x: 0, y: 0, z: 0, yaw: 0 } };
    this.rng = new Rng(this.def.seed);
  }

  /** an open volume, corners (x0, z0) and (x1, z1). Rooms that touch or overlap are one space where they meet. */
  room(name: string, x0: number, z0: number, x1: number, z1: number, o: RoomOpts = {}): RoomDef {
    const p = o.pal ?? OPS;
    const r: RoomDef = {
      id: this.def.rooms.length, name,
      x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1),
      y0: o.y0 ?? 0, ht: o.ht ?? 3.2,
      floor: hex(p.fl), wall: hex(p.wl), stripe: hex(p.st),
      light: o.light ?? WHITE,
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
    const p: PropDef = { shape, x, y, z, sx, sy, sz, ry: o.ry ?? 0, rz: o.rz ?? 0, colour: hex(c), glow: o.glow ?? 1, solid };
    this.def.props.push(p);
    return p;
  }
  box(x: number, z: number, sx: number, sy: number, sz: number, c: number | Colour, o?: PropOpts): PropDef {
    return this.prop('box', x, z, sx, sy, sz, c, o);
  }

  /** an invisible box that bodies cannot enter, base at y (default: the floor) */
  collider(x: number, z: number, sx: number, sy: number, sz: number, y?: number): void {
    const b = y ?? this.floorAt(x, z);
    this.def.colliders.push({ x0: x - sx / 2, y0: b, z0: z - sz / 2, x1: x + sx / 2, y1: b + sy, z1: z + sz / 2 });
  }

  start(x: number, z: number, yaw: number): void {
    this.def.start = { x, y: this.floorAt(x, z), z, yaw } satisfies Start;
  }

  /** the floor under (x, z): the highest room floor or block top there */
  floorAt(x: number, z: number): number {
    let y = -Infinity;
    for (const r of this.def.rooms) if (x >= r.x0 && x < r.x1 && z >= r.z0 && z < r.z1) y = Math.max(y, r.y0);
    for (const b of this.def.blocks) if (x >= b.x0 && x < b.x1 && z >= b.z0 && z < b.z1 && b.y1 > y && b.y0 <= y + 0.01) y = b.y1;
    return y === -Infinity ? 0 : y;
  }

  finish(): LevelDef {
    /* ceiling fittings: a strip light every 6 m, lit if the room is */
    for (const r of this.def.rooms) {
      if (this.nolamp.has(r.id)) continue;
      const dead = r.light[0] + r.light[1] + r.light[2] === 0, w = r.x1 - r.x0, d = r.z1 - r.z0;
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
