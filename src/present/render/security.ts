import * as THREE from 'three';
import { blowAt, type Mutant } from '../../sim/cast';
import { blinded, codeTimes, knocksFor } from '../../sim/eyes';
import { eyeHeight } from '../../sim/player';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { BONE, FLESH, grp as grp0, mk, type C, type O3, type Shape } from './castKit';

/* The Security flesh, drawn (world.md §8): the overseer and its hand. Looks only, as all of castView: the sim says where
   each is and what it is doing. They are drawn with more working parts than the rest of the cast: their limbs reach
   for where they put them (two bones, a joint that bends one way), the hand's feet stay where they land, and their eyes
   are eyes, turning to what they watch, with pupils that answer the light falling on them. */

const PI = Math.PI, TAU = PI * 2;
/* the hand's flesh, and the overseer's a touch redder: the same stuff */
const FL2 = 0xa47664, FL3 = 0xbe9280;
const MEAT = [0xa8705e, 0x9a6252, 0xb07a66, 0xa06854], SKIN = 0xb4826e;
const SCL = 0xd8d0c0, PUP = 0x15100e;

/** what the animations need besides the mutant: the sim, the time since the last frame, and the level's light */
export interface Ctx { sim: Sim; dt: number; L: Lighting }

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const ease = (t: number) => t * t * (3 - 2 * t);
const smooth = (a: number, b: number, x: number) => ease(clamp((x - a) / (b - a), 0, 1));
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _e = new THREE.Vector3(), _p = new THREE.Vector3(), _f = new THREE.Vector3();

/** a group that turns yaw first, then pitch: what looks and reaches */
function grp(parent: O3, x: number, y: number, z: number): THREE.Group {
  const g = grp0(parent, x, y, z);
  g.rotation.order = 'YXZ';
  return g;
}
type Put = (parent: O3, shape: Shape, c: C, sx: number, sy: number, sz: number, x: number, y: number, z: number) => THREE.Mesh;

/** the yaw and pitch, in o's parent's frame, that turn o's +z at t (world) */
function aim(o: O3, t: THREE.Vector3): [number, number] {
  _v.copy(t); o.parent!.worldToLocal(_v); _v.sub(o.position);
  return [Math.atan2(_v.x, _v.z), -Math.atan2(_v.y, Math.hypot(_v.x, _v.z))];
}

/* ---- limbs: two bones along +z and an end; the root turns to face what it reaches for, and the joint bends up */

interface Limb { h: THREE.Group; k: THREE.Group; t: THREE.Group; L1: number; L2: number; end: THREE.Group[] }
function limb(put: Put, parent: O3, at: readonly number[], L1: number, L2: number, c1: C, c2: C, w: number, end: (t: THREE.Group) => THREE.Group[], joint: C = BONE): Limb {
  const h = grp(parent, at[0], at[1], at[2]);
  put(h, 'ico', c1, w, w, L1 * 1.35, 0, 0, L1 / 2);
  const k = grp(h, 0, 0, L1);
  put(k, 'ico', joint, w * 1.3, w * 1.15, w * 1.15, 0, w * 0.15, 0);
  put(k, 'ico', c2, w * 0.85, w * 0.85, L2 * 1.35, 0, 0, L2 / 2);
  const t = grp(k, 0, 0, L2);
  return { h, k, t, L1, L2, end: end(t) };
}
/** a hand on the end of a limb, palm down, its fingers to curl */
const handEnd = (put: Put, s: number) => (t: THREE.Group): THREE.Group[] => {
  put(t, 'ico', FLESH, 0.15 * s, 0.07 * s, 0.17 * s, 0, -0.01 * s, 0.07 * s);
  const f: THREE.Group[] = [];
  for (let k = 0; k < 4; k++) { const fg = grp(t, (-0.045 + k * 0.03) * s, -0.01 * s, 0.13 * s); fg.rotation.y = (k - 1.5) * 0.12; put(fg, 'box', FL3, 0.028 * s, 0.028 * s, 0.13 * s, 0, 0, 0.065 * s); f.push(fg); }
  put(t, 'box', FL3, 0.032 * s, 0.032 * s, 0.09 * s, 0.075 * s, -0.01 * s, 0.07 * s).rotation.y = 0.7;
  return f;
};
const footEnd = (put: Put) => (t: THREE.Group): THREE.Group[] => { put(t, 'ico', FL3, 0.12, 0.08, 0.28, 0, -0.01, 0.09); return []; };

/** bend a limb so its end reaches t (world). Returns the pitch the end is left at, for it to be undone */
function reach(L: Limb, t: THREE.Vector3): number {
  _v.copy(t); L.h.parent!.worldToLocal(_v); _v.sub(L.h.position);
  const yaw = Math.atan2(_v.x, _v.z), hz = Math.hypot(_v.x, _v.z), th = Math.atan2(-_v.y, hz);
  const d = clamp(Math.hypot(hz, _v.y), Math.abs(L.L1 - L.L2) + 0.02, L.L1 + L.L2 - 0.002);
  const B = Math.acos(clamp((L.L1 * L.L1 + d * d - L.L2 * L.L2) / (2 * L.L1 * d), -1, 1));
  const Cn = Math.acos(clamp((L.L1 * L.L1 + L.L2 * L.L2 - d * d) / (2 * L.L1 * L.L2), -1, 1));
  const a1 = th - B, a2 = PI - Cn;
  L.h.rotation.set(a1, yaw, 0); L.k.rotation.set(a2, 0, 0);
  return a1 + a2;
}

/* ---- a footfall, so a foot stays where it was put. u runs 0..1 round the gait: for the first FALL of it the foot is
   down, on the spot it landed on in the world (the body moves and turns over it); then it lifts and swings to where it
   lands next, `land`. Not walking, it is simply at `home`. */

const FALL = 0.62;
interface Fall { p: THREE.Vector3; l: THREE.Vector3; down: boolean; up: boolean }
const fall = (): Fall => ({ p: new THREE.Vector3(), l: new THREE.Vector3(), down: false, up: false });
function footfall(S: Fall, u: number, w: number, home: THREE.Vector3, land: THREE.Vector3, lift: number, out: THREE.Vector3): THREE.Vector3 {
  if (w < 0.02) { S.down = S.up = false; return out.copy(home); }
  if (u < FALL) {
    if (!S.down) { S.p.copy(S.up ? land : home); S.down = true; }
    out.copy(S.p);
  } else {
    if (S.down || !S.up) { S.l.copy(S.down ? S.p : home); S.down = false; S.up = true; }
    const q = (u - FALL) / (1 - FALL);
    out.lerpVectors(S.l, land, ease(q)); out.y += Math.sin(q * PI) * lift;
  }
  /* coming to a stop or setting off, between standing and stepping */
  return out.lerpVectors(home, out, smooth(0.02, 0.35, w));
}
const HOME = new THREE.Vector3(), LAND = new THREE.Vector3();
const phase = (ph: number, off: number) => (((ph + off) / TAU) % 1 + 1) % 1;

/* ---- eyes: a ball that turns in its socket to look, with no lid, as the cast have none: a blink squeezes it flat, and
   shut it is rolled back, white. The pupil is set by the light falling on the eye, the room's and your torch's if the
   eye is in its beam (by how near and how square); fear opens it, looking at something near narrows it, and it never
   quite holds still. It shuts quickly and opens slowly. */

interface Eye { g: THREE.Group; ball: THREE.Group; pup: THREE.Mesh; r: number; blink: number; shut: number; roll: number; sq: number; dil: number; pmax: number; hip: number; yaw: number; pitch: number }
function eye(put: Put, parent: O3, r: number, x: number, y: number, z: number, pupil = 0.5): Eye {
  const g = grp(parent, x, y, z), ball = grp(g, 0, 0, 0);
  put(ball, 'ico', SCL, r * 2, r * 2, r * 2, 0, 0, 0);
  const pup = put(ball, 'ico', PUP, r * pupil, r * pupil, r * 0.22, 0, 0, r * 0.86);
  return { g, ball, pup, r, blink: 1 + Math.random() * 5, shut: 0, roll: 0, sq: 1, dil: 1, pmax: 0.86 / pupil, hip: Math.random() * TAU, yaw: 0, pitch: 0 };
}
interface Mood { stare: boolean; drowse?: number; shut?: boolean }
function lookEye(E: Eye, t: THREE.Vector3, c: Ctx, mood: Mood): void {
  const dt = c.dt, [y, p] = aim(E.ball, t), k = damp(14, dt);
  E.yaw += (clamp(y, -0.75, 0.75) - E.yaw) * k; E.pitch += (clamp(p, -0.6, 0.6) - E.pitch) * k;
  E.roll += ((mood.shut ? 1 : 0) - E.roll) * damp(5, dt);
  E.ball.rotation.set(lerp(E.pitch, -1.5, E.roll), E.yaw * (1 - E.roll), 0);
  if ((E.blink -= dt) < 0 && !mood.stare && !mood.shut) { E.blink = 2 + Math.random() * 5; E.shut = 0.16; }
  const blinking = E.shut > 0 ? Math.sin((1 - (E.shut -= dt) / 0.16) * PI) : 0;
  E.sq += ((mood.stare ? 1.1 : 1 - 0.3 * (mood.drowse ?? 0)) - E.sq) * damp(5, dt);
  E.ball.scale.set(E.sq, E.sq * (1 - 0.85 * blinking), E.sq);
  /* the light at the eye */
  E.g.getWorldPosition(_e);
  const near = _e.distanceTo(t), at = c.L.atPoint(_e.x, _e.y, _e.z), g = c.sim.game, pl = c.sim.player;
  let lum = (at[0] + at[1] + at[2]) / 3;
  if (g.lightOn) {
    _p.set(pl.body.x, pl.body.y + eyeHeight(pl), pl.body.z);
    const toE = _e.sub(_p), fd = toE.length() || 1;
    if (g.light === 'flash') {
      const cp = Math.cos(pl.pitch);
      _f.set(-Math.sin(pl.yaw) * cp, Math.sin(pl.pitch), -Math.cos(pl.yaw) * cp);
      lum += smooth(0.88, 0.975, toE.dot(_f) / fd) * 2.5 / (1 + 0.09 * fd * fd);
    } else lum += 0.8 / (1 + 0.3 * fd * fd);
  }
  const now = performance.now() / 1000;
  let dil = lerp(1.45, 0.3, lum / (lum + 0.4)) + (mood.stare ? 0.3 : 0) - 0.12 * (mood.drowse ?? 0) - (near < 2.5 ? 0.22 * (1 - near / 2.5) : 0);
  dil = clamp(dil + Math.sin(now * 1.7 + E.hip) * 0.025 + Math.sin(now * 0.53 + E.hip * 2) * 0.03, 0.28, E.pmax);
  E.dil += (dil - E.dil) * damp(dil < E.dil ? 6 : 1.1, dt);
  E.pup.scale.set(E.dil, E.dil, 1);
}

/** where you are looking from */
const yourEye = (sim: Sim, out: THREE.Vector3) => out.set(sim.player.body.x, sim.player.body.y + eyeHeight(sim.player), sim.player.body.z);

/* ================================================================================================================
   THE HAND: what is left of the response team, made one thing. One of them lies on all fours and is the body, walking
   on its arms and legs, elbows and knees up. Out of its front hang four legs, as a husk's are, knees up and feet curled
   down, working like mouthparts and striking; it has no face. Out of its back grows another, feet first, as a tail; at
   the end of it a head with one great eye, and long arms of its own. Low, the tail lies along the floor, its hands
   walking either side of the head and its eye rolled back, and it reads as a tail. Raised, it curls up over the back,
   its arms held as a person's, and stays out of the strike. All flesh; only the joints show white. */

export interface HandModel {
  g: THREE.Group; body: THREE.Group;
  legs: (Limb & { rest: THREE.Vector3; ph: number; S: Fall })[];
  fingers: (Limb & { i: number; x: number; S: Fall })[];
  tail: THREE.Group[]; hd: THREE.Group; eye: Eye;
  arms: (Limb & { s: number; S: Fall })[];
  /* how it is moving and holding itself, eased from frame to frame */
  raise: number; walk: number; droop: number; press: number; ph: number; v: number; lx: number; lz: number; knocks: number;
  hy: number; hp: number;
}
const TAIL = [[-0.62, 0.5, 0.12, 0.06, 0.0], [0.95, 0.55, 0.4, 0.25, 0.15]];

export function buildHand(mat: THREE.Material): HandModel {
  const put: Put = (p, sh, c, sx, sy, sz, x, y, z) => mk(p, mat, sh, c, sx, sy, sz, x, y, z);
  const g = new THREE.Group(), body = grp(g, 0, 0.5, 0);
  /* the body: one of them on all fours, back up, smooth */
  put(body, 'ico', FLESH, 0.86, 0.5, 1.3, 0, 0, -0.05);
  put(body, 'ico', FL2, 0.66, 0.3, 1.0, 0, -0.13, -0.05);
  for (const s of [-1, 1]) put(body, 'ico', FL3, 0.34, 0.2, 0.34, s * 0.2, 0.16, 0.2);
  put(body, 'ico', FL2, 0.32, 0.2, 0.4, 0.26, 0.1, -0.36);
  /* its four: the arms in front, the legs behind */
  const legs: HandModel['legs'] = [];
  for (const s of [-1, 1]) {
    legs.push({ ...limb(put, body, [s * 0.3, 0, 0.3], 0.55, 0.62, FLESH, FL3, 0.13, handEnd(put, 1.1)), rest: new THREE.Vector3(s * 0.95, 0, 0.62), ph: s > 0 ? PI : 0, S: fall() });
    legs.push({ ...limb(put, body, [s * 0.28, -0.02, -0.42], 0.6, 0.68, FLESH, FL3, 0.15, footEnd(put)), rest: new THREE.Vector3(s * 0.92, 0, -0.8), ph: s > 0 ? 0 : PI, S: fall() });
  }
  /* the front: a lobe, and the four legs out of it, side by side, knees up, feet curled down */
  put(body, 'ico', FLESH, 0.74, 0.44, 0.5, 0, 0.02, 0.56);
  const fingers: HandModel['fingers'] = [];
  [-0.2, -0.067, 0.067, 0.2].forEach((x, i) => {
    const long = i === 1 || i === 2, c = i % 2 ? FLESH : FL3;
    put(body, 'ico', BONE, 0.1, 0.09, 0.09, x, 0, 0.72);
    fingers.push({ ...limb(put, body, [x, 0, 0.72], long ? 0.42 : 0.38, long ? 0.44 : 0.4, c, c, 0.12, footEnd(put)), i, x, S: fall() });
  });
  /* the tail: the other one, feet first out of the back of a thick root; smooth, tapering */
  const tail: THREE.Group[] = [], TL = [0.42, 0.45, 0.38, 0.34, 0.22], TW = [0.62, 0.5, 0.38, 0.3, 0.26];
  put(body, 'ico', FLESH, 0.72, 0.5, 0.7, 0, 0.06, -0.62); put(body, 'ico', FL2, 0.5, 0.36, 0.5, 0, 0.14, -0.78);
  let par: O3 = body, at = [0, 0.1, -0.6];
  TL.forEach((L, i) => {
    const t = grp(par, at[0], at[1], at[2]);
    put(t, 'ico', i % 2 ? FL2 : FLESH, TW[i], TW[i] * 0.85, L * 1.5, 0, 0, -L / 2);
    tail.push(t); par = t; at = [0, 0, -L];
  });
  const t4 = tail[4];
  put(t4, 'ico', FLESH, 0.6, 0.26, 0.3, 0, 0, -0.12);
  /* its head on the end, its face on the tail's upper side: one great eye and nothing else */
  const hb = grp(t4, 0, 0, -0.2); hb.rotation.x = -PI / 2;
  const hd = grp(hb, 0, 0, 0);
  put(hd, 'ico', FLESH, 0.6, 0.64, 0.56, 0, 0.32, 0.02);
  const E = eye(put, hd, 0.25, 0, 0.34, 0.15, 0.6);
  /* and its long arms, from the shoulders under the head */
  const arms: HandModel['arms'] = [];
  for (const s of [-1, 1]) arms.push({ ...limb(put, t4, [s * 0.24, 0.02, -0.12], 0.55, 0.6, FLESH, FL3, 0.11, handEnd(put, 1.2)), s, S: fall() });
  return { g, body, legs, fingers, tail, hd, eye: E, arms, raise: 0, walk: 0, droop: 0, press: 0, ph: 0, v: 0, lx: NaN, lz: NaN, knocks: 0, hy: 0, hp: 0.3 };
}

const RAISED = ['go', 'wind', 'charge', 'recover', 'pursue'];
const HP = new THREE.Vector3(), LOOK = new THREE.Vector3();

export function animHand(m: Mutant, M: HandModel, c: Ctx): void {
  const { sim, dt } = c, g = M.g, now = m.ph;
  g.updateMatrixWorld(true);
  /* how fast it is going, from where it is drawn */
  const moved = Number.isFinite(M.lx) ? Math.hypot(g.position.x - M.lx, g.position.z - M.lz) : 0;
  M.lx = g.position.x; M.lz = g.position.z;
  M.v += (Math.min(9, dt > 0 ? moved / dt : 0) - M.v) * damp(8, dt);
  /* what it is doing: low and roaming, listening, or up and after something; with no overseer, it hangs its head */
  const raised = RAISED.includes(m.state), calm = blinded(sim) && !m.riled;
  const K = sim.knocks[0], landed = K ? K.landed : 0;
  if (m.state === 'listen' && landed > M.knocks) M.press = 1;
  M.knocks = landed;
  M.raise += ((raised ? 1 : calm ? 0.45 : 0) - M.raise) * damp(raised ? 2.4 : 1.6, dt);
  M.droop += ((calm && !raised ? 1 : 0) - M.droop) * damp(1.5, dt);
  M.walk += (smooth(0.05, 0.5, M.v) - M.walk) * damp(4, dt);
  M.press = Math.max(0, M.press - dt * 3.5);
  const R = M.raise, w = M.walk, P = M.press, D = M.droop;
  /* its blow is the front legs': they rear up as it winds up or charges, and stamp down as it strikes */
  let wind = 0, slam = 0;
  const B = blowAt(m);
  if (B) {
    if (B.ph === 'wind') wind = ease(B.q);
    else if (B.ph === 'strike') { wind = 1 - B.q; slam = B.q; }
    else slam = 1 - ease(Math.max(0, (B.q - 0.3) / 0.7));
  } else if (m.state === 'wind') wind = ease(clamp(1 - m.st / 0.75, 0, 1));
  else if (m.state === 'charge') wind = 0.35;
  else if (m.state === 'recover') slam = ease(clamp(m.st / 1.2, 0, 1));
  /* the gait: a full stride for the speed, and as many steps as cover the ground; the feet stay where they land */
  const stride = clamp(0.2 + M.v * 0.04, 0.2, 0.45);
  M.ph += dt * (M.v * FALL * TAU) / (2 * stride);
  /* the body: low and nose down, roaming; up on its four, raised */
  const h = lerp(0.36, 0.74, R) - P * 0.06 + Math.sin(M.ph * 2) * 0.025 * w - slam * 0.1;
  M.body.position.set(0, h, slam * 0.18 + Math.sin(M.ph * 2) * 0.02 * w);
  M.body.rotation.set(lerp(0.08, -0.08, R) - wind * 0.1 + slam * 0.15, Math.sin(now * 0.5) * 0.04, Math.sin(M.ph) * 0.04 * w);
  /* the tail: along the floor, or up over the back, hanging when nothing calls it. It takes no part in the strike: its
     root gives back the body's lunge and tip, so it stands still over the blow */
  M.tail.forEach((T, i) => { T.rotation.x = lerp(TAIL[0][i], TAIL[1][i], R) - D * [0, 0.25, 0.25, 0.25, 0.2][i] + Math.sin(now * 1.1 - i * 0.6) * 0.035 * (0.3 + R); });
  M.tail[0].rotation.x += wind * 0.1 - slam * 0.15;
  M.tail[0].position.set(0, 0.1 + slam * 0.1, -0.6 - slam * 0.18);
  g.updateMatrixWorld(true);
  /* its four: diagonal pairs together */
  for (const L of M.legs) {
    const x = L.rest.x * lerp(1, 0.86, R);
    g.localToWorld(HOME.set(x, 0, L.rest.z)); g.localToWorld(LAND.set(x, 0, L.rest.z + stride * w));
    footfall(L.S, phase(M.ph, L.ph), w, HOME, LAND, 0.16, _w);
    L.t.rotation.x = -reach(L, _w);
  }
  /* the front legs: feet set down in front, knees riding up over the body. Walking low, they step on their own beat
     between the four's; standing or raised they work back and forth two and two; then the strike */
  for (const F of M.fingers) {
    const o = now * lerp(2.2, 3.4, R) + (F.i % 2 ? PI : 0) + F.i * 0.3, amp = lerp(0.04, 0.12, R);
    const lowWalk = w * (1 - R), work = 1 - lowWalk;
    let x = F.x * 1.25, y = lerp(0, 0.24, R) + Math.max(0, Math.cos(o)) * lerp(0.02, 0.09, R) * work, z = lerp(1.02, 1.08, R) + Math.sin(o) * amp * work;
    if (lowWalk > 0.02) {
      g.localToWorld(HOME.set(x, y, z)); g.localToWorld(LAND.set(x, y, z + stride * 0.8 * w));
      footfall(F.S, phase(M.ph, PI * 0.5 + (F.i % 2 ? PI : 0) + F.i * 0.35), lowWalk, HOME, LAND, 0.1, _e);
      g.worldToLocal(_e); x = _e.x; y = _e.y; z = _e.z;
    } else F.S.down = F.S.up = false;
    y -= P * 0.03;
    x = lerp(x, F.x * 1.9, wind); y = lerp(y, h + 0.35, wind); z = lerp(z, 0.98, wind);
    x = lerp(x, F.x * 0.9, slam); y = lerp(y, 0, slam); z = lerp(z, 1.4, slam);
    g.localToWorld(_w.set(x, Math.max(0, y) + 0.04, z));
    F.t.rotation.x = -reach(F, _w) + wind * 0.5;
  }
  /* the tail's arms. Low, they walk beside the head, each on its own side (reckoned in the hand's frame, so they never
     cross). Raised, they are held as a person holds them: upper arms hanging along the body, elbows back, forearms bent
     forward, hands drooping. Each joint blends from the one to the other as it rises */
  const Hd = g.worldToLocal(M.hd.getWorldPosition(HP));
  for (const A of M.arms) {
    g.localToWorld(HOME.set(Hd.x + A.s * 0.55, 0, Hd.z + 0.1)); g.localToWorld(LAND.set(Hd.x + A.s * 0.55, 0, Hd.z + 0.1 + stride * 0.9 * w));
    footfall(A.S, phase(M.ph, A.s > 0 ? PI * 0.5 : PI * 1.5), w * (1 - R), HOME, LAND, 0.14, _w);
    _w.y = Math.max(g.position.y, _w.y - P * 0.02);
    const reachT = -reach(A, _w), lowA1 = A.h.rotation.x, lowYaw = A.h.rotation.y, lowA2 = A.k.rotation.x;
    const sw = Math.sin(now * 1.1 + A.s) * 0.06 + Math.sin(M.ph + (A.s > 0 ? PI : 0)) * 0.1 * w;
    A.h.rotation.set(lerp(lowA1, -0.3 + sw, R), lerp(lowYaw, A.s * 0.32, R), 0);
    A.k.rotation.set(lerp(lowA2, -1.85 + sw * 0.5, R), 0, 0);
    A.t.rotation.set(lerp(reachT, 0.95, R), 0, 0);
    A.end.forEach((f, k) => { f.rotation.x = lerp(0.05, 0.9, R) + (1 - R) * Math.sin(now * (6 + k * 1.3) + k + A.s) * 0.12 - P * 0.1; });
  }
  /* the head on the tail looks only once it is up, its eye rolled back till then; at you, if it has seen you */
  g.updateMatrixWorld(true);
  const up = R > 0.55, look = up && (m.los || m.state === 'pursue' || m.state === 'charge') ? yourEye(sim, LOOK) : g.localToWorld(LOOK.set(Math.sin(now * 0.3) * 2, up ? 1.4 : 0, 6));
  const [hy, hp] = aim(M.hd, look);
  M.hy += ((up ? clamp(hy, -1.3, 1.3) : 0) - M.hy) * damp(4, dt); M.hp += ((up ? clamp(hp, -1.0, 1.0) : 0.3) + D * 0.6 - M.hp) * damp(4, dt);
  M.hd.rotation.set(M.hp, M.hy, Math.sin(now * 0.9) * 0.06);
  M.hd.updateMatrixWorld(true);
  lookEye(M.eye, look, c, { stare: up, drowse: D * 0.7, shut: !up });
}

/* ================================================================================================================
   THE OVERSEER: the operations staff grown into one body at their posts (the watchers at its screens are the level's,
   upper.ts). One of them lies face down and flat under the rest, its cheek to the floor, its arms out of the sides and
   its legs out behind under the cords; the others are fused on top, a back, shoulders; the first sits up out of the
   middle, its head on its shoulders, with one great eye, and works the two clubbed arms in front it knocks with. A
   smaller pair braces it behind, fists dug into the floor. Its origin is that eye, by the glass; the body is behind. */

interface Arm { A: THREE.Group; E: THREE.Group; s: number; t: number }
export interface OverseerModel {
  g: THREE.Group; body: THREE.Group; head: THREE.Group; eye: Eye; arms: Arm[];
  hy: number; hp: number; tgt: THREE.Vector3; landed: number;
}

export function buildOverseer(mat: THREE.Material): OverseerModel {
  const put: Put = (p, sh, c, sx, sy, sz, x, y, z) => mk(p, mat, sh, c, sx, sy, sz, x, y, z);
  const g = new THREE.Group(), O = grp(g, -0.25, 0, -1.0), body = grp(O, 0, 0, 0);
  /* the floor in front, where its fists come down, and behind, where its hind fists went in: stained and cracked */
  for (const [s, z, w, d] of [[-1, 1.42, 0.95, 0.8], [1, 1.42, 0.95, 0.8], [-1, -1.38, 0.6, 0.55], [1, -1.38, 0.6, 0.55]] as const) {
    put(O, 'box', 0x3a1612, w, 0.006, d, s * 1.36, 0.004, z);
    for (let k = 0; k < 4; k++) put(O, 'box', 0x141516, w * 0.7, 0.008, 0.025, s * 1.36, 0.006, z).rotation.y = k * 0.8 + s;
  }
  /* the mound: several of them, fused */
  for (const [x, y, z, sx, sy, sz, c] of [[0, 0.55, -0.1, 2.1, 1.3, 1.8, MEAT[0]], [0.6, 0.85, -0.4, 1.5, 1.25, 1.3, MEAT[2]], [-0.65, 0.8, -0.25, 1.35, 1.15, 1.25, MEAT[1]],
    [-0.15, 1.25, -0.55, 1.15, 0.95, 1.05, MEAT[3]], [0.75, 0.42, 0.45, 0.95, 0.8, 0.85, FLESH], [-0.8, 0.45, 0.5, 0.8, 0.7, 0.7, MEAT[2]], [0.05, 0.3, 0.75, 1.2, 0.55, 0.6, MEAT[3]]] as const)
    put(body, 'ico', c, sx, sy, sz, x, y, z);
  /* who they were: the first's chest and shoulders */
  put(body, 'ico', MEAT[3], 0.85, 0.6, 0.5, 0.25, 1.08, 0.42);
  for (const x of [-0.27, 0.77]) put(body, 'ico', MEAT[2], 0.5, 0.38, 0.46, x, 1.3, 0.18);
  /* the foundation, flat and wide, its cheek to the floor at the front and its eyes shut */
  put(body, 'ico', MEAT[1], 2.9, 0.42, 2.3, 0, 0.17, 0.05);
  put(body, 'ico', MEAT[3], 1.5, 0.3, 0.9, 0, 0.26, 0.6);
  put(body, 'ico', MEAT[2], 0.56, 0.36, 0.42, 0.06, 0.2, 1.22).rotation.z = 0.2;
  for (const [x, y] of [[-0.06, 0.25], [0.16, 0.22]]) put(body, 'box', 0x5a2a22, 0.1, 0.014, 0.02, x, y, 1.42).rotation.z = 0.2;
  /* shoulders that lost their heads, and a back with its spine showing */
  put(body, 'ico', MEAT[1], 0.58, 0.42, 0.52, -0.85, 1.0, 0.22); put(body, 'ico', MEAT[3], 0.5, 0.38, 0.46, 0.9, 1.12, -0.3);
  for (let k = 0; k < 5; k++) put(body, 'ico', MEAT[2], 0.17, 0.12, 0.15, -0.15, 1.63 - k * 0.12, -0.42 - k * 0.15);
  /* the foundation's arms, long, out of the sides, elbows up and hands flat; its legs out behind */
  const limbs: [Limb, THREE.Vector3][] = [];
  for (const s of [-1, 1]) {
    const L = limb(put, body, [s * 1.15, 0.24, -0.1], 0.95, 0.9, MEAT[1], FL3, 0.26, t => {
      put(t, 'ico', FL3, 0.3, 0.1, 0.34, 0, -0.03, 0.14);
      for (let k = 0; k < 4; k++) put(t, 'box', FL3, 0.045, 0.04, 0.2, -0.09 + k * 0.06, -0.04, 0.36);
      return [];
    }, MEAT[2]);
    put(L.h, 'box', MEAT[3], 0.2, 0.22, 0.75, s * 0.1, 0.06, 0.4);
    limbs.push([L, new THREE.Vector3(s * 2.4, 0, 0.15)]);
    const K = limb(put, body, [s * 0.45, 0.2, -0.95], 0.85, 0.85, MEAT[3], FL3, 0.22, t => { put(t, 'box', FL3, 0.2, 0.09, 0.4, 0, -0.03, 0.15); return []; }, MEAT[2]);
    limbs.push([K, new THREE.Vector3(s * 0.85, 0, -2.4)]);
  }
  /* set down once: they bear its weight and do not move */
  g.updateMatrixWorld(true);
  for (const [L, foot] of limbs) L.t.rotation.x = -reach(L, O.localToWorld(foot.clone()));
  /* two clubbed arms, each several of theirs fused, fists on the floor in front: what it knocks with. A smaller pair the
     same behind, their fists dug in */
  const arms: Arm[] = [];
  for (const [s, back] of [[-1, 0], [1, 0], [-1, 1], [1, 1]] as const) {
    const A = back ? grp(body, s * 0.85, 0.72, -0.75) : grp(body, s * 1.0, 1.02, 0.42);
    A.rotation.y = back ? PI - s * 0.5 : s * 0.28;
    if (back) { A.scale.setScalar(0.68); A.rotation.x = 0.78; }
    put(A, 'box', FLESH, 0.24, 0.24, 0.85, -0.07, 0, 0.42); put(A, 'box', FL3, 0.2, 0.2, 0.82, 0.1, 0.06, 0.4); put(A, 'box', FL2, 0.08, 0.2, 0.7, 0.01, 0.02, 0.42);
    put(A, 'ico', MEAT[s > 0 ? 0 : 3], 0.4, 0.36, 0.34, 0, 0, 0.08);
    const E = grp(A, 0, 0, 0.85);
    put(E, 'ico', BONE, 0.16, 0.14, 0.14, 0.04, 0.06, -0.02);
    put(E, 'box', FL3, 0.2, 0.2, 0.7, -0.06, 0, 0.35); put(E, 'box', FLESH, 0.17, 0.17, 0.68, 0.09, 0.03, 0.34);
    const F = grp(E, 0, 0, 0.74);
    put(F, 'ico', FLESH, 0.44, 0.36, 0.42, 0, -0.02, 0.08); put(F, 'ico', FL2, 0.3, 0.26, 0.3, s * 0.14, 0.05, 0.02); put(F, 'ico', FL3, 0.26, 0.24, 0.26, -s * 0.13, -0.06, 0.14);
    for (let k = 0; k < 4; k++) put(F, 'box', BONE, 0.07, 0.06, 0.07, -0.15 + k * 0.1, 0.12, 0.24);
    if (back) { E.rotation.x = 0.62; continue; }
    A.rotation.x = 0.62; E.rotation.x = 0.55;
    arms.push({ A, E, s, t: 9 });
  }
  /* the head: the first one's, on its shoulders, one great eye and nothing else */
  const head = grp(body, 0.25, 1.4, 0.15);
  put(head, 'box', MEAT[2], 0.6, 0.5, 0.5, 0, 0.1, 0.1);
  put(head, 'ico', SKIN, 1.15, 1.25, 1.05, 0, 0.42, 0.32);
  const E = eye(put, head, 0.43, 0, 0.45, 0.55, 0.6);
  return { g, body, head, eye: E, arms, hy: 0, hp: -0.05, tgt: new THREE.Vector3(NaN, 0, 0), landed: 0 };
}

const PREY = new THREE.Vector3();

export function animOverseer(m: Mutant, M: OverseerModel, c: Ctx): void {
  const { sim, dt } = c, g = M.g, now = m.ph;
  g.updateMatrixWorld(true);
  /* its knocks: each fist lifts in the third of a second before its beat and comes down on it, one then the other.
     Tensed to lash at what comes near, both come up, shaking */
  const K = sim.knocks[0], times = K ? codeTimes(knocksFor(sim, K.zone)) : [];
  if (K && K.landed > M.landed) M.arms[(K.landed - 1) % 2].t = 0;
  M.landed = K ? K.landed : 0;
  const tense = Math.min(1, m.tense / 0.9);
  M.arms.forEach((a, idx) => {
    let up = 0;
    if (K) { const nxt = times.find((_, i) => i >= K.landed && i % 2 === idx); if (nxt !== undefined && nxt - K.t < 0.34) up = ease(1 - (nxt - K.t) / 0.34); }
    a.t += dt;
    const after = a.t < 0.25 ? Math.sin((a.t / 0.25) * PI) * 0.06 * (1 - a.t / 0.25) : 0;
    let want = 0.62 - up * 0.62 - after;
    want = lerp(want, -0.5 + Math.sin(now * 30) * 0.1, tense);
    a.A.rotation.x = up > 0 || tense > 0 ? want : a.A.rotation.x + (want - a.A.rotation.x) * damp(a.t < 0.08 ? 60 : 6, dt);
    a.E.rotation.x = 0.55 - up * 0.35 + Math.sin(now * 0.8 + a.s) * 0.02;
  });
  /* it breathes */
  const br = 1 + Math.sin(now * 0.9) * 0.018;
  M.body.scale.set(br, 1 / br, br);
  /* what it watches: you, if it sees you; else whichever of the staff is nearest in front of it in the hall; else the
     hall itself */
  const sees = m.los && m.d < 30 * sim.game.vis;
  let prey: THREE.Vector3 | null = sees ? yourEye(sim, PREY) : null;
  if (!prey) {
    let best = 28;
    for (const q of sim.cast) {
      if (q.dead || q === m || q.ai !== 'husk') continue;
      g.worldToLocal(_w.set(q.x, q.y + 1.6, q.z));
      const d = _w.length();
      if (_w.z > 1 && d < best) { best = d; prey = PREY.set(q.x, q.y + 1.6, q.z); }
    }
  }
  if (!prey) prey = g.localToWorld(PREY.set(Math.sin(now * 0.13) * 4, 1.2 + Math.sin(now * 0.21) * 1.2, 9));
  if (!Number.isFinite(M.tgt.x)) M.tgt.copy(prey);
  M.tgt.lerp(prey, damp(sees ? 2 : 0.9, dt));
  M.body.updateMatrixWorld(true);
  const [y, p] = aim(M.head, M.tgt);
  M.hy += (clamp(y, -0.6, 0.6) - M.hy) * damp(1.8, dt); M.hp += (clamp(p, -0.7, 0.7) - M.hp) * damp(1.8, dt);
  M.head.rotation.set(M.hp, M.hy, 0);
  M.head.updateMatrixWorld(true);
  lookEye(M.eye, M.tgt, c, { stare: sees });
}
