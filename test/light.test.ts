import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim } from '../src/sim/sim';
import { Lighting, fullPower } from '../src/world/light';
import { Cascade } from '../src/present/cascade';

/* Light on the upper station. Power coming on, room by room (present/cascade.ts): it starts where you are, reaches the
   far end last, ends exactly as the new power lights it, and going dark is not staged. Light in pools under the ceiling
   fittings, reaching past a room through its openings and no further (world/light.ts, world/lightField.ts): what you see
   and what the cast see you by. */

const sim = makeSim(buildUpper(STATION.ladders), { seed: 3, station: STATION });
const w = sim.world, dark = new Lighting(w, () => 0), lit = new Lighting(w, fullPower);
const named = (n: string) => w.rooms.find(R => R.name === n)!.id;
const lum = (L: Lighting, x: number, y: number, z: number) => Math.max(...L.atPoint(x, y, z));
const mid = (r: number, up = 1): [number, number, number] => { const R = w.rooms[r]; return [(R.x0 + R.x1) / 2, R.y0 + up, (R.z0 + R.z1) / 2]; };

describe('the power coming on', () => {
  it('lights the room you are in first and the far end last, then holds exactly as the new power has it', () => {
    const here = named('Operations corridor'), far = named('Cargo office'), struck: number[] = [];
    const C = new Cascade(w, dark, lit, here, r => struck.push(r));
    expect(C.L.room(here)).toEqual(dark.room(here)); // nothing yet
    expect(lum(C.L, ...mid(here))).toBe(0);
    const first = new Map<number, number>();
    for (let t = 0; t < 5 && !C.done; t += 1 / 60) for (const r of C.update(1 / 60)) if (!first.has(r)) first.set(r, t);
    expect(C.done).toBe(true);
    expect(first.get(here)!).toBeLessThan(first.get(far)!);
    expect(struck[0]).toBe(here);
    for (const R of w.rooms) {
      expect(C.L.room(R.id)).toEqual(lit.room(R.id));
      const a = C.L.atPoint(...mid(R.id)), b = lit.atPoint(...mid(R.id));
      for (let k = 0; k < 3; k++) expect(a[k]).toBeCloseTo(b[k], 4);
    }
  });

  it('a tube strikes: it comes on, goes off a moment, and comes on again', () => {
    const here = named('Operations corridor'), C = new Cascade(w, dark, lit, here, () => {});
    const seen: number[] = [C.L.on[here]]; // as it stands before the first frame
    for (let t = 0; t < 5 && !C.done; t += 1 / 120) { C.update(1 / 120); if (seen[seen.length - 1] !== C.L.on[here]) seen.push(C.L.on[here]); }
    expect(seen.slice(0, 4)).toEqual([0, 1, 0, 1]);
  });

  it('power going off goes at once', () => {
    const C = new Cascade(w, lit, dark, named('Operations corridor'), () => {});
    for (const R of w.rooms) { expect(C.L.room(R.id)).toEqual(dark.room(R.id)); expect(lum(C.L, ...mid(R.id))).toBe(lum(dark, ...mid(R.id))); }
    C.update(0.001);
    expect(C.done).toBe(true);
  });
});

describe('light in pools', () => {
  const corridor = named('Security corridor'), R = w.rooms[corridor];
  const fx = lit.fixtures.get(corridor)!;

  it('a fitted room has its fittings, and a cave or a walkway has none', () => {
    expect(fx.length).toBeGreaterThan(2);
    expect(lit.fixtures.has(named('Cargo cavern'))).toBe(false);
  });

  it('the floor under a fitting is lit above the room, between two below it, and the ceiling darkest', () => {
    const f = fx[1], room = Math.max(...lit.room(corridor));
    const under = lum(lit, f.x, R.y0 + 0.1, f.z), between = lum(lit, (fx[0].x + fx[1].x) / 2, R.y0 + 0.1, (fx[0].z + fx[1].z) / 2);
    const ceiling = lum(lit, f.x + 1.5, R.y0 + R.ht - 0.1, f.z);
    expect(under).toBeGreaterThan(room);
    expect(between).toBeLessThan(under);
    expect(ceiling).toBeLessThan(between);
  });

  it('what the cast see you by follows the pools: you are harder to see between the lights than under one', () => {
    const f = fx[1], a = lit.atPoint(f.x, R.y0 + 0.5, f.z), b = lit.atPoint((fx[0].x + fx[1].x) / 2, R.y0 + 0.5, R.z0 + 0.3);
    expect(Math.max(...b)).toBeLessThan(Math.max(...a));
  });
});

describe('light past a room', () => {
  /* a lit room with a doorway into one left dark: Ops lit, its wing's corridor dead behind its cut */
  const only = (ids: number[], open: (d: number) => number = () => 1) =>
    new Lighting(w, c => (ids.includes(w.rooms.findIndex(R => R.circuit === c && ids.includes(R.id))) ? 2 : 0), () => false, open);
  const pairs = () => {
    const out: [number, number, number][] = [];
    for (const D of w.rooms) {
      if (!D.doorway) continue;
      const near = w.neighbours(D.id).filter(n => !w.rooms[n].doorway);
      if (near.length === 2 && w.rooms[near[0]].circuit !== w.rooms[near[1]].circuit) out.push([near[0], D.id, near[1]]);
    }
    return out;
  };

  it('reaches through a doorway into a dark room, falling off with distance, and not through its walls', () => {
    const [A, D, B] = pairs().find(([a, , b]) => w.rooms[a].lit === 'main' && w.rooms[b].lit !== 'always')!;
    const L = only([A]), Dr = w.rooms[D], Br = w.rooms[B];
    expect(Math.max(...L.room(B))).toBe(0); // the room itself is dark
    /* the doorway takes some of A's light, and B, just past it, less */
    const door = mid(D, 1), dl = lum(L, ...door);
    expect(dl).toBeGreaterThan(0.02);
    /* one step past the doorway into B, and farther along the way it faces */
    const cx = (Dr.x0 + Dr.x1) / 2, cz = (Dr.z0 + Dr.z1) / 2, dx = Math.sign(((Br.x0 + Br.x1) / 2 - cx) * (Dr.z1 - Dr.z0 < Dr.x1 - Dr.x0 ? 0 : 1)), dz = dx ? 0 : Math.sign((Br.z0 + Br.z1) / 2 - cz);
    const ex = dx > 0 ? Dr.x1 : dx < 0 ? Dr.x0 : cx, ez = dz > 0 ? Dr.z1 : dz < 0 ? Dr.z0 : cz;
    const near = lum(L, ex + dx * 0.6, Dr.y0 + 1, ez + dz * 0.6), farther = lum(L, ex + dx * 3, Dr.y0 + 1, ez + dz * 3);
    expect(near).toBeGreaterThan(0);
    expect(near).toBeLessThan(dl + 1e-6);
    expect(farther).toBeLessThan(near);
    /* and less still in B's far corner, round from the doorway */
    const corners = [[Br.x0 + 0.3, Br.z0 + 0.3], [Br.x1 - 0.3, Br.z0 + 0.3], [Br.x0 + 0.3, Br.z1 - 0.3], [Br.x1 - 0.3, Br.z1 - 0.3]];
    const [fx, fz] = corners.reduce((p, c) => (Math.hypot(c[0] - cx, c[1] - cz) > Math.hypot(p[0] - cx, p[1] - cz) ? c : p));
    expect(lum(L, fx, Br.y0 + 1, fz)).toBeLessThan(farther + 1e-6);
  });

  it('changes smoothly across a doorway: no step anywhere along the way through', () => {
    for (const [A, D] of pairs().slice(0, 6)) {
      const L = only([A]), a = mid(A, 1), d = mid(D, 1);
      let prev = lum(L, ...a), worst = 0;
      for (let k = 1; k <= 40; k++) {
        const t = k / 40, v = lum(L, a[0] + (d[0] - a[0]) * t, a[1], a[2] + (d[2] - a[2]) * t);
        worst = Math.max(worst, Math.abs(v - prev));
        prev = v;
      }
      expect(worst).toBeLessThan(0.15);
    }
  });

  it('a shut door keeps it in; opened, it lets it through, as far as it is open', () => {
    const [A, D] = pairs().find(([a, d]) => w.rooms[a].lit === 'main' && w.def.doors.some(o => o.x0 >= w.rooms[d].x0 - 0.01 && o.x1 <= w.rooms[d].x1 + 0.01 && o.z0 >= w.rooms[d].z0 - 0.01 && o.z1 <= w.rooms[d].z1 + 0.01))!;
    const Dr = w.rooms[D], door = w.def.doors.findIndex(o => o.x0 >= Dr.x0 - 0.01 && o.x1 <= Dr.x1 + 0.01 && o.z0 >= Dr.z0 - 0.01 && o.z1 <= Dr.z1 + 0.01);
    /* the far side of the doorway from A */
    const Ar = w.rooms[A], alongZ = Dr.x1 - Dr.x0 <= Dr.z1 - Dr.z0 + 0.01 && (Ar.z1 <= Dr.z0 + 0.01 || Ar.z0 >= Dr.z1 - 0.01);
    const far: [number, number, number] = alongZ
      ? [(Dr.x0 + Dr.x1) / 2, Dr.y0 + 1, Ar.z1 <= Dr.z0 + 0.01 ? Dr.z1 - 0.3 : Dr.z0 + 0.3]
      : [Ar.x1 <= Dr.x0 + 0.01 ? Dr.x1 - 0.3 : Dr.x0 + 0.3, Dr.y0 + 1, (Dr.z0 + Dr.z1) / 2];
    const L = only([A], () => 0), shut = lum(L, ...far);
    L.follow(d => (d === door ? 0.5 : 0));
    const half = lum(L, ...far);
    L.follow(d => (d === door ? 1 : 0));
    const open = lum(L, ...far);
    expect(half).toBeGreaterThan(shut);
    expect(open).toBeGreaterThan(half);
    expect(open).toBeCloseTo(lum(only([A], d => (d === door ? 1 : 0)), ...far), 5);
    L.follow(() => 0);
    expect(lum(L, ...far)).toBeCloseTo(shut, 5);
  });

  it('does not come through a wall: rooms side by side with none between them see none of each other', () => {
    /* every point of a dark room a wall's thickness from a lit one, with no opening between, is dark */
    const L = new Lighting(w, fullPower), off = (r: number) => Math.max(...L.room(r)) === 0 && !w.rooms[r].doorway;
    let checked = 0;
    for (const R of w.rooms) {
      if (!off(R.id)) continue;
      const open = new Set(w.neighbours(R.id));
      for (const S of w.rooms) {
        if (S.id === R.id || open.has(S.id) || off(S.id) || S.doorway) continue;
        /* S just across R's west wall, 2 m of rock, at R's floor */
        if (Math.abs(S.x1 - (R.x0 - 2)) > 0.01 || S.z1 <= R.z0 || S.z0 >= R.z1 || Math.abs(S.y0 - R.y0) > 0.5) continue;
        const z = (Math.max(S.z0, R.z0) + Math.min(S.z1, R.z1)) / 2;
        expect(lum(L, R.x0 + 0.2, R.y0 + 1, z)).toBe(0);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
