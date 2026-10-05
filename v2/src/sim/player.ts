import { clamp } from '../core/math';
import type { World } from '../world/world';
import { fall, fits, makeBody, walk, type Body } from './body';
import type { Input } from './input';

export const STAND = 1.8;
export const CROUCH = 1.0;
const RADIUS = 0.32;
const JUMP = 6.3;

export interface Player {
  body: Body;
  yaw: number;
  pitch: number;
  crouch: boolean;
  /** crouch was released under something low; stand when there is room */
  wantStand: boolean;
  light: boolean;
  /** how far you moved this step, for footsteps and head bob */
  moved: number;
  /** speed at the last landing */
  impact: number;
}

export function makePlayer(x: number, y: number, z: number, yaw: number): Player {
  return { body: makeBody(x, y, z, RADIUS, STAND), yaw, pitch: 0, crouch: false, wantStand: false, light: false, moved: 0, impact: 0 };
}

export function updatePlayer(w: World, p: Player, inp: Input, dt: number): void {
  const b = p.body;
  p.yaw += inp.yaw;
  p.pitch = clamp(p.pitch + inp.pitch, -1.45, 1.45);
  if (inp.light) p.light = !p.light;

  /* crouch is a toggle; standing up needs headroom */
  if (inp.crouch) {
    if (p.crouch) p.wantStand = true;
    else { p.crouch = true; p.wantStand = false; }
  }
  if (p.crouch && p.wantStand && fits(w, b, b.x, b.z, b.y, STAND)) { p.crouch = false; p.wantStand = false; }
  if (inp.jump && b.ground && (!p.crouch || fits(w, b, b.x, b.z, b.y, STAND))) {
    b.vy = JUMP; b.ground = false; p.crouch = false; p.wantStand = false;
  }
  b.h = p.crouch ? CROUCH : STAND;

  /* walking */
  const f = clamp(inp.forward, -1, 1), s = clamp(inp.strafe, -1, 1), l = Math.hypot(f, s);
  const run = inp.run && !p.crouch && f > 0;
  const spd = p.crouch ? 1.6 : run ? 5.6 : 3.2;
  const ox = b.x, oz = b.z;
  if (l > 0) {
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw), rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw), k = (spd * dt) / Math.max(1, l);
    walk(w, b, (fx * f + rx * s) * k, (fz * f + rz * s) * k);
  }
  p.moved = Math.hypot(b.x - ox, b.z - oz);

  /* weight */
  p.impact = fall(w, b, dt).impact;
}
