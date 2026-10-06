import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim } from '../src/sim/sim';
import { power } from '../src/sim/game';
import { Lighting } from '../src/world/light';
import { Motes } from '../src/present/render/motes';

/* What hangs in the air (present/render/motes.ts), headless: how much of it the air holds, and that a speck keeps the
   push of something passing through it instead of swinging back to where it was. */

const level = buildUpper(STATION.ladders);
type Inside = { pos: Float32Array; vel: Float32Array; want: Float32Array; room: Int32Array };
const inside = (m: Motes) => m as unknown as Inside;

function air(full: boolean) {
  const sim = makeSim(level, { seed: 5, station: STATION });
  if (full) { sim.game.station!.main = true; for (const c of Object.values(sim.game.station!.circuits)) { c.on = true; c.broken = false; } }
  const L = new Lighting(sim.world, c => power(sim.game, c)), m = new Motes(new THREE.Group(), L, () => {});
  return { sim, m, M: inside(m) };
}

describe('motes', () => {
  it('moving air holds a quarter of the dust still air does', () => {
    const shown = (full: boolean) => {
      let n = 0;
      for (let k = 0; k < 6; k++) {
        const { sim, m, M } = air(full);
        m.update(sim, new THREE.Vector3(70, 1.6, 0), 0);
        for (let i = 0; i < 900; i++) if (M.room[i] >= 0 && sim.world.rooms[M.room[i]].name === 'Operations corridor' && M.want[i] > 0) n++;
      }
      return n;
    };
    const still = shown(false), moving = shown(true);
    expect(still).toBeGreaterThan(20);
    expect(moving / still).toBeGreaterThan(0.12);
    expect(moving / still).toBeLessThan(0.45);
  });

  it('what you walk through is carried and shoved along, and keeps going after you stop', () => {
    const { sim, m, M } = air(false), cam = new THREE.Vector3(66, 1.62, 0), dt = 1 / 60;
    m.update(sim, cam, dt);
    m.update(sim, cam, dt);
    /* the specks in a strip ahead of you, low enough for your body */
    const near = [...Array(900).keys()].filter(i => M.room[i] >= 0 && M.pos[i * 3] > 66.5 && M.pos[i * 3] < 67.5 && Math.abs(M.pos[i * 3 + 2]) < 0.6 && M.pos[i * 3 + 1] < 1.7);
    expect(near.length).toBeGreaterThan(3);
    for (let t = 0; t < 0.5; t += dt) { cam.x += 4 * dt; m.update(sim, cam, dt); } // run east through them
    const vx = near.reduce((s, i) => s + M.vel[i * 3], 0) / near.length;
    expect(vx).toBeGreaterThan(0.3);
    const x1 = near.map(i => M.pos[i * 3]);
    for (let t = 0; t < 0.5; t += dt) m.update(sim, cam, dt); // stand still
    const on = near.filter((i, k) => M.pos[i * 3] > x1[k]).length;
    expect(on / near.length).toBeGreaterThan(0.8); // still going the way they were pushed, not swinging back
  });
});
