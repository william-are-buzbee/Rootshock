import * as THREE from 'three';
import { clamp } from '../../core/math';
import { loadTime, wstats } from '../../sim/combat';
import { ACTIVE, PATHS } from '../../sim/sweep';
import type { Shape } from '../../content/items';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { dynamicMaterial, lightMaterial } from './shader';
import { parts, type Part } from './things';

/* What is in your hand, in front of the camera: the first engine's weaponModel, and how it loads, swings and kicks.
   A swung thing is drawn as the sim swings it (sim/sweep.ts): drawn back to the right and brought across right to left;
   the axe raised up and right and brought down to the left; fists and the knife driven straight out. It crosses the
   middle of the view in the part of the swing that can land, and one that glances off a wall jumps back. */

const HALF = Math.PI / 2;
/** how far past the start of its path a loaded swing is drawn back (radians): far enough to read as drawn, not so far
 *  it leaves the view */
const DRAWN = 0.3;
const ease = (t: number) => t * t * (3 - 2 * t);

/** where a swung thing points across its swing, `q` (0..1) through it: from drawn back, across the part that can land,
 *  and on through; one that glanced at `gq` jumps back the way it came and shakes */
function swept(shape: Shape, q: number, gq?: number): number {
  const P = PATHS[shape], back = P.from + DRAWN, on = P.to - 0.6;
  const at = (k: number) => k < ACTIVE.from ? back + (P.from - back) * ease(k / ACTIVE.from)
    : k < ACTIVE.to ? P.from + ((P.to - P.from) * (k - ACTIVE.from)) / (ACTIVE.to - ACTIVE.from)
      : P.to + (on - P.to) * ease((k - ACTIVE.to) / (1 - ACTIVE.to));
  if (gq === undefined || q < gq) return at(q);
  const g = at(gq), k = (q - gq) / Math.max(1e-3, 1 - gq);
  return g + (P.from - g) * 0.35 * Math.sin(Math.min(1, k * 2) * HALF);
}

function weaponParts(id: string | null): Part[] {
  switch (id) {
    case 'baton': return [['cyl', 0x1c1e20, 0.05, 0.6, 0.05, 0, 0.22, 0]];
    case 'pipe': return [['cyl', 0x7a7e84, 0.055, 0.85, 0.055, 0, 0.3, 0]];
    case 'wrench': return [['box', 0x8a3a2a, 0.05, 0.5, 0.03, 0, 0.2, 0], ['box', 0x9a9ea4, 0.12, 0.1, 0.04, 0, 0.47, 0]];
    case 'knife': return [['box', 0x22262a, 0.03, 0.12, 0.03, 0, 0, 0], ['box', 0xc8ccd0, 0.012, 0.24, 0.045, 0, 0.18, 0]];
    case 'axe': return [['box', 0x7a5a34, 0.04, 0.95, 0.045, 0, 0.3, 0], ['box', 0xa82a20, 0.045, 0.16, 0.24, 0, 0.72, -0.09]];
    case 'adjwrench': return [['box', 0xb8bcc0, 0.04, 0.4, 0.025, 0, 0.16, 0], ['box', 0xb8bcc0, 0.1, 0.08, 0.03, 0, 0.38, 0]];
    case 'pistol': return [['box', 0x1c1e20, 0.04, 0.06, 0.24, 0, 0.12, -0.1], ['box', 0x1c1e20, 0.04, 0.14, 0.05, 0, 0.04, 0]];
    case 'shotgun': return [['box', 0x1c1e20, 0.05, 0.06, 0.7, 0, 0.1, -0.3], ['box', 0x5a4034, 0.05, 0.1, 0.26, 0, 0.06, 0.12], ['box', 0x5a4034, 0.055, 0.05, 0.2, 0, 0.06, -0.3]];
    default: return [['box', 0xb08572, 0.1, 0.11, 0.14, 0, 0.02, -0.02], ['box', 0xb5541c, 0.1, 0.1, 0.34, 0, 0.01, 0.22]];
  }
}

export class HandsView {
  private vm = new THREE.Group();
  private mat = dynamicMaterial();
  private mesh: THREE.Mesh | null = null;
  private id: string | null | undefined = undefined;

  constructor(camera: THREE.Camera, public sim: Sim, private L: Lighting) {
    /* turned first to point out from you, then swung about the up of the plane it sweeps in, then that plane tilted */
    this.vm.rotation.order = 'ZYX';
    camera.add(this.vm);
  }

  setLighting(L: Lighting): void { this.L = L; }

  update(bob: number, time: number): void {
    const sim = this.sim, g = sim.game, h = sim.hands, b = sim.player.body, vm = this.vm;
    if (this.id !== g.weapon) {
      this.id = g.weapon;
      if (this.mesh) { this.vm.remove(this.mesh); this.mesh.geometry.dispose(); }
      this.mesh = new THREE.Mesh(parts(weaponParts(g.weapon)), this.mat);
      this.mesh.frustumCulled = false;
      this.vm.add(this.mesh);
    }
    lightMaterial(this.mat, this.L.atPoint(b.x, b.y + 1, b.z), this.L.flickAt(b.x, b.y + 1, b.z));
    const w = wstats(g.weapon), fist = !g.weapon, sw = h.swing;
    const ld = h.chg >= 0 ? clamp(h.chg / loadTime(sim, w), 0, 1) : 0;
    const shape = w.shape, thrust = fist || shape === 'thrust', tilt = shape === 'chop' ? PATHS.chop.tilt : -0.15;
    vm.rotation.set(0, fist ? 0.12 : 0, -0.15);
    if (h.stag > 0 || h.down > 0 || h.rise > 0) {
      /* reeling, or on the floor: the arm flung down and out, shaking, until you have your feet again */
      const e = h.down > 0 ? 1 : h.rise > 0 ? Math.min(1, h.rise / 0.3) : Math.min(1, h.stag / 0.25), sh = Math.sin(time * 31) * 0.02 * e;
      vm.rotation.x = 0.7 * e + sh;
      vm.position.set(0.34 + 0.06 * e, -0.36 - 0.18 * e + sh, -0.42 + 0.06 * e);
    } else if (w.gun) {
      vm.rotation.x = h.kick * 0.5;
      vm.position.set(0.22, -0.3 + h.kick * 0.04 + Math.sin(bob) * 0.01, -0.42 + h.kick * 0.12);
    } else if (sw && thrust) {
      /* driven straight out and back: fists, or the knife's point first */
      const q = Math.min(1, sw.t / sw.dur), out = fist ? 0.6 : 0.45, sh = sw.glance !== undefined && q > sw.glance ? Math.sin(time * 60) * 0.015 : 0;
      vm.rotation.x = fist ? 0.05 : -HALF + 0.1;
      if (q < 0.4) { const t = q / 0.4; vm.position.set(0.26 - t * 0.16, -0.3 + t * 0.1, -0.42 + 0.2 * (1 - t) - t * out); }
      else { const t = (q - 0.4) / 0.6; vm.position.set(0.1 + t * 0.16 + sh, -0.2 - t * 0.1, -0.42 - out * (1 - t)); }
    } else if (sw) {
      /* swung across: pointing out from you, turned through the sweep, in its plane */
      const q = Math.min(1, sw.t / sw.dur), th = swept(shape, q, sw.glance);
      const sh = sw.glance !== undefined && q > sw.glance ? Math.sin(time * 55) * 0.04 * (1 - q) : 0;
      vm.rotation.set(-HALF + 0.35 - 0.25 * Math.min(1, q / ACTIVE.to) + sh, -th, tilt);
      vm.position.set(0.16 + 0.14 * Math.sin(th), -0.28 + (shape === 'chop' ? 0.1 * Math.sin(th) : 0), -0.32);
    } else if (thrust) {
      vm.rotation.x = fist ? 0.05 : -HALF + 0.1;
      vm.position.set(0.26 + ld * 0.04, -0.3 - ld * 0.03 + Math.sin(bob) * 0.012, -0.42 + ld * 0.2);
    } else {
      /* at rest, held up before you; loading, drawn back to where the swing starts (right, or for the axe up and
         right), and trembling once it is all the way */
      const tr = ld >= 1 ? Math.sin(time * 38) * 0.012 : 0, e = ease(ld), back = PATHS[shape].from + DRAWN;
      vm.rotation.set((-0.5 + Math.sin(bob * 0.5) * 0.02) * (1 - e) + (-HALF + 0.35) * e + tr, -back * e, -0.15 * (1 - e) + tilt * e);
      const lift = shape === 'chop' ? 0.1 * Math.sin(back) : 0;
      vm.position.set(0.3 - 0.14 * e + 0.14 * Math.sin(back) * e, -0.34 + (0.06 + lift) * e + Math.sin(bob) * 0.012 * (1 - e), -0.5 + 0.18 * e);
    }
  }
}
