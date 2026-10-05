import * as THREE from 'three';
import type { Sim } from '../../sim/sim';
import type { Box } from '../../world/shapes';

/* Dev only (?dev, then G): every collider drawn as lines. Fixed boxes in grey, sloped surfaces in green, whatever moves
   in amber, the player's body in white. */
export class Overlay {
  private fixed: THREE.LineSegments;
  private moving: THREE.LineSegments;
  on = false;

  constructor(scene: THREE.Scene, private sim: Sim) {
    const w = sim.world, P: number[] = [];
    w.forEachBox(b => boxLines(b, P));
    const S: number[] = [];
    for (const s of w.surfaces) {
      const d = s.def;
      for (let j = 0; j < d.nz; j++) for (let i = 0; i < d.nx - 1; i++) S.push(d.x0 + i * d.res, d.h[j * d.nx + i], d.z0 + j * d.res, d.x0 + (i + 1) * d.res, d.h[j * d.nx + i + 1], d.z0 + j * d.res);
      for (let i = 0; i < d.nx; i++) for (let j = 0; j < d.nz - 1; j++) S.push(d.x0 + i * d.res, d.h[j * d.nx + i], d.z0 + j * d.res, d.x0 + i * d.res, d.h[(j + 1) * d.nx + i], d.z0 + (j + 1) * d.res);
    }
    this.fixed = new THREE.LineSegments(lineGeo([...P]), new THREE.LineBasicMaterial({ color: 0x9a9a90 }));
    const sl = new THREE.LineSegments(lineGeo(S), new THREE.LineBasicMaterial({ color: 0x5fae6a }));
    this.fixed.add(sl);
    this.moving = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xc9a227 }));
    for (const o of [this.fixed, this.moving]) { o.visible = false; o.frustumCulled = false; scene.add(o); }
  }

  toggle(): void {
    this.on = !this.on;
    this.fixed.visible = this.moving.visible = this.on;
  }

  update(): void {
    if (!this.on) return;
    const P: number[] = [];
    for (const d of this.sim.world.dyn) if (d.kind !== 'body') boxLines(d, P);
    const b = this.sim.player.body;
    for (let k = 0; k < 16; k++) {
      const a0 = (k / 16) * Math.PI * 2, a1 = ((k + 1) / 16) * Math.PI * 2;
      for (const y of [b.y + 0.02, b.y + b.h]) P.push(b.x + Math.cos(a0) * b.r, y, b.z + Math.sin(a0) * b.r, b.x + Math.cos(a1) * b.r, y, b.z + Math.sin(a1) * b.r);
    }
    this.moving.geometry.dispose();
    this.moving.geometry = lineGeo(P);
  }
}

function lineGeo(P: number[]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
  return g;
}

function boxLines(b: Box, P: number[]): void {
  const x = [b.x0, b.x1], y = [b.y0, b.y1], z = [b.z0, b.z1];
  for (const i of [0, 1]) for (const j of [0, 1]) {
    P.push(x[0], y[i], z[j], x[1], y[i], z[j]);
    P.push(x[i], y[0], z[j], x[i], y[1], z[j]);
    P.push(x[i], y[j], z[0], x[i], y[j], z[1]);
  }
}
