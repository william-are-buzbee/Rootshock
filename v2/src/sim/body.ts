import { circle, meets, type Footprint } from '../world/shapes';
import type { Dyn, Hit, World } from '../world/world';
import type { Rider } from './movers';

/* An upright cylinder that walks: feet at y, radius r, height h. One controller for everything that moves under its
   own weight; the player now, the cast later (engine.md §6). Each body is also a Dyn in the world (its bounding box), so
   crates, doors and platforms know it is there. */
export interface Body extends Rider {
  vy: number;
  r: number;
  h: number;
  ground: boolean;
}

/** the highest edge a body walks up without jumping */
export const STEP_UP = 0.5;
export const GRAVITY = 20;
const EPS = 1e-3;

let nextId = 1;
export function makeBody(w: World, x: number, y: number, z: number, r: number, h: number): Body {
  const dyn: Dyn = { kind: 'body', id: nextId++, x0: 0, y0: 0, z0: 0, x1: 0, y1: 0, z1: 0 };
  const b: Body = {
    x, y, z, vy: 0, r, h, ground: true, on: null, dyn,
    sync: () => syncBody(b),
    clear: dy => fits(w, b, b.x, b.z, b.y + dy),
  };
  w.dyn.push(dyn);
  syncBody(b);
  return b;
}

/** bring its box in the world up to date with where it is */
export function syncBody(b: Body): void {
  const d = b.dyn;
  d.x0 = b.x - b.r; d.x1 = b.x + b.r; d.z0 = b.z - b.r; d.z1 = b.z + b.r; d.y0 = b.y; d.y1 = b.y + b.h;
}

export const footprint = (b: Body, x = b.x, z = b.z): Footprint => circle(x, z, b.r);

export function fits(w: World, b: Body, x: number, z: number, y: number, h = b.h): boolean {
  return !w.overlap(footprint(b, x, z), y + EPS, y + h, b.dyn);
}

/** move across the floor by (dx, dz): each axis on its own, so a wall stops one and you slide along the other.
 *  An edge up to `climb` high is climbed in passing. Returns what stopped it, if anything did. */
export function walk(w: World, b: Body, dx: number, dz: number, climb = STEP_UP): Hit {
  let hit: Hit = null;
  if (dx) hit = tryMove(w, b, b.x + dx, b.z, climb) ?? hit;
  if (dz) hit = tryMove(w, b, b.x, b.z + dz, climb) ?? hit;
  syncBody(b);
  return hit;
}

function tryMove(w: World, b: Body, x: number, z: number, climb: number): Hit {
  const hit = w.overlap(footprint(b, x, z), b.y + EPS, b.y + b.h, b.dyn);
  if (!hit) {
    b.x = x; b.z = z;
    return null;
  }
  const g = w.groundBelow(footprint(b, x, z), b.y + climb, b.dyn);
  if (g > b.y && fits(w, b, x, z, g)) {
    b.x = x; b.z = z; b.y = g;
    if (b.vy < 0) b.vy = 0;
    return null;
  }
  /* blocked: go as far as fits, so you end up against the wall rather than a step short of it */
  const t = w.sweep(footprint(b), b.y + EPS, b.y + b.h, x - b.x, z - b.z, b.dyn);
  b.x += (x - b.x) * t; b.z += (z - b.z) * t;
  return hit;
}

export interface Landing {
  /** speed at impact, if the body landed this step */
  impact: number;
}

/** weight: fall (at `gravity`), land, follow the floor down a step, stop at the ceiling */
export function fall(w: World, b: Body, dt: number, gravity = GRAVITY): Landing {
  const out: Landing = { impact: 0 };
  b.vy -= gravity * dt;
  let ny = b.y + b.vy * dt;
  const f = footprint(b), g = w.groundBelow(f, b.y + EPS, b.dyn);
  if (ny <= g || (b.ground && b.vy <= 0 && b.y - g <= STEP_UP + 0.05)) {
    if (!b.ground) out.impact = -b.vy;
    ny = g; b.vy = 0; b.ground = true;
  } else b.ground = false;
  const c = w.ceilingAbove(f, b.y + b.h, b.dyn);
  if (ny + b.h > c) {
    ny = Math.max(g, c - b.h);
    if (b.vy > 0) b.vy = 0;
  }
  b.y = ny;
  b.on = b.ground ? standingOn(w, f, b.y, b.dyn) : null;
  syncBody(b);
  return out;
}

/** the moving solid whose top is right under a footprint at height y, if any */
export function standingOn(w: World, f: Footprint, y: number, self: Dyn): Dyn | null {
  for (const d of w.dyn) if (d !== self && d.kind !== 'body' && Math.abs(d.y1 - y) < 0.01 && meets(f, d.x0, d.z0, d.x1, d.z1)) return d;
  return null;
}

/** if the body has ended up inside something (a door, a shove, a bad spawn), nudge it out by the shortest way */
export function settle(w: World, b: Body): void {
  const n = w.pushOut(footprint(b), b.y + EPS, b.y + b.h, b.dyn);
  if (n) { b.x += n[0]; b.y += n[1]; b.z += n[2]; syncBody(b); }
}
