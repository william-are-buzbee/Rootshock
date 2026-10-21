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

/* The opening (world.md §8): a new game's first minutes in the isolation suite, each beat saying one thing, in about
   ninety seconds. The wing's feed is days cut; you wake to your pump's alarm in the suite's low stutter, on its own
   failing set. At your door, the other patient sees you and bangs on the glass; the noise draws the night round's beam;
   they point it out to you and hide. It comes down, opens their door (green), strikes them twice where they hide and
   drags them on by an ankle, through rooms 3 and 4 to yours, each opened green and swept with its beam: whoever it finds,
   it takes. It goes up with them, and they are gone; ten seconds on the set dies: black, your lock letting go in the
   dark, and the suite's cells coming up. */

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
const lum = (s: Sim, name: string) => Math.max(...simLighting(s).room(s.world.rooms.find(R => R.name === name)!.id));
/** the plan position of a tile on the suite's deck (upper.ts's frame) */
const tile = (i: number, j: number) => ({ x: 2 * i - 10, z: 2 * j - 30 });
/** your window, from inside room 1: right at it (against the wall under it, crouched), or a step back; your washroom,
 *  its door shut behind you; and the corner of your room beside your door, against the same wall */
const WINDOW = { at: [25.15, 4.5], back: [24.5, 4.5] } as const, WASHROOM = [23.5, 7.8] as const, CORNER = [24.7, 3.3] as const;
/** stand you somewhere, facing east, out of your window across the hall */
function at(s: Sim, [i, j]: readonly [number, number], crouch = false): void {
  const b = s.player.body, p = tile(i, j);
  b.x = p.x; b.z = p.z; b.vx = b.vz = 0; b.sync();
  s.player.yaw = -Math.PI / 2; s.player.pitch = 0;
  if (crouch !== s.player.crouch) step(s, { ...noInput(), crouch: true });
}
/** the readers' beeps heard, and at which door (by its room's name, through the door's sign); and blows landing */
function beeps(s: Sim, into: string[]): void {
  for (const e of s.game.events) {
    if (e.type === 'sfx' && e.name === 'struck') into.push('struck');
    if (e.type !== 'sfx' || (e.name !== 'take' && e.name !== 'deny') || e.x === undefined) continue;
    const d = s.doors.find(q => q.def.card && Math.hypot((q.def.x0 + q.def.x1) / 2 - e.x!, (q.def.z0 + q.def.z1) / 2 - e.z!) < 0.5);
    if (d) into.push(roomBehind(s, d) + ':' + (e.name === 'take' ? 'green' : 'red'));
  }
}
/** the isolation room a door is the door of */
function roomBehind(s: Sim, d: Sim['doors'][number]): string {
  const D = d.def, cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2;
  for (const [dx, dz] of [[1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]]) { const n = s.world.roomAt(cx + dx, D.y0 + 0.5, cz + dz)?.name; if (n?.startsWith('Isolation room')) return n.slice(10); }
  return '?';
}

describe('the opening, as it plays out', () => {
  /* one game, played on from test to test (each a stretch of it, in order) */
  const { s, round, patient } = opening();
  const heard: string[] = [];
  let night = 0, began = 0;
  const play = (secs: number, done: () => boolean, inp: Partial<Input> = {}) => {
    for (let t = 0; t < secs && !done(); t += STEP) { step(s, { ...noInput(), ...inp }); beeps(s, heard); s.game.events.length = 0; }
    return done();
  };

  it('wakes in the dark: the suite on its own failing set, low and stuttering, the wing dead, the doors locked, your pump sounding', () => {
    expect(s.opening?.phase).toBe('wake');
    expect(power(s.game, 'ISO')).toBe(1);
    expect(power(s.game, 'SEC')).toBe(0); // the wing's feed, days cut
    const R = s.world.rooms.find(q => q.name === 'Isolation suite')!, c = simLighting(s).room(R.id);
    night = Math.max(...c);
    expect(night).toBeGreaterThan(0.03);
    expect(night).toBeLessThan(0.2); // low
    expect(c[0]).toBeGreaterThan(c[2] * 1.3); // and warm
    expect(R.flick).toBe(true);
    expect(lum(s, 'Security corridor')).toBe(0);
    expect(lum(s, "Nurses' station")).toBe(0);
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(true);
    s.game.events.length = 0;
    hold(s, 1.5);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'pump')).toBe(true);
    expect(roomOf(s, s.player.body)).toBe('Isolation room 1');
    expect(patient.state).toBe('wait');
  });

  it('stood at your door a few seconds, the other patient sees you and bangs on the glass; not before', () => {
    at(s, WINDOW.back);
    hold(s, OPENING.dwell - 1);
    expect(s.opening?.phase).toBe('wake');
    hold(s, 1.2);
    expect(s.opening?.phase).toBe('scene');
    expect(patient.state).toBe('bang');
    began = s.game.time;
  });

  it('the noise draws the night round\'s beam: they point it out to you and hide, before it comes down', () => {
    expect(play(10, () => patient.state === 'warn')).toBe(true);
    expect(s.game.time - began).toBeGreaterThan(2); // they banged a while first
    expect(roomOf(s, round)).toBe("Nurses' station"); // it is still up there, its beam on the hall
    expect(play(10, () => patient.state === 'hide')).toBe(true);
    expect(roomOf(s, round)).not.toBe('Isolation room 2');
    expect(play(20, () => roomOf(s, round) === 'Isolation suite')).toBe(true);
  });

  it('green at their door; struck twice where they hide, bleeding there, and limp, it drags them on by an ankle', () => {
    expect(play(30, () => patient.state === 'dragged')).toBe(true);
    expect(heard[0]).toBe('room 2:green');
    expect(heard.filter(h => h === 'struck').length).toBe(2);
    const hid = tile(34.3, 4.45);
    expect(s.pools.length).toBe(1);
    expect(Math.hypot(s.pools[0].x - hid.x, s.pools[0].z - hid.z)).toBeLessThan(0.8); // where they hid
    expect(round.drag).toBe(patient.id);
    expect(patient.dead).toBe(false); // alive, and taken
    expect(patient.rag?.limp).toBe(true);
    play(6, () => false);
    expect(Math.hypot(patient.x - round.x, patient.z - round.z)).toBeLessThan(2.5); // with it, wherever it goes
  });

  it('rooms 3, 4 and yours open green to its card, each swept with its beam; hidden in your washroom, it passes you by', () => {
    at(s, WASHROOM);
    expect(play(60, () => s.opening?.phase !== 'scene')).toBe(true);
    for (const r of ['room 3', 'room 4', 'room 1']) expect(heard).toContain(r + ':green');
    expect(heard.indexOf('room 1:green')).toBeGreaterThan(heard.indexOf('room 3:green')); // yours last
    expect(heard.some(h => h.endsWith(':red'))).toBe(false);
    expect(s.game.ended).toBeFalsy();
  });

  it('it goes up with them, and they are gone; ten seconds on, the set dies: black, and your lock lets go in the dark', () => {
    expect(s.opening?.phase).toBe('left');
    let wound = false;
    for (let t = 0; t < OPENING.fail + 1 && s.opening?.phase !== 'black'; t += STEP) { step(s, noInput()); wound ||= s.game.events.some(e => e.type === 'sfx' && e.name === 'winddown'); s.game.events.length = 0; }
    expect(s.opening?.phase).toBe('black');
    expect(wound).toBe(true);
    expect(s.game.time - began).toBeLessThan(95); // the whole of it, from their seeing you to the dark, in about ninety seconds
    expect(patient.away).toBe(true);
    expect(power(s.game, 'ISO')).toBe(0);
    hold(s, 0.1);
    expect(lum(s, 'Isolation suite')).toBe(0); // black
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(false);
  });

  it('then the suite\'s emergency cells come up: dim and cool, not dark; the wing stays dark', () => {
    expect(play(OPENING.black + 1, () => s.opening?.phase === 'done')).toBe(true);
    hold(s, 0.1);
    const c = simLighting(s).room(s.world.rooms.find(R => R.name === 'Isolation suite')!.id);
    expect(Math.max(...c)).toBeGreaterThan(0.03);
    expect(c[2]).toBeGreaterThan(c[0]); // cool
    expect(lum(s, 'Security corridor')).toBe(0);
    expect(roomOf(s, round)).not.toBe('Isolation suite');
  });
});

describe('hiding from it', () => {
  /** an opening played on until the night round is on its way to room 3's door, the last before yours; you put somewhere;
   *  then whether it takes you before it is done with your door */
  const toYourDoor = (place: (s: Sim) => void) => {
    const { s, round } = opening(11);
    at(s, WINDOW.back);
    until(s, 150, () => round.beat === 6);
    place(s);
    until(s, 40, () => round.beat > 7 || !!s.game.ended);
    return !!s.game.ended && !s.game.ended.win;
  };
  it('in your washroom, or crouched against the wall beside your door or under your window, its beam misses you; stood in your room, it takes you', () => {
    expect(toYourDoor(s => at(s, WINDOW.back))).toBe(true);
    expect(toYourDoor(s => at(s, WASHROOM))).toBe(false);
    expect(toYourDoor(s => at(s, CORNER, true))).toBe(false);
    expect(toYourDoor(s => at(s, WINDOW.at, true))).toBe(false); // as the other patient showed you
  });

  it('taken is the end: the game over, and how', () => {
    const { s, round } = opening(11);
    at(s, WINDOW.back);
    until(s, 150, () => round.beat === 6);
    s.game.events.length = 0;
    until(s, 40, () => !!s.game.ended);
    expect(s.game.ended?.win).toBe(false);
    expect(s.game.ended?.msg).toMatch(/ankle/);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'taken')).toBe(true);
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

  it('the pump goes on until you silence it, and tells you the date, and that it is on its battery', () => {
    const { s } = opening();
    const pump = s.usables.find(u => u.label?.() === 'Silence the pump')!;
    expect(pump).toBeDefined();
    s.game.events.length = 0;
    pump.act();
    expect(s.game.events.some(e => e.type === 'say' && /14 NOV/.test(e.text) && /MAINS FAIL/.test(e.text))).toBe(true);
    s.game.events.length = 0;
    hold(s, 5);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'pump')).toBe(false);
  });

  it('the suite\'s locks and readers are on its set, not the wing\'s feed; your door, like the rest, on a guard\'s card', () => {
    const { s } = opening();
    const F = s.doors.filter(q => q.def.failsafe);
    expect(F.length).toBe(4);
    for (const d of F) { expect(d.def.circuit).toBe('ISO'); expect(d.def.card).toBe('s'); }
    for (const R of s.world.rooms.filter(q => q.name.startsWith('Isolation') || (q.name === 'Washroom' && q.y0 < -4))) expect(R.circuit).toBe('ISO');
  });

  it('room 4 is walled off from the bay at the stair\'s foot', () => {
    const { s } = opening(), p = tile(30.6, 1.5), q = tile(32.4, 1.5);
    expect(s.world.raycast(p.x, -3.5, p.z, q.x, -3.5, q.z)).toBeLessThan(1);
  });
});

describe('without it', () => {
  it('a game not begun with the opening has the level as it leaves it: the set dead, the locks let go, the other patient gone', () => {
    const s = makeSim(level, { seed: 7, station: STATION });
    expect(s.opening).toBeNull();
    expect(power(s.game, 'ISO')).toBe(0);
    expect(power(s.game, 'SEC')).toBe(0);
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(false);
    expect(s.cast.find(q => q.type === 'patient')!.away).toBe(true);
    expect(lum(s, 'Isolation suite')).toBeGreaterThan(0.03); // its cells
  });

  it('the progression checker finishes from the opening\'s start, as from the level as it leaves it', () => {
    const { s } = opening(), r = checkProgress(s), after = checkProgress(makeSim(level, { seed: 7, station: STATION }));
    expect(Object.keys(r.goals).length).toBeGreaterThan(0);
    expect(r.goals).toEqual(after.goals);
    expect(r.softLocks).toEqual([]);
    expect(r.deadEnds).toEqual([]);
  });

  it('a save made in the middle of it, the other patient dragged and their blood on the floor, plays on the same', async () => {
    const { s, patient } = opening();
    at(s, WINDOW.back);
    until(s, 60, () => patient.state === 'dragged');
    hold(s, 1);
    const { load, save } = await import('../src/sim/save');
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    expect(a.opening?.phase).toBe(s.opening?.phase);
    expect(a.pools).toEqual(s.pools);
    hold(s, 6); hold(a, 6);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});
