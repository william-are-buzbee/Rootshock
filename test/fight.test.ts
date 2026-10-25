import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { STEP } from '../src/core/loop';
import { hitMutant, type Mutant } from '../src/sim/cast';
import { struck } from '../src/sim/combat';
import { give } from '../src/sim/game';
import { noInput } from '../src/sim/input';
import { MOVES, POISE, swingOf } from '../src/sim/moves';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { hold } from './kit';

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
const heard = (s: Sim, name: string) => s.game.events.some(e => e.type === 'sfx' && e.name === name);
/** look at a point from where you stand */
function face(s: Sim, x: number, y: number, z: number): void {
  const b = s.player.body, dx = x - b.x, dz = z - b.z;
  s.player.yaw = Math.atan2(-dx, -dz);
  s.player.pitch = Math.atan2(y - (b.y + 1.62), Math.hypot(dx, dz));
}

describe('a blow commits', () => {
  it('it goes along the line you let it go on, wherever you look after', () => {
    /* a, ahead and to the right; c, ahead and to the left: the pipe swings right to left, so aimed at a it is done
       before it could reach c, and c is struck only if the blow follows where you look */
    const s = hall(b => { b.mutant('worm', 11.2, 0, 6.7); b.mutant('worm', 11.2, 0, 5.3); });
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

  it('a full load can be held as long as you like, and goes when you let it', () => {
    const s = hall();
    give(s.game, 'axe');
    s.game.events.length = 0;
    hold(s, 6, { attack: true });
    expect(s.hands.full).toBe(true);
    expect(s.hands.chg).toBeGreaterThan(5);
    expect(heard(s, 'swing')).toBe(false);
    hold(s, STEP);
    expect(s.hands.swing).not.toBe(null);
  });

  it('tapping as fast as you can swings no faster than the arm comes up, and every blow is whole', () => {
    const s = hall(b => b.mutant('husk', 11.4, 0, 6));
    const m = s.cast[0];
    m.hp = m.max = 1e9;
    give(s.game, 'axe');
    face(s, m.x, m.y + 1, m.z);
    let swings = 0, was = false;
    const hits: number[] = [];
    for (let t = 0; t < 6; t += STEP) {
      const before = m.hp;
      step(s, { ...noInput(), attack: Math.round(t / STEP) % 4 < 2 }); // down two steps, up two: fifteen taps a second
      m.body!.x = 11.4; m.body!.z = 6; m.body!.vx = m.body!.vz = 0; m.body!.sync(); m.x = 11.4; m.z = 6; // held where it is
      if (m.hp < before) hits.push(before - m.hp);
      const now = !!s.hands.swing;
      if (now && !was) swings++;
      was = now;
    }
    /* the axe's arm is 1.09 s coming up and 0.36 s coming down: four blows in six seconds, not ninety */
    expect(swings).toBeGreaterThanOrEqual(3);
    expect(swings).toBeLessThanOrEqual(5);
    expect(hits.length).toBe(swings);
    for (const h of hits) expect(h).toBeCloseTo(hits[0], 6);
  });

  it('a blow carries you a step forward, clicked or held', () => {
    const moved = (secs: number) => {
      const s = hall();
      give(s.game, 'axe');
      hold(s, secs, { attack: true });
      const x = s.player.body.x;
      hold(s, 2);
      return s.player.body.x - x;
    };
    expect(moved(1.5)).toBeGreaterThan(0.1);
    expect(moved(STEP)).toBeCloseTo(moved(1.5), 2);
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
    expect(rec(true)).toBeCloseTo(swingOf('edge', 3.2).settle, 1);
    expect(rec(true)).toBeLessThan(rec(false));
  });

  it('loading, the arm coming up or held up, you shuffle at a share of a walk and cannot run', () => {
    const s = hall();
    give(s.game, 'pipe');
    const pace = 3.2 * swingOf('blunt', 2.4).held, v = () => Math.hypot(s.player.body.vx, s.player.body.vz);
    hold(s, 0.5, { forward: 1, run: true, attack: true });
    expect(s.hands.full).toBe(false);
    expect(v()).toBeCloseTo(pace, 1);
    hold(s, 0.6, { forward: 1, run: true, attack: true });
    expect(s.hands.full).toBe(true);
    expect(v()).toBeCloseTo(pace, 1);
  });

  it('let go, you plant your foot and stop whatever your keys say, the pace you had going into the blow; then you recover where you stand', () => {
    const s = hall();
    give(s.game, 'pipe');
    hold(s, 1.2, { forward: 1, attack: true });
    const v0 = s.player.body.vx;
    expect(v0).toBeGreaterThan(1);
    /* let go, and four steps later stopped, pushing on as you like */
    for (let k = 0; k < 5; k++) step(s, { ...noInput(), forward: 1, run: true, strafe: 1 });
    expect(s.hands.swing).not.toBeNull();
    expect(Math.hypot(s.player.body.vx, s.player.body.vz)).toBeLessThan(0.01);
    /* (a little more: what you had along your facing at the press, leaked) */
    expect(s.hands.carry).toBeGreaterThan(v0 - 0.05);
    expect(s.hands.carry).toBeLessThan(v0 + 0.3);
    /* met nothing: recovering, it brings you to a share of a walk however you push, and a press starts nothing */
    while (s.hands.swing) step(s, { ...noInput(), forward: -1 });
    hold(s, 0.15, { forward: -1, run: true });
    expect(s.hands.rec).toBeGreaterThan(0);
    expect(Math.hypot(s.player.body.vx, s.player.body.vz)).toBeLessThan(3.2 * swingOf('blunt', 2.4).plant + 0.05);
    step(s, { ...noInput(), attack: true });
    expect(s.hands.chg).toBe(-1);
  });

  it('sprinting, the press slows you to a shuffle and the blow keeps your run; held up, it leaks away', () => {
    const banked = (weapon: string, kg: number, held: number) => {
      const s = hall();
      s.player.body.x = 3;
      give(s.game, weapon);
      hold(s, 1.2, { forward: 1, run: true });
      step(s, { ...noInput(), forward: 1, run: true, attack: true });
      const at = s.hands.carry;
      hold(s, 0.35, { forward: 1, run: true, attack: true });
      const v = Math.hypot(s.player.body.vx, s.player.body.vz), pace = 3.2 * swingOf(kg > 3 ? 'edge' : 'blunt', kg).held;
      while (!s.hands.full) step(s, { ...noInput(), forward: 1, run: true, attack: true });
      hold(s, held, { forward: 1, run: true, attack: true });
      return { at, v, pace, kept: s.hands.carry };
    };
    const baton = banked('baton', 1.1, 0), axe = banked('axe', 3.2, 0), held = banked('axe', 3.2, 0.5);
    for (const r of [baton, axe]) {
      expect(r.at).toBeGreaterThan(5.3);
      expect(r.kept).toBeCloseTo(r.at, 5);
      expect(r.v).toBeLessThan(r.pace + 0.1);
    }
    expect(held.kept).toBeLessThan(axe.kept * 0.3);
  });

  it('loaded, the blow turns after your eyes, a heavy one slower; let go, it goes where your body was turned', () => {
    const turned = (weapon: string) => {
      const s = hall();
      give(s.game, weapon);
      hold(s, 0.1, { attack: true });
      const y0 = s.hands.line!.yaw;
      s.player.yaw += Math.PI / 2;
      for (let k = 0; k < 15; k++) step(s, { ...noInput(), attack: true });
      return s.hands.line!.yaw - y0;
    };
    const baton = turned('baton'), axe = turned('axe');
    expect(baton).toBeCloseTo(swingOf('blunt', 1.1).turn * 0.25, 1);
    expect(axe).toBeCloseTo(swingOf('edge', 3.2).turn * 0.25, 1);
    expect(axe).toBeLessThan(baton);
  });

  it('a click while the arm is coming back is kept a moment, and is a blow when it is in', () => {
    /* a blow at nothing: the arm half a second coming back */
    const missed = () => {
      const s = hall();
      give(s.game, 'axe');
      hold(s, STEP, { attack: true });
      for (let k = 0; k < 200 && s.hands.rec <= 0; k++) step(s, noInput());
      expect(s.hands.rec).toBeGreaterThan(0.3);
      return s;
    };
    const s = missed();
    while (s.hands.rec > 0.12) step(s, noInput());
    hold(s, STEP, { attack: true }); // a click, with the arm not yet in
    hold(s, 2);
    expect(heard(s, 'swing')).toBe(true);
    /* clicked too early: nothing comes of it */
    const t = missed();
    t.game.events.length = 0;
    hold(t, STEP, { attack: true });
    hold(t, 2);
    expect(t.hands.chg).toBe(-1);
    expect(heard(t, 'swing')).toBe(false);
  });
});

describe('the ladder, on you', () => {
  it('nothing that hits you takes a load or a blow from you', () => {
    const s = hall();
    give(s.game, 'pipe');
    hold(s, 0.5, { attack: true });
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.chg).toBeGreaterThan(0);
    for (const id of ['axe', 'baton']) {
      const t = hall();
      give(t.game, id);
      hold(t, 1.2, { attack: true });
      step(t, noInput());
      expect(t.hands.swing?.done).toBe(false);
      struck(t, MOVES.thresher.poise, { x: 12, z: 6 }); // enough to make you reel
      expect(t.hands.stag).toBeGreaterThan(0);
      expect(t.hands.swing).not.toBe(null);
    }
  });

  it('two husk blows close together and you reel: no new load, slow feet, thrown back from it; left alone, you recover', () => {
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
    /* given time, your poise comes back: one blow is shrugged off again */
    hold(s, 3);
    expect(s.hands.poise).toBe(POISE.you);
    struck(s, MOVES.husk.poise, { x: 12, z: 6 });
    expect(s.hands.stag).toBe(0);
  });
});

describe('the ladder, on them', () => {
  const husk = () => { const s = hall(b => b.mutant('husk', 11, 0, 6)); return { s, m: s.cast[0] }; };
  const full = (id: string, kind: 'blunt' | 'edge', mass: number) => ({ dmg: 1, poise: swingOf(kind, mass).poise, id });

  it('one axe blow staggers a husk; a baton takes two', () => {
    const axe = husk();
    hitMutant(axe.s, axe.m, full('axe', 'edge', 3.2), 1);
    expect(axe.m.reel).toBeGreaterThan(0);
    expect(axe.m.reel).toBeLessThan(2); // it reels for the stagger, not for however long it was held still before
    const baton = husk();
    hitMutant(baton.s, baton.m, full('baton', 'blunt', 1.1), 1);
    expect(baton.m.reel).toBe(0);
    hitMutant(baton.s, baton.m, full('baton', 'blunt', 1.1), 1);
    expect(baton.m.reel).toBeGreaterThan(0);
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
     the nearest steps into its reach. What these hold to is the design (engine.md §6): timed well, one husk is beaten.
     Two at once are meant to be a problem; with your blows never interrupted they are not yet (engine.md §6, F2 as
     built), and a test of it waits on the tuning. */
  function duel(weapon: string, husks: [number, number][], secs = 20) {
    const b = new LevelBuilder('hall', 'Hall');
    b.room('Hall', 0, 0, 20, 12, { ht: 4 });
    for (const [x, z] of husks) b.mutant('husk', x, 0, z);
    b.start(10, 6, -Math.PI / 2);
    const s = makeSim(b.finish(), { seed: 1 });
    give(s.game, weapon);
    /* hunting, and past running away: a husk below two fifths of its health may flee once, on a coin's toss, and a
       fight that ends in a chase is not what these test */
    for (const m of s.cast) { m.state = 'hunt'; m.fled = true; }
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
});
