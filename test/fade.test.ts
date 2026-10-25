import * as THREE from 'three';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { testbed } from '../src/content/levels/testbed';
import { blowAt, hitMutant, spawn, type Mutant } from '../src/sim/cast';
import { noInput } from '../src/sim/input';
import { makeSim, simLighting, step, type Sim } from '../src/sim/sim';
import { CastView } from '../src/present/render/castView';

/* The living, drawn without a jump (render/fade.ts): where what an animation switches on changes, the model is taken
   over to the new pose, not put there in a frame; between switches it is drawn as its animation has it. */

type Shown = { m: Mutant; M: { g: THREE.Group; arms: THREE.Object3D[] } };

/** one of the cast put down in the arena after you, and drawn a frame a step, halfway through it: you stepping from
 *  one end to the other every two seconds (so it walks, stops, swings), and struck every second and a half (so it
 *  flinches, reels, has its swing cut short). `each` is shown it after every frame */
function fight(kind: string, secs: number, each: (s: Sim, m: Mutant, S: Shown) => void): void {
  /* none of the living's twitches (castView.ts, ANIM): those are meant to be sudden */
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  let now = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  onTestFinished(() => { vi.restoreAllMocks(); });
  const s = makeSim(testbed(), { seed: 3 }), b = s.player.body;
  s.game.god = true;
  const at = (z: number) => { b.x = 8; b.z = z; b.y = 0; b.sync(); s.player.yaw = 0; };
  at(-3);
  const m = spawn(s, kind, 8, 0, -9)!, cv = new CastView(new THREE.Group(), s, simLighting(s));
  const S = (cv as unknown as { shown: Shown[] }).shown.find(x => x.m === m)!;
  const eye = new THREE.PerspectiveCamera(72, 16 / 9, 0.06, 140);
  for (let k = 0; k < secs * 60; k++) {
    if (k % 120 === 0) at(k % 240 ? -3 : -15);
    if (k % 90 === 45 && m.down === 0) hitMutant(s, m, { dmg: 1, poise: 8 + (k % 4) * 4, shove: 60, dir: { x: 0, z: -1 }, at: { x: m.x, y: m.y + 1, z: m.z + 0.3 } }, 1);
    step(s, noInput());
    now += 1000 / 60;
    eye.position.set(b.x, b.y + 1.6, b.z); eye.lookAt(m.x, m.y + 0.5, m.z);
    cv.update(0.5, eye);
    each(s, m, S);
  }
}

describe('the living, drawn', () => {
  it('do not jump where their animations switch: walking, stopping, a swing begun or cut short, thrown back on its heels', () => {
    /* the most a part may move in a frame, in the model's own frame (walking across the floor not counted): a husk's
       arm swung down, or given back after its pose jumped, comes to 0.3 m; a thresher's arms flail half a metre a
       frame winding up, as they always have. Each jumped up to 2 m in a frame before (its arm thrown from overhead to
       its side, the step of a walk begun at a pace not the one it stood at) */
    for (const [kind, most] of [['husk', 0.45], ['thresher', 0.65]] as const) {
      const v = new THREE.Vector3(), seen = new Set<string>();
      let was: THREE.Vector3[] | null = null, tilt = 0, worst = 0, rocked = 0;
      fight(kind, 12, (_s, m, S) => {
        const g = S.M.g, p: THREE.Vector3[] = [];
        g.traverse(o => { if ((o as THREE.Mesh).isMesh) p.push(g.worldToLocal(o.getWorldPosition(v.set(0, 0, 0))).clone()); });
        if (was && !m.rag) { worst = Math.max(worst, ...p.map((q, i) => q.distanceTo(was![i]))); rocked = Math.max(rocked, Math.abs(g.rotation.x - tilt)); }
        was = p; tilt = g.rotation.x;
        seen.add(m.mv > 0 ? 'walking' : 'stood').add(blowAt(m)?.ph ?? 'no blow');
        if (m.reel > 0) seen.add('reeling');
      });
      for (const what of ['walking', 'stood', ...(kind === 'husk' ? ['wind', 'strike', 'reeling'] : [])]) expect(seen.has(what), `${kind}: ${what}`).toBe(true);
      expect(worst, kind).toBeLessThan(most);
      /* struck, rocked back on its heels over a few frames, not in one (it was 0.23 rad in a frame) */
      expect(rocked, kind).toBeLessThan(0.1);
    }
  });

  it('as its animation has it, less only what it jumped by: a husk\'s swing comes down when the sim has it come down', () => {
    let n = 0, worst = 0;
    fight('husk', 6, (_s, m, S) => {
      const B = blowAt(m);
      if (B?.ph !== 'strike' || m.reel > 0) return;
      /* castView.ts, ANIM.husk: the arm from overhead (-2.75) to low (-0.15) in a ninth of a second, faster as it goes.
         Its lunge sets it walking as it swings, a switch, and the arm is not held back for it: it was coming down
         either way. All it may be off by is the shake at the top of the wind-up (0.05 at most), given back */
      worst = Math.max(worst, Math.abs(S.M.arms[1].rotation.x - (-2.75 + 2.6 * B.q * B.q)));
      n++;
    });
    expect(n).toBeGreaterThan(3);
    expect(worst).toBeLessThan(0.05);
  });
});
