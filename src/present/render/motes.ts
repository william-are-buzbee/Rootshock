import * as THREE from 'three';
import type { Motes as Kind, RoomDef } from '../../content/types';
import { power } from '../../sim/game';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { U } from './shader';

/* What hangs in the air near you: dust, the green's spores, the flesh's flecks (RoomDef.motes). Nine hundred specks in
   a box that travels with the eye; one that drifts out of the box comes back in at the far side. Each is a fleck of
   matter, square and a couple of centimetres across, lit as a surface is: by the room's light as much as by your
   beam, and never brighter than a wall beside it would be (drawn over what is behind, not added to it). Some are pale,
   some dark grit.

   The air moves by the power: with the room's circuit live, it is drawn toward the room's vent panels (or, with none,
   along the room's length); on a backup set, barely; dead, it hangs and slowly settles. A sealed room is still air, not
   a problem to solve. A door that has been shut a while breathes out when it opens: a gust through the doorway toward
   you, and a sound with it. Looks only: Math.random, never the sim's numbers. */

const N = 900;
/** gust specks, kept apart from the drifting ones */
const G = 150;
const HX = 4, HY = 2, HZ = 4;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** each kind's colour, how many of the specks show, how big, and how it moves (lift: up, negative falls) */
const KIND: Record<Kind, { c: [number, number, number]; show: number; size: number; lift: number; glow: number }> = {
  dust: { c: [0.95, 0.9, 0.8], show: 0.15, size: 1, lift: -0.006, glow: 0 },
  spores: { c: [0.72, 0.95, 0.48], show: 0.4, size: 1.35, lift: 0.012, glow: 0.02 },
  flesh: { c: [0.9, 0.42, 0.36], show: 0.22, size: 1.15, lift: -0.012, glow: 0 },
};

const VS = /* glsl */ `
attribute vec3 aCol; attribute vec3 aL; attribute float aA; attribute float aS;
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uPx; uniform float uExpo;
varying vec3 vC; varying float vA;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 tc = cameraPosition - position; float d = length(tc);
  float ca = dot(-tc / max(d, 0.001), uFlashDir);
  float beam = uFlash * (0.65 * smoothstep(0.91, 0.975, ca) + 0.42 * smoothstep(0.76, 0.92, ca)) * 2.3 / (1.0 + 0.055 * d * d);
  float lamp = uLamp * 1.2 / (1.0 + 0.2 * d * d);
  vec3 light = aL + 0.6 * beam * vec3(1.0, 0.93, 0.78) + lamp * vec3(0.72, 0.92, 1.0);
  vC = aCol * light * uExpo;
  /* not right at the eye, not at the box's edge (where a speck comes back in), thinned by the fog */
  vA = aA * smoothstep(0.25, 0.8, d) * (1.0 - smoothstep(2.8, 3.9, d)) * exp(-d * uFog * 1.5);
  /* whole pixels, so a fleck is a crisp square and not a smudge */
  gl_PointSize = floor(clamp(uPx * aS / max(-mv.z, 0.1), 2.0, 14.0));
  gl_Position = projectionMatrix * mv;
}`;

const FS = /* glsl */ `
varying vec3 vC; varying float vA;
void main(){
  if (vA < 0.01) discard;
  gl_FragColor = vec4(vC, vA);
}`;

interface Air { fx: number; fz: number; speed: number; kind: Kind; vents: { x: number; z: number }[]; still: boolean }

export class Motes {
  readonly points: THREE.Points;
  private geo = new THREE.BufferGeometry();
  private pos = new Float32Array((N + G) * 3);
  private col = new Float32Array((N + G) * 3);
  private lit = new Float32Array((N + G) * 3);
  private alpha = new Float32Array(N + G);
  private size = new Float32Array(N + G);
  /** each speck's own: phase for its wander, whether it shows, and the room it is in (-1 in rock) */
  private seed = new Float32Array(N + G);
  private room = new Int32Array(N + G).fill(-1);
  /** the gusts: velocity and life left */
  private gv = new Float32Array(G * 3);
  private life = new Float32Array(G);
  private air = new Map<number, Air>();
  /** for each door: seconds since it was last fully shut, or Infinity while it stays shut from the start */
  private shut: number[] = [];
  private wasOpen: boolean[] = [];
  private sim: Sim | null = null;
  private turn = 0;
  private t = 0;
  private mat: THREE.ShaderMaterial;

  constructor(scene: THREE.Object3D, private L: Lighting, private onGust: (x: number, y: number, z: number, k: number) => void) {
    const attr = (a: Float32Array, n: number) => new THREE.BufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('position', attr(this.pos, 3));
    this.geo.setAttribute('aCol', attr(this.col, 3));
    this.geo.setAttribute('aL', attr(this.lit, 3));
    this.geo.setAttribute('aA', attr(this.alpha, 1));
    this.geo.setAttribute('aS', attr(this.size, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uFlashDir: U.uFlashDir, uFlash: U.uFlash, uLamp: U.uLamp, uFog: U.uFog, uExpo: U.uExpo, uPx: { value: 4 } },
      vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 2;
    scene.add(this.points);
    for (let i = 0; i < N + G; i++) this.seed[i] = Math.random();
  }

  /** the power changed: the air is worked out again, and the specks take the new light */
  setLighting(L: Lighting): void {
    this.L = L;
    this.air.clear();
    this.room.fill(-1);
  }

  /** pixels at one metre away for a speck about two centimetres across */
  resize(height: number, fov: number): void {
    this.mat.uniforms.uPx.value = (height / 2 / Math.tan((fov * Math.PI) / 360)) * 0.022;
  }

  private airOf(sim: Sim, R: RoomDef): Air {
    let a = this.air.get(R.id);
    if (a) return a;
    const kind = R.motes ?? 'dust', cave = !!R.cells;
    /* a cave breathes on its own, slowly, whatever the power; a fitted room's air moves only while its fans do */
    const pw = power(sim.game, R.circuit), speed = cave ? 0.05 : pw === 2 ? 0.22 : pw === 1 ? 0.06 : 0;
    const long = R.x1 - R.x0 >= R.z1 - R.z0, sign = (R.id * 2654435761) % 2 ? 1 : -1;
    const vents: { x: number; z: number }[] = [];
    if (!cave) for (const d of sim.doors) {
      const D = d.def;
      if (!D.vent) continue;
      const x = (D.x0 + D.x1) / 2, z = (D.z0 + D.z1) / 2;
      if (x > R.x0 - 1 && x < R.x1 + 1 && z > R.z0 - 1 && z < R.z1 + 1 && D.y0 < R.y0 + R.ht && D.y1 > R.y0) vents.push({ x, z });
    }
    a = { fx: long ? sign : 0, fz: long ? 0 : sign, speed, kind, vents, still: speed === 0 };
    this.air.set(R.id, a);
    return a;
  }

  /** put speck i somewhere in the box about the eye */
  private scatter(i: number, cx: number, cy: number, cz: number): void {
    this.pos[i * 3] = cx + rnd(-HX, HX); this.pos[i * 3 + 1] = cy + rnd(-HY, HY); this.pos[i * 3 + 2] = cz + rnd(-HZ, HZ);
    this.room[i] = -2;
  }

  /** which room speck i is in, and so its colour, light and whether it shows */
  private place(sim: Sim, i: number): void {
    const x = this.pos[i * 3], y = this.pos[i * 3 + 1], z = this.pos[i * 3 + 2];
    const R = sim.world.roomAt(x, y, z);
    const gust = i >= N;
    if (!R) { this.room[i] = -1; if (!gust) this.alpha[i] = 0; return; }
    this.room[i] = R.id;
    const K = KIND[this.airOf(sim, R).kind], l = this.L.at(R.id, x, z), s = this.seed[i];
    /* pale flecks and dark grit: each its own shade of its kind's colour */
    const shade = 0.4 + 0.6 * ((s * 13.7) % 1);
    this.col[i * 3] = K.c[0] * shade; this.col[i * 3 + 1] = K.c[1] * shade; this.col[i * 3 + 2] = K.c[2] * shade;
    /* a spore glows a little of itself, so the green's dark is never quite empty */
    this.lit[i * 3] = l[0] + K.glow; this.lit[i * 3 + 1] = l[1] + K.glow * 1.6; this.lit[i * 3 + 2] = l[2] + K.glow * 0.6;
    this.size[i] = K.size * (0.6 + 0.8 * s * s);
    if (!gust) this.alpha[i] = s < K.show ? 0.45 + 0.55 * ((s * 7.31) % 1) : 0;
  }

  update(sim: Sim, cam: THREE.Vector3, dt: number): void {
    const P = this.pos, cx = cam.x, cy = cam.y, cz = cam.z;
    if (sim !== this.sim) {
      this.sim = sim; this.air.clear();
      this.shut = sim.doors.map(() => Infinity);
      this.wasOpen = sim.doors.map(d => d.t > 0.02);
      for (let i = 0; i < N; i++) this.scatter(i, cx, cy, cz);
      this.life.fill(0);
    }
    this.t += dt;
    const t = this.t;

    /* doors: one shut a while that starts to open breathes out at you */
    sim.doors.forEach((d, k) => {
      const open = d.t > 0.02, D = d.def;
      if (!open) this.shut[k] += dt;
      if (open && !this.wasOpen[k] && this.shut[k] > 20 && !D.vent && !D.lift) {
        const x = (D.x0 + D.x1) / 2, z = (D.z0 + D.z1) / 2;
        if (Math.hypot(x - cx, z - cz) < 12) this.gust(sim, d.def, cx, cz, D.kind === 'heavy' || D.seal ? 1 : 0.6);
      }
      if (!open) { if (this.wasOpen[k]) this.shut[k] = 0; }
      this.wasOpen[k] = open;
    });

    /* the drifting specks */
    const refresh = Math.ceil(N / 8);
    for (let n = 0; n < refresh; n++) { const i = (this.turn + n) % N; this.place(sim, i); }
    this.turn = (this.turn + refresh) % N;
    for (let i = 0; i < N; i++) {
      const o = i * 3;
      let x = P[o], y = P[o + 1], z = P[o + 2];
      /* out of the box: back in at the far side, and asked again where it is */
      let moved = false;
      if (x - cx > HX) { x -= 2 * HX; moved = true; } else if (cx - x > HX) { x += 2 * HX; moved = true; }
      if (y - cy > HY) { y -= 2 * HY; moved = true; } else if (cy - y > HY) { y += 2 * HY; moved = true; }
      if (z - cz > HZ) { z -= 2 * HZ; moved = true; } else if (cz - z > HZ) { z += 2 * HZ; moved = true; }
      P[o] = x; P[o + 1] = y; P[o + 2] = z;
      if (moved || this.room[i] === -2) this.place(sim, i);
      const r = this.room[i];
      if (r < 0) continue;
      const A = this.airOf(sim, sim.world.rooms[r]), K = KIND[A.kind], s = this.seed[i] * 40;
      let fx = A.fx, fz = A.fz;
      if (A.vents.length) {
        let best = Infinity;
        for (const v of A.vents) {
          const dx = v.x - x, dz = v.z - z, d = Math.hypot(dx, dz);
          if (d < best) { best = d; fx = dx / (d || 1); fz = dz / (d || 1); }
        }
      }
      /* the air's draw, each speck's own wander, and its weight */
      const wand = A.still ? 0.012 : 0.03;
      P[o] += (fx * A.speed + Math.sin(t * 0.37 + s) * wand) * dt;
      P[o + 1] += (K.lift * (A.still ? 1 : 0.4) + Math.sin(t * 0.29 + s * 1.7) * wand * 0.6) * dt;
      P[o + 2] += (fz * A.speed + Math.cos(t * 0.31 + s * 1.3) * wand) * dt;
    }

    /* the gusts: thrown out fast, slowed by the air, gone in a second or two */
    for (let g = 0; g < G; g++) {
      const i = N + g, o = i * 3;
      if (this.life[g] <= 0) { this.alpha[i] = 0; continue; }
      this.life[g] -= dt;
      const drag = Math.exp(-dt * 1.4);
      this.gv[g * 3] *= drag; this.gv[g * 3 + 1] *= drag; this.gv[g * 3 + 2] *= drag;
      P[o] += this.gv[g * 3] * dt; P[o + 1] += this.gv[g * 3 + 1] * dt; P[o + 2] += this.gv[g * 3 + 2] * dt;
      this.alpha[i] = Math.min(1, this.life[g] / 0.8) * (0.5 + 0.5 * this.seed[i]);
    }

    for (const k of ['position', 'aCol', 'aL', 'aA', 'aS']) this.geo.getAttribute(k).needsUpdate = true;
  }

  private gust(sim: Sim, D: { x0: number; y0: number; z0: number; x1: number; y1: number; z1: number; alongX: boolean }, cx: number, cz: number, k: number): void {
    const x = (D.x0 + D.x1) / 2, z = (D.z0 + D.z1) / 2, y = D.y0 + 1;
    /* toward your side of it */
    const nx = D.alongX ? 0 : Math.sign(cx - x) || 1, nz = D.alongX ? Math.sign(cz - z) || 1 : 0;
    const n = Math.round(G * k);
    for (let g = 0, made = 0; g < G && made < n; g++) {
      if (this.life[g] > 0) continue;
      made++;
      const i = N + g, o = i * 3, u = Math.random();
      this.pos[o] = D.alongX ? D.x0 + (D.x1 - D.x0) * u : x - nx * 0.4;
      this.pos[o + 1] = rnd(D.y0 + 0.1, Math.min(D.y1, D.y0 + 2.2));
      this.pos[o + 2] = D.alongX ? z - nz * 0.4 : D.z0 + (D.z1 - D.z0) * u;
      const sp = rnd(1.2, 2.4) * (0.6 + 0.4 * k);
      this.gv[g * 3] = nx * sp + rnd(-0.4, 0.4); this.gv[g * 3 + 1] = rnd(-0.15, 0.3); this.gv[g * 3 + 2] = nz * sp + rnd(-0.4, 0.4);
      this.life[g] = rnd(1.2, 2.4);
      this.place(sim, i);
      this.size[i] *= 1.4;
      if (this.room[i] < 0) {
        /* the far side is the door's own slab: take the dust's colour and the light where you are */
        this.col.set(KIND.dust.c, o); this.lit.set([0.05, 0.05, 0.05], o); this.size[i] = 1.4;
      }
    }
    this.onGust(x, y, z, k);
  }
}
