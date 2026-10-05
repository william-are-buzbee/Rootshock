import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { hex, scale3 } from '../../core/math';
import type { Sim } from '../../sim/sim';
import type { World } from '../../world/world';
import { propVerts } from './levelMesh';
import { TEMPLATES } from './templates';
import { dynamicMaterial, glassMaterial } from './shader';

/* What moves, drawn where the sim says it is: doors, platforms, loose crates. And the water, which does not move but
   is see-through, so it is drawn on its own. Each moving thing is lit by the room it is in. */

interface Moving { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; place(): void }

function coloured(src: Float32Array, c: Colour): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry(), n = src.length / 3, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set(c, i * 3);
  g.setAttribute('position', new THREE.BufferAttribute(src, 3));
  g.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  return g;
}

export class Things {
  private list: Moving[] = [];

  constructor(private scene: THREE.Scene, private sim: Sim) {
    const w = sim.world;
    for (const d of sim.doors) {
      const D = d.def, sx = D.x1 - D.x0, sy = D.y1 - D.y0, sz = D.z1 - D.z0;
      this.add(coloured(TEMPLATES.box, hex(0x3a3e43)), m => {
        m.scale.set(sx, sy, sz);
        m.position.set((d.dyn.x0 + d.dyn.x1) / 2, (d.dyn.y0 + d.dyn.y1) / 2, (d.dyn.z0 + d.dyn.z1) / 2);
      });
    }
    for (const p of sim.platforms) {
      const D = p.def;
      this.add(coloured(TEMPLATES.box, D.colour), m => {
        m.scale.set(D.x1 - D.x0, 0.2, D.z1 - D.z0);
        m.position.set((D.x0 + D.x1) / 2, p.y - 0.1, (D.z0 + D.z1) / 2);
      });
    }
    for (const o of sim.loose.all) {
      const pts: number[] = [];
      propVerts({ ...o.prop, ry: 0 }, (x, y, z) => pts.push(x, y, z), { x: 0, y: 0, z: 0 });
      this.add(coloured(new Float32Array(pts), o.prop.colour), m => m.position.set(o.x, o.y, o.z));
    }
    this.water(w);
  }

  private add(geo: THREE.BufferGeometry, place: (m: THREE.Mesh) => void): void {
    const mat = dynamicMaterial(), mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    this.list.push({ mesh, mat, place: () => place(mesh) });
  }

  private water(w: World): void {
    if (!w.water.length) return;
    const P: number[] = [], C: number[] = [], L: number[] = [], c = hex(0x123a40);
    for (const s of w.water) {
      const R = w.roomAt((s.x0 + s.x1) / 2, s.level + 0.1, (s.z0 + s.z1) / 2), l = R ? scale3(R.light, 1.2) : [0, 0, 0];
      for (const [x, z] of [[s.x0, s.z0], [s.x1, s.z0], [s.x1, s.z1], [s.x0, s.z0], [s.x1, s.z1], [s.x0, s.z1]]) {
        P.push(x, s.level, z); C.push(...c); L.push(l[0], l[1], l[2], 0);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
    g.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(C), 3));
    g.setAttribute('aLight', new THREE.BufferAttribute(new Float32Array(L), 4));
    const m = new THREE.Mesh(g, glassMaterial(0.78));
    m.frustumCulled = false;
    m.renderOrder = 1;
    this.scene.add(m);
  }

  /** move everything to where the sim has it, and light it by where it is */
  update(): void {
    const w = this.sim.world;
    for (const t of this.list) {
      t.place();
      const p = t.mesh.position, R = w.roomAt(p.x, p.y + 0.3, p.z) ?? w.roomAt(p.x, p.y + 1.2, p.z);
      const l = R ? R.light : [0, 0, 0];
      (t.mat.uniforms.uLight.value as THREE.Vector3).set(l[0], l[1], l[2]);
    }
  }
}
