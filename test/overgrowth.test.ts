import { describe, expect, it } from 'vitest';
import { beginLevel, door, finishLevel, floor, item, room, type LevelInfo } from '../src/content/build/plan';
import { SEC, shelf } from '../src/content/build/furnish';
import { GROW, LEAF, YOUNG, CURED, colonise } from '../src/content/build/overgrowth';
import { bench } from '../src/content/levels/bench';
import type { LevelDef } from '../src/content/types';

/* The bush's growth (content/build/overgrowth.ts): what a room grown over by colonise() keeps to. */

const LV: LevelInfo = { id: 'g', name: 'g', c: 'G' };
/** a room 16 by 12 with a door in its north wall and a battery on its floor, grown over (or not) from its south-west
 *  corner, and a shelf of goods laid after it */
function level(grow: boolean): LevelDef {
  beginLevel(LV, {});
  const F = floor(LV);
  room(F, 'Hall', 0, 0, 16, 12, { ...SEC, ht: 3 }); room(F, 'Passage', 6, -3, 4, 2.5, SEC); door(F, 8.5, -0.25);
  item(F, 'batt', 5, 8);
  if (grow) colonise(F, F.rooms[0], 2, 10, 12);
  shelf(F, 14, 2, 1.8, 0.5);
  return finishLevel([8, 6, 0]);
}
const leafy = new Set([...LEAF, ...YOUNG, ...CURED].map(c => [c >> 16, (c >> 8) & 255, c & 255].map(v => v / 255).join()));
const isLeaf = (p: LevelDef['props'][number]) => p.shape === 'ico' && leafy.has(p.colour.join());

describe('a place grown over', () => {
  const bare = level(false), grown = level(true);

  it('grows the same every time, and changes nothing else the level draws from its seed', () => {
    expect(level(true).props).toEqual(grown.props);
    /* the shelf's goods, laid after it, are as they are without it */
    const goods = (L: LevelDef) => L.props.filter(p => p.x > 13 && p.x < 15 && p.z > 1.6 && p.z < 2.4).map(p => [p.x, p.y, p.z, p.colour.join()]);
    expect(goods(grown)).toEqual(goods(bare));
  });

  it('is thickest at its heart, and thins out to its front', () => {
    const at = (r0: number, r1: number) => {
      const n = grown.props.filter(p => isLeaf(p) && p.y < 0.05 && Math.hypot(p.x - 2, p.z - 10) >= r0 && Math.hypot(p.x - 2, p.z - 10) < r1).length;
      return n / (Math.PI * (r1 * r1 - r0 * r0) / 4); // a quarter of the ring is in the room
    };
    const heart = at(0.5, 2.5), mid = at(5, 7), front = at(9, 11);
    expect(heart).toBeGreaterThan(2 * mid);
    expect(mid).toBeGreaterThan(front);
    expect(front).toBeGreaterThan(0);
    expect(grown.props.length - bare.props.length).toBeGreaterThan(400);
  });

  it('is dressing only: none of it solid, so it never shuts a way', () => {
    expect(grown.props.filter(p => p.solid).length).toBe(bare.props.filter(p => p.solid).length);
    expect(grown.colliders.length).toBe(bare.colliders.length);
  });

  it('keeps off the doorway and what lies about', () => {
    const d = grown.doors[0], dx = (d.x0 + d.x1) / 2, dz = (d.z0 + d.z1) / 2, b = grown.items[0];
    const stalks = grown.props.filter(p => p.shape === 'cyl' && p.sy > 0.3 && Math.abs(p.rz) < 0.3);
    expect(stalks.length).toBeGreaterThan(3);
    for (const p of stalks) expect(Math.hypot(p.x - dx, p.z - dz)).toBeGreaterThan(GROW.door - 0.2);
    for (const p of grown.props.filter(p => p.y < 0.05 && isLeaf(p))) expect(Math.hypot(p.x - b.x, p.z - b.z)).toBeGreaterThan(GROW.keep - 0.5 * 0.45);
  });

  it('the bench has every piece on it', () => {
    const L = bench(), looks = L.uses.filter(u => u.kind === 'look').map(u => u.opts.label);
    expect(looks).toEqual(expect.arrayContaining(['Shelves', 'Climbing, old', 'In flower', 'Leaf, cured', 'Hung', 'Runner', 'Where it took', 'Grown over', 'The front']));
    expect(L.props.some(p => p.colour[0] > 0.8 && p.colour[1] > 0.75 && p.colour[2] < 0.5)).toBe(true); // its flowers, pale yellow
  });
});
