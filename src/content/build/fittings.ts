import { PI, TAU } from '../../core/math';
import { P, T, bx, colT, door, pick, rnd, room, use, type Deck, type TRoom, type TRoomOpts } from './tiles';

/* The first engine's furniture, clutter and fittings, on the tile adapter. Ported as they were, so the station looks as
   it did; their randomness now comes from the level's own seed. */

/* ---- palettes */
export const CELL = { fl: 0x4e5052, wl: 0x666a6e, st: 0xa8521e };
export const UTIL = { fl: 0x505254, wl: 0x6a6d6c, st: 0xb89b2e };
export const HAB = { fl: 0x7b7568, wl: 0x9a9588, st: 0x3f7f6b };
export const MED = { fl: 0x9aa39d, wl: 0xb9c4bd, st: 0x8c2f24 };
export const SEC = { fl: 0x55585c, wl: 0x70747a, st: 0x39485a };
export const OPS = { fl: 0x6a665e, wl: 0x8c887e, st: 0x8a7a4a };
/** Horticulture: the green's own, and its air is full of spores */
export const HRT: TRoomOpts = { fl: 0x3d4a30, wl: 0x5a6a4c, st: 0x2f5a34, motes: 'spores' };
export const BAY: TRoomOpts = { fl: 0x4a4c4e, wl: 0x5e6164, st: 0xb89b2e, ht: 8, em: 1 };
export const WALK: TRoomOpts = { open: 1, ht: 4, em: 1, fl: 0x5a5d60, wl: 0x5e6164, nolamp: 1 };
export const LOW: [number, number, number] = [0.66, 0.68, 0.72];

/* ---- furniture */
export function bed(D: Deck, x: number, z: number, ns: boolean, c = 0x80848c): void {
  const w = ns ? 0.95 : 2, d = ns ? 2 : 0.95;
  bx(D, x, z, w, 0.32, d, 0x3a3d42);
  bx(D, x, z, w - 0.06, 0.12, d - 0.06, c, { y: 0.32, c: 0 });
  bx(D, x + (ns ? 0 : -0.7 / T), z + (ns ? -0.7 / T : 0), ns ? 0.6 : 0.32, 0.07, ns ? 0.32 : 0.6, 0xc4c4bc, { y: 0.44, c: 0 });
}
export function tbl(D: Deck, x: number, z: number, w: number, d: number, c = 0x5b5d5f): void {
  const ns = d > w;
  bx(D, x, z, w, 0.05, d, c, { y: 0.71, c: 0 });
  for (const s of [-1, 1]) bx(D, x + (ns ? 0 : (s * (w / 2 - 0.08)) / T), z + (ns ? (s * (d / 2 - 0.08)) / T : 0), ns ? w - 0.1 : 0.06, 0.71, ns ? 0.06 : d - 0.1, 0x33363a, { c: 0 });
  colT(D, x, z, w, d);
}
export function shelf(D: Deck, x: number, z: number, w: number, d: number, o: { empty?: number; jars?: number; cols?: number[] } = {}): void {
  const ns = d > w, L = ns ? d : w;
  for (const y of [0.1, 0.55, 1, 1.45, 1.86]) bx(D, x, z, w, 0.04, d, 0x4a4d50, { y, c: 0 });
  for (const s of [-1, 1]) bx(D, x + (ns ? 0 : (s * (w / 2 - 0.02)) / T), z + (ns ? (s * (d / 2 - 0.02)) / T : 0), ns ? w : 0.04, 1.9, ns ? 0.04 : d, 0x3a3d40, { c: 0 });
  if (!o.empty)
    for (const y of [0.14, 0.59, 1.04, 1.49])
      for (let k = 0; k < (L > 2 ? 3 : 2); k++) {
        const t = rnd(-L / 2 + 0.3, L / 2 - 0.3) / T, s = rnd(0.15, 0.3);
        P(D, o.jars ? 'cyl' : 'box', x + (ns ? 0 : t), z + (ns ? t : 0), s, rnd(0.14, 0.3), s, pick(o.cols ?? [0x6b5a3c, 0x4d5a66, 0x7a4a34, 0x5c6b4a]), { y, c: 0 });
      }
  colT(D, x, z, w, d, 1.9);
}
export function desk(D: Deck, x: number, z: number, w: number, d: number, o: { c?: number; bare?: number } = {}): void {
  tbl(D, x, z, w, d, o.c);
  if (!o.bare) {
    bx(D, x, z, 0.5, 0.34, 0.06, 0x22262a, { y: 0.76, c: 0 });
    bx(D, x, z + 0.02, 0.44, 0.28, 0.02, [0.06, 0.12, 0.1], { y: 0.79, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]] });
  }
}
export function medbed(D: Deck, x: number, z: number): void {
  bed(D, x, z, true, 0xd4d8d4);
  bx(D, x + 0.42, z - 0.65, 0.05, 1.7, 0.05, 0xa8acae, { c: 0 });
  bx(D, x + 0.42, z - 0.65, 0.14, 0.2, 0.08, 0xc8d4d8, { y: 1.5, c: 0 });
}

/* ---- what happened here */
export function blood(D: Deck, x: number, z: number, s: number): void {
  bx(D, x, z, s, 0.01, s * rnd(0.6, 1), 0x3a0b0b, { y: 0.015, c: 0, ry: rnd(PI) });
  for (let k = 0; k < 3; k++) bx(D, x + rnd(-s, s) * 0.4, z + rnd(-s, s) * 0.4, s * rnd(0.15, 0.4), 0.01, s * rnd(0.15, 0.4), 0x450d0c, { y: 0.02, c: 0, ry: rnd(PI) });
}
export function gore(D: Deck, x: number, z: number, n: number): void {
  blood(D, x, z, 1.5);
  for (let k = 0; k < n; k++) P(D, 'ico', x + rnd(-0.3, 0.3), z + rnd(-0.3, 0.3), rnd(0.2, 0.5), rnd(0.12, 0.3), rnd(0.2, 0.5), pick([0x6e2b28, 0x4e1616, 0x8c4a44, 0xcbbfa8]), { c: 0 });
}
export function eggs(D: Deck, x: number, z: number, n: number): void {
  for (let k = 0; k < n; k++) P(D, 'ico', x + rnd(-0.3, 0.3), z + rnd(-0.3, 0.3), rnd(0.3, 0.45), rnd(0.45, 0.65), rnd(0.3, 0.45), pick([0xb9a98a, 0xa89a80, 0xc4b08e]), { c: 0 });
}
export function body(D: Deck, x: number, z: number, c: number, ns: boolean): void {
  const a = (ox: number, oz: number, sx: number, sy: number, sz: number, cc: number) => bx(D, x + (ns ? ox : oz) / T, z + (ns ? oz : ox) / T, ns ? sx : sz, sy, ns ? sz : sx, cc, { c: 0 });
  blood(D, x, z, 1.2);
  a(0, 0, 0.48, 0.2, 0.62, c); a(-0.13, 0.62, 0.17, 0.15, 0.75, 0x30333a); a(0.14, 0.58, 0.17, 0.15, 0.7, 0x30333a); a(0.36, -0.05, 0.12, 0.11, 0.6, c);
  P(D, 'ico', x + (ns ? 0 : -0.45 / T), z + (ns ? -0.45 / T : 0), 0.24, 0.22, 0.26, 0xa58a78, { c: 0 });
}
export function corpse(D: Deck, x: number, z: number, c: number, ns: boolean, o: Record<string, unknown>): void {
  body(D, x, z, c, ns);
  use(D, 'body', x, z, 0.3, o);
}

/* ---- growth: the green kind */
/** the greens of the garden */
export const GR = [0x3f6a3a, 0x4f7a40, 0x2f5a34, 0x5a7a3a, 0x6a8a44, 0x2a4a2c];
export function bush(D: Deck, x: number, z: number, s: number): void {
  for (let k = 0; k < 3; k++) P(D, 'ico', x + rnd(-0.2, 0.2) * s, z + rnd(-0.2, 0.2) * s, rnd(0.5, 1) * s, rnd(0.4, 0.9) * s, rnd(0.5, 1) * s, pick(GR), { c: 0, y: rnd(0, 0.2) });
}
export function stalk(D: Deck, x: number, z: number, h: number): void {
  P(D, 'cyl', x, z, 0.14, h, 0.14, 0x3a5a30, { c: 0, rz: rnd(-0.1, 0.1) });
  P(D, 'ico', x, z, rnd(0.5, 0.9), rnd(0.3, 0.5), rnd(0.5, 0.9), pick(GR), { c: 0, y: h - 0.1 });
  for (let k = 0; k < 3; k++) { const a = rnd(TAU); bx(D, x + (Math.cos(a) * 0.3) / T, z - (Math.sin(a) * 0.3) / T, 0.7, 0.03, 0.2, pick(GR), { c: 0, y: h * rnd(0.3, 0.8), ry: a, rz: 0.4 }); }
}
export function shroom(D: Deck, x: number, z: number, s: number, glow: boolean): void {
  P(D, 'cyl', x, z, 0.12 * s, 0.5 * s, 0.12 * s, 0xc8c0a0, { c: 0 });
  P(D, 'ico', x, z, 0.6 * s, 0.22 * s, 0.6 * s, glow ? [2.35, 2.8, 2.5] : pick([0x9a6a4a, 0x8a4a44, 0xb09060]), { c: 0, y: 0.45 * s });
}
export function moss(D: Deck, x: number, z: number, s: number): void {
  bx(D, x, z, s * rnd(0.7, 1.3), 0.02, s * rnd(0.7, 1.3), pick([0x2f4a2a, 0x3a5230, 0x44502a, 0x2a3a22, 0x4a4a22]), { y: 0.012 + rnd(0.012), c: 0, ry: rnd(PI) });
}
export function tree(D: Deck, x: number, z: number, h: number, y0: number, sick: boolean): void {
  P(D, 'cyl', x, z, 0.34, h, 0.34, 0x4a3b2c, { y: y0, c: 0 });
  for (let k = 0; k < 6; k++) { const a = rnd(TAU), L = rnd(0.9, 1.7); bx(D, x + (Math.cos(a) * L * 0.45) / T, z - (Math.sin(a) * L * 0.45) / T, L, 0.07, 0.07, 0x40332a, { y: y0 + h * 0.45 + k * h * 0.09, c: 0, ry: a, rz: 0.6 }); }
  if (sick) for (let k = 0; k < 4; k++) P(D, 'ico', x + rnd(-0.15, 0.15), z + rnd(-0.15, 0.15), rnd(0.3, 0.6), rnd(0.3, 0.5), rnd(0.3, 0.6), pick([0x8c4a44, 0x6e2b28, 0xb08572]), { y: y0 + rnd(0.3, h * 0.7), c: 0 });
}
export function overgrow(D: Deck, R: TRoom, dens: number, glow: boolean): void {
  const n = Math.round(R.w * R.h * dens);
  for (let k = 0; k < n; k++) {
    const x = R.x + rnd(0.25, R.w - 0.25), z = R.y + rnd(0.25, R.h - 0.25), t = C01();
    if (t < 0.4) moss(D, x, z, rnd(1, 2.6));
    else if (t < 0.62) bush(D, x, z, rnd(0.6, 1.3));
    else if (t < 0.75) stalk(D, x, z, rnd(1, Math.min(R.ht - 0.6, 3.4)));
    else if (t < 0.9) shroom(D, x, z, rnd(0.6, 2.2), glow && C01() < 0.3);
    else {
      const side = Math.floor(rnd(4)), lenw = rnd(0.8, 2.4), vx = side === 0 ? R.x + 0.03 : side === 1 ? R.x + R.w - 0.03 : R.x + rnd(0.7, R.w - 0.7), vz = side === 2 ? R.y + 0.03 : side === 3 ? R.y + R.h - 0.03 : R.y + rnd(0.7, R.h - 0.7);
      bx(D, vx, vz, side < 2 ? 0.06 : Math.min(lenw, 1.2), rnd(1, R.ht - 0.4), side < 2 ? Math.min(lenw, 1.2) : 0.06, pick(GR), { c: 0, y: rnd(0, 0.3) });
    }
  }
  if (glow)
    for (let k = 0; k < Math.max(1, Math.round((R.w * R.h) / 36)); k++) {
      const x = R.x + rnd(1, R.w - 1), z = R.y + rnd(1, R.h - 1);
      shroom(D, x, z, rnd(1.4, 2.4), true);
      D.lamps.push({ x: x * T, z: z * T, r: rnd(5, 8), c: [0.1, 0.4, 0.2] });
    }
}
const C01 = () => rnd(1);
/** dress a cave: n things on its own tiles, some of them glowing */
export function caveDress(D: Deck, R: TRoom, n: number, glow: boolean): void {
  for (let k = 0, tries = 0; k < n && tries < n * 20; tries++) {
    const x = R.x + rnd(R.w), z = R.y + rnd(R.h), t = Math.floor(z) * D.W + Math.floor(x);
    if (D.rm[t] !== R.id) continue;
    k++;
    const u = C01();
    if (u < 0.35) moss(D, x, z, rnd(1, 2.4));
    else if (u < 0.6) bush(D, x, z, rnd(0.6, 1.3));
    else if (u < 0.85) shroom(D, x, z, rnd(0.6, 2), glow && C01() < 0.4);
    else P(D, 'ico', x, z, rnd(0.6, 1.4), rnd(0.4, 0.9), rnd(0.6, 1.4), pick([0x5a5248, 0x4a443c, 0x6b6a64]), { c: 1 });
    if (glow && u > 0.6 && u < 0.85 && C01() < 0.25) D.lamps.push({ x: x * T, z: z * T, r: rnd(4, 7), c: [0.1, 0.36, 0.2] });
  }
}

/* ---- cargo */
const CC = [0x6a4a34, 0x3a5a6a, 0x5a5a3a, 0x6b5a3c, 0x4a4a52, 0x7a3a2a];
export function container(D: Deck, x: number, z: number, ns: boolean, n = 1): void {
  for (let k = 0; k < n; k++) {
    const c = pick(CC);
    bx(D, x, z, ns ? 2.4 : 5.4, 2.4, ns ? 5.4 : 2.4, c, { y: k * 2.4, c: k ? 0 : 1 });
    bx(D, x, z, ns ? 2.5 : 0.1, 2.2, ns ? 0.1 : 2.5, 0x2a2c2e, { y: k * 2.4 + 0.1, c: 0 });
  }
}
/** a few crates, some stacked. They can now be pushed about (engine.md §6), so they stand square. */
export function crates(D: Deck, x: number, z: number, n: number): void {
  for (let k = 0; k < n; k++) {
    const s = rnd(0.8, 1.4), ox = rnd(-0.35, 0.35), oz = rnd(-0.35, 0.35);
    bx(D, x + ox, z + oz, s, s, s, pick(CC), { loose: true });
    if (C01() < 0.4) bx(D, x + ox, z + oz, s * 0.8, s * 0.8, s * 0.8, pick(CC), { y: s, loose: true });
  }
}
export function forklift(D: Deck, x: number, z: number, ns: boolean): void {
  const a = (ox: number, oz: number, sx: number, sy: number, sz: number, c: number, y = 0, cl = false) => bx(D, x + (ns ? ox : oz) / T, z + (ns ? oz : ox) / T, ns ? sx : sz, sy, ns ? sz : sx, c, { y, c: cl ? 1 : 0 });
  a(0, 0, 1.2, 0.9, 2, 0xc9a227, 0.25, true); a(0, -0.3, 1.1, 0.08, 1.1, 0x2a2c2e, 2, false);
  for (const s of [-0.5, 0.5]) { a(s, -0.75, 0.07, 1.1, 0.07, 0x2a2c2e, 1.1); a(s, 0.2, 0.07, 1.1, 0.07, 0x2a2c2e, 1.1); a(s * 0.7, 1.15, 0.1, 2.4, 0.1, 0x2a2c2e, 0.1); a(s * 0.6, 1.7, 0.12, 0.06, 1.1, 0x8a8a84, 0.15); }
  for (const s of [-0.55, 0.55]) for (const q of [-0.65, 0.65]) P(D, 'cyl', x + (ns ? s : q) / T, z + (ns ? q : s) / T, 0.5, 0.3, 0.5, 0x15181b, { y: 0.1, c: 0, rz: ns ? PI / 2 : 0 });
}
export function column(D: Deck, x: number, z: number, h: number): void {
  P(D, 'cyl', x, z, 0.5, h - 0.14, 0.5, 0x55585c, { c: 1 });
}

/* ---- fittings that touch power */
const LIVE: [number, number, number][] = [[2.9, 2.2, 2.15], [2.25, 2.9, 2.4]];
export function panel(D: Deck, c: string, x: number, z: number, face: 'n' | 's' | 'e' | 'w'): void {
  const ew = face === 'e' || face === 'w', o = face === 'e' || face === 's' ? 0.06 : -0.06;
  bx(D, x, z, ew ? 0.14 : 0.7, 0.9, ew ? 0.7 : 0.14, 0x4a4f55, { y: 0.9, c: 0 });
  bx(D, x + (ew ? o : 0), z + (ew ? 0 : o), 0.1, 0.1, 0.1, [0.2, 0.2, 0.2], { y: 1.55, c: 0, pw: [LIVE[0], LIVE[1]], pc: c });
  use(D, 'panel', x + (ew ? o * 3 : 0), z + (ew ? 0 : o * 3), 1.3, { c });
}
export function genset(D: Deck, c: string, x: number, z: number, ix: number, iz: number): void {
  bx(D, x, z, 1.4, 1.1, 0.8, 0x44525a);
  bx(D, x, z, 1.1, 0.3, 0.6, 0x36424a, { y: 1.1, c: 0 });
  P(D, 'cyl', x + 0.25, z, 0.16, 0.7, 0.16, 0x2c3338, { y: 1.4, c: 0 });
  bx(D, x, z + (0.42 * (iz > z ? 1 : -1)) / T, 0.12, 0.12, 0.06, [0.2, 0.2, 0.2], { y: 0.8, c: 0, pw: [LIVE[0], LIVE[1]], pc: c });
  use(D, 'backup', ix, iz, 1, { c });
}
/** the main lift: a 2 by 2 tile car behind a heavy door, its panel, and the mark where you arrive */
export function liftRoom(D: Deck, x: number, y: number, dx: number, dy: number): void {
  room(D, 'Main lift', x, y, 2, 2, { fl: 0x44474a, wl: 0x54585a, st: 0xb89b2e, c: 'LIFT', noroam: 1, safe: 1 });
  door(D, dx, dy, { kind: 'heavy', c: 'LIFT', sg: [['Lift', dy < y ? 'n' : dy > y + 1 ? 's' : dx < x ? 'w' : 'e']] });
  const px = dy < y ? x + 1 : dy > y + 1 ? x + 1 : dx < x ? x + 1.94 : x + 0.06, pz = dy < y ? y + 1.94 : dy > y + 1 ? y + 0.06 : y + 1;
  bx(D, px, pz, dy < y || dy > y + 1 ? 0.5 : 0.08, 0.4, dy < y || dy > y + 1 ? 0.08 : 0.5, 0x2c2f33, { y: 1.1, c: 0 });
  use(D, 'lift', x + 1, y + 1, 1.3);
  D.marks.lift = [x + 1, y + 1, 0];
}

