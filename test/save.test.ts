import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { load, save } from '../src/sim/save';
import { give } from '../src/sim/game';

/* A save is everything that can change; loaded, a run plays on exactly as it would have. */

const level = buildUpper(STATION.ladders);
const opts = { seed: 5, station: STATION };
/** a walk about the place that does a bit of everything: turning, running, crouching, the light, swinging */
const script = (k: number): Input => ({
  ...noInput(), forward: k % 400 < 300 ? 1 : -1, strafe: k % 700 < 100 ? 1 : 0, run: k % 500 < 200, yaw: k % 240 < 60 ? 0.03 : -0.004,
  crouch: k % 900 === 0, light: k % 1300 === 5, attack: k % 120 < 70, jump: k % 333 === 0,
});
/** everything that can be compared, as text */
const state = (s: Sim) => JSON.stringify({ ...save(s), fields: null });

describe('save and load', () => {
  it('a loaded run plays on exactly as the original does', () => {
    const a = makeSim(level, opts);
    give(a.game, 'flash'); give(a.game, 'pipe');
    a.game.hp = 1e6; // live long enough to be compared
    a.game.station!.circuits.CARGO.back = true;
    for (let k = 0; k < 1500; k++) step(a, script(k));
    const data = JSON.parse(JSON.stringify(save(a))); // through text, as it would be stored
    const b = load(level, data, opts);
    expect(state(b)).toBe(state(a));
    for (let k = 1500; k < 2700; k++) { step(a, script(k)); step(b, script(k)); }
    expect(state(b)).toBe(state(a));
    expect(a.cast.some(m => m.state !== 'idle' || Math.hypot(m.x - m.hx, m.z - m.hz) > 1)).toBe(true); // they did something
  });

  it('keeps what was taken, searched, unlocked and switched', () => {
    const a = makeSim(level, opts);
    const body = a.usables.find(u => /Search the officer/.test(u.label() ?? ''))!;
    body.act();
    const item = a.usables.find(u => /Take flashlight/.test(u.label() ?? ''))!;
    item.act();
    a.doors[14].unlocked = true;
    a.game.station!.circuits.CARGO.back = true;
    const b = load(level, JSON.parse(JSON.stringify(save(a))), opts);
    expect(b.game.keys).toContain('s');
    expect(b.game.tools).toContain('flash');
    expect(b.usables.some(u => /Search the officer/.test(u.label() ?? '') && !u.off)).toBe(false);
    expect(b.usables.some(u => /Take flashlight/.test(u.label() ?? ''))).toBe(false);
    expect(b.doors[14].unlocked).toBe(true);
    expect(b.game.station!.circuits.CARGO.back).toBe(true);
    expect(b.game.notes.memo).toBeTruthy();
  });

  it('refuses a save of another level or another version', () => {
    const data = save(makeSim(level, opts));
    expect(() => load(level, { ...data, v: 99 }, opts)).toThrow(/version/);
    expect(() => load(level, { ...data, level: 'main' }, opts)).toThrow(/main/);
  });
});
