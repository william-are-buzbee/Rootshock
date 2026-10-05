import * as THREE from 'three';
import { scale3, type Colour } from '../../core/math';
import { CELL, CHUNK } from '../../world/grid';
import type { Surface, World } from '../../world/world';
import type { PropDef } from '../../content/types';
import { TEMPLATES } from './templates';

/* The level's static mesh. Flat surfaces come from the grid: wherever open space meets solid, there is a face, coloured by
   the room on the open side and by what the solid is (rock takes the room's palette; a block, its own colour). Faces are
   merged into the largest flat rectangles that share a colour (within a chunk), then cut where the palette changes (the dado
   and the stripe on walls, the 2 m checker on floors). Sloped surfaces (ramps, cave floors and ceilings) are drawn from their
   own lattices. Fixed props are added from their shapes; loose ones are drawn elsewhere, since they move. Light is baked into
   each vertex. */

class Out {
  P: number[] = [];
  C: number[] = [];
  L: number[] = [];
  vert(x: number, y: number, z: number, c: Colour, l: Colour, m: number): void {
    this.P.push(x, y, z);
    this.C.push(c[0], c[1], c[2]);
    this.L.push(l[0] * m, l[1] * m, l[2] * m, 0);
  }
  /** a rectangle on plane `a` (0 x, 1 y, 2 z) at `s`, spanning [u0, u1] x [v0, v1] on the other two axes in order */
  rect(a: number, s: number, u0: number, u1: number, v0: number, v1: number, c: Colour, l: Colour, m: number): void {
    const pt = (u: number, v: number): [number, number, number] =>
      a === 0 ? [s, u, v] : a === 1 ? [u, s, v] : [u, v, s];
    const q = [pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)];
    for (const k of [0, 1, 2, 0, 2, 3]) this.vert(q[k][0], q[k][1], q[k][2], c, l, m);
  }
}

/** cut [lo, hi] at each of `at` that falls inside it */
function cuts(lo: number, hi: number, at: number[]): [number, number][] {
  const xs = [lo, ...at.filter(x => x > lo + 1e-6 && x < hi - 1e-6).sort((p, q) => p - q), hi];
  const out: [number, number][] = [];
  for (let i = 0; i < xs.length - 1; i++) out.push([xs[i], xs[i + 1]]);
  return out;
}
/** the 2 m lines inside [lo, hi] */
function tiles(lo: number, hi: number): number[] {
  const a: number[] = [];
  for (let x = Math.ceil(lo / 2) * 2; x < hi; x += 2) a.push(x);
  return a;
}
const odd = (a: number, b: number): boolean => ((Math.floor(a / 2) + Math.floor(b / 2)) & 1) === 1;

export function buildLevelGeometry(w: World): THREE.BufferGeometry {
  const g = w.grid, o = new Out();

  /* one face: axis a, plane s (world), rectangle over the other two axes (world), the open side's room, the solid's block (-1 rock) */
  const face = (a: number, s: number, u0: number, u1: number, v0: number, v1: number, room: number, block: number, openUp: boolean) => {
    const R = w.rooms[room], light = R.light;
    if (block >= 0) {
      o.rect(a, s, u0, u1, v0, v1, w.blocks[block].colour, light, 1);
      return;
    }
    if (a === 1) {
      /* u is x, v is z */
      if (openUp && !R.cave) {
        for (const [x0, x1] of cuts(u0, u1, tiles(u0, u1)))
          for (const [z0, z1] of cuts(v0, v1, tiles(v0, v1)))
            o.rect(a, s, x0, x1, z0, z1, scale3(R.floor, odd(x0, z0) ? 1 : 0.92), light, 1);
      } else if (openUp) o.rect(a, s, u0, u1, v0, v1, R.floor, light, 1);
      else o.rect(a, s, u0, u1, v0, v1, scale3(R.wall, 0.6), light, 0.8);
      return;
    }
    if (R.cave) {
      o.rect(a, s, u0, u1, v0, v1, R.wall, light, 1);
      return;
    }
    /* a wall. On plane x the axes are (y, z); on plane z, (x, y) */
    const yAxisFirst = a === 0;
    const [y0, y1] = yAxisFirst ? [u0, u1] : [v0, v1], [h0, h1] = yAxisFirst ? [v0, v1] : [u0, u1];
    const f = R.y0;
    for (const [ya, yb] of cuts(y0, y1, [f + 0.9, f + 1.05])) {
      const band = yb <= f + 0.9 + 1e-6 ? 0 : yb <= f + 1.05 + 1e-6 ? 1 : 2;
      for (const [ha, hb] of band === 2 ? cuts(h0, h1, tiles(h0, h1)) : [[h0, h1] as [number, number]]) {
        const c = band === 0 ? scale3(R.wall, 0.78) : band === 1 ? R.stripe : scale3(R.wall, odd(ha, 0) ? 1 : 0.95);
        if (yAxisFirst) o.rect(a, s, ya, yb, ha, hb, c, light, 1);
        else o.rect(a, s, ha, hb, ya, yb, c, light, 1);
      }
    }
  };

  /* chunk by chunk. A chunk draws the faces on planes whose far cell is its own, and the plane past its far side when
     nothing lies beyond (no chunk there, so nobody else would). */
  const mask = new Int32Array(CHUNK * CHUNK), ijk = [0, 0, 0];
  g.forEachChunk((cx, cy, cz) => {
    const base = [cx * CHUNK, cy * CHUNK, cz * CHUNK];
    for (let a = 0; a < 3; a++) {
      const ua = a === 0 ? 1 : 0, va = a === 2 ? 1 : 2;
      const next = [cx, cy, cz];
      next[a]++;
      const last = g.hasChunk(next[0], next[1], next[2]) ? CHUNK - 1 : CHUNK;
      for (let ls = 0; ls <= last; ls++) {
        const s = base[a] + ls;
        for (let v = 0; v < CHUNK; v++)
          for (let u = 0; u < CHUNK; u++) {
            ijk[a] = s - 1; ijk[ua] = base[ua] + u; ijk[va] = base[va] + v;
            const A = g.get(ijk[0], ijk[1], ijk[2]);
            ijk[a] = s;
            const B = g.get(ijk[0], ijk[1], ijk[2]);
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

  for (const sf of w.surfaces) surfaceMesh(o, w, sf);

  /* fixed props, lit by the room they stand in */
  for (const p of w.def.props) {
    if (p.loose) continue;
    const R = w.roomAt(p.x, p.y + 0.05, p.z), l: Colour = R ? R.light : [0, 0, 0];
    propVerts(p, (x, y, z) => o.vert(x, y, z, p.colour, l, p.glow));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(o.P), 3));
  geo.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(o.C), 3));
  geo.setAttribute('aLight', new THREE.BufferAttribute(new Float32Array(o.L), 4));
  return geo;
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

/** a sloped surface: its lattice as quads, and for a ramp its edges down to the base */
function surfaceMesh(o: Out, w: World, sf: Surface): void {
  const d = sf.def, floor = d.kind === 'floor', res = d.res;
  const X = (i: number) => d.x0 + i * res, Z = (j: number) => d.z0 + j * res, H = (i: number, j: number) => d.h[j * d.nx + i];
  const lightAt = (x: number, y: number, z: number): Colour => {
    const R = w.roomAt(x, y + (floor ? 0.3 : -0.3), z);
    return R ? R.light : [0, 0, 0];
  };
  const m = floor ? 1 : 0.8;
  for (let j = 0; j < d.nz - 1; j++)
    for (let i = 0; i < d.nx - 1; i++) {
      const x0 = X(i), x1 = X(i + 1), z0 = Z(j), z1 = Z(j + 1), h00 = H(i, j), h10 = H(i + 1, j), h11 = H(i + 1, j + 1), h01 = H(i, j + 1);
      const l = lightAt((x0 + x1) / 2, (h00 + h11) / 2, (z0 + z1) / 2), c = d.sides ? d.colour : scale3(d.colour, 0.94 + 0.06 * (((i * 7 + j * 13) % 5) / 4));
      const q: [number, number, number][] = [[x0, h00, z0], [x1, h10, z0], [x1, h11, z1], [x0, h01, z1]];
      for (const k of [0, 1, 2, 0, 2, 3]) o.vert(q[k][0], q[k][1], q[k][2], c, l, m);
    }
  if (!d.sides) return;
  const side = (pts: [number, number, number][]) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, ah, az] = pts[k], [bx, bh, bz] = pts[k + 1], l = lightAt((ax + bx) / 2, d.base + 0.1, (az + bz) / 2), c = scale3(d.colour, 0.85);
      const q: [number, number, number][] = [[ax, d.base, az], [bx, d.base, bz], [bx, bh, bz], [ax, ah, az]];
      for (const n of [0, 1, 2, 0, 2, 3]) o.vert(q[n][0], q[n][1], q[n][2], c, l, 1);
    }
  };
  side(Array.from({ length: d.nx }, (_, i) => [X(i), H(i, 0), Z(0)] as [number, number, number]));
  side(Array.from({ length: d.nx }, (_, i) => [X(i), H(i, d.nz - 1), Z(d.nz - 1)] as [number, number, number]));
  side(Array.from({ length: d.nz }, (_, j) => [X(0), H(0, j), Z(j)] as [number, number, number]));
  side(Array.from({ length: d.nz }, (_, j) => [X(d.nx - 1), H(d.nx - 1, j), Z(j)] as [number, number, number]));
}
