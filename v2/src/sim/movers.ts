import type { DoorDef, PlatformDef } from '../content/types';
import type { Box } from '../world/shapes';
import type { Dyn, World } from '../world/world';

/* Things that move on their own rails: doors and platforms. Each is a Dyn in the world, so everything that asks the
   world about space sees it where it is now. They never pass through a body or a crate: a closing door opens again, a
   platform that would crush something stops and goes back. */

/** something a mover can carry or must not crush: a body or a loose crate */
export interface Rider {
  x: number; y: number; z: number;
  on: Dyn | null;
  dyn: Dyn;
  /** after being carried: refresh its box in the world */
  sync(): void;
  /** would it still fit if moved by (dx, dy, dz)? */
  clear(dx: number, dy: number, dz: number): boolean;
}

export interface Door {
  def: DoorDef;
  dyn: Dyn;
  /** 0 shut, 1 fully open */
  t: number;
  /** seconds left before it may close */
  hold: number;
}

export interface Platform {
  def: PlatformDef;
  dyn: Dyn;
  /** height of its top now */
  y: number;
  /** where it is going: 0 the low end, 1 the high end */
  target: 0 | 1;
  /** seconds something has stood on it, still, while it was at rest */
  wait: number;
  moving: boolean;
  /** it has been empty since it last stopped: the next one to step on sends it */
  armed: boolean;
}

const DOOR_SPEED = 2.2; // fraction of its travel per second, as in the first engine
const DOOR_NEAR = 2.2;
const LIFT_SPEED = 1.5;
const THICK = 0.2;
export function makeDoor(w: World, def: DoorDef): Door {
  const dyn: Dyn = { kind: 'mover', id: w.newId(), x0: def.x0, y0: def.y0, z0: def.z0, x1: def.x1, y1: def.y1, z1: def.z1 };
  w.dyn.push(dyn);
  const d: Door = { def, dyn, t: def.stuck ? STUCK : def.open ? 1 : 0, hold: def.open ? 1.5 : 0 };
  Object.assign(d.dyn, doorBox(d, d.t));
  return d;
}

/** how far a jammed door stands open: enough to crouch under */
const STUCK = 0.45; // its foot 1.06 m up: room for a crouch (1 m)

export function makePlatform(w: World, def: PlatformDef): Platform {
  const dyn: Dyn = { kind: 'mover', id: w.newId(), x0: def.x0, z0: def.z0, x1: def.x1, z1: def.z1, y0: def.y0 - THICK, y1: def.y0 };
  w.dyn.push(dyn);
  return { def, dyn, y: def.y0, target: 0, wait: 0, moving: false, armed: true };
}

const overlaps = (a: Box, b: Box): boolean => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0 && a.z0 < b.z1 && a.z1 > b.z0;

/** a door opens for anything near it, holds a moment, then closes, unless something is in the way. For now (step 3)
 *  only welded and jammed doors keep to their own rules; power, buttons, cards and codes come in step 4. */
export function updateDoor(d: Door, riders: Rider[], dt: number): void {
  if (d.def.seal || d.def.stuck) return;
  const cx = (d.def.x0 + d.def.x1) / 2, cz = (d.def.z0 + d.def.z1) / 2;
  const near = riders.some(r => Math.hypot(r.x - cx, r.z - cz) < DOOR_NEAR && r.y < d.def.y1 && r.y > d.def.y0 - 1);
  if (near) d.hold = 1.5;
  else d.hold = Math.max(0, d.hold - dt);
  const want = d.hold > 0 ? 1 : 0;
  let t = d.t + Math.max(-DOOR_SPEED * dt, Math.min(DOOR_SPEED * dt, want - d.t));
  if (t < d.t) {
    /* closing: never onto anything */
    const box = doorBox(d, t);
    if (riders.some(r => overlaps(box, r.dyn))) { t = d.t; d.hold = 0.5; }
  }
  d.t = t;
  Object.assign(d.dyn, doorBox(d, t));
}

/** the door at openness t: it slides straight up by its own height */
function doorBox(d: Door, t: number): Box {
  const lift = (d.def.y1 - d.def.y0) * t * 0.98;
  return { x0: d.def.x0, z0: d.def.z0, x1: d.def.x1, z1: d.def.z1, y0: d.def.y0 + lift, y1: d.def.y1 + lift };
}

/** a platform goes to its other end once something steps on and stays a moment; it carries what is on it. Whoever rode
 *  it there has to step off and on again to send it back, so it does not take you away while you stand and look. */
export function updatePlatform(p: Platform, riders: Rider[], dt: number): void {
  const d = p.def, on = riders.filter(r => r.on === p.dyn);
  if (!p.moving) {
    if (!on.length) p.armed = true;
    p.wait = on.length && p.armed ? p.wait + dt : 0;
    if (p.wait > 0.8) { p.target = p.target ? 0 : 1; p.moving = true; p.wait = 0; p.armed = false; }
    return;
  }
  const goal = p.target ? d.y1 : d.y0, dir = Math.sign(goal - p.y);
  let dy = dir * LIFT_SPEED * dt;
  if (Math.abs(goal - p.y) <= Math.abs(dy)) dy = goal - p.y;
  const box: Box = { x0: d.x0, z0: d.z0, x1: d.x1, z1: d.z1, y0: p.y + dy - THICK, y1: p.y + dy };
  /* something under it on the way down, or beside it in the shaft: stop and go back */
  if (riders.some(r => !on.includes(r) && overlaps(box, r.dyn)) || (dy > 0 && on.some(r => !r.clear(0, dy, 0)))) {
    p.target = p.target ? 0 : 1;
    return;
  }
  p.y += dy;
  Object.assign(p.dyn, box);
  for (const r of on) { r.y += dy; r.sync(); }
  if (p.y === goal) { p.moving = false; p.armed = on.length === 0; }
}
