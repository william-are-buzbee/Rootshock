import * as THREE from 'three';
import { POOL } from '../../world/light';

/* One shader for everything, carried over from the first engine.
   Light = baked light (per vertex for the level, per object for things that move) + flashlight cone + lantern,
   flat-shaded from screen-space derivatives. No ambient floor: unlit is black. A colour channel above 1.5 is emissive.
   The flashlight is a reflector's beam: a hot centre, a faint bright ring at its rim, a wide dim spill; and what it
   lights close by throws some of it back around you (uBounce, measured by one ray a frame in camera.ts).
   The level's own light falls in pools under its ceiling fittings: for the rooms near you (pools.ts), each pixel in one
   takes base + gain x what that room's fittings throw at it, as world/light.ts reckons it for everything that moves.
   Then the eye: everything is scaled by how open it is (uExpo: wide in the dark, narrowed in light; main.ts), and the
   dark is never quite flat, but grained, most where it is darkest. */

const VS = /* glsl */ `
attribute vec3 aCol;
#ifdef STATIC
attribute vec4 aLight;
#else
uniform vec3 uLight;
#endif
varying vec3 vW; varying vec3 vC; varying vec4 vL;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vC = aCol;
#ifdef STATIC
  vL = aLight;
#else
  vL = vec4(uLight, 0.0);
#endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

/** how many rooms near you are pooled, and how many fittings in them, at most */
/** the screen's tone curve: mid-tones lifted, black left black, so a lit room reads as lit on a screen. Every shader
 *  that draws into the scene ends with it, so nothing stands out against the rest */
export const LIFT = /* glsl */ `vec3 lift(vec3 c){ return pow(max(c, vec3(0.0)), vec3(0.78)); }`;

export const POOL_ROOMS = 12, POOL_FIX = 32;
const f1 = (x: number) => x.toFixed(3);

const FS = /* glsl */ `
#ifdef STATIC
uniform vec4 uFix[${POOL_FIX}]; uniform vec4 uBoxA[${POOL_ROOMS}]; uniform vec2 uBoxB[${POOL_ROOMS}]; uniform int uBoxN; uniform int uFixN;
/* how much of its room's light reaches this pixel by the room's fittings: 1 outside the rooms near you */
float pooled(vec3 p){
  for (int b = 0; b < ${POOL_ROOMS}; b++) {
    if (b >= uBoxN) break;
    vec4 A = uBoxA[b]; vec2 B = uBoxB[b];
    if (p.x < A.x || p.x > A.z || p.z < A.y || p.z > A.w || p.y < B.x || p.y > B.y) continue;
    float s = 0.0;
    for (int i = 0; i < ${POOL_FIX}; i++) {
      if (i >= uFixN) break;
      vec4 F = uFix[i];
      if (int(F.w) != b) continue;
      vec3 v = F.xyz - p;
      if (v.y <= 0.0) continue;
      float d2 = dot(v, v), c = v.y * inversesqrt(d2);
      s += c * c * c * ${f1(POOL.r2)} / (${f1(POOL.r2)} + d2);
    }
    return ${f1(POOL.base)} + ${f1(POOL.gain)} * min(s, 1.0);
  }
  return 1.0;
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
  float fk = 1.0 - vL.a * 0.55 * uFlick;
  float facing = 0.35 + 0.65 * abs(dot(n, Ld));
#ifdef STATIC
  vec3 light = vL.rgb * pooled(vW) * sh * fk + vec3(0.014) / (1.0 + 3.0 * d * d);
#else
  vec3 light = vL.rgb * sh * fk + vec3(0.014) / (1.0 + 3.0 * d * d);
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
  /** the rooms near you that have fittings (x0, z0, x1, z1; y0, y1) and their fittings (x, y, z, which room): pools.ts */
  uFix: { value: Array.from({ length: POOL_FIX }, () => new THREE.Vector4()) },
  uBoxA: { value: Array.from({ length: POOL_ROOMS }, () => new THREE.Vector4()) },
  uBoxB: { value: Array.from({ length: POOL_ROOMS }, () => new THREE.Vector2()) },
  uBoxN: { value: 0 },
  uFixN: { value: 0 },
};

/** the level's material: light baked into each vertex */
export function staticMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 } },
    defines: { STATIC: '' },
    vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide,
  });
}

/** a see-through surface (water), light baked like the level's */
export function glassMaterial(alpha: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, uHit: { value: 0 } },
    defines: { STATIC: '', ALPHA: alpha.toFixed(3) },
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
