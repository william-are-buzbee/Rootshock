import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give } from '../src/sim/game';
import { field, openRules } from '../src/world/nav';
import { refreshFields } from '../src/sim/fields';
import type { Mutant } from '../src/sim/cast';

/* The cast on the upper station: the graph they walk, what they notice, how they follow, and what hurts them. */

const level = buildUpper(STATION.ladders);
const fresh = (seed = 7) => makeSim(level, { seed, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
/** put a body somewhere and let the world know */
function place(s: Sim, who: Mutant | 'player', x: number, y: number, z: number): void {
  const b = who === 'player' ? s.player.body : who.body!;
  b.x = x; b.y = y; b.z = z; b.vy = 0; b.sync();
  if (who !== 'player') { who.x = who.px = x; who.y = who.py = y; who.z = who.pz = z; }
}
/** stand `dist` from it on whichever side has room, and look at it */
function faceOff(s: Sim, m: Mutant, dist: number, at = 0.5): void {
  for (const a of [-Math.PI / 2, Math.PI / 2, 0, Math.PI]) {
    const x = m.x + Math.sin(a) * dist, z = m.z + Math.cos(a) * dist;
    if (s.world.overlap({ x, z, hx: 0.32, hz: 0.32, round: true }, m.y + 0.05, m.y + 1.8)) continue;
    if (s.world.raycast(x, m.y + 1.62, z, m.x, m.y + at, m.z, d => d.kind === 'body') < 1) continue;
    place(s, 'player', x, m.y, z);
    face(s, m.x, m.y + at, m.z);
    return;
  }
  throw new Error('no room about ' + m.type);
}
/** everyone else stands still (stunned) so a test sees one at a time */
const only = (s: Sim, keep: Mutant[]) => { for (const m of s.cast) if (!keep.includes(m)) m.stun = 1e9; };
/** look at a point from where you stand */
function face(s: Sim, x: number, y: number, z: number): void {
  const b = s.player.body, dx = x - b.x, dz = z - b.z;
  s.player.yaw = Math.atan2(-dx, -dz);
  s.player.pitch = Math.atan2(y - (b.y + 1.62), Math.hypot(dx, dz));
}

describe('the nav graph', () => {
  it('reaches every room, and everything that walks stands on it', () => {
    const s = fresh(), F = s.fields!, nav = F.nav;
    for (const R of s.world.rooms) expect(nav.byRoom.get(R.id)?.length ?? 0, R.name).toBeGreaterThan(0);
    for (const m of s.cast) if (m.body) expect(nav.locate(m.x, m.y, m.z), `${m.type} at ${m.x},${m.z}`).toBeGreaterThanOrEqual(0);
    /* on foot, with no doors in the way, every spot is reachable from your cell, platforms included */
    const b = s.player.body, d = field(nav, nav.locate(b.x, b.y, b.z), openRules(nav));
    expect(d.filter(v => v === Infinity).length).toBe(0);
  });

  it('a field for each kind of body: big ones keep out of doors; shut doors muffle sound; none runs on for ever', () => {
    const s = fresh(), F = s.fields!, nav = F.nav;
    expect(F.hands[nav.locate(150, 0, -1)]).toBe(Infinity); // 90 m and more from your cell: beyond any hunt
    place(s, 'player', 102, 0, -1); // by the Cargo door, dead at the start
    refreshFields(s, F);
    const spot = nav.locate(114, 0, -1); // just through it
    expect(F.hands[spot]).toBeLessThan(20); // a hand slides it
    expect(F.crawl[spot]).toBe(Infinity); // what has no hands waits behind it
    expect(F.big[spot]).toBe(Infinity); // the big ones take no doors
    expect(F.sound[spot]).toBeGreaterThan(F.hands[spot]); // and it muffles what you do
  });
});

describe('what they notice', () => {
  it('a husk does not see you crouched and still behind it; it hears you run', () => {
    const s = fresh(), m = s.cast[1]; // the Operations corridor
    only(s, [m]);
    m.post = true; m.yaw = Math.PI / 2; // facing east, keeping its place
    place(s, m, 82, 0, -1);
    place(s, 'player', 77, 0, -1);
    face(s, 82, 1, -1);
    hold(s, 0.1, { crouch: true });
    hold(s, 2);
    expect(m.state).toBe('idle');
    hold(s, 0.1, { crouch: true }); // stand
    hold(s, 0.4, { forward: 1, run: true });
    expect(m.state).toBe('hunt');
  });

  it('one that has seen you comes, and hurts', () => {
    const s = fresh(), m = s.cast[1];
    only(s, [m]);
    m.yaw = -Math.PI / 2; // facing you
    place(s, m, 84, 0, -1);
    place(s, 'player', 76, 0, -1);
    face(s, 84, 1, -1);
    hold(s, 0.5);
    expect(m.state).toBe('hunt');
    hold(s, 5);
    expect(Math.hypot(m.x - 76, m.z + 1)).toBeLessThan(1.6);
    expect(s.game.hp).toBeLessThan(100);
  });
});

describe('how they follow', () => {
  it('a husk slides a dead door open by hand to come through it', () => {
    const s = fresh(), m = s.cast[5], d = s.doors[7]; // the Cargo door, x 109: dead at the start
    only(s, [m]);
    s.game.hp = 1e9;
    expect(d.t).toBe(0);
    place(s, m, 116, 0, -1);
    place(s, 'player', 102, 0, -1);
    m.state = 'hunt';
    hold(s, 8);
    expect(d.open).toBe(true);
    expect(m.x).toBeLessThan(108);
  });

  it('with Cargo on its backup set, a husk calls the platform and rides it up after you', () => {
    const s = fresh(), m = s.cast[5], nav = s.fields!.nav;
    s.game.station!.circuits.CARGO.back = true;
    only(s, [m]);
    s.game.hp = 1e9;
    /* you, on Tier 1 beside the first platform's top */
    let top = -1;
    for (let i = 0; i < nav.n; i++) if (Math.abs(nav.y[i] - 5) < 0.3 && nav.x[i] > 135 && nav.x[i] < 137 && nav.z[i] > -7 && nav.z[i] < -5) top = i;
    expect(top).toBeGreaterThanOrEqual(0);
    place(s, 'player', nav.x[top], 5, nav.z[top]);
    place(s, m, 124, 0, -3);
    m.state = 'hunt';
    hold(s, 25);
    expect(m.y).toBeCloseTo(5, 0);
    expect(Math.hypot(m.x - nav.x[top], m.z - nav.z[top])).toBeLessThan(3);
  });
});

describe('fighting', () => {
  it('a swing let go early is a jab: it lands for less than a loaded one, and the arm is slow to come back', () => {
    const blow = (secs: number) => {
      const s = fresh(), w = s.cast[7]; // a worm in the cavern
      only(s, []);
      w.stun = 1e9;
      give(s.game, 'pipe');
      faceOff(s, w, 1.2, 0.3);
      hold(s, secs, { attack: true });
      hold(s, 0.5);
      return { s, lost: 40 - w.hp };
    };
    const jab = blow(0.1), full = blow(1.1);
    expect(jab.lost).toBeGreaterThan(0);
    expect(full.lost).toBeGreaterThan(jab.lost * 1.5);
    /* straight after a jab, a press does not start another */
    const s = jab.s;
    s.hands.rec = 0.2;
    hold(s, STEP, { attack: true });
    expect(s.hands.chg).toBe(-1);
  });

  it('a blow that lands holds the swing still a moment, and says so', () => {
    const s = fresh(), w = s.cast[7];
    only(s, []);
    w.stun = 1e9;
    give(s.game, 'pipe');
    faceOff(s, w, 1.2, 0.3);
    hold(s, 1.1, { attack: true });
    s.game.events.length = 0;
    let stopped = false;
    for (let t = 0; t < 0.5; t += STEP) { step(s, noInput()); if (s.hands.stop > 0) stopped = true; }
    expect(stopped).toBe(true);
    expect(s.game.events.some(e => e.type === 'impact')).toBe(true);
  });

  it('a husk blow can be stepped back from: it whiffs, and you are not hurt; one that lands says where it came from', () => {
    const s = fresh(), m = s.cast[5];
    only(s, [m]);
    s.game.hp = 100;
    faceOff(s, m, 1.1, 1.2);
    m.state = 'hunt';
    let wound = false;
    for (let t = 0; t < 1 && !wound; t += STEP) { step(s, noInput()); wound = m.wind > 0; }
    expect(wound).toBe(true);
    s.game.events.length = 0;
    hold(s, 0.45, { forward: -1 }); // backing off as it winds up
    expect(s.game.hp).toBe(100);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'whiff')).toBe(true);
    /* standing still for the next */
    s.game.events.length = 0;
    hold(s, 3);
    const hurt = s.game.events.find(e => e.type === 'hurt');
    expect(s.game.hp).toBeLessThan(100);
    expect(hurt?.type === 'hurt' && hurt.from).toBeTruthy();
  });

  it('a knock back slides: a step over a few frames, not all at once', () => {
    const s = fresh(), w = s.cast[7];
    only(s, []);
    w.stun = 1e9;
    give(s.game, 'pipe');
    faceOff(s, w, 1.2, 0.3);
    const x0 = w.x, z0 = w.z;
    let first = -1;
    hold(s, 1.1, { attack: true });
    for (let t = 0; t < 1 && first < 0; t += STEP) { step(s, noInput()); if (w.hp < 40) first = Math.hypot(w.x - x0, w.z - z0); }
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(0.15); // the step it was struck: only the start of the slide
    hold(s, 0.5);
    const total = Math.hypot(w.x - x0, w.z - z0);
    expect(total).toBeGreaterThan(0.2);
    expect(total).toBeLessThan(0.4);
  });

  it('a jab stuns and knocks back in proportion: much less than a loaded blow', () => {
    const blow = (secs: number) => {
      const s = fresh(), w = s.cast[7];
      only(s, []);
      give(s.game, 'pipe');
      faceOff(s, w, 1.2, 0.3);
      const x0 = w.x, z0 = w.z;
      w.stun = 0;
      hold(s, secs, { attack: true });
      let stun = 0;
      for (let t = 0; t < 1 && !stun; t += STEP) { step(s, noInput()); if (w.hp < 40) stun = w.stun; }
      w.stun = 1e9; // held still, so the slide is the knock alone
      hold(s, 0.5);
      return { stun, slid: Math.hypot(w.x - x0, w.z - z0) };
    };
    const jab = blow(0.1), full = blow(1.1);
    expect(jab.stun).toBeGreaterThan(0);
    expect(jab.stun).toBeLessThan(full.stun * 0.5);
    expect(jab.slid).toBeLessThan(full.slid * 0.5);
  });

  it('a swing lands on the one at the crosshair, not merely the nearest', () => {
    const s = fresh(), [a, b] = s.cast.filter(m => m.ai === 'worm');
    only(s, []);
    a.stun = b.stun = 1e9;
    give(s.game, 'pipe');
    const y = a.y, px = 220, pz = 2;
    place(s, 'player', px, y, pz);
    place(s, a, px + Math.cos(0.6) * 1.0, y, pz + Math.sin(0.6) * 1.0); // nearer, off to the side
    place(s, b, px + 1.5, y, pz); // further, straight ahead
    face(s, b.x, b.y + 0.36, b.z);
    hold(s, 1.1, { attack: true });
    hold(s, 0.5);
    expect(b.hp).toBeLessThan(40);
    expect(a.hp).toBe(40);
    /* look at the near one and it is the one struck */
    face(s, a.x, a.y + 0.36, a.z);
    hold(s, 1.1, { attack: true });
    hold(s, 0.5);
    expect(a.hp).toBeLessThan(40);
  });

  it('a pistol fires on the press, spends a round, is heard, and kills', () => {
    const s = fresh(), k = s.cast[4]; // the firing range skitter
    only(s, []);
    k.stun = 1e9;
    give(s.game, 'pistol'); give(s.game, 'ammo9');
    s.game.weapon = 'pistol';
    const rounds = () => s.game.inv.find(q => q.id === 'ammo9')?.n ?? 0, n0 = rounds();
    faceOff(s, k, 4);
    hold(s, STEP, { attack: true });
    expect(rounds()).toBe(n0 - 1);
    expect(s.game.noise).toBe(36);
    hold(s, 0.5);
    hold(s, STEP, { attack: true });
    hold(s, 0.2);
    expect(k.dead).toBe(true);
    expect(s.game.kills).toBe(1);
  });
});

describe('the whole cast', () => {
  it('runs the same way twice from the same seed', () => {
    const run = () => {
      const s = fresh(11);
      hold(s, 6, { forward: 1, yaw: 0.002 });
      return s.cast.map(m => [m.x.toFixed(4), m.z.toFixed(4), m.state].join()).join('|');
    };
    expect(run()).toBe(run());
  });

  it('costs little: twenty seconds of everyone, a step at a time', () => {
    const s = fresh();
    hold(s, 1);
    const t0 = performance.now();
    hold(s, 20, { forward: 1, run: true, yaw: 0.01 });
    const ms = (performance.now() - t0) / (20 / STEP);
    expect(ms).toBeLessThan(4);
  });
});
