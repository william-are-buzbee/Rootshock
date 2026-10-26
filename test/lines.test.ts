import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { hitMutant, MT, type Mutant } from '../src/sim/cast';
import { TEMPER } from '../src/sim/cast/husk';
import { makeSim, type Sim } from '../src/sim/sim';
import { fresh, hold } from './kit';

/* Pia's lines that walk as husks (world.md §10, Temper): Security's changed, the bush's children, fear held down by the
   opiate; and the bone mother's young, the Commons' husks, fear with nothing holding it. One body and one behaviour,
   two tempers (cast/husk.ts, TEMPER). */

/** a hall 20 by 12 m, 4 m high, and off its east end a lane 10 m long; you flown high out of it, unless `here` */
function hall(build: (b: LevelBuilder) => void, here = false): Sim {
  const b = new LevelBuilder('hall', 'Hall');
  b.room('Hall', 0, 0, 20, 12, { ht: 4 });
  b.room('Lane', 20, 1, 30, 3, { ht: 4 });
  build(b);
  b.start(5, 6, -Math.PI / 2);
  const s = makeSim(b.finish());
  s.game.hp = 1e9;
  if (!here) { s.player.fly = true; s.player.body.y += 200; }
  return s;
}
const from = (m: Mutant, x: number, z: number) => Math.hypot(m.x - x, m.z - z);

describe('two lines, one body', () => {
  it('Security\'s staff are the changed, the bush\'s; the husks elsewhere the bone mother\'s', () => {
    const s = fresh();
    const changed = s.cast.filter(m => m.type === 'changed' || m.type === 'nightround');
    expect(changed.length).toBe(7); // Security's seven
    expect(changed.every(m => m.line === 'bush' && m.cards)).toBe(true);
    expect(s.cast.filter(m => m.type === 'husk').every(m => m.line === 'bone' && !m.cards)).toBe(true); // Cargo's
    expect(MT.thresher.line).toBe('bone'); // the bone line's middle years
  });

  it('the bone line ignores its own pain: badly hurt, one of the changed runs, a husk comes on', () => {
    const s = hall(b => { b.mutant('changed', 12, 0, 3); b.mutant('husk', 12, 0, 9); }, true), [c, h] = s.cast;
    for (const m of [c, h]) { m.state = 'hunt'; m.lost = 0; m.hp = m.max * 0.2; }
    hold(s, 0.2);
    expect(c.state).toBe('flee');
    expect(h.state).toBe('hunt');
    expect(h.fled).toBe(false);
  });

  it('at its post, one of the changed stands, taking root; a husk is never still, shifting about it', () => {
    const s = hall(b => { b.mutant('changed', 8, 0, 3, { post: 1 }); b.mutant('husk', 8, 0, 9, { post: 1 }); }), [c, h] = s.cast;
    let shifted = 0, strayed = 0;
    for (let t = 0; t < 20; t += 0.5) { hold(s, 0.5); shifted = Math.max(shifted, from(h, 8, 9)); strayed = Math.max(strayed, from(c, 8, 3)); }
    expect(strayed).toBeLessThan(0.05);
    expect(shifted).toBeGreaterThan(0.3);
    expect(shifted).toBeLessThan(TEMPER.bone.fidget * Math.SQRT2 + 0.5);
  });

  it('it rests less between rounds than the changed do', () => {
    expect(TEMPER.bone.rest[1]).toBeLessThan(TEMPER.bush.rest[0]);
  });

  it('one that turns on you sets off the rest of its line in earshot, not further, and not the changed', () => {
    const s = hall(b => {
      b.mutant('husk', 4, 0, 6); b.mutant('husk', 14, 0, 6); // ten metres off: in earshot
      b.mutant('husk', 28, 0, 2); // down the lane, well out of it
      b.mutant('changed', 8, 0, 9); // in earshot, but another line
    });
    hold(s, 0.2);
    const [a, b, far, c] = s.cast;
    expect(s.cast.every(m => m.state === 'idle')).toBe(true);
    hitMutant(s, a, { dmg: 1, poise: 0 });
    expect(a.state).toBe('hunt');
    expect(b.state).toBe('hunt');
    expect(far.state).toBe('idle');
    expect(c.state).toBe('idle');
    expect(s.game.events.filter(e => e.type === 'sfx' && e.name === 'moan').length).toBeGreaterThanOrEqual(1); // heard
  });
});
