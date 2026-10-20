import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { levelDef } from '../src/sim/run';
import { makeSim } from '../src/sim/sim';
import { doorBox } from '../src/sim/movers';

/* Doors by where they are (world.md §1, *The station as built*; engine.md §15): what each looks like, and that a door
   sliding into its wall goes into rock, not into a room or another doorway. */

const level = buildUpper(STATION.ladders);
/** the door whose sign reads `text` */
const signed = (text: string) => {
  const g = level.signs.find(q => q.text === text)!;
  return level.doors.reduce((a, d) => (Math.hypot((d.x0 + d.x1) / 2 - g.x, (d.z0 + d.z1) / 2 - g.z) < Math.hypot((a.x0 + a.x1) / 2 - g.x, (a.z0 + a.z1) / 2 - g.z) ? d : a));
};

describe('doors', () => {
  it('look like where they are', () => {
    expect(signed('Lobby').look).toBe('grand');
    expect(signed('Infirmary').look).toBe('clinic');
    expect(signed('Lockers').look).toBe('steel');
    expect(signed('Duty office').look).toBe('office');
    expect(signed('Armory').look).toBe('heavy');
    expect(signed('Hazard store').look).toBe('shutter');
  });

  it('slide into rock; shutters, and anything jammed, rise', () => {
    for (const id of ['upper', 'main', 'plant', 'sump', 'cave']) {
      const s = makeSim(levelDef(STATION, id), { seed: 1, station: STATION }), w = s.world;
      for (const d of s.doors) {
        if (d.def.stuck || d.def.look === 'shutter') expect(d.def.slides, id).toBeFalsy();
        if (!d.def.slides) continue;
        const b = doorBox(d, 1), x = (b.x0 + b.x1) / 2, z = (b.z0 + b.z1) / 2;
        for (const y of [b.y0 + 0.3, b.y0 + 1.2, b.y1 - 0.3]) expect(w.roomAt(x, y, z), `${id} door at ${(d.def.x0 + d.def.x1) / 2}, ${(d.def.z0 + d.def.z1) / 2}`).toBeNull();
      }
    }
  });
});
