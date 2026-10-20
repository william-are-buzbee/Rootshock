import { STEP } from '../core/loop';
import { REEL } from './moves';
import { gone, type Mutant } from './cast';
import { say, sayOnce, sfx } from './game';
import type { Input } from './input';
import { eyeHeight } from './player';
import type { Sim } from './sim';

/* The opening (world.md §8, The opening): the first minutes of a new game, in the isolation suite. Most of it is the
   station working: the suite on its night setting, the night round on the balcony, the readers, the medical hold on your
   door, the fail-safe locks, the noise the other patient makes and the night round coming to it. What is kept here is
   only what has to be timed:
   - wake: your pump's empty-bag alarm, and you weak from weeks under. When you first look out of your window (or, if you
     do not, a little later) the other patient sees you, and starts on the glass;
   - scene: the night round comes down to the noise and goes through the suite (sim/cast.ts, its first time round);
   - left: it has gone back up to the wing. A while on, the survivors cut the wing's feed to blind its cameras, and the
     suite's fail-safe locks let go (sim/movers.ts, failSafe);
   - done. */

export type Phase = 'wake' | 'scene' | 'left' | 'done';

export interface Opening {
  phase: Phase;
  /** seconds in this phase */
  t: number;
  /** the pump still sounding, and seconds to its next round of notes */
  alarm: boolean;
  next: number;
  /** seconds left of being weak from the weeks under */
  weak: number;
}

/** how long it waits for you to look out before the other patient sees you anyway (s); how long after the night round has
 *  gone before the cut; how long the night round may take about the suite before the cut comes regardless; how long you
 *  are weak, and how slow (your pace at the start, as a share); how often the pump goes round; and how near your window's
 *  middle you must be looking for it to count as looking out (a cosine) */
export const OPENING = { wait: 30, cut: 30, late: 240, weak: 90, slow: 0.55, alarm: 2.2, look: 0.8 };

const patients = (sim: Sim) => sim.cast.filter(m => m.ai === 'patient');
const nightRound = (sim: Sim): Mutant | undefined => sim.cast.find(m => m.round && m.torch);

/** a new game's start: the wing's feed whole (the survivors have not cut it yet) and the suite's fail-safe locks on */
export function makeOpening(sim: Sim): Opening {
  const C = sim.game.station?.circuits.SEC;
  if (C) { C.broken = false; C.on = true; }
  for (const d of sim.doors) if (d.def.failsafe) d.unlocked = false;
  sim.lighting = null;
  return { phase: 'wake', t: 0, alarm: true, next: 0.6, weak: OPENING.weak };
}

/** a game that does not begin with the opening: the other patient long dead in their corner */
export function noOpening(sim: Sim): void {
  for (const m of patients(sim)) gone(sim, m);
}

/** the pump on your pole (the level's use of kind 'pump') */
const pumpAt = (sim: Sim) => sim.world.def.uses.find(u => u.kind === 'pump');

/** you are looking out through your window: one of the panes near you, nearly straight ahead */
function lookingOut(sim: Sim): boolean {
  const p = sim.player, b = p.body, ey = b.y + eyeHeight(p), cp = Math.cos(p.pitch);
  const fx = -Math.sin(p.yaw) * cp, fy = Math.sin(p.pitch), fz = -Math.cos(p.yaw) * cp;
  return sim.doors.some(d => {
    const D = d.def;
    if (!D.glass) return false;
    const dx = (D.x0 + D.x1) / 2 - b.x, dy = (D.y0 + D.y1) / 2 - ey, dz = (D.z0 + D.z1) / 2 - b.z, dd = Math.hypot(dx, dy, dz);
    return dd < 5 && (dx * fx + dy * fy + dz * fz) / dd > OPENING.look;
  });
}

/** a step of it */
export function updateOpening(sim: Sim): void {
  const O = sim.opening;
  if (!O) return;
  const g = sim.game;
  if (O.weak > 0) O.weak = Math.max(0, O.weak - STEP);
  /* the pump, three notes every couple of seconds, until you silence it */
  const P = pumpAt(sim);
  if (O.alarm && P && (O.next -= STEP) <= 0) { O.next = OPENING.alarm; sfx(g, 'pump', P); }
  if (O.phase === 'done') return;
  O.t += STEP;
  switch (O.phase) {
    case 'wake':
      if (!lookingOut(sim) && O.t < OPENING.wait) break;
      /* they see you awake, and start on the glass */
      for (const m of patients(sim)) if (!m.dead && m.state === 'wait') { m.state = 'bang'; m.wt = 0.3; }
      O.phase = 'scene'; O.t = 0;
      break;
    case 'scene': {
      /* until the night round has been through the suite and gone back up: past the last of its first-time stops */
      const m = nightRound(sim), R = m?.round;
      const past = !m || m.dead || !R || m.lap > 0 || m.beat >= R.findIndex(s => !s.once);
      if (past || O.t > OPENING.late) { O.phase = 'left'; O.t = 0; }
      break;
    }
    case 'left':
      if (O.t < OPENING.cut) break;
      cut(sim);
      O.phase = 'done'; O.t = 0;
      break;
  }
}

/** the survivors cut the wing's feed: heard far off, then every light on it dies (sim/sim.ts follows the power) */
function cut(sim: Sim): void {
  const g = sim.game, C = g.station?.circuits.SEC;
  if (!C || C.broken) return;
  C.broken = true;
  g.events.push({ type: 'power', loud: false });
  const at = sim.world.def.uses.find(u => u.kind === 'panel' && u.opts.cut);
  if (at) sfx(g, 'clang', at);
}

/** silence the pump: what its screen says */
export function silencePump(sim: Sim): void {
  const O = sim.opening;
  if (O) O.alarm = false;
  sfx(sim.game, 'take', pumpAt(sim));
  say(sim.game, 'EMPTY BAG, the screen says, and the clock under it: 14 NOV, 03:12. The bag went up on the tenth.');
}

/** weak from the weeks under: your legs slow, and they will not run. Try, and they go from under you a moment */
export function weakened(sim: Sim, input: Input): Input {
  const O = sim.opening;
  if (!O || O.weak <= 0) return input;
  sim.player.pace *= OPENING.slow + (1 - OPENING.slow) * (1 - O.weak / OPENING.weak);
  if (!input.run) return input;
  const h = sim.hands, moving = input.forward !== 0 || input.strafe !== 0;
  if (moving && h.stag <= 0 && h.down <= 0) {
    h.stag = REEL.you;
    sfx(sim.game, 'reel');
    sim.game.events.push({ type: 'shake', k: 0.25 });
    sayOnce(sim.game, 'weak', 'Your legs will not run. Not yet: weeks of lying still are in them.');
  }
  return { ...input, run: false };
}
