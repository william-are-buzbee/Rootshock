import * as THREE from 'three';

/* One shader for everything, carried over from the first engine.
   Light = baked light (per vertex for the level, per object for things that move) + flashlight cone + lantern,
   flat-shaded from screen-space derivatives. No ambient floor: unlit is black. A colour channel above 1.5 is emissive.
   The flashlight is a reflector's beam: a hot centre, a faint bright ring at its rim, a wide dim spill; and what it
   lights close by throws some of it back around you (uBounce, measured by one ray a frame in camera.ts). */

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

const FS = /* glsl */ `
uniform vec3 uFlashDir; uniform float uFlash; uniform float uLamp; uniform float uFog; uniform float uWet; uniform float uTime;
uniform float uFlick; uniform float uHit; uniform float uBright; uniform float uBounce;
varying vec3 vW; varying vec3 vC; varying vec4 vL;
void main(){
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  vec3 tc = cameraPosition - vW; float d = length(tc); vec3 Ld = tc / max(d, 0.001);
  vec3 base = vC; float em = 0.0;
  if (base.r > 1.5) { base -= 2.0; em = 1.0; }
  float sh = 0.55 + 0.45 * (abs(n.y) * 0.95 + abs(n.x) * 0.7 + abs(n.z) * 0.5);
  float fk = 1.0 - vL.a * 0.55 * uFlick;
  float facing = 0.35 + 0.65 * abs(dot(n, Ld));
  vec3 light = vL.rgb * sh * fk + vec3(0.014) / (1.0 + 3.0 * d * d);
  float ca = dot(-Ld, uFlashDir), rim = (ca - 0.952) / 0.007;
  float spot = 0.75 * smoothstep(0.91, 0.975, ca) + 0.45 * smoothstep(0.76, 0.92, ca) + 0.12 * exp(-rim * rim);
  light += uFlash * spot * facing * 2.3 / (1.0 + 0.055 * d * d) * vec3(1.0, 0.93, 0.78);
  light += uBounce / (1.0 + 0.18 * d * d) * vec3(1.0, 0.9, 0.76);
  light += uLamp * facing * 1.5 / (1.0 + 0.2 * d * d) * vec3(0.72, 0.92, 1.0);
  light += vec3(uBright);
  vec3 c = mix(base * light, base, em);
  c += uHit * vec3(0.45, 0.08, 0.06);
  c *= exp(-d * uFog);
  c = mix(c, c * vec3(0.5, 0.85, 0.9), uWet);
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
  uFog: { value: 0.032 },
  uWet: { value: 0 },
  uTime: { value: 0 },
  /** 1 while flickering lights are dimmed (flicker.ts) */
  uFlick: { value: 0 },
  uBright: { value: 0 },
  /** the flashlight thrown back by whatever it is lighting close by */
  uBounce: { value: 0 },
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
