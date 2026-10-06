import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { give, hurt } from '../src/sim/game';
import type { Mutant } from '../src/sim/cast';

/* Step 6: the things the parity audit found the first engine did and v2 did not, held to the first engine's way. */

const level = buildUpper(STATION.ladders);
const fresh = () => makeSim(level, { seed: 7, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
const sounds = (s: Sim, name: string) => s.game.events.filter(e => e.type === 'sfx' && e.name === name) as { d?: number }[];
function place(s: Sim, who: Mutant | 'player', x: number, y: number, z: number): void {
  const b = who === 'player' ? s.player.body : who.body!;
  b.x = x; b.y = y; b.z = z; b.vy = 0; b.sync();
  if (who !== 'player') { who.x = who.px = x; who.y = who.py = y; who.z = who.pz = z; }
}
const still = (s: Sim, keep: Mutant[] = []) => { for (const m of s.cast) if (!keep.includes(m)) m.stun = 1e9; };

describe('you', () => {
  it('are told why the door is open as you wake', () => {
    expect(fresh().game.events.some(e => e.type === 'say' && /lock on your cell has let go/.test(e.text))).toBe(true);
  });

  it('make footsteps: quieter walking, louder running, none crouched', () => {
    const s = fresh();
    still(s);
    place(s, 'player', 26, 0, -1); s.player.yaw = -Math.PI / 2; // along the Lobby, east
    s.game.events.length = 0;
    hold(s, 2, { forward: 1 });
    const walk = sounds(s, 'step');
    expect(walk.length).toBeGreaterThanOrEqual(3);
    expect(walk.every(e => e.d === 8)).toBe(true);
    place(s, 'player', 26, 0, -1);
    s.game.events.length = 0;
    hold(s, 1.5, { forward: 1, run: true });
    expect(sounds(s, 'step').some(e => e.d === 0)).toBe(true);
    place(s, 'player', 26, 0, -1);
    hold(s, 0.1, { crouch: true });
    s.game.events.length = 0;
    hold(s, 2, { forward: 1 });
    expect(sounds(s, 'step').length).toBe(0);
  });

  it('take a better weapon in hand as you pick it up, and keep the better one', () => {
    const s = fresh();
    give(s.game, 'baton');
    expect(s.game.weapon).toBe('baton');
    give(s.game, 'pipe');
    expect(s.game.weapon).toBe('pipe');
    give(s.game, 'knife'); // lighter than the pipe: into the bag
    expect(s.game.weapon).toBe('pipe');
  });

  it('hold four times the air with a rebreather on', () => {
    const s = fresh();
    give(s.game, 'rebreather');
    step(s, noInput());
    expect(s.player.airMax).toBe(150);
  });
});

describe('the cast, as the first engine had them', () => {
  it('you walk through a husk; it stops short of you rather than on you', () => {
    const s = fresh(), m = s.cast[1];
    still(s);
    place(s, m, 30, 0, -1);
    place(s, 'player', 27, 0, -1); s.player.yaw = -Math.PI / 2;
    hold(s, 1.5, { forward: 1 });
    expect(s.player.body.x).toBeGreaterThan(31); // through it and out the other side
    /* awake and hunting, it comes to arm's length and no nearer */
    m.stun = 0; m.state = 'hunt';
    place(s, 'player', 36, 0, -1); s.game.hp = 1e9;
    let nearest = 99;
    for (let t = 0; t < 4; t += STEP) { step(s, noInput()); nearest = Math.min(nearest, m.dp); }
    expect(nearest).toBeLessThan(1.3);
    expect(nearest).toBeGreaterThan(0.6);
  });

  it('a hunter follows you into a refuge (only their rounds keep out of one)', () => {
    const s = fresh(), m = s.cast[1], b = s.player.body, nav = s.fields!.nav;
    still(s, [m]);
    s.game.hp = 1e9;
    /* you in your cell; it in the hall outside, some way off along the way in */
    let from = -1;
    for (let i = 0; i < nav.n; i++) {
      const R = s.world.rooms[nav.room[i]], d = s.fields!.hands[i];
      if (!R.safe && d > 8 && d < 14 && nav.head[i] >= 1.8) { from = i; break; }
    }
    expect(from).toBeGreaterThanOrEqual(0);
    place(s, m, nav.x[from], nav.y[from], nav.z[from]);
    m.state = 'hunt';
    hold(s, 8);
    expect(Math.hypot(m.x - b.x, m.z - b.z)).toBeLessThan(1.6);
    expect(s.world.roomAt(m.x, m.y + 0.5, m.z)?.safe).toBe(true);
  });
});

describe('the station', () => {
  it('a platform called is heard, rattles on its way and lands with a thud', () => {
    const s = fresh();
    still(s);
    s.game.station!.circuits.CARGO.back = true;
    const P = s.platforms[0], call = s.usables.find(u => /Call the cargo platform/.test(u.label() ?? '') && Math.abs(u.y - P.def.y1 - 1.1) < 0.1)!;
    place(s, 'player', 136, 5, -6);
    s.game.events.length = 0;
    call.act();
    expect(s.game.noiseI).toBe(12);
    hold(s, 5);
    expect(sounds(s, 'hstep').length).toBeGreaterThan(0);
    expect(sounds(s, 'thud').length).toBe(1);
  });

  it('a wrong code is kept to be shown a moment; the ladder says where it goes; god mode hurts nothing', () => {
    const s = fresh();
    s.game.pad = { code: '1234', typed: '', door: 0 };
    for (const k of '9999') s.game.commands.push({ type: 'pad', key: k });
    step(s, noInput());
    expect(s.game.pad?.typed).toBe('');
    expect(s.game.pad?.miss).toBe('9999');
    expect(s.usables.some(u => u.label() === 'Ladder down: Main level')).toBe(true);
    s.game.god = true;
    hurt(s.game, 500, 'no');
    expect(s.game.hp).toBe(100);
  });
});
