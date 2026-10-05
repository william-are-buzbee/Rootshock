import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { hex, scale3 } from '../../core/math';
import type { Sim } from '../../sim/sim';
import type { DoorDef } from '../../content/types';
import type { World } from '../../world/world';
import type { Lighting } from '../../world/light';
import { propVerts } from './levelMesh';
import { TEMPLATES } from './templates';
import { dynamicMaterial, glassMaterial } from './shader';

/* What moves, drawn where the sim says it is: doors, platforms, loose crates. And the water, which does not move but
   is see-through, so it is drawn on its own. Each moving thing is lit by the room it is in. */

interface Moving { mesh: THREE.Object3D; mat: THREE.ShaderMaterial; place(): void }

/** a part of a fitting: a box (or other shape) of a colour, sized and placed in the fitting's own frame */
type Part = [shape: 'box' | 'cyl', c: number | Colour, sx: number, sy: number, sz: number, x: number, y: number, z: number];

/** many parts as one geometry */
function parts(list: Part[]): THREE.BufferGeometry {
  const P: number[] = [], C: number[] = [];
  for (const [shape, c, sx, sy, sz, x, y, z] of list) {
    const src = TEMPLATES[shape], col = hex(c);
    for (let v = 0; v < src.length; v += 3) { P.push(src[v] * sx + x, src[v + 1] * sy + y, src[v + 2] * sz + z); C.push(col[0], col[1], col[2]); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(C), 3));
  return g;
}

const LIVE: Colour = [2.3, 2.9, 2.4];

/** a door as the first engine drew it, in its own frame: 2 m along x, centred 1.2 m up. Returns the slab and the lights
 *  (indicators, reader, keypad), which show only with power enough to work it. */
function doorParts(D: DoorDef): { body: Part[]; lights: Part[] } {
  const heavy = D.kind === 'heavy', W = 2, body: Part[] = [], lights: Part[] = [];
  if (heavy) {
    body.push(['box', D.lift ? 0x596068 : 0x3b4046, W, 2.4, 0.3, 0, 0, 0], ['box', 0x2a2d31, 0.14, 2.4, 0.36, 0, 0, 0]);
    for (const s of [-1, 1]) {
      body.push(['box', 0xb89b2e, W - 0.1, 0.16, 0.02, 0, -0.95, s * 0.16], ['box', 0xb89b2e, W - 0.1, 0.16, 0.02, 0, 0.95, s * 0.16]);
      lights.push(['box', LIVE, 0.12, 0.12, 0.04, -0.72, 0.05, s * 0.17]);
    }
  } else {
    body.push(['box', D.seal ? 0x45484c : 0x666c73, W, 2.4, 0.1, 0, 0, 0], ['box', 0x15181b, 0.5, 0.3, 0.12, 0, 0.5, 0], ['box', 0x4a4f55, W, 0.1, 0.14, 0, -1.1, 0]);
  }
  if (D.seal) for (const s of [-1, 1]) body.push(['box', 0x2a2c2e, 1.5, 0.1, 0.06, 0, -0.1, s * 0.1]);
  const f = heavy ? 0.17 : 0.07;
  if (D.card) for (const s of [-1, 1]) { body.push(['box', 0x22262a, 0.16, 0.24, 0.04, 0.72, 0.1, s * f]); lights.push(['box', [2.25, 2.45, 2.85], 0.1, 0.05, 0.05, 0.72, 0.16, s * (f + 0.01)]); }
  if (D.code) for (const s of [-1, 1]) {
    body.push(['box', 0x22262a, 0.18, 0.26, 0.04, 0.72, 0.1, s * f]);
    for (let q = 0; q < 9; q++) lights.push(['box', [2.5, 2.6, 2.5], 0.03, 0.03, 0.05, 0.67 + (q % 3) * 0.05, 0.03 + Math.floor(q / 3) * 0.06, s * (f + 0.005)]);
  }
  return { body, lights };
}

/** a platform as the first engine drew it: deck, hazard edges, corner posts, a control post; its top at y 0 */
function platformParts(w: number, h: number): Part[] {
  const out: Part[] = [
    ['box', 0x4a4f55, w - 0.12, 0.16, h - 0.12, 0, -0.08, 0], ['box', 0xb89b2e, w - 0.12, 0.02, 0.12, 0, 0.01, h / 2 - 0.14], ['box', 0xb89b2e, w - 0.12, 0.02, 0.12, 0, 0.01, -h / 2 + 0.14],
    ['box', 0x2c2f33, 0.2, 1.1, 0.2, 0, 0.55, 0], ['box', LIVE, 0.1, 0.1, 0.22, 0, 1.05, 0],
  ];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) out.push(['box', 0x8a7a2a, 0.08, 1.1, 0.08, sx * (w / 2 - 0.14), 0.55, sz * (h / 2 - 0.14)]);
  return out;
}

/** a sign plate: dark, a hazard bar, the name in capitals */
function signMesh(text: string): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 56;
  const x = c.getContext('2d')!;
  x.fillStyle = '#14171a'; x.fillRect(0, 0, 256, 56);
  x.fillStyle = '#c9a227'; x.fillRect(0, 0, 8, 56);
  x.fillStyle = '#d9d4c3';
  x.font = '600 27px "Barlow Condensed","Arial Narrow",Arial,sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(text.toUpperCase(), 132, 30, 236);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.37), new THREE.MeshBasicMaterial({ map: tex }));
}

function coloured(src: Float32Array, c: Colour): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry(), n = src.length / 3, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set(c, i * 3);
  g.setAttribute('position', new THREE.BufferAttribute(src, 3));
  g.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  return g;
}

export class Things {
  private list: Moving[] = [];

  constructor(private scene: THREE.Scene, private sim: Sim, private L: Lighting) {
    const w = sim.world;
    for (const d of sim.doors) {
      const D = d.def, { body, lights } = doorParts(D), long = Math.max(D.x1 - D.x0, D.z1 - D.z0);
      const need = D.kind === 'heavy' ? 2 : 1, shown = L.power(D.circuit) >= need;
      const geo = parts(shown ? [...body, ...lights] : body);
      this.add(geo, m => {
        m.position.set((d.dyn.x0 + d.dyn.x1) / 2, d.dyn.y0 + 1.2, (d.dyn.z0 + d.dyn.z1) / 2);
        m.rotation.y = D.alongX ? 0 : Math.PI / 2;
        m.scale.set(long / 2, 1, 1);
      });
    }
    for (const p of sim.platforms) {
      const D = p.def;
      this.add(parts(platformParts(D.x1 - D.x0, D.z1 - D.z0)), m => m.position.set((D.x0 + D.x1) / 2, p.y, (D.z0 + D.z1) / 2));
    }
    for (const s of w.def.signs) {
      const m = signMesh(s.text);
      m.position.set(s.x, s.y, s.z);
      m.rotation.y = s.yaw;
      (m.material as THREE.MeshBasicMaterial).color.setScalar(L.power(s.circuit) ? 1 : 0.3);
      scene.add(m);
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
      const l = scale3(this.L.atPoint((s.x0 + s.x1) / 2, s.level + 0.1, (s.z0 + s.z1) / 2), 1.2);
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
    for (const t of this.list) {
      t.place();
      const p = t.mesh.position, w = this.sim.world, R = w.roomAt(p.x, p.y + 0.3, p.z) ?? w.roomAt(p.x, p.y + 1.2, p.z);
      const l = R ? this.L.at(R.id, p.x, p.z) : [0, 0, 0];
      (t.mat.uniforms.uLight.value as THREE.Vector3).set(l[0], l[1], l[2]);
    }
  }
}
