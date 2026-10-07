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
  /** where it is going: open or shut */
  open: boolean;
  /** its card or code has been given */
  unlocked: boolean;
  /** seconds left before it may close */
  hold: number;
  /** the overseer's: seconds left bolted, and before a bolt being drawn goes home (sim/eyes.ts) */
  bolt: number;
  bolting: number;
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
const DOOR_NEAR = 2.5;
const LIFT_SPEED = 1.5;
const THICK = 0.2;
export function makeDoor(w: World, def: DoorDef): Door {
  const dyn: Dyn = { kind: 'mover', id: w.newId(), x0: def.x0, y0: def.y0, z0: def.z0, x1: def.x1, y1: def.y1, z1: def.z1 };
  w.dyn.push(dyn);
  const d: Door = { def, dyn, t: def.stuck ? STUCK : def.open ? 1 : 0, open: def.open, unlocked: false, hold: 0, bolt: 0, bolting: 0 };
  Object.assign(d.dyn, doorBox(d, d.t));
  return d;
}

/** how far a jammed door stands open: enough to crouch under */
const STUCK = 0.45; // its foot 1.07 m up: room for a crouch (1 m)

/** put a platform's box where its top is (after a load) */
export function placePlatform(p: Platform): void {
  Object.assign(p.dyn, { y0: p.y - THICK, y1: p.y });
}

export function makePlatform(w: World, def: PlatformDef): Platform {
  const dyn: Dyn = { kind: 'mover', id: w.newId(), x0: def.x0, z0: def.z0, x1: def.x1, z1: def.z1, y0: def.y0 - THICK, y1: def.y0 };
  w.dyn.push(dyn);
  return { def, dyn, y: def.y0, target: 0, wait: 0, moving: false, armed: true };
}

/** send a called platform to one end (0 low, 1 high) */
export function sendPlatform(p: Platform, target: 0 | 1): void {
  p.target = target;
  p.moving = true;
}

const overlaps = (a: Box, b: Box): boolean => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0 && a.z0 < b.z1 && a.z1 > b.z0;

/** a locked door: a reader or keypad not yet satisfied. Fail-secure (world.md §4): it stays locked with the power off,
 *  and the reader needs power to read. Once a card or code has opened it, it stays unlocked. */
/** locked: by its card or code, not given yet, or bolted by the overseer */
export const locked = (d: Door): boolean => (!!(d.def.card || d.def.code) && !d.unlocked) || d.bolt > 0;

/** something in the doorway, which it must not close on */
export function occupied(d: Door, riders: Rider[]): boolean {
  const box = doorBox(d, 0);
  return riders.some(r => overlaps(box, r.dyn));
}

/** The door rules (world.md §4), as the first engine ran them, each step:
 *  - a heavy door shuts when it loses full power, and otherwise stays as its button left it;
 *  - a light door on a live circuit opens by itself for anything that moves (`movers`: the player, later the cast),
 *    holds, and shuts behind it; locked, it stays shut; on a dead circuit it stays as a hand slid it;
 *  - welded, jammed and panel doors, and the lift's, keep their own state.
 *  It never closes on a body or a crate. Returns true when it started to move on its own (for a sound). */
export function updateDoor(d: Door, riders: Rider[], movers: { x: number; y: number; z: number }[], power: number, dt: number): boolean {
  const D = d.def;
  let moved = false;
  if (!(D.stuck || D.vent || D.seal || D.lift)) {
    if (D.kind === 'heavy') {
      if (power < 2 && d.open && !occupied(d, riders)) { d.open = false; moved = true; }
    } else if (power > 0) {
      if (locked(d)) {
        if (d.open && !occupied(d, riders)) { d.open = false; moved = true; }
      } else {
        const cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2;
        const near = movers.some(m => Math.hypot(m.x - cx, m.z - cz) < DOOR_NEAR && m.y < D.y1 && m.y > D.y0 - 1);
        if (near) { if (!d.open) { d.open = true; moved = true; } d.hold = 2.2; }
        else if (d.open && (d.hold -= dt) <= 0 && !occupied(d, riders)) { d.open = false; moved = true; }
      }
    }
  }
  const want = D.stuck ? STUCK : d.open ? 1 : 0;
  let t = d.t + Math.max(-DOOR_SPEED * dt, Math.min(DOOR_SPEED * dt, want - d.t));
  if (t < d.t && riders.some(r => overlaps(doorBox(d, t), r.dyn))) t = d.t;
  d.t = t;
  Object.assign(d.dyn, doorBox(d, t));
  return moved;
}

/** the door at openness t: it slides straight up by its own height */
export function doorBox(d: Door, t: number): Box {
  const lift = (d.def.y1 - d.def.y0 - 0.02) * t; // open, 2 cm of it shows under the lintel, as before
  return { x0: d.def.x0, z0: d.def.z0, x1: d.def.x1, z1: d.def.z1, y0: d.def.y0 + lift, y1: d.def.y1 + lift };
}

/** a platform goes to its other end once something steps on and stays a moment; it carries what is on it. Whoever rode
 *  it there has to step off and on again to send it back, so it does not take you away while you stand and look. */
export function updatePlatform(p: Platform, riders: Rider[], dt: number): 'moving' | 'arrived' | null {
  const d = p.def, on = riders.filter(r => r.on === p.dyn);
  if (!p.moving && d.call) return null; // a called platform waits for its button
  if (!p.moving) {
    if (!on.length) p.armed = true;
    p.wait = on.length && p.armed ? p.wait + dt : 0;
    if (p.wait > 0.8) { p.target = p.target ? 0 : 1; p.moving = true; p.wait = 0; p.armed = false; }
    return null;
  }
  const goal = p.target ? d.y1 : d.y0, dir = Math.sign(goal - p.y);
  let dy = dir * LIFT_SPEED * dt;
  if (Math.abs(goal - p.y) <= Math.abs(dy)) dy = goal - p.y;
  const box: Box = { x0: d.x0, z0: d.z0, x1: d.x1, z1: d.z1, y0: p.y + dy - THICK, y1: p.y + dy };
  /* something under it on the way down, or beside it in the shaft: stop and go back */
  if (riders.some(r => !on.includes(r) && overlaps(box, r.dyn)) || (dy > 0 && on.some(r => !r.clear(0, dy, 0)))) {
    p.target = p.target ? 0 : 1;
    return 'moving';
  }
  p.y += dy;
  Object.assign(p.dyn, box);
  for (const r of on) { r.y += dy; r.sync(); }
  if (p.y === goal) { p.moving = false; p.armed = on.length === 0; return 'arrived'; }
  return 'moving';
}
