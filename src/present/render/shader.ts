import * as THREE from 'three';
import { BR, LCELL, LOFF } from '../../world/lightField';

/* One shader for everything, carried over from the first engine.
   Light = the level's light (read point by point from its light field for the level itself, per object for things that
   move, per vertex for glass) + flashlight cone + lantern, flat-shaded from screen-space derivatives. No ambient floor:
   unlit is black. A colour channel above 1.5 is emissive.
   The flashlight is a reflector's beam: a hot centre, a faint bright ring at its rim, a wide dim spill; and what it
   lights close by throws some of it back around you (uBounce, measured by one ray a frame in camera.ts).
   The level's light (world/lightField.ts, put on the card by lightVolume.ts) is blended from the 2³ points around a
   pixel, a little off the surface into the open, taking only those on its open side that open space joins to the
   nearest: so light falls off smoothly across a room and through a doorway, and none comes through a wall or a slab.
   Then the eye: everything is scaled by how open it is (uExpo: wide in the dark, narrowed in light; main.ts), and the
   dark is never quite flat, but grained, most where it is darkest. */

const VS = /* glsl */ `
attribute vec3 aCol;
#if defined(STATIC)
attribute vec2 aLight;
#elif defined(BAKED)
attribute vec4 aLight;
#else
uniform vec3 uLight;
#endif
varying vec3 vW; varying vec3 vC; varying vec4 vL;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vC = aCol;
#if defined(STATIC)
  vL = vec4(aLight, 0.0, 0.0);
#elif defined(BAKED)
  vL = vec4(aLight.rgb, 0.0);
#else
  vL = vec4(uLight, 0.0);
#endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

/** the screen's tone curve: mid-tones lifted, black left black, so a lit room reads as lit on a screen. Every shader
 *  that draws into the scene ends with it, so nothing stands out against the rest */
export const LIFT = /* glsl */ `vec3 lift(vec3 c){ return pow(max(c, vec3(0.0)), vec3(0.78)); }`;

/** the brightest light the field holds: what is over it is held at it */
export const LIGHT_RANGE = 4;
const f3 = (x: number) => x.toFixed(4);

const FS = /* glsl */ `
#ifdef STATIC
uniform sampler2D uLA; uniform highp sampler3D uLI; uniform vec3 uLO; uniform vec3 uLN; uniform int uLW;
/* the level's light at p, on a surface facing n (toward the eye) */
vec3 field(vec3 p, vec3 n){
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
  vec3 acc = vec3(0.0); float sw = 0.0;
  for (int c = 0; c < 8; c++) {
    if (((reach >> c) & 1) == 0) continue;
    acc += W[c] * S[c].rgb * S[c].rgb; sw += W[c];
  }
  return acc / max(sw, 1e-5) * ${f3(LIGHT_RANGE)};
}
#endif
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uWet; uniform float uTime;
uniform float uFlick; uniform float uHit; uniform float uBright; uniform float uBounce; uniform float uExpo;
varying vec3 vW; varying vec3 vC; varying vec4 vL;
${LIFT}
void main(){
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  vec3 tc = cameraPosition - vW; float d = length(tc); vec3 Ld = tc / max(d, 0.001);
  vec3 base = vC; float em = 0.0;
  if (base.r > 1.5) { base -= 2.0; em = 1.0; }
  float sh = 0.55 + 0.45 * (abs(n.y) * 0.95 + abs(n.x) * 0.7 + abs(n.z) * 0.5);
  float facing = 0.35 + 0.65 * abs(dot(n, Ld));
#ifdef STATIC
  float fk = 1.0 - vL.y * 0.55 * uFlick;
  vec3 light = field(vW, dot(n, Ld) < 0.0 ? -n : n) * vL.x * sh * fk + vec3(0.014) / (1.0 + 3.0 * d * d);
#else
  vec3 light = vL.rgb * sh + vec3(0.014) / (1.0 + 3.0 * d * d);
#endif
  float ca = dot(-Ld, uFlashDir), rim = (ca - 0.952) / 0.007;
  float spot = 0.65 * smoothstep(0.91, 0.975, ca) + 0.42 * smoothstep(0.76, 0.92, ca) + 0.12 * exp(-rim * rim);
  light += uFlash * spot * facing * 2.3 / (1.0 + 0.055 * d * d) * vec3(1.0, 0.93, 0.78);
  light += uBounce / (1.0 + 0.18 * d * d) * vec3(1.0, 0.9, 0.76);
  light += uLamp * facing * 1.5 / (1.0 + 0.2 * d * d) * vec3(0.72, 0.92, 1.0);
  light += vec3(uBright);
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
  /** the level's light field: its bricks' texels, the index of its bricks, where the index starts and how big it is (in
   *  bricks), the texels' width (lightVolume.ts) */
  uLA: { value: null as THREE.Texture | null },
  uLI: { value: null as THREE.Texture | null },
  uLO: { value: new THREE.Vector3() },
  uLN: { value: new THREE.Vector3() },
  uLW: { value: 2048 },
};

/** the level's material: lit from the level's light field, each vertex saying how much it takes (and if it flickers) */
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

/** a material for one moving thing: its light is set from where it stands */
export function dynamicMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 }, uLight: { value: new THREE.Vector3() } },
    vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide,
  });
}
