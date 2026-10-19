import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give, power } from '../src/sim/game';
import { EYES, soundZone } from '../src/sim/eyes';
import { doorAct, findUsable } from '../src/sim/interact';
import { load, save } from '../src/sim/save';

/* Security's eyes and voice (sim/eyes.ts), on the upper station: cameras that hold you sound their zone, and the
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

describe('the operations room', () => {
  it('its door is grown shut: no way in on the first pass', () => {
    const s = fresh();
    const d = s.doors.find(q => q.def.seal && !q.def.glass && Math.abs(q.def.y0 - 5) < 0.1)!;
    expect(d).toBeTruthy();
    s.game.events.length = 0;
    doorAct(s, d);
    expect(s.game.events.some(e => e.type === 'say' && /Bodies/.test(e.text))).toBe(true);
  });
});

describe('the power-failure drill', () => {
  const brk = (s: Sim, name: string) => s.usables.find(u => new RegExp('Breaker, ' + name).test(u.label() ?? ''))!;
  /** a husk on its rounds put in the hall's east bays, which have their own breaker; everything else still */
  const setUp = () => {
    const s = fresh(), m = s.cast.find(q => q.ai === 'husk' && !q.post)!;
    for (const q of s.cast) if (q !== m) q.stun = 1e9;
    place(s, 30, -4.5, -25); // you, out of it all, a storey down
    const b = m.body!; b.x = m.x = 70; b.y = m.y = 0; b.z = m.z = 36; b.sync();
    hold(s, 0.2);
    return { s, m };
  };

  it('those an opened breaker leaves in the dark are each given a time to go, within three minutes; posts and the lit are not', () => {
    const { s, m } = setUp();
    brk(s, 'Muster hall east').act();
    expect(s.drills.length).toBe(1);
    const D = s.drills[0];
    expect(D.c).toBe('EAST');
    const post = s.cast.find(q => q.post && q.y > 4)!; // the one kept at the grown door, in the dark with it
    expect(D.due.map(e => e.id)).toContain(m.id);
    expect(D.due.map(e => e.id)).not.toContain(post.id);
    for (const e of D.due) {
      expect(e.at).toBeGreaterThan(0);
      expect(e.at).toBeLessThanOrEqual(180);
      const q = s.cast[e.id];
      expect(s.world.roomAt(q.x, q.y + 0.5, q.z)?.circuit).toBe('EAST'); // every one of them caught by this breaker
    }
  });

  it('one sent goes to the board and throws the breaker back on, and it is heard', () => {
    const { s, m } = setUp();
    brk(s, 'Muster hall east').act();
    for (const e of s.drills[0].due) e.at = e.id === m.id ? 0.3 : 1e9;
    hold(s, 0.5);
    expect(m.state).toBe('fix');
    s.game.events.length = 0;
    let back = false;
    for (let t = 0; t < 90 && !back; t += STEP) { step(s, noInput()); back = s.game.station!.circuits.EAST.on; }
    expect(back).toBe(true);
    expect(sounded(s, 'clang')).toBe(true);
    expect(s.drills).toEqual([]);
  });

  it('one who reaches the light has stopped noticing: the breaker stays open', () => {
    const { s, m } = setUp();
    brk(s, 'Muster hall east').act();
    const b = m.body!; b.x = m.x = 30; b.z = m.z = 36; b.sync(); // into the lit west end
    for (const e of s.drills[0].due) e.at = e.id === m.id ? 0.3 : 1e9;
    hold(s, 1);
    expect(m.state).not.toBe('fix');
    expect(s.game.station!.circuits.EAST.on).toBe(false);
  });

  it('a save made while one goes to the board plays on the same', () => {
    const { s, m } = setUp();
    brk(s, 'Muster hall east').act();
    for (const e of s.drills[0].due) e.at = e.id === m.id ? 0.3 : 1e9;
    hold(s, 2);
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(s, 3); hold(a, 3);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});

describe('the electrical room\'s board', () => {
  const brk = (s: Sim, name: string) => s.usables.find(u => new RegExp('Breaker, ' + name).test(u.label() ?? ''))!;

  it('breaks Ops out to the hall and its east bays, side by side; its schedule says the operations room and the PA are not on it', () => {
    const s = fresh(), b = ['Muster hall west', 'Muster hall east'].map(n => brk(s, n));
    for (const u of b) expect(u.label()).toMatch(/: closed$/);
    expect(Math.hypot(b[1].x - b[0].x, b[1].z - b[0].z)).toBeLessThan(4);
    expect(s.usables.filter(u => /^Breaker, /.test(u.label() ?? '')).length).toBe(2);
    const sched = s.usables.find(u => u.label() === 'Read the panel schedule')!;
    s.game.events.length = 0;
    sched.act();
    expect(s.game.events.some(e => e.type === 'say' && /CRITICAL LOADS.*NOT ON THIS BOARD/.test(e.text))).toBe(true);
  });

  it('the hall\'s breaker darkens it and its own cameras; the east bays keep theirs, and its speaker still sounds', () => {
    const s = fresh();
    still(s);
    brk(s, 'Muster hall west').act();
    const hall = s.cams.filter(c => c.def.zone === 'muster');
    expect(hall.length).toBe(4);
    for (const c of hall) expect(power(s.game, c.def.circuit)).toBe(0);
    expect(s.cams.filter(c => c.def.circuit === 'EAST').every(c => power(s.game, c.def.circuit) === 1)).toBe(true);
    soundZone(s, 'muster'); // the PA is wired from critical power, not from the hall's lights
    expect(s.alarms.map(a => a.zone)).toEqual(['muster']);
  });

  it('the PA is critical power: every speaker is on it, and no breaker on the board touches it', () => {
    const s = fresh();
    expect(level.speakers!.every(S => S.pa === 'CRIT')).toBe(true);
    expect(s.usables.some(u => /Breaker, .*(PA|critical)/i.test(u.label() ?? ''))).toBe(false);
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

  it('the zone has no voice: seen there, no alarm sounds and no husk comes', () => {
    const s = fresh(), m = s.cast[1];
    for (const q of s.cast) if (q !== m) q.stun = 1e9;
    s.mute.push('ops');
    place(s, 77, 0, 20); // in view of the corridor's north camera
    s.game.events.length = 0;
    hold(s, EYES.hold + 2.3);
    expect(s.cams.some(c => c.hold > EYES.hold)).toBe(true); // it saw you
    expect(s.alarms).toEqual([]);
    expect(sounded(s, 'klaxon')).toBe(false);
    expect(m.state).not.toBe('answer');
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
