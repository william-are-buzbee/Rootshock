import * as THREE from 'three';
import { BLACK, scale3, type Colour } from '../../core/math';
import { CELL, CHUNK } from '../../world/grid';
import type { Surface, World } from '../../world/world';
import type { Lighting } from '../../world/light';
import type { PropDef } from '../../content/types';
import { TEMPLATES } from './templates';

/* The level's static mesh. Flat surfaces come from the grid: wherever open space meets solid, there is a face, coloured by
   the room on the open side and by what the solid is (rock takes the room's palette; a block, its own colour). Faces are
   merged into the largest flat rectangles that share a colour (within a chunk), then cut where the palette changes (the dado
   and the stripe on walls, the 2 m checker on floors). Sloped surfaces (ramps, cave floors and ceilings) are drawn from their
   own lattices. Fixed props are added from their shapes; loose ones are drawn elsewhere, since they move.

   Light is baked into each vertex, but each vertex also remembers where its light comes from (a room, a point to sample
   it at, a multiplier), so when the power changes only the light is recomputed, not the mesh (LevelMesh.relight). */

/** a vertex's light: from this room, sampled at (x, z), times m */
interface Src { room: number; x: number; z: number; m: number; flick: number }

class Out {
  P: number[] = [];
  C: number[] = [];
  room: number[] = [];
  sx: number[] = [];
  sz: number[] = [];
  m: number[] = [];
  flick: number[] = [];
  /** fittings whose colour shows power: [first vertex, count, which] */
  pw: [number, number, [Colour, Colour], string][] = [];
  vert(x: number, y: number, z: number, c: Colour, src: Src): void {
    this.P.push(x, y, z);
    this.C.push(c[0], c[1], c[2]);
    this.room.push(src.room); this.sx.push(src.x); this.sz.push(src.z); this.m.push(src.m); this.flick.push(src.flick);
  }
  /** a rectangle on plane `a` (0 x, 1 y, 2 z) at `s`, spanning [u0, u1] x [v0, v1] on the other two axes in order,
   *  each corner lit by the room where it is */
  rect(a: number, s: number, u0: number, u1: number, v0: number, v1: number, c: Colour, room: number, m: number, flick = 0): void {
    const pt = (u: number, v: number): [number, number, number] =>
      a === 0 ? [s, u, v] : a === 1 ? [u, s, v] : [u, v, s];
    const q = [pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)];
    for (const k of [0, 1, 2, 0, 2, 3]) this.vert(q[k][0], q[k][1], q[k][2], c, { room, x: q[k][0], z: q[k][2], m, flick });
  }
  get count(): number { return this.P.length / 3; }
}

/** the level's mesh, and how to light it again */
export class LevelMesh {
  readonly geometry = new THREE.BufferGeometry();
  private light: Float32Array;
  private col: Float32Array;
  constructor(private o: Out) {
    this.col = new Float32Array(o.C);
    this.light = new Float32Array(o.count * 4);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(o.P), 3));
    this.geometry.setAttribute('aCol', new THREE.BufferAttribute(this.col, 3));
    this.geometry.setAttribute('aLight', new THREE.BufferAttribute(this.light, 4));
  }
  /** work out every vertex's light (and every fitting's colour) under this lighting */
  relight(L: Lighting): void {
    const o = this.o, n = o.count;
    for (let i = 0; i < n; i++) this.vertex(L, i);
    for (const [first, count, pw, circuit] of o.pw) this.fitting(L, first, count, pw, circuit);
    this.geometry.getAttribute('aLight').needsUpdate = true;
    this.geometry.getAttribute('aCol').needsUpdate = true;
  }

  /** only these rooms' vertices and fittings: a light coming on room by room (present/cascade.ts) */
  relightRooms(L: Lighting, rooms: Iterable<number>): void {
    const o = this.o;
    if (!this.byRoom) {
      this.byRoom = new Map();
      for (let i = 0; i < o.count; i++) { let a = this.byRoom.get(o.room[i]); if (!a) this.byRoom.set(o.room[i], (a = [])); a.push(i); }
      this.pwByRoom = new Map();
      o.pw.forEach((f, k) => { const r = o.room[f[0]]; let a = this.pwByRoom!.get(r); if (!a) this.pwByRoom!.set(r, (a = [])); a.push(k); });
    }
    for (const r of rooms) {
      for (const i of this.byRoom.get(r) ?? []) this.vertex(L, i);
      for (const k of this.pwByRoom!.get(r) ?? []) { const [first, count, pw, circuit] = o.pw[k]; this.fitting(L, first, count, pw, circuit); }
    }
    this.geometry.getAttribute('aLight').needsUpdate = true;
    this.geometry.getAttribute('aCol').needsUpdate = true;
  }

  private byRoom: Map<number, number[]> | null = null;
  private pwByRoom: Map<number, number[]> | null = null;

  private vertex(L: Lighting, i: number): void {
    const o = this.o, r = o.room[i], l = r >= 0 ? L.at(r, o.sx[i], o.sz[i], o.P[i * 3 + 1]) : BLACK, m = o.m[i];
    this.light[i * 4] = l[0] * m; this.light[i * 4 + 1] = l[1] * m; this.light[i * 4 + 2] = l[2] * m; this.light[i * 4 + 3] = o.flick[i];
  }

  private fitting(L: Lighting, first: number, count: number, pw: [Colour, Colour], circuit: string): void {
    const c = L.fittingIn(pw, circuit, this.o.room[first]);
    for (let i = first; i < first + count; i++) this.col.set(c, i * 3);
  }
}

/** cut [lo, hi] at each of `at` that falls inside it */
function cuts(lo: number, hi: number, at: number[]): [number, number][] {
  const xs = [lo, ...at.filter(x => x > lo + 1e-6 && x < hi - 1e-6).sort((p, q) => p - q), hi];
  const out: [number, number][] = [];
  for (let i = 0; i < xs.length - 1; i++) out.push([xs[i], xs[i + 1]]);
  return out;
}
/** the lines every `step` metres inside [lo, hi] (the 2 m tiles by default) */
function tiles(lo: number, hi: number, step = 2): number[] {
  const a: number[] = [];
  for (let x = Math.ceil(lo / step) * step; x < hi; x += step) a.push(x);
  return a;
}
const odd = (a: number, b: number): boolean => ((Math.floor(a / 2) + Math.floor(b / 2)) & 1) === 1;

/** build the level's mesh, lit by L. Lamps are battery lights, fixed for good, so where the mesh is cut for their pools
 *  does not change with the power. */
export function buildLevelMesh(w: World, L: Lighting): LevelMesh {
  const g = w.grid, o = new Out();

  /* a rectangle lit by its room. Where the room has lamps, it is cut into 1 m pieces so their pools show. */
  const put = (a: number, s: number, u0: number, u1: number, v0: number, v1: number, room: number, c: Colour, m: number) => {
    const flick = w.rooms[room].flick ? 1 : 0;
    if (!L.hasLamps(room)) { o.rect(a, s, u0, u1, v0, v1, c, room, m, flick); return; }
    const us = a === 0 ? [[u0, u1] as [number, number]] : cuts(u0, u1, tiles(u0, u1, 1));
    const vs = a === 2 ? [[v0, v1] as [number, number]] : cuts(v0, v1, tiles(v0, v1, 1));
    for (const [ua, ub] of us) for (const [va, vb] of vs) o.rect(a, s, ua, ub, va, vb, c, room, m, flick);
  };

  /* is a floor (or ceiling) face at height s over x0..x1, z0..z1 lying wholly under (over) a sloped surface of its kind,
     at or above (below) it everywhere? Then the surface is what shows, and drawing both would have them fight where they
     meet in one plane: a cave whose floor is flat at its room's floor, say. Asked every half metre across the face. */
  const covered = (floor: boolean, s: number, x0: number, x1: number, z0: number, z1: number): boolean => {
    const kind = floor ? 'floor' : 'ceiling';
    return w.surfaces.some(sf => {
      const d = sf.def;
      if (d.kind !== kind || d.hidden || x0 < d.x0 - 1e-3 || x1 > d.x1 + 1e-3 || z0 < d.z0 - 1e-3 || z1 > d.z1 + 1e-3) return false;
      const nx = Math.max(1, Math.ceil((x1 - x0) / 0.5)), nz = Math.max(1, Math.ceil((z1 - z0) / 0.5));
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) {
        const x = Math.min(Math.max(x0 + ((x1 - x0) * i) / nx, x0 + 0.01), x1 - 0.01), z = Math.min(Math.max(z0 + ((z1 - z0) * j) / nz, z0 + 0.01), z1 - 0.01);
        if (!sf.has(x, z)) return false;
        const h = sf.heightAt(x, z);
        if (floor ? h < s - 0.002 : h > s + 0.002) return false;
      }
      return true;
    });
  };

  /* one face: axis a, plane s (world), rectangle over the other two axes (world), the open side's room, the solid's block (-1 rock) */
  const face = (a: number, s: number, u0: number, u1: number, v0: number, v1: number, room: number, block: number, openUp: boolean) => {
    const R = w.rooms[room];
    if (a === 1 && covered(openUp, s, u0, u1, v0, v1)) return;
    if (block >= 0) {
      put(a, s, u0, u1, v0, v1, room, w.blocks[block].colour, 1);
      return;
    }
    if (a === 1) {
      /* u is x, v is z */
      if (openUp && !R.plain) {
        for (const [x0, x1] of cuts(u0, u1, tiles(u0, u1)))
          for (const [z0, z1] of cuts(v0, v1, tiles(v0, v1)))
            put(a, s, x0, x1, z0, z1, room, scale3(R.floor, odd(x0, z0) ? 1 : 0.92), 1);
      } else if (openUp) put(a, s, u0, u1, v0, v1, room, R.floor, 1);
      else if (R.sky) {
        /* the cavern's roof, painted sky, lit up more than a ceiling (as before) */
        for (const [x0, x1] of cuts(u0, u1, tiles(u0, u1)))
          for (const [z0, z1] of cuts(v0, v1, tiles(v0, v1)))
            put(a, s, x0, x1, z0, z1, room, scale3(R.sky, odd(x0, z0) ? 1 : 0.95), 1.5);
      } else put(a, s, u0, u1, v0, v1, room, scale3(R.wall, 0.6), 0.8);
      return;
    }
    /* a wall. On plane x the axes are (y, z); on plane z, (x, y). High up a tall room, walls are darker (as before). */
    const yAxisFirst = a === 0;
    const [y0, y1] = yAxisFirst ? [u0, u1] : [v0, v1], [h0, h1] = yAxisFirst ? [v0, v1] : [u0, u1];
    const f = R.y0;
    for (const [ya, yb] of cuts(y0, y1, R.plain ? [f + 3.2] : [f + 0.9, f + 1.05, f + 3.2])) {
      const high = ya >= f + 3.2 - 1e-6;
      const band = R.plain || high ? 2 : yb <= f + 0.9 + 1e-6 ? 0 : yb <= f + 1.05 + 1e-6 ? 1 : 2;
      for (const [ha, hb] of band === 2 && !R.plain ? cuts(h0, h1, tiles(h0, h1)) : [[h0, h1] as [number, number]]) {
        const c = band === 0 ? scale3(R.wall, 0.78) : band === 1 ? R.stripe : R.plain ? R.wall : scale3(R.wall, odd(ha, 0) ? 1 : 0.95);
        if (yAxisFirst) put(a, s, ya, yb, ha, hb, room, c, high ? 0.6 : 1);
        else put(a, s, ha, hb, ya, yb, room, c, high ? 0.6 : 1);
      }
    }
  };

  /* chunk by chunk. A chunk draws the faces on planes whose far cell is its own, and the plane past its far side when
     nothing lies beyond (no chunk there, so nobody else would). */
  const mask = new Int32Array(CHUNK * CHUNK), stride = [1, CHUNK, CHUNK * CHUNK];
  g.forEachChunk((cx, cy, cz) => {
    const base = [cx * CHUNK, cy * CHUNK, cz * CHUNK], own = g.chunkCells(cx, cy, cz)!;
    /* a chunk that is all open or all solid has no faces inside it: only its boundary planes need looking at */
    const open0 = own[0] >= 0;
    let mixed = false;
    for (let n = 1; n < own.length; n++) if (own[n] >= 0 !== open0) { mixed = true; break; }
    for (let a = 0; a < 3; a++) {
      const ua = a === 0 ? 1 : 0, va = a === 2 ? 1 : 2, ou = stride[ua], ov = stride[va], d = stride[a];
      const prev = [cx, cy, cz], next = [cx, cy, cz];
      prev[a]--; next[a]++;
      /* cells are read straight from the chunk's array; the plane on its near side reads the neighbour's last layer */
      const before = g.chunkCells(prev[0], prev[1], prev[2]), last = g.hasChunk(next[0], next[1], next[2]) ? CHUNK - 1 : CHUNK;
      for (let ls = 0; ls <= last; ls++) {
        if (!mixed && ls > 0 && ls < CHUNK) continue;
        const s = base[a] + ls;
        for (let v = 0; v < CHUNK; v++)
          for (let u = 0; u < CHUNK; u++) {
            const o = u * ou + v * ov;
            const A = ls > 0 ? own[o + (ls - 1) * d] : before ? before[o + (CHUNK - 1) * d] : -1;
            const B = ls < CHUNK ? own[o + ls * d] : -1;
            let key = 0;
            if ((A >= 0) !== (B >= 0)) {
              const room = A >= 0 ? A : B, solid = A >= 0 ? B : A, side = B >= 0 ? 1 : 0;
              key = ((-1 - solid) * 4096 + room) * 2 + side + 1;
            }
            mask[v * CHUNK + u] = key;
          }
        /* greedy: grow each face along u, then along v, while the key holds */
        for (let v = 0; v < CHUNK; v++)
          for (let u = 0; u < CHUNK; ) {
            const key = mask[v * CHUNK + u];
            if (!key) { u++; continue; }
            let w1 = 1;
            while (u + w1 < CHUNK && mask[v * CHUNK + u + w1] === key) w1++;
            let h1 = 1;
            grow: while (v + h1 < CHUNK) {
              for (let q = 0; q < w1; q++) if (mask[(v + h1) * CHUNK + u + q] !== key) break grow;
              h1++;
            }
            for (let r = 0; r < h1; r++) for (let q = 0; q < w1; q++) mask[(v + r) * CHUNK + u + q] = 0;
            const k = key - 1, side = k & 1, room = (k >> 1) & 4095, block = Math.floor((k >> 1) / 4096) - 1;
            const U = base[ua] + u, V = base[va] + v;
            face(a, s * CELL, U * CELL, (U + w1) * CELL, V * CELL, (V + h1) * CELL, room, block, side === 1);
            u += w1;
          }
      }
    }
  });

  for (const sf of w.surfaces) if (!sf.def.hidden) surfaceMesh(o, w, sf);

  /* fixed props, lit by the room they stand in (where they stand, for lamp pools); fittings show their circuit's power.
     Each is drawn a hair larger than it is (apart: see `apart`), so where two meet face to face, or one stands on the
     floor or a shelf, the faces are not in one plane and do not fight. */
  w.def.props.forEach((p, k) => {
    if (p.loose) return;
    const R = w.roomAt(p.x, p.y + 0.05, p.z) ?? w.roomAt(p.x, p.y + p.sy / 2, p.z), src: Src = { room: R ? R.id : -1, x: p.x, z: p.z, m: p.glow, flick: 0 };
    const first = o.count, e = apart(k);
    propVerts({ ...p, sx: p.sx + 2 * e, sy: p.sy + 2 * e, sz: p.sz + 2 * e, y: p.y - e }, (x, y, z) => o.vert(x, y, z, p.colour, src));
    if (p.pw) o.pw.push([first, o.count - first, p.pw, p.pc ?? w.def.circuit]);
  });

  const mesh = new LevelMesh(o);
  mesh.relight(L);
  return mesh;
}

/** a prop's triangles in the world, from its template: scaled, tipped (rz), turned (ry), stood on its base */
export function propVerts(p: PropDef, put: (x: number, y: number, z: number) => void, at?: { x: number; y: number; z: number }): void {
  const src = TEMPLATES[p.shape], px = at ? at.x : p.x, py = at ? at.y : p.y, pz = at ? at.z : p.z;
  const cy = Math.cos(p.ry), sy = Math.sin(p.ry), cz = Math.cos(p.rz), sz = Math.sin(p.rz), by = py + p.sy / 2;
  for (let v = 0; v < src.length; v += 3) {
    let X = src[v] * p.sx, Y = src[v + 1] * p.sy, Z = src[v + 2] * p.sz;
    if (p.rz) { const x2 = X * cz - Y * sz; Y = X * sz + Y * cz; X = x2; }
    const x3 = X * cy + Z * sy; Z = -X * sy + Z * cy; X = x3;
    put(px + X, by + Y, pz + Z);
  }
}

/** how much larger than it is the k-th of a set of parts is drawn, each side: 1 to 7 mm, different for neighbours, so two
 *  parts made flush (a button on its post, a box on a shelf, a crate on the floor) never share a plane. Everything is
 *  drawn two-sided, so a face pressed against another shows through it unless one stands clear. */
export const apart = (k: number): number => 0.001 * (1 + (k % 7));

/** a sloped surface: its lattice as quads, and for a ramp its edges down to the base */
function surfaceMesh(o: Out, w: World, sf: Surface): void {
  const d = sf.def, floor = d.kind === 'floor', res = d.res;
  const X = (i: number) => d.x0 + i * res, Z = (j: number) => d.z0 + j * res, H = (i: number, j: number) => d.h[j * d.nx + i];
  /* each quad is lit by the room it faces, sampled at its middle */
  const src = (x: number, y: number, z: number, m: number): Src => {
    const R = w.roomAt(x, y + (floor ? 0.3 : -0.3), z);
    return { room: R ? R.id : -1, x, z, m, flick: 0 };
  };
  const m = floor ? 1 : 0.8;
  for (let j = 0; j < d.nz - 1; j++)
    for (let i = 0; i < d.nx - 1; i++) {
      if (d.mask && !d.mask[j * (d.nx - 1) + i]) continue;
      const x0 = X(i), x1 = X(i + 1), z0 = Z(j), z1 = Z(j + 1), h00 = H(i, j), h10 = H(i + 1, j), h11 = H(i + 1, j + 1), h01 = H(i, j + 1);
      const l = src((x0 + x1) / 2, (h00 + h11) / 2, (z0 + z1) / 2, m), c = d.sides ? d.colour : scale3(d.colour, 0.94 + 0.06 * (((i * 7 + j * 13) % 5) / 4));
      const q: [number, number, number][] = [[x0, h00, z0], [x1, h10, z0], [x1, h11, z1], [x0, h01, z1]];
      for (const k of [0, 1, 2, 0, 2, 3]) o.vert(q[k][0], q[k][1], q[k][2], c, l);
    }
  if (!d.sides) return;
  const side = (pts: [number, number, number][]) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, ah, az] = pts[k], [bx, bh, bz] = pts[k + 1], l = src((ax + bx) / 2, d.base + 0.1, (az + bz) / 2, 1), c = scale3(d.colour, 0.85);
      const q: [number, number, number][] = [[ax, d.base, az], [bx, d.base, bz], [bx, bh, bz], [ax, ah, az]];
      for (const n of [0, 1, 2, 0, 2, 3]) o.vert(q[n][0], q[n][1], q[n][2], c, l);
    }
  };
  side(Array.from({ length: d.nx }, (_, i) => [X(i), H(i, 0), Z(0)] as [number, number, number]));
  side(Array.from({ length: d.nx }, (_, i) => [X(i), H(i, d.nz - 1), Z(d.nz - 1)] as [number, number, number]));
  side(Array.from({ length: d.nz }, (_, j) => [X(0), H(0, j), Z(j)] as [number, number, number]));
  side(Array.from({ length: d.nz }, (_, j) => [X(d.nx - 1), H(d.nx - 1, j), Z(j)] as [number, number, number]));
}
