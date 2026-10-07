import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give } from '../src/sim/game';
import { EYES, soundZone } from '../src/sim/eyes';
import { hitMutant } from '../src/sim/cast';
import { doorAct, doorLabel } from '../src/sim/interact';
import { load, save } from '../src/sim/save';

/* The overseer's eyes and voice (sim/eyes.ts), on the upper station: cameras that hold you sound their zone, and the
   husks that hear it come to it. */

const level = buildUpper(STATION.ladders);
const fresh = () => makeSim(level, { seed: 7, station: STATION });
const hold = (s: Sim, secs: number) => { for (let t = 0; t < secs; t += STEP) step(s, noInput()); };
const place = (s: Sim, x: number, y: number, z: number) => { const b = s.player.body; b.x = x; b.y = y; b.z = z; b.vy = 0; b.sync(); };
const sounded = (s: Sim, name: string) => s.game.events.some(e => e.type === 'sfx' && e.name === name);
/** the camera on the atrium's threshold, from its south-west corner, looking north */
const threshold = (s: Sim) => s.cams.find(c => c.def.zone === 'atrium' && Math.abs(c.def.yaw - Math.PI) < 0.01)!;
const still = (s: Sim) => { for (const m of s.cast) m.stun = 1e9; };
/** in the atrium, some way north of that camera and in its view */
const inView = (s: Sim) => { const C = threshold(s).def; place(s, C.x, 0, C.z - 7); };

describe('cameras', () => {
  it('a live camera that holds you a moment sounds its zone: its light, then the klaxon', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    s.game.events.length = 0;
    hold(s, 0.5);
    expect(c.hold).toBeGreaterThan(0); // it has you: the light is red, the servo heard
    expect(sounded(s, 'cam')).toBe(true);
    expect(s.alarms).toEqual([]);
    hold(s, EYES.hold);
    expect(s.alarms.map(a => a.zone)).toEqual(['atrium']);
    expect(sounded(s, 'klaxon')).toBe(true);
  });

  it('step out of its view in time and nothing sounds', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    hold(s, EYES.hold * 0.6);
    expect(c.hold).toBeGreaterThan(0);
    place(s, 61, 0, -1); // back into the dark corridor
    hold(s, 2);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });

  it('a dead camera sees nothing, and neither does a smashed one; smashing takes something in your hand, and is loud', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    s.game.station!.circuits.OPS.back = false; s.lighting = null; // Ops' set stopped
    inView(s);
    hold(s, 3);
    expect(s.alarms).toEqual([]);
    s.game.station!.circuits.OPS.back = true; s.lighting = null;
    const smash = s.usables.find(u => u.x === c.def.x && u.z === c.def.z)!;
    smash.act();
    expect(c.broken).toBe(false); // bare hands
    give(s.game, 'baton');
    s.game.noiseI = 0;
    smash.act();
    expect(c.broken).toBe(true);
    expect(s.game.noiseI).toBeGreaterThanOrEqual(14);
    expect(smash.label()).toBeNull();
    hold(s, 3);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });
});

describe('the zone alarm', () => {
  it('husks in earshot answer it: they go to the speaker, not to you', () => {
    const s = fresh(), m = s.cast[1]; // on its rounds in the Operations corridor
    for (const q of s.cast) if (q !== m) q.stun = 1e9;
    place(s, 30, -4.5, -25); // you are a storey down in the suite, far out of its sight and hearing
    hold(s, 0.2);
    soundZone(s, 'atrium');
    hold(s, 0.1);
    expect(m.state).toBe('answer');
    const sp = level.speakers!.find(q => q.zone === 'atrium')!;
    hold(s, 8);
    expect(Math.hypot(m.x - sp.x, m.z - sp.z)).toBeLessThan(3.5);
    expect(m.state).toBe('idle'); // there, it stands and looks about; it never came for you
    const x = m.x, z = m.z;
    hold(s, 4);
    expect(Math.hypot(m.x - x, m.z - z)).toBeLessThan(0.2); // a while, before its rounds again
  });

  it('dies away after a while, and sounding it again starts it over', () => {
    const s = fresh();
    still(s);
    soundZone(s, 'ops');
    hold(s, EYES.sound - 2);
    soundZone(s, 'ops');
    hold(s, 4);
    expect(s.alarms.map(a => a.zone)).toEqual(['ops']);
    hold(s, EYES.sound);
    expect(s.alarms).toEqual([]);
  });

  it('mending the wing\'s cut sounds the wing: its circuit comes live on Security\'s board', () => {
    const s = fresh();
    still(s);
    give(s.game, 'kit');
    s.usables.find(u => /Service connection, Security wing/.test(u.label() ?? ''))!.act();
    expect(s.alarms.map(a => a.zone)).toEqual(['wing']);
  });

  it('a save made while an alarm sounds and a husk answers it plays on the same', () => {
    const s = fresh();
    for (const q of s.cast) if (q !== s.cast[1]) q.stun = 1e9;
    place(s, 30, -4.5, -25);
    hold(s, 0.2);
    soundZone(s, 'atrium');
    hold(s, 2);
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(s, 3); hold(a, 3);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});

describe('the overseer and its hand', () => {
  const hand = (s: Sim) => s.cast.find(m => m.type === 'hand')!;
  const overseer = (s: Sim) => s.cast.find(m => m.ai === 'overseer')!;
  const putM = (m: Sim['cast'][number], x: number, y: number, z: number) => { const b = m.body!; b.x = m.x = x; b.y = m.y = y; b.z = m.z = z; b.sync(); };

  it('the hand hears every alarm, wherever it is, and goes to it by the halls, at a run', () => {
    const s = fresh(), h = hand(s), m = s.cast[1], reach = EYES.reach;
    for (const q of s.cast) if (q !== h && q !== m) q.stun = 1e9;
    place(s, 30, -4.5, -25); // you, a storey down, out of it
    hold(s, 0.3);
    EYES.reach = 4; // the alarm barely carries: no husk hears it from the corridor
    try {
      soundZone(s, 'atrium');
      hold(s, 0.1);
    } finally { EYES.reach = reach; }
    expect(m.state).not.toBe('answer');
    expect(h.state).toBe('go'); // the hand hears it anyway
    const sp = level.speakers!.find(q => q.zone === 'atrium')!;
    let nearest = Infinity;
    for (let t = 0; t < 14; t += STEP) { step(s, noInput()); nearest = Math.min(nearest, Math.hypot(h.x - sp.x, h.z - sp.z)); }
    expect(nearest).toBeLessThan(3); // there, it keeps the place: wanders it, and charges about it
  });

  it('a save made with the hand on its way to an alarm plays on the same', () => {
    const s = fresh();
    for (const q of s.cast) if (q.type !== 'hand') q.stun = 1e9;
    place(s, 30, -4.5, -25);
    hold(s, 0.3);
    soundZone(s, 'atrium');
    hold(s, 1.5);
    expect(hand(s).state).toBe('go');
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(s, 3); hold(a, 3);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });

  it('it is too big for a door: an alarm it cannot reach by the halls leaves it where it is', () => {
    const s = fresh(), h = hand(s);
    for (const q of s.cast) if (q !== h) q.stun = 1e9;
    place(s, 30, -4.5, -25);
    putM(h, 24, 0, 2); // in the lobby, behind its door
    hold(s, 0.3);
    soundZone(s, 'atrium');
    hold(s, 2);
    expect(h.state).not.toBe('go');
  });

  it('the overseer sees you itself and sounds its zone, and lashes what comes near', () => {
    const s = fresh(), o = overseer(s);
    for (const q of s.cast) if (q !== o) q.stun = 1e9;
    place(s, o.x, 0, o.z - 3.4);
    hold(s, 0.5);
    expect(s.alarms.map(a => a.zone)).toContain('ops');
    const hp = s.game.hp;
    place(s, o.x, 0, o.z - 1.9);
    hold(s, 1.5);
    expect(s.game.hp).toBeLessThan(hp);
  });

  it('killed, the cameras go dark for good, the alarm dies, and none sounds again', () => {
    const s = fresh(), o = overseer(s), c = threshold(s);
    still(s);
    soundZone(s, 'atrium');
    hold(s, 0.5);
    hitMutant(s, o, { dmg: 10000, stun: 0 }, 1);
    s.game.events.length = 0;
    hold(s, 0.2);
    expect(o.dead).toBe(true);
    expect(s.alarms).toEqual([]);
    expect(s.game.events.some(e => e.type === 'say' && /camera lights go out/.test(e.text))).toBe(true);
    inView(s);
    hold(s, 3);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
    soundZone(s, 'wing');
    expect(s.alarms).toEqual([]);
  });
});

describe('the overseer\'s bolts', () => {
  /** in the Operations corridor, in view of its north camera, between the logistics office and maintenance */
  const setUp = () => {
    const s = fresh();
    still(s);
    place(s, 77, 0, 20);
    const near = (x: number) => s.doors.find(d => Math.abs((d.def.x0 + d.def.x1) / 2 - x) < 1 && Math.abs((d.def.z0 + d.def.z1) / 2 - 27) < 1)!;
    return { s, logistics: near(73), maint: near(81) };
  };

  it('seen, the doors about you that have power are bolted: heard being drawn first, then shut and held', () => {
    const { s, logistics, maint } = setUp();
    s.game.events.length = 0;
    hold(s, EYES.hold + 0.2);
    expect(s.alarms.map(a => a.zone)).toContain('ops');
    expect(logistics.bolting).toBeGreaterThan(0); // the tell: you can still get through
    expect(maint.bolting).toBeGreaterThan(0);
    expect(sounded(s, 'bolt-draw')).toBe(true);
    hold(s, EYES.draw + 1);
    for (const d of [logistics, maint]) {
      expect(d.bolt).toBeGreaterThan(0);
      expect(doorLabel(s, d)).toBe('Bolted');
    }
    hold(s, 1);
    expect(logistics.t).toBeLessThan(0.05); // open at the start; bolted, it shut
    s.game.events.length = 0;
    doorAct(s, maint);
    expect(s.game.events.some(e => e.type === 'say' && /Bolted/.test(e.text))).toBe(true);
  });

  it('a bolt holds only with power behind it, and lets go when the alarm ends', () => {
    const { s, logistics, maint } = setUp();
    hold(s, EYES.hold + EYES.draw + 0.5);
    expect(maint.bolt).toBeGreaterThan(0);
    s.game.station!.circuits.OPS.back = false; s.lighting = null; // cut the power: the bolts go
    hold(s, 0.1);
    expect(maint.bolt).toBe(0);
    expect(logistics.bolt).toBe(0);
    const t = setUp();
    hold(t.s, EYES.hold + EYES.draw + 0.5);
    expect(t.maint.bolt).toBeGreaterThan(0);
    place(t.s, 30, -4.5, -25); // gone from its sight: the alarm runs down
    hold(t.s, EYES.sound + 1);
    expect(t.s.alarms).toEqual([]);
    expect(t.maint.bolt).toBe(0);
  });
});
