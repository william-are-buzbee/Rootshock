import { it } from 'vitest';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { STATION } from '../../src/content/station';
import { testbed } from '../../src/content/levels/testbed';
import type { LevelDef } from '../../src/content/types';
import { World } from '../../src/world/world';
import { begin, say } from './out';

/* Every level as compiled, kept to compare with: for a change to how levels are written that should change nothing
   (or only what it says it does). SAVE=<dir> writes each level's definition and its grid there; CHECK=<dir> builds
   them again and lists what differs from what was saved: by part of the definition, the first few things that differ
   in each, and how many cells of the grid are not what they were (and where the first are). LEVEL=upper for one. */

/** the grid, cell by cell: each chunk that is not all rock, as its coordinates and its cells */
function cells(def: LevelDef): Map<string, Int16Array> {
  const w = new World(def), out = new Map<string, Int16Array>();
  w.grid.forEachChunk((cx, cy, cz) => out.set(`${cx},${cy},${cz}`, w.grid.chunkCells(cx, cy, cz)!.slice()));
  return out;
}

const levels = (): [string, () => LevelDef][] => [
  ...STATION.levels.map(L => [L.id, L.build] as [string, () => LevelDef]),
  ['testbed', testbed],
];

/** where two values first part, as paths into them, up to `most` */
function differ(a: unknown, b: unknown, path: string, out: string[], most: number): void {
  if (out.length >= most) return;
  if (typeof a === 'number' && typeof b === 'number') {
    if (Math.abs(a - b) > 1e-6) out.push(`${path}: ${a} -> ${b}`);
    return;
  }
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    if (a !== b) out.push(`${path}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
    return;
  }
  const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
  for (const k of keys) differ((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, out, most);
}

it('golden', () => {
  const save = process.env.SAVE, check = process.env.CHECK, only = process.env.LEVEL;
  begin('golden', save ? ` saved to ${save}` : ` checked against ${check}`);
  for (const [id, build] of levels()) {
    if (only && id !== only) continue;
    const def = build(), grid = cells(def);
    if (save) {
      if (!existsSync(save)) mkdirSync(save, { recursive: true });
      writeFileSync(`${save}/${id}.json`, JSON.stringify(def));
      writeFileSync(`${save}/${id}.grid`, JSON.stringify([...grid].map(([k, v]) => [k, Array.from(v)])));
      say(`${id}: saved`);
      continue;
    }
    if (!check) throw new Error('SAVE=<dir> or CHECK=<dir>');
    const was = JSON.parse(readFileSync(`${check}/${id}.json`, 'utf8')) as LevelDef;
    const wasGrid = new Map((JSON.parse(readFileSync(`${check}/${id}.grid`, 'utf8')) as [string, number[]][]).map(([k, v]) => [k, v]));
    say(`\n${id}`);
    const now = JSON.parse(JSON.stringify(def)) as Record<string, unknown>, old = was as unknown as Record<string, unknown>;
    let same = true;
    for (const part of new Set([...Object.keys(old), ...Object.keys(now)])) {
      const a = old[part], b = now[part], d: string[] = [];
      differ(a, b, part, d, 8);
      if (!d.length) continue;
      same = false;
      const n = (v: unknown) => (Array.isArray(v) ? ` (${v.length} -> ` : ' (');
      say(`  ${part}${Array.isArray(a) ? `${n(a)}${Array.isArray(b) ? b.length : '-'})` : ''}`);
      for (const line of d) say(`    ${line}`);
    }
    let off = 0;
    const first: string[] = [];
    for (const k of new Set([...wasGrid.keys(), ...grid.keys()])) {
      const a = wasGrid.get(k), b = grid.get(k);
      for (let i = 0; i < 4096; i++) {
        const va = a ? a[i] : -1, vb = b ? b[i] : -1;
        if (va === vb) continue;
        off++;
        if (first.length < 6) {
          const [cx, cy, cz] = k.split(',').map(Number), x = (cx * 16 + (i & 15)) * 0.25, y = (cy * 16 + ((i >> 4) & 15)) * 0.25, z = (cz * 16 + (i >> 8)) * 0.25;
          first.push(`(${x}, ${y}, ${z}) ${va} -> ${vb}`);
        }
      }
    }
    if (off) { same = false; say(`  grid: ${off} cells differ; first at ${first.join('; ')}`); }
    if (same) say('  the same');
  }
});
