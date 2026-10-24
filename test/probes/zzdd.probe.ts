import { it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { STATION } from '../../src/content/station';
it('dd', () => {
  const L = process.env.LEVEL!, now = STATION.levels.find(l => l.id === L)!.build(), was = JSON.parse(readFileSync(`${process.env.BASE}/${L}.json`, 'utf8'));
  const out: string[] = [];
  now.doors.forEach((d, i) => {
    const o = was.doors[i], dx = (o.x0 + o.x1) / 2 - (d.x0 + d.x1) / 2, dz = (o.z0 + o.z1) / 2 - (d.z0 + d.z1) / 2;
    if (Math.abs(dx) > 1e-6 || Math.abs(dz) > 1e-6 || Math.abs(o.x1 - o.x0 - (d.x1 - d.x0)) > 1e-6) out.push(`${i} at ${((d.x0 + d.x1) / 2).toFixed(2)},${((d.z0 + d.z1) / 2).toFixed(2)} y${d.y0} alongX ${d.alongX} ${d.look} shift ${dx.toFixed(2)},${dz.toFixed(2)} w ${(o.x1 - o.x0).toFixed(2)}x${(o.z1 - o.z0).toFixed(2)} -> ${(d.x1 - d.x0).toFixed(2)}x${(d.z1 - d.z0).toFixed(2)} ${o.look}`);
  });
  writeFileSync(process.env.OUT!, out.join('\n'));
});
