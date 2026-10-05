import { PI } from '../../core/math';
import type { LevelDef, LadderDef } from '../types';
import {
  arch, beginLevel, bx, cave, door, elev, finishLevel, item, ladder, mkDeck, mul3, mut, note, P, roughen, room, stack, type Deck, type LevelInfo,
} from '../build/tiles';
import {
  BAY, CELL, LOW, MED, OPS, SEC, UTIL, WALK, blood, bed, container, corpse, crates, desk, eggs, forklift, genset, gore, liftRoom, medbed, shelf, tbl,
} from '../build/fittings';

/* Upper station, 40 m down. Security and Ops (x 14 to 94) off the main shaft; the Cargo cavern (x 110 to 240); the exhaust
   shaft (x 260). Start here.
   Ported from the first engine (index.html, buildUpper and buildCargo2) on the tile adapter: tile units, as it had them.
   The frame: org [-10, -30], so tile i is plan x = 2i - 10 and tile j is plan z = 2j - 30. */

export const UPPER: LevelInfo = { id: 'upper', name: 'Upper station', c: 'OPS', org: [-10, -30] };

export function buildUpper(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(UPPER, ladders);
  const lv = UPPER, D = mkDeck(lv, 140, 30);
  /* the main shaft: the hoist cage (runs on Gen-1), the surface cage, and ladderway A down the shaft */
  liftRoom(D, 5, 14, 7, 14);
  room(D, 'Shaft station', 8, 14, 3, 3, { ...UTIL, em: 1, safe: 1 }); door(D, 11, 14, { sg: [['Lobby', 'w'], ['Shaft station', 'e']] });
  room(D, 'Surface cage', 8, 11, 2, 2, { ...OPS, c: 'LIFT', nolamp: 1, noroam: 1, safe: 1 }); door(D, 8, 13, { kind: 'heavy', c: 'LIFT', lift: true, sg: [['Surface', 's']] });
  ladder(D, 'A1', 10.5, 16.6, 9.6, 16.1, PI / 2, false);
  /* the lobby, across the spine at the west end */
  room(D, 'Lobby', 12, 10, 8, 10, { ...OPS, ht: 5, em: 1 }); door(D, 20, 14, { sg: [['Security', 'w'], ['Lobby', 'e']] });
  bx(D, 16, 17.6, 3, 1, 0.7, 0x6b5a48); bx(D, 18.6, 10.4, 1.8, 0.42, 0.45, 0x5f6266); bx(D, 12.4, 12, 0.45, 0.42, 1.4, 0x5f6266);
  corpse(D, 17.5, 12.5, 0x2c3440, true, { label: 'Search the officer', say: 'A security officer. Whatever opened him did it from behind.', keys: ['s'] }); mut(D, 'husk', 14, 18.4, { post: 1, yaw: PI / 2 });
  /* the spine: Security corridor, then Operations corridor, then the link to Cargo */
  room(D, 'Security corridor', 21, 14, 14, 2, { ...SEC, em: 1, safe: 1 }); genset(D, 'OPS', 21.5, 14.3, 21.6, 14.9);
  door(D, 35, 14, { sg: [['Operations', 'w'], ['Security', 'e']] });
  room(D, 'Operations corridor', 36, 14, 16, 2, { ...OPS, em: 1 }); mut(D, 'husk', 46, 14.6); mut(D, 'husk', 41.2, 15.3); blood(D, 48, 15, 1.2);
  room(D, 'Phase 2', 50, 11, 1, 2, { ...UTIL, lit: 'none', nolamp: 1, noroam: 1 }); door(D, 50, 13, { kind: 'heavy', seal: true, msg: 'Welded shut. Stencilled across it: PHASE 2. NOT COMMISSIONED.', sg: [['Phase 2', 's']] });
  door(D, 52, 14, { sg: [['Cargo', 'w'], ['Operations', 'e']] }); room(D, 'Cargo link', 53, 14, 6, 2, { ...UTIL, c: 'CARGO', em: 1 });
  door(D, 59, 14, { sg: [['Cargo cavern', 'w']] });
  /* north of the spine. Holding: a short block with two cells a side; you wake in W2 */
  room(D, 'Holding block', 24, 6, 2, 7, { ...CELL, lit: 'always', lc: LOW, safe: 1 }); door(D, 24, 13, { open: true, sg: [['Holding', 's']] });
  for (const [k, y] of [[1, 6], [2, 9]]) {
    room(D, 'Cell W' + k, 21, y, 2, 2, { ...CELL, lit: 'always', lc: mul3(LOW, 0.8), safe: 1, nolamp: 1 }); room(D, 'Cell E' + k, 27, y, 2, 2, { ...CELL, lit: 'always', lc: mul3(LOW, 0.8), safe: 1, nolamp: 1 });
    bed(D, 21.3, y + 1, true, 0x6d7178); bx(D, 22.75, y + 1.75, 0.4, 0.42, 0.4, 0xb8bcc0); bed(D, 28.7, y + 1, true, 0x6d7178); bx(D, 27.25, y + 1.75, 0.4, 0.42, 0.4, 0xb8bcc0);
    door(D, 23, y, { open: k === 2, seal: k !== 2 }); door(D, 26, y, { open: k === 2, seal: k !== 2 });
  }
  note(D, 'intake', 22.5, 9.35, 0.02); blood(D, 28, 10, 1.4); bx(D, 27.2, 9.5, 1.6, 0.01, 0.3, 0x3a0b0b, { y: 0.02, c: 0 });
  room(D, 'Guard post', 30, 9, 4, 4, { ...SEC, lit: 'always', lc: LOW, safe: 1 }); door(D, 31, 13, { open: true, sg: [['Guard post', 's']] });
  desk(D, 31.2, 9.6, 1.8, 0.7); bx(D, 31.2, 10.2, 0.45, 0.45, 0.45, 0x2c2f33); for (let k = 0; k < 3; k++) bx(D, 33.7, 9.3 + k * 0.3, 0.5, 1.9, 0.5, 0x4d5863); bx(D, 33, 12.7, 1.6, 0.42, 0.4, 0x44484c);
  item(D, 'flash', 30.75, 9.7, 0.78); item(D, 'batt', 31.65, 9.7, 0.78); note(D, 'duty', 31.5, 9.45, 0.78); item(D, 'baton', 32.8, 12.7, 0.44); item(D, 'ration', 33.3, 12.7, 0.44);
  room(D, 'Security control', 35, 8, 4, 5, SEC); door(D, 36, 13, { card: 's', sg: [['Control', 's']] });
  tbl(D, 37, 8.5, 5, 0.8);
  for (let k = 0; k < 5; k++) { bx(D, 35.8 + k * 0.6, 8.06, 1, 0.7, 0.06, 0x22262a, { y: 1.2, c: 0 }); bx(D, 35.8 + k * 0.6, 8.08, 0.9, 0.6, 0.02, [0.05, 0.07, 0.08], { y: 1.25, c: 0, pw: [[0.04, 0.05, 0.05], [2.3, 2.6, 2.75]] }); }
  note(D, 'cams', 36.4, 8.5, 0.78); item(D, 'batt', 37.8, 8.5, 0.78, 2); item(D, 'ammo9', 35.5, 12.5, 0.02);
  room(D, 'Operations room', 40, 6, 8, 7, { ...OPS, ht: 4 }); door(D, 43, 13, { sg: [['Operations room', 's']] });
  tbl(D, 44, 9.4, 6, 2.2, 0x4a3a2c); for (let k = 0; k < 5; k++) for (const s of [-1, 1]) bx(D, 42.2 + k * 0.9, 9.4 + s * 0.85, 0.45, 0.45, 0.45, 0x2c2f33);
  for (let k = 0; k < 6; k++) { bx(D, 41 + k * 1.2, 6.06, 2, 1.2, 0.06, 0x22262a, { y: 1.3, c: 0 }); bx(D, 41 + k * 1.2, 6.08, 1.9, 1.1, 0.02, [0.05, 0.07, 0.08], { y: 1.35, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]] }); }
  corpse(D, 46.6, 11.8, 0x4a4238, false, { label: 'Search the manager', say: 'DEPUTY DIRECTOR, OPERATIONS. Her pass is still on its lanyard.', keys: ['o'] });
  note(D, 'memo', 43, 9.3, 0.78); eggs(D, 40.6, 6.6, 3); mut(D, 'husk', 41.4, 11.6, { post: 1, yaw: 0 }); gore(D, 47, 7.2, 3);
  /* south of the spine */
  room(D, 'Armory', 21, 17, 5, 4, SEC); door(D, 23, 16, { kind: 'heavy', code: 1, sg: [['Armory', 'n']] });
  shelf(D, 21.3, 19, 0.5, 3, { empty: 1 }); shelf(D, 25.7, 19, 0.5, 3, { empty: 1 }); bx(D, 23.5, 20.5, 0.9, 0.7, 0.7, 0x3a4030);
  item(D, 'pistol', 21.35, 18.3, 1.06); item(D, 'ammo9', 21.35, 18.9, 1.06, 2); item(D, 'shotgun', 21.35, 19.6, 1.06); item(D, 'shells', 25.65, 18.4, 1.06, 2); item(D, 'tacvest', 25.65, 19.4, 1.06); item(D, 'surf', 23.5, 20.5, 0.7);
  room(D, 'Firing range', 27, 17, 3, 7, { ...SEC, lit: 'none' }); door(D, 28, 16, { sg: [['Range', 'n']] });
  bx(D, 28.1, 19, 4, 1, 0.4, 0x44484c); for (const x of [27.5, 28.5, 29.5]) { bx(D, x, 23.6, 0.5, 1, 0.06, 0xc8c0a0, { y: 0.6, c: 0 }); bx(D, x, 23.6, 0.06, 0.6, 0.06, 0x2a2c2e, { c: 0 }); }
  item(D, 'ammo9', 27.6, 19, 1.02); mut(D, 'skitter', 28.6, 22); eggs(D, 27.4, 23.2, 2);
  room(D, 'Hazardous storage', 31, 17, 4, 4, { ...UTIL, c: 'OPS' }); door(D, 32, 16, { kind: 'heavy', sg: [['Hazard store', 'n']] });
  for (const [x, z] of [[31.4, 20.5], [32, 20.6], [31.4, 19.8], [34.6, 17.4]]) P(D, 'cyl', x, z, 0.6, 0.9, 0.6, 0xc9a227); shelf(D, 34.7, 19.6, 0.5, 2.2, { cols: [0xc9a227, 0x3d4042] }); bx(D, 33.3, 20.5, 0.8, 0.6, 0.6, 0x3a4030);
  item(D, 'rebreather', 33.3, 20.5, 0.6); item(D, 'kit', 34.65, 19.3, 1.06);
  room(D, 'Infirmary', 36, 17, 3, 4, { ...MED, safe: 1 }); door(D, 37, 16, { sg: [['Infirmary', 'n']] });
  medbed(D, 36.3, 19.6); shelf(D, 38, 20.7, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] }); item(D, 'bandage', 37.7, 20.65, 1.06, 2); item(D, 'medkit', 38.3, 20.65, 1.06);
  for (const [nm, x, dopt] of [['Office: operations', 40, { card: 'o' }], ['Office: logistics', 44, { open: true }], ['Office: chief of security', 48, { card: 'o' }]] as const) {
    room(D, nm, x, 17, 3, 4, { ...OPS, lc: [0.85, 0.78, 0.62] }); door(D, x + 1, 16, dopt); desk(D, x + 1.5, 19.9, 1.8, 0.7, { c: 0x4a3a2c }); bx(D, x + 1.5, 19.2, 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, x + 0.3, 18.3, 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  }
  note(D, 'mgr', 41.2, 19.85, 0.78); item(D, 'batt', 41.85, 19.9, 0.78); item(D, 'peaches', 45.85, 19.9, 0.78); item(D, 'bandage', 45.2, 19.85, 0.78); note(D, 'chief', 49.2, 19.85, 0.78); item(D, 'ammo9', 49.85, 19.9, 0.78); item(D, 'medkit', 50.5, 17.4, 0.02);
  buildCargo(lv, D);
  return finishLevel([22.3, 9.7, -PI / 2]);
}

/* the Cargo cavern: a 20 m vault, x 110 to 240, with three tiers stepped up its north side at +5, +10 and +15 and a platform
   between each. Dead and black until its backup set runs, which also moves the platforms, and wakes the nest that thickens
   toward the roof. East of it, the link to the exhaust shaft and ladderway B under the sealed fan door. */
function buildCargo(lv: LevelInfo, D: Deck): void {
  const cav = cave(D, 'Cargo cavern', 60, 8, 65, 14, { ...BAY, ht: 20, c: 'CARGO', lit: 'main', em: 1 }); arch(D, cav, 5); roughen(D, cav, 0, 1.2);
  const tier = (y0: number, li: number) => mkDeck(lv, 140, 30, { y0, li }), T1 = tier(5, 1), T2 = tier(10, 2), T3 = tier(15, 3);
  stack(D, T1); stack(T1, T2); stack(T2, T3);
  const TW = { ...WALK, ht: 5, c: 'CARGO' };
  room(T1, 'Tier 1', 68, 8, 48, 5, TW); room(T2, 'Tier 2', 72, 8, 39, 5, TW); room(T3, 'Tier 3', 76, 8, 25, 5, TW);
  elev(D, T1, 70, 11, 2, 2, 'CARGO', 'Cargo platform'); elev(T1, T2, 74, 11, 2, 2, 'CARGO', 'Cargo platform'); elev(T2, T3, 78, 11, 2, 2, 'CARGO', 'Cargo platform');
  /* the gantry crane, on rails along both walls */
  for (const z of [8.2, 21.8]) bx(D, 92.5, z, 128, 0.5, 0.4, 0x5a5d60, { y: 17.4, c: 0 });
  bx(D, 90, 15, 1, 0.8, 27.4, 0xc9a227, { y: 17.6, c: 0 }); bx(D, 90, 16.5, 1.4, 0.6, 1.4, 0x2a2c2e, { y: 17, c: 0 }); bx(D, 90, 16.5, 0.05, 8.6, 0.05, 0x2a2c2e, { y: 8.4, c: 0 }); bx(D, 90, 16.5, 0.5, 0.4, 0.5, 0x8a7a2a, { y: 8, c: 0 });
  /* the floor: receiving at the west end, containers and forklifts, the nest at the east end */
  crates(D, 62, 18, 2); blood(D, 64, 16, 1.4); crates(D, 66, 10, 2);
  container(D, 72, 20, false, 2); container(D, 80, 20, false, 3); container(D, 95, 20.2, false, 2); container(D, 104, 19.4, true, 1); container(D, 84, 10, false, 1); container(D, 98, 9.6, false, 1);
  container(D, 88, 17.4, true, 2); container(D, 110, 17.6, true, 3); crates(D, 92, 12, 2); crates(D, 106, 11, 2); forklift(D, 76, 16.5, true); forklift(D, 101, 16.8, false);
  mut(D, 'husk', 80, 14.6); mut(D, 'husk', 96, 15.4);
  for (const [x, z, n] of [[114, 12, 4], [117, 18, 5], [119, 10, 3], [121, 15, 5], [123, 20, 4], [116, 14.6, 3]]) eggs(D, x, z, n); gore(D, 118, 15.5, 4); blood(D, 120, 13, 2);
  mut(D, 'worm', 117, 16); mut(D, 'worm', 118, 17); mut(D, 'worm', 116.5, 17.4); mut(D, 'skitter', 121, 12); mut(D, 'husk', 112, 19, { post: 1, yaw: -PI / 2 });
  /* the tiers: thicker with every one */
  crates(T1, 80, 9.5, 2); container(T1, 92, 9.6, false, 1); for (const [x, z] of [[85, 10], [99, 9], [108, 11]]) eggs(T1, x, z, 4); mut(T1, 'skitter', 88, 11); mut(T1, 'skitter', 104, 10);
  for (const [x, z] of [[76, 9], [84, 11], [90, 9], [96, 10.6], [103, 9.4], [108, 10]]) eggs(T2, x, z, 5); gore(T2, 93, 10, 4); mut(T2, 'skitter', 86, 10); mut(T2, 'skitter', 97, 11); mut(T2, 'skitter', 105, 9.6);
  mut(T2, 'grabber', 90, 8.12, { yaw: 0 });
  for (const [x, z] of [[77, 9], [80, 11], [83, 9.4], [86, 10.8], [89, 9], [92, 11], [95, 9.6], [98, 10.6]]) eggs(T3, x, z, 6); gore(T3, 88, 10, 5); gore(T3, 94, 9.6, 4);
  mut(T3, 'skitter', 82, 10); mut(T3, 'skitter', 90, 11.4); mut(T3, 'skitter', 97, 9); bx(T3, 96, 9.4, 1.1, 0.6, 1.1, 0x6b5a3c); item(T3, 'fuse', 96, 9.4, 0.6); item(T3, 'batt', 95, 10.4, 0.02, 2);
  /* south of the floor: the cargo office, with the backup set, and the vehicle bay */
  room(D, 'Cargo office', 62, 23, 4, 4, { ...UTIL, c: 'CARGO' }); door(D, 63, 22, { sg: [['Cargo office', 'n']] });
  desk(D, 63.4, 26.3, 1.8, 0.7); note(D, 'manifest', 63.1, 26.25, 0.78); item(D, 'batt', 63.75, 26.3, 0.78); genset(D, 'CARGO', 65.3, 23.7, 64.7, 24.3); item(D, 'bandage', 62.4, 23.5, 0.02);
  room(D, 'Vehicle bay', 68, 23, 6, 4, { ...UTIL, c: 'CARGO' }); door(D, 70, 22, { sg: [['Vehicles', 'n']] });
  forklift(D, 69, 25.3, true); forklift(D, 72.4, 25.2, true); crates(D, 70.6, 23.8, 1); item(D, 'batt', 73.4, 23.5, 0.02); item(D, 'pipe', 71, 26.6, 0.02);
  /* east: the link to the exhaust shaft, and the top of ladderway B */
  door(D, 125, 14, { sg: [['Exhaust shaft', 'w']] }); room(D, 'Exhaust link', 126, 14, 6, 2, { ...UTIL, c: 'CARGO', em: 1 }); mut(D, 'grabber', 128.5, 14.12, { yaw: 0 });
  door(D, 132, 14, { sg: [['Fan station', 'w']] }); room(D, 'Fan station', 133, 12, 5, 6, { ...UTIL, c: 'CARGO', ht: 6, em: 1 });
  P(D, 'cyl', 135.6, 14.6, 4.4, 0.8, 4.4, 0x3b4046, { y: 5, c: 0 }); for (let k = 0; k < 4; k++) bx(D, 135.6, 14.6, 4, 0.06, 0.5, 0x5a5d60, { y: 4.8, c: 0, ry: (k * PI) / 4 });
  ladder(D, 'B1', 136.6, 16.6, 135.6, 16.4, PI / 2, false);
}

