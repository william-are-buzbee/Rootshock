import type * as THREE from 'three';
import { clamp } from '../core/math';
import { STEP } from '../core/loop';
import type { Sim } from '../sim/sim';
import { U } from './render/shader';

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
  private fwd = { x: 0, y: 0, z: -1 };

  /** a new place (another level): no easing in from where you were */
  reset(): void {
    this.cy = NaN;
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
    cam.rotation.set(pitch, yaw, 0);
    const cp = Math.cos(pitch);
    this.fwd = { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
    U.uFlashDir.value.set(this.fwd.x, this.fwd.y, this.fwd.z);
    const g = sim.game, low = g.batt < 15 ? 0.6 : 1;
    U.uFlash.value = g.lightOn && g.light === 'flash' ? low : 0;
    U.uLamp.value = sim.hands.muzzle > 0 ? 2.5 : g.lightOn && g.light === 'lantern' ? low : 0;
  }
}
