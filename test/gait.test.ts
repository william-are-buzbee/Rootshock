import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { STEP } from '../src/core/loop';
import { angDiff } from '../src/core/math';
import { GAIT, MT, pace, spawn, type Mutant } from '../src/sim/cast';
import { WAYS, type Walker, type Way } from '../src/sim/fields';
import { noInput } from '../src/sim/input';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { hold } from './kit';

/* How the cast get about, by kind (engine.md §6, how the cast move): a kind's gait and its way are rows in tables, and
   a kind the code has never heard of moves by its rows alone. */

/* a kind made here and nowhere else: tall, slow, walking where it faces, with the husk's behaviour, and a way of its
   own (it needs 2.6 m of headroom and takes no doors). Made as a new kind would be: rows, no code */
(WAYS as Record<string, Way>).tall = { head: 2.6, doors: 'none', call: false };
MT.strider = { ai: 'husk', model: 'husk', hp: 200, r: 0.5, cr: 0.45, mass: 3, kg: 260, h: 2.5, way: 'tall' as Walker };
GAIT.strider = { pace: { walk: 0.8, hunt: 2 }, acc: 6, turn: 8, heading: 1.2, feet: { sound: 'hstep', walk: 0.9, fast: 0.6, big: true } };

/** a hall 20 by 12 m, 4 m high, you at (5, 6) facing east; and east of it a passage 2.2 m high, a dead end */
function hall(build: (b: LevelBuilder) => void = () => {}): Sim {
  const b = new LevelBuilder('hall', 'Hall');
  b.room('Hall', 0, 0, 20, 12, { ht: 4 });
  b.room('Passage', 20, 5, 30, 7, { ht: 2.2 });
  build(b);
  b.start(5, 6, -Math.PI / 2);
  const s = makeSim(b.finish());
  s.game.hp = 1e9;
  return s;
}
const v = (m: Mutant) => Math.hypot(m.body!.vx, m.body!.vz);
const hunting = (m: Mutant) => { m.state = 'hunt'; m.fled = true; m.lost = 0; };

describe('a kind is its rows', () => {
  it('one put down where none of its way walked gets a field for its way, made in its turn', () => {
    const s = hall(b => b.mutant('husk', 15, 0, 6));
    expect(s.fields!.order).toEqual(['crawl', 'hands', 'big', 'sound']); // the three every level keeps, and sound
    spawn(s, 'strider', 15, 0, 3);
    expect(s.fields!.order).toEqual(['crawl', 'hands', 'big', 'tall', 'sound']);
    hold(s, 0.2);
    const nav = s.fields!.nav, here = nav.locate(15, 0, 3);
    expect(s.fields!.ways.tall[here]).toBeLessThan(15);
  });

  it('its way keeps it to where it fits: the low passage is on a husk\'s way, not on its', () => {
    const s = hall(b => b.mutant('strider', 15, 0, 3));
    hold(s, 0.2);
    const F = s.fields!, deep = F.nav.locate(27, 0, 6);
    expect(F.nav.head[deep]).toBeLessThan(2.6);
    expect(F.ways.hands[deep]).toBeLessThan(30);
    expect(F.ways.tall[deep]).toBe(Infinity);
  });

  it('it goes after you at its own pace, not a husk\'s', () => {
    const s = hall(b => { b.mutant('strider', 16, 0, 6, { yaw: -Math.PI / 2 }); b.mutant('husk', 16, 0, 9, { yaw: -Math.PI / 2 }); });
    const [m, h] = s.cast;
    hunting(m); hunting(h);
    hold(s, 0.6);
    expect(v(m)).toBeCloseTo(GAIT.strider.pace.hunt, 1);
    expect(v(h)).toBeCloseTo(GAIT.husk.pace.hunt, 1);
  });

  it('walking where it faces, it turns no faster than its gait lets it, and goes only once it faces you', () => {
    const s = hall(b => b.mutant('strider', 11, 0, 6, { yaw: Math.PI / 2 })), m = s.cast[0]; // its back to you, 6 m off
    hunting(m);
    let worst = 0, crept = 0;
    for (let t = 0; t < 5; t += STEP) {
      const was = m.yaw;
      step(s, noInput());
      worst = Math.max(worst, Math.abs(angDiff(was, m.yaw)));
      const off = Math.abs(angDiff(m.yaw, Math.atan2(s.player.body.x - m.x, s.player.body.z - m.z)));
      if (off > Math.PI / 2 + 0.05) crept = Math.max(crept, v(m));
    }
    expect(worst).toBeLessThanOrEqual(GAIT.strider.heading! * STEP + 1e-9);
    expect(crept).toBeLessThan(0.05); // turned away, it stands and turns
    expect(m.dp).toBeLessThan(3); // and then it comes: half a turn takes it 2.6 s
  });

  it('a husk turns on the spot and goes at once, as it always has', () => {
    const s = hall(b => b.mutant('husk', 11, 0, 6, { yaw: Math.PI / 2 })), m = s.cast[0];
    hunting(m);
    hold(s, 0.25);
    expect(v(m)).toBeGreaterThan(2.5);
  });
});

describe('one of the cast given its own pace by the level', () => {
  it('is slow at everything, its hunt as well as its walk', () => {
    const s = hall(b => { b.mutant('husk', 16, 0, 6, { walk: 0.65 }); b.mutant('husk', 16, 0, 9); });
    const [slow, other] = s.cast;
    expect(pace(slow, 'walk')).toBe(0.65);
    expect(pace(slow, 'hunt')).toBeCloseTo(GAIT.husk.pace.hunt / 2, 9);
    expect(pace(other, 'hunt')).toBe(GAIT.husk.pace.hunt);
    hunting(slow);
    hold(s, 0.6);
    expect(v(slow)).toBeCloseTo(GAIT.husk.pace.hunt / 2, 1);
  });

  it('asked for a pace its kind has none for, walks', () => {
    const s = hall(b => b.mutant('worm', 16, 0, 6));
    expect(pace(s.cast[0], 'rally')).toBe(GAIT.worm.pace.walk);
  });
});
