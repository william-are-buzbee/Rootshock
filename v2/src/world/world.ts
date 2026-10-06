import type { BlockDef, LevelDef, RoomDef, SurfaceDef, WaterDef } from '../content/types';
import { CELL, Grid, blockCell } from './grid';
import { meets, samples, segmentBox, type Box, type Footprint } from './shapes';

/** something solid that moves: a door, a platform, a loose crate. The sim moves it; the world reports it. */
export interface Dyn extends Box {
  kind: 'mover' | 'loose' | 'body';
  id: number;
}

/** what a query ran into: nothing, the fixed world, or something that moves */
export type Hit = null | 'world' | Dyn;

/** a sloped surface, ready to be asked */
export class Surface {
  readonly lo: number;
  readonly hi: number;
  constructor(readonly def: SurfaceDef) {
    this.lo = Math.min(...def.h);
    this.hi = Math.max(...def.h);
  }
  /** its height at (x, z), blended from the lattice; outside its bounds, the height at the nearest edge */
  heightAt(x: number, z: number): number {
    const d = this.def, fx = Math.min(Math.max((x - d.x0) / d.res, 0), d.nx - 1 - 1e-9), fz = Math.min(Math.max((z - d.z0) / d.res, 0), d.nz - 1 - 1e-9);
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, h = d.h, n = d.nx;
    return h[j * n + i] * (1 - u) * (1 - v) + h[j * n + i + 1] * u * (1 - v) + h[(j + 1) * n + i] * (1 - u) * v + h[(j + 1) * n + i + 1] * u * v;
  }
  /** the highest (floor) or lowest (ceiling) it gets under a footprint */
  extremeUnder(f: Footprint): number {
    const d = this.def;
    let best = d.kind === 'floor' ? -Infinity : Infinity;
    for (const [x, z] of samples(f)) {
      const h = this.heightAt(Math.min(Math.max(x, d.x0), d.x1), Math.min(Math.max(z, d.z0), d.z1));
      best = d.kind === 'floor' ? Math.max(best, h) : Math.min(best, h);
    }
    return best;
  }
}

const EPS = 1e-6;

/* The world: one level compiled into one spatial model. Every spatial question goes through here: bodies, sight,
   sound, pathing, light. An answer combines the grid, the fixed solids (props, colliders), the sloped surfaces, and
   whatever moves (doors, platforms, loose crates), which the sim keeps in `dyn`. */
export class World {
  readonly grid = new Grid();
  readonly rooms: RoomDef[];
  readonly blocks: BlockDef[];
  readonly surfaces: Surface[];
  readonly water: WaterDef[];
  /** the moving solids, kept up to date by the sim */
  readonly dyn: Dyn[] = [];
  private ids = 0;
  /** fixed solids, bucketed by 2 m column so a query only looks at what is near */
  private boxes = new Map<number, Box[]>();
  private static readonly B = 2;

  constructor(readonly def: LevelDef) {
    this.rooms = def.rooms;
    this.blocks = def.blocks;
    this.surfaces = def.surfaces.map(s => new Surface(s));
    this.water = def.water;
    /* carve the rooms, then build the blocks back in */
    for (const r of def.rooms) this.grid.fill(r.x0, r.y0, r.z0, r.x1, r.y0 + r.ht, r.z1, r.id);
    def.blocks.forEach((b, i) => this.grid.fill(b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, blockCell(i)));
    for (const p of def.props) {
      if (!p.solid || p.loose) continue;
      const c = Math.abs(Math.cos(p.ry)), s = Math.abs(Math.sin(p.ry)), ex = (p.sx * c + p.sz * s) / 2, ez = (p.sx * s + p.sz * c) / 2;
      this.addBox({ x0: p.x - ex, y0: p.y, z0: p.z - ez, x1: p.x + ex, y1: p.y + p.sy, z1: p.z + ez });
    }
    for (const c of def.colliders) this.addBox(c);
  }

  private bkey(i: number, k: number): number { return (k + 32768) * 65536 + (i + 32768); }
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
  /** each fixed solid whose plan meets the footprint, once */
  private boxesNear(f: Footprint, fn: (b: Box) => void): void {
    const B = World.B, seen = new Set<Box>();
    for (let k = Math.floor((f.z - f.hz) / B); k <= Math.floor((f.z + f.hz) / B); k++)
      for (let i = Math.floor((f.x - f.hx) / B); i <= Math.floor((f.x + f.hx) / B); i++) {
        const a = this.boxes.get(this.bkey(i, k));
        if (a) for (const b of a) {
          if (seen.has(b)) continue;
          seen.add(b);
          if (meets(f, b.x0, b.z0, b.x1, b.z1)) fn(b);
        }
      }
  }
  private dynNear(f: Footprint, ignore: Dyn | null, fn: (d: Dyn) => void): void {
    for (const d of this.dyn) if (d !== ignore && meets(f, d.x0, d.z0, d.x1, d.z1)) fn(d);
  }
  private surfacesNear(f: Footprint, fn: (s: Surface) => void): void {
    for (const s of this.surfaces) if (meets(f, s.def.x0, s.def.z0, s.def.x1, s.def.z1)) fn(s);
  }
  /** each grid column (i, k) whose cell meets the footprint */
  private columns(f: Footprint, fn: (i: number, k: number) => void): void {
    for (let k = Math.floor((f.z - f.hz) / CELL); k <= Math.floor((f.z + f.hz) / CELL); k++)
      for (let i = Math.floor((f.x - f.hx) / CELL); i <= Math.floor((f.x + f.hx) / CELL); i++)
        if (meets(f, i * CELL, k * CELL, (i + 1) * CELL, (k + 1) * CELL)) fn(i, k);
  }

  /** a new id for something that moves. Ids count from 1 in each world, in the order things are made, so the same
   *  level always gives the same ids (a save can name things by them). */
  newId(): number {
    return ++this.ids;
  }

  /** every fixed solid box, once (for the dev overlay) */
  forEachBox(fn: (b: Box) => void): void {
    const seen = new Set<Box>();
    for (const a of this.boxes.values()) for (const b of a) if (!seen.has(b)) { seen.add(b); fn(b); }
  }

  solidAt(x: number, y: number, z: number): boolean {
    if (this.grid.at(x, y, z) < 0) return true;
    const f: Footprint = { x, z, hx: 1e-4, hz: 1e-4, round: false };
    return this.overlap(f, y - 1e-4, y + 1e-4) !== null;
  }

  /** does anything solid overlap the footprint between heights y0 and y1? */
  overlap(f: Footprint, y0: number, y1: number, ignore: Dyn | null = null): Hit {
    const g = this.grid, j0 = Math.floor(y0 / CELL), j1 = Math.floor((y1 - EPS) / CELL);
    let hit: Hit = null;
    this.columns(f, (i, k) => {
      if (hit) return;
      for (let j = j0; j <= j1; j++) if (g.get(i, j, k) < 0) { hit = 'world'; return; }
    });
    if (hit) return hit;
    this.boxesNear(f, b => { if (b.y0 < y1 && b.y1 > y0) hit = 'world'; });
    if (hit) return hit;
    this.surfacesNear(f, s => {
      if (hit) return;
      const e = s.extremeUnder(f), d = s.def;
      if (d.kind === 'floor' ? e > y0 + EPS && d.base < y1 : e < y1 - EPS && d.base > y0) hit = 'world';
    });
    if (hit) return hit;
    this.dynNear(f, ignore, d => { if (!hit && d.y0 < y1 && d.y1 > y0) hit = d; });
    return hit;
  }

  /** the highest surface under the footprint whose top is at or below `top`: what it stands on */
  groundBelow(f: Footprint, top: number, ignore: Dyn | null = null): number {
    const g = this.grid, jt = Math.floor(top / CELL + EPS) - 1;
    let best = -Infinity;
    this.columns(f, (i, k) => {
      /* solid running on up past `top` is something in the way, not ground */
      if (g.get(i, jt + 1, k) < 0 && (jt + 1) * CELL < top - EPS) return;
      for (let j = jt, n = 0; n < 4096; j--, n++) if (g.get(i, j, k) < 0) { best = Math.max(best, (j + 1) * CELL); return; }
    });
    const consider = (y1: number) => { if (y1 <= top + EPS && y1 > best) best = y1; };
    this.boxesNear(f, b => consider(b.y1));
    this.dynNear(f, ignore, d => consider(d.y1));
    this.surfacesNear(f, s => {
      if (s.def.kind !== 'floor') return;
      const e = s.extremeUnder(f);
      if (e <= top + EPS && e > best) best = e;
    });
    return best;
  }

  /** the lowest surface over the footprint whose underside is at or above `from`: what it would hit its head on */
  ceilingAbove(f: Footprint, from: number, ignore: Dyn | null = null): number {
    const g = this.grid, jf = Math.ceil(from / CELL - EPS);
    let best = Infinity;
    this.columns(f, (i, k) => {
      for (let j = jf, n = 0; n < 4096; j++, n++) if (g.get(i, j, k) < 0) { best = Math.min(best, j * CELL); return; }
    });
    const consider = (y0: number) => { if (y0 >= from - EPS && y0 < best) best = y0; };
    this.boxesNear(f, b => consider(b.y0));
    this.dynNear(f, ignore, d => consider(d.y0));
    this.surfacesNear(f, s => {
      if (s.def.kind !== 'ceiling') return;
      const e = s.extremeUnder(f);
      if (e >= from - EPS && e < best) best = e;
    });
    return best;
  }

  /** how far (0..1) a footprint can travel by (dx, dz) before it runs into something; 1 if all the way */
  sweep(f: Footprint, y0: number, y1: number, dx: number, dz: number, ignore: Dyn | null = null): number {
    const at = (t: number): Footprint => ({ ...f, x: f.x + dx * t, z: f.z + dz * t });
    const len = Math.hypot(dx, dz), stepLen = Math.max(0.05, Math.min(f.hx, f.hz) * 0.5), n = Math.max(1, Math.ceil(len / stepLen));
    let ok = 0;
    for (let s = 1; s <= n; s++) {
      const t = s / n;
      if (this.overlap(at(t), y0, y1, ignore)) {
        let lo = ok, hi = t;
        for (let k = 0; k < 8; k++) {
          const m = (lo + hi) / 2;
          if (this.overlap(at(m), y0, y1, ignore)) hi = m;
          else lo = m;
        }
        return lo;
      }
      ok = t;
    }
    return 1;
  }

  /** if the footprint overlaps something, the smallest nudge (dx, dy, dz) that frees it; null if it is clear or stuck */
  pushOut(f: Footprint, y0: number, y1: number, ignore: Dyn | null = null): [number, number, number] | null {
    if (!this.overlap(f, y0, y1, ignore)) return null;
    for (const d of [0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75]) {
      if (!this.overlap(f, y0 + d, y1 + d, ignore)) return [0, d, 0];
      for (let a = 0; a < 8; a++) {
        const dx = Math.cos((a * Math.PI) / 4) * d, dz = Math.sin((a * Math.PI) / 4) * d;
        if (!this.overlap({ ...f, x: f.x + dx, z: f.z + dz }, y0, y1, ignore)) return [dx, 0, dz];
      }
    }
    return null;
  }

  /** where a straight line from a to b first meets anything solid, as a fraction 0..1 of the way; 1 if it is clear.
   *  `ignore`: one moving thing to see through, or a test for which to see through (bodies, for a line of sight) */
  raycast(ax: number, ay: number, az: number, bx: number, by: number, bz: number, ignore: Dyn | null | ((d: Dyn) => boolean) = null): number {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    let best = this.gridRay(ax, ay, az, dx, dy, dz);
    /* fixed solids: the buckets the line passes over */
    const B = World.B, len = Math.hypot(dx, dz), n = Math.max(1, Math.ceil(len / (B / 4))), seen = new Set<Box>();
    for (let s = 0; s <= n; s++) {
      const x = ax + (dx * s) / n, z = az + (dz * s) / n;
      const a = this.boxes.get(this.bkey(Math.floor(x / B), Math.floor(z / B)));
      if (a) for (const b of a) if (!seen.has(b)) { seen.add(b); best = Math.min(best, segmentBox(ax, ay, az, dx, dy, dz, b)); }
    }
    const skip = typeof ignore === 'function' ? ignore : (d: Dyn) => d === ignore;
    for (const d of this.dyn) if (!skip(d)) best = Math.min(best, segmentBox(ax, ay, az, dx, dy, dz, d));
    for (const s of this.surfaces) best = Math.min(best, this.surfaceRay(s, ax, ay, az, dx, dy, dz, best));
    return Math.min(1, best);
  }

  /** the grid, cell by cell along the line (Amanatides and Woo) */
  private gridRay(ax: number, ay: number, az: number, dx: number, dy: number, dz: number): number {
    const g = this.grid, p = [ax / CELL, ay / CELL, az / CELL], d = [dx / CELL, dy / CELL, dz / CELL];
    const c = p.map(Math.floor), step = d.map(Math.sign);
    const tMax = d.map((v, a) => (v === 0 ? Infinity : ((v > 0 ? c[a] + 1 : c[a]) - p[a]) / v));
    const tDelta = d.map(v => (v === 0 ? Infinity : Math.abs(1 / v)));
    if (g.get(c[0], c[1], c[2]) < 0) return 0;
    for (let n = 0; n < 100000; n++) {
      const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : tMax[1] < tMax[2] ? 1 : 2, t = tMax[a];
      if (t > 1) return Infinity;
      c[a] += step[a];
      tMax[a] += tDelta[a];
      if (g.get(c[0], c[1], c[2]) < 0) return t;
    }
    return Infinity;
  }

  private surfaceRay(s: Surface, ax: number, ay: number, az: number, dx: number, dy: number, dz: number, limit: number): number {
    const d = s.def, inside = (t: number) => {
      const x = ax + dx * t, z = az + dz * t;
      if (x < d.x0 || x > d.x1 || z < d.z0 || z > d.z1) return false;
      const y = ay + dy * t, h = s.heightAt(x, z);
      return d.kind === 'floor' ? y < h && y > d.base : y > h && y < d.base;
    };
    const len = Math.hypot(dx, dy, dz), n = Math.max(1, Math.ceil((len * Math.min(1, limit)) / 0.1));
    let prev = 0;
    for (let k = 0; k <= n; k++) {
      const t = (k / n) * Math.min(1, limit);
      if (inside(t)) {
        if (k === 0) return 0;
        let lo = prev, hi = t;
        for (let m = 0; m < 10; m++) { const mid = (lo + hi) / 2; if (inside(mid)) hi = mid; else lo = mid; }
        return hi;
      }
      prev = t;
    }
    return Infinity;
  }

  /** the water's surface over (x, z), or -Infinity where there is none */
  waterAt(x: number, z: number): number {
    let lv = -Infinity;
    for (const w of this.water) if (x >= w.x0 && x < w.x1 && z >= w.z0 && z < w.z1 && w.level > lv) lv = w.level;
    return lv;
  }

  /** the rooms that open into this one: open cells just outside its box, at its floor and a little above */
  neighbours(id: number): number[] {
    const R = this.rooms[id], out = new Set<number>(), g = this.grid;
    for (const y of [R.y0 + 0.3, R.y0 + 1.2])
      for (let x = R.x0 + CELL / 2; x < R.x1; x += CELL)
        for (const z of [R.z0 - CELL / 2, R.z1 + CELL / 2]) { const c = g.at(x, y, z); if (c >= 0 && c !== id) out.add(c); }
    for (const y of [R.y0 + 0.3, R.y0 + 1.2])
      for (let z = R.z0 + CELL / 2; z < R.z1; z += CELL)
        for (const x of [R.x0 - CELL / 2, R.x1 + CELL / 2]) { const c = g.at(x, y, z); if (c >= 0 && c !== id) out.add(c); }
    return [...out];
  }

  /** the room at a point, or null in rock */
  roomAt(x: number, y: number, z: number): RoomDef | null {
    const c = this.grid.at(x, y, z);
    return c >= 0 ? this.rooms[c] : null;
  }
}
