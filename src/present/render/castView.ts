import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { blowAt, MT, torchRay, TORCH, type Mutant } from '../../sim/cast';
import { DOWN } from '../../sim/moves';
import { ragSpeed } from '../../sim/ragdoll';
import { STEP } from '../../core/loop';
import { rect } from '../../world/shapes';
import type { Sim } from '../../sim/sim';
import type { Lighting, Loose } from '../../world/light';
import { EMIT, SHADOW_CAM, U, dynamicMaterial, lightMaterial } from './shader';
import { parts, type Part } from './things';
import { BONE, DARK, FLESH, GOREC, GR, ORANGE, PALE, RAW, grp, merged, mk, seeded, shelf, type O3 } from './castKit';
import { RIG, Rigged } from './rig';

/* The cast, drawn: the first engine's models (BUILD) and their animation (ANIM), ported nearly line for line. Each is a
   tree of parts on one material, so it flashes when hit and is lit by the room it stands in. Looks only: the sim
   decides where each is and what it is doing; this only shows it. */

/** what a model's animation is given: the run, the time since it was last drawn, and the light */
export interface Ctx { sim: Sim; dt: number; L: Lighting }

const PI = Math.PI;
/* eslint-disable @typescript-eslint/no-explicit-any */
type Model = { g: THREE.Group; [k: string]: any };

/** the night round's flashlight, in the hand that is still a hand (`h`, its left arm), along the arm; its lens lit while
 *  it lives (sim/cast.ts, torchRay, from the same numbers), as bright as a lit tube, so it glows. None for the rest */
function torch(mat: THREE.Material, m: Mutant, h: O3): THREE.Mesh | null {
  if (!m.torch) return null;
  mk(h, mat, 'cyl', 0x2a2c2e, 0.055, 0.26, 0.055, 0, -TORCH.arm + 0.17, 0.03); mk(h, mat, 'cyl', 0x3a3d40, 0.075, 0.06, 0.075, 0, -TORCH.arm + 0.03, 0.03);
  const lens = new THREE.Mesh(parts([['cyl', 0xfff4dc, 0.06, 0.012, 0.06, 0, 0, 0]]), new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(1, 0.94, 0.82).multiplyScalar(EMIT.most) }));
  lens.position.set(0, -TORCH.arm, 0.03);
  h.add(lens);
  return lens;
}

/* Security's staff, changed (world.md §8, the changed): still a person's outline, and most of them still in uniform. No
   raw flesh: the plant shows on them instead, tobacco leaf out of the neck and the right shoulder in shelves, stacked the
   way a bracket fungus stacks out of a stump, and glassy eyes under heavy lids, the pupils pinned. Sedated, all of them.
   The night round always in uniform, and the leaf thickest on it. Built as the husk is, part for part, so it moves and
   goes loose as the husk does (rig.ts); the leaf is one mesh to a cluster */
const UNIFORM = 0x2c3440, TROUSERS = 0x23262b, BELT = 0x15181b, SALLOW = 0xbfae8e, GLAZE: Colour = [1.1, 1.08, 0.98];
function changed(mat: THREE.Material, m: Mutant): Model {
  const R = seeded(m.id), g = new THREE.Group(), uni = m.torch || R.rnd(0, 1) < 0.65;
  const cl = uni ? UNIFORM : R.pick([0xbfc3c0, 0x4a5560, 0x6b6f5a, 0x7a5a50]), tr = uni ? TROUSERS : 0x2b2e34;
  const legs: O3[] = [], shins: O3[] = [];
  for (const s of [-1, 1]) {
    const l = grp(g, s * 0.11, 0.9, 0), k = grp(l, 0, -0.45, 0);
    mk(l, mat, 'box', tr, 0.16, 0.45, 0.17, 0, -0.225, 0); mk(k, mat, 'box', tr, 0.16, 0.45, 0.17, 0, -0.225, 0); mk(k, mat, 'box', DARK, 0.17, 0.09, 0.28, 0, -0.42, 0.04);
    legs.push(l); shins.push(k);
  }
  const b = grp(g, 0, 0.9, 0);
  mk(b, mat, 'box', cl, 0.42, 0.6, 0.24, 0, 0.3, 0); mk(b, mat, 'box', BELT, 0.43, 0.08, 0.25, 0, 0.05, 0);
  if (uni) {
    /* the shirt's badge and epaulettes, the belt's buckle, and a radio on it gone quiet */
    mk(b, mat, 'box', 0x9a8a50, 0.06, 0.07, 0.02, -0.12, 0.44, 0.125); mk(b, mat, 'box', 0x8a8e8c, 0.07, 0.05, 0.02, 0, 0.05, 0.13);
    for (const s of [-1, 1]) mk(b, mat, 'box', 0x1f252e, 0.13, 0.025, 0.2, s * 0.15, 0.6, 0);
    mk(b, mat, 'box', 0x1d1f21, 0.07, 0.13, 0.05, 0.2, 0.06, 0.06);
  }
  mk(b, mat, 'cyl', SALLOW, 0.13, 0.14, 0.13, -0.02, 0.64, 0); // the neck, where the leaf comes out
  const hd = grp(b, -0.02, 0.76, 0);
  mk(hd, mat, 'ico', SALLOW, 0.24, 0.28, 0.25, 0, 0, 0);
  for (const s of [-1, 1]) {
    /* the eyes: wet, the pupils pinned whatever the light, the lids half down over them; a glint where light finds them */
    mk(hd, mat, 'ico', GLAZE, 0.058, 0.04, 0.03, s * 0.055, 0.025, 0.112); mk(hd, mat, 'ico', DARK, 0.01, 0.01, 0.01, s * 0.055, 0.024, 0.127);
    mk(hd, mat, 'box', [1.45, 1.45, 1.4], 0.014, 0.012, 0.006, s * 0.055 + 0.013, 0.031, 0.129);
    mk(hd, mat, 'box', 0xb8a684, 0.064, 0.016, 0.03, s * 0.055, 0.045, 0.117); mk(hd, mat, 'box', 0x9a5a4e, 0.05, 0.008, 0.03, s * 0.055, 0.004, 0.116);
  }
  mk(hd, mat, 'box', 0x3a2622, 0.08, 0.022, 0.03, 0, -0.075, 0.112); // the mouth, slack
  hd.rotation.z = 0.25;
  const arms: O3[] = [];
  for (const [x, y] of [[-0.27, 0.56], [0.27, 0.56]] as const) {
    const a = grp(b, x, y, 0); mk(a, mat, 'box', cl, 0.11, 0.36, 0.12, 0, -0.18, 0); mk(a, mat, 'box', SALLOW, 0.08, 0.34, 0.08, 0, -0.52, 0);
    arms.push(a);
  }
  /* the leaf: out of the back of the neck, its right side, and the right shoulder through the shirt; how much, by the one */
  const grown = m.torch ? 3 : 1 + Math.floor(R.rnd(0, 3));
  merged(b, mat, G => {
    /* up the back of the neck toward the skull, its right side under the jaw, out of the right shoulder, and on the most
       grown down the right of the back */
    shelf(G, mat, -0.03, 0.58, -0.1, PI + 0.3, 4, 0.3, R.rnd, { rise: 0.07, lean: 0.015, fan: 0.45 });
    if (grown > 1) shelf(G, mat, 0.08, 0.6, 0.0, PI / 2 + 0.5, 3, 0.25, R.rnd, { rise: 0.065 });
    shelf(G, mat, 0.2, 0.48, -0.02, PI / 2 + 0.15, grown > 2 ? 4 : 2, 0.3, R.rnd, { rise: 0.075, fan: 0.4 });
    if (grown > 2) shelf(G, mat, 0.15, 0.24, -0.11, PI * 0.8, 3, 0.24, R.rnd, { rise: 0.065 });
  });
  return { g, b, hd, legs, shins, arms, lens: torch(mat, m, arms[0]) };
}

/* the other patient in the isolation suite (world.md §8, the opening): a gown, bare legs and feet, thin from days with
   nothing to eat, the hair gone wild; built as the husk is, so it goes loose as the husk does. Struck down and dragged,
   the gown is streaked with blood (`gore`); grafted, a small shelf of leaf comes out of the left forearm, a raw knot
   round it (`graft`) */
const GOWN = 0x8fa09b, SKIN = 0xc9b7a4, HAIR = 0x2a2420, GORE = 0x4a0d0c;
function patientModel(mat: THREE.Material): Model {
  const g = new THREE.Group(), legs: O3[] = [], shins: O3[] = [];
  for (const s of [-1, 1]) {
    const l = grp(g, s * 0.1, 0.9, 0), k = grp(l, 0, -0.45, 0);
    mk(l, mat, 'box', SKIN, 0.11, 0.45, 0.12, 0, -0.225, 0); mk(k, mat, 'box', SKIN, 0.1, 0.45, 0.11, 0, -0.225, 0); mk(k, mat, 'box', SKIN, 0.1, 0.06, 0.22, 0, -0.43, 0.04);
    legs.push(l); shins.push(k);
  }
  const b = grp(g, 0, 0.9, 0);
  mk(b, mat, 'box', GOWN, 0.4, 0.6, 0.22, 0, 0.3, 0); mk(b, mat, 'box', GOWN, 0.44, 0.42, 0.25, 0, -0.18, 0); // the gown, to the knee
  mk(b, mat, 'cyl', SKIN, 0.1, 0.12, 0.1, 0, 0.64, 0);
  const hd = grp(b, 0, 0.76, 0);
  mk(hd, mat, 'ico', SKIN, 0.21, 0.27, 0.23, 0, 0, 0); mk(hd, mat, 'ico', HAIR, 0.26, 0.17, 0.27, 0, 0.09, -0.03); mk(hd, mat, 'ico', HAIR, 0.2, 0.2, 0.12, 0, 0.0, -0.1);
  for (const s of [-1, 1]) { mk(hd, mat, 'ico', 0x5a4038, 0.05, 0.035, 0.02, s * 0.05, 0.02, 0.105); mk(hd, mat, 'ico', DARK, 0.018, 0.018, 0.01, s * 0.05, 0.02, 0.113); }
  mk(hd, mat, 'box', 0x5a3a34, 0.06, 0.03, 0.02, 0, -0.07, 0.108);
  const arms: O3[] = [];
  for (const s of [-1, 1]) {
    const a = grp(b, s * 0.25, 0.56, 0); mk(a, mat, 'box', GOWN, 0.12, 0.16, 0.13, 0, -0.06, 0); mk(a, mat, 'box', SKIN, 0.07, 0.6, 0.07, 0, -0.38, 0);
    arms.push(a);
  }
  const gore = merged(b, mat, G => {
    for (const [x, y, z, sx, sy] of [[0.08, 0.38, 0.115, 0.14, 0.3], [-0.1, 0.12, 0.118, 0.1, 0.22], [0.12, -0.2, 0.13, 0.12, 0.26], [0, 0.45, -0.115, 0.22, 0.2], [-0.12, -0.05, -0.13, 0.12, 0.3]] as const)
      mk(G, mat, 'box', GORE, sx, sy, 0.012, x, y, z);
    mk(G, mat, 'ico', GORE, 0.2, 0.12, 0.22, 0, 0.72, 0.02); // the hair matted with it
  });
  const graft = merged(arms[0], mat, G => {
    mk(G, mat, 'ico', 0x6a2820, 0.1, 0.12, 0.1, 0, -0.42, 0.03);
    shelf(G, mat, 0, -0.44, 0.04, 0, 2, 0.16, seeded(7).rnd, { rise: 0.05, fan: 0.5 });
  });
  gore.visible = graft.visible = false;
  return { g, b, hd, legs, shins, arms, gore, graft };
}

export const BUILD: Record<string, (mat: THREE.Material, m: Mutant) => Model> = {
  patient: mat => patientModel(mat),
  /* staff, early in the Regimen: still a person's outline, one arm already something else. Security's own are the
     changed, and look it (changed(), below) */
  husk(mat, m) {
    if (m.cards) return changed(mat, m);
    const R = seeded(m.id), g = new THREE.Group(), cl = R.pick([0xbfc3c0, 0x4a5560, 0x39485a, 0x6b6f5a, 0x7a5a50]), tr = 0x2b2e34;
    /* each leg in two at the knee, which only a body gone loose bends (rig.ts) */
    const legs: O3[] = [], shins: O3[] = [];
    for (const s of [-1, 1]) {
      const l = grp(g, s * 0.11, 0.9, 0), k = grp(l, 0, -0.45, 0);
      mk(l, mat, 'box', tr, 0.16, 0.45, 0.17, 0, -0.225, 0); mk(k, mat, 'box', tr, 0.16, 0.45, 0.17, 0, -0.225, 0); mk(k, mat, 'box', DARK, 0.16, 0.07, 0.26, 0, -0.42, 0.04);
      legs.push(l); shins.push(k);
    }
    const b = grp(g, 0, 0.9, 0);
    mk(b, mat, 'box', cl, 0.42, 0.6, 0.24, 0, 0.3, 0); mk(b, mat, 'box', tr, 0.4, 0.12, 0.23, 0, 0.03, 0); mk(b, mat, 'ico', RAW, 0.26, 0.3, 0.22, 0.17, 0.52, -0.04);
    const hd = grp(b, -0.02, 0.76, 0);
    mk(hd, mat, 'ico', PALE, 0.24, 0.28, 0.25, 0, 0, 0); mk(hd, mat, 'box', DARK, 0.1, 0.03, 0.03, 0, -0.07, 0.11); mk(hd, mat, 'ico', DARK, 0.04, 0.04, 0.04, -0.05, 0.03, 0.11); mk(hd, mat, 'ico', RAW, 0.1, 0.11, 0.07, 0.07, 0.04, 0.09);
    hd.rotation.z = 0.25;
    const arms: O3[] = [];
    let a = grp(b, -0.27, 0.56, 0); mk(a, mat, 'box', cl, 0.11, 0.36, 0.12, 0, -0.18, 0); mk(a, mat, 'box', PALE, 0.08, 0.34, 0.08, 0, -0.52, 0); arms.push(a);
    a = grp(b, 0.3, 0.58, 0); mk(a, mat, 'box', RAW, 0.14, 0.4, 0.14, 0, -0.2, 0); mk(a, mat, 'box', FLESH, 0.1, 0.52, 0.1, 0, -0.64, 0); mk(a, mat, 'box', BONE, 0.05, 0.16, 0.05, 0, -0.97, 0.02); arms.push(a);
    return { g, b, hd, legs, shins, arms, lens: torch(mat, m, arms[0]) };
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
  /* a man whose ribcage has parted down the sternum and learned to open like a pair of doors */
  thresher(mat) {
    const g = new THREE.Group(), tr = 0x2b2e34, sh = 0xa9a595;
    const legs: O3[] = [], shins: O3[] = [];
    for (const s of [-1, 1]) {
      const l = grp(g, s * 0.17, 1, 0), k = grp(l, 0, -0.52, 0);
      mk(l, mat, 'box', tr, 0.2, 0.52, 0.22, 0, -0.26, 0); mk(k, mat, 'box', tr, 0.17, 0.46, 0.19, 0, -0.22, 0.02); mk(k, mat, 'box', DARK, 0.17, 0.08, 0.3, 0, -0.44, 0.06);
      legs.push(l); shins.push(k);
    }
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
    return { g, b, hd, legs, shins, arms, doors };
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

export const ANIM: Record<string, (m: Mutant, M: Model, c: Ctx) => void> = {
  /* the other patient: slumped at its window, a hand on the glass; banging on it, both fists, each blow landing as the sim
     has it (m.wt, the time to the next); still, to you, an arm out to its left and up at the balcony, looking from you to
     it; crouched under its window, its arms over its head */
  patient(m, M) {
    const mv = m.mv > 0;
    for (let k = 0; k < 2; k++) { M.legs[k].rotation.x = mv ? Math.sin(m.ph * 6 + k * PI) * 0.3 : 0; M.shins[k].rotation.x = 0; M.arms[k].rotation.z = 0; }
    M.hd.rotation.set(0, 0, 0);
    if (m.state === 'bang') {
      const q = ease(1 - Math.min(1, m.wt / 0.5));
      for (let k = 0; k < 2; k++) M.arms[k].rotation.x = -2.3 + q * 1.0 + k * 0.15;
      M.b.rotation.x = 0.05 + q * 0.12;
      M.hd.rotation.x = -0.1;
    } else if (m.state === 'warn') {
      M.b.rotation.x = 0;
      M.arms[1].rotation.z = 2.3; M.arms[1].rotation.x = -0.35 + Math.sin(m.ph * 9) * 0.05; // out, up, and held there
      M.arms[0].rotation.x = 0;
      M.hd.rotation.y = Math.sin(m.ph * 2.2) > 0 ? 0.7 : 0; // from you to it, and back
    } else if (m.state === 'hide') {
      M.b.rotation.x = 0.45;
      M.arms[0].rotation.x = M.arms[1].rotation.x = -2.6;
      M.hd.rotation.x = 0.5;
      /* crouched: the thighs up, the shins back, and the whole of it down so its feet are on the floor */
      if (!mv) { for (let k = 0; k < 2; k++) { M.legs[k].rotation.x = -0.9; M.shins[k].rotation.x = 1.5; } M.g.position.y -= 0.22; }
    } else {
      M.b.rotation.x = 0.12;
      M.arms[0].rotation.x = -1.35 + Math.sin(m.ph * 0.4) * 0.03; M.arms[1].rotation.x = 0.05;
      M.hd.rotation.x = 0.35;
      M.hd.rotation.z = 0.12;
    }
  },
  husk(m, M, c) {
    const mv = m.mv > 0, hunt = m.state === 'hunt', f = hunt ? 11 : 5;
    for (let k = 0; k < 2; k++) { M.legs[k].rotation.x = mv ? Math.sin(m.ph * f + k * PI) * (hunt ? 0.7 : 0.35) : 0; if (M.shins) M.shins[k].rotation.x = 0; }
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
    /* reeling, its poise broken: thrown back on its heels, the arms gone slack, until it has its feet */
    if (m.reel > 0) {
      const e = Math.min(1, m.reel / 0.3), sh = Math.sin(m.ph * 23) * 0.06 * e;
      M.b.rotation.x = -0.4 * e + sh;
      M.arms[0].rotation.x = -0.25 * e;
      M.arms[1].rotation.x = 0.2 * e + sh;
    }
    M.b.rotation.z = Math.sin(m.ph * (mv ? f : 0.8)) * 0.04;
    M.hd.rotation.z = 0.25 + Math.sin(m.ph * 0.7) * 0.1 + (Math.random() < 0.015 ? r(-0.5, 0.5) : 0);
    M.hd.rotation.y = Math.sin(m.ph * 0.5) * 0.25;
    /* the flashlight held out along its beam, whatever the other arm is doing (sim/cast.ts, torchRay) */
    if (M.lens) M.arms[0].rotation.x = torchRay(c.sim, m).pitch - PI / 2;
    /* dragging the other patient by an ankle: the other arm down and back, the hand low behind it */
    if (m.drag >= 0) { M.arms[1].rotation.x = 0.6; M.arms[1].rotation.z = -0.15; }
    /* grafting: down on its knees over the body, bent to it, the free hand driving into the arm, again and again */
    if (m.graft > 0) {
      for (let k = 0; k < 2; k++) { M.legs[k].rotation.x = -1.35; M.shins[k].rotation.x = 1.6; }
      M.g.position.y -= 0.5;
      M.b.rotation.x = 0.85;
      M.arms[1].rotation.x = -1.2 + Math.max(0, Math.sin(m.ph * 7)) * 0.5;
      M.hd.rotation.x = 0.5;
    }
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

/** a corpse bleeds once it has been loose `after` seconds and is on the floor slower than `speed` (m/s); its pool
 *  starts at `from` of its size and comes to the whole of it over `spread` seconds, most of it in the first */
const BLEED = { after: 0.25, speed: 0.6, from: 0.15, spread: 3.5 };
/** blood on a floor, never square: a pool `d` across and what ran from it; a smear along a drag (along z, a metre) */
const SPLAT = {
  pool: (c: number, d: number): Part[] => [['cyl', c, d, 0.012, d * 0.9, 0, 0, 0], ['cyl', c, d * 0.55, 0.012, d * 0.42, d * 0.42, 0, d * 0.14], ['cyl', c, d * 0.36, 0.012, d * 0.5, -d * 0.3, 0, -d * 0.34], ['cyl', c, d * 0.2, 0.012, d * 0.16, d * 0.12, 0, -d * 0.58]],
  smear: [['cyl', 0x3a0b0b, 0.34, 0.012, 1.1, 0, 0, 0], ['cyl', 0x2e0909, 0.07, 0.012, 1.2, 0.12, 0, 0.05], ['cyl', 0x2e0909, 0.06, 0.012, 1.0, -0.13, 0, -0.04]] as Part[],
};

/** `loose`: the rig has had its parts since the animation last did */
interface Shown {
  m: Mutant; M: Model; mat: THREE.ShaderMaterial; blood: boolean; fall: number; rig: Rigged | null; loose: boolean;
  /** asleep, all of it as one mesh where it lies, in place of its parts (rig.ts, bake) */
  baked: THREE.Mesh | null;
  /** how it was last drawn (SIGHT) */
  drawn: Drawn;
}

/** what of the cast is out of your sight (out of view, or rock or a wall between, not a door) is drawn only where a
 *  shadow of it could show: into the beam in your hand's shadow if it stands in its cone, and into the shadows of the
 *  beams lying about (beams.ts) within their reach, which can show it where you cannot; and not at all, nor even
 *  looked through by the renderer, if neither. Each of its parts is a draw, and a level's worth of them in rooms beyond
 *  the walls in view was most of a frame's. Looked for every frame it is in view, along lines from the eye to its
 *  middle and the corners of a box round it `wide` times as wide as it is (a dead one sprawled, `sprawl` m more);
 *  always seen within `near` m. A beam's cone is `cone` (its spill's, as a cosine) and reaches `reach` m */
const SIGHT = { near: 3, wide: 1.5, sprawl: 1, cone: 0.7, reach: 40 };
/** the layer the cast out of your sight is drawn on (SIGHT) */
export const UNSEEN = 3;
const onLayer = (o: THREE.Object3D, layer: number) => o.traverse(c => c.layers.set(layer));
const frustum = new THREE.Frustum(), viewProj = new THREE.Matrix4(), sphere = new THREE.Sphere();
/** how it is drawn: seen by the eye; only into shadows; not at all */
type Drawn = 'seen' | 'shadow' | 'none';

/** a model fixed to its skeleton's points for when it goes loose (rig.ts), stood as it stands idle to be fixed */
function rigOf(m: Mutant, M: Model, c: Ctx): Rigged | null {
  if (!RIG[m.model] || !m.body) return null;
  const idle = { ...m, state: 'idle', mv: 0, blow: null, reel: 0, ph: 0, down: 0, rise: 0, los: false, hit: 0 } as Mutant;
  const A = ANIM[m.model] ?? ANIM[m.ai];
  A?.(idle, M, c);
  return new Rigged(M, m.model);
}

export class CastView {
  private shown: Shown[] = [];

  constructor(private scene: THREE.Object3D, private sim: Sim, private L: Lighting) {
    this.more();
  }

  /** draw any of the cast not drawn yet: all of them at first, then any the arena puts down (sim/cast.ts, spawn) */
  private more(): void {
    for (let i = this.shown.length; i < this.sim.cast.length; i++) {
      const m = this.sim.cast[i], mat = dynamicMaterial(), M = BUILD[m.model](mat, m);
      const rig = rigOf(m, M, { sim: this.sim, dt: 1 / 60, L: this.L });
      this.scene.add(M.g);
      this.shown.push({ m, M, mat, blood: false, fall: 0, rig, loose: false, baked: null, drawn: 'seen' });
    }
  }

  setLighting(L: Lighting): void {
    this.L = L;
    for (const b of this.bloods) this.light(b);
  }
  private bloods: THREE.Mesh[] = [];
  /** pools still spreading: from the tick they began, under whom, and whether it still lies where it will */
  private spreading: { mesh: THREE.Mesh; m: Mutant; t0: number; held: boolean }[] = [];
  private light(mesh: THREE.Mesh): void {
    const p = mesh.position, R = this.sim.world.roomAt(p.x, p.y + 0.3, p.z), none = [0, 0, 0];
    lightMaterial(mesh.material as THREE.ShaderMaterial, R ? this.L.atPoint(p.x, p.y, p.z) : none, R ? this.L.flickAt(p.x, p.y, p.z) : none, R ? this.L.towards(p.x, p.y, p.z) : none);
  }

  private last = 0;
  /** draw everything where it is, `alpha` of the way through the step, seen from `eye` */
  update(alpha: number, eye: THREE.Camera): void {
    if (this.shown.length < this.sim.cast.length) this.more();
    const w = this.sim.world, t = performance.now() / 1000, c: Ctx = { sim: this.sim, dt: this.last ? Math.min(0.1, t - this.last) : 0, L: this.L };
    this.last = t;
    this.spread();
    this.struck(c.dt);
    eye.updateMatrixWorld();
    frustum.setFromProjectionMatrix(viewProj.multiplyMatrices((eye as THREE.PerspectiveCamera).projectionMatrix, eye.matrixWorldInverse));
    const E = eye.getWorldPosition(new THREE.Vector3()), lying = this.L.looseLights.filter(L => L.kind === 'flash');
    for (const s of this.shown) {
      const { m, M, mat } = s, g = M.g;
      if (s.baked && (m.away || !m.rag)) this.unbake(s);
      const drawn = m.away ? 'none' : this.drawn(m, E, lying);
      if (drawn !== s.drawn) {
        if (drawn !== 'none') { onLayer(g, drawn === 'seen' ? 0 : UNSEEN); if (s.baked) onLayer(s.baked, drawn === 'seen' ? 0 : UNSEEN); }
        s.drawn = drawn;
      }
      g.visible = drawn !== 'none' && !s.baked;
      if (s.baked) s.baked.visible = drawn !== 'none';
      if (m.away) continue;
      if (M.lens) M.lens.visible = !m.dead;
      if (M.gore) M.gore.visible = m.state === 'dragged' || m.state === 'out';
      if (M.graft) M.graft.visible = m.grafted;
      const x = m.px + (m.x - m.px) * alpha, z = m.pz + (m.z - m.pz) * alpha;
      let y = m.py + (m.y - m.py) * alpha;
      /* a swimmer rides just under the surface of shallow water, and a little off the floor of deep (as before) */
      if (m.swim) { const d = w.waterAt(x, z) - y; if (d > 0) y += d < 2 ? Math.max(0, d - 0.23) : 0.3; }
      g.position.set(x, y, z);
      /* held still by a blow that landed (sim/moves.ts, HITSTOP), it shudders where it stands */
      if (m.stop > 0 && !m.rag) { const sh = Math.sin(t * 95) * 0.025; g.position.x += Math.cos(m.yaw) * sh; g.position.z -= Math.sin(m.yaw) * sh; }
      /* struck, it is rocked back on its heels and comes forward again (m.hit dies from 1 in a quarter second) */
      g.rotation.order = 'YXZ';
      g.rotation.y = m.yaw;
      g.rotation.x = m.dead || m.fixed ? 0 : -0.32 * m.hit * m.hit / Math.max(1, m.mass);
      /* knocked down: over backward onto the floor, quickly, and back up as it gets up (sim/moves.ts, DOWN) */
      const down = m.down > 0 ? 1 : m.rise > 0 ? m.rise / DOWN.rise : 0;
      s.fall += (down - s.fall) * Math.min(1, c.dt * (down > s.fall ? 10 : 5));
      /* gone loose (sim/ragdoll.ts): its points have it, not a tip of the whole */
      if (m.rag && s.rig) s.fall = 0;
      if (s.fall > 0.001 && !m.dead) { g.rotation.x -= s.fall * 1.45; g.position.y += s.fall * 0.15; }
      mat.uniforms.uHit.value = m.hit;
      const R = w.roomAt(x, y + 0.5, z) ?? w.roomAt(x, y + 1.2, z), none = [0, 0, 0];
      const ly = y + (m.rag ? 0.4 : 0.8);
      lightMaterial(mat, R ? this.L.atPoint(x, ly, z) : none, R ? this.L.flickAt(x, ly, z) : none, R ? this.L.towards(x, ly, z) : none);
      if (m.dead && m.rag && s.rig) {
        /* gone loose: drawn as its points lie (rig.ts); it bleeds where it comes to rest */
        s.rig.pose(m.rag, alpha, c.dt);
        s.loose = true;
        if (s.rig.settled !== !!s.baked) s.rig.settled ? this.bake(s) : this.unbake(s);
        if (!s.blood && !m.swim && w.waterAt(m.x, m.z) < m.y && this.down(m)) { s.blood = true; this.blood(m); }
        continue;
      }
      if (m.dead) {
        /* it folds down where it fell, and leaves itself on the floor */
        g.scale.y = 1 - 0.62 * m.gone;
        if (m.fixed) g.scale.x = g.scale.z = 1 - 0.4 * m.gone;
        else g.rotation.z = m.gone * 0.35;
        if (!s.blood && !m.fixed && !m.swim && w.waterAt(m.x, m.z) < m.y) { s.blood = true; this.blood(m); }
        continue;
      }
      /* knocked down, loose: lying as its points lie, until it gets up */
      if (m.rag && s.rig && m.down > 0) { s.rig.pose(m.rag, alpha, c.dt); s.loose = true; continue; }
      if (s.loose) { s.rig!.restore(); s.loose = false; }
      /* by its model, or else by its kind */
      (ANIM[m.model] ?? ANIM[m.ai])?.(m, M, c);
      /* getting up: from as its points lie into how it stands, as it rises */
      if (m.rag && s.rig) { s.rig.rise(m.rag, alpha, 1 - m.rise / DOWN.rise); s.loose = true; }
    }
  }

  /** how `m` is to be drawn, seen from E, with these beams lying about (SIGHT) */
  private drawn(m: Mutant, E: THREE.Vector3, lying: readonly Loose[]): Drawn {
    const h = MT[m.type]?.h ?? 1.8, wide = (m.r ?? 0.4) * SIGHT.wide + (m.dead ? SIGHT.sprawl : 0), mid = m.y + h / 2, r = Math.hypot(wide, h / 2);
    sphere.center.set(m.x, mid, m.z);
    sphere.radius = r;
    if (frustum.intersectsSphere(sphere)) {
      const dx = m.x - E.x, dz = m.z - E.z, d = Math.hypot(dx, dz);
      if (d < SIGHT.near) return 'seen';
      const w = this.sim.world, ax = (-dz / d) * wide, az = (dx / d) * wide, lo = m.y + 0.15, hi = m.y + h - 0.1;
      if (w.gridClear(E.x, E.y, E.z, m.x, mid, m.z)) return 'seen';
      for (const [sx, y] of [[-1, lo], [1, lo], [-1, hi], [1, hi]])
        if (w.gridClear(E.x, E.y, E.z, m.x + ax * sx, y, m.z + az * sx)) return 'seen';
    } else if (U.uFlash.value > 0) {
      /* out of view, it can still stand in the beam in your hand and throw its shadow into view */
      const H = U.uFlashPos.value, D = U.uFlashDir.value, vx = m.x - H.x, vy = mid - H.y, vz = m.z - H.z, d = Math.hypot(vx, vy, vz);
      if (d < r || (d < SHADOW_CAM.far + r && (vx * D.x + vy * D.y + vz * D.z) / d > Math.cos(Math.acos(SIGHT.cone) + Math.asin(Math.min(1, r / d))))) return 'seen';
    }
    for (const L of lying) if (Math.hypot(L.x - m.x, L.y - mid, L.z - m.z) < SIGHT.reach + r) return 'shadow';
    return 'none';
  }

  /** asleep where it lies: one mesh of all its parts, on its material, drawn in place of them; its parts are hidden */
  private bake(s: Shown): void {
    /* beside its parts, where they are: one laid as it lies stands where its group's frame is its parent's */
    const g = s.M.g, mesh = new THREE.Mesh(s.rig!.bake(), s.mat);
    if (s.drawn === 'shadow') onLayer(mesh, UNSEEN);
    mesh.visible = s.drawn !== 'none';
    g.parent!.add(mesh);
    s.baked = mesh;
    g.visible = false;
  }

  /** woken (or taken away): its parts again */
  private unbake(s: Shown): void {
    const mesh = s.baked!;
    mesh.removeFromParent();
    mesh.geometry.dispose();
    s.baked = null;
    s.M.g.visible = !s.m.away;
  }

  /** gone loose and down: on the floor, and all but stopped (it need not have gone to sleep) */
  private down(m: Mutant): boolean {
    const R = m.rag!;
    if (!R.awake) return true;
    if (R.t < BLEED.after || ragSpeed(R) > BLEED.speed) return false;
    return m.y - this.sim.world.groundBelow(rect(m.x, m.z, 0.05, 0.05), m.y + 0.1) < 0.06;
  }

  private blood(m: Mutant): void {
    const mat = dynamicMaterial(), mesh = new THREE.Mesh(parts(SPLAT.pool(m.green ? 0x24401f : 0x3a0b0b, m.r * 2.6)), mat);
    mesh.position.set(m.x, m.y + 0.012, m.z);
    mesh.rotation.y = Math.random() * PI;
    mesh.scale.set(BLEED.from, 1, BLEED.from);
    this.light(mesh);
    this.bloods.push(mesh);
    this.scene.add(mesh);
    this.spreading.push({ mesh, m, t0: this.sim.tick, held: !!m.rag?.awake });
  }

  /** blood from the living (Sim.pools): a pool spreading out to as big as it is, or a smear along the way a body was
   *  dragged; each a little above the last so they do not fight where they overlap */
  private pooled: THREE.Mesh[] = [];
  private struck(dt: number): void {
    const P = this.sim.pools;
    for (let i = this.pooled.length; i < P.length; i++) {
      const p = P[i], mesh = new THREE.Mesh(parts(p.kind === 'smear' ? SPLAT.smear : SPLAT.pool(0x3a0b0b, 1)), dynamicMaterial());
      mesh.position.set(p.x, p.y + 0.012 + (i % 8) * 0.0015, p.z);
      mesh.rotation.y = p.yaw ?? Math.random() * PI;
      const k = p.kind ? p.r : 0.05;
      mesh.scale.set(k, 1, k);
      this.light(mesh);
      this.bloods.push(mesh); this.pooled.push(mesh);
      this.scene.add(mesh);
    }
    this.pooled.forEach((mesh, i) => {
      if (P[i].kind) return;
      const k = mesh.scale.x + (P[i].r - mesh.scale.x) * Math.min(1, dt * 1.5);
      mesh.scale.set(k, 1, k);
    });
  }

  /* a pool spreads out from under it, fast and then slower; while it is still settling, it goes where the body does */
  private spread(): void {
    this.spreading = this.spreading.filter(P => {
      const { mesh, m } = P, u = Math.min(1, (this.sim.tick - P.t0) * STEP / BLEED.spread), k = BLEED.from + (1 - BLEED.from) * (1 - (1 - u) ** 3);
      mesh.scale.set(k, 1, k);
      if (P.held && !m.rag?.awake) P.held = false;
      if (P.held) { mesh.position.set(m.x, m.y + 0.012, m.z); this.light(mesh); }
      return u < 1 || P.held;
    });
  }
}
