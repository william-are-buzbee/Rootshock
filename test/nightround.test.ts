import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { looseLights, makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { ROUND, type Mutant } from '../src/sim/cast';

/* The night round (world.md §8): one of the changed still walking the night shift's round with its flashlight on. It walks
   the dark by its beam, tries the readers on its round with its card, and its beam lights you for anything that sees. */

const level = buildUpper(STATION.ladders);
const fresh = (seed = 7) => makeSim(level, { seed, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
function place(s: Sim, who: Mutant | 'player', x: number, y: number, z: number): void {
  const b = who === 'player' ? s.player.body : who.body!;
  b.x = x; b.y = y; b.z = z; b.vx = b.vz = 0; b.vy = 0; b.sync();
  if (who !== 'player') { who.x = who.px = x; who.y = who.py = y; who.z = who.pz = z; }
}
/** the night round alone; you a storey down in the suite, out of it all */
const setUp = () => {
  const s = fresh(), m = s.cast.find(q => q.type === 'nightround')!;
  for (const q of s.cast) if (q !== m) q.stun = 1e9;
  place(s, 'player', 30, -4.5, -25);
  hold(s, 0.1);
  return { s, m };
};
const roomOf = (s: Sim, m: Mutant) => s.world.roomAt(m.x, m.y + 0.5, m.z)?.name;
const beeps = (s: Sim) => s.game.events.filter(e => e.type === 'sfx' && (e.name === 'take' || e.name === 'deny')).map(e => (e as { name: string }).name);

describe('the night round', () => {
  it('walks its round in the dark wing, stop to stop, where the rest of the changed will not go', () => {
    const { s, m } = setUp();
    expect(m.round!.length).toBeGreaterThan(4);
    expect(m.cards).toBe(true);
    const wing = s.world.rooms.find(R => R.name === 'Security corridor')!;
    expect(Math.max(...s.lighting!.room(wing.id))).toBe(0); // cut: dark
    const seen: number[] = [m.beat], rooms = new Set<string>();
    for (let t = 0; t < 90; t += STEP) {
      step(s, noInput());
      if (m.beat !== seen[seen.length - 1]) seen.push(m.beat);
      const r = roomOf(s, m);
      if (r) rooms.add(r);
    }
    expect(seen.slice(0, 5)).toEqual([0, 1, 2, 3, 4]); // in order
    expect([...rooms].every(r => r === 'Security corridor' || r === 'Lobby')).toBe(true);
    expect(m.state).toBe('round');
  });

  it('its beam lights what it points at, and you in it: seen crouched and still in the dark, where one without a light would pass you by', () => {
    const run = (torch: boolean) => {
      const { s, m } = setUp();
      m.torch = torch;
      place(s, m, 52, 0, -1); m.yaw = -Math.PI / 2; m.wm = m.yaw; // in the wing's corridor, looking west down it
      m.state = 'round'; m.dest = -1; m.wt = 6; m.st = 0; // stopped at a stop, looking about
      place(s, 'player', 46, 0, -1); s.player.yaw = -Math.PI / 2; // 6 m ahead of it, your back to it
      hold(s, 0.1, { crouch: true });
      let vis = 0;
      for (let t = 0; t < 5 && m.state !== 'hunt'; t += STEP) { step(s, noInput()); vis = Math.max(vis, s.game.vis); }
      return { state: m.state, vis: Math.max(vis, s.game.vis) };
    };
    const dark = run(false), lit = run(true);
    expect(dark.state).not.toBe('hunt');
    expect(dark.vis).toBeLessThan(0.25);
    expect(lit.state).toBe('hunt');
    expect(lit.vis).toBeGreaterThan(0.5); // what the cameras see you by too (sim/eyes.ts, camSees)
  });

  it('tries the reader at a door on its round: nothing from a dark one; green, and through, with power; red where its card does not open it', () => {
    const at = (mended: boolean, cards = true) => {
      const { s, m } = setUp();
      if (mended) { s.game.station!.circuits.SEC.broken = false; s.lighting = null; }
      m.cards = cards;
      place(s, m, 60, 0, -1); m.beat = 0; m.state = 'round'; m.dest = -1; m.wt = 0;
      const d = s.doors.find(q => q.def.card === 's')!; // the briefing room's, its first stop
      s.game.events.length = 0;
      let lit = false, ok = false;
      for (let t = 0; t < 20 && m.beat === 0; t += STEP) { step(s, noInput()); if (d.beep > 0) { lit = true; ok = d.beepOk; } }
      return { heard: beeps(s), lit, ok, beat: m.beat };
    };
    const dark = at(false);
    expect(dark.heard).toEqual([]);
    expect(dark.lit).toBe(false);
    expect(dark.beat).toBe(1); // and on
    const green = at(true);
    expect(green.heard).toContain('take');
    expect(green.lit && green.ok).toBe(true);
    const red = at(true, false);
    expect(red.heard).toEqual(['deny']);
    expect(red.lit && !red.ok).toBe(true);
    expect(red.beat).toBe(1);
  });

  it('taken off its round, it comes back to it where it left off', () => {
    const { s, m } = setUp();
    m.beat = 3; m.state = 'hunt'; m.lost = 7.5; // after you, and has lost you
    hold(s, 1);
    expect(m.state).toBe('round');
    expect(m.beat).toBe(3);
  });

  it('dies, and its light with it', () => {
    const { s, m } = setUp();
    expect(looseLights(s).some(L => L.key === 'torch' + m.id)).toBe(true);
    m.dead = true;
    expect(looseLights(s).some(L => L.key === 'torch' + m.id)).toBe(false);
  });

  it('slow on its round, slower after you than the rest', () => {
    expect(ROUND.pace).toBeLessThan(1.3); // the others' rounds
    expect(ROUND.hunt).toBeLessThan(3.5);
  });

  it('a save made on its round plays on the same', async () => {
    const { s } = setUp();
    hold(s, 4);
    const { load, save } = await import('../src/sim/save');
    const a = load(level, JSON.parse(JSON.stringify(save(s))), { seed: 7, station: STATION });
    hold(s, 5); hold(a, 5);
    expect(JSON.stringify(save(a))).toBe(JSON.stringify(save(s)));
  });
});
