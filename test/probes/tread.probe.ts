import { it } from 'vitest';
import { testbed } from '../../src/content/levels/testbed';
import { STEP } from '../../src/core/loop';
import { killAll, spawn, type Mutant } from '../../src/sim/cast';
import { noInput } from '../../src/sim/input';
import { bones, RAG } from '../../src/sim/ragdoll';
import { makeSim, step, type Sim } from '../../src/sim/sim';
import { begin, say, set } from './out';

/* What walking into a body on the floor does to it: each kind killed with no blow and left to sleep in the arena, then
   walked and run through by you, along it and across it, through its middle; and walked through by a husk. How far its
   middle went (by weight), how far its trunk went, how far the furthest point of it went, and how long it was awake.
   SET=... to try constants (out.ts). */

const lying = (kind: string): { s: Sim; m: Mutant } => {
  const s = makeSim(testbed(), { seed: 3 }), b = s.player.body;
  b.x = 8; b.z = 3; b.y = 0; b.sync(); s.game.god = true;
  const m = spawn(s, kind, 8, 0, -6)!;
  m.stun = 1e9;
  for (let i = 0; i < 5; i++) step(s, noInput());
  killAll(s);
  for (let t = 0; t < 4; t += STEP) step(s, noInput());
  return { s, m };
};

/** its middle by weight; the middle of its trunk (its `mid` points) */
const mid = (m: Mutant) => {
  const B = bones(m.model), p = m.rag!.p;
  let x = 0, z = 0;
  for (let i = 0; i < B.names.length; i++) { const w = B.kg[i] / B.mass; x += p[i * 3] * w; z += p[i * 3 + 2] * w; }
  return { x, z };
};
const trunk = (m: Mutant) => {
  const B = bones(m.model), p = m.rag!.p;
  let x = 0, z = 0;
  for (const i of B.mid) { x += p[i * 3]; z += p[i * 3 + 2]; }
  return { x: x / B.mid.length, z: z / B.mid.length };
};
/** the way it lies on the plan: its head from its middle, or its first point from its last */
const lengthwise = (m: Mutant) => {
  const B = bones(m.model), p = m.rag!.p, c = trunk(m), far = B.at.head ?? 0;
  const dx = p[far * 3] - c.x, dz = p[far * 3 + 2] - c.z, d = Math.hypot(dx, dz) || 1;
  return { x: dx / d, z: dz / d };
};

it('tread', () => {
  set({ RAG });
  begin('tread', process.env.SET ? ` (${process.env.SET})` : '');
  for (const kind of (process.env.KINDS ?? 'husk,thresher,skitter,worm').split(',')) {
    for (const [how, run] of [['walk', false], ['run', true]] as const) for (const line of ['across', 'along'] as const) {
      const { s, m } = lying(kind), b = s.player.body, c0 = mid(m), t0 = trunk(m), p0 = [...m.rag!.p], u = lengthwise(m);
      /* the way you go: square to it, or from its feet to its head */
      const g = line === 'along' ? u : { x: -u.z, z: u.x };
      b.x = t0.x - g.x * 2.5; b.z = t0.z - g.z * 2.5; b.vx = b.vz = 0; b.sync();
      s.player.yaw = Math.atan2(-g.x, -g.z);
      let awake = 0;
      for (let t = 0; t < 1.6; t += STEP) { step(s, { ...noInput(), forward: 1, run }); if (m.rag!.awake) awake += STEP; }
      for (let t = 0; t < 6; t += STEP) { step(s, noInput()); if (m.rag!.awake) awake += STEP; }
      const c = mid(m), tr = trunk(m), B = bones(m.model);
      let most = 0;
      for (let i = 0; i < B.names.length; i++) most = Math.max(most, Math.hypot(m.rag!.p[i * 3] - p0[i * 3], m.rag!.p[i * 3 + 2] - p0[i * 3 + 2]));
      const along = (c.x - c0.x) * g.x + (c.z - c0.z) * g.z;
      say(`${kind.padEnd(8)} ${how.padEnd(4)} ${line.padEnd(6)}: middle ${Math.hypot(c.x - c0.x, c.z - c0.z).toFixed(2)} m (${along.toFixed(2)} your way), trunk ${Math.hypot(tr.x - t0.x, tr.z - t0.z).toFixed(2)}, furthest point ${most.toFixed(2)}, awake ${awake.toFixed(1)} s; you got ${Math.hypot(b.x - t0.x, b.z - t0.z).toFixed(1)} m past`);
    }
    /* a husk walking through it, toward you */
    const { s, m } = lying(kind), t0 = trunk(m), c0 = mid(m), b = s.player.body;
    b.x = t0.x; b.z = t0.z - 6; b.sync();
    spawn(s, 'husk', t0.x, 0, t0.z + 3);
    for (let t = 0; t < 3; t += STEP) step(s, noInput());
    const c = mid(m);
    say(`${kind.padEnd(8)} a husk walking through it: middle ${Math.hypot(c.x - c0.x, c.z - c0.z).toFixed(2)} m`);
    /* you, put down standing in it, and staying there: how far into you it still lies, and whether it sleeps */
    const q = lying(kind), Q = bones(kind), y = q.s.player.body, tq = trunk(q.m), cq = mid(q.m);
    y.x = tq.x; y.z = tq.z; y.sync();
    let woke = 0, was = false;
    for (let t = 0; t < 5; t += STEP) { step(q.s, noInput()); if (q.m.rag!.awake && !was) woke++; was = q.m.rag!.awake; }
    let into = 0;
    for (let i = 0; i < Q.names.length; i++) into = Math.max(into, y.r + Q.r[i] - Math.hypot(q.m.rag!.p[i * 3] - y.x, q.m.rag!.p[i * 3 + 2] - y.z));
    const cm = mid(q.m);
    say(`${kind.padEnd(8)} stood in, 5 s: still ${Math.max(0, into).toFixed(2)} m into you, middle moved ${Math.hypot(cm.x - cq.x, cm.z - cq.z).toFixed(2)} m, woken ${woke} times, ${q.m.rag!.awake ? 'awake' : 'asleep'}`);
  }
});
