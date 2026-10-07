import type { CameraDef, SpeakerDef } from '../content/types';
import { STEP } from '../core/loop';
import { field } from '../world/nav';
import type { Dyn, World } from '../world/world';
import { answer, summon } from './cast';
import { routeRules, rulesFor, soundRules } from './fields';
import { power, say, sfx } from './game';
import { eyeHeight } from './player';
import type { Sim } from './sim';

/* The overseer's eyes and voice (world.md §8): cameras, and the zone alarms they sound. Nothing here was built for this:
   it is Security's own equipment. A camera with power sees along its cone, as far as the light you are in lets it (as the
   cast see); held in view a moment, you sound its zone. Its light is the tell: green while it watches, red while it holds
   you, so there is time to step out. The alarm sounds from the zone's speaker for a while, and whatever hears it comes:
   the changed answer it from drill, to the speaker, not to you (sim/cast.ts, 'answer'), and the overseer's hand hears every
   one, wherever it is (sim/cast.ts, summon). The answers: keep out of its cone, cut its power, or smash it (loud); or
   smash the zone's speaker (as loud), or cut its power or its PA's, and the zone has no voice: seen there, the doors
   about you are still bolted, but nothing hears it and nothing comes.
   The cameras see for the overseer: on a level that has one, they go dark for good when it dies, and no alarm sounds
   again. It is flesh, not wiring (world.md §8): it watches the cameras with an eye at each of its screens and sounds the
   zones and draws the bolts with a hand on its board, so all of it wants power at its own room (`screens`, a circuit). */

export interface Cam {
  def: CameraDef;
  broken: boolean;
  /** how long it has held you, in seconds */
  hold: number;
}

export interface Alarm {
  zone: string;
  /** seconds left to sound */
  t: number;
  /** the spot under the speaker, the way there, and how far its sound carries to each spot */
  spot: number;
  route: Float32Array;
  heard: Float32Array;
  /** the way there for what is too big for any door, open or shut (the hand): by the halls alone, so where it is
   *  infinite, the hand cannot come */
  big: Float32Array;
  /** when it sounds next */
  next: number;
}

/** held this long, you sound the zone; the zone sounds this long, again from the start each time it is sounded; its
 *  sound carries this far; it goes round every so often; the doors this near you are bolted, a bolt this long being drawn */
export const EYES = { hold: 1.4, sound: 12, reach: 34, every: 1.3, bolts: 9, draw: 1.1 };

/** what sight goes through: bodies, and glass */
const seeThrough = (d: Dyn) => d.kind === 'body' || !!d.glass;

export function makeCams(sim: Sim): Cam[] {
  return (sim.world.def.cameras ?? []).map(def => ({ def, broken: false, hold: 0 }));
}

/** the overseer is dead: there is no one to see through the cameras or sound an alarm */
export const blinded = (sim: Sim): boolean => sim.cast.some(m => m.ai === 'overseer' && m.dead);

/** a speaker hangs in the ceiling over its spot */
export function speakerY(w: World, S: SpeakerDef): number {
  const R = w.roomAt(S.x, S.y + 1, S.z);
  return R ? R.y0 + R.ht : S.y + 3;
}

/** the zone's speaker is whole */
export const voiced = (sim: Sim, zone: string): boolean => !sim.mute.includes(zone);

/** the zone's speaker can sound: whole, with power where it hangs, and on its PA system if it has one. A dead one is
 *  as quiet as a smashed one: seen there, the doors are still bolted, but nothing hears it */
export function heard(sim: Sim, zone: string): boolean {
  if (!voiced(sim, zone)) return false;
  const S = sim.world.def.speakers?.find(s => s.zone === zone), g = sim.game;
  return !S || ((!S.circuit || power(g, S.circuit) >= 1) && (!S.pa || power(g, S.pa) >= 1));
}

/** the overseer's own room has power: its screens are lit for its eyes, and its board answers its hands. Without it, it
 *  sees nothing through the cameras and can sound and bolt nothing, though it is alive and its own eyes still see */
export function manned(sim: Sim): boolean {
  const o = sim.cast.find(m => m.ai === 'overseer' && !m.dead);
  return !!o && (!o.screens || power(sim.game, o.screens) >= 1);
}

/** it can see: whole, with power to it, and someone at a lit screen to see for */
export const camLive = (sim: Sim, c: Cam): boolean => !c.broken && power(sim.game, c.def.circuit) >= 1 && !blinded(sim) && (!sim.cast.some(m => m.ai === 'overseer') || manned(sim));

/** it sees you: within its cone and its range for the light you are in, and nothing in the way */
export function camSees(sim: Sim, c: Cam): boolean {
  const C = c.def, b = sim.player.body, hy = b.y + eyeHeight(sim.player) * 0.9;
  const dx = b.x - C.x, dz = b.z - C.z, dp = Math.hypot(dx, dz), d = Math.hypot(dx, hy - C.y, dz);
  if (d > C.range * sim.game.vis || dp < 0.01) return false;
  if ((dx * Math.sin(C.yaw) + dz * Math.cos(C.yaw)) / dp < Math.cos(C.fov / 2)) return false;
  return sim.world.raycast(C.x, C.y, C.z, b.x, hy, b.z, seeThrough) >= 1;
}

/** sound a zone: its speaker goes, and goes on going a while; whatever hears it comes. `seen`: you were seen (by a
 *  camera or the overseer itself), so it bolts the doors about you as well */
export function soundZone(sim: Sim, zone: string, seen = false): void {
  const sp = sim.world.def.speakers?.find(s => s.zone === zone), F = sim.fields;
  if (!sp || !F || blinded(sim) || (!seen && !heard(sim, zone))) return;
  const on = sim.alarms.find(a => a.zone === zone);
  if (on) { on.t = EYES.sound; return; }
  const spot = F.nav.locate(sp.x, sp.y, sp.z);
  if (spot < 0) return;
  sim.alarms.push(makeAlarm(sim, zone, spot, EYES.sound));
  if (seen) boltAbout(sim);
}

/** the overseer bolts the doors about you that have power: each is heard being drawn a moment before it goes home, and
 *  holds while the alarm sounds. A dead door cannot be bolted, and one that loses its power lets its bolt go. */
function boltAbout(sim: Sim): void {
  const b = sim.player.body, g = sim.game;
  for (const d of sim.doors) {
    const D = d.def, cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2;
    if (D.seal || D.vent || D.lift || D.stuck || D.card || D.code || d.bolt > 0 || d.bolting > 0) continue;
    if (Math.hypot(cx - b.x, cz - b.z) > EYES.bolts || Math.abs(D.y0 - b.y) > 3 || power(g, D.circuit) < 1) continue;
    d.bolting = EYES.draw;
    sfx(g, 'bolt-draw', { x: cx, y: D.y0 + 2, z: cz });
  }
}

function updateBolts(sim: Sim): void {
  const g = sim.game, sounding = sim.alarms.length > 0;
  for (const d of sim.doors) {
    const D = d.def, at = { x: (D.x0 + D.x1) / 2, y: D.y0 + 2, z: (D.z0 + D.z1) / 2 }, live = power(g, D.circuit) >= 1;
    if (d.bolting > 0 && (d.bolting -= STEP) <= 0) { d.bolting = 0; if (live && sounding) { d.bolt = EYES.sound; sfx(g, 'bolt', at); } }
    if (d.bolt > 0 && (!live || !sounding || (d.bolt -= STEP) <= 0)) { d.bolt = 0; sfx(g, 'bolt-free', at); }
  }
}

function makeAlarm(sim: Sim, zone: string, spot: number, t: number): Alarm {
  const F = sim.fields!;
  return {
    zone, t, spot, next: 0,
    route: field(F.nav, spot, routeRules(sim, F, 'hands')),
    heard: field(F.nav, spot, soundRules(sim, F), undefined, EYES.reach),
    big: field(F.nav, spot, rulesFor(sim, F, 'big')),
  };
}

/** the alarms as a save had them: their ways and reach made again */
export function restoreAlarms(sim: Sim, saved: { zone: string; t: number; spot: number; next: number }[]): void {
  sim.alarms = sim.fields ? saved.map(a => ({ ...makeAlarm(sim, a.zone, a.spot, a.t), next: a.next })) : [];
}

/** a step of the eyes and the alarms */
export function updateEyes(sim: Sim): void {
  const g = sim.game;
  if (blinded(sim)) {
    if (sim.cams.length && !g.once.includes('blind')) {
      g.once.push('blind');
      say(g, 'The growth stops moving. Somewhere up the hall a klaxon dies mid-note, and the camera lights go out one by one.');
    }
    sim.alarms = [];
    for (const c of sim.cams) c.hold = 0;
    updateBolts(sim);
    return;
  }
  for (const c of sim.cams) {
    if (!camLive(sim, c) || !camSees(sim, c)) { c.hold = 0; continue; }
    if (c.hold === 0) sfx(g, 'cam', c.def); // it has you: the servo turns, the light goes red
    c.hold += STEP;
    if (c.hold >= EYES.hold) soundZone(sim, c.def.zone, true);
  }
  for (const a of sim.alarms) {
    a.t -= STEP;
    if ((a.next -= STEP) <= 0 && heard(sim, a.zone)) {
      /* it goes round, and whatever hears it this time comes */
      a.next = EYES.every;
      const sp = sim.world.def.speakers!.find(s => s.zone === a.zone)!;
      sfx(g, 'klaxon', { x: sp.x, y: sp.y + 2.6, z: sp.z }, true);
      for (const m of sim.cast) {
        if (m.type === 'hand') summon(sim, m, a.spot, a.big);
        else if (m.spot >= 0 && a.heard[m.spot] < EYES.reach) answer(sim, m, a.spot, a.route);
      }
    }
  }
  sim.alarms = sim.alarms.filter(a => a.t > 0);
  updateBolts(sim);
}
