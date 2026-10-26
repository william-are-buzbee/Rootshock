import { STEP } from '../../core/loop';
import { staffField } from '../fields';
import { power, sfx } from '../game';
import { occupied, type Door } from '../movers';
import { MOVES } from '../moves';
import { riders, type Sim } from '../sim';
import type { Mutant } from '../cast';
import { away, chase, fieldTo, follow, go, own, rnd, roam, step_, turnTo, turnToward } from './move';
import { footfall, pace } from './gait';
import { hears, lit, seeP, seeThrough } from './senses';
import { beginBlow, blowStep, hover, inStart, WAIT, waits } from './blows';
import { glassSpot, PEER, reaches, takesYou, triesYours, walkRound } from './round';

/* Security's staff (world.md §8, the changed; the code keeps the name husk): what makes one notice you and hunt
   you, look for whoever threw a breaker, shut a door left open, answer an alarm, or go to throw a breaker back on.
   The night round is one of them, on a round of its own (round.ts). */

const dt = STEP;

/** a husk at rest or on its way somewhere notices you: in front of it and seen, or heard. Then it hunts. */
function notices(sim: Sim, m: Mutant): boolean {
  const p = sim.player.body, facing = m.d < 2.5 || ((p.x - m.x) * Math.sin(m.yaw) + (p.z - m.z) * Math.cos(m.yaw)) / (m.dp || 1) > -0.2;
  if (!((facing && seeP(sim, m, 15)) || hears(sim, m))) return false;
  return hunt(sim, m);
}

/** it has you */
function hunt(sim: Sim, m: Mutant): boolean {
  /* the night round, seeing you where it cannot get to you: to the glass, to look in (PEER); once in a while, and not
     before it has tried your door, if that is one it is on its way to try */
  if (m.round && !reaches(sim, m)) {
    if (m.peered < PEER.again || (m.state === 'round' && triesYours(sim, m))) return false;
    const at = glassSpot(sim, m);
    m.state = 'peer'; m.st = PEER.look; m.wx = at.x; m.wz = at.z; m.peered = 0; m.wt = 0;
    return true;
  }
  m.state = 'hunt'; m.lost = 0; m.post = false; m.dest = -1; step_(sim, m, 'moan');
  return true;
}

/** looking for whoever threw the breaker: a while about the board, slowly (its `search` pace), a spot at a time,
 *  stopping to look round. It sees farther than on its rounds, and all round: it is looking (world.md §8, the changed) */
export const SEARCH = { time: [14, 20] as const, reach: 6, see: 18, look: [1.5, 3] as const };

/** a door left open: one that does not shut itself (slid open by hand with no power to it, or a heavy one left open), was
 *  shut when the place was new, and is open now. One of the staff on its rounds that sees one goes to it, looks through,
 *  and shuts it (world.md §8, the changed). It sees one this far, in front of it, lit, and in plain view, if it is not at
 *  it already; and looks for one every so often, not every step. It goes to it at its `shut` pace */
const LEFT = { see: 14, near: 2.5, every: 30, look: 2 };

export const doorMid = (d: Door) => ({ x: (d.def.x0 + d.def.x1) / 2, y: d.def.y0 + 1.2, z: (d.def.z0 + d.def.z1) / 2 });

function leftOpen(sim: Sim, d: Door): boolean {
  const D = d.def;
  if (!d.open || D.open || D.stuck || D.vent || D.seal || D.lift || D.glass || d.pass > 0) return false;
  return D.kind === 'heavy' || power(sim.game, D.circuit) <= 0;
}

/** one on its rounds sees a door left open that nobody is seeing to, and goes to shut it */
function noticesDoor(sim: Sim, m: Mutant): boolean {
  if (!m.cards || m.post || m.spot < 0 || (sim.tick + m.id) % LEFT.every || !sim.fields) return false;
  for (let k = 0; k < sim.doors.length; k++) {
    const d = sim.doors[k];
    if (!leftOpen(sim, d) || sim.cast.some(q => q.door === k && q.state === 'shut' && !q.dead)) continue;
    const at = doorMid(d), dx = at.x - m.x, dz = at.z - m.z, dp = Math.hypot(dx, dz);
    /* not one it is at: that one it has just opened to go through */
    if (dp < LEFT.near || dp > LEFT.see || Math.abs(at.y - 1.2 - m.y) > 2.5 || (dx * Math.sin(m.yaw) + dz * Math.cos(m.yaw)) / (dp || 1) < 0.35) continue;
    if (!lit(sim, at.x, at.y, at.z) || sim.world.raycast(m.x, m.y + m.eye, m.z, at.x, at.y, at.z, seeThrough) < 0.97) continue;
    /* to its near side, a step back from the doorway */
    const o = 1.3, D = d.def, s = D.alongX ? Math.sign(m.z - at.z) || 1 : Math.sign(m.x - at.x) || 1;
    const spot = sim.fields.nav.locate(at.x + (D.alongX ? 0 : s * o), at.y - 1.2, at.z + (D.alongX ? s * o : 0));
    if (spot < 0) continue;
    const F = fieldTo(sim, m, spot);
    if (!Number.isFinite(F[m.spot])) continue;
    m.state = 'shut'; m.door = k; m.dest = spot; m.F = F; m.st = LEFT.look; m.stk = 0;
    step_(sim, m, 'mutter');
    return true;
  }
  return false;
}

/** somewhere near where it is searching (wx, wz), on its floor, to walk to next */
function searchSpot(sim: Sim, m: Mutant): number {
  const nav = sim.fields!.nav, near: number[] = [];
  for (let i = 0; i < nav.n; i++) {
    if (Math.abs(nav.y[i] - m.y) < 1 && Math.hypot(nav.x[i] - m.wx, nav.z[i] - m.wz) < SEARCH.reach && Math.hypot(nav.x[i] - m.x, nav.z[i] - m.z) > 1.5) near.push(i);
  }
  return near.length ? near[Math.floor(sim.rng.range(0, near.length))] : -1;
}

/** one of the staff that would answer an alarm: a husk on its rounds or its post, or on its way to one already */
export const free = (m: Mutant): boolean => !m.dead && m.ai === 'husk' && (m.state === 'idle' || m.state === 'round' || m.state === 'lurk' || m.state === 'answer') && m.spot >= 0;

/** they go to an alarm in a hurry (their `answer` pace); faster again (`rally`) with another of them in sight hurrying
 *  too, within `see` metres: one starts and the rest catch it */
const ANSWER = { see: 16 };

/** a zone alarm it hears (sim/eyes.ts): a husk not already after you leaves its rounds, or its post, and hurries to the
 *  speaker, as Security's staff were drilled to. The way there is the alarm's, copied: a round makes its next route in
 *  the one it has. */
export function answer(sim: Sim, m: Mutant, spot: number, route: Float32Array): void {
  if (!free(m)) return;
  if (m.state === 'answer' && m.dest === spot) return;
  if (!(route[m.spot] > 2.5)) return; // there already, or no way there
  step_(sim, m, 'mutter');
  m.state = 'answer'; m.post = false; m.dest = spot; m.F = Float32Array.from(route); m.wt = 0; m.stk = 0;
}

/** another of them hurrying to an alarm is in its sight: on its way, and going at a hurry's pace */
function hurried(sim: Sim, m: Mutant): boolean {
  for (const o of sim.cast) {
    if (o === m || o.dead || o.state !== 'answer' || !o.body || Math.hypot(o.body.vx, o.body.vz) < pace(o, 'answer') * 0.8) continue;
    if (Math.hypot(o.x - m.x, o.z - m.z) > ANSWER.see) continue;
    if (sim.world.raycast(m.x, m.y + m.eye, m.z, o.x, o.y + o.eye, o.z, seeThrough) >= 1) return true;
  }
  return false;
}

/* Power-failure drill (world.md §8). The staff were drilled for a dead circuit as for an alarm, and habit is what they have
   left: those caught in the dark when a breaker goes may go to its board and throw it back on. Each one caught has a fair
   chance to go at once, so a crowd nearly always sends someone and one alone may not; any other who is still in the dark
   later goes, its odds climbing until, three minutes on, it surely would. One who reaches the light has stopped noticing.
   That is the whole of their wit: a habit and a hand. They do not hunt whoever did it, cut anything, or mend a cut cable. */
export interface Drill {
  c: string;
  /** the board: where its breaker is, and the spot to stand at it */
  x: number; y: number; z: number; spot: number;
  /** seconds since it went */
  t: number;
  /** each one caught in the dark (its id), and when it would go */
  due: { id: number; at: number }[];
}
const DRILL = { now: 0.25, quick: [1.5, 4], last: 180, first: 30 };

/** does circuit `rc` take its power through `c`? */
function fedBy(sim: Sim, rc: string, c: string): boolean {
  const C = sim.game.station?.circuits;
  for (let k = rc, n = 0; k && n < 8; k = C?.[k]?.feed ?? '', n++) if (k === c) return true;
  return false;
}
const caught = (m: Mutant) => m.ai === 'husk' && !m.dead && !m.post && m.state !== 'hunt' && m.state !== 'fix';

/** a breaker opened by hand at (x, y, z): who it leaves in the dark, and when each would go to throw it back */
export function drill(sim: Sim, c: string, x: number, y: number, z: number): void {
  const F = sim.fields;
  if (!F) return;
  sim.drills = sim.drills.filter(D => D.c !== c);
  sim.lighting = null;
  const due: Drill['due'] = [];
  for (const m of sim.cast) {
    if (!caught(m)) continue;
    const R = sim.world.roomAt(m.x, m.y + 0.5, m.z);
    if (!R || !fedBy(sim, R.circuit, c) || lit(sim, m.x, m.y + 1, m.z)) continue;
    const at = sim.rng.chance(DRILL.now) ? sim.rng.range(DRILL.quick[0], DRILL.quick[1]) : DRILL.first + (DRILL.last - DRILL.first) * Math.sqrt(sim.rng.range(0, 1));
    due.push({ id: m.id, at });
  }
  const spot = F.nav.locate(x, y - 1.3, z);
  if (due.length && spot >= 0) sim.drills.push({ c, x, y, z, spot, t: 0, due });
}

/** the breaker back on: heard, and the light with it */
function restore(sim: Sim, D: Drill): void {
  const C = sim.game.station?.circuits[D.c], g = sim.game;
  sim.drills = sim.drills.filter(q => q !== D);
  if (!C || C.on || C.broken) return;
  C.on = true;
  g.events.push({ type: 'power', loud: false });
  sfx(g, 'clang', { x: D.x, y: D.y, z: D.z });
}

export function updateDrills(sim: Sim): void {
  for (const D of [...sim.drills]) {
    const C = sim.game.station?.circuits[D.c];
    if (!C || C.on) { sim.drills = sim.drills.filter(q => q !== D); continue; }
    D.t += dt;
    for (const e of D.due) {
      const m = sim.cast[e.id];
      if (e.at < 0 || D.t < e.at) continue;
      e.at = -1;
      /* still in the dark, and free to go: to the board, if it can get there */
      if (!m || !caught(m) || lit(sim, m.x, m.y + 1, m.z) || m.spot < 0 || !sim.fields) continue;
      const F = fieldTo(sim, m, D.spot);
      if (!Number.isFinite(F[m.spot])) continue;
      step_(sim, m, 'mutter');
      m.state = 'fix'; m.post = false; m.dest = D.spot; m.F = F; m.st = 1.2; m.stk = 0;
    }
    D.due = D.due.filter(e => e.at >= 0);
  }
}

/** a step of one of Security's staff: at rest, on its round, at the glass, answering an alarm, at a board, shutting a
 *  door, searching, after you, fleeing, or lying low */
export function husk(sim: Sim, m: Mutant): void {
  const F = own(sim, m), d = m.d;
  if (m.round) m.peered += dt;
  switch (m.state) {
    case 'idle': {
      if (notices(sim, m) || noticesDoor(sim, m)) break;
      /* one with a round goes back to it, where it left off */
      if (m.round) { m.state = 'round'; m.dest = -1; m.wt = 0; m.st = 0; break; }
      if (!m.post) roam(sim, m, pace(m, 'walk'));
      break;
    }
    case 'round': {
      if (blowStep(sim, m)) break;
      if (notices(sim, m) || noticesDoor(sim, m)) break;
      walkRound(sim, m);
      break;
    }
    case 'peer': {
      /* at the glass, its face to it, looking in at you; then on with its round, past the stop it was at */
      m.peered = 0;
      if (Math.hypot(m.wx - m.x, m.wz - m.z) > 0.15) go(sim, m, m.wx, m.wz, pace(m, 'round'));
      else turnTo(sim, m, 3);
      if ((m.st -= dt) > 0) break;
      const R = m.round!, P = R[m.beat % R.length];
      if (P.tries) { m.beat = (m.beat + 1) % R.length; if (m.beat === 0) m.lap++; }
      m.state = 'round'; m.dest = -1; m.wt = 0; m.st = 0;
      break;
    }
    case 'answer': {
      /* to the alarm, in a hurry; there, it stands and looks about a while before its rounds again */
      if (notices(sim, m)) break;
      if (!m.F || m.dest < 0 || m.spot === m.dest || m.F[m.spot] < 1.5) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 6, 12); break; }
      if (follow(sim, m, m.F, pace(m, hurried(sim, m) ? 'rally' : 'answer'), false)) m.stk = 0;
      else if ((m.stk += dt) > 3) { m.stk = 0; m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); }
      break;
    }
    case 'fix': {
      /* a drill: the lights went, so to the board, and the breaker back on (drill(), below) */
      if (notices(sim, m)) break;
      const D = sim.drills.find(q => q.spot === m.dest);
      if (!D || !m.F || m.dest < 0 || !Number.isFinite(m.F[m.spot])) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); break; }
      if (m.spot === m.dest || m.F[m.spot] < 1.5) {
        turnTo(sim, m, 6);
        if ((m.st -= dt) <= 0) {
          /* back on; and someone threw it. It turns from the board and looks about for who */
          restore(sim, D);
          m.state = 'search'; m.st = rnd(sim, SEARCH.time[0], SEARCH.time[1]); m.dest = -1; m.wx = m.x; m.wz = m.z;
          m.wt = rnd(sim, SEARCH.look[0], SEARCH.look[1]); m.wm = m.yaw + Math.PI;
        }
        break;
      }
      m.st = 1.2;
      if (follow(sim, m, m.F, pace(m, 'fix'), false)) m.stk = 0; // to the board, slowly
      else if ((m.stk += dt) > 4) { m.stk = 0; m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); }
      break;
    }
    case 'shut': {
      /* to a door it saw left open: there, it looks through a moment, then shuts it, if it still stands open */
      if (notices(sim, m)) { m.door = -1; break; }
      const d = sim.doors[m.door];
      const done = (wt: number) => { m.state = 'idle'; m.door = -1; m.dest = -1; m.wt = wt; };
      if (!d || !leftOpen(sim, d) || !m.F || m.dest < 0) { done(rnd(sim, 2, 4)); break; }
      if (m.spot === m.dest || m.F[m.spot] < 1.2) {
        const at = doorMid(d);
        turnToward(m, Math.atan2(at.x - m.x, at.z - m.z), 4);
        if ((m.st -= dt) > 0) break;
        if (occupied(d, riders(sim))) { m.st = 0.5; break; }
        if (d.def.kind !== 'heavy' || power(sim.game, d.def.circuit) >= 2) { d.open = false; sfx(sim.game, 'door', { ...at, y: d.def.y0 }); }
        done(rnd(sim, 3, 6));
        break;
      }
      if (follow(sim, m, m.F, pace(m, 'shut'), false)) m.stk = 0;
      else if ((m.stk += dt) > 3) done(rnd(sim, 2, 4));
      break;
    }
    case 'search': {
      if (notices(sim, m) || (seeP(sim, m, SEARCH.see) && hunt(sim, m))) break;
      if ((m.st -= dt) <= 0) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 4); break; }
      /* stopped, looking round: it turns to look one way, slowly */
      if (m.wt > 0) { m.wt -= dt; turnToward(m, m.wm, 1.6); break; }
      if (m.dest < 0 || !m.F) {
        const k = searchSpot(sim, m);
        if (k < 0) { m.wt = 1; break; }
        m.F = fieldTo(sim, m, k);
        if (!Number.isFinite(m.F[m.spot])) { m.F = null; m.wt = 1; break; }
        m.dest = k;
      }
      if (m.spot === m.dest || m.F[m.spot] < 1.2) { m.dest = -1; m.wt = rnd(sim, SEARCH.look[0], SEARCH.look[1]); m.wm = m.yaw + rnd(sim, -2.2, 2.2); break; }
      if (follow(sim, m, m.F, pace(m, 'search'), false)) m.stk = 0;
      else if ((m.stk += dt) > 2) { m.stk = 0; m.dest = -1; m.wt = 1; }
      break;
    }
    case 'hunt':
      if (blowStep(sim, m)) break;
      if (m.hp < m.max * 0.4 && !m.fled && d > 2.8) { m.state = 'flee'; m.st = 7; m.fled = true; step_(sim, m, 'moan'); break; }
      if (seeP(sim, m, 22)) m.lost = 0; else m.lost += dt;
      if (m.lost > 8) { m.state = 'idle'; m.dest = -1; m.wt = rnd(sim, 2, 5); break; }
      if (inStart(m, MOVES.husk) && takesYou(sim, m)) break;
      if (inStart(m, MOVES.husk)) { turnTo(sim, m, 10); if (m.cd <= 0) { beginBlow(sim, m, MOVES.husk); m.pat = 0; } }
      else if (waits(sim, m)) { m.pat += dt; hover(sim, m, WAIT.ring); }
      /* one that carries its card comes through the card doors between, if that is the way to you */
      else if (F) chase(sim, m, pace(m, 'hunt'), m.cards && !Number.isFinite(F[m.spot]) && sim.fields ? staffField(sim, sim.fields) : F);
      break;
    case 'flee':
      m.st -= dt;
      away(sim, m, pace(m, 'flee'), F);
      if (m.st < 0) { m.state = 'lurk'; m.st = rnd(sim, 14, 22); m.dest = -1; m.wt = 0; }
      break;
    case 'lurk':
      m.st -= dt;
      roam(sim, m, pace(m, 'lurk'));
      if (m.st < 0) { m.state = 'idle'; m.hp = Math.min(m.max, m.hp + 20); m.fled = false; }
      break;
  }
  if (m.mv > 0) footfall(sim, m);
}
