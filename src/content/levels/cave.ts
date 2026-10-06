import { clamp } from '../../core/math';
import type { LadderDef, LevelDef } from '../types';
import { beginLevel, chamber, dive, finishLevel, ladder, mkDeck, mut, P, pick, pool, rnd, roughen, tunnel, use, vault, bx, type LevelInfo, type TRoomOpts } from '../build/tiles';
import { caveDress, tree } from '../build/fittings';

/* The cave. A stream cave in limestone, known to the builders, walled off and used as the water intake. Its own frame:
   org [-10, -140], so tile i = (x + 10) / 2, j = (z + 140) / 2; floor heights are metres from the main level's floor. From
   the breach behind the arboretum: the entry passage falls to the upper chamber (the spring branch climbs away east toward
   the surface); the descent, through breakdown, into the great chamber, where the green has made its real arboretum; the
   lower passage narrows to the lower chamber, half flooded, and its pool is the flooded link to the sump.
   Ported from the first engine (archive/first-engine.html, buildCave) on the tile adapter: its tunnels and chambers are
   caves of any outline (engine.md §14). */

export const CAVE: LevelInfo = { id: 'cave', name: 'The cave', c: 'CAVE', org: [-10, -140] };

export function buildCave(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(CAVE, ladders);
  const D = mkDeck(CAVE, 160, 70), wet: TRoomOpts = { lit: 'none', fl: 0x3a3832, wl: 0x4a453c, st: 0x4a453c, motes: 'spores' };
  const gf = (x: number) => -40 + clamp((x - 55) / 50, 0, 1) * 14;
  const entry = tunnel(D, 'Entry passage', [[125.5, 61, 0], [122, 53, -3], [118, 47, -6], [114.5, 43, -8]], 1.6, { ...wet, ht: 4 });
  const upper = chamber(D, 'Upper chamber', 112.5, 40, 7.5, 5, () => -8, { ...wet, ht: 6 }); vault(D, 112.5, 40, 7, 6, upper);
  const spring = tunnel(D, 'Spring branch', [[118, 37, -8], [126, 30, -2], [134, 24, 6], [142, 16, 14], [150, 10, 22]], 0.9, { ...wet, ht: 2.6 });
  const desc = tunnel(D, 'Descent', [[108, 37, -8], [102, 31, -14], [96, 26, -21], [92, 22, -29.6]], 2, { ...wet, ht: 5 });
  const great = chamber(D, 'Great chamber', 80, 15, 25, 9, gf, { ...wet, ht: 18, lit: 'always', lc: [0.05, 0.12, 0.07] }); vault(D, 80, 15, 20, 8, great);
  const lower = tunnel(D, 'Lower passage', [[60, 18, -38.6], [52, 24, -46], [46, 28.5, -58]], 1.2, { ...wet, ht: 2.8 });
  const lc = chamber(D, 'Lower chamber', 45, 32.5, 8.75, 6, () => -58, { ...wet, ht: 6 }); vault(D, 45, 32.5, 6, 3, lc);
  /* rough floors and roofs; the tight passages less in the roof, so you can still stand */
  for (const [R, f, c] of [[entry, 0.25, 0.8], [upper, 0.3, 1.5], [spring, 0.2, 0.35], [desc, 0.3, 1], [great, 0.4, 2], [lower, 0.2, 0.35], [lc, 0.25, 1]] as const) roughen(D, R, f, c);
  pool(D, lc, 46, 36.5, 2.6, 2.4);
  /* the ways out: back through the breach; the flooded link; the crack at the top of the spring branch */
  ladder(D, 'CV', 125.5, 60.6, 125.5, 59.4, 0, true, { bare: true, label: 'Crawl back through the breach' });
  dive(D, 46, 34.3, 1, 'sumpdeep', 'Dive: the flooded link', true); D.marks['dive:sumpdeep'] = [45, 33.8, 0];
  use(D, 'look', 150, 10.2, 1.2, { label: 'Examine the crack', text: 'The passage pinches to a crack you could put an arm through. Cold air comes down it, and the smell of grass. Not today.' });
  /* breakdown along both sides of the descent, a clear way down its middle */
  for (let k = 0; k < 14; k++) {
    const t = rnd(0.15, 0.9), side = k % 2 ? 1 : -1, off = side * rnd(1.1, 1.8), x = 108 + (92 - 108) * t + off * 0.69, z = 37 + (22 - 37) * t - off * 0.72, s = rnd(0.8, 1.8);
    P(D, 'ico', x, z, s * 1.3, s, s * 1.2, pick([0x5a5248, 0x4a443c, 0x6b6a64]), { c: 1, y: -0.3 });
  }
  /* the stream across the great chamber; the green's real arboretum */
  for (let x = 96; x > 58; x -= 0.6) { const z = 15 + Math.sin(x * 0.21) * 2.6 + Math.sin(x * 0.07) * 1.6; bx(D, x, z, 1.4, 0.03, 1.3, 0x16343c, { y: 0.02, c: 0 }); }
  for (let k = 0; k < 9; k++) { const x = rnd(62, 98), z = rnd(9, 21), t = Math.floor(z) * D.W + Math.floor(x); if (D.rm[t] !== great.id) continue; P(D, 'cyl', x, z, rnd(0.6, 1.2), rnd(14, 20), rnd(0.6, 1.2), 0x3a4a2c, { c: 1 }); }
  for (let k = 0; k < 12; k++) P(D, 'ico', rnd(62, 98), rnd(9, 21), rnd(2, 4), rnd(1.4, 3), rnd(2, 4), pick([0x2f4a2a, 0x3a5230, 0x4f7a40, 0x6e2b28]), { y: rnd(14, 19), c: 0 });
  for (let k = 0; k < 6; k++) tree(D, rnd(64, 96), rnd(10, 20), rnd(6, 10), 0, true);
  caveDress(D, great, 140, true); caveDress(D, upper, 24, true); caveDress(D, lc, 20, true); caveDress(D, entry, 16, false); caveDress(D, desc, 14, false); caveDress(D, lower, 10, true); caveDress(D, spring, 12, false);
  for (const [x, z] of [[70, 14], [78, 18], [86, 12], [92, 17], [66, 19], [74, 10]]) mut(D, 'rootworm', x, z); mut(D, 'rootworm', 112, 41); mut(D, 'rootworm', 46, 31);
  mut(D, 'skitter', 84, 16); mut(D, 'skitter', 110, 38); mut(D, 'skitter', 47, 30);
  return finishLevel([125.5, 59.4, 0]); // inside the breach, for ?level=cave
}
