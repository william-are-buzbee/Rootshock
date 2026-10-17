import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { testbed } from '../src/content/levels/testbed';
import { STEP } from '../src/core/loop';
import { hitMutant, killAll, MT, spawn, type Hit, type Mutant } from '../src/sim/cast';
import { give } from '../src/sim/game';
import { noInput, type Input } from '../src/sim/input';
import { bones, RAG, ragAt, SKEL } from '../src/sim/ragdoll';
import { load, save } from '../src/sim/save';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { ANIM, BUILD } from '../src/present/render/castView';
import { RIG } from '../src/present/render/rig';

/* Corpses that fall loose (engine.md §6, bodies with physics). */

const arena = (lv = testbed()): Sim => {
  const s = makeSim(lv, { seed: 3 }), b = s.player.body;
  b.x = 8; b.z = -3; b.y = 0; b.sync(); s.player.yaw = 0; s.game.god = true;
  return s;
};
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
/** one of the cast stood still at (x, y, z) facing yaw, a few steps to find its feet */
const stood = (s: Sim, type: string, x: number, y: number, z: number, yaw = Math.PI / 2): Mutant => {
  const m = spawn(s, type, x, y, z)!;
  m.stun = 1e9; m.yaw = yaw;
  for (let i = 0; i < 5; i++) step(s, noInput());
  return m;
};
/* the killing blows as yours land (combat.ts, landOn): the axe's chop, coming down; the baton's swing, across. Shove by
   the weapon (70 kg m/s a kilogram and the arm's 1.5), as hard as a blow run into */
const AXE = (dir: { x: number; z: number }): Hit => ({ dmg: 999, poise: 29, shove: 70 * 4.7, dir, by: 'axe', way: { x: dir.x * 0.3, y: -1, z: dir.z * 0.3 } });
const BATON = (dir: { x: number; z: number }): Hit => ({ dmg: 999, poise: 13, shove: 70 * 2.6, dir, by: 'baton', way: { x: -dir.z, y: 0, z: dir.x } });
/** strike it from the side `dir` comes from, at chest height */
const strike = (s: Sim, m: Mutant, w: Hit, k = 1.3) => hitMutant(s, m, { ...w, at: { x: m.x - w.dir!.x * 0.4, y: m.y + (m.body?.h ?? 1) * 0.75, z: m.z - w.dir!.z * 0.4 } }, k);
const pt = (m: Mutant, name: string) => { const i = bones(m.model).at[name] * 3; return { x: m.rag!.p[i], y: m.rag!.p[i + 1], z: m.rag!.p[i + 2] }; };

describe('the skeletons', () => {
  it('weigh what their bodies weigh', () => {
    for (const k of Object.keys(SKEL)) expect(bones(k).mass, k).toBeCloseTo(MT[k].kg, 6);
  });

  it('have their joints where the models do, standing idle', () => {
    const mat = new THREE.MeshBasicMaterial(), v = new THREE.Vector3();
    for (const kind of Object.keys(RIG)) {
      const s = arena(), m = stood(s, kind, 8, 0, -8), M = BUILD[kind](mat, m), B = bones(kind);
      /* as built; the hand is built with its limbs straight out, and stands as it goes about */
      const idle = { ...m, state: 'idle', mv: 0, blow: null, ph: 0 } as Mutant;
      if (kind === 'hand') for (let k = 0; k < 300; k++) ANIM.hand(idle, M, { sim: s, dt: 1 / 60, L: { atPoint: () => [0.3, 0.3, 0.3] } as never });
      M.g.updateMatrixWorld(true);
      for (const P of RIG[kind].parts) {
        if (!P.bone) continue;
        /* a limb turns about its first point (or the one it names): that is where the model's joint is */
        const o = [P.o ?? P.bone[0]].flat(), at = (k: number) => o.reduce((a, n) => a + B.rest[B.at[n] * 3 + k], 0) / o.length;
        P.at(M).getWorldPosition(v);
        expect(Math.hypot(v.x - at(0), v.y - at(1), v.z - at(2)), `${kind} ${o}`).toBeLessThan(0.065);
      }
    }
  });
});

describe('a body killed goes loose', () => {
  it('only what has a body and moves: a bloat and what grows on a wall fold where they are', () => {
    const s = arena();
    for (const t of ['husk', 'skitter', 'thresher', 'worm', 'hand', 'bloat', 'grabber']) spawn(s, t, 8, 0, -8);
    killAll(s);
    expect(s.cast.map(m => !!m.rag)).toEqual([true, true, true, true, true, false, false]);
  });

  it('carries the killing blow: it goes the way it was struck, and lies where it fell', () => {
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, -1]]) {
      const s = arena(), m = stood(s, 'husk', 8, 0, -9), x0 = m.x, z0 = m.z;
      strike(s, m, AXE({ x: dx, z: dz }));
      hold(s, 3);
      const a = ragAt(m.rag!), along = (a.x - x0) * dx + (a.z - z0) * dz, across = Math.abs((a.x - x0) * dz - (a.z - z0) * dx);
      expect(along, `${dx},${dz}`).toBeGreaterThan(0.6);
      expect(across).toBeLessThan(along);
      /* on the floor: nothing of it higher than a body lying down */
      for (let i = 0; i < bones('husk').names.length; i++) expect(m.rag!.p[i * 3 + 1]).toBeLessThan(0.45);
    }
  });

  it('an axe kill is not a baton kill: the chop throws it further and straight, the swing spins it as it goes', () => {
    const fall = (w: Hit) => {
      const s = arena(), m = stood(s, 'husk', 8, 0, -9, 0), x0 = m.x;
      const facing = () => { const a = pt(m, 'hipL'), b = pt(m, 'hipR'); return Math.atan2(b.z - a.z, b.x - a.x); };
      strike(s, m, w);
      const y0 = facing();
      hold(s, 3);
      const turn = facing() - y0;
      return { far: ragAt(m.rag!).x - x0, turn: Math.abs(Math.atan2(Math.sin(turn), Math.cos(turn))) };
    };
    const axe = fall(AXE({ x: 1, z: 0 })), baton = fall(BATON({ x: 1, z: 0 }));
    expect(axe.far).toBeGreaterThan(baton.far + 0.3);
    expect(baton.turn).toBeGreaterThan(axe.turn + 0.3);
  });

  it('killed harder (run in: the closing multiplier), it goes further', () => {
    const far = (k: number) => {
      const s = arena(), m = stood(s, 'husk', 8, 0, -9), x0 = m.x;
      strike(s, m, AXE({ x: 1, z: 0 }), k);
      hold(s, 3);
      return ragAt(m.rag!).x - x0;
    };
    expect(far(1.8)).toBeGreaterThan(far(1) + 0.3);
  });

  it('killed with no blow (a fall, the dev key), it crumples where it stood', () => {
    const s = arena(), m = stood(s, 'husk', 8, 0, -9);
    killAll(s);
    hold(s, 3);
    const a = ragAt(m.rag!);
    expect(Math.hypot(a.x - 8, a.z + 9)).toBeLessThan(1.2);
    expect(pt(m, 'head').y).toBeLessThan(0.45);
  });

  it('killed near a wall and struck into it, it slumps against it rather than lying flat', () => {
    /* the arena's west wall, x = -2, clear of the low bay: the axe's chop from most of a metre out, the baton's swing
       (which carries it less far, and turns it along the wall) from half a metre */
    for (const [w, d] of [[AXE({ x: -1, z: 0 }), 0.8], [BATON({ x: -1, z: 0 }), 0.5]] as const) {
      const s = arena(), m = stood(s, 'husk', -2 + d, 0, -16.5);
      strike(s, m, w, 1.2);
      hold(s, 4);
      const h = pt(m, 'head');
      expect(h.y, w.by).toBeGreaterThan(0.6);
      expect(h.x).toBeLessThan(-1.6);
    }
  });

  it('killed on the ledge and struck off it, it goes over and lies on the floor 3 m below', () => {
    const s = arena(), m = stood(s, 'husk', 12.5, 3, -14.5);
    strike(s, m, BATON({ x: -1, z: 0 }), 1);
    hold(s, 4);
    expect(m.y).toBeLessThan(0.2);
    expect(m.x).toBeLessThan(12);
  });

  it('every kind settles and goes to sleep within a few seconds, and then lies still', () => {
    for (const t of ['husk', 'skitter', 'thresher', 'worm', 'hand']) {
      const s = arena(), m = stood(s, t, 8, 0, -9);
      strike(s, m, AXE({ x: 1, z: 0 }));
      hold(s, 3);
      expect(m.rag!.awake, t).toBe(false);
      const p = m.rag!.p.slice();
      hold(s, 1);
      expect(m.rag!.p).toEqual(p);
    }
  });

  it('holds together: no bone stretched or squashed by more than a few centimetres once it lies still', () => {
    for (const t of ['husk', 'skitter', 'thresher', 'worm', 'hand']) {
      const s = arena(), m = stood(s, t, 8, 0, -9), B = bones(t);
      strike(s, m, BATON({ x: 1, z: 0 }));
      hold(s, 3);
      const R = m.rag!;
      let worst = 0;
      for (let k = 0; k < B.sticks.length; k += 3) {
        const a = B.sticks[k] * 3, b = B.sticks[k + 1] * 3, d = Math.hypot(R.p[a] - R.p[b], R.p[a + 1] - R.p[b + 1], R.p[a + 2] - R.p[b + 2]);
        worst = Math.max(worst, Math.abs(d - B.sticks[k + 2]));
      }
      console.log(`${t}: bones off their length by ${(worst * 1000).toFixed(0)} mm at most`);
      expect(worst, t).toBeLessThan(0.03);
    }
  });

  it('is the same fall twice: a corpse is plain numbers, with no chance in it', () => {
    const run = () => {
      const s = arena(), a = stood(s, 'husk', 8, 0, -9), b = stood(s, 'thresher', 6, 0, -10);
      strike(s, a, AXE({ x: 1, z: 0.3 }), 1.4);
      strike(s, b, BATON({ x: -0.5, z: -1 }), 1.1);
      hold(s, 2);
      return [a.rag!.p, b.rag!.p, a.x, b.z];
    };
    expect(run()).toEqual(run());
  });

  it('is heard landing', () => {
    const s = arena(), m = stood(s, 'husk', 8, 0, -9);
    strike(s, m, AXE({ x: 1, z: 0 }));
    let thuds = 0;
    for (let t = 0; t < 2; t += STEP) {
      s.game.events.length = 0;
      step(s, noInput());
      thuds += s.game.events.filter(e => e.type === 'sfx' && e.name === 'thud').length;
    }
    expect(thuds).toBeGreaterThan(0);
    expect(thuds).toBeLessThan(8);
  });
});

describe('corpses stay in the world', () => {
  /** a husk killed and left to settle, lying north of you */
  const lying = (s: Sim, x = 8, z = -6) => {
    const m = stood(s, 'husk', x, 0, z);
    killAll(s);
    hold(s, 3);
    expect(m.rag!.awake).toBe(false);
    return m;
  };

  it('a blow through one knocks it the way it went, and goes on: the pipe\'s swing shoves it along, the axe\'s chop pins it', () => {
    for (const [id, least] of [['axe', 0.03], ['pipe', 0.15]] as const) {
      const s = arena(), m = lying(s), a0 = ragAt(m.rag!);
      const b = s.player.body; b.x = a0.x; b.z = a0.z + 1.2; b.sync(); s.player.yaw = 0; s.player.pitch = -0.7;
      give(s.game, id); s.game.weapon = id;
      hold(s, STEP, { attack: true });
      hold(s, 2.5); // the arm comes up (the axe 1.1 s), and the blow comes down
      const a = ragAt(m.rag!);
      console.log(`${id} knocks a husk lying 1.2 m off ${(a0.z - a.z).toFixed(2)} m`);
      expect(a0.z - a.z, id).toBeGreaterThan(least); // north, the way you faced
      expect(s.hands.swing?.struck ?? null).toBe(null); // not stopped in it
    }
  });

  it('a shot knocks one too', () => {
    const s = arena(), m = lying(s), a0 = ragAt(m.rag!);
    const b = s.player.body; b.x = a0.x; b.z = a0.z + 3; b.sync(); s.player.yaw = 0; s.player.pitch = -0.45;
    give(s.game, 'shotgun'); give(s.game, 'shells'); s.game.weapon = 'shotgun';
    hold(s, 2 * STEP, { attack: true });
    expect(m.rag!.awake).toBe(true);
    hold(s, 1);
    expect(a0.z - ragAt(m.rag!).z).toBeGreaterThan(0.1);
  });

  it('walked into, it is shoved aside by what you weigh, and you are not stopped', () => {
    const s = arena(), m = lying(s), a0 = ragAt(m.rag!), b = s.player.body;
    b.x = a0.x; b.z = a0.z + 2; b.sync(); s.player.yaw = 0;
    hold(s, 1.5, { forward: 1 });
    expect(b.z).toBeLessThan(a0.z - 0.5); // you went on past it
    const a = ragAt(m.rag!);
    expect(Math.hypot(a.x - a0.x, a.z - a0.z)).toBeGreaterThan(0.1);
    hold(s, 3);
    expect(m.rag!.awake).toBe(false); // and it settles again
  });

  it('one of the cast walking through one shoves it too', () => {
    const s = arena(), m = lying(s), a0 = ragAt(m.rag!), b = s.player.body;
    b.x = a0.x; b.z = a0.z - 5; b.sync(); s.player.yaw = Math.PI;
    const h = spawn(s, 'husk', a0.x, 0, a0.z + 3)!;
    s.game.god = true;
    hold(s, 3);
    expect(h.z).toBeLessThan(a0.z);
    const a = ragAt(m.rag!);
    expect(Math.hypot(a.x - a0.x, a.z - a0.z)).toBeGreaterThan(0.1);
  });

  it('one falls on another: they lie one on the other, not through it', () => {
    const s = arena(), under = lying(s), a0 = ragAt(under.rag!);
    const top = stood(s, 'husk', a0.x, 0, a0.z + 0.9, Math.PI);
    strike(s, top, AXE({ x: 0, z: -1 }), 1);
    hold(s, 4);
    const A = bones('husk');
    let worst = 0;
    for (let i = 0; i < A.names.length; i++) for (let j = 0; j < A.names.length; j++) {
      const p = top.rag!.p, q = under.rag!.p;
      worst = Math.max(worst, A.r[i] + A.r[j] - Math.hypot(p[i * 3] - q[j * 3], p[i * 3 + 1] - q[j * 3 + 1], p[i * 3 + 2] - q[j * 3 + 2]));
    }
    expect(worst).toBeLessThan(0.06);
    expect(Math.max(...bones('husk').names.map((_, i) => top.rag!.p[i * 3 + 1]))).toBeGreaterThan(0.22); // on it, not beside it
    expect(top.rag!.awake || under.rag!.awake).toBe(false);
  });

  it('a platform carries one that lies on it, and a door coming down puts one out of its way', () => {
    /* the lab's lift: 8..10 by 30..32, from 0.2 up to 3 */
    const s = arena(), m = stood(s, 'husk', 9, 0.2, 31, 0);
    killAll(s);
    hold(s, 3);
    const p = s.platforms[0];
    p.target = 1; p.moving = true;
    hold(s, 3);
    expect(p.y).toBe(3);
    expect(m.y).toBeGreaterThan(2.9);
    /* the door in the passage south of the hall, 7..9 by 13.75..14, open with a body lying across its sill */
    const t = arena(), d = t.doors[0], q = stood(t, 'husk', 8, 0, 14.6, Math.PI);
    d.open = true; d.t = 1;
    strike(t, q, BATON({ x: 0, z: -1 }), 1);
    hold(t, 2);
    expect(Math.min(...bones('husk').names.map((_, i) => Math.abs(q.rag!.p[i * 3 + 2] - 13.875)))).toBeLessThan(0.3); // across the sill
    d.open = false; d.hold = 0;
    hold(t, 2);
    expect(d.t).toBe(0);
    const B = bones('husk');
    for (let i = 0; i < B.names.length; i++) {
      const x = q.rag!.p[i * 3], z = q.rag!.p[i * 3 + 2];
      /* a point meets the world as a box 0.6 of its radius about it (sim/ragdoll.ts, collide) */
      expect(x > 7 && x < 9 && z > 13.75 - B.r[i] * 0.6 && z < 14 + B.r[i] * 0.6, B.names[i]).toBe(false);
    }
  });

  it('is saved: a run saved with a body falling plays on as it would have', () => {
    /* a husk the level places (a save knows the level's cast, not those the arena puts down) */
    const level = () => { const lv = testbed(); lv.mutants.push({ type: 'husk', x: 8, y: 0, z: -8, opts: {} }); return lv; };
    const run = (saveAt: number | null) => {
      let s = arena(level());
      const m = s.cast[0];
      m.stun = 1e9;
      hold(s, 0.1);
      strike(s, m, AXE({ x: 0.6, z: -0.8 }), 1.4);
      for (let k = 0; k < 90; k++) {
        if (k === saveAt) s = load(level(), JSON.parse(JSON.stringify(save(s))));
        step(s, noInput());
      }
      return s.cast[0].rag!.p;
    };
    expect(run(20)).toEqual(run(null));
  });

  it('a save from before corpses were kept loads its dead laid where they lay', () => {
    const level = () => { const lv = testbed(); lv.mutants.push({ type: 'husk', x: 8, y: 0, z: -6, opts: {} }); return lv; };
    const s = arena(level()), m = s.cast[0];
    killAll(s);
    hold(s, 3);
    const data = JSON.parse(JSON.stringify(save(s)));
    delete data.cast[0].rag;
    const t = load(level(), data);
    expect(t.cast[0].rag?.awake).toBe(false);
    expect(Math.hypot(ragAt(t.cast[0].rag!).x - m.x, ragAt(t.cast[0].rag!).z - m.z)).toBeLessThan(1.2);
  });

  it('the dev key clears the dead once none are left alive', () => {
    const s = arena();
    lying(s);
    killAll(s);
    expect(s.cast[0].away).toBe(true);
    expect(s.cast[0].rag).toBe(null);
  });
});

it('costs little: sixteen falling at once, and asleep, timed against the arena with nothing in it; forty, walked through', () => {
  /* a step of the whole sim, on average over `secs`, in ms */
  const timed = (s: Sim, secs: number, inp: Partial<Input> = {}) => {
    let all = 0, n = 0;
    for (let t = 0; t < secs; t += STEP) { const t0 = performance.now(); step(s, { ...noInput(), ...inp }); all += performance.now() - t0; n++; }
    return all / n;
  };
  const empty = arena();
  spawn(empty, 'worm', 30, 0, 30); // the level's ways made, as the others have them
  killAll(empty);
  timed(empty, 0.5);
  const base = timed(empty, 1);
  const s = arena(), cast: Mutant[] = [];
  for (let k = 0; k < RAG.budget; k++) cast.push(stood(s, ['husk', 'thresher', 'skitter', 'worm'][k % 4], -0.5 + (k % 4) * 3.5, 0, -6 - Math.floor(k / 4) * 3));
  for (const m of cast) strike(s, m, AXE({ x: 1, z: 0 }));
  const falling = timed(s, 0.5), settling = timed(s, 0.5);
  hold(s, 8);
  const asleep = timed(s, 1);
  expect(cast.every(m => !m.rag!.awake)).toBe(true);
  /* forty husks, killed together in a heap 5 m across, then walked through */
  const t = arena(), heap: Mutant[] = [];
  for (let k = 0; k < 40; k++) heap.push(stood(t, 'husk', 5.5 + (k % 8) * 0.7, 0, -12 + Math.floor(k / 8) * 0.9));
  for (const m of heap) strike(t, m, AXE({ x: 0.3, z: 1 }), 1);
  const forty = timed(t, 0.5), most = Math.max(...Array.from({ length: 1 }, () => heap.filter(m => m.rag!.awake).length));
  hold(t, 2);
  const capped = heap.filter(m => m.rag!.awake).length;
  hold(t, 8);
  const b = t.player.body;
  b.x = 8; b.z = -14; b.sync(); t.player.yaw = Math.PI;
  const walking = timed(t, 2, { forward: 1 });
  console.log(`a step: the arena alone ${base.toFixed(3)} ms; 16 corpses falling ${falling.toFixed(3)} ms (${((falling - base) / 16 * 1000).toFixed(0)} µs a corpse), ` +
    `settling ${settling.toFixed(3)} ms, all asleep ${asleep.toFixed(3)} ms; 40 falling in a heap ${forty.toFixed(3)} ms (${most} awake), ` +
    `${capped} awake 2 s on; walking through the heap ${walking.toFixed(3)} ms`);
  expect(falling - base).toBeLessThan(4);
  expect(asleep - base).toBeLessThan(0.3);
  expect(capped).toBeLessThanOrEqual(RAG.budget);
  expect(walking).toBeLessThan(4);
});
