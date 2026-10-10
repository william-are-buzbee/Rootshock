import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { blowAt, type Mutant } from '../../sim/cast';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { dynamicMaterial, lightMaterial } from './shader';
import { parts } from './things';

/* The cast, drawn: the first engine's models (BUILD) and their animation (ANIM), ported nearly line for line. Each is a
   tree of parts on one material, so it flashes when hit and is lit by the room it stands in. Looks only: the sim
   decides where each is and what it is doing; this only shows it. */

const PI = Math.PI;
const FLESH = 0xb08572, RAW = 0x8c4a44, GOREC = 0x4e1616, PALE = 0xcdbfae, BONE = 0xddd6c0, DARK = 0x140c0d, ORANGE = 0xb5541c;
const GR = [0x3f6a3a, 0x4f7a40, 0x2f5a34, 0x5a7a3a, 0x6a8a44, 0x2a4a2c];

type C = number | Colour;
const geos = new Map<string, THREE.BufferGeometry>();
function geo(shape: 'box' | 'cyl' | 'ico', c: C, sx: number, sy: number, sz: number): THREE.BufferGeometry {
  const k = `${shape}|${c}|${sx}|${sy}|${sz}`;
  let g = geos.get(k);
  if (!g) geos.set(k, (g = parts([[shape, c, sx, sy, sz, 0, 0, 0]])));
  return g;
}
type O3 = THREE.Object3D;
function mk(parent: O3, mat: THREE.Material, shape: 'box' | 'cyl' | 'ico', c: C, sx: number, sy: number, sz: number, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(geo(shape, c, sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.frustumCulled = false;
  parent.add(m);
  return m;
}
function grp(parent: O3, x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}

/** the same pseudo-random numbers for the same mutant every time */
function seeded(id: number) {
  let s = (id * 2654435761) >>> 0 || 1;
  const next = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  return { rnd: (a: number, b: number) => a + next() * (b - a), pick: <T>(a: T[]) => a[Math.floor(next() * a.length)] };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Model = { g: THREE.Group; [k: string]: any };

export const BUILD: Record<string, (mat: THREE.Material, m: Mutant) => Model> = {
  /* staff, early in the Regimen: still a person's outline, one arm already something else */
  husk(mat, m) {
    const R = seeded(m.id), g = new THREE.Group(), cl = R.pick([0xbfc3c0, 0x4a5560, 0x39485a, 0x6b6f5a, 0x7a5a50]), tr = 0x2b2e34;
    const legs: O3[] = [];
    for (const s of [-1, 1]) { const l = grp(g, s * 0.11, 0.9, 0); mk(l, mat, 'box', tr, 0.16, 0.9, 0.17, 0, -0.45, 0); mk(l, mat, 'box', DARK, 0.16, 0.07, 0.26, 0, -0.87, 0.04); legs.push(l); }
    const b = grp(g, 0, 0.9, 0);
    mk(b, mat, 'box', cl, 0.42, 0.6, 0.24, 0, 0.3, 0); mk(b, mat, 'box', tr, 0.4, 0.12, 0.23, 0, 0.03, 0); mk(b, mat, 'ico', RAW, 0.26, 0.3, 0.22, 0.17, 0.52, -0.04);
    const hd = grp(b, -0.02, 0.76, 0);
    mk(hd, mat, 'ico', PALE, 0.24, 0.28, 0.25, 0, 0, 0); mk(hd, mat, 'box', DARK, 0.1, 0.03, 0.03, 0, -0.07, 0.11); mk(hd, mat, 'ico', DARK, 0.04, 0.04, 0.04, -0.05, 0.03, 0.11); mk(hd, mat, 'ico', RAW, 0.1, 0.11, 0.07, 0.07, 0.04, 0.09);
    hd.rotation.z = 0.25;
    const arms: O3[] = [];
    let a = grp(b, -0.27, 0.56, 0); mk(a, mat, 'box', cl, 0.11, 0.36, 0.12, 0, -0.18, 0); mk(a, mat, 'box', PALE, 0.08, 0.34, 0.08, 0, -0.52, 0); arms.push(a);
    a = grp(b, 0.3, 0.58, 0); mk(a, mat, 'box', RAW, 0.14, 0.4, 0.14, 0, -0.2, 0); mk(a, mat, 'box', FLESH, 0.1, 0.52, 0.1, 0, -0.64, 0); mk(a, mat, 'box', BONE, 0.05, 0.16, 0.05, 0, -0.97, 0.02); arms.push(a);
    return { g, b, hd, legs, arms };
  },
  skitter(mat) {
    const g = new THREE.Group(), b = grp(g, 0, 0.55, 0);
    mk(b, mat, 'box', FLESH, 0.42, 0.26, 0.95, 0, 0, 0); mk(b, mat, 'box', RAW, 0.2, 0.1, 0.7, 0, 0.16, -0.05); mk(b, mat, 'box', 0x4a5560, 0.44, 0.1, 0.3, 0, -0.05, -0.25);
    const hd = grp(b, 0, 0.02, 0.6);
    mk(hd, mat, 'ico', PALE, 0.3, 0.36, 0.3, 0, 0, 0); mk(hd, mat, 'box', DARK, 0.16, 0.07, 0.05, 0, -0.09, 0.13); mk(hd, mat, 'ico', DARK, 0.06, 0.06, 0.06, -0.07, 0.06, 0.13); mk(hd, mat, 'ico', DARK, 0.06, 0.06, 0.06, 0.08, 0.04, 0.13);
    hd.rotation.z = 2.5;
    const limbs: { l: O3; s: number; k: number }[] = [];
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
      const l = grp(b, s * 0.2, 0, 0.38 - k * 0.38), u = mk(l, mat, 'box', FLESH, 0.6, 0.08, 0.08, s * 0.28, 0.13, 0);
      u.rotation.z = s * 0.45;
      mk(l, mat, 'box', PALE, 0.07, 0.82, 0.07, s * 0.56, -0.14, 0); mk(l, mat, 'box', RAW, 0.11, 0.05, 0.16, s * 0.56, -0.53, 0.03);
      limbs.push({ l, s, k });
    }
    return { g, b, hd, limbs };
  },
  bloat(mat, m) {
    const R = seeded(m.id), g = new THREE.Group(), sit = m.sit, b = grp(g, 0, sit ? 1.05 : 1.75, 0);
    mk(b, mat, 'ico', PALE, 1.9, 2.1, 1.7, 0, 0, 0); mk(b, mat, 'ico', FLESH, 1.3, 1, 1.2, 0, -0.6, 0.3); mk(b, mat, 'ico', RAW, 0.5, 0.4, 0.4, 0.6, 0.3, 0.5);
    const hd = grp(b, 0, 1.4, 0.1);
    mk(hd, mat, 'ico', PALE, 1.25, 1.35, 1.2, 0, 0, 0); mk(hd, mat, 'ico', DARK, 0.07, 0.07, 0.07, -0.14, -0.22, 0.52); mk(hd, mat, 'ico', DARK, 0.07, 0.07, 0.07, 0.14, -0.22, 0.52); mk(hd, mat, 'box', DARK, 0.16, 0.03, 0.04, 0, -0.38, 0.5);
    const arms: O3[] = [];
    for (const s of [-1, 1]) { const a = grp(b, s * 0.98, 0.35, 0); mk(a, mat, 'box', FLESH, 0.22, 1, 0.22, 0, -0.5, 0); arms.push(a); }
    if (sit) for (const s of [-1, 1]) mk(g, mat, 'box', FLESH, 0.42, 0.4, 1.3, s * 0.45, 0.2, 0.85);
    else for (const s of [-1, 1]) mk(g, mat, 'box', FLESH, 0.5, 1, 0.5, s * 0.45, 0.5, 0);
    if (sit && !m.holt) { mk(b, mat, 'box', DARK, 0.5, 0.02, 0.02, 0, 0.62, 0.8); mk(b, mat, 'box', [2.9, 2.85, 2.6], 0.12, 0.18, 0.02, 0, 0.48, 0.84); }
    if (m.holt) for (let k = 0; k < 9; k++) mk(b, mat, 'ico', R.pick(GR), R.rnd(0.3, 0.7), R.rnd(0.2, 0.5), R.rnd(0.3, 0.7), R.rnd(-0.9, 0.9), R.rnd(-0.8, 1.6), R.rnd(-0.6, 0.7));
    return { g, b, hd, arms };
  },
  /* Security's operations staff, grown into one body at its post (world.md §8): a heap of skinned meat facing the glass,
     a ridge of knuckles up its back, and what it has taken in still showing. Its own head is growing another out of
     one temple. Off the other shoulder, a cluster of pale swellings, each less of a face than the one before: a slack
     mouth and one dark eye, then one open eye, then nothing. Two of the staff are half in it, one taken backwards up
     to the chest with an arm still out toward the glass, one face down with only a back and shoulders left. Four arms
     lie out in front of it until it tenses. The watchers at the screens, and the cords to them, are the level's
     (levels/upper.ts). */
  overseer(mat, m) {
    const R = seeded(m.id), g = new THREE.Group();
    const M1 = 0x8c4a44, M2 = 0x6e2b28, M3 = 0x9a6a5a, M4 = 0x7a3a34, WAX = 0xc8b9a6, WAX2 = 0xb9a898, WAX3 = 0xd2c3b0, UNI = 0x39485a, UNI2 = 0x4a5560, EYE = 0xd8d0c0, GUM = 0x1a0806, WET = 0x4e1616;
    const b = grp(g, 0, 0, 0);
    /* the mass: broadest at the floor, highest toward the glass, where the head is */
    type Blob = [number, number, number, number, number, number, number];
    const heap: Blob[] = [
      [0.1, 0.55, -0.5, 3.3, 1.2, 2.6, M1], [-0.6, 0.9, -0.2, 2.2, 1.5, 2.0, M3], [0.9, 0.95, -0.7, 2.0, 1.5, 1.8, M4],
      [0.2, 1.3, -0.9, 1.7, 1.3, 1.5, M2], [-0.3, 1.25, 0.3, 1.6, 1.2, 1.3, M1], [1.1, 0.5, 0.6, 1.4, 0.8, 1.2, M3],
      [-1.3, 0.45, 0.4, 1.3, 0.8, 1.2, M4], [0.4, 0.35, -1.7, 1.8, 0.7, 1.2, M2], [-0.2, 0.3, -2.3, 1.2, 0.5, 0.9, M1],
    ];
    for (const [x, y, z, sx, sy, sz, c] of heap) mk(b, mat, 'ico', c, sx, sy, sz, x, y, z);
    /** a point on blob k's surface, out along (dx, dy, dz) from its middle */
    const on = (k: number, dx: number, dy: number, dz: number, inset = 0.9): [number, number, number] => {
      const [x, y, z, sx, sy, sz] = heap[k], l = Math.hypot(dx, dy, dz);
      return [x + (dx / l) * (sx / 2) * inset, y + (dy / l) * (sy / 2) * inset, z + (dz / l) * (sz / 2) * inset];
    };
    /* the spine, showing through along the top of the back; and where the skin has gone, wet */
    for (const [k, dx, dy, dz] of [[8, 0, 1, -0.2], [7, 0, 1, -0.5], [7, 0, 1, 0.3], [3, 0, 1, -0.5], [3, 0, 1, 0.1], [3, -0.1, 1, 0.6]] as const) { const [x, y, z] = on(k, dx, dy, dz); mk(b, mat, 'ico', BONE, 0.24, 0.16, 0.22, x, y, z); }
    for (const [k, dx, dy, dz, w, h] of [[2, 0.8, 0.5, -0.3, 0.9, 0.5], [1, -0.9, 0.3, -0.5, 0.7, 0.6], [0, 0.3, -0.1, 1, 0.8, 0.4], [7, 0.9, 0.2, 0, 0.6, 0.3], [5, 0.2, 0.9, 0.3, 0.5, 0.4]] as const) { const [x, y, z] = on(k, dx, dy, dz, 0.97); mk(b, mat, 'ico', WET, w, h, w, x, y, z); }
    /* its head, sunk into the front of the mass: the brow heavy, the eyes at two heights, the mouth dragged down to one
       side and torn open on a few teeth; and the second head, out of its right temple, the skin not yet grown over it */
    const hd = grp(b, -0.3, 2.0, 0.45);
    mk(hd, mat, 'ico', M3, 1.3, 1.35, 1.2, 0, 0, 0);
    mk(hd, mat, 'ico', M1, 0.9, 0.3, 0.4, 0.05, 0.42, 0.42);
    mk(hd, mat, 'ico', EYE, 0.34, 0.3, 0.12, -0.3, 0.2, 0.58); mk(hd, mat, 'ico', DARK, 0.12, 0.12, 0.05, -0.3, 0.2, 0.64);
    mk(hd, mat, 'ico', EYE, 0.42, 0.24, 0.12, 0.22, -0.02, 0.58); mk(hd, mat, 'ico', DARK, 0.12, 0.12, 0.05, 0.22, -0.02, 0.64);
    const mo = grp(hd, 0.15, -0.35, 0.52); mo.rotation.z = 0.4;
    mk(mo, mat, 'box', GUM, 0.95, 0.14, 0.1, 0, 0, 0); mk(mo, mat, 'box', WET, 1.0, 0.06, 0.1, 0, -0.1, 0);
    for (const [x, y, h] of [[-0.36, 0.05, 0.07], [-0.2, 0.04, 0.05], [0.0, 0.06, 0.08], [0.22, 0.04, 0.06], [0.38, 0.05, 0.05], [-0.1, -0.05, 0.05], [0.3, -0.05, 0.06]] as const) mk(mo, mat, 'box', BONE, 0.045, h, 0.04, x, y, 0.04);
    mk(hd, mat, 'ico', RAW, 0.5, 0.4, 0.5, 0.45, 0.25, 0.05);
    const hd2 = grp(hd, 0.66, 0.48, 0.1);
    mk(hd2, mat, 'ico', M1, 0.78, 0.72, 0.72, 0, 0, 0); mk(hd2, mat, 'ico', M3, 0.5, 0.42, 0.4, 0.1, 0.1, 0.25);
    mk(hd2, mat, 'ico', EYE, 0.2, 0.16, 0.08, 0.12, 0.05, 0.37); mk(hd2, mat, 'ico', DARK, 0.08, 0.08, 0.04, 0.12, 0.05, 0.41);
    mk(hd2, mat, 'box', GUM, 0.3, 0.05, 0.05, 0.05, -0.2, 0.34);
    /* the swellings, off the left shoulder, on a raw collar: pale and waxed, and each less of a face than the last */
    mk(b, mat, 'ico', RAW, 1.4, 0.9, 1.2, 1.3, 1.15, 0.2);
    const cl = grp(b, 1.35, 1.6, 0.2);
    mk(cl, mat, 'ico', WAX, 1.0, 0.95, 0.95, 0, 0, 0);
    mk(cl, mat, 'ico', DARK, 0.1, 0.1, 0.05, -0.2, 0.14, 0.46); mk(cl, mat, 'ico', GUM, 0.24, 0.16, 0.1, 0.12, -0.2, 0.45);
    mk(cl, mat, 'ico', WAX2, 0.62, 0.6, 0.6, 0.45, 0.5, -0.15);
    mk(cl, mat, 'ico', 0xe8e0d0, 0.2, 0.18, 0.08, 0.5, 0.5, 0.15); mk(cl, mat, 'ico', DARK, 0.09, 0.09, 0.04, 0.5, 0.5, 0.19);
    mk(cl, mat, 'ico', WAX3, 0.42, 0.4, 0.4, -0.25, 0.62, 0.25);
    mk(cl, mat, 'ico', WAX2, 0.26, 0.24, 0.26, 0.2, 0.85, 0.05);
    mk(cl, mat, 'ico', WAX3, 0.2, 0.2, 0.2, 0.7, 0.2, 0.3);
    mk(cl, mat, 'ico', WAX, 0.3, 0.26, 0.3, -0.5, 0.1, -0.2);
    /* the staff: one taken in backwards, chest up, head back and mouth open, an arm still out toward the glass */
    const s1 = grp(b, -1.45, 1.05, 0.35); s1.rotation.z = 0.6; s1.rotation.x = -0.35;
    mk(s1, mat, 'box', UNI, 0.44, 0.62, 0.26, 0, 0.3, 0); mk(s1, mat, 'ico', RAW, 0.72, 0.5, 0.62, 0, -0.05, 0);
    const s1h = grp(s1, 0, 0.78, 0.02); s1h.rotation.x = -0.7;
    mk(s1h, mat, 'ico', PALE, 0.25, 0.29, 0.26, 0, 0, 0); mk(s1h, mat, 'ico', DARK, 0.11, 0.13, 0.06, 0, -0.07, 0.12);
    mk(s1h, mat, 'ico', DARK, 0.04, 0.04, 0.04, -0.06, 0.04, 0.12); mk(s1h, mat, 'ico', DARK, 0.04, 0.04, 0.04, 0.06, 0.04, 0.12);
    const s1a = grp(s1, -0.26, 0.55, 0.05); s1a.rotation.x = -1.9; s1a.rotation.z = 0.4;
    mk(s1a, mat, 'box', UNI, 0.11, 0.36, 0.12, 0, -0.18, 0); mk(s1a, mat, 'box', PALE, 0.08, 0.34, 0.08, 0, -0.52, 0);
    for (let k = 0; k < 4; k++) mk(s1a, mat, 'box', PALE, 0.02, 0.12, 0.02, -0.04 + k * 0.027, -0.74, 0.02);
    /* and one face down into it, at the back: a back, shoulders, and the back of a head */
    const s2 = grp(b, 0.75, 1.35, -1.35); s2.rotation.x = 0.9; s2.rotation.y = 0.5;
    mk(s2, mat, 'box', UNI2, 0.46, 0.5, 0.24, 0, 0.1, 0); mk(s2, mat, 'ico', RAW, 0.75, 0.45, 0.6, 0, -0.15, 0);
    mk(s2, mat, 'ico', PALE, 0.25, 0.28, 0.26, 0, 0.5, 0); mk(s2, mat, 'ico', 0x3a2a24, 0.26, 0.14, 0.24, 0, 0.58, -0.04);
    for (const s of [-1, 1]) mk(s2, mat, 'box', UNI2, 0.11, 0.4, 0.12, s * 0.28, 0.1, 0.05).rotation.z = s * 0.3;
    /* the arms, four: raw at the shoulder, a pale hand flat on the floor, lying out toward the glass until it tenses */
    const arms: O3[] = [];
    for (const [x, y, z, k] of [[-1.2, 1.25, 0.55, 1], [1.15, 1.2, 0.6, 1], [-1.8, 0.7, 0.3, 0.7], [1.75, 0.65, 0.35, 0.7]] as const) {
      const a = grp(b, x, y, z);
      mk(a, mat, 'ico', RAW, 0.5 * k, 0.4 * k, 0.5 * k, 0, 0, 0);
      mk(a, mat, 'box', M1, 0.26 * k, 1.0 * k, 0.26 * k, 0, -0.5 * k, 0);
      const f = grp(a, 0, -1.0 * k, 0); f.rotation.x = k < 1 ? -1.62 : -1.4;
      mk(f, mat, 'box', M3, 0.2 * k, 0.9 * k, 0.2 * k, 0, -0.45 * k, 0);
      mk(f, mat, 'box', PALE, 0.24 * k, 0.3 * k, 0.08 * k, 0, -1.03 * k, 0);
      for (let j = 0; j < 4; j++) mk(f, mat, 'box', PALE, 0.035 * k, 0.24 * k, 0.05 * k, (-0.09 + j * 0.06) * k, -1.28 * k, 0);
      arms.push(a);
    }
    /* its own sick light: pustules over the back and flanks, lit from within (the level's lamps sit among them) */
    const PUS: Colour = [2.6, 0.9, 0.55];
    for (const [k, dx, dy, dz] of [[2, 0.5, 0.8, -0.4], [2, 0.9, 0.4, 0.2], [1, -0.8, 0.6, -0.3], [1, -1, 0.2, 0.2], [7, 0.4, 0.8, -0.3], [7, -0.6, 0.7, 0.2], [8, -0.3, 0.9, -0.3], [3, 0.6, 0.8, -0.2], [0, 1, 0.3, -0.6], [0, -1, 0.4, -0.4], [5, 0.7, 0.7, 0.4], [6, -0.7, 0.8, 0.3]] as const) {
      const [x, y, z] = on(k, dx, dy, dz, 0.96);
      for (let q = 0; q < 3; q++) mk(b, mat, 'ico', PUS, R.rnd(0.16, 0.3), R.rnd(0.12, 0.22), R.rnd(0.16, 0.3), x + R.rnd(-0.18, 0.18), y + R.rnd(-0.1, 0.1), z + R.rnd(-0.18, 0.18));
    }
    return { g, b, hd, hd2, cl, s1h, s1a, arms };
  },
  /* a man whose ribcage has parted down the sternum and learned to open like a pair of doors */
  thresher(mat) {
    const g = new THREE.Group(), tr = 0x2b2e34, sh = 0xa9a595;
    const legs: O3[] = [];
    for (const s of [-1, 1]) { const l = grp(g, s * 0.17, 1, 0); mk(l, mat, 'box', tr, 0.2, 0.52, 0.22, 0, -0.26, 0); mk(l, mat, 'box', tr, 0.17, 0.46, 0.19, 0, -0.74, 0.02); mk(l, mat, 'box', DARK, 0.17, 0.08, 0.3, 0, -0.96, 0.06); legs.push(l); }
    mk(g, mat, 'box', tr, 0.5, 0.2, 0.3, 0, 1.06, 0); mk(g, mat, 'box', 0x8a887c, 0.4, 0.38, 0.03, 0, 0.9, 0.17);
    const b = grp(g, 0, 1.14, 0);
    mk(b, mat, 'box', sh, 0.6, 0.8, 0.1, 0, 0.42, -0.19); mk(b, mat, 'box', GOREC, 0.52, 0.7, 0.14, 0, 0.42, -0.09); mk(b, mat, 'box', BONE, 0.07, 0.74, 0.07, 0, 0.42, -0.03);
    mk(b, mat, 'ico', RAW, 0.26, 0.3, 0.14, -0.1, 0.5, -0.02); mk(b, mat, 'ico', 0x6e2b28, 0.2, 0.24, 0.12, 0.12, 0.3, -0.02);
    mk(b, mat, 'box', FLESH, 0.8, 0.15, 0.3, 0, 0.86, -0.08);
    const doors: { d: O3; s: number }[] = [];
    for (const s of [-1, 1]) {
      const d = grp(b, s * 0.31, 0.42, -0.06);
      mk(d, mat, 'box', sh, 0.31, 0.74, 0.08, -s * 0.155, 0, 0.05); mk(d, mat, 'box', RAW, 0.29, 0.7, 0.03, -s * 0.155, 0, 0);
      for (let k = 0; k < 4; k++) mk(d, mat, 'box', BONE, 0.27, 0.035, 0.05, -s * 0.15, -0.27 + k * 0.18, -0.02);
      for (let k = 0; k < 6; k++) mk(d, mat, 'box', BONE, 0.1, 0.04, 0.04, -s * 0.34, -0.3 + k * 0.12, -0.01);
      doors.push({ d, s });
    }
    const hd = grp(b, 0, 0.98, -0.14);
    mk(hd, mat, 'box', FLESH, 0.1, 0.14, 0.1, 0, -0.06, 0.02); mk(hd, mat, 'ico', PALE, 0.23, 0.27, 0.25, 0, 0.1, 0); mk(hd, mat, 'box', DARK, 0.1, 0.06, 0.03, 0, 0.03, 0.11);
    hd.rotation.x = -0.7;
    const arms: { a: O3; f: O3; s: number }[] = [];
    for (const s of [-1, 1]) {
      const a = grp(b, s * 0.47, 0.84, -0.06);
      mk(a, mat, 'box', sh, 0.12, 0.44, 0.12, 0, -0.22, 0);
      const f = grp(a, 0, -0.44, 0);
      mk(f, mat, 'box', PALE, 0.09, 0.48, 0.09, 0, -0.24, 0); mk(f, mat, 'box', FLESH, 0.1, 0.15, 0.05, 0, -0.55, 0);
      arms.push({ a, f, s });
    }
    return { g, b, hd, legs, arms, doors };
  },
  worm(mat, m) {
    const g = new THREE.Group(), segs: O3[] = [], gr = m.green;
    const fl = gr ? 0x4a6a38 : FLESH, or = gr ? 0x6a8a44 : ORANGE, raw = gr ? 0x2f5a34 : RAW, pale = gr ? 0xa8b890 : PALE;
    for (let k = 0; k < 6; k++) segs.push(mk(g, mat, 'ico', k === 2 || k === 3 ? or : k === 5 ? raw : fl, 0.42 - 0.04 * k, 0.36 - 0.035 * k, 0.5, 0, 0.18, -k * 0.36));
    const hd = grp(g, 0, 0.22, 0.3);
    mk(hd, mat, 'ico', pale, 0.3, 0.3, 0.32, 0, 0, 0); mk(hd, mat, 'ico', DARK, 0.05, 0.05, 0.05, -0.07, 0.04, 0.14); mk(hd, mat, 'ico', DARK, 0.05, 0.05, 0.05, 0.07, 0.04, 0.14); mk(hd, mat, 'box', DARK, 0.1, 0.03, 0.03, 0, -0.07, 0.15);
    const hand = mk(g, mat, 'box', pale, 0.06, 0.05, 0.34, 0.24, 0.1, 0.12);
    return { g, segs, hd, hand };
  },
  /* the arms are bait. the thing is the head on the wall above them. */
  grabber(mat, m) {
    const g = new THREE.Group(), gr = m.green, raw = gr ? 0x2f5a34 : RAW, fl = gr ? 0x4f7a40 : FLESH, pale = gr ? 0x9ab070 : PALE;
    const sac = grp(g, 0, 2.3, 0);
    mk(sac, mat, 'ico', raw, 0.9, 0.5, 0.5, 0, 0, 0); mk(sac, mat, 'ico', fl, 0.5, 0.4, 0.4, 0.3, 0.15, 0.05);
    const hd = grp(g, 0, 2.02, 0.22);
    mk(hd, mat, 'ico', pale, 0.36, 0.4, 0.36, 0, 0, 0); mk(hd, mat, 'box', DARK, 0.14, 0.07, 0.04, 0, -0.08, 0.16); mk(hd, mat, 'ico', DARK, 0.06, 0.06, 0.06, -0.08, 0.05, 0.16); mk(hd, mat, 'ico', DARK, 0.06, 0.06, 0.06, 0.08, 0.05, 0.16);
    const tent: { ch: O3[]; k: number }[] = [];
    for (let k = 0; k < 5; k++) {
      let par: O3 = grp(g, -0.42 + k * 0.21, 2.12, 0.12);
      const ch: O3[] = [];
      for (let s = 0; s < 5; s++) { mk(par, mat, 'box', s % 2 ? fl : pale, 0.07 - 0.008 * s, 0.34, 0.07 - 0.008 * s, 0, -0.17, 0); ch.push(par); par = grp(par, 0, -0.34, 0); }
      mk(par, mat, 'box', pale, 0.1, 0.12, 0.04, 0, -0.05, 0);
      tent.push({ ch, k });
    }
    return { g, hd, sac, tent };
  },
};

const r = (a: number, b: number) => a + Math.random() * (b - a);
/** smoothstep, 0..1 */
const ease = (t: number) => t * t * (3 - 2 * t);

const ANIM: Record<string, (m: Mutant, M: Model) => void> = {
  husk(m, M) {
    const mv = m.mv > 0, hunt = m.state === 'hunt', f = hunt ? 11 : 5;
    for (let k = 0; k < 2; k++) M.legs[k].rotation.x = mv ? Math.sin(m.ph * f + k * PI) * (hunt ? 0.7 : 0.35) : 0;
    M.arms[0].rotation.x = hunt ? -1.1 + Math.sin(m.ph * f) * 0.2 : mv ? Math.sin(m.ph * f + PI) * 0.25 : 0;
    M.arms[1].rotation.x = hunt ? -1.3 + Math.sin(m.ph * f + 2) * 0.25 : mv ? Math.sin(m.ph * f) * 0.2 : Math.sin(m.ph * 0.9) * 0.06;
    M.b.rotation.x = m.state === 'flee' ? 0.4 : hunt ? 0.18 : 0.06;
    /* its blow, as the sim has it: the arm drawn up and back, the body leaning away (shaking at the top, the last of
       the wind-up, when it has stopped turning); brought down through you and past, the body following it over; then
       left hanging, bent over, before it comes back up */
    const B = blowAt(m);
    if (B) {
      const top = -2.75, low = -0.15;
      if (B.ph === 'wind') {
        const e = ease(B.q), shake = B.q > 0.7 ? Math.sin(m.ph * 45) * 0.05 : 0;
        M.arms[1].rotation.x = -1.3 + (top + 1.3) * e + shake;
        M.arms[0].rotation.x = -1.1 + 0.6 * e;
        M.b.rotation.x = 0.18 - 0.26 * e;
      } else if (B.ph === 'strike') {
        const e = B.q * B.q;
        M.arms[1].rotation.x = top + (low - top) * e;
        M.arms[0].rotation.x = -0.5;
        M.b.rotation.x = -0.08 + 0.58 * e;
      } else {
        const e = ease(Math.max(0, (B.q - 0.35) / 0.65));
        M.arms[1].rotation.x = low + (-1.3 - low) * e;
        M.arms[0].rotation.x = -0.5 - 0.6 * e;
        M.b.rotation.x = 0.5 - 0.32 * e;
      }
    }
    M.b.rotation.z = Math.sin(m.ph * (mv ? f : 0.8)) * 0.04;
    M.hd.rotation.z = 0.25 + Math.sin(m.ph * 0.7) * 0.1 + (Math.random() < 0.015 ? r(-0.5, 0.5) : 0);
    M.hd.rotation.y = Math.sin(m.ph * 0.5) * 0.25;
  },
  skitter(m, M) {
    const mv = m.mv > 0, q = m.state === 'idle' ? 0.4 : 1;
    for (const o of M.limbs) o.l.rotation.y = o.s * Math.sin(m.ph * (mv ? 14 : 1.3) + o.k * 2.1 + (o.s > 0 ? PI : 0)) * (mv ? 0.5 : 0.1) + (Math.random() < 0.04 * q ? r(-0.3, 0.3) : 0);
    M.hd.rotation.z = 2.5 + Math.sin(m.ph * 3.1) * 0.2 + (Math.random() < 0.05 * q ? r(-0.7, 0.7) : 0);
    M.b.position.y = 0.55 + Math.sin(m.ph * (mv ? 20 : 2)) * 0.02;
    M.b.rotation.z = Math.random() < 0.03 * q ? r(-0.12, 0.12) : 0;
    /* the tell: it rears, front limbs spread, and holds there a beat before it comes down on you; it drops nose first
       through where you were, and stays down, flat, a moment before it gathers itself */
    const B = blowAt(m);
    const w = !B ? 0 : B.ph === 'wind' ? Math.min(1, B.q / 0.5) : B.ph === 'strike' ? 1 - 1.4 * B.q * B.q : -0.4 * (1 - ease(Math.max(0, (B.q - 0.4) / 0.6)));
    M.b.rotation.x = -w * 0.75;
    M.b.position.y += w * (w > 0 ? 0.28 : 0.4);
    for (const o of M.limbs) {
      if (w > 0 && o.k === 0) { o.l.rotation.z = o.s * w * 1.1 + Math.sin(m.ph * 40) * 0.06; o.l.rotation.y = o.s * -0.5 * w; }
      else if (w < 0) { o.l.rotation.z = o.s * w * 0.6; }
      else o.l.rotation.z = 0;
    }
  },
  bloat(m, M) {
    const s = 1 + Math.sin(m.ph * 0.9) * 0.02;
    M.b.scale.set(s, 1 / s, s);
    M.hd.rotation.z = Math.sin(m.ph * 0.4) * 0.08;
    M.hd.rotation.y = Math.sin(m.ph * 0.23) * 0.2;
    for (const a of M.arms) a.rotation.x = Math.sin(m.ph * 0.9) * 0.06;
  },
  /* the overseer breathes, slowly; the swellings pulse, quicker; the heads turn a little, the second with a jerk now and
     then; the taken one's arm feels about. As it tenses to lash, all four arms come up, shaking */
  overseer(m, M) {
    const s = 1 + Math.sin(m.ph * 0.9) * 0.015;
    M.b.scale.set(s, 1 / s, s);
    M.hd.rotation.z = Math.sin(m.ph * 0.4) * 0.06;
    M.hd.rotation.y = Math.sin(m.ph * 0.23) * 0.18;
    M.hd2.rotation.y = Math.sin(m.ph * 0.7) * 0.25 + (Math.random() < 0.01 ? r(-0.4, 0.4) : 0);
    const p = 1 + Math.sin(m.ph * 1.7) * 0.035;
    M.cl.scale.set(p, p, p);
    M.s1h.rotation.x = -0.7 + Math.sin(m.ph * 0.5) * 0.1;
    M.s1a.rotation.x = -1.9 + Math.sin(m.ph * 0.9) * 0.08;
    const t = Math.min(1, m.tense / 0.9);
    M.arms.forEach((a: O3, k: number) => { a.rotation.x = t > 0 ? -2.2 * t + Math.sin(m.ph * 30 + k) * 0.1 * t : Math.sin(m.ph * 0.9 + k) * 0.05; });
  },
  thresher(m, M) {
    const wild = m.state === 'charge' || m.state === 'wind', op = wild ? 1.2 + Math.sin(m.ph * 24) * 0.14 : m.state === 'recover' ? 0.75 : 0.2 + Math.sin(m.ph * 1.4) * 0.1;
    for (const o of M.doors) o.d.rotation.y = o.s * op;
    for (const o of M.arms) {
      o.a.rotation.x = wild ? -2 + Math.sin(m.ph * 17 + o.s) * 1.1 : Math.sin(m.ph * 1.6 + o.s) * 0.2;
      o.a.rotation.z = o.s * (wild ? 0.5 + Math.sin(m.ph * 13 + o.s * 2) * 0.4 : 0.1);
      o.f.rotation.x = wild ? -0.6 + Math.sin(m.ph * 19 + o.s) * 0.5 : -0.15;
    }
    for (let k = 0; k < 2; k++) M.legs[k].rotation.x = m.mv > 0 ? Math.sin(m.ph * (wild ? 16 : 5) + k * PI) * 0.6 : 0;
    M.b.rotation.x = m.state === 'charge' ? 0.35 : m.state === 'recover' ? -0.1 : 0.05;
    /* its blow: both arms up and out and the chest open, then swept down and across, then left hanging, the doors
       slack, while it comes back to itself. e runs 0 to 1 up the wind-up, back through 0 to -1 in the strike, and
       from -1 to 0 again as it recovers */
    const B = blowAt(m);
    if (B) {
      const e = B.ph === 'wind' ? ease(B.q) : B.ph === 'strike' ? 1 - 2 * B.q * B.q : -(1 - ease(Math.max(0, (B.q - 0.3) / 0.7)));
      const shake = B.ph === 'wind' && B.q > 0.65;
      for (const o of M.doors) o.d.rotation.y = o.s * (0.3 + (e >= 0 ? 1.0 : -0.45) * e);
      for (const o of M.arms) {
        o.a.rotation.x = e >= 0 ? -2.5 * e + (shake ? Math.sin(m.ph * 30 + o.s) * 0.08 : 0) : -0.4 * e;
        o.a.rotation.z = o.s * (e >= 0 ? 0.9 * e : 0);
        o.f.rotation.x = e >= 0 ? -0.4 * e : -0.2 * e;
      }
      M.b.rotation.x = B.ph === 'wind' ? -0.15 * e : B.ph === 'strike' ? -0.15 + 0.6 * B.q : -0.45 * e;
    }
    M.hd.rotation.x = -0.7 + Math.sin(m.ph * 2.3) * 0.1;
    M.hd.rotation.z = Math.sin(m.ph * (wild ? 15 : 1.1)) * 0.2;
  },
  worm(m, M) {
    const sp = m.mv > 0 ? 7 : 1.5;
    for (let k = 0; k < 6; k++) { const s = M.segs[k]; s.position.x = Math.sin(m.ph * sp - k * 0.9) * 0.1; s.position.y = 0.18 + Math.max(0, Math.sin(m.ph * sp - k * 0.9)) * 0.07; }
    M.hd.position.x = Math.sin(m.ph * sp + 0.9) * 0.08;
    M.hd.rotation.y = Math.sin(m.ph * 1.7) * 0.4;
    M.hand.position.z = 0.12 + Math.sin(m.ph * sp) * 0.1;
    /* its reach: the head lifts and looks up, the hand drawn back, trembling at the last; then both go out and down at
       you, and stay out a moment. e runs 0 to 1 up the wind-up, through 0 to -1 in the strike, back to 0 recovering */
    const B = blowAt(m);
    const e = !B ? 0 : B.ph === 'wind' ? ease(B.q) : B.ph === 'strike' ? 1 - 2 * B.q * B.q : -(1 - ease(Math.max(0, (B.q - 0.3) / 0.7)));
    M.hd.position.y = 0.22 + (e >= 0 ? 0.14 : 0.04) * e;
    M.hd.position.z = 0.3 - (e >= 0 ? 0.1 : 0.25) * e;
    M.hd.rotation.x = -(e >= 0 ? 0.45 : 0.25) * e;
    M.hd.rotation.z = B?.ph === 'wind' && B.q > 0.5 ? Math.sin(m.ph * 40) * 0.08 : 0;
    M.hand.position.y = 0.1 + Math.max(0, e) * 0.15;
    if (B) M.hand.position.z = 0.12 - (e >= 0 ? 0.12 : 0.38) * e;
    M.segs[0].position.y += Math.max(0, e) * 0.1;
    M.segs[1].position.y += Math.max(0, e) * 0.05;
  },
  grabber(m, M) {
    const a = m.grab > 0 ? 3 : 1, tn = Math.min(1, m.tense / 0.8);
    for (const t of M.tent) for (let s = 0; s < 5; s++) {
      const c = t.ch[s];
      c.rotation.x = Math.sin(m.ph * 1.8 * a + s * 0.8 + t.k) * 0.22 * a * (1 - tn * 0.7) + (m.grab > 0 ? 0.25 : tn * 0.3);
      c.rotation.z = Math.cos(m.ph * 1.3 * a + s * 0.6 + t.k * 2) * 0.16 * (1 - tn * 0.8);
    }
    M.hd.rotation.y = Math.sin(m.ph) * 0.5 * (1 - tn);
    M.hd.rotation.x = tn * 0.3;
    const p = 1 + Math.sin(m.ph * 2.2) * 0.05;
    M.sac.scale.set(p, p, p);
  },
};
ANIM.swimmer = ANIM.worm;

interface Shown { m: Mutant; M: Model; mat: THREE.ShaderMaterial; blood: boolean }

export class CastView {
  private shown: Shown[] = [];

  constructor(private scene: THREE.Object3D, private sim: Sim, private L: Lighting) {
    for (const m of sim.cast) {
      const mat = dynamicMaterial(), M = BUILD[m.model](mat, m);
      scene.add(M.g);
      this.shown.push({ m, M, mat, blood: false });
    }
  }

  setLighting(L: Lighting): void {
    this.L = L;
    for (const b of this.bloods) this.light(b);
  }
  private bloods: THREE.Mesh[] = [];
  private light(mesh: THREE.Mesh): void {
    const p = mesh.position, R = this.sim.world.roomAt(p.x, p.y + 0.3, p.z), none = [0, 0, 0];
    lightMaterial(mesh.material as THREE.ShaderMaterial, R ? this.L.atPoint(p.x, p.y, p.z) : none, R ? this.L.flickAt(p.x, p.y, p.z) : none);
  }

  /** draw everything where it is, `alpha` of the way through the step */
  update(alpha: number): void {
    const w = this.sim.world;
    for (const s of this.shown) {
      const { m, M, mat } = s, g = M.g;
      const x = m.px + (m.x - m.px) * alpha, z = m.pz + (m.z - m.pz) * alpha;
      let y = m.py + (m.y - m.py) * alpha;
      /* a swimmer rides just under the surface of shallow water, and a little off the floor of deep (as before) */
      if (m.swim) { const d = w.waterAt(x, z) - y; if (d > 0) y += d < 2 ? Math.max(0, d - 0.23) : 0.3; }
      g.position.set(x, y, z);
      /* struck, it is rocked back on its heels and comes forward again (m.hit dies from 1 in a quarter second) */
      g.rotation.order = 'YXZ';
      g.rotation.y = m.yaw;
      g.rotation.x = m.dead || m.fixed ? 0 : -0.32 * m.hit * m.hit / Math.max(1, m.mass);
      mat.uniforms.uHit.value = m.hit;
      const R = w.roomAt(x, y + 0.5, z) ?? w.roomAt(x, y + 1.2, z), none = [0, 0, 0];
      lightMaterial(mat, R ? this.L.atPoint(x, y + 0.8, z) : none, R ? this.L.flickAt(x, y + 0.8, z) : none);
      if (m.dead) {
        /* it folds down where it fell, and leaves itself on the floor */
        g.scale.y = 1 - 0.62 * m.gone;
        if (m.fixed) g.scale.x = g.scale.z = 1 - 0.4 * m.gone;
        else g.rotation.z = m.gone * 0.35;
        if (!s.blood && !m.fixed && !m.swim && w.waterAt(m.x, m.z) < m.y) { s.blood = true; this.blood(m); }
        continue;
      }
      ANIM[m.ai]?.(m, M);
    }
  }

  private blood(m: Mutant): void {
    const mat = dynamicMaterial(), mesh = new THREE.Mesh(parts([['box', m.green ? 0x24401f : 0x3a0b0b, m.r * 2.6, 0.012, m.r * 2.2, 0, 0, 0]]), mat);
    mesh.position.set(m.x, m.y + 0.012, m.z);
    mesh.rotation.y = Math.random() * PI;
    mesh.frustumCulled = false;
    this.light(mesh);
    this.bloods.push(mesh);
    this.scene.add(mesh);
  }
}
