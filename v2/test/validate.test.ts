import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { validateStation } from '../src/sim/validate';

/* The station's content, checked without playing it: part of `npm run check`. */

describe('level validation', () => {
  const upper = buildUpper(STATION.ladders);

  it('finds no mistakes in the station; what waits on other levels is marked as such', () => {
    const p = validateStation(STATION, [upper]);
    expect(p.filter(x => !x.later)).toEqual([]);
    expect(p.filter(x => x.later).map(x => x.what)).toEqual(expect.arrayContaining(['ladder A1 goes to Main level, not ported yet', 'door 16 wants code 1, written on a paper no level ported yet holds']));
  });

  it('catches a thing that does not exist, a card nobody has, a code written nowhere, and a thing out of reach', () => {
    const L = structuredClone(upper);
    L.items.push({ id: 'unobtainium', x: 30, y: 0, z: -1, n: 1 });
    L.items.push({ id: 'batt', x: 30, y: 9, z: -1, n: 1 }); // in the ceiling
    L.doors[3] = { ...L.doors[3], card: 'zz' };
    L.doors[4] = { ...L.doors[4], code: 3 };
    const what = validateStation(STATION, [L]).filter(x => !x.later).map(x => x.what).join('\n');
    expect(what).toMatch(/item that does not exist: unobtainium/);
    expect(what).toMatch(/door 3 wants card zz/);
    expect(what).toMatch(/door 4 wants code 3, which is written down nowhere/);
    expect(what).toMatch(/batt at 30, -1 is out of reach/);
  });
});
