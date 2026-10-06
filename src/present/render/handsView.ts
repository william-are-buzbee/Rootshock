import * as THREE from 'three';
import { clamp } from '../../core/math';
import { loadTime, wstats } from '../../sim/combat';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { dynamicMaterial } from './shader';
import { parts, type Part } from './things';

/* What is in your hand, in front of the camera: the first engine's weaponModel, and how it loads, swings and kicks. */

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
    this.vm.rotation.z = -0.15;
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
    const l = this.L.atPoint(b.x, b.y + 1, b.z);
    (this.mat.uniforms.uLight.value as THREE.Vector3).set(l[0], l[1], l[2]);
    const w = wstats(g.weapon), fist = !g.weapon, sw = h.swing;
    const ld = h.chg >= 0 ? clamp(h.chg / loadTime(sim, w), 0, 1) : 0;
    vm.rotation.y = fist ? 0.12 : 0;
    if (w.gun) {
      vm.rotation.x = h.kick * 0.5;
      vm.position.set(0.22, -0.3 + h.kick * 0.04 + Math.sin(bob) * 0.01, -0.42 + h.kick * 0.12);
    } else if (sw) {
      const q = Math.min(1, sw.t / sw.dur), L = 1;
      if (fist) {
        const out = 0.6;
        vm.rotation.x = 0.05;
        if (q < 0.4) { const t = q / 0.4; vm.position.set(0.26 - t * 0.16, -0.3 + t * 0.1, -0.42 + 0.2 * (1 - t) - t * out); }
        else { const t = (q - 0.4) / 0.6; vm.position.set(0.1 + t * 0.16, -0.2 - t * 0.1, -0.42 - out * (1 - t)); }
      } else if (q < 0.45) {
        const t = q / 0.45;
        vm.rotation.x = (-0.5 + L) * (1 - t) - 1.9 * t;
        vm.position.set(0.3 + L * 0.08 - t * (0.28 + L * 0.08), -0.34 + L * 0.14 * (1 - t) + 0.04 * t, -0.5 + L * 0.1 * (1 - t) - t * 0.15);
      } else {
        const t = (q - 0.45) / 0.55;
        vm.rotation.x = -1.9 + t * 1.4;
        vm.position.set(0.02 + t * 0.28, -0.3 - t * 0.04, -0.65 + t * 0.15);
      }
    } else if (fist) {
      vm.rotation.x = 0.05;
      vm.position.set(0.26 + ld * 0.04, -0.3 - ld * 0.03 + Math.sin(bob) * 0.012, -0.42 + ld * 0.2);
    } else {
      /* loaded and held: it trembles */
      const tr = ld >= 1 ? Math.sin(time * 38) * 0.012 : 0;
      vm.rotation.x = -0.5 + ld + Math.sin(bob * 0.5) * 0.02 + tr;
      vm.position.set(0.3 + ld * 0.08, -0.34 + ld * 0.14 + Math.sin(bob) * 0.012, -0.5 + ld * 0.1);
    }
  }
}
