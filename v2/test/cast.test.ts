import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give } from '../src/sim/game';
import { field } from '../src/world/nav';
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
    const b = s.player.body, d = field(nav, nav.locate(b.x, b.y, b.z), () => 0);
    expect(d.filter(v => v === Infinity).length).toBe(0);
  });

  it('a field for each kind of body: big ones keep out of doors; sound is muffled by a shut one', () => {
    const s = fresh(), F = s.fields!;
    const husk = s.cast[5], spot = F.nav.locate(husk.x, husk.y, husk.z); // in the Cargo cavern
    expect(F.hands[spot]).toBeLessThan(Infinity);
    expect(F.big[spot]).toBe(Infinity); // the way there is through doors
    expect(F.crawl[spot]).toBe(Infinity); // Cargo is dead: its door stays shut to what has no hands
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
  it('a swing must be loaded: let go early and nothing happens; loaded, it lands', () => {
    const s = fresh(), w = s.cast[7]; // a worm in the cavern
    only(s, []);
    w.stun = 1e9;
    give(s.game, 'pipe');
    faceOff(s, w, 1.2, 0.3);
    hold(s, 0.3, { attack: true });
    hold(s, 0.5);
    expect(w.hp).toBe(40);
    hold(s, 1.1, { attack: true });
    hold(s, 0.5);
    expect(w.hp).toBeLessThan(40);
    expect(w.hp).toBeGreaterThan(0);
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
