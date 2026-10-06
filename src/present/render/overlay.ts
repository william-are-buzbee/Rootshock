import * as THREE from 'three';
import { blowKind } from '../../sim/cast';
import type { Sim } from '../../sim/sim';
import type { Box } from '../../world/shapes';

/* Dev only (?dev, then O): every collider drawn as lines. Fixed boxes in grey, sloped surfaces in green, whatever moves
   in amber, the player's body in white. A blow under way is drawn as the ground it covers: orange as it winds up, red
   while it can land, blue as it recovers. */
const PHASE = { wind: [1, 0.55, 0.1], strike: [1, 0.1, 0.1], after: [0.3, 0.5, 1] } as const;
export class Overlay {
  private fixed: THREE.LineSegments;
  private moving: THREE.LineSegments;
  private blows: THREE.LineSegments;
  on = false;

  constructor(scene: THREE.Object3D, private sim: Sim) {
    const w = sim.world, P: number[] = [];
    w.forEachBox(b => boxLines(b, P));
    const S: number[] = [];
    for (const s of w.surfaces) {
      const d = s.def, on = (i: number, j: number) => !d.mask || s.has(d.x0 + (i + 0.5) * d.res, d.z0 + (j + 0.5) * d.res);
      for (let j = 0; j < d.nz; j++) for (let i = 0; i < d.nx - 1; i++) if (on(i, j) || on(i, j - 1)) S.push(d.x0 + i * d.res, d.h[j * d.nx + i], d.z0 + j * d.res, d.x0 + (i + 1) * d.res, d.h[j * d.nx + i + 1], d.z0 + j * d.res);
      for (let i = 0; i < d.nx; i++) for (let j = 0; j < d.nz - 1; j++) if (on(i, j) || on(i - 1, j)) S.push(d.x0 + i * d.res, d.h[j * d.nx + i], d.z0 + j * d.res, d.x0 + i * d.res, d.h[(j + 1) * d.nx + i], d.z0 + (j + 1) * d.res);
    }
    this.fixed = new THREE.LineSegments(lineGeo([...P]), new THREE.LineBasicMaterial({ color: 0x9a9a90 }));
    const sl = new THREE.LineSegments(lineGeo(S), new THREE.LineBasicMaterial({ color: 0x5fae6a }));
    this.fixed.add(sl);
    this.moving = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xc9a227 }));
    this.blows = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ vertexColors: true }));
    for (const o of [this.fixed, this.moving, this.blows]) { o.visible = false; o.frustumCulled = false; scene.add(o); }
  }

  toggle(): void {
    this.on = !this.on;
    this.fixed.visible = this.moving.visible = this.blows.visible = this.on;
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
    /* each blow under way: the fan of its arc out to its reach, at its feet and at a metre */
    const B: number[] = [], C: number[] = [];
    for (const m of this.sim.cast) {
      const K = blowKind(m);
      if (m.dead || !m.blow || !K) continue;
      const half = Math.acos(K.arc), R = m.r + K.reach, c = PHASE[m.blow.ph], n = 12;
      const at = (a: number, r: number, y: number) => [m.x + Math.sin(a) * r, y, m.z + Math.cos(a) * r];
      for (const y of [m.y + 0.05, m.y + 1]) {
        for (const e of [-half, half]) B.push(...at(0, 0, y), ...at(m.yaw + e, R, y));
        for (let k = 0; k < n; k++) B.push(...at(m.yaw - half + (2 * half * k) / n, R, y), ...at(m.yaw - half + (2 * half * (k + 1)) / n, R, y));
      }
      while (C.length < B.length) C.push(...c);
    }
    this.blows.geometry.dispose();
    this.blows.geometry = lineGeo(B);
    this.blows.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(C), 3));
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
