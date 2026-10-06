import { CELL } from './grid';
import { circle } from './shapes';
import type { Dyn, World } from './world';

/* The nav graph (engine.md §7): where something can stand, and how it gets from there to the next spot. Spots lie on a
   1 m lattice in plan and at every floor height, so one graph covers every layer of a level: a walkway and the hall
   under it are one place to the cast. Each spot knows its headroom (a big body skips low ones), its room, and the door
   it stands in, if any (the door's state decides at run time who may pass). Platforms join their two ends.

   Built once per level with everything that moves moved out of the way; the sim keeps it, and fields over it say how far
   each spot is from the player: by foot for each kind of body, and for sound, which closed doors muffle. */

export const NAV = 1;
const R = 0.3;
/** a spot needs this much headroom at least (a crouch, or something low) */
const LOW = 1.0;
const STEP_UP = 0.5; // as a body walks: body.ts STEP_UP
const DROP = 2.5;

export const enum Edge { Walk = 0, Drop = 1, Lift = 2 }

export interface NavDoor { x0: number; z0: number; x1: number; z1: number; y0: number }
export interface NavLift { x0: number; z0: number; x1: number; z1: number; y0: number; y1: number }

export class Nav {
  n = 0;
  x: Float32Array; y: Float32Array; z: Float32Array;
  head: Float32Array;
  room: Int16Array;
  /** the door this spot stands in, or -1 */
  door: Int16Array;
  /** edges, compressed: node i's run from start[i] to start[i + 1] in to[] */
  start: Int32Array;
  to: Int32Array;
  kind: Uint8Array;
  /** for lift edges: which platform */
  lift: Int16Array;
  /** how far along the floor (a lift's ride counts its height) */
  len: Float32Array;
  /** the spots in each room */
  byRoom = new Map<number, number[]>();
  private cols = new Map<number, number[]>();

  constructor(spots: { x: number; y: number; z: number; head: number; room: number; door: number }[], edges: [number, number, Edge, number, number][]) {
    const n = (this.n = spots.length);
    this.x = new Float32Array(n); this.y = new Float32Array(n); this.z = new Float32Array(n);
    this.head = new Float32Array(n); this.room = new Int16Array(n); this.door = new Int16Array(n);
    spots.forEach((s, i) => {
      this.x[i] = s.x; this.y[i] = s.y; this.z[i] = s.z; this.head[i] = s.head; this.room[i] = s.room; this.door[i] = s.door;
      const k = colKey(Math.floor(s.x / NAV), Math.floor(s.z / NAV));
      let c = this.cols.get(k);
      if (!c) this.cols.set(k, (c = []));
      c.push(i);
      if (s.room >= 0) { let r = this.byRoom.get(s.room); if (!r) this.byRoom.set(s.room, (r = [])); r.push(i); }
    });
    edges.sort((a, b) => a[0] - b[0]);
    this.start = new Int32Array(n + 1);
    this.to = new Int32Array(edges.length); this.kind = new Uint8Array(edges.length); this.lift = new Int16Array(edges.length); this.len = new Float32Array(edges.length);
    let e = 0;
    for (let i = 0; i < n; i++) {
      this.start[i] = e;
      while (e < edges.length && edges[e][0] === i) { this.to[e] = edges[e][1]; this.kind[e] = edges[e][2]; this.lift[e] = edges[e][3]; this.len[e] = edges[e][4]; e++; }
    }
    this.start[n] = e;
  }

  /** the spot something at (x, y, z) stands on: in its own lattice square if it can, else the nearest about it */
  locate(x: number, y: number, z: number): number {
    const ix = Math.floor(x / NAV), iz = Math.floor(z / NAV);
    let best = -1, bd = Infinity;
    for (let r = 0; r <= 1 && best < 0; r++)
      for (let dz = -r; dz <= r; dz++)
        for (let dx = -r; dx <= r; dx++) {
          const c = this.cols.get(colKey(ix + dx, iz + dz));
          if (!c) continue;
          for (const i of c) {
            const dy = y - this.y[i];
            if (dy < -0.8 || dy > 1.2) continue;
            const d = Math.hypot(this.x[i] - x, this.z[i] - z) + Math.abs(dy) * 2;
            if (d < bd) { bd = d; best = i; }
          }
        }
    return best;
  }
}

const colKey = (ix: number, iz: number) => (ix + 32768) * 65536 + (iz + 32768);

/** build the graph for a world. Doors and platforms are passed so their spots and links can be marked. */
export function buildNav(w: World, doors: NavDoor[], lifts: NavLift[]): Nav {
  /* everything that moves is out of the way while the graph is made: doors open, crates and bodies gone */
  const saved = w.dyn.map(d => [d.y0, d.y1] as const);
  for (const d of w.dyn) { d.y0 = d.y1 = -1e6; }
  try {
    return build(w, doors, lifts);
  } finally {
    w.dyn.forEach((d: Dyn, i) => { d.y0 = saved[i][0]; d.y1 = saved[i][1]; });
  }
}

function build(w: World, doors: NavDoor[], lifts: NavLift[]): Nav {
  /* the level's extent, from its chunks */
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  w.grid.forEachChunk((cx, cy, cz) => {
    x0 = Math.min(x0, cx * 4); x1 = Math.max(x1, cx * 4 + 4); z0 = Math.min(z0, cz * 4); z1 = Math.max(z1, cz * 4 + 4);
    y0 = Math.min(y0, cy * 4); y1 = Math.max(y1, cy * 4 + 4);
  });
  const spots: { x: number; y: number; z: number; head: number; room: number; door: number }[] = [];
  const byCol = new Map<number, number[]>();
  const g = w.grid, j0 = Math.floor(y0 / CELL) - 1, j1 = Math.ceil(y1 / CELL); // one below: a floor on an all-rock chunk
  for (let iz = Math.floor(z0 / NAV); iz < Math.ceil(z1 / NAV); iz++)
    for (let ix = Math.floor(x0 / NAV); ix < Math.ceil(x1 / NAV); ix++) {
      const x = (ix + 0.5) * NAV, z = (iz + 0.5) * NAV, f = circle(x, z, R);
      /* floors in this column: rock or a block with open space over it, and any sloped floor */
      const cand: number[] = [];
      const ci = Math.floor(x / CELL), ck = Math.floor(z / CELL);
      for (let j = j0; j < j1; j++) if (g.get(ci, j, ck) < 0 && g.get(ci, j + 1, ck) >= 0) cand.push((j + 1) * CELL);
      for (const s of w.surfaces) {
        const d = s.def;
        if (d.kind === 'floor' && x >= d.x0 && x <= d.x1 && z >= d.z0 && z <= d.z1) cand.push(s.heightAt(x, z));
      }
      const here: number[] = [];
      for (const c of cand) {
        const gy = w.groundBelow(f, c + 0.3);
        if (gy === -Infinity || gy < c - 0.3) continue;
        if (w.overlap(f, gy + 0.01, gy + LOW)) continue;
        if (here.some(i => Math.abs(spots[i].y - gy) < 0.4)) continue;
        const head = w.ceilingAbove(f, gy + 0.01) - gy, R0 = w.roomAt(x, gy + 0.5, z);
        let door = -1;
        doors.forEach((d, k) => {
          const along = d.x1 - d.x0 > d.z1 - d.z0, cx = (d.x0 + d.x1) / 2, cz = (d.z0 + d.z1) / 2;
          const inX = along ? x > d.x0 && x < d.x1 : Math.abs(x - cx) < 1;
          const inZ = along ? Math.abs(z - cz) < 1 : z > d.z0 && z < d.z1;
          if (inX && inZ && Math.abs(gy - d.y0) < 0.6) door = k;
        });
        here.push(spots.length);
        spots.push({ x, y: gy, z, head, room: R0 ? R0.id : -1, door });
      }
      if (here.length) byCol.set(colKey(ix, iz), here);
    }

  const near = (list: number[] | undefined, y: number) => !!list && list.some(i => Math.abs(spots[i].y - y) <= STEP_UP);
  /* links between neighbouring spots: a step up or down, or a drop one way; the way between must be clear */
  const edges: [number, number, Edge, number, number][] = [];
  for (const [k, list] of byCol) {
    const ix = Math.floor(k / 65536) - 32768, iz = (k % 65536) - 32768;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const other = byCol.get(colKey(ix + dx, iz + dz));
      if (!other) continue;
      const diag = dx && dz;
      for (const a of list)
        for (const b of other) {
          const A = spots[a], B = spots[b], rise = B.y - A.y;
          if (rise > STEP_UP || -rise > DROP || (diag && Math.abs(rise) > STEP_UP)) continue;
          const top = Math.max(A.y, B.y), mx = (A.x + B.x) / 2, mz = (A.z + B.z) / 2;
          /* the way between must be clear: on a diagonal, the corner it cuts and both squares beside it */
          if (w.overlap(circle(mx, mz, R), top + 0.01, top + LOW)) continue;
          if (diag && !(near(byCol.get(colKey(ix + dx, iz)), A.y) && near(byCol.get(colKey(ix, iz + dz)), A.y))) continue;
          edges.push([a, b, -rise > STEP_UP ? Edge.Drop : Edge.Walk, -1, diag ? Math.SQRT2 * NAV : NAV]);
        }
    }
  }

  /* a platform joins the spots on it at the bottom to the spots beside it at the top */
  lifts.forEach((L, li) => {
    const bottom: number[] = [], top: number[] = [];
    spots.forEach((s, i) => {
      const on = s.x > L.x0 && s.x < L.x1 && s.z > L.z0 && s.z < L.z1;
      if (on && Math.abs(s.y - L.y0) < 0.4) bottom.push(i);
      const near = s.x > L.x0 - 1.2 && s.x < L.x1 + 1.2 && s.z > L.z0 - 1.2 && s.z < L.z1 + 1.2;
      if (near && !on && Math.abs(s.y - L.y1) < 0.4) top.push(i);
    });
    const ride = Math.abs(L.y1 - L.y0) + 4; // the ride, and the wait for it
    for (const b of bottom) for (const t of top) { edges.push([b, t, Edge.Lift, li, ride]); edges.push([t, b, Edge.Lift, li, ride]); }
  });

  return new Nav(spots, edges);
}

/* ---- fields: distance from one spot to every other, by a rule for who may pass where */

/** who may go where, as arrays (no call per edge): spots that may not be entered, what entering a spot costs on top of
 *  the way there (a shut door muffling a sound), which platforms may be ridden, what a drop costs on top */
export interface Rules {
  blocked: Uint8Array;
  enter: Float32Array | null;
  lifts: Uint8Array;
  drop: number;
}

/** anywhere, on foot: every spot, every platform */
export function openRules(nav: Nav): Rules {
  let lifts = 0;
  for (let e = 0; e < nav.lift.length; e++) lifts = Math.max(lifts, nav.lift[e] + 1);
  return { blocked: new Uint8Array(nav.n), enter: null, lifts: new Uint8Array(lifts).fill(1), drop: 0 };
}

/** may the edge e (from spot a into spot b) be taken under these rules? null if not; else what it costs */
export function edgeCost(nav: Nav, R: Rules, e: number, b: number): number | null {
  if (R.blocked[b]) return null;
  const k = nav.kind[e];
  if (k === Edge.Lift && !R.lifts[nav.lift[e]]) return null;
  return nav.len[e] + (k === Edge.Drop ? R.drop : 0) + (R.enter ? R.enter[b] : 0);
}

/** distances from `from` over the graph by these rules, out to `limit` (beyond it, Infinity). Walked backwards: the
 *  field says how far each spot is from `from` when walking toward it. */
export function field(nav: Nav, from: number, R: Rules, out?: Float32Array, limit = Infinity): Float32Array {
  const d = out ?? new Float32Array(nav.n);
  d.fill(Infinity);
  if (from < 0) return d;
  /* the graph's edges run forward; a field to `from` needs them backward. Built once per nav. */
  const rev = reverse(nav), heap = heapFor(nav);
  const { blocked, enter, lifts, drop } = R, kind = nav.kind, lift = nav.lift, len = nav.len;
  heap.size = 0;
  d[from] = 0;
  heap.push(from, 0);
  while (heap.size) {
    const b = heap.pop(), db = d[b];
    if (db > limit) break;
    /* a spot that may not be entered is never on the way to anywhere (but the start always is) */
    if (b !== from && blocked[b]) continue;
    const eb = enter ? enter[b] : 0;
    for (let e = rev.start[b]; e < rev.start[b + 1]; e++) {
      const a = rev.from[e], fe = rev.edge[e], k = kind[fe];
      if (k === Edge.Lift && !lifts[lift[fe]]) continue;
      const nd = db + len[fe] + eb + (k === Edge.Drop ? drop : 0);
      if (nd < d[a]) { d[a] = nd; heap.push(a, nd); }
    }
  }
  return d;
}

const heaps = new WeakMap<Nav, Heap>();
const heapFor = (nav: Nav) => {
  let h = heaps.get(nav);
  if (!h) heaps.set(nav, (h = new Heap(nav.n)));
  return h;
};

const reverses = new WeakMap<Nav, { start: Int32Array; from: Int32Array; edge: Int32Array }>();
function reverse(nav: Nav) {
  let r = reverses.get(nav);
  if (r) return r;
  const n = nav.n, m = nav.to.length, count = new Int32Array(n + 1);
  for (let e = 0; e < m; e++) count[nav.to[e] + 1]++;
  for (let i = 0; i < n; i++) count[i + 1] += count[i];
  const start = count.slice(), fill = count.slice(0, n), from = new Int32Array(m), edge = new Int32Array(m);
  for (let a = 0; a < n; a++)
    for (let e = nav.start[a]; e < nav.start[a + 1]; e++) { const b = nav.to[e], p = fill[b]++; from[p] = a; edge[p] = e; }
  r = { start, from, edge };
  reverses.set(nav, r);
  return r;
}

/** a binary heap of spots by distance */
class Heap {
  private ids: Int32Array;
  private keys: Float32Array;
  size = 0;
  constructor(cap: number) { this.ids = new Int32Array(cap * 4 + 16); this.keys = new Float32Array(cap * 4 + 16); }
  push(id: number, k: number): void {
    if (this.size >= this.ids.length) {
      const ni = new Int32Array(this.ids.length * 2), nk = new Float32Array(this.ids.length * 2);
      ni.set(this.ids); nk.set(this.keys); this.ids = ni; this.keys = nk;
    }
    let i = this.size++;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= k) break;
      this.ids[i] = this.ids[p]; this.keys[i] = this.keys[p]; i = p;
    }
    this.ids[i] = id; this.keys[i] = k;
  }
  pop(): number {
    const top = this.ids[0], id = this.ids[--this.size], k = this.keys[this.size];
    let i = 0;
    for (;;) {
      let c = 2 * i + 1;
      if (c >= this.size) break;
      if (c + 1 < this.size && this.keys[c + 1] < this.keys[c]) c++;
      if (this.keys[c] >= k) break;
      this.ids[i] = this.ids[c]; this.keys[i] = this.keys[c]; i = c;
    }
    this.ids[i] = id; this.keys[i] = k;
    return top;
  }
}
