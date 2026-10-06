import * as THREE from 'three';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { U } from './shader';

/* Footprints, one every pace you walk. Out of water your soles are wet for a dozen steps or so, and each step leaves a dark print that dries off
   in half a minute; through blood (a pool on the floor, or under something you put down) they are red for about ten,
   and those prints stay. Left, right, left, under where you walk, the way you face. Only on firm floor: none in water,
   none on a crate or a platform. The newest 160 are kept. Looks only: they are not part of the sim, and not saved. */

const MAX = 160;
/** a sole: width and length, in metres */
const W = 0.11, LEN = 0.27;
/** how much of the wet or the blood each print takes off your soles */
const WET_LEFT = 0.86, BLOOD_LEFT = 0.8;
/** seconds a wet print takes to dry; metres from one print to the next (a stride is two) */
const DRY = 32, PACE = 0.75;

const VS = /* glsl */ `
attribute vec3 iPos; attribute float iYaw; attribute vec3 iCol; attribute float iA; attribute vec3 iL;
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uExpo;
varying vec3 vC; varying float vA; varying vec2 vS;
void main(){
  float c = cos(iYaw), s = sin(iYaw);
  vec3 p = iPos + vec3(position.x * c + position.z * s, 0.0, -position.x * s + position.z * c);
  vec3 tc = cameraPosition - p; float d = length(tc);
  float ca = dot(-tc / max(d, 0.001), uFlashDir);
  float beam = uFlash * (0.65 * smoothstep(0.91, 0.975, ca) + 0.42 * smoothstep(0.76, 0.92, ca)) * 2.3 / (1.0 + 0.055 * d * d);
  float lamp = uLamp * 1.5 / (1.0 + 0.2 * d * d);
  vC = iCol * (iL + beam * vec3(1.0, 0.93, 0.78) + lamp * vec3(0.72, 0.92, 1.0)) * uExpo;
  vA = iA * exp(-d * uFog);
  vS = vec2(position.x / ${(W / 2).toFixed(3)}, position.z / ${(LEN / 2).toFixed(3)});
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

/* the sole's shape, from toe (-1) to heel (1): the ball of the foot and the heel, joined by a narrower arch */
const FS = /* glsl */ `
varying vec3 vC; varying float vA; varying vec2 vS;
void main(){
  vec2 ball = (vS - vec2(0.0, -0.38)) / vec2(1.0, 0.62), heel = (vS - vec2(0.0, 0.62)) / vec2(0.82, 0.38);
  float arch = step(abs(vS.x), 0.55) * step(-0.1, vS.y) * step(vS.y, 0.5);
  float inside = max(max(step(dot(ball, ball), 1.0), step(dot(heel, heel), 1.0)), arch);
  if (inside < 0.5 || vA < 0.01) discard;
  gl_FragColor = vec4(vC, vA);
}`;

interface Print { x: number; y: number; z: number; yaw: number; wet: number; blood: number; age: number }

export class Prints {
  private geo = new THREE.InstancedBufferGeometry();
  private iPos = new Float32Array(MAX * 3);
  private iYaw = new Float32Array(MAX);
  private iCol = new Float32Array(MAX * 3);
  private iA = new Float32Array(MAX);
  private iL = new Float32Array(MAX * 3);
  private list: Print[] = [];
  private next = 0;
  private wet = 0;
  private blood = 0;
  private left = false;
  private sim: Sim | null = null;
  /** where your body was, and how far it has gone since the last print */
  private at: { x: number; z: number } | null = null;
  private gone = 0;

  constructor(scene: THREE.Object3D, private L: Lighting) {
    const base = new THREE.PlaneGeometry(W, LEN).rotateX(-Math.PI / 2);
    this.geo.index = base.index;
    this.geo.setAttribute('position', base.getAttribute('position'));
    const attr = (a: Float32Array, n: number) => new THREE.InstancedBufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('iPos', attr(this.iPos, 3));
    this.geo.setAttribute('iYaw', attr(this.iYaw, 1));
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

  /** is there blood under (x, z), on the floor at y: a pool the level was built with, or under one of the cast that fell */
  private bloodAt(sim: Sim, x: number, y: number, z: number): boolean {
    for (const S of sim.world.def.stains ?? []) if (Math.abs(S.y - y) < 0.5 && Math.hypot(S.x - x, S.z - z) < S.r + 0.12) return true;
    for (const m of sim.cast) {
      if (!m.dead || m.fixed || m.swim || Math.abs(m.y - y) > 0.5) continue;
      if (Math.hypot(m.x - x, m.z - z) < m.r * 1.2 + 0.12) return true;
    }
    return false;
  }

  /** you put a foot down */
  private step(sim: Sim): void {
    const p = sim.player, b = p.body;
    if (p.water !== 'dry') { this.wet = 1; return; }
    if (!b.ground || b.on) return;
    this.left = !this.left;
    const side = this.left ? -0.1 : 0.1, x = b.x + Math.cos(p.yaw) * side, z = b.z - Math.sin(p.yaw) * side;
    if (this.bloodAt(sim, x, b.y, z)) this.blood = 1;
    if (this.wet < 0.08 && this.blood < 0.1) return;
    const P: Print = { x, y: b.y + 0.012, z, yaw: p.yaw + (this.left ? 0.06 : -0.06), wet: this.wet, blood: this.blood, age: 0 };
    this.wet *= WET_LEFT; this.blood *= BLOOD_LEFT;
    if (this.wet < 0.08) this.wet = 0;
    if (this.blood < 0.1) this.blood = 0;
    const k = this.next;
    this.next = (this.next + 1) % MAX;
    this.list[k] = P;
    this.iPos.set([P.x, P.y, P.z], k * 3);
    this.iYaw[k] = P.yaw;
    this.light(P, k);
    this.geo.instanceCount = this.list.length;
    this.geo.getAttribute('iPos').needsUpdate = true;
    this.geo.getAttribute('iYaw').needsUpdate = true;
    this.geo.getAttribute('iL').needsUpdate = true;
  }

  private reset(sim: Sim): void {
    this.sim = sim;
    this.list = []; this.next = 0; this.wet = 0; this.blood = 0; this.at = null; this.gone = 0;
    this.geo.instanceCount = 0;
  }

  /** a frame: a foot down every pace you walk (not a jump in place, and not while flying), and wet prints dry */
  update(sim: Sim, dt: number): void {
    if (sim !== this.sim) this.reset(sim);
    const b = sim.player.body;
    if (this.at && !sim.player.fly) {
      const d = Math.hypot(b.x - this.at.x, b.z - this.at.z);
      if (d < 3) this.gone += d;
      if (this.gone >= PACE) { this.gone = 0; this.step(sim); }
    }
    this.at = { x: b.x, z: b.z };
    this.list.forEach((P, k) => {
      P.age += dt;
      /* blood darkens a little as it dries but stays; water goes */
      const wet = P.wet * Math.max(0, 1 - P.age / DRY), red = P.blood;
      const c = red > 0.05 ? [0.24, 0.035, 0.03] : [0.05, 0.05, 0.055];
      this.iCol.set(c, k * 3);
      this.iA[k] = red > 0.05 ? 0.25 + 0.6 * red : 0.45 * wet;
    });
    this.geo.getAttribute('iCol').needsUpdate = true;
    this.geo.getAttribute('iA').needsUpdate = true;
  }
}
