import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, simLighting, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { power } from '../src/sim/game';
import { locked } from '../src/sim/movers';
import { checkProgress } from '../src/sim/progress';
import { OPENING } from '../src/sim/opening';
import { REEL } from '../src/sim/moves';
import type { Mutant } from '../src/sim/cast';

/* The opening (world.md §8): a new game's first minutes in the isolation suite. You wake on its night setting to your
   pump's alarm; looking out, the other patient sees you and bangs on the glass; the noise brings the night round down;
   it tries the doors with its card, takes the other patient out of sight, reads red at the clinical doors and twice at
   yours, and looks in if it sees you; it goes, and a while on the survivors cut the wing's feed and the suite's
   fail-safe locks let go. */

const level = buildUpper(STATION.ladders);
const opening = (seed = 7) => {
  const s = makeSim(level, { seed, station: STATION, opening: true });
  const round = s.cast.find(q => q.type === 'nightround')!, patient = s.cast.find(q => q.type === 'patient')!;
  for (const q of s.cast) if (q !== round && q !== patient) q.stun = 1e9; // the rest of the level held still: not theirs
  return { s, round, patient };
};
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
const until = (s: Sim, secs: number, done: () => boolean, inp: Partial<Input> = {}) => { for (let t = 0; t < secs && !done(); t += STEP) step(s, { ...noInput(), ...inp }); return done(); };
const roomOf = (s: Sim, m: { x: number; y: number; z: number }) => s.world.roomAt(m.x, m.y + 0.5, m.z)?.name;
const doorBy = (s: Sim, card: string) => s.doors.filter(d => d.def.card === card);
/** the plan position of a tile on the suite's deck (upper.ts's frame) */
const tile = (i: number, j: number) => ({ x: 2 * i - 10, z: 2 * j - 30 });
/** stand you somewhere in room 1, facing the window, and look out */
function at(s: Sim, i: number, j: number, crouch = false): void {
  const b = s.player.body, p = tile(i, j);
  b.x = p.x; b.z = p.z; b.vx = b.vz = 0; b.sync();
  s.player.yaw = -Math.PI / 2; s.player.pitch = 0; // east: out across the hall
  if (crouch !== s.player.crouch) step(s, { ...noInput(), crouch: true });
}
/** the readers' beeps heard, and at which door (by its card) */
function beeps(s: Sim, into: string[]): void {
  for (const e of s.game.events) {
    if (e.type !== 'sfx' || (e.name !== 'take' && e.name !== 'deny') || e.x === undefined) continue;
    const d = s.doors.find(q => q.def.card && Math.hypot((q.def.x0 + q.def.x1) / 2 - e.x!, (q.def.z0 + q.def.z1) / 2 - e.z!) < 0.5);
    if (d) into.push(d.def.card + ':' + (e.name === 'take' ? 'green' : 'red'));
  }
}

describe('the opening, as it plays out', () => {
  /* one game, played on from test to test (each a stretch of it, in order) */
  const { s, round, patient } = opening();
  const heard: string[] = [];
  let night = 0;
  const play = (secs: number, done: () => boolean, inp: Partial<Input> = {}) => {
    for (let t = 0; t < secs && !done(); t += STEP) { step(s, { ...noInput(), ...inp }); beeps(s, heard); s.game.events.length = 0; }
    return done();
  };

  it('wakes on the night setting: the wing live, your door held, the other patient\'s locked, your pump sounding', () => {
    expect(s.opening?.phase).toBe('wake');
    expect(power(s.game, 'SEC')).toBe(1); // on Ops' backup set, as the rest of the floor
    const c = simLighting(s).room(s.world.rooms.find(R => R.name === 'Isolation suite')!.id);
    night = Math.max(...c);
    expect(night).toBeGreaterThan(0.2);
    expect(night).toBeLessThan(0.5); // low
    expect(c[0]).toBeGreaterThan(c[2] * 1.5); // and warm
    for (const d of [...doorBy(s, 'hold'), ...doorBy(s, 's').filter(q => q.def.failsafe)]) expect(locked(d)).toBe(true);
    s.game.events.length = 0;
    hold(s, 1.5);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'pump')).toBe(true);
    expect(roomOf(s, s.player.body)).toBe('Isolation room 1');
    expect(patient.state).toBe('wait');
  });

  it('looking out of your window, the other patient sees you, and bangs on the glass; the noise brings the night round down', () => {
    at(s, 21, 3.4);
    hold(s, 0.2);
    expect(s.opening?.phase).toBe('scene');
    expect(patient.state).toBe('bang');
    expect(play(25, () => roomOf(s, round) === 'Isolation suite')).toBe(true);
  });

  it('tries the doors with its card: green at the other patient\'s, and it takes them, out of sight of your window', () => {
    expect(play(40, () => patient.dead)).toBe(true);
    expect(heard[0]).toBe('s:green');
    /* where they lie, from your window: through the glass and the hall, and nothing to see */
    const b = s.player.body, ey = b.y + 1.6;
    expect(s.world.raycast(b.x, ey, b.z, patient.x, patient.y + 0.4, patient.z, d => d.kind === 'body' || !!d.glass)).toBeLessThan(1);
    expect(roomOf(s, patient)).toBe('Isolation room 3');
  });

  it('red at the clinical doors, red twice at yours; and stood at your window, it comes to the glass and looks in', () => {
    expect(play(90, () => round.state === 'peer')).toBe(true);
    expect(heard.filter(h => h === 'med:red').length).toBe(2);
    expect(heard.filter(h => h === 'hold:red').length).toBe(2);
    /* its face at your glass: at the pane, on its side of it */
    expect(play(4, () => s.doors.some(d => d.def.glass && Math.hypot((d.def.x0 + d.def.x1) / 2 - round.x, (d.def.z0 + d.def.z1) / 2 - round.z) < 1))).toBe(true);
    expect(locked(doorBy(s, 'hold')[0])).toBe(true); // and it cannot get in
  });

  it('then it goes; a while on, the wing\'s feed is cut, the suite\'s locks let go, and its emergency lights come up', () => {
    expect(play(60, () => s.opening?.phase === 'left')).toBe(true);
    expect(power(s.game, 'SEC')).toBe(1);
    expect(play(OPENING.cut + 2, () => s.opening?.phase === 'done')).toBe(true);
    expect(s.game.station!.circuits.SEC.broken).toBe(true);
    hold(s, 0.1);
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(false);
    for (const d of doorBy(s, 'med')) expect(locked(d)).toBe(true); // fail-secure: the clinical doors stay shut
    const L = simLighting(s), id = (n: string) => s.world.rooms.find(R => R.name === n)!.id, lum = (n: string) => Math.max(...L.room(id(n)));
    expect(lum('Isolation suite')).toBeGreaterThan(0.03); // not black
    expect(lum('Isolation suite')).toBeLessThan(night / 3); // but well down from the night setting
    expect(lum('Security corridor')).toBe(0); // the wing is dark
    expect(roomOf(s, round)).not.toBe('Isolation suite');
  });
});

describe('hiding from it', () => {
  /** an opening fast-forwarded to the night round on its way to your door, you somewhere in room 1 or its washroom */
  const toYourDoor = (place: (s: Sim) => void) => {
    const { s, round } = opening(11);
    at(s, 21, 3.4); hold(s, 0.2);
    until(s, 150, () => round.beat === 6); // on its way to the treatment room, the last before yours
    place(s);
    let peered = false;
    until(s, 40, () => { peered ||= round.state === 'peer'; return round.beat > 7 || peered; });
    return peered;
  };
  it('crouched under the sill, against the wall, it does not see you; nor in the washroom', () => {
    expect(toYourDoor(s => at(s, 22.15, 3.5))).toBe(true); // stood there, it does
    expect(toYourDoor(s => at(s, 22.15, 3.5, true))).toBe(false);
    expect(toYourDoor(s => { const b = s.player.body, p = tile(20.5, 5.8); b.x = p.x; b.z = p.z; b.sync(); })).toBe(false);
  });
});

describe('waking', () => {
  it('you are weak a while: slow, and your legs will not run; try, and they go from under you a moment', () => {
    const { s } = opening();
    hold(s, 0.5, { forward: 1 });
    const slow = Math.hypot(s.player.body.vx, s.player.body.vz);
    expect(slow).toBeLessThan(3.2 * (OPENING.slow + 0.05));
    hold(s, 0.2, { forward: 1, run: true });
    expect(s.hands.stag).toBeGreaterThan(0);
    expect(s.hands.stag).toBeLessThanOrEqual(REEL.you);
    s.opening!.weak = 0;
    hold(s, 1, { forward: -1 }); hold(s, 0.5, { forward: 1 });
    expect(Math.hypot(s.player.body.vx, s.player.body.vz)).toBeGreaterThan(slow * 1.4);
  });

  it('the pump goes on until you silence it, and tells you the date', () => {
    const { s } = opening();
    s.player.yaw = Math.PI / 2; s.player.pitch = -0.3; // turned to the pump, as you wake
    const pump = s.usables.find(u => u.label?.() === 'Silence the pump')!;
    expect(pump).toBeDefined();
    s.game.events.length = 0;
    pump.act();
    expect(s.game.events.some(e => e.type === 'say' && /14 NOV/.test(e.text))).toBe(true);
    s.game.events.length = 0;
    hold(s, 5);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'pump')).toBe(false);
  });
});

describe('without it', () => {
  it('a game not begun with the opening has the level as it leaves it: the feed cut, the locks let go, the other patient dead in their corner', () => {
    const s = makeSim(level, { seed: 7, station: STATION });
    expect(s.opening).toBeNull();
    expect(power(s.game, 'SEC')).toBe(0);
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(false);
    const p = s.cast.find(q => q.type === 'patient')! as Mutant;
    expect(p.dead).toBe(true);
    expect(roomOf(s, p)).toBe('Isolation room 3');
  });

  it('the progression checker finishes from the opening\'s start, as from the level as it leaves it', () => {
    const { s } = opening(), r = checkProgress(s), after = checkProgress(makeSim(level, { seed: 7, station: STATION }));
    expect(Object.keys(r.goals).length).toBeGreaterThan(0);
    expect(r.goals).toEqual(after.goals);
    expect(r.softLocks).toEqual([]);
    expect(r.deadEnds).toEqual([]);
  });

  it('a save made in the middle of it plays on the same', async () => {
    const { s } = opening();
    at(s, 21, 3.4);
    hold(s, 20);
    const { load, save } = await import('../src/sim/save');
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    expect(a.opening?.phase).toBe(s.opening?.phase);
    hold(s, 6); hold(a, 6);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});
