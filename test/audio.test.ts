import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { levelDef } from '../src/sim/run';
import { makeSim, step, type Sim } from '../src/sim/sim';
import { noInput, type Input } from '../src/sim/input';
import { STEP } from '../src/core/loop';
import { refreshFields } from '../src/sim/fields';
import { floorAt, hearing } from '../src/present/soundscape';

/* What the sound is told: what feet fall on, how a sound comes to you through the rooms, and the landings and jumps. The
   synthesis itself needs a browser; where a sound is does not. */

const sim = (id: string) => makeSim(levelDef(STATION, id), { seed: 7, station: STATION });
const hold = (s: Sim, secs: number, inp: Partial<Input> = {}) => { for (let t = 0; t < secs; t += STEP) step(s, { ...noInput(), ...inp }); };
const sounds = (s: Sim, name: string) => s.game.events.filter(e => e.type === 'sfx' && e.name === name) as { k?: number }[];

describe('feet', () => {
  it('fall on concrete in the station, rock in the cave, water where it stands', () => {
    const up = sim('upper'), b = up.player.body;
    expect(floorAt(up.world, b.x, b.y, b.z)).toBe('concrete');
    const cave = sim('cave'), c = cave.player.body;
    expect(floorAt(cave.world, c.x, c.y, c.z)).toBe('rock');
    const sump = sim('sump'), W = sump.world.water[0];
    expect(floorAt(sump.world, (W.x0 + W.x1) / 2, W.level - 0.2, (W.z0 + W.z1) / 2)).toBe('wet');
  });

  it('ring on a platform and knock on a crate', () => {
    const up = sim('upper'), b = up.player.body;
    expect(floorAt(up.world, b.x, b.y, b.z, up.platforms[0].dyn)).toBe('metal');
    expect(floorAt(up.world, b.x, b.y, b.z, up.loose.all[0].dyn)).toBe('wood');
  });
});

describe('a sound', () => {
  it('in the same room comes straight to you', () => {
    const s = sim('upper'), b = s.player.body;
    refreshFields(s, s.fields!);
    const h = hearing(s, b.x + 1.5, b.y, b.z);
    expect(h.muffle).toBeLessThan(0.1);
    expect(h.d).toBeLessThan(2.5);
  });

  it('behind a shut door is muffled and further off than it looks', () => {
    const s = sim('upper');
    const d = s.doors.find(d => d.def.seal)!, D = d.def, cx = (D.x0 + D.x1) / 2, cz = (D.z0 + D.z1) / 2;
    const [ox, oz] = D.alongX ? [0, 1] : [1, 0], b = s.player.body;
    b.x = cx - ox; b.z = cz - oz; b.y = D.y0; b.sync();
    refreshFields(s, s.fields!);
    const h = hearing(s, cx + ox, D.y0, cz + oz);
    expect(h.muffle).toBeGreaterThan(0.3);
    expect(h.d).toBeGreaterThan(2.5);
  });
});

describe('you', () => {
  it('push off with a jump and are heard landing', () => {
    const s = sim('upper');
    hold(s, 0.5);
    s.game.events.length = 0;
    hold(s, STEP, { jump: true });
    expect(sounds(s, 'jump').length).toBe(1);
    hold(s, 1.5);
    const land = sounds(s, 'land');
    expect(land.length).toBe(1);
    expect(land[0].k).toBeGreaterThanOrEqual(0);
    expect(land[0].k).toBeLessThan(0.5);
  });
});
