import { PI, TAU, clamp } from '../../core/math';
import { P, roomAt, type Dir, type Floor } from './plan';
import { CONCRETE, FACE, GROW, HOLE, WOOD, crack, curve, grower, lump, rod, rubble, spindle, type Grow, type V3 } from './overgrowth';

/* The bush's roots (world.md §8, Security overgrown in parts): what its flowers on the upper floors put down through
   the station's concrete into the floors under them. Woody, as thick as an arm or a waist, braided where they are
   thickest, pale at their tips; where one goes through a floor, a wall or a ceiling it leaves it broken round it, the
   concrete spalled, cracks run out, the reinforcing bared and bent, rubble fallen under it. The pieces (a root along a
   path; a bore, where one goes through) and what they make: a taproot down out of a ceiling into the floor, a root out
   of a wall and down into the floor, one across a room from wall to wall over a head, and hair roots hung from a
   ceiling. Plan metres, y over the floor, as the rest of the bush's growth (overgrowth.ts); dressing only, as that is:
   nothing here is solid, so lay them where nobody walks through them. */

/** the big roots' bark, and their young tips' pale tan */
export const BARK = [...WOOD, 0x5e4c38], PALE = [0x8a7656, 0x9a8462, 0xa8946e];
/** the reinforcing in the concrete, rusted where it is bared */
const REBAR = 0x6a3a24;

const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const unit = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** two directions square to n and to each other */
const across = (n: V3): [V3, V3] => { const u = unit(cross(n, Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])); return [u, cross(n, u)]; };
/** a wall's face, looking out into the room */
const out = (face: Dir): V3 => [Math.sin(FACE[face]), 0, Math.cos(FACE[face])];

/** a root through the points given, d0 thick at its first and d1 at its last: woody, knuckled at its bends, and where
 *  it is over a hand thick braided of two strands twisting round it. `lets`, rootlets off it to a metre of it, hanging
 *  down and coming to rest on the floor if they reach it, but none lower than `low` over it (a head, under one across
 *  a room); `inside`, where they may go */
export function root(F: Floor, pts: readonly V3[], d0: number, d1: number,
  o: { lets?: number; low?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('root', ...pts[0]), n = pts.length - 1, low = o.low ?? 0.01;
  let tw = g.rnd(TAU);
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[k + 1], d = d0 + ((d1 - d0) * k) / Math.max(1, n - 1), c = g.pick(BARK);
    rod(F, a, b, d, c, d * 0.25);
    if (k) lump(F, a[0], a[1], a[2], d * 1.3, d * 1.15, d * 1.3, c, g.rnd(PI));
    if (d > 0.16) {
      const [u, v] = across(unit(add(b, a, -1))), t0 = tw, t1 = (tw += g.rnd(0.9, 1.5));
      for (const s of [0, PI]) {
        const off = (t: number): V3 => add(add([0, 0, 0], u, Math.cos(t + s) * d * 0.3), v, Math.sin(t + s) * d * 0.3);
        rod(F, add(a, off(t0)), add(b, off(t1)), d * 0.5, g.pick(BARK), d * 0.1);
      }
    }
  }
  /* rootlets, down off it */
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[k + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    for (let m = 0, c = Math.floor(L * (o.lets ?? 0) + g.rnd(1)); m < c; m++) {
      const f = g.rnd(0.15, 0.85), p: V3 = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      const az = g.rnd(TAU), e = -g.rnd(0.5, 1.3), dir: V3 = [Math.sin(az) * Math.cos(e), Math.sin(e), Math.cos(az) * Math.cos(e)];
      let len = g.rnd(0.3, 1);
      if (p[1] + dir[1] * len < low) len = (p[1] - low) / -dir[1];
      if (len < 0.15) continue;
      const q = add(p, dir, len), mid = add(add(p, dir, len * 0.5), [g.rnd(-0.05, 0.05), 0, g.rnd(-0.05, 0.05)]), dd = g.rnd(0.018, 0.04);
      if (o.inside && !(o.inside(q[0], q[2]) && o.inside(mid[0], mid[2]))) continue;
      rod(F, p, mid, dd, g.pick(PALE)); rod(F, mid, q, dd * 0.6, g.pick(PALE));
    }
  }
}

/** where a root d thick goes through concrete: the face of it at (x, y, z) looking out along n (a unit vector, into the
 *  room), the root going on in along `dir` (else straight in). The root sunk into it, tapering; a dark hole round it;
 *  the concrete spalled off in lumps about it; cracks run out; the reinforcing bared and bent; and, out of a wall or a
 *  ceiling, rubble fallen on the floor under it. `c`, the surface's colour; `small`, only the hole and the cracks */
export function bore(F: Floor, x: number, y: number, z: number, n: V3, d: number, o: { dir?: V3; c?: number; small?: boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('bore', x, y, z), c = o.c ?? 0x6a6660, dir = o.dir ?? [-n[0], -n[1], -n[2]], [u, v] = across(n), p: V3 = [x, y, z];
  /* the root on into it, half in and half out: no deeper than a slab is thick */
  spindle(F, p, dir, Math.min(0.7, d * 1.6), d * 1.05, g.pick(BARK));
  const ht = 0.012, hd = d * 1.3;
  P(F, 'cyl', x + (n[0] * ht) / 2, z + (n[2] * ht) / 2, hd, ht, hd, HOLE, { y: y + (n[1] * ht) / 2 - ht / 2, rz: Math.acos(clamp(n[1], -1, 1)), ry: Math.atan2(n[2], -n[0]), c: 0 });
  const floor = n[1] > 0.5, ceiling = n[1] < -0.5, yaw = Math.atan2(n[0], n[2]);
  for (let k = 0, m = 3 + Math.floor(g.rnd(3)); k < m; k++) {
    const a = g.rnd(TAU), r0 = d * 0.7, len = g.rnd(0.3, 0.9) * (0.5 + d);
    if (floor || ceiling) crack(F, x + Math.sin(a) * r0, y, z + Math.cos(a) * r0, a, len, floor ? 'floor' : 'ceiling');
    else crack(F, x + Math.cos(yaw) * Math.sin(a) * r0, y + Math.cos(a) * r0, z - Math.sin(yaw) * Math.sin(a) * r0, a, len, yaw);
  }
  if (o.small) return;
  /* spalled: lumps of it round the hole, half in the face */
  for (let k = 0, m = 5 + Math.floor(g.rnd(4)); k < m; k++) {
    const a = (k / m) * TAU + g.rnd(-0.3, 0.3), q = d * g.rnd(0.6, 0.85), s = g.rnd(0.07, 0.14) + d * 0.25, at = add(add(p, u, Math.cos(a) * q), v, Math.sin(a) * q);
    lump(F, at[0] + n[0] * s * 0.15, at[1] + n[1] * s * 0.15, at[2] + n[2] * s * 0.15, s, s * g.rnd(0.5, 0.8), s * g.rnd(0.7, 1), g.rnd(1) < 0.6 ? c : g.pick(CONCRETE), g.rnd(PI));
  }
  /* the reinforcing, bared and bent out of it */
  for (let k = 0, m = 1 + Math.floor(g.rnd(3)); k < m; k++) {
    const a = g.rnd(TAU), q = d * g.rnd(0.6, 0.8), s = add(add(p, u, Math.cos(a) * q), v, Math.sin(a) * q), r = g.rnd(0.05, 0.15);
    const m1 = add(s, n, g.rnd(0.06, 0.14)), e = add(add(m1, u, Math.cos(a) * r), v, Math.sin(a) * r);
    rod(F, s, m1, 0.016, REBAR); rod(F, m1, e, 0.016, REBAR);
  }
  /* what fell: under a ceiling, about where it came through; out from the foot of a wall */
  if (!floor) rubble(F, x + n[0] * (0.25 + d), z + n[2] * (0.25 + d), 0.3 + d, 5 + Math.floor(g.rnd(5)), c, g);
}

/** a taproot down out of a ceiling `top` over the floor at (x, z), and into the floor at `to` (a little off, unless it
 *  says): d thick at the ceiling, bending as it comes down, buttressed where it goes in by roots spread out over the
 *  floor and down into it; bored through both. `c`, the ceiling's colour, and `fc`, the floor's (else its room's) */
export function taproot(F: Floor, x: number, z: number, top: number,
  o: { d?: number; to?: [number, number]; c?: number; fc?: number; lets?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('taproot', x, z), d = o.d ?? 0.35, R = roomAt(F, x, z), c = o.c ?? R?.wl ?? 0x8a8378, fc = o.fc ?? R?.fl ?? 0x645d55;
  const [tx, tz] = o.to ?? [x + g.rnd(-0.6, 0.6), z + g.rnd(-0.6, 0.6)];
  /* down out of the ceiling and bending: eased from one to the other, bowed out to one side between */
  const bend = g.rnd(0.15, 0.4), ba = g.rnd(TAU), pts: V3[] = [];
  for (let k = 0, n = 6; k <= n; k++) {
    const t = k / n, e = t * t * (3 - 2 * t), w = Math.sin(t * PI) * bend;
    pts.push([x + (tx - x) * e + Math.sin(ba) * w, top * (1 - t), z + (tz - z) * e + Math.cos(ba) * w]);
  }
  root(F, pts, d, d * 0.8, { lets: o.lets ?? 0.8, inside: o.inside, g });
  bore(F, x, top, z, [0, -1, 0], d * 1.05, { dir: [0, 1, 0], c, g });
  bore(F, tx, 0, tz, [0, 1, 0], d * 0.85, { dir: [0, -1, 0], c: fc, g });
  /* buttresses: roots out from its foot over the floor, half sunk, and on down into it */
  for (let k = 0, m = 3 + Math.floor(g.rnd(3)); k < m; k++) {
    const a = (k / m) * TAU + g.rnd(-0.4, 0.4), L = g.rnd(0.6, 1.4) * (0.6 + d), dd = d * g.rnd(0.35, 0.5), bp: V3[] = [];
    for (let j = 0; j <= 4; j++) {
      const f = j / 4, w = Math.sin(f * PI) * g.rnd(-0.1, 0.1);
      bp.push([tx + Math.sin(a) * (d * 0.3 + L * f) + Math.cos(a) * w, dd * 0.25 + d * 0.5 * (1 - f) ** 2, tz + Math.cos(a) * (d * 0.3 + L * f) - Math.sin(a) * w]);
    }
    const [ex, , ez] = bp[4];
    if (o.inside && !o.inside(ex, ez)) continue;
    root(F, bp, dd, dd * 0.4, { g });
    bore(F, ex, 0, ez, [0, 1, 0], dd * 0.5, { dir: unit([Math.sin(a), -0.6, Math.cos(a)]), c: fc, small: true, g });
  }
}

/** a root out of a wall at (x, y, z) on its face, which looks out `face`, d thick, arching out into the room and down
 *  into the floor at (tx, tz); bored through both. `c`, the wall's colour, and `fc`, the floor's (else its room's) */
export function wallroot(F: Floor, x: number, y: number, z: number, face: Dir, tx: number, tz: number,
  o: { d?: number; c?: number; fc?: number; lets?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('wallroot', x, y, z), d = o.d ?? 0.3, n = out(face), R = roomAt(F, tx, tz), c = o.c ?? R?.wl ?? 0x8a8378, fc = o.fc ?? R?.fl ?? 0x645d55;
  const far = Math.hypot(tx - x, tz - z), lift = g.rnd(0.2, 0.6);
  /* out of the wall square to it (clear of it by more than its own thickness, so none of it is in the wall but the
     root bored on into it), over, and down */
  const p0: V3 = [x + n[0] * d * 0.6, y, z + n[2] * d * 0.6], p1: V3 = [x + n[0] * far * 0.55, y + lift, z + n[2] * far * 0.55], p2: V3 = [tx, 0, tz];
  const pts: V3[] = [];
  for (let k = 0; k <= 7; k++) pts.push(curve(p0, p1, p2, k / 7));
  root(F, pts, d, d * 0.65, { lets: o.lets ?? 0.7, inside: o.inside, g });
  bore(F, x, y, z, n, d * 1.05, { c, g });
  bore(F, tx, 0, tz, [0, 1, 0], d * 0.7, { dir: unit(add(pts[7], pts[6], -1)), c: fc, g });
}

/** a root across a room from wall to wall: out of the wall at a (its face looking out fa) and into the one at b (fb),
 *  d thick, sagging `sag` between, hung with rootlets; bored through both. Over a head: none of it, nor of what hangs
 *  from it, lower than GROW.head. `c`, the walls' colour (else the room's at a) */
export function span(F: Floor, a: V3, fa: Dir, b: V3, fb: Dir,
  o: { d?: number; sag?: number; c?: number; lets?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('span', ...a), d = o.d ?? 0.3, na = out(fa), nb = out(fb), c = o.c ?? roomAt(F, a[0] + na[0], a[2] + na[2])?.wl ?? 0x8a8378;
  const p0 = add(a, na, d * 0.6), p1 = add(b, nb, d * 0.6), sag = o.sag ?? 0.3, pts: V3[] = [], n = Math.max(4, Math.round(Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) / 1.2));
  for (let k = 0; k <= n; k++) {
    const t = k / n, w = Math.sin(t * PI) * g.rnd(-0.15, 0.15);
    const y = p0[1] + (p1[1] - p0[1]) * t - Math.sin(t * PI) * sag;
    pts.push([p0[0] + (p1[0] - p0[0]) * t + w, Math.max(GROW.head + d / 2, y), p0[2] + (p1[2] - p0[2]) * t - w]);
  }
  root(F, pts, d, d * 0.8, { lets: o.lets ?? 1.2, low: GROW.head, inside: o.inside, g });
  bore(F, ...a, na, d * 1.05, { c, g });
  bore(F, ...b, nb, d * 0.9, { c, g });
}

/** hair roots hung from a ceiling `top` over the floor about (x, z), out to r: fine and pale and kinked, from cracks run
 *  across the ceiling, none lower than a head (GROW.head). `inside`, where they may hang */
export function fringe(F: Floor, x: number, z: number, top: number, r: number, o: { n?: number; inside?: (x: number, z: number) => boolean; g?: Grow } = {}): void {
  const g = o.g ?? grower('fringe', x, z);
  for (let k = 0, m = 4 + Math.floor(g.rnd(3)); k < m; k++) {
    const a = g.rnd(TAU), q = r * g.rnd(0, 0.6);
    crack(F, x + Math.sin(a) * q, top, z + Math.cos(a) * q, g.rnd(TAU), g.rnd(0.4, 1.2) * (0.5 + r), 'ceiling');
  }
  for (let k = 0, m = o.n ?? Math.round(10 + 20 * r * r); k < m; k++) {
    const a = g.rnd(TAU), q = r * Math.sqrt(g.rnd(1)), px = x + Math.sin(a) * q, pz = z + Math.cos(a) * q;
    if (o.inside && !o.inside(px, pz)) continue;
    const len = g.rnd(0.25, top - GROW.head), dd = g.rnd(0.012, 0.024), segs = 2 + Math.floor(g.rnd(2));
    let p: V3 = [px, top, pz];
    for (let j = 1; j <= segs; j++) {
      const q2: V3 = [px + g.rnd(-0.06, 0.06), top - (len * j) / segs, pz + g.rnd(-0.06, 0.06)];
      rod(F, p, q2, dd * (1 - 0.25 * j), g.pick(PALE));
      p = q2;
    }
    if (g.rnd(1) < 0.3) lump(F, px, top - 0.03, pz, 0.06, 0.05, 0.06, g.pick(BARK));
  }
}
