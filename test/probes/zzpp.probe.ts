import { it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { STATION } from '../../src/content/station';
import type { PropDef } from '../../src/content/types';
/* props that differ, merged where a run of boxes end to end along x or z is one box: so rails in runs compare with
   rails a tile at a time */
const key = (p: PropDef) => JSON.stringify([p.shape, p.y, p.sy, p.ry, p.rz, p.colour, p.glow, p.solid, p.loose, p.mat ?? '', p.pw ?? '', p.services ?? '', p.flush ?? ''].map(v => typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v));
function merged(ps: PropDef[]): string[] {
  const out: string[] = [], groups = new Map<string, PropDef[]>();
  for (const p of ps) { const k = key(p); let g = groups.get(k); if (!g) groups.set(k, (g = [])); g.push({ ...p }); }
  for (const [k, g] of groups) {
    /* merge along x (same z, sz) then along z (same x, sx) until nothing changes */
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < g.length && !changed; i++) for (let j = 0; j < g.length && !changed; j++) {
        if (i === j) continue;
        const a = g[i], b = g[j], E = 1e-4;
        if (Math.abs(a.z - b.z) < E && Math.abs(a.sz - b.sz) < E && Math.abs(a.x + a.sx / 2 - (b.x - b.sx / 2)) < E) {
          const x0 = a.x - a.sx / 2, x1 = b.x + b.sx / 2; a.x = (x0 + x1) / 2; a.sx = x1 - x0; g.splice(j, 1); changed = true;
        } else if (Math.abs(a.x - b.x) < E && Math.abs(a.sx - b.sx) < E && Math.abs(a.z + a.sz / 2 - (b.z - b.sz / 2)) < E) {
          const z0 = a.z - a.sz / 2, z1 = b.z + b.sz / 2; a.z = (z0 + z1) / 2; a.sz = z1 - z0; g.splice(j, 1); changed = true;
        }
      }
    }
    for (const p of g) out.push(k + ' ' + [p.x, p.z, p.sx, p.sz].map(v => v.toFixed(3)).join(','));
  }
  return out;
}
it('pp', () => {
  const L = process.env.LEVEL!, now = STATION.levels.find(l => l.id === L)!.build(), was = JSON.parse(readFileSync(`${process.env.BASE}/${L}.json`, 'utf8'));
  const a = merged(was.props), b = merged(now.props), ca = new Map<string, number>(), cb = new Map<string, number>();
  for (const x of a) ca.set(x, (ca.get(x) ?? 0) + 1);
  for (const x of b) cb.set(x, (cb.get(x) ?? 0) + 1);
  const out: string[] = [];
  for (const [k, n] of ca) if ((cb.get(k) ?? 0) < n) out.push('- ' + k);
  for (const [k, n] of cb) if ((ca.get(k) ?? 0) < n) out.push('+ ' + k);
  writeFileSync(process.env.OUT!, out.join('\n'));
});
