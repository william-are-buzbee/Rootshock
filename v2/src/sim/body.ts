import type { World } from '../world/world';

/* An upright cylinder that walks: feet at y, radius r, height h. One controller for everything that moves
   under its own weight; the player now, the cast later (engine.md §6). */
export interface Body {
  x: number; y: number; z: number;
  vy: number;
  r: number;
  h: number;
  ground: boolean;
}

/** the highest edge a body walks up without jumping */
export const STEP_UP = 0.5;
export const GRAVITY = 20;
const EPS = 1e-3;

export function makeBody(x: number, y: number, z: number, r: number, h: number): Body {
  return { x, y, z, vy: 0, r, h, ground: true };
}

export function fits(w: World, b: Body, x: number, z: number, y: number, h = b.h): boolean {
  return !w.overlapCylinder(x, z, b.r, y + EPS, y + h);
}

/** move across the floor by (dx, dz): each axis on its own, so a wall stops one and you slide along it.
 *  An edge up to STEP_UP high is climbed in passing. */
export function walk(w: World, b: Body, dx: number, dz: number): void {
  if (dx) tryMove(w, b, b.x + dx, b.z);
  if (dz) tryMove(w, b, b.x, b.z + dz);
}

function tryMove(w: World, b: Body, x: number, z: number): boolean {
  if (fits(w, b, x, z, b.y)) {
    b.x = x; b.z = z;
    return true;
  }
  const g = w.groundBelow(x, z, b.r, b.y + STEP_UP);
  if (g > b.y && fits(w, b, x, z, g)) {
    b.x = x; b.z = z; b.y = g;
    if (b.vy < 0) b.vy = 0;
    return true;
  }
  /* blocked: go as far as fits, so you end up against the wall rather than a step short of it */
  let lo = 0, hi = 1;
  for (let k = 0; k < 6; k++) {
    const t = (lo + hi) / 2;
    if (fits(w, b, b.x + (x - b.x) * t, b.z + (z - b.z) * t, b.y)) lo = t;
    else hi = t;
  }
  if (lo > 0) { b.x += (x - b.x) * lo; b.z += (z - b.z) * lo; }
  return false;
}

export interface Landing {
  /** speed at impact, if the body landed this step */
  impact: number;
}

/** weight: fall, land, follow the floor down a step, stop at the ceiling */
export function fall(w: World, b: Body, dt: number): Landing {
  const out: Landing = { impact: 0 };
  b.vy -= GRAVITY * dt;
  let ny = b.y + b.vy * dt;
  const g = w.groundBelow(b.x, b.z, b.r, b.y + EPS);
  if (ny <= g || (b.ground && b.vy <= 0 && b.y - g <= STEP_UP + 0.05)) {
    if (!b.ground) out.impact = -b.vy;
    ny = g; b.vy = 0; b.ground = true;
  } else b.ground = false;
  const c = w.ceilingAbove(b.x, b.z, b.r, b.y + b.h);
  if (ny + b.h > c) {
    ny = Math.max(g, c - b.h);
    if (b.vy > 0) b.vy = 0;
  }
  b.y = ny;
  return out;
}
