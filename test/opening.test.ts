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
   ninety seconds. You wake on its night setting to your pump's alarm. At your door, the other patient sees you and bangs
   on the glass; the noise draws the night round's beam; they point it out to you, put their light out and hide. It comes
   down, opens their door (green), and at its touch they go limp; it drags them on, through rooms 3 and 4 (green, and it
   looks in) to yours: red, red. It looks in if it sees you. It goes up with them, and they are gone; ten seconds on the
   survivors cut the wing's feed: black, your lock letting go in the dark, and the suite's cells coming up. */

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
/** your window, from inside room 1: right at it (against the wall under it, crouched), or a step back */
const WINDOW = { at: [25.15, 4.5], back: [24.5, 4.5] } as const;
/** stand you somewhere, facing east, out of your window across the hall */
function at(s: Sim, [i, j]: readonly [number, number], crouch = false): void {
  const b = s.player.body, p = tile(i, j);
  b.x = p.x; b.z = p.z; b.vx = b.vz = 0; b.sync();
  s.player.yaw = -Math.PI / 2; s.player.pitch = 0;
  if (crouch !== s.player.crouch) step(s, { ...noInput(), crouch: true });
}
/** the readers' beeps heard, and at which door (by its room's name, through the door's sign) */
function beeps(s: Sim, into: string[]): void {
  for (const e of s.game.events) {
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

  it('wakes on the night setting: the wing live, your door held, the other doors locked, your pump sounding', () => {
    expect(s.opening?.phase).toBe('wake');
    expect(power(s.game, 'SEC')).toBe(1); // on Ops' backup set, as the rest of the floor
    const c = simLighting(s).room(s.world.rooms.find(R => R.name === 'Isolation suite')!.id);
    night = Math.max(...c);
    expect(night).toBeGreaterThan(0.2);
    expect(night).toBeLessThan(0.5); // low
    expect(c[0]).toBeGreaterThan(c[2] * 1.5); // and warm
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

  it('the noise draws the night round\'s beam: they point it out to you, put their light out and hide, before it comes down', () => {
    expect(play(10, () => patient.state === 'warn')).toBe(true);
    expect(s.game.time - began).toBeGreaterThan(2); // they banged a while first
    expect(roomOf(s, round)).toBe("Nurses' station"); // it is still up there, its beam on the hall
    expect(play(10, () => patient.state === 'hide')).toBe(true);
    expect(s.game.station!.circuits.ISO2.on).toBe(false);
    expect(lum(s, 'Isolation room 2')).toBe(0); // dark: and the cells do not come on for a switch
    expect(roomOf(s, round)).not.toBe('Isolation room 2');
    expect(play(20, () => roomOf(s, round) === 'Isolation suite')).toBe(true);
  });

  it('green at their door; at its touch they go limp, and it drags them on by an ankle', () => {
    expect(play(30, () => patient.state === 'dragged')).toBe(true);
    expect(heard[0]).toBe('room 2:green');
    expect(round.drag).toBe(patient.id);
    expect(patient.dead).toBe(false); // alive, and taken
    expect(patient.rag?.limp).toBe(true);
    play(6, () => false);
    expect(Math.hypot(patient.x - round.x, patient.z - round.z)).toBeLessThan(2.5); // with it, wherever it goes
  });

  it('rooms 3 and 4 open to its card and it looks in; yours reads red, twice; stood at your window, it comes and looks in at you', () => {
    at(s, WINDOW.at);
    expect(play(60, () => round.state === 'peer')).toBe(true);
    for (const r of ['room 3', 'room 4']) expect(heard).toContain(r + ':green');
    expect(heard.filter(h => h === 'room 1:red').length).toBe(2);
    expect(heard.indexOf('room 1:red')).toBeGreaterThan(heard.indexOf('room 3:green')); // yours last
    /* its face at your glass: at the pane, on its side of it; and it cannot get in */
    expect(play(4, () => s.doors.some(d => d.def.glass && Math.hypot((d.def.x0 + d.def.x1) / 2 - round.x, (d.def.z0 + d.def.z1) / 2 - round.z) < 1))).toBe(true);
    expect(locked(s.doors.find(d => d.def.card === 'hold')!)).toBe(true);
  });

  it('it goes up with them, and they are gone; ten seconds on, everything goes black, and your lock lets go in the dark', () => {
    expect(play(40, () => s.opening?.phase === 'left')).toBe(true);
    expect(play(OPENING.cut + 1, () => s.opening?.phase === 'black')).toBe(true);
    expect(s.game.time - began).toBeLessThan(95); // the whole of it, from their seeing you to the cut, in about ninety seconds
    expect(patient.away).toBe(true);
    expect(s.game.station!.circuits.SEC.broken).toBe(true);
    hold(s, 0.1);
    expect(lum(s, 'Isolation suite')).toBe(0); // black
    for (const d of s.doors.filter(q => q.def.failsafe)) expect(locked(d)).toBe(false);
  });

  it('then the suite\'s emergency cells come up: dim and cool, not dark; the wing stays dark', () => {
    expect(play(OPENING.black + 1, () => s.opening?.phase === 'done')).toBe(true);
    hold(s, 0.1);
    expect(lum(s, 'Isolation suite')).toBeGreaterThan(0.03);
    expect(lum(s, 'Isolation suite')).toBeLessThan(night / 3);
    expect(lum(s, 'Security corridor')).toBe(0);
    expect(roomOf(s, round)).not.toBe('Isolation suite');
  });
});

describe('hiding from it', () => {
  /** an opening played on until the night round is on its way to room 3's door, the last before yours; you put somewhere;
   *  then whether it looks in at you before it is done with your door */
  const toYourDoor = (place: (s: Sim) => void) => {
    const { s, round } = opening(11);
    at(s, WINDOW.back);
    until(s, 150, () => round.beat === 6);
    place(s);
    let peered = false;
    until(s, 40, () => { peered ||= round.state === 'peer'; return round.beat > 7 || peered; });
    return peered;
  };
  it('crouched under the sill against the wall, or in your washroom, it does not see you; stood there, it does', () => {
    expect(toYourDoor(s => at(s, WINDOW.at))).toBe(true);
    expect(toYourDoor(s => at(s, WINDOW.at, true))).toBe(false);
    expect(toYourDoor(s => { const b = s.player.body, p = tile(23.5, 7.8); b.x = p.x; b.z = p.z; b.sync(); })).toBe(false);
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
    const pump = s.usables.find(u => u.label?.() === 'Silence the pump')!;
    expect(pump).toBeDefined();
    s.game.events.length = 0;
    pump.act();
    expect(s.game.events.some(e => e.type === 'say' && /14 NOV/.test(e.text))).toBe(true);
    s.game.events.length = 0;
    hold(s, 5);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'pump')).toBe(false);
  });

  it('your light switch puts your room out, and its cells stay dark while the wing has power', () => {
    const { s } = opening();
    const sw = s.usables.find(u => u.label?.() === 'Light switch: on')!;
    expect(sw).toBeDefined();
    const was = lum(s, 'Isolation room 1');
    sw.act();
    hold(s, 0.1);
    expect(was).toBeGreaterThan(0.2);
    expect(lum(s, 'Isolation room 1')).toBe(0);
    expect(sw.label?.()).toBe('Light switch: off');
    /* and only your light: your door's lock is on the wing's feed, and holds (it once let go, and the night round came in) */
    for (const d of s.doors.filter(q => q.def.failsafe)) { expect(d.def.circuit).toBe('SEC'); expect(locked(d)).toBe(true); }
  });
});

describe('without it', () => {
  it('a game not begun with the opening has the level as it leaves it: the feed cut, the locks let go, the other patient gone', () => {
    const s = makeSim(level, { seed: 7, station: STATION });
    expect(s.opening).toBeNull();
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

  it('a save made in the middle of it, the other patient dragged, plays on the same', async () => {
    const { s, patient } = opening();
    at(s, WINDOW.back);
    until(s, 60, () => patient.state === 'dragged');
    hold(s, 1);
    const { load, save } = await import('../src/sim/save');
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    expect(a.opening?.phase).toBe(s.opening?.phase);
    hold(s, 6); hold(a, 6);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});
