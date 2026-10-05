import * as THREE from 'three';
import { scale3, type Colour } from '../../core/math';
import { CELL } from '../../world/grid';
import type { World } from '../../world/world';
import { TEMPLATES } from './templates';

/* The level's static mesh. Surfaces come from the grid: wherever open space meets solid, there is a face, coloured by the
   room on the open side and by what the solid is (rock takes the room's palette; a block, its own colour). Faces are merged
   into the largest flat rectangles that share a colour, then cut where the palette changes (the dado and the stripe on walls,
   the 2 m checker on floors). Props are added from their shapes. Light is baked into each vertex. */

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
  const N = [g.nx, g.ny, g.nz], O = [g.ox, g.oy, g.oz];

  /* one face: axis a, plane s (world), rectangle over the other two axes (world), the open side's room, the solid's block (-1 rock) */
  const face = (a: number, s: number, u0: number, u1: number, v0: number, v1: number, room: number, block: number, openUp: boolean) => {
    const R = w.rooms[room], light = R.light;
    if (block >= 0) {
      const c = w.blocks[block].colour;
      o.rect(a, s, u0, u1, v0, v1, c, light, 1);
      return;
    }
    if (a === 1) {
      /* u is x, v is z */
      if (openUp) {
        for (const [x0, x1] of cuts(u0, u1, tiles(u0, u1)))
          for (const [z0, z1] of cuts(v0, v1, tiles(v0, v1)))
            o.rect(a, s, x0, x1, z0, z1, scale3(R.floor, odd(x0, z0) ? 1 : 0.92), light, 1);
      } else o.rect(a, s, u0, u1, v0, v1, scale3(R.wall, 0.6), light, 0.8);
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

  for (let a = 0; a < 3; a++) {
    const ua = a === 0 ? 1 : 0, va = a === 2 ? 1 : 2;
    const nu = N[ua], nv = N[va], mask = new Int32Array(nu * nv);
    const ijk = [0, 0, 0];
    for (let s = 0; s <= N[a]; s++) {
      /* the faces on this plane, as keys: 0 none, else encodes side, room and block */
      for (let v = 0; v < nv; v++)
        for (let u = 0; u < nu; u++) {
          ijk[a] = s - 1; ijk[ua] = u; ijk[va] = v;
          const A = g.get(ijk[0], ijk[1], ijk[2]);
          ijk[a] = s;
          const B = g.get(ijk[0], ijk[1], ijk[2]);
          let key = 0;
          if ((A >= 0) !== (B >= 0)) {
            const room = A >= 0 ? A : B, solid = A >= 0 ? B : A, side = B >= 0 ? 1 : 0;
            key = ((-1 - solid) * 4096 + room) * 2 + side + 1;
          }
          mask[v * nu + u] = key;
        }
      /* greedy: grow each face along u, then along v, while the key holds */
      for (let v = 0; v < nv; v++)
        for (let u = 0; u < nu; ) {
          const key = mask[v * nu + u];
          if (!key) { u++; continue; }
          let w1 = 1;
          while (u + w1 < nu && mask[v * nu + u + w1] === key) w1++;
          let h1 = 1;
          grow: while (v + h1 < nv) {
            for (let q = 0; q < w1; q++) if (mask[(v + h1) * nu + u + q] !== key) break grow;
            h1++;
          }
          for (let r = 0; r < h1; r++) for (let q = 0; q < w1; q++) mask[(v + r) * nu + u + q] = 0;
          const k = key - 1, side = k & 1, room = (k >> 1) & 4095, block = Math.floor((k >> 1) / 4096) - 1;
          face(a, O[a] + s * CELL, O[ua] + u * CELL, O[ua] + (u + w1) * CELL, O[va] + v * CELL, O[va] + (v + h1) * CELL, room, block, side === 1);
          u += w1;
        }
    }
  }

  /* props, lit by the room they stand in */
  for (const p of w.def.props) {
    const src = TEMPLATES[p.shape], R = w.roomAt(p.x, p.y + 0.05, p.z), l: Colour = R ? R.light : [0, 0, 0];
    const cy = Math.cos(p.ry), sy = Math.sin(p.ry), cz = Math.cos(p.rz), sz = Math.sin(p.rz), by = p.y + p.sy / 2;
    for (let v = 0; v < src.length; v += 3) {
      let X = src[v] * p.sx, Y = src[v + 1] * p.sy, Z = src[v + 2] * p.sz;
      if (p.rz) { const x2 = X * cz - Y * sz; Y = X * sz + Y * cz; X = x2; }
      const x3 = X * cy + Z * sy; Z = -X * sy + Z * cy; X = x3;
      o.vert(p.x + X, by + Y, p.z + Z, p.colour, l, p.glow);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(o.P), 3));
  geo.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(o.C), 3));
  geo.setAttribute('aLight', new THREE.BufferAttribute(new Float32Array(o.L), 4));
  return geo;
}
