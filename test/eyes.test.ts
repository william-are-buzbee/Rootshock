import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give, power } from '../src/sim/game';
import { EYES, soundZone } from '../src/sim/eyes';
import { hitMutant } from '../src/sim/cast';
import { doorAct, doorLabel, findUsable } from '../src/sim/interact';
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
    for (let t = 0; t < 10 && m.state === 'answer'; t += STEP) step(s, noInput());
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
    for (let t = 0; t < 24; t += STEP) { step(s, noInput()); nearest = Math.min(nearest, Math.hypot(h.x - sp.x, h.z - sp.z)); } // from the muster hall
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
  /** in the Operations corridor, in view of its north camera, between the operations office and maintenance */
  const setUp = () => {
    const s = fresh();
    still(s);
    place(s, 77, 0, 20);
    const near = (x: number, z: number) => s.doors.find(d => Math.abs((d.def.x0 + d.def.x1) / 2 - x) < 1 && Math.abs((d.def.z0 + d.def.z1) / 2 - z) < 1)!;
    return { s, office: near(73, 17), maint: near(81, 27) };
  };

  it('seen, the doors about you that have power are bolted: heard being drawn first, then shut and held', () => {
    const { s, office, maint } = setUp();
    s.game.events.length = 0;
    hold(s, EYES.hold + 0.2);
    expect(s.alarms.map(a => a.zone)).toContain('ops');
    expect(office.bolting).toBeGreaterThan(0); // the tell: you can still get through
    expect(maint.bolting).toBeGreaterThan(0);
    expect(sounded(s, 'bolt-draw')).toBe(true);
    hold(s, EYES.draw + 1);
    for (const d of [office, maint]) {
      expect(d.bolt).toBeGreaterThan(0);
      expect(doorLabel(s, d)).toBe('Bolted');
    }
    hold(s, 1);
    expect(office.t).toBeLessThan(0.05); // open at the start; bolted, it shut
    s.game.events.length = 0;
    doorAct(s, maint);
    expect(s.game.events.some(e => e.type === 'say' && /Bolted/.test(e.text))).toBe(true);
  });

  it('a bolt holds only with power behind it, and lets go when the alarm ends', () => {
    const { s, office, maint } = setUp();
    hold(s, EYES.hold + EYES.draw + 0.5);
    expect(maint.bolt).toBeGreaterThan(0);
    s.game.station!.circuits.OPS.back = false; s.lighting = null; // cut the power: the bolts go
    hold(s, 0.1);
    expect(maint.bolt).toBe(0);
    expect(office.bolt).toBe(0);
    const t = setUp();
    hold(t.s, EYES.hold + EYES.draw + 0.5);
    expect(t.maint.bolt).toBeGreaterThan(0);
    place(t.s, 30, -4.5, -25); // gone from its sight: the alarm runs down
    hold(t.s, EYES.sound + 1);
    expect(t.s.alarms).toEqual([]);
    expect(t.maint.bolt).toBe(0);
  });
});

describe('the overseer\'s own door', () => {
  const keep = (s: Sim) => s.doors.find(d => d.def.keep)!;
  const sw = (s: Sim) => s.usables.find(u => /Breaker, Operations room/.test(u.label() ?? ''))!;

  it('it holds its door bolted from inside for as long as it has power: no card, no code, no way through', () => {
    const s = fresh(), d = keep(s);
    still(s);
    hold(s, 0.1);
    expect(d.def.circuit).toBe('CTL');
    expect(d.bolt).toBeGreaterThan(0);
    expect(doorLabel(s, d)).toBe('Bolted');
    hold(s, EYES.sound + 2); // no alarm, and it holds anyway
    expect(d.bolt).toBeGreaterThan(0);
    s.game.events.length = 0;
    doorAct(s, d);
    expect(s.game.events.some(e => e.type === 'say' && /Bolted from the inside/.test(e.text))).toBe(true);
  });

  it('its switch is at the hall\'s far end: opened, the bolt lets go, the east bays go dark, and the door slides', () => {
    const s = fresh(), d = keep(s);
    still(s);
    hold(s, 0.1);
    const u = sw(s);
    expect(u.label()).toBe('Breaker, Operations room: closed');
    expect(Math.hypot(u.x - (d.def.x0 + d.def.x1) / 2, u.z - (d.def.z0 + d.def.z1) / 2)).toBeGreaterThan(50); // across the hall
    s.game.events.length = 0;
    u.act();
    hold(s, 0.1);
    expect(d.bolt).toBe(0);
    expect(sounded(s, 'bolt-free')).toBe(true);
    expect(doorLabel(s, d)).toBe('Slide the door open');
    const east = s.cams.filter(c => c.def.circuit === 'CTL');
    expect(east.length).toBe(2);
    for (const c of east) expect(power(s.game, c.def.circuit)).toBe(0); // its eyes on the east bays, dark with them
    u.act(); // closed again: it takes the door back
    hold(s, 0.1);
    expect(d.bolt).toBeGreaterThan(0);
  });

  it('killed, it lets its door go', () => {
    const s = fresh(), d = keep(s), o = s.cast.find(m => m.ai === 'overseer')!;
    still(s);
    hold(s, 0.1);
    hitMutant(s, o, { dmg: 10000, stun: 0 }, 1);
    hold(s, 0.2);
    expect(d.bolt).toBe(0);
  });

  it('a save keeps it bolted, and opened', () => {
    const s = fresh();
    still(s);
    hold(s, 0.1);
    sw(s).act();
    hold(s, 0.1);
    const t = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(t, 0.1);
    expect(keep(t).bolt).toBe(0);
    expect(keep(fresh()).bolt).toBe(0); // not yet stepped
  });
});

describe('the electrical room\'s board', () => {
  const brk = (s: Sim, name: string) => s.usables.find(u => new RegExp('Breaker, ' + name).test(u.label() ?? ''))!;

  it('breaks Ops out to the muster hall, the operations room and the PA, each on its own breaker, side by side', () => {
    const s = fresh(), b = ['Muster hall', 'Operations room', 'Security PA'].map(n => brk(s, n));
    for (const u of b) expect(u.label()).toMatch(/: closed$/);
    expect(Math.max(...b.map(u => Math.hypot(u.x - b[0].x, u.z - b[0].z)))).toBeLessThan(4);
  });

  it('the hall\'s breaker darkens it and its own cameras, and its speaker with them; the overseer\'s keep its power', () => {
    const s = fresh();
    still(s);
    brk(s, 'Muster hall').act();
    const hall = s.cams.filter(c => c.def.zone === 'muster');
    expect(hall.length).toBe(4);
    for (const c of hall) expect(power(s.game, c.def.circuit)).toBe(0);
    expect(s.cams.filter(c => c.def.circuit === 'CTL').every(c => power(s.game, c.def.circuit) === 1)).toBe(true);
    soundZone(s, 'muster'); // sounded otherwise than by being seen: with no power at its speaker, not at all
    expect(s.alarms).toEqual([]);
  });

  it('the PA\'s breaker takes every zone\'s voice: seen, the doors are still bolted, but no klaxon and nothing comes', () => {
    const s = fresh(), h = s.cast.find(m => m.type === 'hand')!;
    for (const q of s.cast) if (q !== h) q.stun = 1e9;
    brk(s, 'Security PA').act();
    inView(s);
    s.game.events.length = 0;
    hold(s, EYES.hold + 0.3);
    expect(s.alarms.map(a => a.zone)).toEqual(['atrium']); // it saw you
    hold(s, 2);
    expect(sounded(s, 'klaxon')).toBe(false);
    expect(h.state).not.toBe('go');
  });

  it('cut while a zone sounds, its klaxon stops at its next round', () => {
    const s = fresh();
    still(s);
    place(s, 30, -4.5, -25);
    soundZone(s, 'atrium');
    hold(s, 2);
    brk(s, 'Security PA').act();
    s.game.events.length = 0;
    hold(s, 3);
    expect(sounded(s, 'klaxon')).toBe(false);
  });
});

describe('a smashed speaker', () => {
  /** look at a thing from where you stand */
  const lookAt = (s: Sim, x: number, y: number, z: number) => {
    const p = s.player, b = p.body, dx = x - b.x, dz = z - b.z, dy = y - (b.y + 1.6);
    p.yaw = Math.atan2(-dx, -dz); p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
  };
  const speakerUse = (s: Sim, zone: string) => {
    const S = level.speakers!.find(q => q.zone === zone)!;
    return s.usables.find(u => u.x === S.x && u.z === S.z && u.y > S.y + 3)!;
  };

  it('the Operations corridor\'s (the overseer\'s zone) is in reach from the floor; smashing it takes something in your hand, and is loud', () => {
    const s = fresh(), u = speakerUse(s, 'ops');
    still(s);
    place(s, 77, 0, 20.6);
    hold(s, 0.1);
    lookAt(s, u.x, u.y, u.z);
    expect(findUsable(s)?.text).toBe('Smash the speaker');
    u.act();
    expect(s.mute).toEqual([]); // bare hands
    give(s.game, 'baton');
    s.game.noiseI = 0;
    u.act();
    expect(s.mute).toEqual(['ops']);
    expect(s.game.noiseI).toBeGreaterThanOrEqual(14);
    expect(u.label()).toBeNull();
  });

  it('the atrium\'s hangs high in the well: out of reach from the floor, in reach leaning from the gallery\'s rail', () => {
    const s = fresh(), u = speakerUse(s, 'atrium');
    still(s);
    place(s, u.x, 0, u.z);
    hold(s, 0.1);
    lookAt(s, u.x, u.y, u.z);
    expect(findUsable(s)?.text).not.toBe('Smash the speaker');
    place(s, 84.5, 5, u.z); // on the east gallery, at the rail
    hold(s, 0.1);
    expect(s.player.body.x).toBeGreaterThan(84);
    lookAt(s, u.x, u.y, u.z);
    expect(findUsable(s)?.text).toBe('Smash the speaker');
  });

  it('not from the deck above: only from under it', () => {
    const s = fresh(), u = speakerUse(s, 'ops');
    s.player.body.y = 5;
    expect(u.label()).toBeNull();
  });

  it('the zone has no voice: seen there, the doors are still bolted, but no klaxon, and nothing comes', () => {
    const s = fresh(), h = s.cast.find(m => m.type === 'hand')!, m = s.cast[1];
    for (const q of s.cast) if (q !== h && q !== m) q.stun = 1e9;
    s.mute.push('ops');
    place(s, 77, 0, 20); // in view of the corridor's north camera
    s.game.events.length = 0;
    hold(s, EYES.hold + 0.3);
    expect(s.alarms.map(a => a.zone)).toEqual(['ops']); // it saw you
    expect(s.doors.some(d => d.bolting > 0 || d.bolt > 0)).toBe(true); // and its bolts are its own
    hold(s, 2);
    expect(sounded(s, 'klaxon')).toBe(false);
    expect(m.state).not.toBe('answer');
    expect(h.state).not.toBe('go');
    /* sounded any other way, it does not sound at all */
    const t = fresh();
    t.mute.push('wing');
    soundZone(t, 'wing');
    expect(t.alarms).toEqual([]);
  });

  it('smashed while it sounds, the klaxon stops at its next round', () => {
    const s = fresh();
    still(s);
    place(s, 30, -4.5, -25);
    soundZone(s, 'atrium');
    hold(s, 2);
    s.mute.push('atrium');
    s.game.events.length = 0;
    hold(s, 3);
    expect(sounded(s, 'klaxon')).toBe(false);
  });

  it('a save keeps it smashed', () => {
    const s = fresh();
    s.mute.push('ops');
    const t = load(level, save(s), { station: STATION });
    expect(t.mute).toEqual(['ops']);
  });
});
