import { clamp } from '../core/math';
import type { World } from '../world/world';
import { fall, fits, makeBody, settle, walk, STEP_UP, type Body } from './body';
import type { Input } from './input';

export const STAND = 1.8;
export const CROUCH = 1.0;
export const EYE = 1.62;
export const EYE_CROUCH = 0.95;
const RADIUS = 0.32;
const JUMP = 6.3;
/** water deeper than this at your feet and you are wading; deeper than SWIM and you are swimming */
const WADE = 0.3;
const SWIM = 1.3;
/** how high you can haul yourself out of water onto a ledge */
const CLIMB_OUT = 1.7;
export const AIR = 35;

export interface Player {
  body: Body;
  yaw: number;
  pitch: number;
  crouch: boolean;
  /** crouch was released under something low; stand when there is room */
  wantStand: boolean;
  /** how far you moved this step, for footsteps and head bob */
  moved: number;
  /** speed at the last landing */
  impact: number;
  water: 'dry' | 'wading' | 'swimming';
  /** seconds of breath left */
  air: number;
  /** your eye is under the surface */
  under: boolean;
  /** seconds left of being held (you move at a third of your speed) */
  slow: number;
  /** a shove (m/s) that dies away: what a charge leaves you with */
  kx: number;
  kz: number;
  /** this step: running, for the noise it makes */
  running: boolean;
  /** this step: jumped */
  jumped: boolean;
}

export function makePlayer(w: World, x: number, y: number, z: number, yaw: number): Player {
  return {
    body: makeBody(w, x, y, z, RADIUS, STAND), yaw, pitch: 0, crouch: false, wantStand: false, moved: 0, impact: 0,
    water: 'dry', air: AIR, under: false, slow: 0, kx: 0, kz: 0, running: false, jumped: false,
  };
}

export const eyeHeight = (p: Player): number => (p.crouch ? EYE_CROUCH : EYE);

/** a step's walking intent: where it wants to go, so the sim can tell what it ran into */
export interface Stride { dx: number; dz: number; speed: number }

export function updatePlayer(w: World, p: Player, inp: Input, dt: number): { stride: Stride; hit: ReturnType<typeof walk> } {
  const b = p.body;
  settle(w, b);
  p.yaw += inp.yaw;
  p.pitch = clamp(p.pitch + inp.pitch, -1.45, 1.45);

  const level = w.waterAt(b.x, b.z), depth = level - b.y;
  p.water = depth > SWIM ? 'swimming' : depth > WADE ? 'wading' : 'dry';
  const swim = p.water === 'swimming';

  /* crouch is a toggle; standing up needs headroom. In deep water there is no crouching, only swimming down. */
  if (swim) { p.crouch = false; p.wantStand = false; }
  else if (inp.crouch) {
    if (p.crouch) p.wantStand = true;
    else { p.crouch = true; p.wantStand = false; }
  }
  if (p.crouch && p.wantStand && fits(w, b, b.x, b.z, b.y, STAND)) { p.crouch = false; p.wantStand = false; }
  p.jumped = false;
  if (!swim && inp.jump && b.ground && (!p.crouch || fits(w, b, b.x, b.z, b.y, STAND))) {
    p.jumped = true;
    b.vy = JUMP; b.ground = false; p.crouch = false; p.wantStand = false;
  }
  b.h = p.crouch ? CROUCH : STAND;

  /* walking, wading, swimming */
  const f = clamp(inp.forward, -1, 1), s = clamp(inp.strafe, -1, 1), l = Math.hypot(f, s);
  const run = inp.run && !p.crouch && f > 0 && p.water === 'dry';
  let speed = swim ? 2.4 : p.water === 'wading' ? 2.2 : p.crouch ? 1.6 : run ? 5.6 : 3.2;
  p.running = run && l > 0;
  if (p.slow > 0) { p.slow -= dt; speed *= 0.35; }
  const ox = b.x, oz = b.z;
  const stride: Stride = { dx: 0, dz: 0, speed };
  let hit: ReturnType<typeof walk> = null;
  if (l > 0) {
    const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw), rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw), k = (speed * dt) / Math.max(1, l);
    stride.dx = (fx * f + rx * s) * k; stride.dz = (fz * f + rz * s) * k;
    hit = walk(w, b, stride.dx, stride.dz, swim ? CLIMB_OUT : STEP_UP);
  }
  if (p.kx || p.kz) {
    walk(w, b, p.kx * dt, p.kz * dt);
    const k = Math.max(0, 1 - dt * 6);
    p.kx *= k; p.kz *= k;
    if (Math.hypot(p.kx, p.kz) < 0.05) p.kx = p.kz = 0;
  }
  p.moved = Math.hypot(b.x - ox, b.z - oz);

  /* weight; in deep water you float at the surface, and swim up or down */
  if (swim) {
    const target = inp.rise ? 2 : inp.sink ? -2 : clamp((depth - SWIM - 0.05) * 3, -1, 1);
    b.vy += (target - b.vy) * Math.min(1, dt * 6);
    p.impact = fall(w, b, dt, 0).impact;
  } else p.impact = fall(w, b, dt).impact;

  /* breath */
  p.under = b.y + eyeHeight(p) < w.waterAt(b.x, b.z);
  p.air = p.under ? Math.max(0, p.air - dt) : Math.min(AIR, p.air + dt * 40);
  return { stride, hit };
}
