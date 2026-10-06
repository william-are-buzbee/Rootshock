import * as THREE from 'three';
import type { Mutant } from '../../sim/cast';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { U } from './shader';

/* Footprints, yours and the cast's. Out of water soles are wet for a dozen prints or so, and those dry off in half a
   minute; through blood (a pool on the floor, or under one of the cast that fell) they are red for about ten, and
   those stay; through what a green one bled, they are green. Each walks its own way: you and the husks a bare sole a
   pace apart, left and right; the thresher a sole twice the size; a skitter a cluster of claw marks; a worm a smear
   where it dragged itself. One of the cast badly hurt drips as it goes, its blood or its sap, more the worse it is,
   so a thing that ran from you can be followed. None in water, on a crate or on a platform. The newest 256 are kept.
   Looks only: they are not part of the sim, and not saved. */

const MAX = 256;
/** how much of the wet or the blood each print takes off a sole */
const WET_LEFT = 0.86, BLOOD_LEFT = 0.8;
/** seconds a wet print takes to dry */
const DRY = 32;

/** the shapes a print can take */
const enum Shape { Sole = 0, Claws = 1, Smear = 2, Drip = 3 }
/** what a print is of: water, blood, or a green one's sap */
type Stuff = 'wet' | 'red' | 'green';
const COLOUR: Record<Stuff, [number, number, number]> = { wet: [0.05, 0.05, 0.055], red: [0.24, 0.035, 0.03], green: [0.07, 0.16, 0.05] };

/** how each kind walks: its print, how big (width, length), a pace, and how far its feet are from its middle */
interface Gait { shape: Shape; w: number; l: number; pace: number; side: number }
const YOU: Gait = { shape: Shape.Sole, w: 0.11, l: 0.27, pace: 0.75, side: 0.1 };
const GAIT: Partial<Record<string, Gait>> = {
  husk: { shape: Shape.Sole, w: 0.12, l: 0.28, pace: 0.8, side: 0.11 },
  thresher: { shape: Shape.Sole, w: 0.22, l: 0.46, pace: 1.2, side: 0.22 },
  skitter: { shape: Shape.Claws, w: 0.2, l: 0.2, pace: 0.4, side: 0.22 },
  worm: { shape: Shape.Smear, w: 0.26, l: 0.5, pace: 0.4, side: 0 },
};

const VS = /* glsl */ `
attribute vec3 iPos; attribute float iYaw; attribute vec2 iSize; attribute float iShape; attribute vec3 iCol; attribute float iA; attribute vec3 iL;
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uExpo;
varying vec3 vC; varying float vA; varying vec2 vS; varying float vShape;
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
  vS = position.xz * 2.0;
  vShape = iShape;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

/* each shape on a square from -1 to 1, toe (or front) at -1 */
const FS = /* glsl */ `
varying vec3 vC; varying float vA; varying vec2 vS; varying float vShape;
float disc(vec2 p, vec2 c, vec2 r){ vec2 d = (p - c) / r; return step(dot(d, d), 1.0); }
void main(){
  float inside, a = vA;
  if (vShape < 0.5) {
    /* a sole: the ball of the foot and the heel, joined by a narrower arch */
    float arch = step(abs(vS.x), 0.55) * step(-0.1, vS.y) * step(vS.y, 0.5);
    inside = max(max(disc(vS, vec2(0.0, -0.38), vec2(1.0, 0.62)), disc(vS, vec2(0.0, 0.62), vec2(0.82, 0.38))), arch);
  } else if (vShape < 1.5) {
    /* claws: three points, splayed */
    inside = max(max(disc(vS, vec2(0.0, -0.7), vec2(0.22, 0.3)), disc(vS, vec2(-0.6, 0.2), vec2(0.22, 0.3))), disc(vS, vec2(0.6, 0.2), vec2(0.22, 0.3)));
  } else if (vShape < 2.5) {
    /* a smear: long, thinning behind, and fainter */
    inside = disc(vS, vec2(0.0, 0.0), vec2(0.8 - 0.35 * max(vS.y, 0.0), 1.0));
    a *= 0.75 - 0.35 * vS.y;
  } else {
    /* a drip: a spot and a fleck or two beside it */
    inside = max(max(disc(vS, vec2(0.0), vec2(0.55)), disc(vS, vec2(0.7, -0.5), vec2(0.18))), disc(vS, vec2(-0.6, 0.65), vec2(0.14)));
  }
  if (inside < 0.5 || a < 0.01) discard;
  gl_FragColor = vec4(vC, a);
}`;

interface Print { x: number; y: number; z: number; stuff: Stuff; k: number; age: number }

/** a walker's soles: where it was, how far since its last print, which foot, and what is on its feet */
interface Feet { x: number; z: number; gone: number; left: boolean; wet: number; blood: number; sap: boolean }

export class Prints {
  private geo = new THREE.InstancedBufferGeometry();
  private iPos = new Float32Array(MAX * 3);
  private iYaw = new Float32Array(MAX);
  private iSize = new Float32Array(MAX * 2);
  private iShape = new Float32Array(MAX);
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
    this.geo.setAttribute('iSize', attr(this.iSize, 2));
    this.geo.setAttribute('iShape', attr(this.iShape, 1));
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

  /** what is underfoot at (x, z) on the floor at y: a pool the level was built with, or what one of the cast that fell
   *  bled (blood, or a green one's sap) */
  private spilt(sim: Sim, x: number, y: number, z: number): 'red' | 'green' | null {
    for (const S of sim.world.def.stains ?? []) if (Math.abs(S.y - y) < 0.5 && Math.hypot(S.x - x, S.z - z) < S.r + 0.12) return 'red';
    for (const m of sim.cast) {
      if (!m.dead || m.fixed || m.swim || Math.abs(m.y - y) > 0.5) continue;
      if (Math.hypot(m.x - x, m.z - z) < m.r * 1.2 + 0.12) return m.green ? 'green' : 'red';
    }
    return null;
  }

  /** a print at (x, y, z), turned to `yaw` (a toe toward -z turned by it), of `stuff`, this strong */
  private put(x: number, y: number, z: number, yaw: number, g: { shape: Shape; w: number; l: number }, stuff: Stuff, k: number): void {
    const P: Print = { x, y: y + 0.012, z, stuff, k, age: 0 }, i = this.next;
    this.next = (this.next + 1) % MAX;
    this.list[i] = P;
    this.iPos.set([P.x, P.y, P.z], i * 3);
    this.iYaw[i] = yaw;
    this.iSize[i * 2] = g.w; this.iSize[i * 2 + 1] = g.l;
    this.iShape[i] = g.shape;
    this.light(P, i);
    this.geo.instanceCount = this.list.length;
    for (const a of ['iPos', 'iYaw', 'iSize', 'iShape', 'iL']) this.geo.getAttribute(a).needsUpdate = true;
  }

  /** a walker's foot down, facing `face` (in the prints' sense), in water or not, on firm floor or not */
  private step(sim: Sim, F: Feet, g: Gait, x: number, y: number, z: number, face: number, inWater: boolean, firm: boolean): void {
    if (inWater) { F.wet = 1; return; }
    if (!firm) return;
    F.left = !F.left;
    const side = F.left ? -g.side : g.side, fx = x + Math.cos(face) * side, fz = z - Math.sin(face) * side;
    const s = this.spilt(sim, fx, y, fz);
    if (s) { F.blood = 1; F.sap = s === 'green'; }
    if (F.wet < 0.08 && F.blood < 0.1) return;
    const stuff: Stuff = F.blood >= 0.1 ? (F.sap ? 'green' : 'red') : 'wet';
    this.put(fx, y, fz, face + (F.left ? 0.06 : -0.06), g, stuff, stuff === 'wet' ? F.wet : F.blood);
    F.wet *= WET_LEFT; F.blood *= BLOOD_LEFT;
    if (F.wet < 0.08) F.wet = 0;
    if (F.blood < 0.1) F.blood = 0;
  }

  private reset(sim: Sim): void {
    this.sim = sim;
    this.list = []; this.next = 0; this.you = null; this.feet.clear();
    this.geo.instanceCount = 0;
  }

  /** a frame: a print every pace each walker goes (not a jump in place, and not you flying), and wet prints dry */
  update(sim: Sim, dt: number): void {
    if (sim !== this.sim) this.reset(sim);
    const w = sim.world, p = sim.player, b = p.body;
    /* you */
    const Y = (this.you ??= { x: b.x, z: b.z, gone: 0, left: false, wet: 0, blood: 0, sap: false });
    if (!p.fly) this.walked(Y, b.x, b.z, YOU.pace, () => this.step(sim, Y, YOU, b.x, b.y, b.z, p.yaw, p.water !== 'dry', b.ground && !b.on));
    Y.x = b.x; Y.z = b.z;
    /* the cast that walk; a cast member faces (sin yaw, cos yaw), which is the prints' yaw plus a half turn */
    for (const m of sim.cast) {
      const g = GAIT[m.ai];
      if (!g || m.dead || m.fixed || m.swim || m.ride) { this.feet.delete(m); continue; }
      let F = this.feet.get(m);
      if (!F) this.feet.set(m, (F = { x: m.x, z: m.z, gone: 0, left: false, wet: 0, blood: 0, sap: !!m.green }));
      const mb = m.body, face = m.yaw + Math.PI, wet = w.waterAt(m.x, m.z) > m.y + 0.05, firm = !mb || (mb.ground && !mb.on);
      const hurt = 1 - m.hp / m.max, feet = F;
      this.walked(feet, m.x, m.z, g.pace, () => {
        this.step(sim, feet, g, m.x, m.y, m.z, face, wet, firm);
        /* badly hurt, it drips as it goes, more the worse it is */
        if (hurt > 0.4 && !wet && firm && Math.random() < hurt) {
          const a = Math.random() * Math.PI * 2, r = Math.random() * m.r * 0.6;
          this.put(m.x + Math.cos(a) * r, m.y, m.z + Math.sin(a) * r, a, { shape: Shape.Drip, w: 0.1, l: 0.1 }, m.green ? 'green' : 'red', 1);
        }
      });
      F.x = m.x; F.z = m.z;
    }
    /* drying: water goes, blood and sap stay */
    this.list.forEach((P, k) => {
      P.age += dt;
      this.iCol.set(COLOUR[P.stuff], k * 3);
      this.iA[k] = P.stuff === 'wet' ? 0.45 * P.k * Math.max(0, 1 - P.age / DRY) : 0.25 + 0.6 * P.k;
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
