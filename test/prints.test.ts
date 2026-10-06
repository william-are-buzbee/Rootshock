import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, type Sim } from '../src/sim/sim';
import { power } from '../src/sim/game';
import { Lighting } from '../src/world/light';
import { Prints } from '../src/present/render/prints';

/* Footprints (present/render/prints.ts), headless: wet ones after water, red ones after blood, a pace apart. */

const level = buildUpper(STATION.ladders);
type Print = { x: number; z: number; wet: number; blood: number };
const list = (p: Prints) => (p as unknown as { list: Print[] }).list;

function setUp() {
  const sim = makeSim(level, { seed: 2, station: STATION });
  const p = new Prints(new THREE.Group(), new Lighting(sim.world, c => power(sim.game, c)));
  return { sim, p };
}
/** walk east along the Operations corridor from x0 to x1, a frame at a time */
function walk(sim: Sim, p: Prints, x0: number, x1: number): void {
  const b = sim.player.body;
  b.z = 0; b.y = 0; b.ground = true; b.on = null; sim.player.yaw = -Math.PI / 2;
  for (let x = x0; x <= x1; x += 0.05) { b.x = x; p.update(sim, 1 / 60); }
}

describe('footprints', () => {
  it('the level knows where its blood is', () => {
    expect((level.stains ?? []).length).toBeGreaterThan(3);
  });

  it('none on a dry, clean floor; out of water, wet ones a pace apart that run out after a dozen or so', () => {
    const { sim, p } = setUp();
    walk(sim, p, 62, 70);
    expect(list(p).length).toBe(0);
    sim.player.water = 'wading';
    walk(sim, p, 70, 71);
    sim.player.water = 'dry';
    walk(sim, p, 71, 85);
    const L = list(p);
    expect(L.length).toBeGreaterThan(8);
    expect(L.length).toBeLessThan(20);
    expect(L.every(q => q.wet > 0 && q.blood === 0)).toBe(true);
    expect(Math.abs(L[1].x - L[0].x - 0.75)).toBeLessThan(0.1);
    expect(Math.sign(L[0].z) !== Math.sign(L[1].z)).toBe(true); // left, right
  });

  it('through a pool of blood, red ones after it', () => {
    const { sim, p } = setUp();
    const S = level.stains!.find(s => Math.abs(s.z) < 1.5 && s.x > 80 && s.x < 92)!; // the one in the Operations corridor
    expect(S).toBeTruthy();
    walk(sim, p, S.x - 3, S.x + 8);
    const red = list(p).filter(q => q.blood > 0);
    expect(red.length).toBeGreaterThan(4);
    expect(Math.min(...red.map(q => q.x))).toBeGreaterThan(S.x - S.r - 0.3);
  });
});
