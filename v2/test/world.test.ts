import { describe, expect, it } from 'vitest';
import { LevelBuilder } from '../src/content/build/builder';
import { World } from '../src/world/world';
import { testbed } from '../src/content/levels/testbed';

function box(): World {
  const b = new LevelBuilder('t', 'T');
  b.room('A', 0, 0, 4, 4, { ht: 3, nolamp: true });
  b.room('B', 4, 1, 8, 3, { ht: 2, nolamp: true });
  b.block(1, 0, 1, 2, 0.5, 2, 0x808080);
  b.collider(3, 3, 0.5, 1, 0.5);
  return new World(b.finish());
}

describe('World', () => {
  const w = box();
  it('knows open space from rock', () => {
    expect(w.solidAt(2, 1, 0.5)).toBe(false);
    expect(w.solidAt(-0.1, 1, 2)).toBe(true);
    expect(w.solidAt(2, 3.1, 2)).toBe(true);
    expect(w.solidAt(5, 2.1, 2)).toBe(true); // over the low room
    expect(w.roomAt(5, 1, 2)?.name).toBe('B');
  });
  it('sees blocks and colliders', () => {
    expect(w.solidAt(1.5, 0.25, 1.5)).toBe(true);
    expect(w.solidAt(3, 0.5, 3)).toBe(true);
    expect(w.solidAt(3, 1.2, 3)).toBe(false);
  });
  it('finds ground and ceilings', () => {
    expect(w.groundBelow(0.5, 0.5, 0.3, 1)).toBeCloseTo(0);
    expect(w.groundBelow(1.5, 1.5, 0.3, 1)).toBeCloseTo(0.5);
    expect(w.groundBelow(3, 3, 0.3, 1.5)).toBeCloseTo(1);
    expect(w.ceilingAbove(0.5, 0.5, 0.3, 1.8)).toBeCloseTo(3);
    expect(w.ceilingAbove(6, 2, 0.3, 1)).toBeCloseTo(2);
  });
  it('overlaps cylinders with walls but not with a wall it only touches', () => {
    expect(w.overlapCylinder(0.29, 2, 0.3, 0.01, 1.8)).toBe(true);
    expect(w.overlapCylinder(0.3, 2, 0.3, 0.01, 1.8)).toBe(false);
  });
  it('compiles the test bed', () => {
    const t = new World(testbed());
    expect(t.roomAt(3, 1, 3)?.name).toBe('Hall');
    expect(t.groundBelow(14, 2, 0.3, 1.2)).toBeCloseTo(1);
  });
});
