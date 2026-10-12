import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { parts } from './things';

/* What the cast are made of, shared by everyone who draws them (castView.ts, security.ts): their colours, and a part
   of one shape and colour put on a parent, each shape and colour and size made once. */

export const FLESH = 0xb08572, RAW = 0x8c4a44, GOREC = 0x4e1616, PALE = 0xcdbfae, BONE = 0xddd6c0, DARK = 0x140c0d, ORANGE = 0xb5541c;
export const GR = [0x3f6a3a, 0x4f7a40, 0x2f5a34, 0x5a7a3a, 0x6a8a44, 0x2a4a2c];

export type C = number | Colour;
export type Shape = 'box' | 'cyl' | 'ico';
export type O3 = THREE.Object3D;
const geos = new Map<string, THREE.BufferGeometry>();
function geo(shape: Shape, c: C, sx: number, sy: number, sz: number): THREE.BufferGeometry {
  const k = `${shape}|${c}|${sx}|${sy}|${sz}`;
  let g = geos.get(k);
  if (!g) geos.set(k, (g = parts([[shape, c, sx, sy, sz, 0, 0, 0]])));
  return g;
}
export function mk(parent: O3, mat: THREE.Material, shape: Shape, c: C, sx: number, sy: number, sz: number, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(geo(shape, c, sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.frustumCulled = false;
  parent.add(m);
  return m;
}
export function grp(parent: O3, x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}

/** the same pseudo-random numbers for the same mutant every time */
export function seeded(id: number) {
  let s = (id * 2654435761) >>> 0 || 1;
  const next = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  return { rnd: (a: number, b: number) => a + next() * (b - a), pick: <T>(a: T[]) => a[Math.floor(next() * a.length)] };
}
