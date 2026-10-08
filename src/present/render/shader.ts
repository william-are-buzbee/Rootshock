import * as THREE from 'three';
import { BR, LCELL, LOFF } from '../../world/lightField';
import { BOUNCE, FLASH, LANTERN } from '../../world/light';

/* One shader for everything, carried over from the first engine.
   Light = the level's light (read point by point from its light field for the level itself, per object for things that
   move, per vertex for glass) + the lights you carry + the lights lying about, flat-shaded from screen-space derivatives.
   No ambient floor: unlit is black. A colour channel above 1.5 is emissive.
   Every light that is not the level's is drawn by LIGHTS below, in every shader that draws into the scene (motes,
   prints and drips too), from the numbers in world/light.ts, so a light is the same light wherever it falls and falls
   once. The flashlight is a reflector's beam: a hot centre, a faint bright ring at its rim, a wide dim spill; in your
   hand it shines from your eye (so it needs no shadows: what it lights is what you see), and what it lights close by
   throws some of it back around you (uBounce, measured by one ray a frame in camera.ts). Put down still on, it is the
   same beam from its lens, with a shadow map of its own (beams.ts), and what it throws back is in the level's light.
   The level's light (world/lightField.ts, put on the card by lightVolume.ts) is blended from the 2³ points around a
   pixel, a little off the surface into the open, taking only those on its open side that open space joins to the
   nearest: so light falls off smoothly across a room and through a doorway, and none comes through a wall or a slab.
   The part of it from tubes that stutter dims with them (uFlick), wherever it has reached.
   Then the eye: everything is scaled by how open it is (uExpo: wide in the dark, narrowed in light; main.ts), and the
   dark is never quite flat, but grained, most where it is darkest. */

const VS = /* glsl */ `
attribute vec3 aCol;
#if defined(STATIC)
attribute float aLight;
#elif defined(BAKED)
attribute vec4 aLight;
#else
uniform vec3 uLight;
#endif
varying vec3 vW; varying vec3 vC; varying vec3 vL;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vC = aCol;
#if defined(STATIC)
  vL = vec3(aLight, 0.0, 0.0);
#elif defined(BAKED)
  vL = aLight.rgb;
#else
  vL = uLight;
#endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

/** the screen's tone curve: mid-tones lifted, black left black, so a lit room reads as lit on a screen. Every shader
 *  that draws into the scene ends with it, so nothing stands out against the rest */
export const LIFT = /* glsl */ `vec3 lift(vec3 c){ return pow(max(c, vec3(0.0)), vec3(0.78)); }`;

/** the brightest light the field holds: what is over it is held at it */
export const LIGHT_RANGE = 4;
const f3 = (x: number) => x.toFixed(4);
const v3 = (c: readonly number[]) => `vec3(${c.map(f3).join(', ')})`;

/** how many flashlights lying on are drawn with their beams, and their shadow maps' size */
export const BEAMS = 2, SHADOW = 512;
/** the shadow map's camera: wide enough for the whole spill, from just past the lens */
export const SHADOW_CAM = { fov: 100, near: 0.05, far: 30 };

/** the lights that are not the level's, for any shader. Yours: `held(p, facing)` (the flashlight, from your eye),
 *  `bounce(p)` (what it throws back around you), `lantern(p, facing)`, and `carried(p, facing)` for all three. Lying
 *  about: `lying(p, n)`, flashlights put down on, with their shadows (n the surface's normal toward the eye, or zero for a
 *  speck of dust, which faces every way). A lantern lying on is in the level's light, as is what a beam lying on throws
 *  back */
export const LIGHTS = /* glsl */ `
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uBounce;
uniform vec4 uBeam[${BEAMS}]; uniform vec3 uBeamDir[${BEAMS}]; uniform mat4 uBeamM[${BEAMS}];
uniform sampler2D uSh0; uniform sampler2D uSh1;
float spot(float ca){
  float rim = (ca - ${f3(FLASH.rim)}) / ${f3(FLASH.rimW)};
  return 0.65 * smoothstep(${f3(FLASH.hot[0])}, ${f3(FLASH.hot[1])}, ca) + 0.42 * smoothstep(${f3(FLASH.spill[0])}, ${f3(FLASH.spill[1])}, ca) + 0.12 * exp(-rim * rim);
}
vec3 held(vec3 p, float facing){
  vec3 tc = cameraPosition - p; float d = length(tc);
  return uFlash * spot(dot(-tc / max(d, 0.001), uFlashDir)) * facing * ${f3(FLASH.gain)} / (1.0 + ${f3(FLASH.fall)} * d * d) * ${v3(FLASH.colour)};
}
vec3 bounce(vec3 p){
  vec3 tc = cameraPosition - p;
  return uBounce / (1.0 + ${f3(BOUNCE.fall)} * dot(tc, tc)) * ${v3(BOUNCE.colour)};
}
vec3 lantern(vec3 p, float facing){
  vec3 tc = cameraPosition - p;
  return uLamp * facing * ${f3(LANTERN.gain)} / (1.0 + ${f3(LANTERN.fall)} * dot(tc, tc)) * ${v3(LANTERN.colour)};
}
vec3 carried(vec3 p, float facing){ return held(p, facing) + bounce(p) + lantern(p, facing); }
/* how much of a beam's light reaches p, by its shadow map (3 by 3 taps, so the edge is soft) */
float unshadowed(sampler2D sm, mat4 M, vec3 p){
  vec4 c = M * vec4(p, 1.0);
  if (c.w <= ${f3(SHADOW_CAM.near)}) return 0.0;
  vec2 uv = c.xy / c.w * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  float n = ${f3(SHADOW_CAM.near)}, f = ${f3(SHADOW_CAM.far)}, bias = 0.03 + 0.012 * c.w, lit = 0.0;
  for (int i = -1; i <= 1; i++)
    for (int j = -1; j <= 1; j++) {
      float z = textureLod(sm, uv + vec2(float(i), float(j)) / ${SHADOW}.0, 0.0).r * 2.0 - 1.0;
      lit += c.w <= 2.0 * n * f / (f + n - z * (f - n)) + bias ? 1.0 : 0.0;
    }
  return lit / 9.0;
}
vec3 beamOn(vec3 p, vec3 n, vec4 B, vec3 dir, float seen){
  vec3 v = p - B.xyz; float d = length(v); vec3 L = v / max(d, 0.001);
  float facing = dot(n, n) > 0.0 ? 0.35 + 0.65 * abs(dot(n, L)) : 1.0;
  return B.w * seen * spot(dot(L, dir)) * facing * ${f3(FLASH.gain)} / (1.0 + ${f3(FLASH.fall)} * d * d) * ${v3(FLASH.colour)};
}
vec3 lying(vec3 p, vec3 n){
  vec3 q = p + n * 0.04, out3 = vec3(0.0);
  if (uBeam[0].w > 0.0) out3 += beamOn(p, n, uBeam[0], uBeamDir[0], unshadowed(uSh0, uBeamM[0], q));
  if (uBeam[1].w > 0.0) out3 += beamOn(p, n, uBeam[1], uBeamDir[1], unshadowed(uSh1, uBeamM[1], q));
  return out3;
}`;

const FS = /* glsl */ `
#ifdef STATIC
uniform sampler2D uLA; uniform highp sampler3D uLI; uniform vec3 uLO; uniform vec3 uLN; uniform int uLW;
/* the level's light at p, on a surface facing n (toward the eye), and in fl the part of it that flickers */
vec3 field(vec3 p, vec3 n, out vec3 fl){
  fl = vec3(0.0);
  vec3 f = (p + n * 0.2 - ${f3(LOFF)}) / ${f3(LCELL)}, b = floor(f), t = f - b;
  vec3 bk = floor(b / ${BR}.0), ix = bk - uLO;
  if (any(lessThan(ix, vec3(0.0))) || any(greaterThanEqual(ix, uLN))) return vec3(0.0);
  float slot = texelFetch(uLI, ivec3(ix), 0).r;
  if (slot < 0.0) return vec3(0.0);
  ivec3 l = ivec3(b - bk * ${BR}.0);
  int base = int(slot) * ${(BR + 1) ** 3};
  vec4 S[8]; float W[8]; int best = -1;
  for (int c = 0; c < 8; c++) {
    ivec3 o = ivec3(c & 1, (c >> 1) & 1, c >> 2), q = l + o;
    int i = base + (q.z * ${BR + 1} + q.y) * ${BR + 1} + q.x;
    S[c] = texelFetch(uLA, ivec2(i % uLW, i / uLW), 0);
    vec3 w3 = mix(1.0 - t, t, vec3(o));
    /* a point behind the surface counts for little: the far side of a wall it stands on */
    vec3 cp = (b + vec3(o)) * ${f3(LCELL)} + ${f3(LOFF)};
    W[c] = w3.x * w3.y * w3.z * (dot(cp - p, n) > -0.05 ? 1.0 : 0.03);
    if (S[c].a > 0.0 && (best < 0 || W[c] > W[best])) best = c;
  }
  if (best < 0) return vec3(0.0);
  /* only the points joined to the nearest open one */
  int reach = 1 << best;
  for (int pass = 0; pass < 3; pass++)
    for (int a = 0; a < 3; a++)
      for (int c = 0; c < 8; c++) {
        if ((c & (1 << a)) != 0) continue;
        int d = c | (1 << a);
        int bits = int(S[c].a * 255.0 + 0.5);
        if (((reach >> c) & 1) != ((reach >> d) & 1) && (bits & (2 << a)) != 0) reach |= (1 << c) | (1 << d);
      }
  vec3 acc = vec3(0.0), accF = vec3(0.0); float sw = 0.0;
  for (int c = 0; c < 8; c++) {
    if (((reach >> c) & 1) == 0) continue;
    vec3 l = W[c] * S[c].rgb * S[c].rgb;
    acc += l; accF += l * float(int(S[c].a * 255.0 + 0.5) >> 4) / 15.0; sw += W[c];
  }
  fl = accF / max(sw, 1e-5) * ${f3(LIGHT_RANGE)};
  return acc / max(sw, 1e-5) * ${f3(LIGHT_RANGE)};
}
#endif
${LIGHTS}
uniform float uFog; uniform float uWet; uniform float uTime;
uniform float uFlick; uniform float uHit; uniform float uBright; uniform float uExpo;
#if !defined(STATIC) && !defined(BAKED)
uniform vec3 uLightF;
#endif
varying vec3 vW; varying vec3 vC; varying vec3 vL;
${LIFT}
void main(){
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  vec3 tc = cameraPosition - vW; float d = length(tc); vec3 Ld = tc / max(d, 0.001);
  vec3 base = vC; float em = 0.0;
  if (base.r > 1.5) { base -= 2.0; em = 1.0; }
  float sh = 0.55 + 0.45 * (abs(n.y) * 0.95 + abs(n.x) * 0.7 + abs(n.z) * 0.5);
  float facing = 0.35 + 0.65 * abs(dot(n, Ld));
  vec3 nf = dot(n, Ld) < 0.0 ? -n : n;
#if defined(STATIC)
  vec3 fl, lv = field(vW, nf, fl);
  vec3 light = (lv - fl * 0.55 * uFlick) * vL.x * sh;
#elif defined(BAKED)
  vec3 light = vL * sh;
#else
  vec3 light = (vL - uLightF * 0.55 * uFlick) * sh;
#endif
  light += vec3(0.014) / (1.0 + 3.0 * d * d) + carried(vW, facing) + lying(vW, nf) + vec3(uBright);
  vec3 c = mix(base * light, base, em);
  c += uHit * vec3(0.45, 0.08, 0.06);
  c *= exp(-d * uFog);
  c = mix(c, c * vec3(0.5, 0.85, 0.9), uWet);
  c = lift(c * uExpo);
  /* a hash with no sin in it (a sin hash shows patterns on some GPUs), moved every frame */
  vec3 h3 = fract(vec3(gl_FragCoord.xyx + floor(fract(uTime * 7.13) * 977.0)) * 0.1031);
  h3 += dot(h3, h3.yzx + 33.33);
  float gr = fract((h3.x + h3.y) * h3.z) - 0.5;
  c += gr * 0.022 * (1.0 - smoothstep(0.0, 0.35, dot(c, vec3(0.3, 0.59, 0.11))));
#ifdef ALPHA
  gl_FragColor = vec4(c, ALPHA);
#else
  gl_FragColor = vec4(c, 1.0);
#endif
}`;

/** uniforms every material shares: the flashlight, the fog, time */
export const U = {
  uFlashDir: { value: new THREE.Vector3(0, 0, -1) },
  uFlash: { value: 0 },
  uLamp: { value: 0 },
  uFog: { value: 0.02 },
  uWet: { value: 0 },
  uTime: { value: 0 },
  /** 1 while flickering lights are dimmed (flicker.ts) */
  uFlick: { value: 0 },
  uBright: { value: 0 },
  /** the flashlight thrown back by whatever it is lighting close by */
  uBounce: { value: 0 },
  /** how open the eye is: above 1 adapted to the dark, below to the light */
  uExpo: { value: 1 },
  /** flashlights lying on: where (and how strong), which way, from where their shadow maps were taken, and the maps */
  uBeam: { value: Array.from({ length: BEAMS }, () => new THREE.Vector4()) },
  uBeamDir: { value: Array.from({ length: BEAMS }, () => new THREE.Vector3(0, 0, -1)) },
  uBeamM: { value: Array.from({ length: BEAMS }, () => new THREE.Matrix4()) },
  uSh0: { value: null as THREE.Texture | null },
  uSh1: { value: null as THREE.Texture | null },
  /** the level's light field: its bricks' texels, the index of its bricks, where the index starts and how big it is (in
   *  bricks), the texels' width (lightVolume.ts) */
  uLA: { value: null as THREE.Texture | null },
  uLI: { value: null as THREE.Texture | null },
  uLO: { value: new THREE.Vector3() },
  uLN: { value: new THREE.Vector3() },
  uLW: { value: 2048 },
};

/** the level's material: lit from the level's light field, each vertex saying how much of it it takes */
export function staticMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 } },
    defines: { STATIC: '' },
    vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide,
  });
}

/** a see-through surface (water, a window), its light baked into each vertex */
export function glassMaterial(alpha: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 } },
    defines: { BAKED: '', ALPHA: alpha.toFixed(3) },
    vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide, transparent: true, depthWrite: false,
  });
}

/** a material for one moving thing: its light (and the part of it that flickers) is set from where it stands */
export function dynamicMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 }, uLight: { value: new THREE.Vector3() }, uLightF: { value: new THREE.Vector3() } },
    vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide,
  });
}

/** the uniforms LIGHTS reads, shared: for a material of its own that includes LIGHTS */
export function lightUniforms() {
  const { uFlashDir, uFlash, uLamp, uBounce, uBeam, uBeamDir, uBeamM, uSh0, uSh1 } = U;
  return { uFlashDir, uFlash, uLamp, uBounce, uBeam, uBeamDir, uBeamM, uSh0, uSh1 };
}

/** light a moving thing's material by the level's light where it is: `l` the light, `f` the part of it that flickers */
export function lightMaterial(mat: THREE.ShaderMaterial, l: readonly number[], f: readonly number[]): void {
  (mat.uniforms.uLight.value as THREE.Vector3).set(l[0], l[1], l[2]);
  (mat.uniforms.uLightF.value as THREE.Vector3).set(f[0], f[1], f[2]);
}
