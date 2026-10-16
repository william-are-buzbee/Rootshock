import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { STEP } from '../src/core/loop';
import type { Mutant } from '../src/sim/cast';
import { give } from '../src/sim/game';
import { noInput, type Input } from '../src/sim/input';
import { MOVES, POISE } from '../src/sim/moves';
import { makeSim, step, type Sim } from '../src/sim/sim';

/* Blows traced through the world (engine.md §6, F3b). You stand at x 10, in the middle of a room's width, facing east;
   your right is south (+z). The pipe and the baton swing side to side, right to left; the axe chops, from up and right
   down to the left. */
function room(w: number, ht: number, build: (b: LevelBuilder, z: number) => void = () => {}): Sim {
  const b = new LevelBuilder('room', 'Room');
  b.room('Room', 0, 0, 20, w, { ht });
  build(b, w / 2);
  b.start(10, w / 2, -Math.PI / 2);
  const s = makeSim(b.finish());
  for (const m of s.cast) { m.stun = 1e9; m.hp = m.max = 1e4; }
  s.game.hp = 1e9;
  return s;
}
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => {
  for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp });
};
const heard = (s: Sim, name: string) => s.game.events.some(e => e.type === 'sfx' && e.name === name);
/** a click, and what came of it: whether it glanced, whether you reeled */
function swing(s: Sim, id: string) {
  give(s.game, id);
  s.game.events.length = 0;
  let reeled = false;
  hold(s, STEP, { attack: true });
  for (let t = 0; t < 2; t += STEP) { step(s, noInput()); reeled ||= s.hands.stag > 0; }
  return { glanced: heard(s, 'blow'), reeled };
}

describe('a swing meets the world', () => {
  it('a side swing in a narrow corridor glances off its wall and knocks the wind out of you; in the open, nothing', () => {
    expect(swing(room(1.6, 4), 'pipe')).toEqual({ glanced: true, reeled: true });
    expect(swing(room(12, 4), 'pipe')).toEqual({ glanced: false, reeled: false });
  });

  it('the baton glances there too, but it is too light to knock the wind out of you', () => {
    expect(swing(room(1.6, 4), 'baton')).toEqual({ glanced: true, reeled: false });
  });

  it('the axe\'s chop catches a low ceiling the pipe\'s side swing passes under', () => {
    expect(swing(room(12, 2.2), 'axe').glanced).toBe(true);
    expect(swing(room(12, 2.2), 'pipe').glanced).toBe(false);
    expect(swing(room(12, 4), 'axe').glanced).toBe(false);
  });

  it('a glance comes back on your poise even when it does not knock the wind out of you', () => {
    const s = room(1.6, 4);
    swing(s, 'baton');
    expect(s.hands.poise).toBeLessThan(POISE.you);
  });

  it('a wall between you and it: the blow glances off the wall, and what is behind it is untouched', () => {
    const s = room(12, 4, (b, z) => { b.block(10.75, 0, 0, 11, 4, 12, 0x707070); b.mutant('worm', 11.5, 0, z); }); // the wall on the 0.25 m grid
    const m = s.cast[0];
    s.player.pitch = -0.6;
    expect(swing(s, 'pipe').glanced).toBe(true);
    expect(m.hp).toBe(m.max);
  });
});

describe('a swing meets the cast', () => {
  it('a side swing sends what it hits off to your left, the way the swing was going', () => {
    const s = room(12, 4, (b, z) => b.mutant('worm', 11.3, 0, z));
    const m = s.cast[0], x = m.x, z = m.z;
    s.player.pitch = -0.7; // looking down at it
    swing(s, 'pipe');
    expect(m.hp).toBeLessThan(m.max);
    expect(m.x - x).toBeGreaterThan(0.1);
    expect(m.z - z).toBeLessThan(-0.1); // north: your left
  });

  it('a thresher\'s wide blow in a corridor glances off its walls and leaves it reeling and open; in the open it lands', () => {
    const blow = (w: number) => {
      const s = room(w, 4, (b, z) => b.mutant('thresher', 11.2, 0, z)), m = s.cast[0] as Mutant;
      m.stun = 0; m.state = 'pursue'; m.st = 10; m.yaw = -Math.PI / 2; // faced west, at you
      m.blow = { ph: 'wind', t: MOVES.thresher.wind - 0.02, hit: false };
      const hp = s.game.hp;
      s.game.events.length = 0;
      let reeled = false;
      for (let t = 0; t < 0.4; t += STEP) { step(s, noInput()); reeled ||= m.reel > 0; }
      return { took: hp - s.game.hp, glanced: heard(s, 'blow'), reeled };
    };
    expect(blow(2)).toEqual({ took: 0, glanced: true, reeled: true });
    const open = blow(12);
    expect(open.took).toBeGreaterThan(0);
    expect(open.glanced).toBe(false);
  });
});
