import type { LevelDef, RoomDef } from '../content/types';
import { CELL, CHUNK } from './grid';
import type { World } from './world';

/* The shape of a level's light, worked out once per level and kept: what each source would throw at every point of the
   open space if it shone white at full strength. Light is linear in its sources, so the light under any power is the sum
   of these, each times its source's colour (world/light.ts), and a power change is a sum, not a bake.

   The points are a lattice every 0.5 m, each at the middle of a grid cell (the even ones), so a point is open or rock
   exactly as the grid has it. They are kept in bricks of 8³, one to each chunk of the grid. Two points next to each other
   are joined if the cell between them is open too (walls and slabs are at least a cell thick, so none is skipped over).

   The sources:
   - each room's fill: the light that has bounced about it. Even through the room, it reaches out through the room's
     openings and fades over a metre or two, and where rooms meet each takes its share by how near it is, so the light
     changes across a doorway, not at a line.
   - each room's fittings: light thrown down from the ceiling, falling off with the angle from straight down and with
     distance, and stopped by anything solid in the grid. It goes wherever it can see: through a doorway, over a rail.
   - each lamp: a battery light, round and stopped by the grid the same way.

   Doors are not in the grid (they move), so a join through a door is a gate: what a source throws through one is kept
   apart, by door, and counts as far as the door stands open. Light gets under a door as it lifts. */

/** the lattice's spacing; a point stands at the middle of the even cell, LOFF in from its corner */
export const LCELL = 2 * CELL;
export const LOFF = CELL / 2;
/** points to a brick's side: one grid chunk */
export const BR = CHUNK / 2;
const BR3 = BR * BR * BR;

/** how a ceiling fitting throws its light: down (as the cube of the cosine from straight down) and out (as r² / (r² + d²)).
 *  A fitted room's fill is `base` of its light; its fittings add `gain` times what they throw, up to once over. */
export const POOL = { r2: 9, base: 0.55, gain: 1.3 };
/** a room's fill reaching out past it: falling off as e^(-d / fade) along the way through open space, to `reach` */
export const FILL = { fade: 0.9, reach: 4 };
/** how far a fitting's light is followed (farther in a tall room, to its floor and a little past), and the least of it
 *  that counts */
const THROW = { reach: 8, most: 14, faint: 0.004 };

/** what a source throws at the points it reaches (by open point): straight, and through each door (gated) */
export interface Source {
  room: number;
  lamp: number;
  pts: Int32Array;
  val: Float32Array;
  /** the bricks `pts` are in */
  slots: Int32Array;
  gpts: Int32Array;
  gval: Float32Array;
  gdoor: Int32Array;
}

const OFF = 1024;
const bkey = (bx: number, by: number, bz: number) => ((bx + OFF) * 2048 + (by + OFF)) * 2048 + (bz + OFF);
const nbi = (ox: number, oy: number, oz: number) => (oz + 1) * 9 + (oy + 1) * 3 + ox + 1;
/** point flags: open; joined to the next point along x, y, z (<< axis); that join is through a door */
const OPEN = 1, JOIN = 2, GATE = 16;

export class LightField {
  /** bricks: one to each grid chunk, and an empty one past each chunk's low faces, so the 2³ points around anywhere
   *  open are found from the brick of the lowest */
  readonly slots: number;
  /** each brick's coordinates (x, y, z), in bricks */
  readonly bpos: Int32Array;
  /** each brick's neighbours, (oz + 1) * 9 + (oy + 1) * 3 + ox + 1, or -1 */
  readonly nb: Int32Array;
  /** per lattice point (brick * 512 + (z * 8 + y) * 8 + x): its number among the open points, or -1 for rock */
  readonly pid: Int32Array;
  /** per lattice point: OPEN; JOIN << a, joined to the next point along axis a; GATE << a, through a door */
  readonly flags: Uint8Array;
  /** per lattice point: its room, or -1 */
  readonly room: Int16Array;
  /** per open point: its brick */
  readonly pslot: Int32Array;
  /** how many points are open */
  readonly n: number;
  readonly sources: Source[] = [];
  /** each room's own source (fill and fittings), or -1 for one that gives none */
  readonly roomSource: Int32Array;
  /** each door's gated light: by source, point, and how much */
  readonly doors: { src: Int32Array; pts: Int32Array; val: Float32Array }[];
  /** for each room, its fittings (not in a room lit by lamps of its own) */
  readonly fixtures = new Map<number, { x: number; y: number; z: number }[]>();
  private slotOf = new Map<number, number>();
  /** the door each gated join goes through, by lattice point * 3 + axis */
  private gateOf = new Map<number, number>();

  constructor(private w: World) {
    const g = w.grid, keys: [number, number, number][] = [];
    g.forEachChunk((cx, cy, cz) => keys.push([cx, cy, cz]));
    for (const [x, y, z] of keys) this.addSlot(x, y, z);
    for (const [x, y, z] of keys)
      for (let oz = -1; oz <= 0; oz++) for (let oy = -1; oy <= 0; oy++) for (let ox = -1; ox <= 0; ox++) this.addSlot(x + ox, y + oy, z + oz);
    const S = (this.slots = this.slotOf.size);
    this.bpos = new Int32Array(S * 3);
    for (const [k, s] of this.slotOf) {
      this.bpos[s * 3] = Math.floor(k / (2048 * 2048)) - OFF;
      this.bpos[s * 3 + 1] = (Math.floor(k / 2048) % 2048) - OFF;
      this.bpos[s * 3 + 2] = (k % 2048) - OFF;
    }
    this.nb = new Int32Array(S * 27);
    for (let s = 0; s < S; s++)
      for (let oz = -1; oz <= 1; oz++) for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++)
        this.nb[s * 27 + nbi(ox, oy, oz)] = this.slotOf.get(bkey(this.bpos[s * 3] + ox, this.bpos[s * 3 + 1] + oy, this.bpos[s * 3 + 2] + oz)) ?? -1;

    /* which points are open, and whose; points under a cave's floor or over its ceiling are not */
    this.pid = new Int32Array(S * BR3).fill(-1);
    this.flags = new Uint8Array(S * BR3);
    this.room = new Int16Array(S * BR3).fill(-1);
    let n = 0;
    for (let s = 0; s < S; s++) {
      const bx = this.bpos[s * 3], by = this.bpos[s * 3 + 1], bz = this.bpos[s * 3 + 2], cells = g.chunkCells(bx, by, bz);
      if (!cells) continue;
      const x0 = bx * CHUNK * CELL, y0 = by * CHUNK * CELL, z0 = bz * CHUNK * CELL, span = CHUNK * CELL;
      const sf = w.surfaces.filter(f => f.def.x1 >= x0 && f.def.x0 <= x0 + span && f.def.z1 >= z0 && f.def.z0 <= z0 + span);
      for (let l = 0; l < BR3; l++) {
        const lx = l & 7, ly = (l >> 3) & 7, lz = l >> 6, c = cells[((2 * lz) * CHUNK + 2 * ly) * CHUNK + 2 * lx];
        if (c < 0) continue;
        if (sf.length) {
          const x = x0 + lx * LCELL + LOFF, y = y0 + ly * LCELL + LOFF, z = z0 + lz * LCELL + LOFF;
          if (sf.some(f => {
            const d = f.def;
            if (x < d.x0 || x > d.x1 || z < d.z0 || z > d.z1 || !f.has(x, z)) return false;
            const h = f.heightAt(x, z);
            return d.kind === 'floor' ? y < h && y > d.base : y > h && y < d.base;
          })) continue;
        }
        const L = s * BR3 + l;
        this.pid[L] = n++;
        this.flags[L] = OPEN;
        this.room[L] = c;
      }
    }
    this.n = n;
    this.pslot = new Int32Array(n);
    /* joins: to the next point along each axis, through the cell between */
    for (let s = 0; s < S; s++) {
      const cells = g.chunkCells(this.bpos[s * 3], this.bpos[s * 3 + 1], this.bpos[s * 3 + 2]);
      if (!cells) continue;
      for (let l = 0; l < BR3; l++) {
        const L = s * BR3 + l;
        if (!this.flags[L]) continue;
        this.pslot[this.pid[L]] = s;
        const lx = l & 7, ly = (l >> 3) & 7, lz = l >> 6;
        for (let a = 0; a < 3; a++) {
          const M = this.step(L, a, 1);
          if (M < 0 || !this.flags[M]) continue;
          const cx = 2 * lx + (a === 0 ? 1 : 0), cy = 2 * ly + (a === 1 ? 1 : 0), cz = 2 * lz + (a === 2 ? 1 : 0);
          if (cells[(cz * CHUNK + cy) * CHUNK + cx] >= 0) this.flags[L] |= JOIN << a;
        }
      }
    }
    /* gates: the joins that pass through a door's slab (glass lets light through) */
    w.def.doors.forEach((D, d) => {
      if (D.glass) return;
      const lo = (v: number) => Math.floor((v - LOFF) / LCELL), b0 = [D.x0, D.y0, D.z0], b1 = [D.x1, D.y1, D.z1];
      for (let k = lo(D.z0) - 1; k <= lo(D.z1) + 1; k++)
        for (let j = lo(D.y0) - 1; j <= lo(D.y1) + 1; j++)
          for (let i = lo(D.x0) - 1; i <= lo(D.x1) + 1; i++) {
            const L = this.point(i, j, k);
            if (L < 0) continue;
            const p = [i * LCELL + LOFF, j * LCELL + LOFF, k * LCELL + LOFF];
            for (let a = 0; a < 3; a++) {
              if (!(this.flags[L] & (JOIN << a))) continue;
              let through = Math.max(p[a], b0[a]) < Math.min(p[a] + LCELL, b1[a]);
              for (let o = 0; o < 3 && through; o++) if (o !== a && (p[o] < b0[o] || p[o] > b1[o])) through = false;
              if (!through) continue;
              this.flags[L] |= GATE << a;
              this.gateOf.set(L * 3 + a, d);
            }
          }
    });

    this.roomSource = new Int32Array(w.rooms.length).fill(-1);
    this.doors = w.def.doors.map(() => ({ src: new Int32Array(0), pts: new Int32Array(0), val: new Float32Array(0) }));
    this.build();
  }

  private addSlot(bx: number, by: number, bz: number): void {
    const k = bkey(bx, by, bz);
    if (!this.slotOf.has(k)) this.slotOf.set(k, this.slotOf.size);
  }

  /** the lattice point at (i, j, k), or -1 where there is no brick */
  point(i: number, j: number, k: number): number {
    const s = this.slotOf.get(bkey(i >> 3, j >> 3, k >> 3));
    return s === undefined ? -1 : s * BR3 + ((k & 7) * BR + (j & 7)) * BR + (i & 7);
  }

  /** the brick at (bx, by, bz), or -1 */
  slot(bx: number, by: number, bz: number): number {
    return this.slotOf.get(bkey(bx, by, bz)) ?? -1;
  }

  /** the point one step along axis a (0 x, 1 y, 2 z) from L, by d (±1); -1 where there is no brick */
  step(L: number, a: number, d: number): number {
    const s = L >> 9, l = L & 511;
    let x = l & 7, y = (l >> 3) & 7, z = l >> 6;
    if (a === 0) x += d; else if (a === 1) y += d; else z += d;
    return this.local(s, x, y, z);
  }

  /** the point at (x, y, z) in brick s's frame, where each may be one brick out either way */
  local(s: number, x: number, y: number, z: number): number {
    if (x < 0 || x > 7 || y < 0 || y > 7 || z < 0 || z > 7) {
      const ox = x < 0 ? -1 : x > 7 ? 1 : 0, oy = y < 0 ? -1 : y > 7 ? 1 : 0, oz = z < 0 ? -1 : z > 7 ? 1 : 0;
      s = this.nb[s * 27 + nbi(ox, oy, oz)];
      if (s < 0) return -1;
      x -= ox * BR; y -= oy * BR; z -= oz * BR;
    }
    return s * BR3 + (z * BR + y) * BR + x;
  }

  /** the join from L along axis a, by d (±1): -2 for none, -1 for open, or the door it goes through */
  private join(L: number, a: number, d: number): number {
    const M = d > 0 ? L : this.step(L, a, -1);
    if (M < 0) return -2;
    const f = this.flags[M];
    return !(f & (JOIN << a)) ? -2 : f & (GATE << a) ? this.gateOf.get(M * 3 + a)! : -1;
  }

  private vis = new Float32Array(1);
  private visDoor = new Int32Array(1);
  private reachL = new Int32Array(1);
  /** what a light at (ax, ay, az) can see, out to `r` (and only below it, if `down`): each open point, how much of it the
   *  light sees, and the door it sees it through (-1 none). Seen from point to point, out from the light: a point sees
   *  as much as the points next to it on the light's side that it is joined to, each by how much the way to the light
   *  runs along that axis. So the light goes straight through a doorway and spreads a little past its edges, and never
   *  through anything solid. A point seen through two doors is not seen. */
  private shine(ax: number, ay: number, az: number, r: number, down: boolean, f: (L: number, x: number, y: number, z: number, v: number, door: number) => void): void {
    const li = (v: number) => Math.round((v - LOFF) / LCELL);
    const oi = li(ax), ok = li(az);
    let oj = Math.floor((ay - LOFF) / LCELL), O = this.point(oi, oj, ok);
    if (O < 0 || !this.flags[O]) { oj++; O = this.point(oi, oj, ok); }
    if (O < 0 || !this.flags[O]) return;
    const R = Math.ceil(r / LCELL), N = 2 * R + 1, N3 = N * N * N;
    if (this.vis.length < N3) { this.vis = new Float32Array(N3); this.visDoor = new Int32Array(N3); this.reachL = new Int32Array(N3); }
    const V = this.vis, VD = this.visDoor, Ls = this.reachL;
    V.fill(0, 0, N3);
    Ls.fill(-1, 0, N3);
    const at = (di: number, dj: number, dk: number) => ((dk + R) * N + (dj + R)) * N + (di + R);
    /* the points in reach, brick by brick */
    for (let bz = (ok - R) >> 3; bz <= (ok + R) >> 3; bz++)
      for (let by = (oj - R) >> 3; by <= (oj + R) >> 3; by++)
        for (let bx = (oi - R) >> 3; bx <= (oi + R) >> 3; bx++) {
          const sl = this.slot(bx, by, bz);
          if (sl < 0) continue;
          for (let k = Math.max(ok - R, bz * BR); k <= Math.min(ok + R, bz * BR + 7); k++)
            for (let j = Math.max(oj - R, by * BR); j <= Math.min(oj + R, by * BR + 7); j++)
              for (let i = Math.max(oi - R, bx * BR); i <= Math.min(oi + R, bx * BR + 7); i++) {
                const L = sl * BR3 + ((k & 7) * BR + (j & 7)) * BR + (i & 7);
                if (this.flags[L]) Ls[at(i - oi, j - oj, k - ok)] = L;
              }
        }
    const SIGNS = [[1], [-1, 1]], DOWN = [[1], [-1]], e = [0, 0, 0], sg = [0, 0, 0], q = [0, 0, 0];
    for (let ai = 0; ai <= R; ai++)
      for (let aj = 0; aj <= R; aj++)
        for (let ak = 0; ak <= R; ak++)
          for (const si of SIGNS[ai ? 1 : 0])
            for (const sj of (down ? DOWN : SIGNS)[aj ? 1 : 0])
              for (const sk of SIGNS[ak ? 1 : 0]) {
                const di = si * ai, dj = sj * aj, dk = sk * ak, here = at(di, dj, dk), L = Ls[here];
                if (L < 0) continue;
                const x = (oi + di) * LCELL + LOFF, y = (oj + dj) * LCELL + LOFF, z = (ok + dk) * LCELL + LOFF;
                let v = 0, door = -1, most = 0;
                if (!ai && !aj && !ak) v = 1;
                else {
                  e[0] = ai ? Math.abs(x - ax) : 0; e[1] = aj ? Math.abs(y - ay) : 0; e[2] = ak ? Math.abs(z - az) : 0;
                  const sum = e[0] + e[1] + e[2];
                  if (sum <= 0) continue;
                  sg[0] = si; sg[1] = sj; sg[2] = sk;
                  q[0] = at(di - si, dj, dk); q[1] = at(di, dj - sj, dk); q[2] = at(di, dj, dk - sk);
                  /* from each axis's neighbour on the light's side, if joined to it */
                  for (let a = 0; a < 3; a++) {
                    if (!e[a] || !V[q[a]]) continue;
                    const J = this.join(Ls[q[a]], a, sg[a]), was = VD[q[a]];
                    if (J === -2 || (J >= 0 && was >= 0 && was !== J)) continue;
                    const c = (e[a] / sum) * V[q[a]];
                    v += c;
                    if (c > most) { most = c; door = J >= 0 ? J : was; }
                  }
                }
                if (v <= 0.01) continue;
                V[here] = v;
                VD[here] = door;
                f(L, x, y, z, v, door);
              }
  }

  /** the first open place of these, or null */
  private openOf(...at: [number, number, number][]): [number, number, number] | null {
    return at.find(([x, y, z]) => this.w.grid.at(x, y, z) >= 0) ?? null;
  }

  private build(): void {
    const w = this.w, n = this.n, rooms = w.rooms, room = this.room;
    const lamps = new Set<number>();
    for (const L of w.def.lamps) { const R = w.roomAt(L.x, L.y, L.z) ?? w.roomAt(L.x, L.y + 0.1, L.z) ?? w.roomAt(L.x, L.y + 1, L.z); if (R) lamps.add(R.id); }
    for (const F of w.def.fixtures ?? []) {
      const R = w.roomAt(F.x, F.y - 0.3, F.z);
      if (!R || lamps.has(R.id) || R.doorway) continue;
      let a = this.fixtures.get(R.id);
      if (!a) this.fixtures.set(R.id, (a = []));
      a.push(F);
    }

    /* each room's points */
    const own: number[][] = rooms.map(() => []);
    for (let L = 0; L < this.flags.length; L++) if (this.flags[L]) own[room[L]].push(L);

    /* each room's reach past itself: how far each point is from its nearest edge, in a straight line from that edge
       point, found by passing it out from point to joined point (nearest first); and the door it went through */
    const dist = new Float64Array(this.flags.length).fill(Infinity), seed = new Int32Array(this.flags.length);
    const via = new Int32Array(this.flags.length), heap = new Heap();
    const reach: { pts: number[]; d: number[]; door: number[] }[] = rooms.map(() => ({ pts: [], d: [], door: [] }));
    const share = new Float32Array(n), bp = this.bpos;
    const gi = (L: number) => bp[(L >> 9) * 3] * BR + (L & 7), gj = (L: number) => bp[(L >> 9) * 3 + 1] * BR + ((L >> 3) & 7);
    const gk = (L: number) => bp[(L >> 9) * 3 + 2] * BR + ((L >> 6) & 7);
    const gives = (R: RoomDef) => !R.doorway;
    for (const R of rooms) {
      if (!gives(R)) continue;
      const id = R.id, out = reach[id], touched: number[] = [];
      for (const L of own[id]) {
        share[this.pid[L]] += 1;
        edge: for (let a = 0; a < 3; a++)
          for (let s = -1; s <= 1; s += 2) {
            if (this.join(L, a, s) === -2 || room[this.step(L, a, s)] === id) continue;
            dist[L] = 0; seed[L] = L; via[L] = -1; touched.push(L); heap.push(L, 0);
            break edge;
          }
      }
      while (heap.size) {
        const d = heap.top, L = heap.pop();
        if (d > dist[L]) continue;
        const S = seed[L], si = gi(S), sj = gj(S), sk = gk(S);
        for (let a = 0; a < 3; a++)
          for (let s = -1; s <= 1; s += 2) {
            const J = this.join(L, a, s);
            if (J === -2 || (J >= 0 && via[L] >= 0 && via[L] !== J)) continue;
            const M = this.step(L, a, s);
            if (room[M] === id) continue;
            const ex = gi(M) - si, ey = gj(M) - sj, ez = gk(M) - sk, nd = Math.sqrt(ex * ex + ey * ey + ez * ez) * LCELL;
            if (nd > FILL.reach || nd >= dist[M]) continue;
            if (dist[M] === Infinity) touched.push(M);
            dist[M] = nd; seed[M] = S; via[M] = J >= 0 ? J : via[L];
            heap.push(M, nd);
          }
      }
      for (const L of touched) {
        if (room[L] !== id) {
          out.pts.push(L); out.d.push(dist[L]); out.door.push(via[L]);
          /* the share is reckoned with every door open: a shut one leaves a little shadow by it, as it would */
          share[this.pid[L]] += Math.exp(-dist[L] / FILL.fade);
        }
        dist[L] = Infinity;
      }
    }

    /* each room's source: its share of the fill (as much of its light as its fittings leave to bounce), and what its
       fittings throw; then each lamp's */
    const acc = new Float32Array(n), mark = new Uint8Array(n), thrown = new Float32Array(n), tgate = new Float32Array(n);
    const tdoor = new Int32Array(n).fill(-1);
    const gated = new Map<number, number>(); // point * 4096 + door -> how much
    const kp = new Int32Array(n), kv = new Float32Array(n), ks = new Int32Array(this.slots), ksm = new Uint8Array(this.slots);
    const perDoor: { src: number[]; pts: number[]; val: number[] }[] = this.doors.map(() => ({ src: [], pts: [], val: [] }));
    const keep = (rm: number, lamp: number, touched: number[]) => {
      let m = 0, ns = 0;
      for (const p of touched) {
        if (acc[p] > 1e-4) {
          kp[m] = p; kv[m++] = acc[p];
          const b = this.pslot[p];
          if (!ksm[b]) { ksm[b] = 1; ks[ns++] = b; }
        }
        acc[p] = 0; mark[p] = 0; thrown[p] = 0; tgate[p] = 0; tdoor[p] = -1;
      }
      for (let k = 0; k < ns; k++) ksm[ks[k]] = 0;
      const src = this.sources.length, gpts: number[] = [], gval: number[] = [], gdoor: number[] = [];
      for (const [key, v] of gated) {
        if (v <= 1e-4) continue;
        const p = Math.floor(key / 4096), d = key % 4096;
        gpts.push(p); gval.push(v); gdoor.push(d);
        perDoor[d].src.push(src); perDoor[d].pts.push(p); perDoor[d].val.push(v);
      }
      gated.clear();
      this.sources.push({
        room: rm, lamp, pts: kp.slice(0, m), val: kv.slice(0, m), slots: ks.slice(0, ns),
        gpts: Int32Array.from(gpts), gval: Float32Array.from(gval), gdoor: Int32Array.from(gdoor),
      });
    };
    const add = (p: number, v: number, door: number, touched: number[]) => {
      if (door < 0) {
        if (!mark[p]) { mark[p] = 1; touched.push(p); }
        acc[p] += v;
      } else gated.set(p * 4096 + door, (gated.get(p * 4096 + door) ?? 0) + v);
    };

    for (const R of rooms) {
      if (!gives(R) || R.lit === 'none') continue;
      const id = R.id, fx = this.fixtures.get(id), base = fx ? POOL.base : 1, touched: number[] = [];
      for (const L of own[id]) { const p = this.pid[L]; add(p, base / share[p], -1, touched); }
      const out = reach[id];
      for (let k = 0; k < out.pts.length; k++) {
        const p = this.pid[out.pts[k]];
        add(p, (base * Math.exp(-out.d[k] / FILL.fade)) / share[p], out.door[k], touched);
      }
      if (fx) {
        const hit: number[] = [];
        for (const F of fx) {
          const at = this.openOf([F.x, F.y - 0.1, F.z], [F.x, F.y - 0.3, F.z]);
          if (!at) continue;
          const [ax, ay, az] = at;
          this.shine(ax, ay, az, Math.min(THROW.most, Math.max(THROW.reach, ay - R.y0 + 2)), true, (L, x, y, z, seen, door) => {
            const dx = x - ax, dy = ay - y, dz = z - az;
            if (dy <= 0) return;
            const d2 = dx * dx + dy * dy + dz * dz, c = dy / Math.sqrt(d2), v = (seen * c * c * c * POOL.r2) / (POOL.r2 + d2);
            if (v < THROW.faint) return;
            const p = this.pid[L];
            if (!thrown[p]) hit.push(p);
            thrown[p] += v;
            if (door >= 0 && (tdoor[p] < 0 || tdoor[p] === door)) { tdoor[p] = door; tgate[p] += v; }
          });
        }
        /* up to once over, taken as straight and through a door in the shares they were thrown */
        for (const p of hit) {
          const all = POOL.gain * Math.min(thrown[p], 1), g = tgate[p] / thrown[p];
          add(p, all * (1 - g), -1, touched);
          if (g > 0) add(p, all * g, tdoor[p], touched);
        }
      }
      this.roomSource[id] = this.sources.length;
      keep(id, -1, touched);
    }

    /* lamps: a round pool, fading to nothing at its reach */
    w.def.lamps.forEach((Lp, k) => {
      const at = this.openOf([Lp.x, Lp.y, Lp.z], [Lp.x, Lp.y + 0.1, Lp.z], [Lp.x, Lp.y + 0.3, Lp.z], [Lp.x, Lp.y + 1, Lp.z]);
      const touched: number[] = [];
      if (at) {
        const [ax, ay, az] = at, r = Lp.r;
        this.shine(ax, ay, az, r, false, (L, x, y, z, seen, door) => {
          const d = Math.sqrt((x - ax) ** 2 + (y - ay) ** 2 + (z - az) ** 2);
          if (d < r) add(this.pid[L], seen * (1 - d / r), door, touched);
        });
      }
      keep(-1, k, touched);
    });

    this.doors.forEach((_, d) => {
      const D = perDoor[d];
      this.doors[d] = { src: Int32Array.from(D.src), pts: Int32Array.from(D.pts), val: Float32Array.from(D.val) };
    });
  }
}

/** a binary heap of points by distance */
class Heap {
  private k: number[] = [];
  private v: number[] = [];
  get size(): number { return this.k.length; }
  /** the least distance in it */
  get top(): number { return this.v[0]; }
  push(key: number, val: number): void {
    const k = this.k, v = this.v;
    let i = k.length;
    k.push(key); v.push(val);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (v[p] <= val) break;
      k[i] = k[p]; v[i] = v[p]; i = p;
    }
    k[i] = key; v[i] = val;
  }
  /** take the nearest point off */
  pop(): number {
    const k = this.k, v = this.v, top = k[0], lk = k.pop()!, lv = v.pop()!, n = k.length;
    if (n) {
      let i = 0;
      for (;;) {
        let c = 2 * i + 1;
        if (c >= n) break;
        if (c + 1 < n && v[c + 1] < v[c]) c++;
        if (v[c] >= lv) break;
        k[i] = k[c]; v[i] = v[c]; i = c;
      }
      k[i] = lk; v[i] = lv;
    }
    return top;
  }
}

const fields = new WeakMap<LevelDef, LightField>();
/** the level's light field, made the first time it is asked for. It is the level's as built, so every world made from
 *  one level shares it */
export function lightField(w: World): LightField {
  let f = fields.get(w.def);
  if (!f) fields.set(w.def, (f = new LightField(w)));
  return f;
}
