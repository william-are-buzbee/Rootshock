import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { STEP } from '../src/core/loop';
import { hitMutant, type Mutant } from '../src/sim/cast';
import { struck } from '../src/sim/combat';
import { give } from '../src/sim/game';
import { noInput, type Input } from '../src/sim/input';
import { MOVES, POISE, swingOf } from '../src/sim/moves';
import { makeSim, step, type Sim } from '../src/sim/sim';

/* Committing to a blow, and the reaction ladder (engine.md §6, F2). A hall 20 by 12 m; you stand in the middle facing
   east. What is put in it stands still (stunned) unless a test wakes it. */
function hall(build: (b: LevelBuilder) => void = () => {}): Sim {
  const b = new LevelBuilder('hall', 'Hall');
  b.room('Hall', 0, 0, 20, 12, { ht: 4 });
  build(b);
  b.start(10, 6, -Math.PI / 2);
  const s = makeSim(b.finish());
  for (const m of s.cast) m.stun = 1e9;
  s.game.hp = 1e9;
  return s;
}
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => {
  for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp });
};
const heard = (s: Sim, name: string) => s.game.events.some(e => e.type === 'sfx' && e.name === name);
/** look at a point from where you stand */
function face(s: Sim, x: number, y: number, z: number): void {
  const b = s.player.body, dx = x - b.x, dz = z - b.z;
  s.player.yaw = Math.atan2(-dx, -dz);
  s.player.pitch = Math.atan2(y - (b.y + 1.62), Math.hypot(dx, dz));
}

describe('a blow commits', () => {
  it('it goes along the line you let it go on, wherever you look after', () => {
    const s = hall(b => { b.mutant('worm', 11.2, 0, 5.3); b.mutant('worm', 11.2, 0, 6.7); });
    const [a, c] = s.cast;
    give(s.game, 'pipe');
    face(s, a.x, a.y + 0.36, a.z);
    hold(s, 1.1, { attack: true });
    step(s, noInput()); // let go, at a
    face(s, c.x, c.y + 0.36, c.z); // and look at the other before it lands
    hold(s, 0.5);
    expect(a.hp).toBeLessThan(a.max);
    expect(c.hp).toBe(c.max);
  });

  it('a full load held too long drops: no blow, and the arm slow to come up again', () => {
    const s = hall();
    give(s.game, 'axe');
    s.game.events.length = 0;
    let dropped = -1;
    for (let t = 0; t < 4 && dropped < 0; t += STEP) { step(s, { ...noInput(), attack: true }); if (heard(s, 'tire')) dropped = t; }
    const T = (0.3 + 0.2 * 3.2) + 0.15, tire = swingOf('edge', 3.2).tire;
    expect(dropped).toBeGreaterThan(T + tire - 0.05);
    expect(dropped).toBeLessThan(T + tire + 0.05);
    expect(s.hands.chg).toBe(-1);
    expect(heard(s, 'swing')).toBe(false);
    /* the arm slow to come up: a press just before it is kept, not acted on, until it is */
    hold(s, STEP);
    expect(s.hands.rec).toBeGreaterThan(0.3);
    while (s.hands.rec > 0.1) step(s, noInput());
    hold(s, STEP, { attack: true });
    expect(s.hands.chg).toBe(-1);
    hold(s, 0.2, { attack: true });
    expect(s.hands.chg).toBeGreaterThan(0);
  });

  it('a full blow carries you a step forward; a jab does not', () => {
    const moved = (secs: number) => {
      const s = hall();
      give(s.game, 'axe');
      hold(s, secs, { attack: true });
      const x = s.player.body.x;
      hold(s, 1);
      return s.player.body.x - x;
    };
    expect(moved(1.2)).toBeGreaterThan(0.1);
    expect(Math.abs(moved(0.1))).toBeLessThan(0.02);
  });

  it('a full blow that meets nothing leaves you longer coming back than one that lands', () => {
    const rec = (target: boolean) => {
      const s = hall(b => { if (target) b.mutant('worm', 11.2, 0, 6); });
      give(s.game, 'axe');
      if (target) face(s, 11.2, 0.36, 6);
      hold(s, 1.2, { attack: true });
      for (let k = 0; k < 120 && !s.hands.swing; k++) step(s, noInput());
      while (s.hands.swing) step(s, noInput());
      return s.hands.rec;
    };
    expect(rec(false)).toBeCloseTo(swingOf('edge', 3.2).miss, 1);
    expect(rec(true)).toBeLessThanOrEqual(0);
  });

  it('loading slows your feet, and backing off as you load slows them more', () => {
    const went = (inp: Partial<Input>) => {
      const s = hall();
      give(s.game, 'pipe');
      const x = s.player.body.x;
      hold(s, 1, inp);
      return Math.abs(s.player.body.x - x);
    };
    const walk = went({ forward: 1 }), loading = went({ forward: 1, attack: true }), back = went({ forward: -1, attack: true });
    expect(loading).toBeLessThan(walk * 0.7);
    expect(back).toBeLessThan(loading * 0.75);
  });

  it('a press while the arm is coming back is kept a moment, and starts the next load when it is in', () => {
    const s = hall();
    give(s.game, 'pipe');
    hold(s, 0.1, { attack: true });
    hold(s, STEP); // a jab
    for (let k = 0; k < 120 && s.hands.rec <= 0; k++) step(s, noInput());
    while (s.hands.rec > 0.12) step(s, noInput());
    hold(s, 0.2, { attack: true }); // pressed with the arm still coming back, and held
    expect(s.hands.chg).toBeGreaterThan(0);
    /* pressed too early, and let go: nothing comes of it */
    const t = hall();
    give(t.game, 'pipe');
    hold(t, 0.1, { attack: true });
    hold(t, STEP);
    hold(t, STEP, { attack: true });
    hold(t, 0.6);
    expect(t.hands.chg).toBe(-1);
    expect(t.hands.swing).toBe(null);
  });
});

describe('the ladder, on you', () => {
  it('a hit costs you a load', () => {
    const s = hall();
    give(s.game, 'pipe');
    hold(s, 0.5, { attack: true });
    expect(s.hands.chg).toBeGreaterThan(0);
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.chg).toBe(-1);
  });

  it('the axe on its way down shrugs off a husk; a baton does not', () => {
    const thrown = (id: string) => {
      const s = hall();
      give(s.game, id);
      hold(s, 1.2, { attack: true });
      step(s, noInput());
      expect(s.hands.swing?.done).toBe(false);
      struck(s, MOVES.husk.poise, { x: 12, z: 6 });
      return s.hands.swing;
    };
    expect(thrown('axe')).not.toBe(null);
    expect(thrown('baton')).toBe(null);
  });

  it('two husk blows close together and you reel: no blows, slow feet, thrown back from it; left alone, you recover', () => {
    const s = hall();
    give(s.game, 'pipe');
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.stag).toBe(0);
    s.game.events.length = 0;
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.stag).toBeGreaterThan(0);
    expect(heard(s, 'reel')).toBe(true);
    expect(s.player.body.vx).toBeLessThan(-1); // away from it, west
    hold(s, 0.2, { attack: true });
    expect(s.hands.chg).toBe(-1);
    /* given time, your poise comes back: one blow is a flinch again */
    hold(s, 3);
    expect(s.hands.poise).toBe(POISE.you);
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.stag).toBe(0);
  });
});

describe('the ladder, on them', () => {
  const husk = () => { const s = hall(b => b.mutant('husk', 11, 0, 6)); return { s, m: s.cast[0] }; };
  const full = (id: string, kind: 'blunt' | 'edge', mass: number) => ({ dmg: 1, poise: swingOf(kind, mass).poise, id });

  it('one full axe blow staggers a husk; a baton takes two; a jab only flinches it', () => {
    const axe = husk();
    hitMutant(axe.s, axe.m, full('axe', 'edge', 3.2), 1);
    expect(axe.m.reel).toBeGreaterThan(0);
    expect(axe.m.reel).toBeLessThan(2); // it reels for the stagger, not for however long it was held still before
    const baton = husk();
    hitMutant(baton.s, baton.m, full('baton', 'blunt', 1.1), 1);
    expect(baton.m.reel).toBe(0);
    hitMutant(baton.s, baton.m, full('baton', 'blunt', 1.1), 1);
    expect(baton.m.reel).toBeGreaterThan(0);
    const jab = husk();
    jab.m.stun = 0;
    hitMutant(jab.s, jab.m, full('axe', 'edge', 3.2), 0.3);
    expect(jab.m.reel).toBe(0);
    expect(jab.m.stun).toBeGreaterThan(0);
  });

  it('a thresher winding up shrugs off a baton, and its blow goes on', () => {
    const s = hall(b => b.mutant('thresher', 11, 0, 6)), m = s.cast[0];
    m.stun = 0;
    m.blow = { ph: 'wind', t: 0.1, hit: false };
    hitMutant(s, m, full('baton', 'blunt', 1.1), 1);
    expect(m.blow?.ph).toBe('wind');
    expect(m.stun).toBe(0);
  });
});

describe('taking turns', () => {
  /** you between two husks: one at you, stood still; the other coming from the west */
  function pair() {
    const s = hall(b => { b.mutant('husk', 11.2, 0, 6); b.mutant('husk', 4, 0, 6); });
    const [front, back] = s.cast as [Mutant, Mutant];
    front.state = 'hunt';
    back.stun = 0; back.state = 'hunt';
    return { s, front, back };
  }
  const nearest = (s: Sim, m: Mutant, secs: number) => { let n = 99; for (let t = 0; t < secs; t += STEP) { step(s, noInput()); n = Math.min(n, m.dp); } return n; };

  it('while one is at you, the next holds off at arm\'s length and a half', () => {
    const { s, back } = pair();
    const n = nearest(s, back, 2.5);
    expect(n).toBeGreaterThan(1.9);
    expect(n).toBeLessThan(3.2);
    expect(back.blow).toBe(null);
  });

  it('when you are open, it comes in', () => {
    const { s, back } = pair();
    hold(s, 2);
    s.hands.rec = 3; // your arm coming back from a blow
    expect(nearest(s, back, 1.5)).toBeLessThan(1.3);
  });

  it('it will not wait for ever', () => {
    const { s, back } = pair();
    expect(nearest(s, back, 5)).toBeLessThan(1.3);
  });
});

describe('duels', () => {
  /* A fighter with some sense: it loads early, gives ground while it is not ready, steps in when it is, and lets go as
     the nearest steps into its reach. What these hold to is the design (engine.md §6): timed well, one husk is beaten;
     two at once are a problem whatever you hold. Tuning that breaks them is tuning that changed what the fight is. */
  function duel(weapon: string, husks: [number, number][], secs = 20) {
    const b = new LevelBuilder('hall', 'Hall');
    b.room('Hall', 0, 0, 20, 12, { ht: 4 });
    for (const [x, z] of husks) b.mutant('husk', x, 0, z);
    b.start(10, 6, -Math.PI / 2);
    const s = makeSim(b.finish(), { seed: 1 });
    give(s.game, weapon);
    for (const m of s.cast) m.state = 'hunt';
    const reach = (weapon === 'axe' ? 0.8 + 0.9 : 0.8 + 0.7) + 0.38;
    let held = false;
    for (let t = 0; t < secs && !s.game.ended && s.cast.some(m => !m.dead); t += STEP) {
      const m = s.cast.filter(q => !q.dead).sort((a, c) => a.dp - c.dp)[0], p = s.player.body, h = s.hands;
      s.player.yaw = Math.atan2(-(m.x - p.x), -(m.z - p.z)); s.player.pitch = -0.2;
      const ready = h.chg >= 0 && h.full;
      const attack: boolean = ready ? m.dp > reach - 0.15 : h.chg >= 0 ? true : !h.swing && h.rec <= 0 && h.stag <= 0 && !held;
      const forward = !ready && m.dp < 2.6 ? -1 : ready && m.dp < reach + 1.2 ? 1 : 0;
      held = attack;
      step(s, { ...noInput(), attack, forward });
    }
    return { hp: s.game.hp, dead: !!s.game.ended, kills: s.cast.filter(m => m.dead).length };
  }

  it('timed well, the axe beats one husk', () => {
    const r = duel('axe', [[13, 6]]);
    expect(r.kills).toBe(1);
    expect(r.dead).toBe(false);
  });

  it('two husks at once, one each side, and the axe is too slow: it never gets a blow off', () => {
    const r = duel('axe', [[13, 6], [7, 6.5]]);
    expect(r.dead || r.hp <= 40).toBe(true);
  });

  it('two husks at once hurt with the pipe too', () => {
    const r = duel('pipe', [[13, 6], [7, 6.5]]);
    expect(r.dead || r.hp <= 60).toBe(true);
  });
});
