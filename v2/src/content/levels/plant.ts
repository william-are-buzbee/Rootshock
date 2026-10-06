import { PI } from '../../core/math';
import type { LadderDef, LevelDef } from '../types';
import { beginLevel, bx, door, finishLevel, item, ladder, mkDeck, mut, note, P, room, use, type LevelInfo, type TRoom, type TRoomOpts } from '../build/tiles';
import { MED, UTIL, corpse, genset, liftRoom, medbed, overgrow, panel, shelf, tbl } from '../build/fittings';

/* The plant level, 140 m down. Dead and black. Engineering on the spine (the machine shop, the parts store, Distribution
   with every floor's service connection, the backup plant); the link corridor; the generator hall, Gen-1 at its east
   end against the exhaust shaft, where the green comes down. The west end is going green too.
   Ported from the first engine (index.html, buildPlant) on the tile adapter, in tile units. */

export const PLANT: LevelInfo = { id: 'plant', name: 'Plant level', c: 'ENG', org: [-10, -30] };

export function buildPlant(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(PLANT, ladders);
  const D = mkDeck(PLANT, 140, 30), E: TRoomOpts = { ...UTIL, c: 'ENG' };
  /* the main shaft: the hoist, the foot of A2 (collapsed above), and A3 on down into the sump */
  liftRoom(D, 5, 14, 7, 14); room(D, 'Shaft station', 8, 14, 3, 3, { ...UTIL, em: 1, safe: 1 }); door(D, 11, 14, { sg: [['Engineering', 'w'], ['Shaft station', 'e']] });
  ladder(D, 'A2', 10.5, 16.6, 9.6, 16.1, PI / 2, true); ladder(D, 'A3', 8.5, 16.6, 9.4, 15.6, PI / 2, false);
  /* Engineering: the corridor down the spine, rooms north (doors on row 13) and south (row 16) */
  const wc = room(D, 'West corridor', 12, 14, 26, 2, { ...E, em: 1 }); room(D, 'East corridor', 38, 14, 26, 2, { ...E, em: 1 });
  const shop = room(D, 'Machine shop', 14, 8, 9, 5, { ...E, ht: 4 }); door(D, 18, 13, { stuck: true, sg: [['Machine shop', 's']] });
  tbl(D, 15, 10, 0.9, 3.4, 0x54504a); bx(D, 19, 9, 1.8, 1.1, 0.9, 0x3f5148); P(D, 'cyl', 19, 9, 0.3, 0.5, 0.3, 0x2c3833, { y: 1.1, c: 0 }); bx(D, 21.6, 10.6, 0.9, 1.3, 1.8, 0x3f5148); shelf(D, 20.5, 12.7, 3, 0.5);
  item(D, 'adjwrench', 15, 9.4, 0.78); item(D, 'fuse', 15, 10.1, 0.78); note(D, 'work', 15, 10.7, 0.78); item(D, 'batt', 20.5, 12.65, 1.06, 2);
  corpse(D, 18.4, 11.4, 0x6a5a34, false, { label: 'Search the engineer', say: 'Something has rooted through him. His card is still good.', keys: ['e'] });
  room(D, 'Parts store', 24, 8, 6, 5, E); door(D, 26, 13, { card: 'e', sg: [['Parts', 's']] });
  shelf(D, 24.3, 10.4, 0.5, 4); shelf(D, 29.7, 10.4, 0.5, 4); shelf(D, 26.8, 8.3, 3, 0.5); item(D, 'kit', 24.35, 9.6, 1.06); item(D, 'kit', 29.65, 11.2, 1.06); item(D, 'batt', 26.8, 8.35, 1.06, 3); item(D, 'pipe', 26.8, 10.6, 0.02);
  room(D, 'Distribution', 31, 8, 8, 5, E); door(D, 34, 13, { sg: [['Distribution', 's']] });
  ['OPS', 'CARGO', 'RES', 'HORT', 'HYD'].forEach((c, k) => panel(D, c, 32.4 + k * 1.2, 8.06, 's')); bx(D, 34.8, 8.5, 6.4, 0.01, 0.9, 0xb89b2e, { y: 0.012, c: 0 });
  for (const x of [31.6, 38.4]) bx(D, x, 10.6, 0.9, 2, 2.4, 0x4a4f55); note(D, 'route', 37, 12.4, 0.02);
  room(D, 'Chillers', 40, 8, 8, 5, E); door(D, 43, 13, { sg: [['Chillers', 's']] }); for (let q = 0; q < 3; q++) bx(D, 41.4 + q * 2.6, 10, 2, 2.2, 3, 0x5a6a72); bx(D, 44, 8.4, 7.6, 0.2, 0.2, 0x3d4042, { y: 2.8, c: 0 });
  room(D, 'Backup plant', 49, 8, 5, 5, E); door(D, 51, 13, { sg: [['Backup plant', 's']] }); genset(D, 'ENG', 50.2, 8.6, 50.2, 9.3); genset(D, 'ENG', 52.6, 8.6, 52.6, 9.3);
  room(D, 'Infirmary', 14, 17, 4, 5, { ...MED, c: 'ENG' }); door(D, 15, 16, { sg: [['Infirmary', 'n']] }); medbed(D, 14.4, 19); item(D, 'bandage', 17.4, 20.6, 0.02, 2); item(D, 'medkit', 16.4, 21.4, 0.02);
  room(D, 'Water treatment', 19, 17, 10, 5, E); door(D, 23, 16, { sg: [['Water', 'n']] }); for (const x of [21, 25]) P(D, 'cyl', x, 19.6, 2.4, 3, 2.4, 0x3b4d57);
  for (const z of [18, 20]) bx(D, 28.2, z, 1, 1.6, 1.4, 0x3f5148); bx(D, 24, 21.6, 9.6, 0.14, 0.14, 0x3d4042, { y: 2.4, c: 0 });
  room(D, 'Control room', 30, 17, 7, 5, E); door(D, 33, 16, { sg: [['Control', 'n']] }); tbl(D, 33.5, 21.2, 5, 0.8);
  for (let k = 0; k < 5; k++) { bx(D, 31.3 + k * 1.1, 21.94, 1, 0.7, 0.06, 0x22262a, { y: 1.2, c: 0 }); bx(D, 31.3 + k * 1.1, 21.92, 0.9, 0.6, 0.02, [0.05, 0.07, 0.08], { y: 1.25, c: 0, pw: [[0.04, 0.05, 0.05], [2.3, 2.6, 2.75]] }); }
  item(D, 'batt', 32, 21.2, 0.78);
  room(D, 'Locker room', 38, 17, 6, 5, E); door(D, 40, 16, { sg: [['Lockers', 'n']] }); for (let k = 0; k < 6; k++) bx(D, 38.6 + k * 0.9, 21.7, 0.8, 1.9, 0.5, 0x4d5863); bx(D, 41, 19.4, 3, 0.42, 0.4, 0x44484c); item(D, 'hardhat', 41.6, 19.4, 0.44); item(D, 'bandage', 39.4, 19.4, 0.44);
  overgrow(D, wc, 0.6, true); overgrow(D, shop, 0.7, true);
  mut(D, 'vine', 13.12, 15.5, { yaw: PI / 2 }); mut(D, 'vine', 17.5, 12.88, { yaw: PI }); mut(D, 'rootworm', 16, 10.4); mut(D, 'rootworm', 20, 11.2); mut(D, 'rootworm', 18.6, 9.2); mut(D, 'rootworm', 22, 14.6); mut(D, 'rootworm', 26, 15.4);
  mut(D, 'husk', 46, 14.6); mut(D, 'husk', 58, 15.4, { post: 1, yaw: -PI / 2 });
  /* the link, and the generator hall */
  door(D, 64, 14, { sg: [['Generator hall', 'w'], ['Engineering', 'e']] }); room(D, 'Link corridor', 65, 14, 15, 2, { ...E, em: 1 }); door(D, 80, 14, { sg: [['Gen-1', 'w']] });
  room(D, 'Generator hall', 81, 9, 49, 12, { ...E, ht: 16, em: 1 });
  /* Gen-1: 24 m of housing with its stacks, and the board on its west face: the fuse socket and the main breaker */
  bx(D, 119.5, 15, 22, 5, 9, 0x44525a); bx(D, 119.5, 15, 20, 1, 8, 0x36424a, { y: 5, c: 0 }); for (const x of [115, 124]) for (const z of [13, 17]) P(D, 'cyl', x, z, 0.9, 6, 0.9, 0x2c3338, { y: 6, c: 0 });
  for (const q of [-1, 1]) bx(D, 119.5, 15 + q * 2.4, 22.4, 0.04, 0.12, 0x8a7a2a, { y: 2.4, c: 0 }); bx(D, 119.5, 15, 24, 0.01, 11, 0xb89b2e, { y: 0.012, c: 0 });
  bx(D, 113.6, 15, 0.34, 2, 1.7, 0x3a3f44); bx(D, 113.5, 14.7, 0.06, 0.3, 0.2, 0x15181b, { y: 1.05, c: 0 }); bx(D, 113.48, 15.3, 0.08, 0.4, 0.08, 0xa82a20, { y: 1, c: 0, rz: 0.5 });
  bx(D, 113.5, 15, 0.06, 0.1, 0.1, [0.3, 0.05, 0.04], { y: 1.7, c: 0, pw: [[2.9, 2.15, 2.1], [2.2, 2.9, 2.3]] }); bx(D, 113.1, 15, 0.9, 0.01, 1.9, 0xb89b2e, { y: 0.013, c: 0 });
  use(D, 'fuse', 113.2, 14.7, 1.2); use(D, 'breaker', 113.2, 15.3, 1.2);
  /* the hall's fittings: transformers along both walls, cable trays and ducts overhead, the crane that set Gen-1 in place */
  for (let x = 86; x <= 110; x += 6) for (const z of [9.6, 20.4]) { bx(D, x, z, 2.4, 2.4, 1.4, 0x3f4a50); bx(D, x, z, 2, 0.3, 1, 0x2c3338, { y: 2.4, c: 0 }); for (const q of [-0.6, 0, 0.6]) P(D, 'cyl', x + q, z, 0.18, 0.5, 0.18, 0xb8bcc0, { y: 2.7, c: 0 }); }
  for (const z of [9.3, 20.7]) { bx(D, 105, z, 48, 0.12, 0.6, 0x5a5d60, { y: 6, c: 0 }); bx(D, 105, z, 48, 0.5, 0.5, 0x3d4042, { y: 9, c: 0 }); }
  for (const z of [9.25, 20.75]) bx(D, 105, z, 96, 0.5, 0.4, 0x5a5d60, { y: 13.4, c: 0 }); bx(D, 119.5, 15, 1.2, 1, 23.4, 0xc9a227, { y: 13.6, c: 0 }); bx(D, 119.5, 13.5, 1.6, 0.8, 1.6, 0x2a2c2e, { y: 13, c: 0 });
  bx(D, 119.5, 13.5, 0.06, 6.4, 0.06, 0x2a2c2e, { y: 6.6, c: 0 }); bx(D, 119.5, 13.5, 0.5, 0.4, 0.5, 0x8a7a2a, { y: 6.3, c: 0 });
  bx(D, 100, 9.09, 0.8, 1.9, 0.18, 0xa82a20); item(D, 'axe', 100, 9.6, 0.02); item(D, 'batt', 90, 19.5, 0.02); mut(D, 'husk', 92, 12.6); mut(D, 'husk', 104, 18.4);
  /* the east end, where the green comes down the exhaust shaft */
  overgrow(D, { x: 125, y: 9, w: 5, h: 12, ht: 16 } as TRoom, 1.1, true); for (const [x, z] of [[126, 11], [128, 17], [127, 14.6], [124, 19]]) mut(D, 'rootworm', x, z); mut(D, 'vine', 129.88, 13, { yaw: -PI / 2 });
  door(D, 130, 14, { sg: [['Exhaust shaft', 'w']] }); const xl = room(D, 'Exhaust link', 131, 14, 2, 2, { ...E, em: 1 }); door(D, 133, 14);
  const xs = room(D, 'Exhaust shaft', 134, 12, 4, 6, { ...E, em: 1 }); ladder(D, 'B2', 136.6, 12.6, 135.6, 13.4, PI / 2, true); overgrow(D, xl, 1.2, true); overgrow(D, xs, 1.2, true); mut(D, 'rootworm', 135, 16.4);
  return finishLevel([9.6, 16.1, PI / 2]); // at the foot of A2, for ?level=plant
}
