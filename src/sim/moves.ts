/* Moves and reactions (engine.md §6, F2). One kind of blow for everything that fights: a wind-up (the tell), a strike
   (the short part that lands), and a recovery (your time, longer when it met nothing). Yours are worked out from what
   you hold; the cast's are written here. Over every blow sits the reaction ladder: a hit takes poise, and what it does
   depends on what is left. Thresholds, never a roll: the same blow does the same thing every time, so it can be learned.

   - none: it took the hit and goes on. A blow in a part that has armour (the axe coming down, a thresher's arms) is
     not stopped by a hit lighter than its armour.
   - flinch: a wind-up or strike is lost; a moment's pause.
   - stagger: its poise is broken. It reels, open, for a while, and its poise comes back whole.

   Knocked down and thrown (the rungs past stagger) come with the knockdowns (§6). */

export interface Move {
  /** seconds of each motion; recovery after a blow that landed, and after one that met nothing; a rest after that */
  wind: number; strike: number; rec: number; miss: number; cd: number;
  /** how fast it turns to follow you as it winds up, and how far through the wind-up it stops turning (and following:
   *  until then it creeps after you at `creep` m/s if you back out of its start, so backing off does not dodge it;
   *  stepping aside once it has stopped does) */
  turn: number; lock: number; creep: number;
  /** how near it comes before it begins, how far past its own edge the blow reaches, the cosine of half the arc it
     sweeps, and how far it lunges as it strikes */
  start: number; reach: number; arc: number; lunge: number;
  dmg: number;
  /** the poise a blow that lands takes */
  poise: number;
  /** the hit it shrugs off while winding up, and while striking, without losing the blow (it still costs it poise) */
  armour: { wind: number; strike: number };
  /** what it makes heard as it winds up */
  tell: string;
  big?: boolean;
}

const deg = (a: number) => Math.cos((a * Math.PI) / 180);

export const MOVES = {
  /* overhead, with one arm: wide, as an arm comes down, and slow to come back from */
  husk: { wind: 0.55, strike: 0.12, rec: 0.5, miss: 0.85, cd: 0.3, turn: 10, lock: 0.7, creep: 1.8, start: 0.85, reach: 1.0, arc: deg(55), lunge: 0.3, dmg: 20, poise: 20, armour: { wind: 0, strike: 12 }, tell: 'heave' },
  /* it rears and drops on you: narrow, and further forward than it looks. A jab does not put it off its drop */
  skitter: { wind: 0.5, strike: 0.1, rec: 0.4, miss: 0.7, cd: 0.45, turn: 6, lock: 0.6, creep: 0, start: 0.75, reach: 0.75, arc: deg(35), lunge: 0.5, dmg: 22, poise: 18, armour: { wind: 10, strike: 14 }, tell: 'skit' },
  bigSkitter: { wind: 0.7, strike: 0.15, rec: 0.7, miss: 1.1, cd: 0.6, turn: 5, lock: 0.6, creep: 0, start: 1.1, reach: 1.1, arc: deg(45), lunge: 0.6, dmg: 45, poise: 34, armour: { wind: 18, strike: 28 }, tell: 'skit', big: true },
  /* both arms, side to side: hard to get round, hard to stop, but a long time open after */
  thresher: { wind: 0.6, strike: 0.15, rec: 0.9, miss: 1.3, cd: 0.4, turn: 6, lock: 0.65, creep: 1.0, start: 0.7, reach: 0.9, arc: deg(70), lunge: 0.25, dmg: 45, poise: 45, armour: { wind: 30, strike: 60 }, tell: 'growl', big: true },
  /* a worm's or a swimmer's is hardly a blow: a short rasp, the head lifted and the hand drawn back, then a grab. Quick
     to see, quick to be over: a step back as it lifts is enough */
  worm: { wind: 0.3, strike: 0.08, rec: 0.25, miss: 0.4, cd: 1.0, turn: 8, lock: 0.5, creep: 0, start: 0.7, reach: 0.75, arc: deg(60), lunge: 0.15, dmg: 12, poise: 8, armour: { wind: 0, strike: 0 }, tell: 'rasp' },
  swimmer: { wind: 0.3, strike: 0.08, rec: 0.25, miss: 0.4, cd: 0.9, turn: 8, lock: 0.5, creep: 0, start: 0.7, reach: 0.75, arc: deg(60), lunge: 0.2, dmg: 15, poise: 10, armour: { wind: 0, strike: 0 }, tell: 'rasp' },
} satisfies Record<string, Move>;

/* ---- the ladder */

/** how much a body can take before it reels; what it gets back once left alone, and after how long */
export const POISE = {
  you: 30, husk: 25, skitter: 20, bigSkitter: 40, worm: 12, swimmer: 12, thresher: 70, hand: 90, bloat: 1e9, other: 30,
  /** seconds without a hit before it comes back, and how much of the whole a second */
  calm: 1.0, regain: 0.5,
};

export type Reaction = 'none' | 'flinch' | 'stagger';

/** a hit of `hit` poise on a body with `left` of it, in a part with `armour`: what it does, and what poise is left */
export function react(left: number, max: number, hit: number, armour: number): { r: Reaction; left: number } {
  if (hit <= 0) return { r: 'none', left };
  const now = left - hit;
  if (now <= 0) return { r: 'stagger', left: max };
  return { r: hit > armour ? 'flinch' : 'none', left: now };
}

/** a step of getting poise back: none while it is still being hit, then quickly */
export function regain(left: number, max: number, calm: number, dt: number): number {
  return calm < POISE.calm ? left : Math.min(max, left + max * POISE.regain * dt);
}

/* ---- yours: what you hold makes the blow */

/** what a swing of yours carries and costs, from the weapon's mass and kind (engine.md §6, F2) */
export interface Swing {
  /** the poise a full blow takes */
  poise: number;
  /** what a full blow shrugs off between letting go and landing: a heavy weapon trades, a light one does not */
  armour: number;
  /** the step forward a full blow carries you (m/s, along the blow) */
  lunge: number;
  /** recovery after a full blow that met nothing (s): the weight of it carries on */
  miss: number;
  /** how long a full load can be held before the arm drops it (s) */
  tire: number;
}

export function swingOf(kind: 'blunt' | 'edge' | 'fist' | 'gun', mass: number): Swing {
  return {
    poise: kind === 'fist' ? 4 : kind === 'edge' ? 9 * mass : 12 * mass,
    armour: mass >= 2 ? 25 + 5 * mass : 0,
    lunge: 1 + 0.6 * mass,
    miss: 0.15 + 0.12 * mass,
    tire: 1.4 - 0.2 * mass,
  };
}

/** your pace, as a share of it, while loading a blow, throwing it, coming back from it, and reeling; backing off as
 *  you do any of those goes at a share of that again */
export const PACE = { load: 0.55, swing: 0.4, rec: 0.7, reel: 0.3, back: 0.6 };

/** how long you reel when your poise breaks (s), and how hard it pushes you from the blow (m/s) */
export const REEL = { you: 0.7, push: 2.5 };
