import type { CameraDef, SpeakerDef } from '../content/types';
import { STEP } from '../core/loop';
import { field } from '../world/nav';
import type { Dyn, World } from '../world/world';
import { answer, free, type Mutant } from './cast';
import { routeRules, soundRules } from './fields';
import { power, sfx } from './game';
import { eyeHeight } from './player';
import type { Sim } from './sim';

/* Security's eyes and voice (world.md §8): cameras, and the zone alarms they sound. Nothing here was built for this:
   it is Security's own equipment, motion-detecting CCTV on a lockdown protocol, and nobody sits behind the screens. A
   camera with power sees along its cone, as far as the light you are in lets it (as the cast see), and it is movement
   it is looking for: creep and it lets you be; walk, held in view a moment, and you sound its zone; run, and it takes
   you almost at once. Its light is the tell: green while it watches, red while it holds you, so there is time to step
   out or slow down. The alarm sounds from the zone's speaker for a while. The cameras have false-alarmed for weeks, so
   the changed are tired of it: one alarm brings perhaps one of them, the nearest, slowly, in its own time; a zone sounded
   again soon after is a pattern, and every one of them that hears it comes. They go to the speaker, not to you
   (sim/cast.ts, 'answer'). The answers: keep out of its cone, move as slowly as they do, cut its power, or smash it
   (loud); or smash the zone's speaker (as loud), and the zone has no voice. */

export interface Cam {
  def: CameraDef;
  broken: boolean;
  /** how long it has held you, in seconds of a walker's hold (EYES.hold sounds it) */
  hold: number;
  /** it has sounded its zone, and has not yet let you go: it keeps it sounding while it still has you moving */
  tripped: boolean;
}

export interface Alarm {
  zone: string;
  /** seconds left to sound */
  t: number;
  /** the spot under the speaker, the way there, and how far its sound carries to each spot */
  spot: number;
  route: Float32Array;
  heard: Float32Array;
  /** when it sounds next */
  next: number;
  /** the zone sounded again soon after (FATIGUE): every one that hears it comes. Else the one that will (its id, or -1
   *  for none, or none any more), and the seconds before it goes */
  all: boolean;
  pick: number;
  due: number;
}

/** held this long, you sound the zone; the zone sounds this long, again from the start each time it is sounded; its
 *  sound carries this far; it goes round every so often */
export const EYES = { hold: 1.4, sound: 12, reach: 34, every: 1.3 };

/** how a camera weighs you by your speed on the plan (m/s): at `creep` or under it holds nothing (crouched you go 1.6);
 *  past it, a walker's hold (EYES.hold to sound the zone; walking is 3.2); faster than `walk`, quicker, until at `run`
 *  (running is 5.6) it takes you in `quick` seconds. Slow again in its view and it lets go, `drain` seconds of hold a
 *  second; out of its view, at once */
export const SPEED = { creep: 2, walk: 3.2, run: 5.6, quick: 0.4, drain: 0.5 };

/** alarm fatigue: a zone sounded again within `window` seconds of the last time is a pattern, and every one of the
 *  changed that hears it comes. Otherwise it is one more false alarm: the nearest that hears it comes at even odds
 *  (`one`), `wait` seconds after it starts */
export const FATIGUE = { window: 60, one: 0.5, wait: [2, 6] as const };

/** how fast a camera holds you, going `v` (m/s): seconds of hold a second */
export function holdRate(v: number): number {
  const S = SPEED;
  if (v <= S.creep) return 0;
  if (v <= S.walk) return 1;
  return 1 + (Math.min(v, S.run) - S.walk) / (S.run - S.walk) * (EYES.hold / S.quick - 1);
}

/** what sight goes through: bodies, and glass */
const seeThrough = (d: Dyn) => d.kind === 'body' || !!d.glass;

export function makeCams(sim: Sim): Cam[] {
  return (sim.world.def.cameras ?? []).map(def => ({ def, broken: false, hold: 0, tripped: false }));
}

/** a speaker hangs in the ceiling over its spot */
export function speakerY(w: World, S: SpeakerDef): number {
  const R = w.roomAt(S.x, S.y + 1, S.z);
  return R ? R.y0 + R.ht : S.y + 3;
}

/** the zone's speaker is whole */
export const voiced = (sim: Sim, zone: string): boolean => !sim.mute.includes(zone);

/** the zone's speaker can sound: whole, and its PA system has power. A dead one is as quiet as a smashed one: nothing
 *  hears it. (Security's PA is on critical power: in practice, only smashing it quiets a zone.) */
export function heard(sim: Sim, zone: string): boolean {
  if (!voiced(sim, zone)) return false;
  const S = sim.world.def.speakers?.find(s => s.zone === zone);
  return !S?.pa || power(sim.game, S.pa) >= 1;
}

/** it can see: whole, and with power to it */
export const camLive = (sim: Sim, c: Cam): boolean => !c.broken && power(sim.game, c.def.circuit) >= 1;

/** it sees you: within its cone and its range for the light you are in, and nothing in the way */
export function camSees(sim: Sim, c: Cam): boolean {
  const C = c.def, b = sim.player.body, hy = b.y + eyeHeight(sim.player) * 0.9;
  const dx = b.x - C.x, dz = b.z - C.z, dp = Math.hypot(dx, dz), d = Math.hypot(dx, hy - C.y, dz);
  if (d > C.range * sim.game.vis || dp < 0.01) return false;
  if ((dx * Math.sin(C.yaw) + dz * Math.cos(C.yaw)) / dp < Math.cos(C.fov / 2)) return false;
  return sim.world.raycast(C.x, C.y, C.z, b.x, hy, b.z, seeThrough) >= 1;
}

/** sound a zone: its speaker goes, and goes on going a while. Sounded again within FATIGUE.window of the last time, it
 *  is a pattern, and every one that hears it comes; else perhaps one does */
export function soundZone(sim: Sim, zone: string): void {
  const sp = sim.world.def.speakers?.find(s => s.zone === zone), F = sim.fields;
  if (!sp || !F || !heard(sim, zone)) return;
  const now = sim.game.time, last = sim.sounded[zone], again = last !== undefined && now - last < FATIGUE.window;
  sim.sounded[zone] = now;
  const on = sim.alarms.find(a => a.zone === zone);
  if (on) { on.t = EYES.sound; on.all = true; return; }
  const spot = F.nav.locate(sp.x, sp.y, sp.z);
  if (spot < 0) return;
  const a = makeAlarm(sim, zone, spot, EYES.sound);
  a.all = again;
  if (!again) pickOne(sim, a);
  sim.alarms.push(a);
}

/** one more false alarm: the nearest that hears it and would come, perhaps, in its own time */
function pickOne(sim: Sim, a: Alarm): void {
  let best: Mutant | null = null;
  for (const m of sim.cast) if (free(m) && a.heard[m.spot] < EYES.reach && (!best || a.heard[m.spot] < a.heard[best.spot])) best = m;
  if (best && sim.rng.chance(FATIGUE.one)) { a.pick = best.id; a.due = sim.rng.range(FATIGUE.wait[0], FATIGUE.wait[1]); }
}

function makeAlarm(sim: Sim, zone: string, spot: number, t: number): Alarm {
  const F = sim.fields!;
  return {
    zone, t, spot, next: 0, all: false, pick: -1, due: 0,
    route: field(F.nav, spot, routeRules(sim, F, 'hands')),
    heard: field(F.nav, spot, soundRules(sim, F), undefined, EYES.reach),
  };
}

/** what of an alarm a save keeps: its ways and reach are made again */
export type SavedAlarm = Pick<Alarm, 'zone' | 't' | 'spot' | 'next' | 'all' | 'pick' | 'due'>;
export const saveAlarm = (a: Alarm): SavedAlarm => ({ zone: a.zone, t: a.t, spot: a.spot, next: a.next, all: a.all, pick: a.pick, due: a.due });

/** the alarms as a save had them: their ways and reach made again */
export function restoreAlarms(sim: Sim, saved: SavedAlarm[]): void {
  sim.alarms = sim.fields ? saved.map(a => ({ ...makeAlarm(sim, a.zone, a.spot, a.t), next: a.next, all: a.all, pick: a.pick, due: a.due })) : [];
}

/** a step of the eyes and the alarms */
export function updateEyes(sim: Sim): void {
  const g = sim.game, b = sim.player.body, rate = holdRate(Math.hypot(b.vx, b.vz));
  for (const c of sim.cams) {
    if (!camLive(sim, c) || !camSees(sim, c)) { c.hold = 0; c.tripped = false; continue; }
    if (rate > 0) {
      if (c.hold === 0) sfx(g, 'cam', c.def); // it has you: the servo turns, the light goes red
      c.hold = Math.min(EYES.hold, c.hold + rate * STEP);
    } else if ((c.hold = Math.max(0, c.hold - SPEED.drain * STEP)) === 0) c.tripped = false; // still, it lets you go
    if (rate === 0) continue;
    /* it has you: it sounds its zone, once, and keeps it sounding while it still sees you moving */
    if (c.tripped) { const a = sim.alarms.find(q => q.zone === c.def.zone); if (a) a.t = EYES.sound; }
    else if (c.hold >= EYES.hold) { c.tripped = true; soundZone(sim, c.def.zone); }
  }
  for (const a of sim.alarms) {
    a.t -= STEP;
    if (a.due > 0) a.due -= STEP;
    if ((a.next -= STEP) <= 0 && heard(sim, a.zone)) {
      /* it goes round: a pattern, and whatever hears it this time comes; else only the one it is the last straw for */
      a.next = EYES.every;
      const sp = sim.world.def.speakers!.find(s => s.zone === a.zone)!;
      sfx(g, 'klaxon', { x: sp.x, y: sp.y + 2.6, z: sp.z }, true);
      if (a.all) { for (const m of sim.cast) if (m.spot >= 0 && a.heard[m.spot] < EYES.reach) answer(sim, m, a.spot, a.route); }
      else if (a.pick >= 0 && a.due <= 0) { const m = sim.cast[a.pick]; a.pick = -1; if (m.spot >= 0) answer(sim, m, a.spot, a.route); }
    }
  }
  sim.alarms = sim.alarms.filter(a => a.t > 0);
}
