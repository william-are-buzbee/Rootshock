import { PI } from '../../core/math';
import type { LadderDef, LevelDef } from '../types';
import { beginLevel, bx, dive, door, finishLevel, item, ladder, lamp, mkDeck, mut, note, P, pick, rnd, room, use, type LevelInfo, type TRoomOpts } from '../build/tiles';
import { column, corpse, liftRoom, shelf } from '../build/fittings';

/* The sump, 162 m down. Everything drains here; with Gen-1 dead the pumps stopped and it flooded. A 6 m hall (tiles 12 to
   51) at wading depth, the pump station at its east end, and under it the drowned level: the intake gallery, where root
   mass chokes the pump intakes and the flooded link comes in from the cave. Sergeant Aldana went down there and did not
   come back. Ported from the first engine (archive/first-engine.html: buildSump, buildSumpDeep) on the tile adapter,
   in tile units. The water is real now: you wade in the hall, and below you swim, with no surface to come up to. */

export const SUMP: LevelInfo = { id: 'sump', name: 'The sump', c: 'HYD', org: [-10, -30] };
export const SUMPDEEP: LevelInfo = { id: 'sumpdeep', name: 'The sump, drowned', c: 'DEEP', org: [-10, -30] };

export function buildSump(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(SUMP, ladders);
  const D = mkDeck(SUMP, 140, 30, { wet: 0.9 }), WT: TRoomOpts = { fl: 0x2a2f30, wl: 0x4a5052, st: 0x4a5052, c: 'HYD' };
  liftRoom(D, 5, 14, 7, 14); room(D, 'Shaft station', 8, 14, 3, 3, { ...WT, em: 1, safe: 1, nolamp: 1 }); door(D, 11, 14, { sg: [['Sump', 'w'], ['Shaft station', 'e']] }); lamp(D, 10.4, 14.4, 6);
  ladder(D, 'A3', 10.5, 16.6, 9.6, 16.1, PI / 2, true);
  room(D, 'Sump', 12, 8, 40, 14, { ...WT, ht: 6, em: 1 });
  for (let x = 18; x <= 46; x += 7) { bx(D, x, 11.5, 0.4, 1.4, 6, 0x4a5052); bx(D, x, 18.5, 0.4, 1.4, 6, 0x4a5052); column(D, x, 15, 6); }
  for (const z of [8.3, 21.7]) bx(D, 32, z, 79, 0.3, 0.3, 0x3d4042, { y: 4.4, c: 0 }); bx(D, 32, 8.6, 79, 0.18, 0.18, 0x5a4034, { y: 3.6, c: 0 });
  for (let k = 0; k < 8; k++) bx(D, rnd(14, 50), rnd(9, 21), rnd(0.4, 1.2), 0.12, rnd(0.3, 0.9), pick([0x3a3020, 0x4a5052, 0x2c3a3c]), { y: 0.88, c: 0, ry: rnd(PI) });
  bx(D, 30.5, 8.6, 2.4, 0.06, 1.2, 0x2a2c2e, { y: 0.88, c: 0 }); for (let q = -1; q <= 1; q++) bx(D, 30.5 + q * 0.7, 8.6, 0.08, 0.08, 1.2, 0x8a7a2a, { y: 0.92, c: 0 });
  dive(D, 30.5, 8.9, 1, 'sumpdeep', 'Dive: the intake grates', true); D.marks['dive:sumpdeep'] = [30.5, 9.6, PI];
  mut(D, 'swimmer', 22, 13); mut(D, 'swimmer', 36, 17); mut(D, 'swimmer', 44, 11); mut(D, 'swimmer', 28, 20);
  /* the pump station, the control office over it, and the filters */
  room(D, 'Pump station', 52, 10, 8, 10, { ...WT, ht: 8, em: 1 });
  for (const z of [11.5, 13.8, 16.2, 18.5]) { P(D, 'cyl', 58.4, z, 1.4, 2.4, 1.4, 0x3b4d57); bx(D, 57, z, 1.6, 1, 1, 0x44525a); } bx(D, 59.6, 15, 0.3, 0.3, 9, 0x5a4034, { y: 3, c: 0 });
  use(D, 'look', 56, 15, 1.2, { label: 'Pump controls', text: 'Four pumps, all of them dead. The intake gauges read blocked: something below has grown into the grates. Even with power they would only cough.' });
  bx(D, 56, 15, 0.8, 1.2, 0.6, 0x3a3f44);
  room(D, 'Pump control', 53, 5, 5, 4, WT); door(D, 55, 9, { sg: [['Control', 's']] });
  bx(D, 55.5, 5.6, 2.4, 1, 0.7, 0x3f4448); bx(D, 55.5, 5.6, 0.5, 0.34, 0.06, 0x22262a, { y: 1, c: 0 }); bx(D, 55.5, 5.62, 0.44, 0.28, 0.02, [0.06, 0.12, 0.1], { y: 1.03, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]] });
  note(D, 'hydro', 55, 5.55, 1.02); item(D, 'lantern', 56, 5.6, 1.02); shelf(D, 53.3, 7, 0.5, 3); item(D, 'wrench', 53.35, 6.4, 1.06); item(D, 'batt', 53.35, 7.6, 1.06, 2);
  room(D, 'Filter room', 53, 21, 5, 4, WT); door(D, 55, 20, { sg: [['Filters', 'n']] }); for (const x of [54, 56.6]) bx(D, x, 23.6, 1.4, 1.6, 1, 0x3f5148); mut(D, 'swimmer', 55, 22.4);
  return finishLevel([9.6, 16.1, PI / 2]); // at the foot of A3, for ?level=sump
}

export function buildSumpDeep(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(SUMPDEEP, ladders);
  const D = mkDeck(SUMPDEEP, 140, 30, { deep: 1 }), DW: TRoomOpts = { fl: 0x1e2628, wl: 0x38423f, st: 0x38423f, lit: 'none', nolamp: 1 };
  room(D, 'Intake gallery', 22, 3, 17, 4, { ...DW, ht: 3.6 }); room(D, 'Flooded link', 14, 4, 8, 2, { ...DW, ht: 2.6 }); room(D, 'Intake main', 39, 4, 13, 2, { ...DW, ht: 2.6 });
  for (let k = 0; k < 4; k++) {
    const x = 24.5 + k * 4;
    bx(D, x, 3.2, 1.6, 1.6, 0.3, 0x2c3a3c, { y: 0.6, c: 0 });
    for (let q = 0; q < 4; q++) P(D, 'ico', x + rnd(-0.5, 0.5), 3.4 + rnd(0, 0.4), rnd(0.6, 1.1), rnd(0.6, 1.2), rnd(0.5, 0.9), pick([0x2f4a2a, 0x4a3b2c, 0x3a5230, 0x6e2b28]), { y: rnd(0.2, 1.4), c: 0 });
  }
  for (let k = 0; k < 8; k++) bx(D, rnd(15, 50), rnd(4.2, 6.2), rnd(0.3, 0.9), rnd(0.2, 0.5), rnd(0.3, 0.9), pick([0x2c3a3c, 0x3a3020, 0x4a5052]), { ry: rnd(PI), c: 0 });
  corpse(D, 34.6, 5.6, 0x2c3440, true, { label: 'Search the drowned sergeant', say: 'SGT. R. ALDANA. Four digits in grease pencil on the back of her hand.', note: 'code' });
  dive(D, 30.5, 5.8, 1.6, 'sump', 'Swim up: the intake grates'); D.marks['dive:sump'] = [30.5, 5.4, PI];
  dive(D, 14.6, 4.6, 1.4, 'cave', 'Swim on: the flooded link, toward the cave'); D.marks['dive:cave'] = [15.4, 4.6, -PI / 2];
  mut(D, 'swimmer', 26, 5); mut(D, 'swimmer', 31, 4); mut(D, 'swimmer', 37, 5.6); mut(D, 'swimmer', 18, 4.8); mut(D, 'swimmer', 46, 4.6);
  return finishLevel([30.5, 5.4, PI]); // under the intake grates, for ?level=sumpdeep
}
