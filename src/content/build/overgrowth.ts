import { PI, TAU, clamp } from '../../core/math';
import { Rng } from '../../core/rng';
import { ICO } from '../types';
import { lid } from './builder';
import { P, roomAt, type Dir, type Floor, type PRoom } from './plan';

/* The bush's growth (world.md §2, The Security flesh; §10, Pia's young gods): what a place it has colonised is grown
   over with. Wild tobacco, Nicotiana rustica, as it comes out of the changed: broad leaf in shelves out of woody knots,
   stacked the way a bracket fungus stacks; stalks of it risen out of the floor and flowering; runners it spreads by,
   along the floor, up the walls, and over the ceilings after the air its spores came on. Green in the new growth,
   going to the curing barn's yellow and on to the brown of cured leaf as it ages; rustica's pale yellow flowers where
   it is oldest.

   The pieces (a leaf, a knot, a shelf, a stalk, a runner), what they make (a plant, a wall climbed, a ceiling hung, a
   desk grown over, the mound where it took), and colonise(), which grows a room over from a heart, thinning out to a
   front of runners and seedlings. Plan metres; y is over the floor. Dressing only: none of it is solid, so it never
   shuts a way. Each piece draws its small differences from a seed of its own, by where it is, so growing a place over
   changes nothing else the level draws from its seed, and the same call grows the same thing every time. */

/* ---- the palette */
/** leaf in its prime, green going yellow: the changed's own (render/castKit.ts takes it from here) */
export const LEAF = [0x4b5c2a, 0x5a6630, 0x6e6a2c, 0x7e7430];
/** new growth: a deeper, cleaner green, at the tips and the front */
export const YOUNG = [0x3e5a26, 0x46642a, 0x527030];
/** leaf curing as it ages, the lowest on a stalk first: the barn's yellow, gold, and the brown of cured tobacco */
export const CURED = [0x9a8a3a, 0x8e7432, 0x7e5e2a, 0x6a4a24];
/** the wood it is grown on: the runners it spreads by, the stems up the walls */
export const WOOD = [0x4a3a2a, 0x54422e, 0x3e3024];
/** where it comes out of something: a woody knot (the changed's too) */
export const KNOT = 0x4e4028;
/** a stalk of it, green, and going woody at the foot of an old one */
export const STEM = [0x5a6434, 0x56582e];
/** its flowers' mouths, and their tubes; and the seed capsules after them, ripening brown */
export const BLOOM = [0xd8cc62, 0xe2d46c, 0xcabc54];
const TUBE = 0xb4b056, POD = [0x7a6230, 0x5e4a26];

/** the bush's numbers: metres where they are sizes */
export const GROW = {
  /** a leaf's thickness, of its length: a slab, as the changed's are, so it reads across a room */
  thick: 0.06,
  /** and the least it is, held up off the floor (m): anything thinner and tipped, within 10 cm of a floor, is taken for a
   *  patch laid on it (test/placement.ts), which a leaf on a stalk or a runner is not */
  least: 0.026,
  /** a leaf's breadth, of its length: rustica's are broad and round-ended */
  wide: 0.62,
  /** each leaf up a stalk turned this far round from the last (the golden angle), so none sits over the one under it */
  turn: 2.4,
  /** how a colony thins from its heart (1) to its front (0, at its reach): its strength to this power */
  fall: 1.6,
  /** leaves to a square metre of floor where a colony is at its strongest */
  mat: 16,
  /** how far a stem, a runner or a leaf pressed to a wall or a ceiling stands off it: clear of it, and held by it */
  off: 0.004,
  /** kept clear of growth (m): a doorway's middle by what stands or climbs, anything lying about to pick up or read by
   *  what lies on the floor, a wall's fittings (a panel, a call point, a camera) by what climbs */
  door: 1.4, keep: 0.6, fitting: 0.9,
  /** the lowest anything hangs from a ceiling (m over the floor): clear of a head */
  head: 2.05,
};

type V3 = readonly [number, number, number];
/** which way each face of a wall looks out into the room, as a yaw (the cast's: 0 south, a quarter turn east) */
const FACE: Record<Dir, number> = { s: 0, e: PI / 2, n: PI, w: -PI / 2 };

/** what a piece of growth draws its small differences from */
export interface Grow { rnd(a: number, b?: number): number; pick<X>(a: readonly X[]): X }
/** a seed of its own, by what and where it is */
export function grower(...at: (number | string)[]): Grow {
  const r = new Rng('growth:' + at.map(v => (typeof v === 'number' ? v.toFixed(2) : v)).join(','));
  return { rnd: (a, b) => r.range(a, b), pick: a => r.pick(a) };
}
/** the colour of leaf this far on (0 new, 1 cured brown) */
export function tone(s: number, g: Grow): number {
  return g.pick(s < 0.25 ? YOUNG : s < 0.6 ? LEAF : s < 0.82 ? CURED.slice(0, 2) : CURED.slice(2));
}

/* ---- the pieces */
/** a stem, a stalk, a tendril: a cylinder d thick from a to b, run on `over` past each end (so two meeting at a bend
 *  show no notch) */
export function rod(F: Floor, a: V3, b: V3, d: number, c: number, over = 0): void {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz);
  if (L < 1e-3) return;
  const rz = Math.acos(clamp(dy / L, -1, 1)), ry = Math.atan2(dz, -dx), len = L + 2 * over;
  P(F, 'cyl', (a[0] + b[0]) / 2, (a[2] + b[2]) / 2, d, len, d, c, { y: (a[1] + b[1]) / 2 - len / 2, rz, ry, c: 0 });
}
/** a lump, its middle at (x, y, z): an icosahedron is drawn standing on its lowest corner, so it is put down by that */
function lump(F: Floor, x: number, y: number, z: number, sx: number, sy: number, sz: number, c: number, ry = 0): void {
  P(F, 'ico', x, z, sx, sy, sz, c, { y: y - (sy * ICO) / 2, ry, c: 0 });
}
/** a leaf out from where it grows (x, y, z): `len` long toward yaw, `wide` across, its tip let down `droop` (radians;
 *  less than none lifts it). A lump flattened to a slab, its midrib a ridge along the top */
export function leaf(F: Floor, x: number, y: number, z: number, yaw: number, len: number, wide: number, droop: number, c: number): void {
  const t = Math.max(GROW.least, GROW.thick * len), h = (len / 2) * Math.cos(droop), cy = y - (len / 2) * Math.sin(droop);
  P(F, 'ico', x + Math.sin(yaw) * h, z + Math.cos(yaw) * h, len / ICO, t / ICO, wide / ICO, c, { y: cy - t / 2, rz: -droop, ry: yaw - PI / 2, c: 0 });
}
/** a leaf pressed flat to a wall that faces `yaw`, from where it grows on it (x, y, z, on the wall's face): `len` long,
 *  turned `tilt` from straight up toward the wall's right as you face it (less than none, its left) */
export function pressed(F: Floor, x: number, y: number, z: number, yaw: number, len: number, wide: number, tilt: number, c: number): void {
  const t = GROW.thick * len, nx = Math.sin(yaw), nz = Math.cos(yaw), ux = Math.cos(yaw), uz = -Math.sin(yaw), o = t / 2 + GROW.off;
  const s = (Math.sin(tilt) * len) / 2;
  P(F, 'ico', x + nx * o + ux * s, z + nz * o + uz * s, wide / ICO, len / ICO, t / ICO, c, { y: y + (Math.cos(tilt) * len) / 2 - len / 2, rz: -tilt, ry: yaw, c: 0 });
}
/** a knot, s across, its middle at (x, y, z): where the bush comes out of what it grows from */
export function knot(F: Floor, x: number, y: number, z: number, s: number, g: Grow): void {
  lump(F, x, y, z, s, s * g.rnd(0.7, 0.95), s * g.rnd(0.8, 1), g.rnd(1) < 0.6 ? KNOT : g.pick(WOOD), g.rnd(PI));
}
/** a shelf of leaf out along yaw, the way a bracket fungus stacks out of a stump: from a knot whose foot is at (x, y,
 *  z), tiers climbing `rise` a tier (and leaning `lean` out as they climb), each one broad, flat slab of leaf, the
 *  lowest the widest. As it comes out of the changed (render/castKit.ts, shelf), at whatever size the place gives it */
export function bracket(F: Floor, x: number, y: number, z: number, yaw: number, tiers: number, len: number, g: Grow,
  o: { rise?: number; lean?: number; age?: number } = {}): void {
  const rise = o.rise ?? len * 0.3, lean = o.lean ?? 0, age = o.age ?? 0.4, sx = Math.sin(yaw), sz = Math.cos(yaw);
  lump(F, x, y + (rise * (tiers - 1)) / 2, z, len * 0.45, rise * (tiers - 0.4), len * 0.4, KNOT, yaw);
  for (let j = 0; j < tiers; j++) {
    const k = 1 - j * (0.45 / tiers), a = yaw + g.rnd(-0.2, 0.2), out = len * 0.42 * k, cx = x + sx * lean * j + Math.sin(a) * out, cz = z + sz * lean * j + Math.cos(a) * out;
    /* the slab: as deep out as the changed's, as broad across, a tenth of its length thick; its outer edge let down a little */
    const deep = len * 0.75 * k, t = Math.max(GROW.least / ICO, len * 0.1);
    P(F, 'ico', cx, cz, deep, t, len * 1.3 * k, tone(age + (tiers - j) * 0.08 + g.rnd(-0.2, 0.2), g), { y: y + j * rise - (t * ICO) / 2, rz: -g.rnd(0.02, 0.12), ry: a - PI / 2, c: 0 });
  }
}
/** a head of flowers at (x, y, z): n of them on short stalks thrown out round yaw (within `spread` either way of it)
 *  and up, each a pale yellow tube with a flared mouth; some gone over to seed capsules (`pods`, a share) on an old one */
export function bloom(F: Floor, x: number, y: number, z: number, n: number, s: number, g: Grow,
  o: { yaw?: number; spread?: number; pods?: number } = {}): void {
  const yaw = o.yaw ?? 0, spread = o.spread ?? PI;
  for (let k = 0; k < n; k++) {
    const a = yaw + g.rnd(-spread, spread), e = g.rnd(0.45, 1.25), L = g.rnd(0.06, 0.15) * s;
    const end: V3 = [x + Math.sin(a) * Math.cos(e) * L, y + Math.sin(e) * L, z + Math.cos(a) * Math.cos(e) * L];
    rod(F, [x, y, z], end, 0.014 * s, STEM[0]);
    if (g.rnd(1) < (o.pods ?? 0)) { lump(F, end[0], end[1], end[2], 0.04 * s, 0.05 * s, 0.04 * s, g.pick(POD)); continue; }
    /* the tube out along its stalk, nodding a little, and its mouth across the end of it */
    const e2 = e - g.rnd(0.1, 0.5), T = 0.08 * s, dir: V3 = [Math.sin(a) * Math.cos(e2), Math.sin(e2), Math.cos(a) * Math.cos(e2)];
    const mouth: V3 = [end[0] + dir[0] * T, end[1] + dir[1] * T, end[2] + dir[2] * T];
    rod(F, end, mouth, 0.03 * s, TUBE);
    const w = 0.075 * s, t = Math.max(GROW.least, 0.022 * s);
    P(F, 'ico', mouth[0], mouth[2], w / ICO, t / ICO, w / ICO, g.pick(BLOOM), { y: mouth[1] - t / 2, rz: Math.acos(clamp(dir[1], -1, 1)), ry: Math.atan2(dir[2], -dir[0]), c: 0 });
  }
}

/* ---- what they make */
/** a stalk of it risen out of the floor at (x, z), h tall: leaves up it, turned each from the last, the lowest the
 *  largest and hanging heaviest, and the first to cure (`age`, 0 to 1, how far on it is); with `bloom`, a head of flowers
 *  at the top, and on an old one seed setting among them */
export function tobacco(F: Floor, x: number, z: number, h: number, o: { age?: number; bloom?: boolean; y?: number; g?: Grow } = {}): void {
  const g = o.g ?? grower('tobacco', x, z), age = o.age ?? 0.3, y0 = o.y ?? 0, d = 0.03 + 0.025 * h;
  /* the stalk, in three, leaning a little toward its top */
  const lean = g.rnd(TAU), tip = g.rnd(0.02, 0.09) * h, pts: V3[] = [[x, y0 - 0.02, z]];
  for (const f of [0.4, 0.75, 1]) pts.push([x + Math.sin(lean) * tip * f * f + g.rnd(-0.015, 0.015), y0 + h * f, z + Math.cos(lean) * tip * f * f + g.rnd(-0.015, 0.015)]);
  for (let k = 0; k < 3; k++) rod(F, pts[k], pts[k + 1], d * (1 - 0.22 * k), k ? STEM[0] : age > 0.6 ? WOOD[1] : STEM[1], d * 0.3);
  const on = (y: number): V3 => {
    let k = 0;
    while (k < 2 && pts[k + 1][1] < y) k++;
    const [a, b] = [pts[k], pts[k + 1]], f = clamp((y - a[1]) / (b[1] - a[1]), 0, 1);
    return [a[0] + (b[0] - a[0]) * f, y, a[2] + (b[2] - a[2]) * f];
  };
  const n = Math.round(4 + 3 * h);
  let a = g.rnd(TAU);
  for (let j = 0; j < n; j++) {
    const t = (j + 0.5) / n, y = y0 + h * (0.1 + 0.72 * t), len = (0.22 + 0.3 * h) * (1.1 - 0.6 * t) * g.rnd(0.85, 1.1);
    /* heaviest at the foot; never so far its tip is on the floor */
    const droop = Math.min((0.15 + 0.6 * (1 - t)) * g.rnd(0.7, 1.2), Math.asin(clamp((y - y0 - 0.03) / len, 0, 1)));
    a += GROW.turn + g.rnd(-0.2, 0.2);
    const [sx, , sz] = on(y), r = d * 0.3;
    leaf(F, sx + Math.sin(a) * r, y, sz + Math.cos(a) * r, a, len, len * GROW.wide, droop, tone(age * 0.7 + (1 - t) * (0.25 + 0.6 * age) + g.rnd(-0.15, 0.15), g));
  }
  if (o.bloom) {
    const [tx, ty, tz] = pts[3];
    bloom(F, tx, ty - 0.01, tz, Math.round(5 + 4 * h * g.rnd(0.6, 1)), 0.8 + 0.4 * h, g, { pods: age > 0.6 ? 0.4 : age > 0.4 ? 0.15 : 0 });
  }
}

/** leaf fallen and grown over the floor, about (x, z) out to r: n leaves (enough for the bush at its strongest unless
 *  it says), thicker toward the middle, each a hair over or under the next so none lies in another's plane; `dry`, how
 *  much of it has cured (0 to 1); `size` makes its leaves larger or smaller; `inside`, where it may lie */
export function litter(F: Floor, x: number, z: number, r: number,
  o: { n?: number; dry?: number; size?: number; y?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('litter', x, z), n = o.n ?? Math.round(PI * r * r * GROW.mat), dry = o.dry ?? 0.3, size = o.size ?? 1, y = o.y ?? 0;
  for (let k = 0; k < n; k++) {
    const a = g.rnd(TAU), q = r * g.rnd(1) ** 0.7, px = x + Math.sin(a) * q, pz = z + Math.cos(a) * q;
    if (o.inside && !o.inside(px, pz)) continue;
    flat(F, px, pz, y, g.rnd(0.26, 0.6) * size, tone(dry + g.rnd(-0.35, 0.45), g), g);
  }
}
/** one leaf lying on the floor (or on whatever is y under it): within a centimetre and a half of it, tipped a hair */
function flat(F: Floor, x: number, z: number, y: number, len: number, c: number, g: Grow): void {
  const t = Math.min(0.025, GROW.thick * len);
  P(F, 'ico', x, z, len / ICO, t / ICO, (len * g.rnd(0.5, 0.7)) / ICO, c, { y: y + g.rnd(0.001, 0.011), ry: g.rnd(TAU), rz: g.rnd(-0.05, 0.05), c: 0 });
}

/** a runner it spreads by, over the floor (or whatever is y under it) through the points given: thick at its first and
 *  tapering to its last, half sunk, a knuckle at each bend so it reads as one thing grown, not sticks laid end to end.
 *  `leaf`: the share of its knuckles that put up a pair of leaves; `tip`: a seedling where it ends, the front's new
 *  growth */
export function runner(F: Floor, pts: readonly (readonly [number, number])[], d0: number, d1: number,
  o: { y?: number; leaf?: number; tip?: boolean; age?: number; g?: Grow } = {}): void {
  const y = o.y ?? 0;
  for (let k = 0; k + 1 < pts.length; k++) {
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1], dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz);
    const d = d0 + (d1 - d0) * (k / Math.max(1, pts.length - 2)), c = WOOD[k % 3];
    P(F, 'cyl', (ax + bx) / 2, (az + bz) / 2, d, len + d * 0.5, d, c, { c: 0, y: y + d * 0.25 - (len + d * 0.5) / 2, rz: PI / 2, ry: -Math.atan2(dz, dx) });
    if (k) P(F, 'ico', ax, az, d * 1.5, d * 0.8, d * 1.5, c, { c: 0, y });
  }
  if (!o.leaf && !o.tip) return;
  const g = o.g ?? grower('runner', pts[0][0], pts[0][1]), age = o.age ?? 0.3;
  for (let k = 1; k + 1 < pts.length; k++) {
    if (g.rnd(1) >= (o.leaf ?? 0)) continue;
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1], way = Math.atan2(bx - ax, bz - az), d = d0 + (d1 - d0) * (k / Math.max(1, pts.length - 2));
    for (const s of [-1, 1]) leaf(F, ax, y + d * 0.5, az, way + s * g.rnd(0.9, 1.6), g.rnd(0.14, 0.28), g.rnd(0.1, 0.17), -g.rnd(0.2, 0.6), tone(age + g.rnd(-0.25, 0.25), g));
  }
  if (o.tip) {
    const [ex, ez] = pts[pts.length - 1];
    tobacco(F, ex, ez, g.rnd(0.2, 0.34), { y, age: 0, g });
  }
}

/** growth up a wall from its foot at (x, z) on the wall's face, which looks out `face`: a woody stem wandering up it to
 *  h, a branch or two off it, leaf pressed flat along them, shelves out of their knots; `w` about how wide it spreads,
 *  `age` how far on, `bloom` flowering at its top; `span`, how far the wall runs from its foot to its right and left as
 *  you face it (its stems keep to it) */
export function climb(F: Floor, x: number, z: number, face: Dir, h: number,
  o: { w?: number; age?: number; bloom?: boolean; span?: [number, number]; g?: Grow } = {}): void {
  const g = o.g ?? grower('climb', x, z), yaw = FACE[face], nx = Math.sin(yaw), nz = Math.cos(yaw), ux = Math.cos(yaw), uz = -Math.sin(yaw);
  const w = o.w ?? h * 0.5, age = o.age ?? 0.4, [right, left] = o.span ?? [Infinity, Infinity];
  /* a point on the wall, u along it and y up it, r off it */
  const at = (u: number, y: number, r: number): V3 => [x + ux * u + nx * (r + GROW.off), y, z + uz * u + nz * (r + GROW.off)];
  /** a stem from (u0, y0) up to y1, leaning `lean` along the wall a metre up, d0 thick tapering to d1: its nodes */
  const stem = (u0: number, y0: number, y1: number, lean: number, d0: number, d1: number) => {
    const n = Math.max(2, Math.round((y1 - y0) / 0.45)), nodes: [number, number, number][] = [[u0, y0, d0]];
    let side = g.rnd(1) < 0.5 ? 1 : -1;
    for (let k = 1; k <= n; k++) nodes.push([clamp(nodes[k - 1][0] + (lean * (y1 - y0)) / n + g.rnd(-0.06, 0.06) * w, 0.2 - left, right - 0.2), y0 + ((y1 - y0) * k) / n, d0 + ((d1 - d0) * k) / n]);
    for (let k = 0; k < n; k++) {
      const [ua, ya, da] = nodes[k], [ub, yb] = nodes[k + 1];
      rod(F, at(ua, ya, da / 2), at(ub, yb, da / 2), da, WOOD[k % 3], da * 0.3);
      /* leaf pressed along it, from either side by turns */
      for (const f of [0.35, 0.85]) {
        const len = g.rnd(0.16, 0.34) * (1.1 - 0.4 * (yb / h));
        pressed(F, ...at(ua + (ub - ua) * f, ya + (yb - ya) * f, 0), yaw, len, len * GROW.wide, (side = -side) * g.rnd(0.5, 1.2), tone(age + 0.3 * (1 - ya / h) + g.rnd(-0.2, 0.2), g));
      }
    }
    return nodes;
  };
  knot(F, ...at(0, 0.05, 0.05), 0.14 + 0.06 * h, g);
  const main = stem(0, 0, h, g.rnd(-0.15, 0.15), 0.05 + 0.025 * h, 0.018);
  for (let b = 0, nb = clamp(Math.round(w * 2 * g.rnd(0.5, 1)), 1, 4); b < nb; b++) {
    const [u, y, d] = main[1 + Math.floor(g.rnd(main.length - 2))], top = Math.min(h, y + g.rnd(0.3, 0.6) * h);
    if (top - y > 0.3) stem(u, y, top, (b % 2 ? 1 : -1) * g.rnd(0.4, 0.9), d * 0.7, 0.015);
  }
  /* shelves out of its knots, more and larger toward its foot */
  for (let k = 1; k < main.length - 1; k++)
    if (g.rnd(1) < 0.55 - (0.3 * k) / main.length) {
      const [u, y] = main[k], len = g.rnd(0.22, 0.42) * (1.2 - (0.5 * y) / h);
      bracket(F, ...at(u, y, 0.04), yaw + g.rnd(-0.35, 0.35), 2 + Math.floor(g.rnd(3)), len, g, { age });
    }
  if (o.bloom) {
    const [u, y] = main[main.length - 1];
    bloom(F, ...at(u, y, 0.03), Math.round(g.rnd(5, 9)), 1.2, g, { yaw, spread: 1.2, pods: age > 0.6 ? 0.3 : 0 });
  }
}

/** growth hung from a ceiling `top` over the floor at (x, z), as leaf is hung in a barn to cure: a knot against the
 *  ceiling, runners away over it, and n strands down from it hung with leaf, mostly yellow and brown; none lower than a
 *  head (GROW.head) */
export function hang(F: Floor, x: number, z: number, top: number, o: { n?: number; age?: number; g?: Grow } = {}): void {
  const g = o.g ?? grower('hang', x, z), n = o.n ?? 5, age = o.age ?? 0.7, s = g.rnd(0.28, 0.42), ks = s * 0.6;
  P(F, 'ico', x, z, s, ks, s * g.rnd(0.8, 1), KNOT, { y: top - ks * ICO, ry: g.rnd(PI), c: 0 });
  for (let k = 0, m = 2 + Math.floor(g.rnd(3)); k < m; k++) {
    const a = g.rnd(TAU), len = g.rnd(0.6, 1.6), d = g.rnd(0.035, 0.05), y = top - d / 2 - GROW.off, ex = x + Math.sin(a) * len, ez = z + Math.cos(a) * len;
    rod(F, [x, y, z], [ex, y, ez], d, g.pick(WOOD));
    for (const f of [0.45, 0.8]) if (g.rnd(1) < 0.7) leaf(F, x + (ex - x) * f, y - d / 2, z + (ez - z) * f, g.rnd(TAU), g.rnd(0.18, 0.3), g.rnd(0.11, 0.18), g.rnd(1.2, 1.45), tone(age + g.rnd(-0.3, 0.2), g));
  }
  for (let k = 0; k < n; k++) {
    const a = g.rnd(TAU), q = g.rnd(0.05, s * 0.45), px = x + Math.sin(a) * q, pz = z + Math.cos(a) * q;
    const lv = g.rnd(0.24, 0.44), len = Math.max(0.15, Math.min(g.rnd(0.4, 1.3), top - GROW.head - lv)), bx = px + g.rnd(-0.05, 0.05), bz = pz + g.rnd(-0.05, 0.05);
    rod(F, [px, top, pz], [bx, top - len, bz], g.rnd(0.016, 0.026), STEM[1]);
    for (let j = 0, m = 2 + Math.floor(len * 3); j < m; j++) {
      const f = 0.3 + (0.7 * (j + 1)) / m;
      leaf(F, px + (bx - px) * f, top - len * f, pz + (bz - pz) * f, g.rnd(TAU), lv * g.rnd(0.7, 1), lv * 0.5, g.rnd(1.15, 1.45), tone(age + g.rnd(-0.3, 0.3), g));
    }
  }
}

/** growth over something standing w by d, its top h up, its middle at (x, z) (a desk, a chair, a cabinet): leaf over
 *  its top and spilling off its edges, stems up its corners, shelves out of its sides. `cover` how much of it (0 to 1) */
export function engulf(F: Floor, x: number, z: number, w: number, d: number, h: number, o: { cover?: number; age?: number; g?: Grow } = {}): void {
  const g = o.g ?? grower('engulf', x, z), cover = o.cover ?? 0.7, age = o.age ?? 0.45;
  for (let k = 0, n = Math.round(w * d * 14 * cover); k < n; k++)
    flat(F, x + g.rnd(-0.5, 0.5) * (w - 0.12), z + g.rnd(-0.5, 0.5) * (d - 0.12), h, g.rnd(0.22, 0.42), tone(age + g.rnd(-0.3, 0.35), g), g);
  /* off its edges, hanging */
  for (let k = 0, n = Math.round((w + d) * 3 * cover); k < n; k++) {
    const side = Math.floor(g.rnd(4)), u = g.rnd(-0.45, 0.45), yaw = FACE[(['s', 'n', 'e', 'w'] as const)[side]];
    const ex = side < 2 ? x + u * w : x + (side === 2 ? 1 : -1) * (w / 2 - 0.02), ez = side < 2 ? z + (side === 0 ? 1 : -1) * (d / 2 - 0.02) : z + u * d;
    leaf(F, ex, h + 0.01, ez, yaw + g.rnd(-0.4, 0.4), g.rnd(0.24, 0.4), g.rnd(0.15, 0.24), g.rnd(0.7, 1.3), tone(age + g.rnd(-0.2, 0.3), g));
  }
  /* up its corners, a hair outside them */
  for (const [cx, cz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    if (g.rnd(1) > cover) continue;
    const r = 0.022, px = x + cx * (w / 2 + r + GROW.off), pz = z + cz * (d / 2 + r + GROW.off);
    rod(F, [px, -0.02, pz], [px, h + 0.01, pz], r * 2, g.pick(WOOD));
    for (const y of [h * 0.3, h * 0.65]) leaf(F, px, y, pz, Math.atan2(cx, cz) + g.rnd(-0.6, 0.6), g.rnd(0.16, 0.26), g.rnd(0.1, 0.15), -g.rnd(0.1, 0.5), tone(age + g.rnd(-0.3, 0.2), g));
  }
  /* a shelf or two out from under its top's edge, its knot against the underside (a table's sides are open air) */
  for (let k = 0; k < 1 + Math.round(cover); k++) {
    const side = Math.floor(g.rnd(4)), u = g.rnd(-0.3, 0.3), yaw = FACE[(['s', 'n', 'e', 'w'] as const)[side]];
    const ex = side < 2 ? x + u * w : x + (side === 2 ? 1 : -1) * (w / 2), ez = side < 2 ? z + (side === 0 ? 1 : -1) * (d / 2) : z + u * d;
    const tiers = 2 + Math.floor(g.rnd(2)), len = g.rnd(0.2, 0.32), rise = len * 0.3;
    bracket(F, ex, h + 0.005 - (rise * (tiers - 0.4) * ICO) / 2 - (rise * (tiers - 1)) / 2, ez, yaw + g.rnd(-0.3, 0.3), tiers, len, g, { age, rise });
  }
}

/** where it took: a mound of knots grown into each other, s across, shelves stacked out of it all round (or round yaw,
 *  within `spread` either way, against a wall), stalks up out of it, and it in flower */
export function crown(F: Floor, x: number, z: number, s: number, o: { yaw?: number; spread?: number; age?: number; bloom?: boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('crown', x, z), yaw = o.yaw ?? 0, spread = o.spread ?? PI, age = o.age ?? 0.55;
  for (let k = 0, n = 3 + Math.floor(g.rnd(3)); k < n; k++) {
    const a = yaw + g.rnd(-spread, spread), q = k ? g.rnd(0.15, 0.4) * s : 0, sz = (k ? g.rnd(0.45, 0.75) : 1) * s;
    P(F, 'ico', x + Math.sin(a) * q, z + Math.cos(a) * q, sz, sz * g.rnd(0.55, 0.85), sz * g.rnd(0.8, 1), k % 2 ? g.pick(WOOD) : KNOT, { ry: g.rnd(PI), y: -0.03, c: 0 });
  }
  for (let k = 0, n = 5 + Math.floor(g.rnd(4)); k < n; k++) {
    const a = yaw + g.rnd(-spread, spread), q = s * 0.3;
    bracket(F, x + Math.sin(a) * q, s * g.rnd(0.08, 0.55), z + Math.cos(a) * q, a, 2 + Math.floor(g.rnd(3)), s * g.rnd(0.35, 0.6), g, { age });
  }
  for (let k = 0, n = 1 + Math.floor(g.rnd(3)); k < n; k++) {
    const a = yaw + g.rnd(-spread, spread) * 0.6, q = g.rnd(0.05, 0.2) * s;
    tobacco(F, x + Math.sin(a) * q, z + Math.cos(a) * q, s * g.rnd(1.3, 2.1), { y: s * 0.35, age, bloom: o.bloom ?? true, g });
  }
}

/* ---- a place grown over */
/** the ceiling fittings the builder will hang in a room (builder.ts, finish): growth hung from a ceiling keeps off them */
function fittings(R: PRoom): [number, number][] {
  if (R.nolamp || R.poly) return [];
  const w = R.x1 - R.x0, d = R.z1 - R.z0, at: [number, number][] = [];
  for (let z = R.z0 + Math.min(3, d / 2); z < R.z1; z += 6) for (let x = R.x0 + Math.min(3, w / 2); x < R.x1; x += 6) at.push([x, z]);
  return at;
}
/** is anything already standing in the box x0..x1, z0..z1 between heights y0 and y1 over the floor (props laid before
 *  index `before`: the room's furniture and fittings, not the growth now going in) */
function taken(F: Floor, x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, before: number): boolean {
  for (let k = 0; k < before; k++) {
    const p = F.props[k], r = (p.rz ? Math.max(p.sx, p.sy, p.sz) : Math.max(p.sx, p.sz)) / 2, lo = p.rz ? p.y - r : p.y, hi = p.y + p.sy + (p.rz ? r : 0);
    if (p.x + r > x0 && p.x - r < x1 && p.z + r > z0 && p.z - r < z1 && hi > y0 && lo < y1) return true;
  }
  return false;
}

/** room R grown over from a heart at (hx, hz), out to `reach`: leaf thick over the floor at the heart, thinning out; stalks
 *  of it up out of the floor, flowering nearer the heart; runners out from it toward its front, seedlings where they end;
 *  stems up the walls, and shelves out of them low on the walls further out; at the heart, the mound where it took and
 *  leaf hung from the ceiling over it. The heart may be in another room: R then has only as much of it as reaches, and
 *  its runners come in from the side nearest the heart. Lay it once the room, the rooms round it, their doors and the
 *  room's furniture are laid out: it keeps off doorways, what is to be picked up or read, the walls' fittings, the
 *  furniture, and the ceiling's lights. `dens` thickens or thins it all; `bloom`, the share of stalks in flower near the
 *  heart; `dry`, how much of the leaf has cured; `crown` and `hang`, whether the heart has its mound and its hung leaf */
export function colonise(F: Floor, R: PRoom, hx: number, hz: number, reach: number,
  o: { dens?: number; bloom?: number; dry?: number; crown?: boolean; hang?: boolean; seed?: string } = {}): void {
  const g = grower('colonise', o.seed ?? R.name, hx, hz), dens = o.dens ?? 1, bloomy = o.bloom ?? 0.5, dry = o.dry ?? 0.35, before = F.props.length;
  const strength = (x: number, z: number) => clamp(1 - Math.hypot(x - hx, z - hz) / reach, 0, 1) ** GROW.fall;
  const inside = (x: number, z: number, m: number) => x >= R.x0 + m && x <= R.x1 - m && z >= R.z0 + m && z <= R.z1 - m && roomAt(F, x, z)?.name === R.name;
  const near = (x: number, z: number, r: number, list: readonly { x: number; z: number }[]) => list.some(t => Math.hypot(t.x - x, t.z - z) < r);
  const lying = [...F.items, ...F.notes].filter(t => t.y < 0.4), door = F.doors;
  const x0 = Math.max(R.x0, hx - reach), x1 = Math.min(R.x1, hx + reach), z0 = Math.max(R.z0, hz - reach), z1 = Math.min(R.z1, hz + reach);
  if (x0 >= x1 || z0 >= z1) return;
  /* the heart is in this room; and its ceiling, as the world carves it (on its grid), over its floor */
  const home = inside(hx, hz, 0), top = lid(F.y0 + R.dy + R.ht) - (F.y0 + R.dy);

  /* the floor: a jittered lattice, each cell's share of the leaf by its strength */
  const C = 0.45;
  for (let z = z0 + C / 2; z < z1; z += C)
    for (let x = x0 + C / 2; x < x1; x += C) {
      const px = x + g.rnd(-0.4, 0.4) * C, pz = z + g.rnd(-0.4, 0.4) * C, s = strength(px, pz), m = s * dens * GROW.mat * C * C;
      if (s <= 0 || !inside(px, pz, 0.12) || near(px, pz, GROW.keep, lying)) continue;
      for (let k = 0, n = Math.floor(m) + (g.rnd(1) < m % 1 ? 1 : 0); k < n; k++)
        flat(F, px + g.rnd(-0.5, 0.5) * C, pz + g.rnd(-0.5, 0.5) * C, 0, g.rnd(0.28, 0.55) * (0.8 + 0.6 * s), tone(g.rnd(1) * (0.25 + dry * 1.6 * s) + (g.rnd(1) < dry * s ? 0.5 : 0), g), g);
    }
  /* stalks up out of it */
  const P2 = 1.1;
  for (let z = z0 + P2 / 2; z < z1; z += P2)
    for (let x = x0 + P2 / 2; x < x1; x += P2) {
      const px = x + g.rnd(-0.4, 0.4) * P2, pz = z + g.rnd(-0.4, 0.4) * P2, s = strength(px, pz);
      if (g.rnd(1) >= s ** 1.3 * dens * 0.75 || Math.hypot(px - hx, pz - hz) < 0.9 || !inside(px, pz, 0.5) || near(px, pz, GROW.door, door) || near(px, pz, GROW.keep, lying)) continue;
      if (taken(F, px - 0.4, pz - 0.4, px + 0.4, pz + 0.4, 0, 2, before)) continue;
      tobacco(F, px, pz, Math.min(top - 0.4, (0.35 + 1.5 * s) * g.rnd(0.7, 1.1)), { age: dry * (0.4 + s), bloom: s > 0.4 && g.rnd(1) < bloomy, g: grower('tobacco', px, pz) });
    }
  /* runners: out from the heart, or in from the side nearest it */
  const start: [number, number] = home ? [hx, hz] : [clamp(hx, R.x0 + 0.3, R.x1 - 0.3), clamp(hz, R.z0 + 0.3, R.z1 - 0.3)];
  const away = Math.atan2(start[0] - hx, start[1] - hz);
  for (let k = 0, n = Math.round((home ? 2 + reach / 1.5 : 1 + reach / 3) * dens); k < n; k++) {
    let a = home ? g.rnd(TAU) : away + g.rnd(-0.9, 0.9), [x, z] = start;
    const pts: [number, number][] = [[x, z]], far = g.rnd(0.6, 1.05) * reach;
    for (let L = 0; L < far;) {
      const step = g.rnd(0.45, 0.8);
      a += g.rnd(-0.5, 0.5);
      const nx = x + Math.sin(a) * step, nz = z + Math.cos(a) * step;
      if (!inside(nx, nz, 0.2) || near(nx, nz, 0.5, lying)) break;
      [x, z] = [nx, nz]; pts.push([x, z]); L += step;
    }
    if (pts.length < 2) continue;
    const s0 = strength(...pts[0]);
    runner(F, pts, 0.05 + 0.08 * s0, 0.025, { leaf: 0.35, tip: strength(x, z) < 0.45, age: dry, g: grower('runner', R.name, k, hx, hz) });
  }
  /* the walls: stems up them where it is strong, a shelf low on them where it is weak */
  const sides: [Dir, number, number, number, number][] = [['s', R.x0, R.z0, 1, 0], ['n', R.x0, R.z1, 1, 0], ['e', R.x0, R.z0, 0, 1], ['w', R.x1, R.z0, 0, 1]];
  const fixed = [...F.items, ...F.notes, ...F.uses, ...F.cams, ...F.exhibits];
  for (const [face, sx, sz, ax, az] of sides) {
    const len = ax ? R.x1 - R.x0 : R.z1 - R.z0, nx = Math.sin(FACE[face]), nz = Math.cos(FACE[face]);
    for (let u = 0.6 + g.rnd(0.4); u < len - 0.5; u += 0.9 + g.rnd(0.5)) {
      const wx = sx + ax * u, wz = sz + az * u, s = strength(wx, wz);
      if (g.rnd(1) >= s * dens * 1.3) continue;
      /* a wall there: the room in front of it, rock behind it, no doorway, nothing on it or stood against it */
      if (!inside(wx + nx * 0.1, wz + nz * 0.1, 0) || roomAt(F, wx - nx * 0.1, wz - nz * 0.1) || near(wx, wz, GROW.door, door) || near(wx, wz, GROW.fitting, fixed)) continue;
      const h = Math.min(top - 0.15, (0.5 + 2.6 * s) * g.rnd(0.7, 1.1)), wide = 0.6 + 0.8 * s;
      const bx0 = Math.min(wx, wx + nx * 0.5) - az * wide / 2, bx1 = Math.max(wx, wx + nx * 0.5) + az * wide / 2;
      const bz0 = Math.min(wz, wz + nz * 0.5) - ax * wide / 2, bz1 = Math.max(wz, wz + nz * 0.5) + ax * wide / 2;
      if (taken(F, bx0, bz0, bx1, bz1, 0, s > 0.2 ? h : 0.6, before)) continue;
      const gw = grower('wall', wx, wz);
      /* (along the wall, +u is the right as you face it: east on a north wall, west on a south one) */
      const span: [number, number] = face === 's' || face === 'w' ? [len - u, u] : [u, len - u];
      if (s > 0.2) climb(F, wx, wz, face, h, { w: wide, age: dry + 0.2 * s, bloom: s > 0.55 && gw.rnd(1) < bloomy, span, g: gw });
      else bracket(F, wx + nx * 0.04, gw.rnd(0.05, 0.3), wz + nz * 0.04, FACE[face] + gw.rnd(-0.3, 0.3), 2, gw.rnd(0.18, 0.28), gw, { age: dry * 0.5 });
    }
  }
  /* the heart: where it took, and the leaf hung over it */
  if (home && o.crown !== false) {
    let yaw = 0, spread = PI;
    /* against a wall, it grows out from it */
    const wx = hx - R.x0 < 0.8 ? 1 : R.x1 - hx < 0.8 ? -1 : 0, wz = hz - R.z0 < 0.8 ? 1 : R.z1 - hz < 0.8 ? -1 : 0;
    if (wx || wz) { yaw = Math.atan2(wx, wz); spread = wx && wz ? 0.9 : 1.4; }
    crown(F, hx + wx * 0.25, hz + wz * 0.25, Math.min(1.1, 0.45 + reach * 0.07), { yaw, spread, age: dry + 0.25, g: grower('crown', hx, hz) });
  }
  if (home && o.hang !== false && top > GROW.head + 0.5) {
    const lights = fittings(R);
    for (let k = 0, n = Math.round(1 + reach / 4); k < n; k++) {
      const a = g.rnd(TAU), q = g.rnd(0.4, 0.3 * reach), px = hx + Math.sin(a) * q, pz = hz + Math.cos(a) * q;
      if (!inside(px, pz, 0.6) || lights.some(([lx, lz]) => Math.abs(lx - px) < 1.2 && Math.abs(lz - pz) < 0.8)) continue;
      if (taken(F, px - 0.6, pz - 0.6, px + 0.6, pz + 0.6, GROW.head, top, before)) continue;
      hang(F, px, pz, top, { n: 3 + Math.round(3 * strength(px, pz)), age: dry + 0.35, g: grower('hang', px, pz) });
    }
  }
}
