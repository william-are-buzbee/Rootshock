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
  private bob = 0;
  private fwd = { x: 0, y: 0, z: -1 };

  update(cam: THREE.PerspectiveCamera, sim: Sim, prev: Prev, alpha: number, dt: number, look: { yaw: number; pitch: number }): void {
    const p = sim.player, b = p.body;
    const x = prev.x + (b.x - prev.x) * alpha, y = prev.y + (b.y - prev.y) * alpha, z = prev.z + (b.z - prev.z) * alpha;
    if (Number.isNaN(this.cy)) this.cy = y;
    this.cy += (y - this.cy) * Math.min(1, dt * 18);
    this.eye += ((p.crouch ? 0.95 : 1.62) - this.eye) * Math.min(1, dt * 10);
    this.bob += (p.moved / STEP) * dt * 3.3;
    const yaw = p.yaw + look.yaw, pitch = clamp(p.pitch + look.pitch, -1.45, 1.45);
    cam.position.set(x, this.cy + this.eye + Math.sin(this.bob) * 0.035, z);
    cam.rotation.set(pitch, yaw, 0);
    const cp = Math.cos(pitch);
    this.fwd = { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
    U.uFlashDir.value.set(this.fwd.x, this.fwd.y, this.fwd.z);
    U.uFlash.value = p.light ? 1 : 0;
  }
}
