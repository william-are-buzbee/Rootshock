import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { buildMain } from '../src/content/levels/main';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { field } from '../src/world/nav';
import { carded, routeRules } from '../src/sim/fields';
import { answer, type Mutant } from '../src/sim/cast';
import { locked } from '../src/sim/movers';
import { doorAct } from '../src/sim/interact';

/* The changed (world.md §8, The second pass): Security's staff, intelligent but sedated. They carry their cards. */

const level = buildUpper(STATION.ladders);
const fresh = (seed = 7) => makeSim(level, { seed, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
function place(s: Sim, who: Mutant | 'player', x: number, y: number, z: number): void {
  const b = who === 'player' ? s.player.body : who.body!;
  b.x = x; b.y = y; b.z = z; b.vy = 0; b.sync();
  if (who !== 'player') { who.x = who.px = x; who.y = who.py = y; who.z = who.pz = z; }
}
const only = (s: Sim, keep: Mutant[]) => { for (const m of s.cast) if (!keep.includes(m)) m.stun = 1e9; };
const roomOf = (s: Sim, m: Mutant) => s.world.roomAt(m.x, m.y + 0.5, m.z)?.name;
/** the briefing room's card door, off the wing's corridor */
const briefDoor = (s: Sim) => s.doors.find(d => d.def.card === 's')!;
/** send one of the staff to a spot, as an alarm would: the way there by the level's shape, doors met as they come */
const sendTo = (s: Sim, m: Mutant, x: number, z: number) => {
  const F = s.fields!, spot = F.nav.locate(x, 0, z);
  answer(s, m, spot, field(F.nav, spot, routeRules(s, F, m.walker)));
};
/** a husk on its rounds, put in the wing's corridor by the briefing room's door; you out of it all, a storey down */
const setUp = (mended: boolean) => {
  const s = fresh(), m = s.cast.find(q => q.ai === 'husk' && !q.post && q.cards)!;
  only(s, [m]);
  if (mended) { s.game.station!.circuits.SEC.broken = false; s.lighting = null; }
  place(s, 'player', 30, -4.5, -25);
  place(s, m, 63, 0, -1);
  hold(s, 0.2);
  return { s, m };
};

describe('they carry their cards', () => {
  it('a card door with power lets one of them through, then shuts behind it, still locked to you', () => {
    const { s, m } = setUp(true), d = briefDoor(s);
    expect(carded(s, d)).toBe(true);
    s.game.events.length = 0;
    sendTo(s, m, 63, -11);
    let through = false;
    for (let t = 0; t < 20 && !through; t += STEP) { step(s, noInput()); through = roomOf(s, m) === 'Briefing room'; }
    expect(through).toBe(true);
    expect(s.game.events.some(e => e.type === 'sfx' && e.name === 'take')).toBe(true); // the reader's beep
    hold(s, 6);
    expect(d.t).toBeLessThan(0.1);
    expect(locked(d)).toBe(true);
    s.game.events.length = 0;
    doorAct(s, d);
    expect(s.game.events.some(e => e.type === 'say' && /reader wants/.test(e.text))).toBe(true);
  });

  it('a dark reader reads no card: with the wing cut, the door holds them as it holds you', () => {
    const { s, m } = setUp(false);
    expect(carded(s, briefDoor(s))).toBe(false);
    sendTo(s, m, 63, -11);
    hold(s, 12);
    expect(roomOf(s, m)).not.toBe('Briefing room');
  });

  it('a lockdown\'s bolt beats a card', () => {
    const { s } = setUp(true), d = briefDoor(s);
    d.down = true;
    expect(carded(s, d)).toBe(false);
  });

  it('only Security\'s own staff carry them: Cargo\'s keep to their dark, the card door between them shut', () => {
    const s = fresh(), staff = s.cast.filter(q => q.ai === 'husk' && q.cards).map(q => roomOf(s, q));
    expect(staff.length).toBeGreaterThan(3);
    expect(staff).not.toContain('Cargo cavern');
    expect(s.cast.filter(q => q.ai === 'husk' && roomOf(s, q) === 'Cargo cavern').every(q => !q.cards)).toBe(true);
  });

  it('only Security\'s staff carry them: elsewhere a card door keeps out what lives there', () => {
    const s = makeSim(buildMain(STATION.ladders), { seed: 7, station: STATION });
    const d = s.doors.find(q => q.def.card)!;
    expect(d).toBeTruthy();
    expect(carded(s, d)).toBe(false);
  });
});
