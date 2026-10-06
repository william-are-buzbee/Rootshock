import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim } from '../src/sim/sim';
import { reach } from '../src/sim/reach';
import { Lighting, stationPower, fullPower } from '../src/world/light';
import { buildLevelMesh } from '../src/present/render/levelMesh';
import { circle } from '../src/world/shapes';

const level = buildUpper(STATION.ladders);
const sim = makeSim(level);

describe('the upper station', () => {
  it('builds the same every time', () => {
    const again = buildUpper(STATION.ladders);
    expect(JSON.stringify(again)).toBe(JSON.stringify(level));
  });

  it('starts you standing in your cell', () => {
    const b = sim.player.body;
    expect(sim.world.roomAt(b.x, b.y + 1, b.z)?.name).toBe('Cell W2');
    expect(sim.world.groundBelow(circle(b.x, b.z, b.r), b.y + 0.1)).toBeCloseTo(b.y);
    expect(sim.world.overlap(circle(b.x, b.z, b.r), b.y + 0.01, b.y + 1.8, b.dyn)).toBe(null);
  });

  it('can be walked: every room is reachable on foot from the start, except the welded ones', () => {
    const r = reach(sim);
    const named = new Set(level.rooms.map(R => R.name).filter(Boolean));
    const missing = [...named].filter(n => !r.rooms.has(n)).sort();
    expect(missing).toEqual(['Cell E1', 'Cell W1', 'Phase 2']);
  });

  it('lights as it did: dark on the Cargo side at the start, lit by its backup set elsewhere', () => {
    const L = new Lighting(sim.world, stationPower(STATION.circuits, STATION.main));
    const at = (name: string) => {
      const R = level.rooms.find(r => r.name === name)!;
      return L.at(R.id, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2);
    };
    expect(at('Cell W2')[0]).toBeGreaterThan(0.4); // always lit
    expect(at('Security corridor')[0]).toBeGreaterThan(0.2); // emergency lights on the backup set
    const em = at('Security corridor');
    expect(em[2]).toBeLessThan(em[0] * 0.6); // amber, not white
    expect(Math.max(...em)).toBeCloseTo(0.4 * Math.max(...level.rooms.find(r => r.name === 'Security corridor')!.lc), 5); // as visible as before
    expect(at('Operations room')[0]).toBe(0); // no emergency lights: dark on backup
    expect(at('Cargo cavern')[0]).toBe(0); // its backup set is not running
    const full = new Lighting(sim.world, fullPower);
    const R = level.rooms.find(r => r.name === 'Cargo cavern')!;
    expect(full.at(R.id, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2)[0]).toBeGreaterThan(0.5);
  });

  it('measures: chunks, memory, mesh', () => {
    const t0 = performance.now();
    makeSim(buildUpper(STATION.ladders));
    const compile = performance.now() - t0;
    const t1 = performance.now();
    const lm = buildLevelMesh(sim.world, new Lighting(sim.world, fullPower)), geo = lm.geometry;
    const mesh = performance.now() - t1, verts = geo.getAttribute('position').count;
    const chunks = sim.world.grid.chunkCount;
    const t2 = performance.now();
    lm.relight(new Lighting(sim.world, stationPower(STATION.circuits, STATION.main)));
    const relight = performance.now() - t2;
    expect(relight).toBeLessThan(100);
    console.log(`relight on a power change: ${relight.toFixed(1)} ms`);
    console.log(`upper station: ${level.rooms.length} rooms, ${level.props.length} props, ${chunks} chunks (${((chunks * 8) / 1024).toFixed(1)} MB of grid), ` +
      `build + compile ${compile.toFixed(0)} ms, mesh ${mesh.toFixed(0)} ms, ${verts} vertices`);
    expect(chunks * 8 * 1024).toBeLessThan(64 * 1024 * 1024);
  });
});
