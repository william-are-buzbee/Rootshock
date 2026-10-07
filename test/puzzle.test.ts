import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, simLighting, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { power } from '../src/sim/game';
import { eyeHeight } from '../src/sim/player';
import { STEP } from '../src/core/loop';
import type { Usable } from '../src/sim/interact';
import { circle } from '../src/world/shapes';

/* The upper station's gates, played headless through the real interaction: stand near a thing, look at it, press E. */

const level = buildUpper(STATION.ladders);
const fresh = () => makeSim(level, { seed: 7, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
const said = (s: Sim) => s.game.events.filter(e => e.type === 'say').map(e => (e as { text: string }).text);

/** the usable whose label matches, nearest to (x, z) if given */
function find(s: Sim, label: RegExp, near?: [number, number]): Usable {
  const all = s.usables.filter(u => !u.off && label.test(u.label() ?? ''));
  if (!all.length) throw new Error('nothing labelled ' + label);
  if (near) all.sort((a, b) => Math.hypot(a.x - near[0], a.z - near[1]) - Math.hypot(b.x - near[0], b.z - near[1]));
  return all[0];
}
/** stand 1.1 m from it on the side `from` (a unit vector on the plan), look straight at it, press E */
function use(s: Sim, u: Usable, from: [number, number]): string | null {
  const b = s.player.body;
  b.x = u.x + from[0] * 1.1; b.z = u.z + from[1] * 1.1; b.vy = 0;
  b.y = s.world.groundBelow(circle(b.x, b.z, b.r), u.y + 0.2); // the floor at its own height, not wherever you were
  b.sync();
  step(s, noInput()); // settle onto the floor there
  const p = s.player, dx = u.x - b.x, dz = u.z - b.z, dy = u.y - (b.y + eyeHeight(p));
  p.yaw = Math.atan2(-dx, -dz);
  p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
  s.game.events.length = 0;
  step(s, { ...noInput(), use: true });
  return s.focus?.text ?? null;
}
const doorAt = (s: Sim, x: number, z: number) => s.doors.find(d => x > d.def.x0 - 1 && x < d.def.x1 + 1 && z > d.def.z0 - 1 && z < d.def.z1 + 1)!;
/** plan metres of tile (i, j)'s centre on the upper station */
const tile = (i: number, j: number): [number, number] => [i * 2 - 10 + 1, j * 2 - 30 + 1];

describe('the upper station, played', () => {
  it('starts on the backup set: Ops half-lit, the wing cut off, Cargo dead, Gen-1 down', () => {
    const s = fresh();
    expect(power(s.game, 'OPS')).toBe(1);
    expect(power(s.game, 'SEC')).toBe(0);
    expect(power(s.game, 'CARGO')).toBe(0);
    expect(power(s.game, 'LIFT')).toBe(0);
  });

  it('the wing\'s cut wants a splice kit; mended, it takes what Ops has, and its elevator goes down', () => {
    const s = fresh();
    use(s, find(s, /Elevator: Main level/), [-1, 0]);
    expect(said(s).join(' ')).toMatch(/The panel is dark/);
    const cut = find(s, /Service connection, Security wing: cut through/);
    use(s, cut, [0, 1]);
    expect(said(s).join(' ')).toMatch(/cut clean through/);
    expect(power(s.game, 'SEC')).toBe(0);
    use(s, find(s, /Take splice kit/, tile(47, 31)), [0, -1]); // the one in Maintenance, on Ops' side
    use(s, cut, [0, 1]);
    expect(said(s).join(' ')).toMatch(/You splice the feed/);
    expect(s.game.inv.some(i => i.id === 'kit')).toBe(false);
    expect(power(s.game, 'SEC')).toBe(1); // Ops' backup set, through the mended feed
    use(s, find(s, /Elevator: Main level/), [-1, 0]);
    expect(s.game.travel).toEqual({ level: 'main', mark: 'elev:upper' }); // the run takes you down
    s.game.travel = null;
    s.game.station!.circuits.OPS.back = false; // Ops' set stopped: the wing goes with it
    expect(power(s.game, 'SEC')).toBe(0);
    s.game.station!.main = true; // and on Gen-1, the wing has full power
    expect(power(s.game, 'SEC')).toBe(2);
    use(s, find(s, /Service connection, Security wing: closed/), [0, 1]);
    expect(said(s).join(' ')).toMatch(/The Security wing is cut off/);
    expect(power(s.game, 'SEC')).toBe(0);
  });

  it('a flashlight lies at the stair\'s foot, still on; taken, its light goes with it, and the dark has an answer', () => {
    const s = fresh();
    hold(s, 0.1, { light: true });
    expect(s.game.lightOn).toBe(false); // nothing to switch on yet
    const F = find(s, /Take flashlight/), lum = () => Math.max(...simLighting(s).atPoint(F.x, F.y + 0.3, F.z));
    expect(lum()).toBeGreaterThan(0.3);
    use(s, F, [0, 1]);
    expect(s.game.tools).toContain('flash');
    expect(s.game.events.some(e => e.type === 'relight')).toBe(true);
    expect(lum()).toBe(0);
    hold(s, 0.1, { light: true });
    expect(s.game.lightOn).toBe(true);
    const before = s.game.batt;
    hold(s, 3);
    expect(s.game.batt).toBeLessThan(before);
  });

  it('Security control\'s reader is dark while the wing is; mended, it wants the officer\'s card, and takes it', () => {
    const s = fresh();
    const [cx, cz] = tile(36, 12), d = doorAt(s, cx, cz);
    use(s, find(s, /Card reader: dark/, [cx, cz]), [0, 1]);
    expect(said(s).join(' ')).toMatch(/The reader is dark/);
    s.game.station!.circuits.SEC.broken = false; // as if the cut were mended
    use(s, find(s, /Card reader/, [cx, cz]), [0, 1]);
    expect(said(s).join(' ')).toMatch(/The reader wants: Security keycard/);
    hold(s, 1);
    expect(d.t).toBe(0); // locked: it does not open for you
    use(s, find(s, /Search the officer/), [1, 0]);
    expect(s.game.keys).toContain('s');
    use(s, find(s, /Card reader/, [cx, cz]), [0, 1]);
    expect(said(s).join(' ')).toMatch(/The reader takes the card/);
    const b = s.player.body; b.x = cx; b.z = cz + 2.2; b.sync();
    hold(s, 1.5);
    expect(d.t).toBeGreaterThan(0.9);
  });

  it('heavy doors will not move on the backup set; on Gen-1 the Armory keypad wants the run\'s code', () => {
    const s = fresh();
    const [ax, az] = tile(23, 16);
    expect(find(s, /Heavy door: no power/, [ax, az])).toBeTruthy();
    use(s, find(s, /Heavy door/, [ax, az]), [0, -1]);
    expect(said(s).join(' ')).toMatch(/The backup set cannot move a door this size/);
    s.game.station!.main = true; // as if Gen-1 had been brought back
    use(s, find(s, /Keypad/, [ax, az]), [0, -1]);
    expect(s.game.pad).not.toBeNull();
    for (const k of '0000') s.game.commands.push({ type: 'pad', key: k });
    step(s, noInput());
    if (s.game.code !== '0000') expect(s.game.pad?.typed).toBe(''); // wrong: it clears and waits
    for (const k of s.game.code) s.game.commands.push({ type: 'pad', key: k });
    step(s, noInput());
    expect(s.game.pad).toBeNull();
    use(s, find(s, /Door control: open/, [ax, az]), [0, -1]);
    hold(s, 1.5);
    expect(doorAt(s, ax, az).t).toBeGreaterThan(0.9);
  });

  it('with Cargo dead its doors slide by hand and its platform will not move; its backup set changes both', () => {
    const s = fresh();
    const [dx, dz] = tile(59, 14), d = doorAt(s, dx, dz);
    expect(d.def.circuit).toBe('CARGO');
    use(s, find(s, /Slide the door open/, [dx, dz]), [-1, 0]);
    hold(s, 1);
    expect(d.t).toBeGreaterThan(0.9);
    /* step onto the first platform: its button offers the ride up, and without power refuses */
    const P = s.platforms.find(p => p.def.y1 === 5)!, b = s.player.body;
    const onto = () => { b.x = (P.def.x0 + P.def.x1) / 2; b.z = (P.def.z0 + P.def.z1) / 2 + 1; b.y = 0; b.sync(); hold(s, 0.3); };
    onto();
    use(s, find(s, /Cargo platform: up/), [0, 1]);
    expect(said(s).join(' ')).toMatch(/No power to it/);
    expect(P.moving).toBe(false);
    use(s, find(s, /Backup set, Cargo: stopped/), [0, 1]);
    expect(power(s.game, 'CARGO')).toBe(1);
    expect(s.game.events.some(e => e.type === 'power')).toBe(true);
    /* now it answers: ride it up to Tier 1 */
    onto();
    use(s, find(s, /Cargo platform: up/), [0, 1]);
    expect(P.moving).toBe(true);
    hold(s, 4.5);
    expect(P.y).toBeCloseTo(5);
    expect(b.y).toBeCloseTo(5, 1);
  });

  it('ladderway B wants Cargo power; the fuse is up on Tier 3; the surface lift wants Gen-1', () => {
    const s = fresh();
    const B1: [number, number] = [263.2, 3.2]; // ladderway B, in the fan station
    use(s, find(s, /Ladder/, B1), [-1, 0]);
    expect(said(s).join(' ')).toMatch(/fan door is sealed/);
    s.game.station!.circuits.CARGO.back = true;
    use(s, find(s, /Ladder/, B1), [-1, 0]);
    expect(said(s).join(' ')).toMatch(/rung over rung/);
    expect(s.game.travel).toEqual({ level: 'main', mark: 'ladder:B1' }); // the run takes you down
    s.game.travel = null;
    use(s, find(s, /Take main fuse/), [0, 1]);
    expect(s.game.inv.map(i => i.id)).toContain('fuse');
    use(s, find(s, /Call the surface lift/), [0, 1]);
    expect(said(s).join(' ')).toMatch(/The call button is dead/);
  });

  it('notes can be read and are kept; a long fall hurts', () => {
    const s = fresh();
    use(s, find(s, /Read: isolation record, room 1/), [1, 0]);
    expect(s.game.read).toContain('intake');
    expect(s.game.events.some(e => e.type === 'note')).toBe(true);
    const b = s.player.body, [x, z] = tile(90, 11);
    b.x = x; b.z = z + 0.5; b.y = 15; b.sync(); // Tier 3, then off the edge to the floor
    b.z = z + 9; b.sync();
    hold(s, 3);
    expect(s.game.hp).toBeLessThan(100);
  });

  it('what you put down can be taken again, and a searched body stays searched', () => {
    const s = fresh();
    use(s, find(s, /Search the officer/), [1, 0]);
    use(s, find(s, /Take guard's baton/), [0, -1]);
    s.game.commands.push({ type: 'drop', slot: 0 });
    step(s, noInput());
    expect(s.game.inv.length).toBe(0);
    expect(s.usables.some(u => /Search the officer/.test(u.label() ?? '') && !u.off)).toBe(false);
    use(s, find(s, /Take guard's baton/), [0, 1]);
    expect(s.game.inv.map(i => i.id)).toEqual(['baton']);
  });

  it('the same seed gives the same codes, and a different one, different codes', () => {
    expect(fresh().game.code).toBe(fresh().game.code);
    expect(makeSim(level, { seed: 8, station: STATION }).game.code).not.toBe(fresh().game.code);
  });
});
