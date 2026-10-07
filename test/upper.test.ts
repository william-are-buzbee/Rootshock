import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { buildUpper } from '../src/content/levels/upper';
import { makeSim, step } from '../src/sim/sim';
import { noInput } from '../src/sim/input';
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

  it('starts you standing in your isolation room, a storey under the wing', () => {
    const b = sim.player.body;
    expect(sim.world.roomAt(b.x, b.y + 1, b.z)?.name).toBe('Isolation room 1');
    expect(b.y).toBeCloseTo(-4.5);
    expect(sim.world.groundBelow(circle(b.x, b.z, b.r), b.y + 0.1)).toBeCloseTo(b.y);
    expect(sim.world.overlap(circle(b.x, b.z, b.r), b.y + 0.01, b.y + 1.8, b.dyn)).toBe(null);
  });

  it('can be walked: every room is reachable on foot from the start, except the welded ones', () => {
    const r = reach(sim);
    const named = new Set(level.rooms.map(R => R.name).filter(Boolean));
    const missing = [...named].filter(n => !r.rooms.has(n)).sort();
    expect(missing).toEqual(['Phase 2']);
  });

  it('lights in two halves: the wing dead behind its cut, Ops on its backup set, Cargo dark', () => {
    const at = (L: Lighting, name: string) => {
      const R = level.rooms.find(r => r.name === name)!;
      return L.at(R.id, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2);
    };
    const L = new Lighting(sim.world, stationPower(STATION.circuits, STATION.main));
    expect(at(L, 'Isolation room 2')[0]).toBe(0); // the suite is the wing's, and dark with it
    expect(at(L, 'Security corridor')[0]).toBe(0); // the wing's feed is cut
    const em = at(L, 'Operations corridor');
    expect(em[0]).toBeGreaterThan(0.2); // emergency lights on the backup set
    expect(em[2]).toBeLessThan(em[0] * 0.6); // amber, not white
    expect(Math.max(...em)).toBeCloseTo(0.4 * Math.max(...level.rooms.find(r => r.name === 'Operations corridor')!.lc), 5); // as visible as before
    expect(at(L, 'Atrium')[0]).toBeGreaterThan(0.2); // the threshold: theirs, and lit
    expect(at(L, 'Operations room')[0]).toBe(0); // no emergency lights: dark on backup
    expect(at(L, 'Cargo cavern')[0]).toBe(0); // its backup set is not running
    /* mended, the wing takes what Ops has: the backup set's amber */
    const mended = structuredClone(STATION.circuits);
    mended.SEC.broken = false;
    const M = new Lighting(sim.world, stationPower(mended, STATION.main));
    const wing = at(M, 'Security corridor');
    expect(wing[0]).toBeGreaterThan(0.2);
    expect(wing[2]).toBeLessThan(wing[0] * 0.6);
    const full = new Lighting(sim.world, fullPower);
    const R = level.rooms.find(r => r.name === 'Cargo cavern')!;
    expect(full.at(R.id, (R.x0 + R.x1) / 2, (R.z0 + R.z1) / 2)[0]).toBeGreaterThan(0.5);
  });

  it('lights the suite by a flashlight dropped still on, which goes out when taken, and by its exit signs', () => {
    const hall = level.rooms.find(r => r.name === 'Isolation suite')!, k = level.items.findIndex(it => it.id === 'flash');
    const F = level.items[k], mine = level.lamps.filter(l => l.item === k);
    expect(mine.length).toBe(2); // a little round it, and its beam's pool
    const beam = mine.reduce((a, l) => (Math.hypot(l.x - F.x, l.z - F.z) > Math.hypot(a.x - F.x, a.z - F.z) ? l : a));
    const power = stationPower(STATION.circuits, STATION.main), on = new Lighting(sim.world, power), off = new Lighting(sim.world, power, i => i === k);
    const lum = (L: Lighting, x: number, z: number, y?: number) => Math.max(...L.at(hall.id, x, z, y));
    expect(lum(on, beam.x, beam.z, hall.y0)).toBeGreaterThan(0.3); // thrown low, at the wall
    expect(lum(on, F.x, F.z, hall.y0)).toBeGreaterThan(0);
    expect(lum(on, F.x, F.z, hall.y0 + hall.ht)).toBe(0); // and not up: the ceiling over it stays dark
    expect(lum(off, beam.x, beam.z, hall.y0)).toBe(0);
    expect(lum(off, F.x, F.z, hall.y0)).toBe(0);
    expect(Math.max(...on.at(hall.id, hall.x0 + 2, hall.z1 - 2))).toBe(0); // the far corner: black
    /* the exit signs: green, a little light each, whatever the power */
    const signs = level.lamps.filter(l => l.colour[1] > l.colour[0] * 3);
    expect(signs.length).toBe(2);
    for (const S of signs) expect(Math.max(...off.atPoint(S.x, S.y + 0.5, S.z))).toBeGreaterThan(0.1);
  });

  it('looks out over the bay through glass: it stops you, and sight goes through it', () => {
    const s = makeSim(level, { seed: 1, station: STATION }), panes = s.doors.filter(d => d.def.glass);
    expect(panes.length).toBe(3);
    const P = panes[1].def, x = P.x0 - 1.2, z = (P.z0 + P.z1) / 2, y = P.y0 + 1.6;
    /* a line from Cargo control out into the bay: glass is no wall to an eye, but it is to a ray that sees nothing through it */
    expect(s.world.raycast(x, y, z, x + 12, y - 2, z, d => d.kind === 'body' || !!d.glass)).toBe(1);
    expect(s.world.raycast(x, y, z, x + 12, y - 2, z, () => false)).toBeLessThan(1);
    /* and you walk into it and no further */
    const b = s.player.body; b.x = x; b.y = P.y0; b.z = z; b.sync();
    for (let k = 0; k < 120; k++) step(s, { ...noInput(), forward: 1 });
    expect(b.x).toBeLessThan(P.x1);
  });

  it('floors the second floor in one colour: the gallery\'s slab stops at the door into Cargo control', () => {
    const R = level.rooms.find(r => r.name === 'Cargo control')!, G = level.rooms.find(r => r.name === 'Gallery' && r.z1 - r.z0 > 10)!;
    const under = (Q: typeof R) => level.blocks.filter(b => b.y1 === Q.y0 && b.x0 < Q.x1 && b.x1 > Q.x0 && b.z0 < Q.z1 && b.z1 > Q.z0);
    const room = new Set(under(R).map(b => b.colour.join())), walk = new Set(under(G).map(b => b.colour.join()));
    expect(room.size).toBe(1);
    expect(walk.size).toBe(1);
    expect([...room][0]).not.toBe([...walk][0]);
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
