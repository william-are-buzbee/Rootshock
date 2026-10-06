import { describe, expect, it } from 'vitest';
import { STATION } from '../src/content/station';
import { makeRun, stepRun, saveRun, loadRun, levelDef } from '../src/sim/run';
import { noInput } from '../src/sim/input';
import { give } from '../src/sim/game';
import { validateStation } from '../src/sim/validate';
import { checkProgress } from '../src/sim/progress';
import type { Run } from '../src/sim/run';

/* A run across levels: ladders, the lift, levels kept as you left them, and the main level itself. */

const use = (run: Run, label: RegExp) => {
  const u = run.here.usables.find(q => !q.off && label.test(q.label() ?? ''));
  if (!u) throw new Error('nothing labelled ' + label + ' on ' + run.here.world.def.id);
  u.act();
  stepRun(run, noInput()); // the run carries out the trip after the step
};

describe('travel between levels', () => {
  it('ladder A1 goes down to the main level and back up, and each level waits as you left it', () => {
    const run = makeRun(STATION, { seed: 4 }), upper = run.here;
    give(run.here.game, 'pipe');
    upper.doors[3].open = true; upper.doors[3].hold = 1e9; // something to find again
    use(run, /^Ladder down: Main level$/);
    expect(run.here.world.def.id).toBe('main');
    const m = run.here.world.def.marks['ladder:A1'], b = run.here.player.body;
    expect(Math.hypot(b.x - m.x, b.z - m.z)).toBeLessThan(0.01);
    expect(run.here.game).toBe(upper.game); // one game: what you carry came with you
    expect(run.here.game.inv.map(s => s.id)).toContain('pipe');
    expect(run.here.game.events.some(e => e.type === 'level' && e.id === 'main')).toBe(true);
    use(run, /^Ladder up: Upper station$/);
    expect(run.here).toBe(upper);
    expect(upper.doors[3].open).toBe(true);
  });

  it('the lift goes where you ask once Gen-1 runs', () => {
    const run = makeRun(STATION, { seed: 4 });
    run.here.game.station!.main = true;
    run.here.game.commands.push({ type: 'lift', level: 'main' });
    stepRun(run, noInput());
    expect(run.here.world.def.id).toBe('main');
    const m = run.here.world.def.marks.lift, b = run.here.player.body;
    expect(Math.hypot(b.x - m.x, b.z - m.z)).toBeLessThan(0.01);
  });

  it('a run saved on the main level loads there, with the upper station as it was', () => {
    const run = makeRun(STATION, { seed: 4 });
    run.here.doors[3].unlocked = true;
    use(run, /^Ladder down: Main level$/);
    for (let k = 0; k < 60; k++) stepRun(run, noInput());
    const back = loadRun(STATION, JSON.parse(JSON.stringify(saveRun(run))));
    expect(back.here.world.def.id).toBe('main');
    expect(back.sims.get('upper')!.doors[3].unlocked).toBe(true);
    expect(back.sims.get('upper')!.game).toBe(back.here.game);
    expect(JSON.stringify(saveRun(back))).toBe(JSON.stringify(saveRun(run)));
  });
});

describe('the main level', () => {
  const L = levelDef(STATION, 'main');

  it('validates: only ladders to levels not yet ported wait', () => {
    const p = validateStation(STATION, [L]);
    expect(p.filter(x => !x.later)).toEqual([]);
  });

  it('from the foot of ladder A1: Horticulture and the ways on are open; the heavy doors want Gen-1', () => {
    const run = makeRun(STATION, { seed: 4 });
    use(run, /^Ladder down: Main level$/);
    const r = checkProgress(run.here);
    expect(Object.keys(r.goals)).toEqual(expect.arrayContaining(['ladder A1 to Upper station', 'ladder CV to The cave', 'ladder B2 to Plant level']));
    expect(r.rooms.never).toEqual(expect.arrayContaining(['Seed vault', 'Stores', 'Trauma centre']));
    expect(r.softLocks).toEqual([]);
    const r2 = checkProgress(run.here, { main: true });
    expect(r2.items.never).toEqual([]);
  });
});

describe('the plant level', () => {
  const L = levelDef(STATION, 'plant');
  /** take a ladder by its name: A2 and B2 both read "down to the Plant level" */
  const ladder = (run: Run, id: string) => {
    const i = run.here.world.def.uses.findIndex(u => u.kind === 'ladder' && (u.opts as { id?: string }).id === id);
    run.here.usables.find(u => u.key === 'use' + i)!.act();
    stepRun(run, noInput());
  };

  it('validates: only ladder A3, to the sump, waits', () => {
    const p = validateStation(STATION, [L]);
    expect(p.filter(x => !x.later)).toEqual([]);
    expect(p.map(x => x.what).join('\n')).toMatch(/A3/);
  });

  it('A2 is collapsed; B2 goes down the exhaust shaft to the plant level and back', () => {
    const run = makeRun(STATION, { seed: 4, start: 'main' });
    ladder(run, 'A2');
    expect(run.here.world.def.id).toBe('main');
    expect(run.here.game.events.some(e => e.type === 'say' && /collapsed/.test(e.text))).toBe(true);
    ladder(run, 'B2');
    expect(run.here.world.def.id).toBe('plant');
    const m = run.here.world.def.marks['ladder:B2'], b = run.here.player.body;
    expect(Math.hypot(b.x - m.x, b.z - m.z)).toBeLessThan(0.01);
    ladder(run, 'B2');
    expect(run.here.world.def.id).toBe('main');
  });

  it('from the foot of B2, Gen-1 can be started: the fuse, its socket, the breaker; nothing is lost on the way', () => {
    const run = makeRun(STATION, { seed: 4, start: 'main' });
    ladder(run, 'B2');
    const r = checkProgress(run.here);
    expect(r.goals['Gen-1 running']).toEqual(['take main fuse', 'seat the fuse', 'start Gen-1']);
    expect(Object.keys(r.goals)).toEqual(expect.arrayContaining(['ladder B2 to Main level', 'ladder A3 to The sump', 'the lift']));
    expect(r.rooms.never).toEqual([]);
    expect(r.items.never).toEqual([]);
    expect(r.softLocks).toEqual([]);
  });

  it('starting Gen-1 in the sim powers the station and opens the lift', () => {
    const run = makeRun(STATION, { seed: 4, start: 'plant' }), g = run.here.game;
    use(run, /^Take main fuse$/);
    use(run, /^Fuse socket/);
    expect(g.station!.fuseIn).toBe(true);
    use(run, /^Gen-1 main breaker/);
    expect(g.station!.main).toBe(true);
    expect(g.events.some(e => e.type === 'power')).toBe(true);
    g.commands.push({ type: 'lift', level: 'upper' });
    stepRun(run, noInput());
    expect(run.here.world.def.id).toBe('upper');
  });
});
