import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim } from '../src/sim/sim';
import { Lighting, fullPower } from '../src/world/light';
import { Cascade } from '../src/present/cascade';

/* Power coming on, room by room (present/cascade.ts): it starts where you are, reaches the far end last, ends exactly as
   the new power lights it, and going dark is not staged. */

const sim = makeSim(buildUpper(STATION.ladders), { seed: 3, station: STATION });
const w = sim.world, dark = new Lighting(w, () => 0), lit = new Lighting(w, fullPower);
const named = (n: string) => w.rooms.find(R => R.name === n)!.id;
const centre = (L: Lighting, r: number) => { const R = w.rooms[r]; return L.at(r, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2); };

describe('the power coming on', () => {
  it('lights the room you are in first and the far end last, then holds exactly as the new power has it', () => {
    const here = named('Operations corridor'), far = named('Cargo office'), struck: number[] = [];
    const C = new Cascade(w, dark, lit, here, r => struck.push(r));
    expect(centre(C.L, here)).toEqual(centre(dark, here)); // nothing yet
    const first = new Map<number, number>();
    for (let t = 0; t < 5 && !C.done; t += 1 / 60) for (const r of C.update(1 / 60)) if (!first.has(r)) first.set(r, t);
    expect(C.done).toBe(true);
    expect(first.get(here)!).toBeLessThan(first.get(far)!);
    expect(struck[0]).toBe(here);
    for (const R of w.rooms) expect(centre(C.L, R.id)).toEqual(centre(lit, R.id));
  });

  it('a tube strikes: it comes on, goes off a moment, and comes on again', () => {
    const here = named('Operations corridor'), C = new Cascade(w, dark, lit, here, () => {});
    const seen: number[] = [C.L.on[here]]; // as it stands before the first frame
    for (let t = 0; t < 5 && !C.done; t += 1 / 120) { C.update(1 / 120); if (seen[seen.length - 1] !== C.L.on[here]) seen.push(C.L.on[here]); }
    expect(seen.slice(0, 4)).toEqual([0, 1, 0, 1]);
  });

  it('power going off goes at once', () => {
    const C = new Cascade(w, lit, dark, named('Operations corridor'), () => {});
    for (const R of w.rooms) expect(centre(C.L, R.id)).toEqual(centre(dark, R.id));
    C.update(0.001);
    expect(C.done).toBe(true);
  });
});
