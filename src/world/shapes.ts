/* Shapes the world is asked about. */

/** an axis-aligned box */
export interface Box {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
}

/** what a thing covers on the floor plan: a circle (round, radius hx) or an axis-aligned rectangle (half sizes hx, hz) */
export interface Footprint {
  x: number; z: number; hx: number; hz: number; round: boolean;
}
export const circle = (x: number, z: number, r: number): Footprint => ({ x, z, hx: r, hz: r, round: true });
export const rect = (x: number, z: number, hx: number, hz: number): Footprint => ({ x, z, hx, hz, round: false });
export const moved = (f: Footprint, x: number, z: number): Footprint => ({ ...f, x, z });

/** does the footprint meet the rectangle [x0, x1] x [z0, z1]? Touching does not count. */
export function meets(f: Footprint, x0: number, z0: number, x1: number, z1: number): boolean {
  if (f.round) {
    const px = Math.min(Math.max(f.x, x0), x1), pz = Math.min(Math.max(f.z, z0), z1);
    return (f.x - px) ** 2 + (f.z - pz) ** 2 < f.hx * f.hx;
  }
  return f.x - f.hx < x1 && f.x + f.hx > x0 && f.z - f.hz < z1 && f.z + f.hz > z0;
}

const RIM = Array.from({ length: 8 }, (_, k) => [Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4)]);
/** points spread over the footprint (its centre and its rim), for asking a sloped surface how high it is under it */
export function samples(f: Footprint): [number, number][] {
  const out: [number, number][] = [[f.x, f.z]];
  if (f.round) for (const [c, s] of RIM) out.push([f.x + c * f.hx, f.z + s * f.hx]);
  else for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]]) out.push([f.x + a * f.hx, f.z + b * f.hz]);
  return out;
}

/** where a segment from p to p + d first enters the box, as a fraction 0..1 of d; Infinity if it misses */
export function segmentBox(px: number, py: number, pz: number, dx: number, dy: number, dz: number, b: Box): number {
  let t0 = 0, t1 = 1;
  const axis = (p: number, d: number, lo: number, hi: number): boolean => {
    if (Math.abs(d) < 1e-12) return p > lo && p < hi;
    let a = (lo - p) / d, c = (hi - p) / d;
    if (a > c) [a, c] = [c, a];
    if (a > t0) t0 = a;
    if (c < t1) t1 = c;
    return t0 <= t1;
  };
  if (!axis(px, dx, b.x0, b.x1) || !axis(py, dy, b.y0, b.y1) || !axis(pz, dz, b.z0, b.z1)) return Infinity;
  return t0;
}
