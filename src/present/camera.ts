import type * as THREE from 'three';
import { clamp } from '../core/math';
import { STEP } from '../core/loop';
import type { Sim } from '../sim/sim';
import type { Dyn } from '../world/world';
import { U } from './render/shader';

/** what the beam's bounce passes through: the cast, not the walls */
/** what sight goes through: bodies, and glass */
const seeThrough = (d: Dyn) => d.kind === 'body' || !!d.glass;

/** where the player's body was at the start of the latest step, so the camera can draw between steps */
export interface Prev { x: number; y: number; z: number }

/** The eye: follows the body between sim steps, eases over steps, bobs as you walk. All of it is looks only. */
export class CameraRig {
  private cy = NaN;
  private eye = 1.62;
  /** the walk's sway, for the hand as well */
  bob = 0;
  /** how hard the view shakes, dying away */
  shake = 0;
  /** where the beam points: it trails the view a little, as a light held in a hand does, and sways as you walk */
  private beam = { x: 0, y: 0, z: -1 };
  private snap = true;
  private t = 0;
  private bounce = 0;
  /** jolts to the view, in radians (yaw, pitch, roll): put on at once, easing off */
  private jolt = { y: 0, p: 0, r: 0 };

  /** your blow landed, this hard (0..1): the view dips into it */
  impact(k: number): void {
    this.jolt.p -= 0.022 * k;
    this.jolt.r += 0.012 * k;
  }

  /** you were struck from `bearing` (radians from straight ahead, clockwise): the view is knocked away from it */
  struck(bearing: number): void {
    const side = Math.sin(bearing), ahead = Math.cos(bearing);
    this.jolt.y += 0.07 * side;
    this.jolt.r -= 0.06 * side;
    this.jolt.p += 0.045 * ahead;
  }

  /** a new place (another level): no easing in from where you were */
  reset(): void {
    this.cy = NaN;
    this.snap = true;
  }

  update(cam: THREE.PerspectiveCamera, sim: Sim, prev: Prev, alpha: number, dt: number, look: { yaw: number; pitch: number }): void {
    const p = sim.player, b = p.body;
    const x = prev.x + (b.x - prev.x) * alpha, y = prev.y + (b.y - prev.y) * alpha, z = prev.z + (b.z - prev.z) * alpha;
    if (Number.isNaN(this.cy)) this.cy = y;
    this.cy += (y - this.cy) * Math.min(1, dt * 18);
    this.eye += ((p.crouch ? 0.95 : 1.62) - this.eye) * Math.min(1, dt * 10);
    this.bob += (p.moved / STEP) * dt * 3.3;
    const yaw = p.yaw + look.yaw, pitch = clamp(p.pitch + look.pitch, -1.45, 1.45);
    this.shake = Math.max(0, this.shake - dt * 1.6);
    const k = this.shake * 0.08, j = () => (Math.random() * 2 - 1) * k;
    cam.position.set(x + j(), this.cy + this.eye + Math.sin(this.bob) * 0.035 + j(), z + j());
    const J = this.jolt, ease = Math.exp(-dt * 9);
    J.y *= ease; J.p *= ease; J.r *= ease;
    cam.rotation.set(pitch + J.p, yaw + J.y, J.r);
    /* the hand follows the eye a beat late (about 70 ms), wanders with the stride and, standing, with your breath */
    this.t += dt;
    const sway = Math.min(1, p.moved / STEP / 3), by = yaw + Math.sin(this.bob * 0.5) * 0.022 * sway + Math.sin(this.t * 0.7) * 0.004;
    const bp = pitch + (Math.abs(Math.cos(this.bob * 0.5)) - 0.6) * 0.03 * sway + Math.sin(this.t * 1.1) * 0.005;
    const bc = Math.cos(bp), want = { x: -Math.sin(by) * bc, y: Math.sin(bp), z: -Math.cos(by) * bc };
    const B = this.beam, f = this.snap ? 1 : 1 - Math.exp(-dt * 14);
    this.snap = false;
    B.x += (want.x - B.x) * f; B.y += (want.y - B.y) * f; B.z += (want.z - B.z) * f;
    const n = Math.hypot(B.x, B.y, B.z) || 1;
    B.x /= n; B.y /= n; B.z /= n;
    U.uFlashDir.value.set(B.x, B.y, B.z);
    const g = sim.game, low = g.batt < 15 ? 0.6 : 1;
    U.uFlash.value = g.lightOn && g.light === 'flash' ? low : 0;
    /* bounce: a wall close in front of the beam lights the space around you a little; far off, it gives nothing back */
    const R = 8, ex = x, ey = this.cy + this.eye, ez = z;
    const hit = U.uFlash.value > 0 ? sim.world.raycast(ex, ey, ez, ex + B.x * R, ey + B.y * R, ez + B.z * R, seeThrough) : 1;
    const bounce = hit < 1 ? (U.uFlash.value * 0.16) / (1 + 0.3 * (hit * R) ** 2) : 0;
    this.bounce += (bounce - this.bounce) * Math.min(1, dt * 10);
    U.uBounce.value = this.bounce;
    U.uLamp.value = sim.hands.muzzle > 0 ? 2.5 : g.lightOn && g.light === 'lantern' ? low : 0;
  }
}
