import * as THREE from 'three';
import type { Colour } from '../../core/math';
import { hex } from '../../core/math';
import type { Sim } from '../../sim/sim';
import { camLive, heard, speakerY, voiced } from '../../sim/eyes';
import type { DoorDef } from '../../content/types';
import type { World } from '../../world/world';
import type { Lighting } from '../../world/light';
import { apart, propVerts } from './levelMesh';
import { TEMPLATES } from './templates';
import { dynamicMaterial, glassMaterial } from './shader';

/* What moves, drawn where the sim says it is: doors, platforms, loose crates. And the water, which does not move but
   is see-through, so it is drawn on its own. Each moving thing is lit by the room it is in. */

interface Moving {
  mesh: THREE.Object3D; mat: THREE.ShaderMaterial; place(): void;
  /** where its light is taken from, if not where it is now: a door is lit by its doorway, even slid up into the rock */
  litAt?: [number, number, number];
}

/** a part of a fitting: a box (or other shape) of a colour, sized, tipped about z, and placed in the fitting's own frame */
export type Part = [shape: 'box' | 'cyl' | 'ico', c: number | Colour, sx: number, sy: number, sz: number, x: number, y: number, z: number, rz?: number];

/** many parts as one geometry */
export function parts(list: Part[]): THREE.BufferGeometry {
  const P: number[] = [], C: number[] = [];
  list.forEach(([shape, c, sx, sy, sz, x, y, z, rz], k) => {
    const src = TEMPLATES[shape], col = hex(c), cz = Math.cos(rz ?? 0), szn = Math.sin(rz ?? 0), e = 2 * apart(k);
    for (let v = 0; v < src.length; v += 3) {
      /* each part a hair larger than it is, by its place in the list, so flush parts do not fight (levelMesh's apart) */
      const X = src[v] * (sx + e), Y = src[v + 1] * (sy + e);
      P.push(X * cz - Y * szn + x, X * szn + Y * cz + y, src[v + 2] * (sz + e) + z);
      C.push(col[0], col[1], col[2]);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('aCol', new THREE.BufferAttribute(new Float32Array(C), 3));
  return g;
}

const LIVE: Colour = [2.3, 2.9, 2.4];
const R90 = Math.PI / 2;

/** something lying on the floor, as the first engine drew it (itemMesh); anything else is a sheet of paper. `on`: it gives a
 *  light of its own where it lies (a flashlight dropped still on), so its lens glows */
function itemParts(id: string, on = false): Part[] {
  switch (id) {
    case 'baton': return [['cyl', 0x1c1e20, 0.05, 0.55, 0.05, 0, 0.03, 0, R90], ['cyl', 0x3a3d40, 0.06, 0.14, 0.06, -0.2, 0.03, 0, R90]];
    case 'adjwrench': return [['box', 0xb8bcc0, 0.36, 0.03, 0.05, 0, 0.02, 0], ['box', 0xb8bcc0, 0.08, 0.03, 0.12, 0.2, 0.02, 0]];
    case 'pistol': return [['box', 0x1c1e20, 0.2, 0.04, 0.05, 0, 0.03, 0], ['box', 0x1c1e20, 0.05, 0.04, 0.12, -0.07, 0.03, 0.06]];
    case 'shotgun': return [['box', 0x1c1e20, 0.7, 0.05, 0.06, 0, 0.03, 0], ['box', 0x5a4034, 0.25, 0.06, 0.07, -0.4, 0.03, 0]];
    case 'ammo9': return [['box', 0x8a7a2a, 0.12, 0.06, 0.08, 0, 0.03, 0]];
    case 'shells': return [['box', 0xa82a20, 0.14, 0.07, 0.1, 0, 0.035, 0]];
    case 'tacvest': return [['box', 0x23272c, 0.46, 0.14, 0.54, 0, 0.07, 0], ['box', 0x3a4030, 0.12, 0.05, 0.14, -0.1, 0.15, 0.1], ['box', 0x3a4030, 0.12, 0.05, 0.14, 0.1, 0.15, 0.1]];
    case 'goggles': return [['box', 0x22262a, 0.18, 0.05, 0.03, 0, 0.03, 0], ['cyl', [2.2, 2.5, 2.6], 0.07, 0.03, 0.07, -0.05, 0.03, 0.02, R90], ['cyl', [2.2, 2.5, 2.6], 0.07, 0.03, 0.07, 0.05, 0.03, 0.02, R90]];
    case 'rebreather': return [['box', 0x2a2c2e, 0.26, 0.12, 0.2, 0, 0.06, 0], ['cyl', 0xc9a227, 0.09, 0.2, 0.09, 0.08, 0.17, 0, R90], ['box', 0x15181b, 0.05, 0.05, 0.16, -0.1, 0.14, 0.12]];
    case 'surf': return [['box', [2.3, 2.85, 2.5], 0.09, 0.006, 0.06, 0, 0.006, 0]];
    case 'pipe': return [['cyl', 0x7a7e84, 0.06, 0.8, 0.06, 0, 0.03, 0, R90]];
    case 'wrench': return [['box', 0x8a3a2a, 0.45, 0.035, 0.06, 0, 0.02, 0], ['box', 0x9a9ea4, 0.1, 0.035, 0.13, 0.24, 0.02, 0]];
    case 'knife': return [['box', 0x22262a, 0.12, 0.025, 0.03, -0.1, 0.015, 0], ['box', 0xc8ccd0, 0.22, 0.01, 0.045, 0.07, 0.01, 0]];
    case 'axe': return [['box', 0x7a5a34, 0.9, 0.04, 0.045, 0, 0.03, 0], ['box', 0xa82a20, 0.14, 0.035, 0.24, 0.38, 0.03, 0.06]];
    case 'flash': return [['cyl', 0x2a2c2e, 0.06, 0.2, 0.06, 0, 0.035, 0, R90], ['cyl', 0xc9a227, 0.075, 0.05, 0.075, 0.11, 0.04, 0, R90], ...(on ? [['cyl', [2.9, 2.85, 2.6], 0.065, 0.01, 0.065, 0.137, 0.04, 0, R90] as Part] : [])];
    case 'lantern': return [['cyl', 0xc9a227, 0.14, 0.06, 0.14, 0, 0.03, 0], ['cyl', [2.4, 2.6, 2.7], 0.11, 0.14, 0.11, 0, 0.13, 0], ['cyl', 0xc9a227, 0.14, 0.05, 0.14, 0, 0.225, 0], ['box', 0x2a2c2e, 0.16, 0.02, 0.02, 0, 0.3, 0]];
    case 'batt': return [['cyl', 0xb87333, 0.045, 0.1, 0.045, 0, 0.05, 0], ['cyl', 0x22262a, 0.047, 0.04, 0.047, 0, 0.03, 0]];
    case 'medkit': return [['box', 0xd4d8d4, 0.32, 0.14, 0.22, 0, 0.07, 0], ['box', 0xa82a20, 0.12, 0.01, 0.04, 0, 0.145, 0], ['box', 0xa82a20, 0.04, 0.01, 0.12, 0, 0.145, 0]];
    case 'bandage': return [['cyl', 0xd8d4c8, 0.09, 0.07, 0.09, 0, 0.035, 0]];
    case 'ration': return [['box', 0x8a8478, 0.15, 0.03, 0.08, 0, 0.015, 0]];
    case 'peaches': return [['cyl', 0xb8bcc0, 0.09, 0.11, 0.09, 0, 0.055, 0], ['cyl', 0xd88a2a, 0.093, 0.06, 0.093, 0, 0.055, 0]];
    case 'fuse': return [['cyl', 0xd8d0b8, 0.07, 0.22, 0.07, 0, 0.04, 0, R90], ['cyl', 0xb87333, 0.075, 0.04, 0.075, -0.1, 0.04, 0, R90], ['cyl', 0xb87333, 0.075, 0.04, 0.075, 0.1, 0.04, 0, R90]];
    case 'armor': return [['box', 0x23272c, 0.44, 0.12, 0.52, 0, 0.06, 0], ['box', 0x39485a, 0.3, 0.02, 0.1, 0, 0.125, -0.1]];
    case 'hardhat': return [['ico', 0xc9a227, 0.28, 0.2, 0.3, 0, 0.08, 0], ['box', 0xc9a227, 0.2, 0.02, 0.12, 0, 0.02, 0.17]];
    case 'kit': return [['box', 0x39485a, 0.3, 0.12, 0.2, 0, 0.06, 0], ['cyl', 0x1a1c1e, 0.2, 0.05, 0.2, 0, 0.145, 0], ['box', 0xc9a227, 0.3, 0.02, 0.05, 0, 0.125, 0]];
    default: return [['box', [2.5, 2.48, 2.4], 0.2, 0.004, 0.28, 0, 0.004, 0]];
  }
}
/** a turn for something lying on the floor that is the same every time (it used to be random) */
const lie = (x: number, z: number) => (Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1 * Math.PI;

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

/** a camera in its own frame: looking along +z from its lens at the origin, on a stalk up to its mount */
const CAM: Part[] = [
  ['box', 0xb8bcc0, 0.17, 0.17, 0.36, 0, 0, -0.2], ['box', 0x15181b, 0.12, 0.12, 0.03, 0, 0, 0.0],
  ['box', 0x2c2f33, 0.05, 0.4, 0.05, 0, 0.28, -0.3], ['box', 0x2c2f33, 0.14, 0.04, 0.14, 0, 0.48, -0.3],
];

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
  private signs: { mat: THREE.MeshBasicMaterial; circuit: string }[] = [];

  /** the power changed: signs dim or brighten (door lights follow in update) */
  setLighting(L: Lighting): void {
    this.L = L;
    for (const s of this.signs) s.mat.color.setScalar(L.power(s.circuit) ? 1 : 0.3);
  }

  constructor(private scene: THREE.Object3D, private sim: Sim, private L: Lighting) {
    const w = sim.world;
    for (const d of sim.doors) {
      if (d.def.glass) { this.pane(d.def); continue; }
      const D = d.def, { body, lights } = doorParts(D), long = Math.max(D.x1 - D.x0, D.z1 - D.z0), need = D.kind === 'heavy' ? 2 : 1;
      const place = (m: THREE.Object3D) => {
        m.position.set((d.dyn.x0 + d.dyn.x1) / 2, d.dyn.y0 + 1.2, (d.dyn.z0 + d.dyn.z1) / 2);
        m.rotation.y = D.alongX ? 0 : Math.PI / 2;
        m.scale.set(long / 2, 1, 1);
        if (D.vent) m.visible = d.t < 0.5;
      };
      const at: [number, number, number] = [(D.x0 + D.x1) / 2, D.y0, (D.z0 + D.z1) / 2];
      this.add(parts(body), place, at);
      /* its lights show only with power enough to work it */
      if (lights.length) this.add(parts(lights), m => { place(m); m.visible = this.L.power(D.circuit) >= need && !D.vent; }, at);
    }
    for (const p of sim.platforms) {
      const D = p.def;
      this.add(parts(platformParts(D.x1 - D.x0, D.z1 - D.z0)), m => m.position.set((D.x0 + D.x1) / 2, p.y, (D.z0 + D.z1) / 2));
    }
    /* the overseer's eyes: a light that is green while one watches, red while it holds you, and none when it is dead; a
       smashed one hangs askew. Its zones' speakers, with a beacon that turns while the zone sounds. */
    for (const c of sim.cams) {
      const C = c.def, live = () => camLive(sim, c);
      const place = (m: THREE.Object3D) => { m.position.set(C.x, C.y, C.z); m.rotation.set(c.broken ? 0.7 : 0, C.yaw, c.broken ? 0.4 : 0); };
      this.add(parts(CAM), place);
      this.add(parts([['box', [0.4, 2.6, 0.7], 0.045, 0.045, 0.045, 0, 0.1, 0]]), m => { place(m); m.visible = live() && c.hold === 0; });
      this.add(parts([['box', [2.9, 0.35, 0.3], 0.05, 0.05, 0.05, 0, 0.1, 0]]), m => { place(m); m.visible = live() && c.hold > 0; });
    }
    for (const S of w.def.speakers ?? []) {
      /* it hangs from the ceiling: lit by the room under it, not by what is above */
      const y = speakerY(w, S), dead = () => !voiced(sim, S.zone), at: [number, number, number] = [S.x, y - 1, S.z];
      this.add(parts([['box', 0x2c2f33, 0.5, 0.12, 0.5, 0, -0.06, 0]]), m => m.position.set(S.x, y, S.z), at);
      /* a smashed one's horn hangs off its mount by the wires */
      this.add(parts([['cyl', 0x3a3d40, 0.34, 0.22, 0.34, 0, -0.23, 0]]), m => {
        m.position.set(S.x, y - (dead() ? 0.12 : 0), S.z); m.rotation.set(dead() ? 0.9 : 0, 0, dead() ? 0.3 : 0);
      }, at);
      this.add(parts([['box', [2.9, 1.6, 0.3], 0.16, 0.12, 0.16, 0, -0.4, 0]]), m => {
        m.position.set(S.x, y, S.z);
        m.visible = heard(sim, S.zone) && sim.alarms.some(a => a.zone === S.zone) && Math.floor(performance.now() / 300) % 2 === 0;
      });
    }
    for (const s of w.def.signs) {
      const m = signMesh(s.text);
      m.position.set(s.x, s.y, s.z);
      m.rotation.y = s.yaw;
      scene.add(m);
      this.signs.push({ mat: m.material as THREE.MeshBasicMaterial, circuit: s.circuit });
    }
    this.setLighting(L);
    sim.loose.all.forEach((o, k) => {
      /* a hair larger than it is, so a crate on the floor or on another does not fight it (levelMesh's apart) */
      const pts: number[] = [], e = apart(k), P = o.prop;
      propVerts({ ...P, ry: 0, sx: P.sx + 2 * e, sy: P.sy + 2 * e, sz: P.sz + 2 * e }, (x, y, z) => pts.push(x, y, z), { x: 0, y: -e, z: 0 });
      this.add(coloured(new Float32Array(pts), o.prop.colour), m => m.position.set(o.x, o.y, o.z));
    });
    for (const n of w.def.notes) this.addFixed(parts(itemParts('note')), n.x, n.y, n.z, lie(n.x, n.z) * 0.3);
    this.water(w);
  }

  /** things you can pick up: drawn until taken; anything put down later appears */
  private items = 0;
  private itemMeshes: { mesh: THREE.Object3D; taken: () => boolean }[] = [];
  private syncItems(): void {
    for (; this.items < this.sim.items.length; this.items++) {
      const it = this.sim.items[this.items], k = this.items, lamps = this.sim.world.def.lamps.filter(L => L.item === k);
      /* one that gives a light points at the farthest of its pools: its beam */
      const far = lamps.reduce<(typeof lamps)[number] | null>((a, L) => (!a || Math.hypot(L.x - it.x, L.z - it.z) > Math.hypot(a.x - it.x, a.z - it.z) ? L : a), null);
      const yaw = far && Math.hypot(far.x - it.x, far.z - it.z) > 0.1 ? Math.atan2(-(far.z - it.z), far.x - it.x) : lie(it.x, it.z);
      const m = this.addFixed(parts(itemParts(it.id, lamps.length > 0)), it.x, it.y, it.z, yaw);
      this.itemMeshes.push({ mesh: m, taken: () => it.taken });
    }
    for (const im of this.itemMeshes) im.mesh.visible = !im.taken();
  }
  private addFixed(geo: THREE.BufferGeometry, x: number, y: number, z: number, yaw: number): THREE.Mesh {
    const mat = dynamicMaterial(), mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = yaw;
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    this.list.push({ mesh, mat, place: () => {} });
    return mesh;
  }

  private add(geo: THREE.BufferGeometry, place: (m: THREE.Mesh) => void, litAt?: [number, number, number]): void {
    const mat = dynamicMaterial(), mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    this.list.push({ mesh, mat, place: () => place(mesh), litAt });
  }

  /** a window's pane: faintly tinted glass in a dark frame, lit where it stands when the level is drawn */
  private pane(D: DoorDef): void {
    const cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2, l = this.L.atPoint(cx, D.y0 + 1.2, cz), rot = D.alongX ? 0 : Math.PI / 2;
    const g = parts([['box', [0.55, 0.66, 0.7], 2, 2.4, 0.03, 0, 0, 0]]), n = g.getAttribute('position').count, L = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) L.set([0.02 + l[0], 0.025 + l[1], 0.03 + l[2], 0], i * 4); // in the dark it is all but gone
    g.setAttribute('aLight', new THREE.BufferAttribute(L, 4));
    const m = new THREE.Mesh(g, glassMaterial(0.18));
    m.position.set(cx, D.y0 + 1.2, cz); m.rotation.y = rot; m.frustumCulled = false; m.renderOrder = 1;
    this.scene.add(m);
    const frame: Part[] = [['box', 0x2a2c2e, 2, 0.08, 0.12, 0, 1.2, 0], ['box', 0x2a2c2e, 2, 0.08, 0.12, 0, -1.2, 0], ['box', 0x2a2c2e, 0.08, 2.4, 0.12, -0.96, 0, 0], ['box', 0x2a2c2e, 0.08, 2.4, 0.12, 0.96, 0, 0]];
    this.add(parts(frame), f => { f.position.set(cx, D.y0 + 1.2, cz); f.rotation.y = rot; }, [cx, D.y0, cz]);
  }

  private water(w: World): void {
    if (!w.water.length) return;
    const P: number[] = [], C: number[] = [], L: number[] = [], c: Colour = [0.07, 0.13, 0.14]; // the first engine's water
    for (const s of w.water) {
      const l = this.L.atPoint((s.x0 + s.x1) / 2, s.level + 0.1, (s.z0 + s.z1) / 2);
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
    this.syncItems();
    for (const t of this.list) {
      t.place();
      const p = t.litAt ? { x: t.litAt[0], y: t.litAt[1], z: t.litAt[2] } : t.mesh.position, w = this.sim.world;
      const R = w.roomAt(p.x, p.y + 0.3, p.z) ?? w.roomAt(p.x, p.y + 1.2, p.z);
      const l = R ? this.L.lit(R.id, p.x, p.y + 0.3, p.z) : [0, 0, 0];
      (t.mat.uniforms.uLight.value as THREE.Vector3).set(l[0], l[1], l[2]);
    }
  }
}
