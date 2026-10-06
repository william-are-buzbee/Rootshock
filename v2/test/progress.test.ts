import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { LevelBuilder } from '../src/content/build/builder';
import type { StationDef } from '../src/content/types';
import { makeSim } from '../src/sim/sim';
import { checkProgress, describe as describeReport } from '../src/sim/progress';
import { load, save } from '../src/sim/save';

/* The progression checker: proved on the upper station as it stands, and on a small level built to go wrong. */

const upper = buildUpper(STATION.ladders);

describe('the upper station', () => {
  const s = makeSim(upper, { seed: 7, station: STATION });
  const r = checkProgress(s);

  it('can be left both ways from the start: ladder A at once, ladder B once Cargo has its backup set', () => {
    expect(r.goals['ladder A1 to Main level']).toEqual([]);
    expect(r.goals['ladder B1 to Main level']).toEqual(['start the CARGO backup set']);
    expect(r.goals['the surface']).toBeUndefined(); // that wants Gen-1, five floors down
  });

  it('keeps the Armory and the hazard store shut until Gen-1 runs, and has no soft-locks or dead ends', () => {
    expect(r.rooms.never).toContain('Armory');
    expect(r.rooms.never).toContain('Hazardous storage');
    expect(r.items.never).toEqual(expect.arrayContaining(['Shotgun', 'Surface lift pass', 'Rebreather']));
    expect(r.softLocks).toEqual([]);
    expect(r.deadEnds).toEqual([]);
  });

  it('with Gen-1 running and the Armory code known (both from below), everything is in reach and the surface is open', () => {
    const r2 = checkProgress(s, { main: true, have: ['#1'] });
    expect(r2.items.never).toEqual([]);
    expect(r2.goals['the surface']).toEqual(['take surface lift pass']);
    expect(r2.rooms.never.every(n => /Cell|Phase 2|Surface cage|doorway/.test(n))).toBe(true); // welded, or the way out itself
  });

  it('works from a save: what you have done is taken as done', () => {
    const a = makeSim(upper, { seed: 7, station: STATION });
    a.game.station!.circuits.CARGO.back = true;
    const r3 = checkProgress(load(upper, JSON.parse(JSON.stringify(save(a))), { seed: 7, station: STATION }));
    expect(r3.goals['ladder B1 to Main level']).toEqual([]);
  });

  it('reads as text', () => {
    expect(describeReport(r)).toMatch(/ladder B1 to Main level: start the CARGO backup set/);
  });
});

describe('a level built to go wrong', () => {
  /* a hall with one splice kit and two burned-out connections, each powering the heavy door to its own way down; and a
     pit off the hall you can drop into and not climb out of */
  const station: StationDef = {
    levels: [], ladders: {}, main: true, start: 'trap',
    circuits: { MAIN: { on: true, back: false }, A: { on: false, back: false, broken: true }, B: { on: false, back: false, broken: true } },
  };
  const b = new LevelBuilder('trap', 'Trap', { circuit: 'MAIN' });
  b.room('Hall', 0, 0, 12, 8, { ht: 3 });
  for (const [side, x] of [['A', 1], ['B', 9]] as const) {
    b.room('Passage ' + side, x, 8, x + 2, 8.75, { ht: 2.6 });
    b.room('', x, 8.75, x + 2, 9, { ht: 2.4 });
    b.room('Passage ' + side, x, 9, x + 2, 10, { ht: 2.6 });
    b.door(x, 8.75, x + 2, 9, 2.4, { kind: 'heavy', circuit: side });
    b.room('Room ' + side, x - 1, 10, x + 3, 14, { ht: 3 });
    b.use('stair', x + 1, 0.4, 12, { to: 'below ' + side, up: 0 });
    b.use('panel', x === 1 ? 5 : 7, 1.3, 0.5, { c: side });
  }
  b.item('kit', 6, 0, 4);
  b.room('Pit', 12, 2, 16, 6, { y0: -2, ht: 4.5 });
  b.start(6, 6, 0);
  const s = makeSim(b.finish(), { seed: 1, station });
  const r = checkProgress(s);

  it('sees both ways down, each by mending its own connection', () => {
    expect(r.goals['stairs to below A']).toEqual(['take splice kit', 'mend the A connection with a kit']);
    expect(r.goals['stairs to below B']).toEqual(['take splice kit', 'mend the B connection with a kit']);
  });

  it('reports the kit spent on one as the other lost for good', () => {
    expect(r.softLocks).toEqual(expect.arrayContaining([
      { lost: ['stairs to below B'], route: ['take splice kit', 'mend the A connection with a kit'] },
      { lost: ['stairs to below A'], route: ['take splice kit', 'mend the B connection with a kit'] },
    ]));
  });

  it('reports the pit as a dead end', () => {
    expect(r.deadEnds.map(d => d.room)).toContain('Pit');
  });
});
