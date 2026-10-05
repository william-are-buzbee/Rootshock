import type { BlockDef, LevelDef, RoomDef } from '../content/types';
import { CELL, Grid, ROCK, blockCell } from './grid';

/** an axis-aligned solid box, for props and colliders */
export interface Box {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
}

/* The world: one level compiled into one spatial model. Every spatial question goes through here:
   bodies, and later sight, sound, pathing and light. Answers combine the grid and the solid boxes (props). */
export class World {
  readonly grid: Grid;
  readonly rooms: RoomDef[];
  readonly blocks: BlockDef[];
  /** solid boxes, bucketed by 2 m column so a query only looks at what is near */
  private boxes = new Map<number, Box[]>();
  private static readonly B = 2;

  constructor(readonly def: LevelDef) {
    this.rooms = def.rooms;
    this.blocks = def.blocks;
    /* bounds: every room, plus a margin of rock */
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (const r of def.rooms) {
      x0 = Math.min(x0, r.x0); y0 = Math.min(y0, r.y0); z0 = Math.min(z0, r.z0);
      x1 = Math.max(x1, r.x1); y1 = Math.max(y1, r.y0 + r.ht); z1 = Math.max(z1, r.z1);
    }
    if (!def.rooms.length) x0 = y0 = z0 = x1 = y1 = z1 = 0;
    const m = 1, snap = (v: number) => Math.floor(v / CELL) * CELL;
    const ox = snap(x0 - m), oy = snap(y0 - m), oz = snap(z0 - m);
    this.grid = new Grid(ox, oy, oz, Math.ceil((x1 + m - ox) / CELL), Math.ceil((y1 + m - oy) / CELL), Math.ceil((z1 + m - oz) / CELL));
    /* carve the rooms, then build the blocks back in */
    for (const r of def.rooms) this.grid.fill(r.x0, r.y0, r.z0, r.x1, r.y0 + r.ht, r.z1, r.id);
    def.blocks.forEach((b, i) => this.grid.fill(b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, blockCell(i)));
    for (const p of def.props) {
      if (!p.solid) continue;
      const c = Math.abs(Math.cos(p.ry)), s = Math.abs(Math.sin(p.ry)), ex = (p.sx * c + p.sz * s) / 2, ez = (p.sx * s + p.sz * c) / 2;
      this.addBox({ x0: p.x - ex, y0: p.y, z0: p.z - ez, x1: p.x + ex, y1: p.y + p.sy, z1: p.z + ez });
    }
    for (const c of def.colliders) this.addBox(c);
  }

  private bkey(i: number, k: number): number { return k * 65536 + i; }
  private addBox(b: Box): void {
    const B = World.B;
    for (let k = Math.floor(b.z0 / B); k <= Math.floor(b.z1 / B); k++)
      for (let i = Math.floor(b.x0 / B); i <= Math.floor(b.x1 / B); i++) {
        const key = this.bkey(i, k);
        let a = this.boxes.get(key);
        if (!a) this.boxes.set(key, (a = []));
        a.push(b);
      }
  }
  /** each solid box whose footprint meets the circle, once */
  private boxesNear(x: number, z: number, r: number, f: (b: Box) => void): void {
    const B = World.B, seen = new Set<Box>(), r2 = r * r;
    for (let k = Math.floor((z - r) / B); k <= Math.floor((z + r) / B); k++)
      for (let i = Math.floor((x - r) / B); i <= Math.floor((x + r) / B); i++) {
        const a = this.boxes.get(this.bkey(i, k));
        if (a) for (const b of a) {
          if (seen.has(b)) continue;
          seen.add(b);
          const px = Math.min(Math.max(x, b.x0), b.x1), pz = Math.min(Math.max(z, b.z0), b.z1);
          if ((x - px) ** 2 + (z - pz) ** 2 < r2) f(b);
        }
      }
  }
  /** each grid column (i, k) whose cell footprint meets the circle */
  private columns(x: number, z: number, r: number, f: (i: number, k: number) => void): void {
    const g = this.grid, r2 = r * r;
    for (let k = g.ck(z - r); k <= g.ck(z + r); k++)
      for (let i = g.ci(x - r); i <= g.ci(x + r); i++) {
        const cx0 = g.ox + i * CELL, cz0 = g.oz + k * CELL;
        const px = Math.min(Math.max(x, cx0), cx0 + CELL), pz = Math.min(Math.max(z, cz0), cz0 + CELL);
        if ((x - px) ** 2 + (z - pz) ** 2 < r2) f(i, k);
      }
  }

  solidAt(x: number, y: number, z: number): boolean {
    if (this.grid.at(x, y, z) < 0) return true;
    let hit = false;
    this.boxesNear(x, z, 1e-6, b => { if (y >= b.y0 && y < b.y1) hit = true; });
    return hit;
  }

  /** does an upright cylinder (centre x, z; radius r; from y0 to y1) overlap anything solid? */
  overlapCylinder(x: number, z: number, r: number, y0: number, y1: number): boolean {
    const g = this.grid, j0 = g.cj(y0), j1 = g.cj(y1 - 1e-6);
    let hit = false;
    this.columns(x, z, r, (i, k) => {
      if (hit) return;
      for (let j = j0; j <= j1; j++) if (g.get(i, j, k) < 0) { hit = true; return; }
    });
    if (hit) return true;
    this.boxesNear(x, z, r, b => { if (b.y0 < y1 && b.y1 > y0) hit = true; });
    return hit;
  }

  /** the highest solid surface under the circle whose top is at or below `top`: what you stand on */
  groundBelow(x: number, z: number, r: number, top: number): number {
    const g = this.grid;
    let best = -Infinity;
    const jt = Math.floor((top - g.oy) / CELL + 1e-6) - 1;
    this.columns(x, z, r, (i, k) => {
      /* solid running on up past `top` is something in the way, not ground */
      if (g.get(i, jt + 1, k) < 0 && g.oy + (jt + 1) * CELL < top - 1e-6) return;
      for (let j = jt; j >= -1; j--) if (g.get(i, j, k) < 0) { best = Math.max(best, g.oy + (j + 1) * CELL); return; }
    });
    this.boxesNear(x, z, r, b => { if (b.y1 <= top + 1e-6 && b.y1 > best) best = b.y1; });
    return best;
  }

  /** the lowest solid surface over the circle whose underside is at or above `from`: what you would hit your head on */
  ceilingAbove(x: number, z: number, r: number, from: number): number {
    const g = this.grid;
    let best = Infinity;
    const jf = Math.ceil((from - g.oy) / CELL - 1e-6);
    this.columns(x, z, r, (i, k) => {
      for (let j = jf; j <= g.ny; j++) if (g.get(i, j, k) < 0) { best = Math.min(best, g.oy + j * CELL); return; }
    });
    this.boxesNear(x, z, r, b => { if (b.y0 >= from - 1e-6 && b.y0 < best) best = b.y0; });
    return best;
  }

  /** the room at a point, or null in rock */
  roomAt(x: number, y: number, z: number): RoomDef | null {
    const c = this.grid.at(x, y, z);
    return c >= 0 ? this.rooms[c] : null;
  }
}

export { ROCK };
