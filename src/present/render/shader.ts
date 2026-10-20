import * as THREE from 'three';
import { BR, LCELL, LOFF } from '../../world/lightField';
import { BOUNCE, FLASH, LANTERN, POOL } from '../../world/light';
import { MATS, MAT_ORDER, type Mat, type Pattern } from '../../content/materials';

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
   Your body stands in the way of the fittings over you (selfShade): a few capsules (selfView.ts) against the nearest
   fittings of the room you are in, each taking back its share of the light where it falls, soft-edged, wider and
   fainter the further it falls from you.
   Then the eye: everything is scaled by how open it is (uExpo: wide in the dark, narrowed in light; main.ts), and the
   dark is never quite flat, but grained, most where it is darkest.

   What a surface is made of (content/materials.ts, by aMat) is drawn on it, from where it is: the level's in the
   world, so a pattern runs on across faces, a moving thing's in its own frame, so a pushed crate's boards go with it.
   No textures but one of noise, made here. Each pattern gives a shade, a height and how glossy each part is (mortar is
   not, the block's paint is): the shade is the colour's, the height tips the surface's facing (bump, from how it
   changes across the screen), and the gloss is the carried lights' highlight. The beam reaches what it reaches from
   your eye, but its facing and highlight are reckoned from your hand, a little below and to the right of the eye
   (uFlashPos), so the relief of what is close is raked by it. The fine detail fades with distance, where it would only
   shimmer. The level's walls also show wear: grime at their foot, water run down from the ceiling in places.
   All of it is surface detail, the player's to turn off (uDetail, setDetail): off, every surface is its flat colour
   and the beam's facing is reckoned from the eye, as it was before materials were drawn. */

const PATTERNS: Pattern[] = ['none', 'cast', 'block', 'plaster', 'tiles', 'glazed', 'flags', 'plate', 'mesh', 'rock', 'boards',
  'shot', 'epoxy', 'vinyl', 'carpet', 'terrazzo', 'stone'];
/** how many materials there are, with "none" at 0 */
const NM = MAT_ORDER.length + 1;
const MAT_IDS = new Map<Mat, number>(MAT_ORDER.map((m, k) => [m, k + 1]));
/** a material's number for the shader (aMat): 0 for a thing that says nothing of what it is */
export const matId = (m?: Mat): number => (m ? MAT_IDS.get(m)! : 0);
const P = (p: Pattern) => PATTERNS.indexOf(p);

const VS = /* glsl */ `
attribute vec3 aCol; attribute float aMat; attribute vec2 aRoomY;
uniform vec4 uLookA[${NM}]; uniform vec4 uLookB[${NM}];
#if defined(STATIC)
attribute float aLight;
#elif defined(BAKED)
attribute vec4 aLight;
#else
uniform vec3 uLight;
#endif
varying vec3 vW; varying vec3 vO; varying vec3 vC; varying vec3 vL; varying vec4 vLA; varying vec4 vLB; varying vec2 vRY;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vO = position; vC = aCol;
  int k = int(aMat + 0.5); vLA = uLookA[k]; vLB = uLookB[k]; vRY = aRoomY;
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

/** your body's shadow from the fittings over you: how many capsules make you, how many fittings throw it, how much
 *  darker than the field's own reckoning it is drawn (the field's fill, light from everywhere, is mostly the fittings'
 *  too: by the field's numbers alone a shadow between two fittings was barely there), and the darkest it gets */
export const SELF = { caps: 5, fix: 2, dark: 1.6, most: 0.8 };

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

/* The patterns. `p` is where on the thing (metres), `n` its facing there in the same frame, `up` how high over its
   room's floor; out come a shade (1 is the colour as given), a height (metres), a gloss multiplier, and a tint for
   what is not the colour as given (rust, a chip of marble, a brass strip). Lines are drawn with their width filtered
   over the pixel, and fade to the share of the surface they cover once finer than a pixel; specks (`fine`) fade to
   their average sooner, before they would crawl. */
const SURFACE = /* glsl */ `
uniform sampler2D uNoise;
/* smooth noise in three dimensions from one look-up: the noise texture's green is its red moved by (37, 17), which is
   the next layer up */
float n3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  vec2 uv = i.xy + vec2(37.0, 17.0) * i.z + f.xy;
  vec2 rg = texture2D(uNoise, (uv + 0.5) / 256.0).rg;
  return mix(rg.x, rg.y, f.z);
}
float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
/* 1 on a line of a grid every per metres, w either side of it; 0 between */
float grid(float x, float per, float w){
  float d = abs(fract(x / per + 0.5) - 0.5) * per, fw = fwidth(x);
  float on = 1.0 - smoothstep(w - fw, w + fw, d);
  return mix(on, min(1.0, 2.0 * w / per), smoothstep(0.1, 0.45, fw / per));
}
/* 1 within r of a point of a lattice of dots, d from the nearest */
float dot1(float d, float r, float fw){ return (1.0 - smoothstep(r - fw, r + fw, d)) * (1.0 - smoothstep(r * 0.4, r * 1.2, fw)); }
void surface(int pat, vec3 p, vec3 n, float up, float det, out float alb, out float h, out float gm, out vec3 tint){
  alb = 1.0; h = 0.0; gm = 1.0; tint = vec3(1.0);
  vec3 an = abs(n);
  bool horiz = an.y > max(an.x, an.z);
  bool overhead = horiz && n.y < 0.0;
  /* across the face and up it: a floor or ceiling's are x and z; a wall's along it and up from the floor */
  vec2 uv = horiz ? p.xz : vec2(an.x > an.z ? p.z : p.x, up);
  float fw = fwidth(uv.x) + fwidth(uv.y), fine = 1.0 - smoothstep(0.006, 0.02, fw);
  if (pat == ${P('cast')}) {
    float b = n3(p * 0.6), s = n3(p * 7.0), sp = n3(p * 31.0);
    alb = 1.0 + 0.18 * (b - 0.5) + 0.12 * (s - 0.5) * det + 0.08 * (sp - 0.5) * det;
    h = 0.006 * b + 0.0015 * s + 0.0004 * sp;
    if (!horiz || overhead) {
      /* the formwork it was poured in: boards 1.2 by 0.6 m up a wall, sheets 1.2 by 2.4 overhead, and a pair of tie
         holes in each */
      vec2 per = overhead ? vec2(1.2, 2.4) : vec2(1.2, 0.6);
      float seam = max(grid(uv.x, per.x, 0.003), grid(uv.y, per.y, 0.003));
      vec2 c = fract(uv / per) * per;
      float tie = dot1(min(length(c - per * vec2(0.25, 0.5)), length(c - per * vec2(0.75, 0.5))), 0.012, fw);
      alb *= (1.0 - 0.16 * seam) * (1.0 - 0.5 * tie);
      h -= 0.002 * seam + 0.008 * tie;
    }
  } else if (pat == ${P('block')}) {
    /* block filled and painted smooth, as an institution paints it: no coursing (drawn, it read as brick), a roller's
       stipple, the paint a little uneven, and a control joint every 6 m */
    float m = n3(p * 0.7), st = mix(0.5, n3(p * 55.0), fine), j = grid(uv.x, 6.0, 0.004);
    alb = (1.0 + 0.05 * (m - 0.5) + 0.05 * (st - 0.5) * det) * (1.0 - 0.15 * j);
    h = 0.0003 * st - 0.002 * j;
    gm = 1.0 - 0.6 * j;
  } else if (pat == ${P('plaster')}) {
    float b = n3(p * 1.1), pe = n3(p * 42.0);
    alb = 1.0 + 0.05 * (b - 0.5) + 0.03 * (pe - 0.5) * det;
    h = 0.0002 * pe;
  } else if (pat == ${P('tiles')}) {
    /* a suspended ceiling's grid, a third of a 2 m tile each way, of painted T-bar; the tiles pitted mineral fibre */
    vec2 q = horiz ? p.xz : uv;
    float bar = max(grid(q.x, 2.0 / 3.0, 0.012), grid(q.y, 2.0 / 3.0, 0.012));
    float pits = smoothstep(0.7, 0.78, n3(p * 70.0)) * det, tone = hash(floor(q * 1.5));
    alb = mix(1.0 + 0.06 * (tone - 0.5) + 0.04 * (n3(p * 9.0) - 0.5) - 0.1 * pits, 1.12, bar);
    h = 0.004 * bar - 0.0006 * pits;
    gm = 1.0 + 5.0 * bar;
  } else if (pat == ${P('glazed')}) {
    /* 150 mm tiles in grout; each laid a little out of true, so a highlight breaks across them */
    vec2 q = horiz ? p.xz : uv, cell = floor(q / 0.15), f = fract(q / 0.15) - 0.5;
    float g = max(grid(q.x, 0.15, 0.0025), grid(q.y, 0.15, 0.0025));
    float tone = hash(cell), tilt = hash(cell + 17.0);
    alb = (1.0 + 0.06 * (tone - 0.5)) * (1.0 - 0.35 * g);
    h = 0.0012 * ((tone - 0.5) * f.x + (tilt - 0.5) * f.y) - 0.002 * g;
    gm = 1.0 - 0.95 * g;
  } else if (pat == ${P('flags')}) {
    /* the street: large square flags, joint to joint (laid half a flag along, small and contrasting, they read as a
       brick pavement), each a little different in tone */
    vec2 cell = floor(uv / 0.9);
    float j = max(grid(uv.x, 0.9, 0.003), grid(uv.y, 0.9, 0.003));
    float tone = hash(cell), grit = n3(p * 18.0);
    alb = (1.0 + 0.06 * (tone - 0.5) + 0.08 * (grit - 0.5) * det) * (1.0 - 0.2 * j);
    h = 0.0012 * grit - 0.003 * j;
  } else if (pat == ${P('mesh')} && horiz) {
    /* bar grating, galvanised: bearing bars 5 mm thick on 30 mm centres along z, 30 mm deep, so looked at across them
       their sides close the gaps and it reads as a floor, and looked along them you see down through (drawn as a
       square grid of thin lines, the same from every side, it read as graph paper); twisted cross rods every 100 mm,
       flush with their tops; panels a metre wide, a banding bar at each edge, each a little different */
    vec3 v = normalize(cameraPosition - p);
    float tilt = 1.0 / max(abs(v.y), 0.05);
    float top = grid(p.x, 0.03, 0.0025);
    float bear = grid(p.x, 0.03, min(0.0025 + 0.015 * abs(v.x) * tilt, 0.015));
    /* (a rod is 6 mm proud of the slot's floor of shadow: looking along the slots at a slant, the rods close them) */
    float rod = grid(p.z, 0.1, min(0.0015 + 0.006 * abs(v.z) * tilt, 0.05));
    float band = grid(p.x, 1.0, 0.004);
    float pan = hash(vec2(floor(p.x), floor(p.z / 6.0))), grime = n3(p * 0.8);
    float solid = max(max(bear, 0.85 * rod), band);
    /* between the bars, the dim of what is under the walkway: not black */
    alb = mix(0.3, mix(0.62, 1.0, max(top, band)) * (1.0 + 0.1 * (pan - 0.5) + 0.14 * (grime - 0.5)), solid);
    h = 0.0015 * top + 0.003 * band;
    gm = max(top, band);
  } else if (pat == ${P('plate')} || pat == ${P('mesh')}) {
    /* steel plate in panels a metre across and 1.2 m high, seamed and riveted; brushed along its length */
    vec2 per = vec2(1.0, 1.2), c = fract(uv / per) * per;
    float seam = max(grid(uv.x, per.x, 0.002), grid(uv.y, per.y, 0.002));
    float ex = min(c.x, per.x - c.x), ey = min(c.y, per.y - c.y);
    float ax = abs(fract(uv.x / 0.15 + 0.5) - 0.5) * 0.15, ay = abs(fract(uv.y / 0.15 + 0.5) - 0.5) * 0.15;
    float riv = dot1(min(length(vec2(ex - 0.03, ay)), length(vec2(ey - 0.03, ax))), 0.007, fw);
    float brush = n3(vec3(uv.x * 2.0, uv.y * 70.0, 3.1)), stain = n3(p * 0.4);
    alb = (1.0 + 0.1 * (brush - 0.5) * det + 0.24 * (stain - 0.5)) * (1.0 - 0.3 * seam) * (1.0 + 0.15 * riv);
    h = -0.002 * seam + 0.003 * riv + 0.0001 * brush;
    gm = 0.7 + 0.6 * brush;
  } else if (pat == ${P('rock')}) {
    float a = n3(p * 0.9), b = n3(p * 3.1), c = n3(p * 11.0);
    float strata = 0.5 + 0.5 * sin(p.y * 6.0 + a * 5.0);
    alb = 0.88 + 0.5 * (0.5 * a + 0.33 * b + 0.17 * c * det - 0.5) + 0.07 * strata;
    h = 0.09 * a + 0.025 * b + 0.004 * c * det;
    /* where it is wet, it shines */
    gm = 0.4 + 6.0 * smoothstep(0.6, 0.78, n3(p * 0.35 + 9.0));
  } else if (pat == ${P('boards')}) {
    /* planks 120 mm wide, across the face; grain along them */
    vec2 q = horiz ? p.xz : vec2(an.x > an.z ? p.z : p.x, p.y);
    float k = floor(q.y / 0.12), gap = grid(q.y, 0.12, 0.003);
    float tone = hash(vec2(k, 7.0)), grain = n3(vec3(q.x * 1.5, q.y * 60.0, k * 3.0));
    alb = (1.0 + 0.2 * (tone - 0.5) + 0.14 * (grain - 0.5) * det) * (1.0 - 0.5 * gap);
    h = -0.003 * gap + 0.0003 * grain;
  } else if (pat == ${P('shot')}) {
    /* sprayed over blasted rock: lumps the size of the rock's own under the spray's grain, and no seams */
    float a = n3(p * 0.7), b = n3(p * 2.3), g = n3(p * 23.0), sp = n3(p * 61.0);
    alb = 0.94 + 0.2 * (a - 0.5) + 0.12 * (b - 0.5) + (0.1 * (g - 0.5) + 0.06 * (sp - 0.5) * fine) * det;
    h = 0.07 * a + 0.025 * b + (0.002 * g + 0.0004 * sp * fine) * det;
    if (!horiz || overhead) {
      /* the rock bolts: a plate 150 mm square every 1.5 m, rows staggered, sprayed over with the rest, so it shows as a
         raised square and the nut through it; under one in four on a wall, a faint stain of rust run down from it */
      float row = floor(uv.y / 1.5);
      vec2 q = vec2(uv.x + 0.75 * mod(row, 2.0), uv.y), cell = floor(q / 1.5), c = fract(q / 1.5) * 1.5 - 0.75;
      float edge = 1.0 - smoothstep(0.02, 0.08, fw);
      float plate = (1.0 - smoothstep(0.075 - fw, 0.075 + fw, max(abs(c.x), abs(c.y)))) * edge + 0.01 * (1.0 - edge);
      float nut = dot1(length(c), 0.022, fw);
      float tear = overhead ? 0.0 : step(0.75, hash(cell + 3.0)) * (1.0 - smoothstep(0.02, 0.07, abs(c.x)))
        * smoothstep(-0.5, -0.1, c.y) * (1.0 - smoothstep(-0.09, -0.07, c.y)) * edge;
      alb *= 1.0 - 0.15 * nut;
      h += 0.004 * plate + 0.006 * nut;
      gm = mix(gm, 3.0, nut);
      tint = mix(mix(vec3(1.0), vec3(1.0, 0.9, 0.8), nut), vec3(1.2, 0.9, 0.7), 0.45 * tear);
    }
  } else if (pat == ${P('epoxy')}) {
    /* a coated slab: the coat smooth and a little uneven in tone, saw cuts between 4 m bays, scuffs where wheels and
       feet went, which take the shine off it */
    float m = n3(p * 0.45), cut = max(grid(uv.x, 4.0, 0.003), grid(uv.y, 4.0, 0.003));
    float scuff = smoothstep(0.6, 0.8, n3(vec3(uv.x * 1.5, uv.y * 9.0, 7.7))) * smoothstep(0.45, 0.7, n3(p * 0.3 + 3.0));
    alb = (1.0 + 0.08 * (m - 0.5) - 0.14 * scuff * det) * (1.0 - 0.45 * cut);
    h = -0.003 * cut;
    gm = (1.0 - 0.6 * scuff) * (1.0 - cut);
  } else if (pat == ${P('vinyl')}) {
    /* sheet vinyl: flecked dark and light, the seams welded every 2 m along the roll */
    float f1 = mix(0.12, smoothstep(0.68, 0.74, n3(p * 140.0)), fine), f2 = mix(0.1, smoothstep(0.7, 0.76, n3(p * 110.0 + 5.0)), fine);
    float seam = grid(uv.x, 2.0, 0.0015), m = n3(p * 0.6);
    alb = 1.0 + 0.05 * (m - 0.5) + (0.12 * f2 - 0.14 * f1) * det - 0.15 * seam;
    h = -0.0005 * seam;
    gm = 1.0 - 0.4 * seam;
  } else if (pat == ${P('carpet')}) {
    /* carpet tile, 500 mm, each laid a quarter turn from the next, so the pile takes the light one way or the other;
       worn paler where the feet went */
    vec2 cell = floor(uv / 0.5);
    float turn = mod(cell.x + cell.y, 2.0);
    float pile = n3(turn > 0.5 ? vec3(uv.x * 200.0, uv.y * 60.0, 1.0) : vec3(uv.x * 60.0, uv.y * 200.0, 1.0));
    float j = max(grid(uv.x, 0.5, 0.001), grid(uv.y, 0.5, 0.001)), worn = n3(p * 0.7);
    alb = (1.0 + 0.04 * (turn - 0.5) + 0.14 * (pile - 0.5) * fine * det + 0.08 * (worn - 0.5)) * (1.0 - 0.1 * j);
    h = 0.0008 * pile * fine - 0.001 * j;
    gm = 0.0;
  } else if (pat == ${P('terrazzo')}) {
    /* marble chips in cement, ground flat and polished: dark, pale and a few rust-red ones, an inch or so across, so
       they read further off than the finer specks elsewhere; brass strips between bays 1.5 m square */
    float big = 1.0 - smoothstep(0.012, 0.04, fw);
    float c1 = mix(0.08, smoothstep(0.7, 0.74, n3(p * 34.0)), big), c2 = mix(0.12, smoothstep(0.66, 0.7, n3(p * 27.0 + 11.0)), big);
    float c3 = mix(0.03, smoothstep(0.77, 0.81, n3(p * 40.0 + 23.0)), big), grain = n3(p * 90.0);
    float strip = max(grid(uv.x, 1.5, 0.0015), grid(uv.y, 1.5, 0.0015)), m = n3(p * 0.5);
    alb = mix((1.0 + 0.06 * (m - 0.5) + 0.06 * (grain - 0.5) * fine) * (1.0 - 0.3 * c1) * (1.0 + 0.14 * c2), 1.04, strip);
    tint = mix(mix(vec3(1.0), vec3(1.18, 0.9, 0.76), c3), vec3(1.15, 1.03, 0.8), strip);
    h = 0.0002 * (c2 - c1) * big + 0.0004 * strip;
    gm = 1.0 + 1.5 * strip;
  } else if (pat == ${P('stone')}) {
    /* honed limestone hung as cladding: panels 1.5 m long and 0.75 high stacked joint over joint (set half a panel
       along, as masonry is, it reads as brick), hairline joints; its bedding planes, and pits where a fossil fell out */
    float row = floor(uv.y / 0.75), x = uv.x;
    float j = max(grid(uv.y, 0.75, 0.001), grid(x, 1.5, 0.001));
    float tone = hash(vec2(floor(x / 1.5), row)), bed = n3(vec3(x * 1.5, uv.y * 14.0, tone * 40.0));
    float pit = smoothstep(0.73, 0.78, n3(p * 45.0)) * fine;
    alb = (1.0 + 0.06 * (tone - 0.5) + 0.08 * (bed - 0.5) * det - 0.12 * pit) * (1.0 - 0.1 * j);
    h = -0.001 * j - 0.0004 * pit;
    gm = 1.0 - 0.9 * j;
  }
}
/* the facing n tipped by a height h over the surface, from how both change across the screen (Mikkelsen's bump
   mapping of unparametrised surfaces) */
vec3 bumped(vec3 n, vec3 w, float h){
  vec3 dx = dFdx(w), dy = dFdy(w), r1 = cross(dy, n), r2 = cross(n, dx);
  float det = dot(dx, r1);
  vec3 g = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - g);
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
uniform vec4 uSelfA[${SELF.caps}]; uniform vec4 uSelfB[${SELF.caps}]; uniform vec4 uFix[${SELF.fix}]; uniform vec3 uSelfLo; uniform vec3 uSelfHi;
/* how much of a capsule (a to b, radius r) stands between p and a light dl away along l: soft, its edge wider and its
   middle fainter the further p is behind it, and gone past 7 m */
float capsule(vec3 p, vec3 l, float dl, vec3 a, vec3 b, float r){
  vec3 ba = b - a, pa = p - a;
  float bb = max(dot(ba, ba), 1e-6), lb = dot(l, ba), lp = dot(l, pa), bp = dot(ba, pa);
  float s = clamp((bp - lp * lb) / max(bb - lb * lb, 1e-6), 0.0, 1.0);
  float t = clamp(s * lb - lp, 0.0, dl);
  if (t < 0.02 || t > dl - 0.05) return 0.0;
  s = clamp(dot(pa + t * l, ba) / bb, 0.0, 1.0);
  float d = length(pa + t * l - s * ba), w = 0.03 + 0.45 * t / max(dl - t, 0.25);
  return (1.0 - smoothstep(r - 0.5 * w, r + 0.5 * w, d)) * min(1.0, 2.0 * r / w) * (1.0 - smoothstep(4.0, 7.0, t));
}
/* how much of the level's light at p (facing n) your body leaves: each fitting's share of it, as the field reckons a
   fitting's pool (POOL in world/lightField.ts), less what the body hides of that fitting; drawn SELF.dark darker */
float selfShade(vec3 p, vec3 n){
  if (uFix[0].w <= 0.0 || any(lessThan(p, uSelfLo)) || any(greaterThan(p, uSelfHi))) return 1.0;
  vec3 q = p + n * 0.02;
  float sum = 0.0, cut = 0.0;
  for (int j = 0; j < ${SELF.fix}; j++) {
    vec4 F = uFix[j];
    vec3 L = F.xyz - q; float dl = length(L);
    if (F.w <= 0.0 || L.y <= 0.0) continue;
    float c = L.y / dl, v = F.w * c * c * c * ${f3(POOL.r2)} / (${f3(POOL.r2)} + dl * dl), occ = 0.0;
    for (int k = 0; k < ${SELF.caps}; k++) occ = max(occ, capsule(q, L / dl, dl, uSelfA[k].xyz, uSelfB[k].xyz, uSelfA[k].w));
    sum += v; cut += v * occ;
  }
  if (sum <= 0.0) return 1.0;
  float pool = ${f3(POOL.gain)} * min(sum, 1.0);
  return 1.0 - min(${f3(SELF.most)}, ${f3(SELF.dark)} * pool / (${f3(POOL.base)} + pool) * cut / sum);
}
#endif
${LIGHTS}
uniform float uFog; uniform float uWet; uniform float uTime;
uniform float uFlick; uniform float uHit; uniform float uBright; uniform float uExpo; uniform vec3 uFlashPos; uniform float uDetail;
#if !defined(STATIC) && !defined(BAKED)
uniform vec3 uLightF;
#endif
varying vec3 vW; varying vec3 vO; varying vec3 vC; varying vec3 vL; varying vec4 vLA; varying vec4 vLB; varying vec2 vRY;
${LIFT}
${SURFACE}
void main(){
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  vec3 tc = cameraPosition - vW; float d = length(tc); vec3 Ld = tc / max(d, 0.001);
  vec3 nf = dot(n, Ld) < 0.0 ? -n : n;
  vec3 base = vC; float em = 0.0;
  if (base.r > 1.5) { base -= 2.0; em = 1.0; }
  /* what it is made of: the level's drawn where it is in the world, a moving thing's in its own frame */
  int pat = int(vLB.x + 0.5);
  float alb = 1.0, h = 0.0, gm = 1.0, det = 1.0 - smoothstep(9.0, 26.0, d);
  vec3 tint = vec3(1.0);
  bool walls = vRY.y > vRY.x, on = uDetail > 0.5;
  if (on && pat > 0 && em == 0.0) {
#ifdef STATIC
    surface(pat, vW, nf, walls ? vW.y - vRY.x : vW.y, det, alb, h, gm, tint);
#else
    vec3 no = normalize(cross(dFdx(vO), dFdy(vO)));
    surface(pat, vO, no, vO.y, det, alb, h, gm, tint);
#endif
  }
  /* wear, on the level's walls and ceilings: grime at the foot of a wall; in places, water run down from the
     ceiling, fading as it goes: on bare cement the white salts it leached out (vLB.z), on paint and tile a brown
     tide mark; blotches overhead */
  if (on && vLB.y > 0.0 && walls && em == 0.0) {
    float k = vLB.y;
    if (abs(nf.y) < 0.5) {
      float g = (1.0 - smoothstep(0.0, 0.45, vW.y - vRY.x)) * (0.45 + 0.9 * n3(vW * 1.7));
      float along = abs(nf.x) > abs(nf.z) ? vW.z : vW.x;
      float run = smoothstep(0.58, 0.78, n3(vW * 0.21 + 5.0)) * smoothstep(0.45, 0.8, n3(vec3(along * 9.0, vW.y * 0.5, 1.7))) * exp(-(vRY.y - vW.y) / 1.4);
      alb *= 1.0 - 0.3 * k * g;
      vec3 left = vLB.z > 0.5 ? min(base * vec3(1.6, 1.6, 1.55) + 0.06, vec3(0.82, 0.81, 0.78)) : base * vec3(0.74, 0.66, 0.52);
      base = mix(base, left, 0.7 * k * run);
      gm *= 1.0 - 0.6 * g;
    } else if (nf.y < 0.0) alb *= 1.0 - 0.12 * k * smoothstep(0.6, 0.85, n3(vW * 0.5 + 2.0));
  }
  base *= alb * tint;
  vec3 nb = on && vLA.w > 0.0 && det > 0.0 ? bumped(nf, vW, h * vLA.w * det) : nf;
  float sh = 0.55 + 0.45 * (abs(nb.y) * 0.95 + abs(nb.x) * 0.7 + abs(nb.z) * 0.5);
  /* the carried lights' facing, from your hand; the room's light comes from above, so a bump facing up takes more of it */
  vec3 Lf = normalize(uFlashPos - vW);
  float facing = on ? 0.35 + 0.65 * max(dot(nb, Lf), 0.0) : 0.35 + 0.65 * abs(dot(n, Ld));
  float rel = clamp(1.0 + 1.1 * (nb.y - nf.y), 0.5, 1.5);
#if defined(STATIC)
  vec3 fl, lv = field(vW, nf, fl);
  vec3 light = (lv - fl * 0.55 * uFlick) * vL.x * sh * rel * selfShade(vW, nf);
#elif defined(BAKED)
  vec3 light = vL * sh;
#else
  vec3 light = (vL - uLightF * 0.55 * uFlick) * sh * rel;
#endif
  light += vec3(0.014) / (1.0 + 3.0 * d * d) + carried(vW, facing) + lying(vW, nf) + vec3(uBright);
  vec3 c = mix(base * light, base, em);
  /* the highlight, of the flashlight and the lantern you carry: tight and tinted on metal, broad and white on paint */
  if (on && vLA.x > 0.0 && em == 0.0) {
    float tight = vLA.y, norm = (tight + 8.0) / 32.0;
    float sb = pow(max(dot(nb, normalize(Lf + Ld)), 0.0), tight), sl = pow(max(dot(nb, Ld), 0.0), tight);
    vec3 tint = mix(vec3(1.0), base * 2.2, vLA.z);
    c += tint * vLA.x * gm * norm * (held(vW, 1.0) * sb + lantern(vW, 1.0) * sl);
  }
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

/** the noise the patterns are drawn from: 256 by 256, red random, green the red moved by (37, 17) (see n3). Made the
 *  same every time, so the station is too. */
function noiseTexture(): THREE.DataTexture {
  const N = 256, r = new Uint8Array(N * N), px = new Uint8Array(N * N * 4);
  let s = 0x2545f491;
  for (let i = 0; i < r.length; i++) { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; r[i] = (s >>> 0) & 255; }
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const k = (y * N + x) * 4;
      px[k] = r[y * N + x];
      px[k + 1] = r[((y + 17) % N) * N + ((x + 37) % N)];
      px[k + 3] = 255;
    }
  const t = new THREE.DataTexture(px, N, N, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

/** every material's look, by number: (gloss, tightness, metal, bump) and (pattern, wear, salt) */
const lookA = [new THREE.Vector4()], lookB = [new THREE.Vector4()];
for (const m of MAT_ORDER) {
  const L = MATS[m].look;
  lookA.push(new THREE.Vector4(L.gloss, L.tight, L.metal, L.bump));
  lookB.push(new THREE.Vector4(P(L.pattern), L.wear, L.salt, 0));
}

/** uniforms every material shares: the flashlight, the fog, time */
export const U = {
  uFlashDir: { value: new THREE.Vector3(0, 0, -1) },
  /** where the flashlight is held: a little below and right of the eye (camera.ts) */
  uFlashPos: { value: new THREE.Vector3() },
  /** 1 to draw what surfaces are made of, 0 for their flat colours (setDetail) */
  uDetail: { value: 1 },
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
  /** your body, as capsules (a and its radius, b), the fittings that throw its shadow (where, and 1 if lit, 0 for
   *  none), and the room it falls in (selfView.ts) */
  uSelfA: { value: Array.from({ length: SELF.caps }, () => new THREE.Vector4()) },
  uSelfB: { value: Array.from({ length: SELF.caps }, () => new THREE.Vector4()) },
  uFix: { value: Array.from({ length: SELF.fix }, () => new THREE.Vector4()) },
  uSelfLo: { value: new THREE.Vector3() },
  uSelfHi: { value: new THREE.Vector3() },
  /** the level's light field: its bricks' texels, the index of its bricks, where the index starts and how big it is (in
   *  bricks), the texels' width (lightVolume.ts) */
  uLA: { value: null as THREE.Texture | null },
  uLI: { value: null as THREE.Texture | null },
  uLO: { value: new THREE.Vector3() },
  uLN: { value: new THREE.Vector3() },
  uLW: { value: 2048 },
  uNoise: { value: noiseTexture() },
  uLookA: { value: lookA },
  uLookB: { value: lookB },
};

/** what a vertex is made of, and its room's floor and ceiling, where its geometry does not say: nothing, and no room */
const DEFAULTS = { aMat: [0], aRoomY: [0, 0] };
function material(o: THREE.ShaderMaterialParameters): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide, ...o });
  m.defaultAttributeValues = { ...m.defaultAttributeValues, ...DEFAULTS };
  return m;
}

/** the level's material: lit from the level's light field, each vertex saying how much of it it takes */
export function staticMaterial(): THREE.ShaderMaterial {
  return material({ uniforms: { ...U, uHit: { value: 0 } }, defines: { STATIC: '' } });
}

/** a see-through surface (water, a window), its light baked into each vertex */
export function glassMaterial(alpha: number): THREE.ShaderMaterial {
  return material({ uniforms: { ...U, uHit: { value: 0 } }, defines: { BAKED: '', ALPHA: alpha.toFixed(3) }, transparent: true, depthWrite: false });
}

/** a material for one moving thing: its light (and the part of it that flickers) is set from where it stands. With
 *  `alpha`, see-through, as a door's vision panel is */
export function dynamicMaterial(alpha?: number): THREE.ShaderMaterial {
  const uniforms = { ...U, uHit: { value: 0 }, uLight: { value: new THREE.Vector3() }, uLightF: { value: new THREE.Vector3() } };
  return alpha === undefined ? material({ uniforms }) : material({ uniforms, defines: { ALPHA: alpha.toFixed(3) }, transparent: true, depthWrite: false });
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

/** surface detail on or off: what surfaces are made of, their wear, the beam's highlight; the services under bare
 *  ceilings are shown or hidden with it by each level's view (LevelView.showDetail) */
export function setDetail(on: boolean): void {
  U.uDetail.value = on ? 1 : 0;
}
