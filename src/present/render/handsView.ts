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
   A swung thing is drawn as the sim swings it (sim/sweep.ts): a side swing drawn back to the right and brought across
   right to left; the axe lifted straight up over your head and brought straight down; fists and the knife driven
   straight out. It crosses the middle of the view in the part of the swing that can land. It stops in what it hits,
   rocking back a little off it; one that glances off a wall jumps back further and shakes. */

const HALF = Math.PI / 2;
/** how far past the start of its path a loaded swing is drawn back (radians): a side swing far enough to read as drawn,
 *  not so far it leaves the view; the axe up over your head */
const DRAWN: Record<Shape, number> = { side: 0.3, chop: 0.87, thrust: 0 };
/** where the axe is held at rest, pointing up and a little forward (its angle up from straight ahead) */
const AXE_REST = HALF - 0.5;
const ease = (t: number) => t * t * (3 - 2 * t);

/** where a swung thing points across its swing, `q` (0..1) through it: from drawn back, across the part that can land,
 *  and on through. One that met one of the cast at `hq` stops there, rocked back a little off it; one that glanced
 *  off the world at `gq` jumps back further the way it came */
function swept(shape: Shape, q: number, gq?: number, hq?: number): number {
  const P = PATHS[shape], back = P.from + DRAWN[shape], on = P.to - 0.6;
  const at = (k: number) => k < ACTIVE.from ? back + (P.from - back) * ease(k / ACTIVE.from)
    : k < ACTIVE.to ? P.from + ((P.to - P.from) * (k - ACTIVE.from)) / (ACTIVE.to - ACTIVE.from)
      : P.to + (on - P.to) * ease((k - ACTIVE.to) / (1 - ACTIVE.to));
  const stop = gq ?? hq;
  if (stop === undefined || q < stop) return at(q);
  const g = at(stop), k = (q - stop) / Math.max(1e-3, 1 - stop);
  return g + (P.from - g) * (gq !== undefined ? 0.35 : 0.08) * Math.sin(Math.min(1, k * 3) * HALF);
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
    const shape = w.shape, thrust = fist || shape === 'thrust', tilt = -0.15;
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
      /* driven straight out and back: fists, or the knife's point first; stopped short where it met something */
      const stop = sw.struck ?? sw.glance, q = Math.min(1, sw.t / sw.dur, stop !== undefined ? Math.max(stop, 0.4) : 1);
      const out = fist ? 0.6 : 0.45, sh = sw.glance !== undefined && sw.t / sw.dur > sw.glance ? Math.sin(time * 60) * 0.015 : 0;
      vm.rotation.x = fist ? 0.05 : -HALF + 0.1;
      if (q < 0.4) { const t = q / 0.4; vm.position.set(0.26 - t * 0.16, -0.3 + t * 0.1, -0.42 + 0.2 * (1 - t) - t * out); }
      else { const t = (q - 0.4) / 0.6; vm.position.set(0.1 + t * 0.16 + sh, -0.2 - t * 0.1, -0.42 - out * (1 - t)); }
    } else if (sw && shape === 'chop') {
      /* the axe, straight down from over your head, in the one upright plane it was lifted in */
      const q = Math.min(1, sw.t / sw.dur), th = swept(shape, q, sw.glance, sw.struck);
      const sh = sw.glance !== undefined && q > sw.glance ? Math.sin(time * 55) * 0.04 * (1 - q) : 0;
      vm.rotation.set(th - HALF + sh, 0, -0.15);
      vm.position.set(0.18, -0.32 + 0.16 * Math.sin(th), -0.38);
    } else if (sw) {
      /* swung across: pointing out from you, turned through the sweep, in its plane */
      const q = Math.min(1, sw.t / sw.dur), th = swept(shape, q, sw.glance, sw.struck);
      const sh = sw.glance !== undefined && q > sw.glance ? Math.sin(time * 55) * 0.04 * (1 - q) : 0;
      vm.rotation.set(-HALF + 0.35 - 0.25 * Math.min(1, q / ACTIVE.to) + sh, -th, tilt);
      vm.position.set(0.16 + 0.14 * Math.sin(th), -0.28, -0.32);
    } else if (shape === 'chop') {
      /* the axe at rest, held up before you; loading, lifted straight up over your head, and trembling once it is */
      const tr = ld >= 1 ? Math.sin(time * 38) * 0.012 : 0, e = ease(ld), th = AXE_REST + (PATHS.chop.from + DRAWN.chop - AXE_REST) * e;
      vm.rotation.set(th - HALF + Math.sin(bob * 0.5) * 0.02 * (1 - e) + tr, 0, -0.15);
      vm.position.set(0.3 + (0.18 - 0.3) * e, -0.34 + (-0.32 + 0.16 * Math.sin(th) + 0.34) * e + Math.sin(bob) * 0.012 * (1 - e), -0.5 + 0.12 * e);
    } else if (thrust) {
      vm.rotation.x = fist ? 0.05 : -HALF + 0.1;
      vm.position.set(0.26 + ld * 0.04, -0.3 - ld * 0.03 + Math.sin(bob) * 0.012, -0.42 + ld * 0.2);
    } else {
      /* at rest, held up before you; loading, drawn back to the right where the swing starts, and trembling once it is
         all the way */
      const tr = ld >= 1 ? Math.sin(time * 38) * 0.012 : 0, e = ease(ld), back = PATHS[shape].from + DRAWN[shape];
      vm.rotation.set((-0.5 + Math.sin(bob * 0.5) * 0.02) * (1 - e) + (-HALF + 0.35) * e + tr, -back * e, -0.15 * (1 - e) + tilt * e);
      vm.position.set(0.3 - 0.14 * e + 0.14 * Math.sin(back) * e, -0.34 + 0.06 * e + Math.sin(bob) * 0.012 * (1 - e), -0.5 + 0.18 * e);
    }
  }
}
