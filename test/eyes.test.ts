import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give, power } from '../src/sim/game';
import { EYES, FATIGUE, SPEED, soundZone } from '../src/sim/eyes';
import { doorAct, findUsable } from '../src/sim/interact';
import { load, save } from '../src/sim/save';
import { free } from '../src/sim/cast';

/* Security's eyes and voice (sim/eyes.ts), on the upper station: cameras that hold you moving sound their zone, and the
   husks that hear it come to it, one perhaps, then all of them. */

const level = buildUpper(STATION.ladders);
const fresh = () => makeSim(level, { seed: 7, station: STATION });
const hold = (s: Sim, secs: number) => { for (let t = 0; t < secs; t += STEP) step(s, noInput()); };
const place = (s: Sim, x: number, y: number, z: number) => { const b = s.player.body; b.x = x; b.y = y; b.z = z; b.vy = 0; b.sync(); };
const sounded = (s: Sim, name: string) => s.game.events.some(e => e.type === 'sfx' && e.name === name);
/** the camera on the atrium's threshold, from its south-west corner, looking north */
const threshold = (s: Sim) => s.cams.find(c => c.def.zone === 'atrium' && Math.abs(c.def.yaw - Math.PI) < 0.01)!;
const still = (s: Sim) => { for (const m of s.cast) m.stun = 1e9; };
/** in the atrium, some way north of that camera and in its view, facing it */
const inView = (s: Sim) => { const C = threshold(s).def; place(s, C.x, 0, C.z - 7); s.player.yaw = Math.PI; };
/** go on the way you face for a while: walking, running, or crouched (the first step crouches, the rest creep) */
const go = (s: Sim, secs: number, how: 'walk' | 'run' | 'creep' = 'walk') => {
  for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), forward: 1, run: how === 'run', crouch: how === 'creep' && !s.player.crouch });
};

describe('cameras', () => {
  it('a live camera that holds you walking a moment sounds its zone: its light at once, then the klaxon', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    s.game.events.length = 0;
    go(s, 0.5);
    expect(c.hold).toBeGreaterThan(0); // it has you: the light is red, the servo heard
    expect(sounded(s, 'cam')).toBe(true);
    expect(s.alarms).toEqual([]);
    go(s, 0.6);
    expect(s.alarms).toEqual([]); // a walker has time to step out or slow down
    go(s, 0.6);
    expect(s.alarms.map(a => a.zone)).toEqual(['atrium']);
    expect(sounded(s, 'klaxon')).toBe(true);
  });

  it('running, it takes you almost at once', () => {
    const s = fresh();
    still(s);
    inView(s);
    let t = 0;
    for (; t < 2 && !s.alarms.length; t += STEP) step(s, { ...noInput(), forward: 1, run: true });
    expect(s.alarms.map(a => a.zone)).toEqual(['atrium']);
    expect(t).toBeLessThan(SPEED.quick + 0.35); // the time to get up to a run, and its hold
  });

  it('creeping, or standing still, it lets you be: it looks for movement', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    hold(s, 3);
    expect(c.hold).toBe(0);
    go(s, 4, 'creep');
    expect(Math.hypot(s.player.body.vx, s.player.body.vz)).toBeLessThanOrEqual(SPEED.creep);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });

  it('slow down in its view in time and it lets you go: nothing sounds, and it forgets you', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    go(s, EYES.hold * 0.7);
    const had = c.hold;
    expect(had).toBeGreaterThan(0);
    hold(s, 1);
    expect(c.hold).toBeLessThan(had); // still, it lets go a little at a time
    hold(s, had / SPEED.drain);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });

  it('step out of its view in time and nothing sounds', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    go(s, EYES.hold * 0.6);
    expect(c.hold).toBeGreaterThan(0);
    place(s, 61, 0, -1); // back into the dark corridor
    hold(s, 2);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });

  it('it sounds once for one sighting, and keeps it sounding while it still has you moving', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    go(s, EYES.hold + 0.3);
    expect(s.alarms.length).toBe(1);
    const at = s.sounded.atrium;
    hold(s, 0.5);
    const t = s.alarms[0].t;
    go(s, 0.3);
    expect(c.tripped).toBe(true);
    expect(s.alarms[0].t).toBeGreaterThan(t); // kept sounding
    expect(s.sounded.atrium).toBe(at); // the same sighting: not sounded again
    expect(s.alarms[0].all).toBe(false);
  });

  it('a dead camera sees nothing, and neither does a smashed one; smashing takes something in your hand, and is loud', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    s.game.station!.circuits.OPS.back = false; s.lighting = null; // Ops' set stopped
    inView(s);
    go(s, 3);
    expect(s.alarms).toEqual([]);
    s.game.station!.circuits.OPS.back = true; s.lighting = null;
    inView(s);
    const smash = s.usables.find(u => u.x === c.def.x && u.z === c.def.z)!;
    smash.act();
    expect(c.broken).toBe(false); // bare hands
    give(s.game, 'baton');
    s.game.noiseI = 0;
    smash.act();
    expect(c.broken).toBe(true);
    expect(s.game.noiseI).toBeGreaterThanOrEqual(14);
    expect(smash.label()).toBeNull();
    go(s, 3);
    expect(c.hold).toBe(0);
    expect(s.alarms).toEqual([]);
  });
});

describe('the zone alarm', () => {
  it('husks in earshot answer it: they go to the speaker, slowly, not to you', () => {
    const s = fresh(), m = s.cast[1]; // on its rounds in the Operations corridor
    for (const q of s.cast) if (q !== m) q.stun = 1e9;
    place(s, 30, -4.5, -25); // you are a storey down in the suite, far out of its sight and hearing
    hold(s, 0.2);
    soundZone(s, 'atrium'); soundZone(s, 'atrium'); // twice: a pattern, so every one that hears it comes
    hold(s, 0.1);
    expect(m.state).toBe('answer');
    const sp = level.speakers!.find(q => q.zone === 'atrium')!;
    let fastest = 0;
    for (let t = 0; t < 40 && m.state === 'answer'; t += STEP) { step(s, noInput()); fastest = Math.max(fastest, Math.hypot(m.body!.vx, m.body!.vz)); }
    expect(fastest).toBeLessThan(1.6); // in its own time: no faster than its rounds
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
    soundZone(s, 'atrium'); soundZone(s, 'atrium');
    hold(s, 2);
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(s, 3); hold(a, 3);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});

describe('alarm fatigue', () => {
  /** the husks that would answer and hear the atrium's alarm, with you out of it all; everything else still */
  const setUp = (seed: number) => {
    const s = makeSim(level, { seed, station: STATION });
    place(s, 30, -4.5, -25);
    hold(s, 0.2);
    for (const q of s.cast) if (q.ai !== 'husk' || q.post) q.stun = 1e9;
    return s;
  };
  const answering = (s: Sim) => s.cast.filter(m => m.state === 'answer').map(m => m.id);

  it('one alarm is one more false one: perhaps the nearest that hears it comes, in its own time, and no other', () => {
    let came = 0, runs = 0;
    for (let seed = 1; seed <= 16; seed++) {
      const s = setUp(seed);
      soundZone(s, 'atrium');
      const a = s.alarms[0], hear = s.cast.filter(m => free(m) && m.stun < 1e8 && a.heard[m.spot] < EYES.reach);
      expect(hear.length).toBeGreaterThan(1); // more than one could have come
      const nearest = hear.reduce((p, m) => (a.heard[m.spot] < a.heard[p.spot] ? m : p));
      runs++;
      if (a.pick < 0) { hold(s, EYES.sound); expect(answering(s)).toEqual([]); continue; }
      came++;
      expect(a.pick).toBe(nearest.id);
      hold(s, FATIGUE.wait[0] - 0.2);
      expect(answering(s)).toEqual([]); // not at once
      hold(s, FATIGUE.wait[1] - FATIGUE.wait[0] + EYES.every + 0.2);
      expect(answering(s)).toEqual([nearest.id]); // it, and it alone
    }
    expect(came).toBeGreaterThan(runs * 0.2);
    expect(came).toBeLessThan(runs * 0.8);
  });

  it('sounded again in the same zone within a minute, it is a pattern: every one that hears it comes', () => {
    const s = setUp(3);
    soundZone(s, 'atrium');
    hold(s, EYES.sound + 5); // it has died away
    expect(s.alarms).toEqual([]);
    soundZone(s, 'atrium');
    const a = s.alarms[0];
    expect(a.all).toBe(true);
    const hear = s.cast.filter(m => free(m) && m.stun < 1e8 && a.heard[m.spot] < EYES.reach && a.route[m.spot] > 2.5);
    hold(s, 0.1);
    expect(hear.length).toBeGreaterThan(1);
    for (const m of hear) expect(m.state, `${m.id}`).toBe('answer');
  });

  it('another zone sounded is not the pattern; and after a minute\'s quiet, the same zone is one false alarm again', () => {
    const s = setUp(3);
    soundZone(s, 'atrium');
    soundZone(s, 'ops');
    expect(s.alarms.find(a => a.zone === 'ops')!.all).toBe(false);
    hold(s, FATIGUE.window + 1);
    soundZone(s, 'atrium');
    expect(s.alarms.find(a => a.zone === 'atrium')!.all).toBe(false);
  });

  it('seen twice by its cameras, a zone brings them all', () => {
    const s = fresh(), c = threshold(s);
    still(s);
    inView(s);
    go(s, EYES.hold + 0.2);
    expect(s.alarms[0].all).toBe(false);
    place(s, 61, 0, -1); // out of its view: it lets you go
    hold(s, 0.5);
    expect(c.tripped).toBe(false);
    inView(s);
    go(s, EYES.hold + 0.2);
    expect(s.alarms[0].all).toBe(true);
  });

  it('a save made while one is about to come, or a pattern sounds, plays on the same', () => {
    for (const twice of [false, true]) {
      let seed = 1, s = setUp(seed);
      soundZone(s, 'atrium');
      while (!twice && s.alarms[0].pick < 0) { s = setUp(++seed); soundZone(s, 'atrium'); }
      if (twice) soundZone(s, 'atrium');
      hold(s, 1);
      const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed, station: STATION });
      hold(s, 8); hold(a, 8);
      expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
    }
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
    place(s, 79, 0, 20); // in view of the corridor's north camera, walking toward it
    s.player.yaw = 0;
    s.game.events.length = 0;
    go(s, EYES.hold + 0.3);
    expect(s.cams.some(c => c.tripped)).toBe(true); // it saw you
    hold(s, 2);
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
