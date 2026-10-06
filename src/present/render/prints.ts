import * as THREE from 'three';
import type { Mutant } from '../../sim/cast';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { U } from './shader';

/* What is left on the floor: squares, the one shape blood has in this station (content's blood(), a dark red box).

   Footprints, yours and the cast's: out of water soles are wet for a dozen prints or so, and those dry off in half a
   minute; through blood (a pool on the floor, one that something bled, or under one of the cast that fell) they are
   red for about ten, and those stay; through what a green one bled, green. Each print is a small square under the
   foot, smaller and fainter as what is on the sole runs out. A walker's size and pace set its squares': you and the
   husks a pace apart, left and right; the thresher bigger and further apart; a skitter small and quick; a worm one
   wide square where it dragged itself.

   Bleeding: one of the cast badly hurt, or you below half your health, bleeds where it is. Every so often (sooner the
   worse it is) the square under it grows, or if there is none, a new one starts there, so standing still makes one
   spreading pool and walking a trail of them. Those pools are blood like any other underfoot.

   None in water, on a crate or on a platform. The newest 256 are kept. Looks only: not part of the sim, and not saved. */

const MAX = 256;
/** how much of the wet or the blood each print takes off a sole */
const WET_LEFT = 0.86, BLOOD_LEFT = 0.8;
/** seconds a wet print takes to dry */
const DRY = 32;
/** a pool of bleeding: how big it starts, how much it grows each time, how big it gets */
const POOL = { start: 0.16, grow: 0.07, most: 0.75 };

/** what a print is of: water, blood, or a green one's sap */
type Stuff = 'wet' | 'red' | 'green';
/** the station's blood is 0x3a0b0b; sap is the green ones' (castView's 0x24401f) */
const COLOUR: Record<Stuff, [number, number, number]> = { wet: [0.05, 0.05, 0.055], red: [0.23, 0.045, 0.045], green: [0.14, 0.25, 0.12] };

/** how each kind walks: its square's size, a pace, and how far its feet are from its middle */
interface Gait { size: number; pace: number; side: number }
const YOU: Gait = { size: 0.12, pace: 0.75, side: 0.1 };
const GAIT: Partial<Record<string, Gait>> = {
  husk: { size: 0.13, pace: 0.8, side: 0.11 },
  thresher: { size: 0.24, pace: 1.2, side: 0.22 },
  skitter: { size: 0.07, pace: 0.4, side: 0.2 },
  worm: { size: 0.26, pace: 0.4, side: 0 },
};

const VS = /* glsl */ `
attribute vec3 iPos; attribute float iYaw; attribute float iSize; attribute vec3 iCol; attribute float iA; attribute vec3 iL;
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uExpo;
varying vec3 vC; varying float vA;
void main(){
  float c = cos(iYaw), s = sin(iYaw);
  vec2 q = position.xz * iSize;
  vec3 p = iPos + vec3(q.x * c + q.y * s, 0.0, -q.x * s + q.y * c);
  vec3 tc = cameraPosition - p; float d = length(tc);
  float ca = dot(-tc / max(d, 0.001), uFlashDir);
  float beam = uFlash * (0.65 * smoothstep(0.91, 0.975, ca) + 0.42 * smoothstep(0.76, 0.92, ca)) * 2.3 / (1.0 + 0.055 * d * d);
  float lamp = uLamp * 1.5 / (1.0 + 0.2 * d * d);
  vC = iCol * (iL + beam * vec3(1.0, 0.93, 0.78) + lamp * vec3(0.72, 0.92, 1.0)) * uExpo;
  vA = iA * exp(-d * uFog);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

const FS = /* glsl */ `
varying vec3 vC; varying float vA;
void main(){
  if (vA < 0.01) discard;
  gl_FragColor = vec4(vC, vA);
}`;

/** a square on the floor: where, of what, how strong (0..1), how old, how big, and whether something bled it */
interface Print { x: number; y: number; z: number; stuff: Stuff; k: number; age: number; size: number; pool: boolean }

/** a walker's soles and wounds: where it was, how far since its last print, which foot, what is on its feet, and how
 *  long since it last bled */
interface Feet { x: number; z: number; gone: number; left: boolean; wet: number; blood: number; sap: boolean; bled: number }

export class Prints {
  private geo = new THREE.InstancedBufferGeometry();
  private iPos = new Float32Array(MAX * 3);
  private iYaw = new Float32Array(MAX);
  private iSize = new Float32Array(MAX);
  private iCol = new Float32Array(MAX * 3);
  private iA = new Float32Array(MAX);
  private iL = new Float32Array(MAX * 3);
  private list: Print[] = [];
  private next = 0;
  private you: Feet | null = null;
  private feet = new Map<Mutant, Feet>();
  private sim: Sim | null = null;

  constructor(scene: THREE.Object3D, private L: Lighting) {
    const base = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    this.geo.index = base.index;
    this.geo.setAttribute('position', base.getAttribute('position'));
    const attr = (a: Float32Array, n: number) => new THREE.InstancedBufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('iPos', attr(this.iPos, 3));
    this.geo.setAttribute('iYaw', attr(this.iYaw, 1));
    this.geo.setAttribute('iSize', attr(this.iSize, 1));
    this.geo.setAttribute('iCol', attr(this.iCol, 3));
    this.geo.setAttribute('iA', attr(this.iA, 1));
    this.geo.setAttribute('iL', attr(this.iL, 3));
    this.geo.instanceCount = 0;
    const mat = new THREE.ShaderMaterial({
      uniforms: { uFlashDir: U.uFlashDir, uFlash: U.uFlash, uLamp: U.uLamp, uFog: U.uFog, uExpo: U.uExpo },
      vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
  }

  /** the power changed: each print takes the light where it lies */
  setLighting(L: Lighting): void {
    this.L = L;
    this.list.forEach((p, k) => this.light(p, k));
    this.geo.getAttribute('iL').needsUpdate = true;
  }

  private light(p: Print, k: number): void {
    const l = this.L.atPoint(p.x, p.y + 0.05, p.z);
    this.iL[k * 3] = l[0]; this.iL[k * 3 + 1] = l[1]; this.iL[k * 3 + 2] = l[2];
  }

  /** is a point within a square (turned by yaw) of half-width h around (cx, cz), give or take `more`? */
  private static under(x: number, z: number, cx: number, cz: number, yaw: number, h: number, more: number): boolean {
    const dx = x - cx, dz = z - cz, c = Math.cos(yaw), s = Math.sin(yaw);
    return Math.abs(dx * c - dz * s) < h + more && Math.abs(dx * s + dz * c) < h + more;
  }

  /** the pool something bled that lies under (x, z) on the floor at y, if any */
  private poolAt(x: number, y: number, z: number, more: number): number {
    for (let k = 0; k < this.list.length; k++) {
      const P = this.list[k];
      if (P.pool && Math.abs(P.y - y) < 0.3 && Prints.under(x, z, P.x, P.z, this.iYaw[k], P.size / 2, more)) return k;
    }
    return -1;
  }

  /** what is underfoot at (x, z) on the floor at y: a pool the level was built with, one something bled, or what one of
   *  the cast that fell bled (blood, or a green one's sap) */
  private spilt(sim: Sim, x: number, y: number, z: number): 'red' | 'green' | null {
    for (const S of sim.world.def.stains ?? []) if (Math.abs(S.y - y) < 0.5 && Math.hypot(S.x - x, S.z - z) < S.r + 0.12) return 'red';
    const p = this.poolAt(x, y, z, 0.05);
    if (p >= 0) return this.list[p].stuff === 'green' ? 'green' : 'red';
    for (const m of sim.cast) {
      if (!m.dead || m.fixed || m.swim || Math.abs(m.y - y) > 0.5) continue;
      if (Math.hypot(m.x - x, m.z - z) < m.r * 1.2 + 0.12) return m.green ? 'green' : 'red';
    }
    return null;
  }

  /** a square at (x, y, z), turned to `yaw`, of `stuff`, this strong and this big */
  private put(x: number, y: number, z: number, yaw: number, size: number, stuff: Stuff, k: number, pool = false): void {
    const P: Print = { x, y: y + 0.012, z, stuff, k, age: 0, size, pool }, i = this.next;
    this.next = (this.next + 1) % MAX;
    this.list[i] = P;
    this.iPos.set([P.x, P.y, P.z], i * 3);
    this.iYaw[i] = yaw;
    this.iSize[i] = size;
    this.light(P, i);
    this.geo.instanceCount = this.list.length;
    for (const a of ['iPos', 'iYaw', 'iSize', 'iL']) this.geo.getAttribute(a).needsUpdate = true;
  }

  /** a walker's foot down, facing `face`, in water or not, on firm floor or not */
  private step(sim: Sim, F: Feet, g: Gait, x: number, y: number, z: number, face: number, inWater: boolean, firm: boolean): void {
    if (inWater) { F.wet = 1; return; }
    if (!firm) return;
    F.left = !F.left;
    const side = F.left ? -g.side : g.side, fx = x + Math.cos(face) * side, fz = z - Math.sin(face) * side;
    const s = this.spilt(sim, fx, y, fz);
    if (s) { F.blood = 1; F.sap = s === 'green'; }
    if (F.wet < 0.08 && F.blood < 0.1) return;
    const stuff: Stuff = F.blood >= 0.1 ? (F.sap ? 'green' : 'red') : 'wet', k = stuff === 'wet' ? F.wet : F.blood;
    /* smaller as what is on the sole runs out, and turned a little off true, as a foot comes down */
    this.put(fx, y, fz, face + (Math.random() - 0.5) * 0.5, g.size * (0.5 + 0.5 * k), stuff, k);
    F.wet *= WET_LEFT; F.blood *= BLOOD_LEFT;
    if (F.wet < 0.08) F.wet = 0;
    if (F.blood < 0.1) F.blood = 0;
  }

  /** something bleeding at (x, y, z), `hurt` (0..1) badly, a while since it last did: the pool under it grows, or a
   *  new one starts there */
  private bleed(F: Feet, x: number, y: number, z: number, hurt: number, green: boolean, dt: number, ok: boolean): void {
    F.bled += dt;
    if (!ok || F.bled < 0.6 + 2.4 * (1 - hurt)) return;
    F.bled = 0;
    const k = this.poolAt(x, y, z, 0);
    if (k >= 0) {
      const P = this.list[k];
      P.size = Math.min(POOL.most, P.size + POOL.grow);
      this.iSize[k] = P.size;
      this.geo.getAttribute('iSize').needsUpdate = true;
      return;
    }
    this.put(x, y, z, Math.random() * Math.PI, POOL.start, green ? 'green' : 'red', 1, true);
  }

  private reset(sim: Sim): void {
    this.sim = sim;
    this.list = []; this.next = 0; this.you = null; this.feet.clear();
    this.geo.instanceCount = 0;
  }

  private static feet(x: number, z: number, sap: boolean): Feet {
    return { x, z, gone: 0, left: false, wet: 0, blood: 0, sap, bled: 0 };
  }

  /** a frame: a print every pace each walker goes (not a jump in place, and not you flying), the hurt bleed, and wet
   *  prints dry */
  update(sim: Sim, dt: number): void {
    if (sim !== this.sim) this.reset(sim);
    const w = sim.world, p = sim.player, b = p.body;
    /* you */
    const Y = (this.you ??= Prints.feet(b.x, b.z, false)), firmY = b.ground && !b.on, dryY = p.water === 'dry';
    if (!p.fly) this.walked(Y, b.x, b.z, YOU.pace, () => this.step(sim, Y, YOU, b.x, b.y, b.z, p.yaw, !dryY, firmY));
    Y.x = b.x; Y.z = b.z;
    const g = sim.game;
    if (g.hp < 50 && !g.ended && !g.god) this.bleed(Y, b.x, b.y, b.z, 1 - g.hp / 50, false, dt, firmY && dryY && !p.fly);
    /* the cast that walk; one of the cast faces (sin yaw, cos yaw), which is the prints' yaw plus a half turn */
    for (const m of sim.cast) {
      const G = GAIT[m.ai];
      if (!G || m.dead || m.fixed || m.swim || m.ride) { this.feet.delete(m); continue; }
      let F = this.feet.get(m);
      if (!F) this.feet.set(m, (F = Prints.feet(m.x, m.z, !!m.green)));
      const mb = m.body, face = m.yaw + Math.PI, wet = w.waterAt(m.x, m.z) > m.y + 0.05, firm = !mb || (mb.ground && !mb.on);
      const feet = F, hurt = 1 - m.hp / m.max;
      this.walked(feet, m.x, m.z, G.pace, () => this.step(sim, feet, G, m.x, m.y, m.z, face, wet, firm));
      F.x = m.x; F.z = m.z;
      if (hurt > 0.4) this.bleed(F, m.x, m.y, m.z, (hurt - 0.4) / 0.6, !!m.green, dt, firm && !wet);
    }
    /* drying: water goes, blood and sap stay; prints fainter as the sole ran out, pools solid */
    this.list.forEach((P, k) => {
      P.age += dt;
      this.iCol.set(COLOUR[P.stuff], k * 3);
      this.iA[k] = P.pool ? 0.92 : P.stuff === 'wet' ? 0.45 * P.k * Math.max(0, 1 - P.age / DRY) : 0.3 + 0.6 * P.k;
    });
    this.geo.getAttribute('iCol').needsUpdate = true;
    this.geo.getAttribute('iA').needsUpdate = true;
  }

  /** how far a walker has gone since its last print; a pace on, its foot comes down */
  private walked(F: Feet, x: number, z: number, pace: number, down: () => void): void {
    const d = Math.hypot(x - F.x, z - F.z);
    if (d < 3) F.gone += d; // further at once is a jump in place, not a walk
    if (F.gone >= pace) { F.gone = 0; down(); }
  }
}
