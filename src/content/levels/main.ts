import { PI, TAU, type Colour } from '../../core/math';
import type { LadderDef, LevelDef } from '../types';
import {
  beginLevel, bx, cave, door, finishLevel, hill, item, ladder, mkDeck, mut, note, P, pick, rnd, ROCKP, room, roughen, stack, stairs, T, vault,
  type Deck, type LevelInfo, type TDoorOpts, type TRoom, type TRoomOpts,
} from '../build/tiles';
import {
  GR, HAB, HRT, MED, SEC, UTIL, WALK, bed, blood, body, column, corpse, crates, desk, eggs, genset, gore, liftRoom, medbed, overgrow, shelf, tbl, tree,
} from '../build/fittings';

/* The main level, 90 m down: the Commons (a street of residences under a cavern roof, three storeys of flats on
   galleries), the Square at its east end, and Horticulture beyond the airlock. Ported from the first engine
   (archive/first-engine.html: buildMain, buildSquare, flatRect, groundFloor, buildHorticulture) on the tile adapter, in
   tile units.
   One change: the storeys are 3.5 m apart (the first engine had 3.4), so floors fall on the 0.25 m grid (engine.md §14). */

export const MAIN: LevelInfo = { id: 'main', name: 'Main level', c: 'RES', org: [-10, -30] };
const STOREY = 3.5;

/** a flat: [its door, what is inside, what is on the table, and for a body the card it carries] */
type Flat = [TDoorOpts, 'clean' | 'gore' | 'worm' | 'nest' | 'post' | 'body', string, string?];

export function buildMain(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(MAIN, ladders);
  const lv = MAIN;
  const G = mkDeck(lv, 140, 30), S2 = mkDeck(lv, 140, 30, { y0: STOREY, li: 1 }), S3 = mkDeck(lv, 140, 30, { y0: 2 * STOREY, li: 2 }), RF = mkDeck(lv, 140, 30, { y0: 3 * STOREY, li: 3 });
  stack(G, S2); stack(S2, S3); stack(S3, RF);
  /* the main shaft: the hoist, the foot of ladderway A1, and A2 on down (collapsed) */
  liftRoom(G, 5, 14, 7, 14); room(G, 'Shaft station', 8, 14, 3, 3, { ...UTIL, em: 1, safe: 1 }); door(G, 11, 14, { sg: [['The Commons', 'w'], ['Shaft station', 'e']] });
  ladder(G, 'A1', 10.5, 16.6, 9.6, 16.1, PI / 2, true); ladder(G, 'A2', 8.5, 16.6, 9.4, 15.6, PI / 2, false);
  /* the cavern: the street between the rows, the plazas at either end, and its volume over the roofs */
  const CM: TRoomOpts = { fl: 0x8d8a7c, wl: 0xa5a296, st: 0x3f7f6b, ht: 20, sky: 0x86a9c4, em: 1, c: 'RES' };
  room(G, 'The Commons', 12, 12, 55, 6, CM); for (const y of [8, 18]) room(G, 'The Commons', 12, y, 2, 4, CM);
  const AIR: TRoomOpts = { ...CM, air: 1, ht: 20 - 3 * STOREY, fl: 0x55524a, noroam: 1, nolamp: 1 };
  for (const y of [8, 18]) room(RF, 'The Commons', 14, y, 57, 4, AIR); for (const y of [4, 22]) room(RF, 'The Square', 67, y, 22, 4, AIR); for (const y of [8, 16]) room(RF, 'The Square', 85, y, 4, 6, AIR);
  /* galleries along both fronts on storeys 2 and 3, a bridge across on each, and stairs: street to 2 at both plazas, 2 to 3 mid-street */
  const GW: TRoomOpts = { ...WALK, c: 'RES', fl: 0x6a665e, wl: 0x8c887e };
  for (const y of [12, 16]) { room(S2, 'Gallery', 12, y, 59, 2, { ...GW, ht: 3.4 }); room(S3, 'Gallery', 12, y, 55, 2, { ...GW, ht: 3.2 }); }
  room(S2, 'Bridge', 50, 14, 1, 2, { ...GW, ht: 3.4 }); room(S3, 'Bridge', 26, 14, 1, 2, { ...GW, ht: 3.2 });
  stairs(G, S2, 12, 8, 4, 's'); stairs(G, S2, 12, 18, 4, 'n');
  stairs(S2, S3, 44, 13, 4, 'e'); stairs(S2, S3, 30, 16, 4, 'w');
  for (let k = 0; k < 6; k++) { const x = 22.5 + 8 * k; column(G, x, 13.85, STOREY); column(G, x, 16.15, STOREY); }
  /* the street itself: the sick tree, benches, lamps, and what happened here */
  P(G, 'cyl', 46, 15, 3.6, 0.5, 3.6, 0x8a8a84); P(G, 'cyl', 46, 15, 3.3, 0.08, 3.3, 0x3a2e22, { y: 0.5, c: 0 }); tree(G, 46, 15, 5, 0.5, true);
  for (const [x, z, ns] of [[40, 14.4, 0], [52, 15.6, 0], [28, 15.6, 0], [64, 14.4, 0]]) bx(G, x, z, ns ? 0.45 : 1.8, 0.42, ns ? 1.8 : 0.45, 0x5f6266);
  for (const [x, z] of [[20, 14.25], [36, 15.75], [56, 14.25], [64, 15.75]]) { P(G, 'cyl', x, z, 0.12, 3.3, 0.12, 0x3a3d40); bx(G, x, z, 0.5, 0.12, 0.5, 0xe8eef2, { y: 3.3, c: 0, glow: 1 }); }
  bx(G, 58, 15.2, 1.8, 0.9, 0.1, 0x5b5d5f, { rz: 0.25, ry: 1.2 }); bx(G, 57.4, 16.2, 0.6, 0.6, 0.6, 0x6b5a3c, { ry: 0.6 }); blood(G, 57, 15.4, 2.4); blood(G, 34, 14.6, 1.6); blood(G, 70, 15, 1.4); gore(G, 48, 13.4, 3);
  eggs(G, 13, 9, 3); eggs(G, 13, 20.5, 2);
  mut(G, 'bloat', 30, 15); mut(G, 'husk', 20, 13); mut(G, 'husk', 36, 15.6); mut(G, 'husk', 52, 13.2); mut(G, 'husk', 62, 16);
  mut(S2, 'husk', 25, 12.6); mut(S2, 'husk', 58, 16.6); mut(S3, 'husk', 40, 12.6);
  /* the blocks. Each is 7 x 3 tiles behind a facade row with its doors: north rows 8 to 10 (facade 11), south rows 19 to 21 (facade 18).
     Ground floors are the street's rooms; storeys 2 and 3 are flats, but for the director's at the top of the trauma centre. */
  const HB: TRoomOpts = { ...HAB, c: 'RES', lc: [0.85, 0.78, 0.62] }, fl: string[] = [];
  const flat = (D: Deck, x0: number, north: boolean, dc: number, nm: string, v: Flat) => {
    const y0 = north ? 8 : 19, fy = north ? 11 : 18, cz = north ? y0 + 1.1 : y0 + 1.9, back = north ? y0 + 0.3 : y0 + 2.7;
    room(D, 'Residence ' + nm, x0, y0, 7, 3, { ...HB, fl: 0x74685a, lit: v[1] === 'worm' || v[1] === 'nest' ? 'none' : 'main', ...(v[1] === 'nest' ? { motes: 'flesh' } : {}) }); door(D, x0 + dc, fy, v[0]);
    bed(D, x0 + 0.4, y0 + 1.5, true, fl.length % 3 ? 0x5f6b78 : 0x7a5a50); tbl(D, x0 + 3.5, y0 + 1.5, 1.4, 0.8, 0x6b5a48); bx(D, x0 + 6.7, back, 0.45, 1.9, 0.45, 0x5a5448); bx(D, x0 + 5.4, back, 1.8, 0.45, 0.7, 0x6b5f58);
    item(D, v[2], x0 + 3.5, y0 + 1.5, 0.78); fl.push(nm);
    const cx = x0 + 3.5 + (v[1] === 'post' ? 1.5 : 0);
    if (v[1] === 'gore') { gore(D, cx, cz, 4); body(D, cx + 0.4, cz + 0.4, pick([0x4a5560, 0x8a8f96, 0x6b6f5a]), true); if (fl.length % 2) mut(D, 'skitter', cx - 1, cz); }
    else if (v[1] === 'worm') { mut(D, 'worm', cx - 0.6, cz); mut(D, 'worm', cx + 0.6, cz + 0.4); mut(D, 'worm', cx + 1.4, cz); eggs(D, x0 + 1.6, back, 2); }
    else if (v[1] === 'nest') { eggs(D, cx - 0.8, cz, 3); eggs(D, x0 + 5, back, 3); mut(D, 'skitter', cx + 0.6, cz); }
    else if (v[1] === 'post') mut(D, 'husk', cx, cz, { post: 1, yaw: north ? PI : 0 });
    else if (v[1] === 'body') corpse(D, cx + 0.4, cz, pick([0x4a5560, 0x6b6f5a, 0x7a5a50]), true, { label: 'Search the resident', say: 'A room card on a lanyard. Not for this flat.', keys: [v[3]] });
  };
  /* cards lock six flats (two round the Square); each card lies on a body elsewhere */
  const RV: Record<string, Flat> = {
    'N1.2': [{ open: true }, 'clean', 'ration'], 'N2.2': [{ card: 'N2.2' }, 'clean', 'medkit'], 'N3.2': [{ stuck: true }, 'gore', 'bandage'], 'N4.2': [{}, 'post', 'batt'],
    'N5.2': [{ open: true }, 'worm', 'batt'], 'N6.2': [{ card: 'N6.2' }, 'body', 'ammo9', 'C7'],
    'N1.3': [{}, 'gore', 'batt'], 'N2.3': [{ open: true }, 'nest', 'bandage'], 'N3.3': [{}, 'body', 'ration', 'N2.2'], 'N4.3': [{ card: 'N4.3' }, 'clean', 'shells'],
    'N5.3': [{}, 'body', 'batt', 'S3.2'], 'N6.3': [{ stuck: true }, 'worm', 'knife'],
    'S1.2': [{}, 'gore', 'batt'], 'S2.2': [{ open: true }, 'post', 'bandage'], 'S3.2': [{ card: 'S3.2' }, 'clean', 'medkit'], 'S4.2': [{ stuck: true }, 'nest', 'medkit'],
    'S5.2': [{}, 'clean', 'batt'], 'S6.2': [{}, 'body', 'bandage', 'N6.2'],
    'S1.3': [{ open: true }, 'clean', 'ration'], 'S2.3': [{}, 'gore', 'batt'], 'S3.3': [{ stuck: true }, 'post', 'bandage'], 'S4.3': [{}, 'nest', 'batt'],
    'S6.3': [{ open: true }, 'clean', 'peaches'],
  };
  for (let k = 0; k < 6; k++) {
    const x0 = 15 + 8 * k;
    for (const north of [true, false]) {
      const nm = (north ? 'N' : 'S') + (k + 1);
      if (RV[nm + '.2']) flat(S2, x0, north, 1, nm + '.2', RV[nm + '.2']);
      if (RV[nm + '.3']) flat(S3, x0, north, 5, nm + '.3', RV[nm + '.3']);
      groundFloor(G, x0, north, k, HB);
    }
  }
  /* the director's residence: the top of the trauma centre's block, and what keeps the lift key */
  room(S3, "Director's residence", 47, 19, 7, 3, { ...HAB, c: 'RES', fl: 0x5e5248, lc: [0.85, 0.78, 0.62], noroam: 1 }); door(S3, 52, 18, { sg: [['Director', 'n']] });
  bed(S3, 47.4, 20.5, true, 0x7a5a50); tbl(S3, 49.4, 21.4, 2, 0.8, 0x4a3a2c); note(S3, 'keeper', 49.4, 21.35, 0.78); eggs(S3, 48.6, 19.6, 4); eggs(S3, 51, 21.4, 3); gore(S3, 50.4, 20.2, 5);
  mut(S3, 'bloat', 52.8, 20.6, { sit: 1, yaw: -PI / 2 }); mut(S3, 'husk', 48.6, 20.2, { post: 1, yaw: -PI / 2 }); mut(S3, 'husk', 50.2, 21.2, { post: 1, yaw: -PI / 2 }); mut(S3, 'skitter', 49.6, 19.6);
  buildSquare(G, S2, HB, GW, CM);
  /* east: the transit tunnel and the airlock to Horticulture */
  door(G, 89, 14, { sg: [['Horticulture', 'w'], ['The Square', 'e']] }); room(G, 'Transit tunnel', 90, 14, 3, 2, { ...UTIL, c: 'RES', em: 1 });
  door(G, 93, 14, { sg: [['Airlock', 'w']] }); room(G, 'Airlock', 94, 14, 3, 2, { ...UTIL, c: 'HORT', em: 1 });
  door(G, 97, 14, { sg: [['Horticulture', 'w']] });
  buildHorticulture(G);
  return finishLevel([9.6, 16.1, PI / 2]); // at the foot of ladder A1, for ?level=main
}

/* the Square, tiles 67 to 88 by 4 to 25: the court (71 to 84, rows 8 to 21) open to the cavern roof, the street coming in on the west and
   a passage out east to the tunnel; round it a band of rooms two storeys high behind a facade, with the ring gallery at storey 2 */
function buildSquare(G: Deck, S2: Deck, HB: TRoomOpts, GW: TRoomOpts, CM: TRoomOpts): void {
  room(G, 'The Square', 71, 8, 14, 14, CM); room(G, 'The Square', 67, 12, 4, 6, CM); room(G, 'The Square', 85, 14, 4, 2, CM);
  for (const [x, y, w, h] of [[71, 8, 14, 2], [71, 20, 14, 2], [71, 10, 2, 10], [83, 10, 2, 10]]) room(S2, 'Ring', x, y, w, h, { ...GW, ht: 3.4 });
  stairs(G, S2, 73, 10, 4, 'n'); stairs(G, S2, 81, 16, 4, 's');
  /* the centrepiece: the planter, and a tree the size of the court, gone the way of everything near Horticulture */
  P(G, 'cyl', 78, 15, 7.6, 0.6, 7.6, 0x8a8a84); P(G, 'cyl', 78, 15, 7.2, 0.08, 7.2, 0x3a2e22, { y: 0.6, c: 0 }); P(G, 'cyl', 78, 15, 0.9, 11, 0.9, 0x4a3b2c, { y: 0.6, c: 1 });
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * TAU + rnd(0.3), L = rnd(2.4, 4.2), y = rnd(4, 9.5);
    bx(G, 78 + (Math.cos(a) * L * 0.45) / T, 15 - (Math.sin(a) * L * 0.45) / T, L, 0.16, 0.16, 0x40332a, { y, c: 0, ry: a, rz: 0.5 });
    P(G, 'ico', 78 + (Math.cos(a) * L * 0.9) / T, 15 - (Math.sin(a) * L * 0.9) / T, rnd(1.2, 2.2), rnd(0.8, 1.5), rnd(1.2, 2.2), pick([0x8c4a44, 0x6e2b28, 0xb08572, 0x4f7a40]), { y: y + 0.6, c: 0 });
  }
  for (let k = 0; k < 7; k++) { const a = rnd(TAU), L = rnd(2.6, 4.4); bx(G, 78 + (Math.cos(a) * L * 0.5) / T, 15 - (Math.sin(a) * L * 0.5) / T, L, 0.22, 0.3, 0x3a2e22, { y: 0.02, c: 0, ry: a }); }
  for (const [x, z, ns] of [[75.2, 15, 1], [80.8, 15, 1], [78, 12.2, 0], [78, 17.8, 0]]) bx(G, x, z, ns ? 0.45 : 1.8, 0.42, ns ? 1.8 : 0.45, 0x5f6266);
  for (const [x, z, n] of [[76.4, 13.2, 4], [79.6, 16.9, 3], [83, 19, 3], [72, 9, 2]]) eggs(G, x, z, n); blood(G, 74, 18.6, 2); gore(G, 82.6, 10, 3);
  mut(G, 'thresher', 78, 10.5); mut(G, 'bloat', 80, 19); mut(G, 'worm', 76.2, 16.6); mut(G, 'worm', 79.8, 13.4); mut(G, 'husk', 74.5, 18, { post: 1, yaw: PI / 2 }); mut(S2, 'skitter', 77, 8.6); mut(S2, 'skitter', 83.6, 16);
  /* the band. North and south: three rooms a side behind facades on rows 7 and 22 (the street's last four ground floors and new ones);
     west and east: two a side behind facades on columns 70 and 85. Storey 2 is ten flats, C1 to C10, their doors on the ring. */
  const nb = { y0: 4, fy: 7 }, sb = { y0: 23, fy: 22 };
  groundFloor(G, 67, true, 7, HB, { ...nb, dc: 5 }); groundFloor(G, 74, true, 6, HB, { ...nb, dc: 3 }); groundFloor(G, 67, false, 7, HB, { ...sb, dc: 5 }); groundFloor(G, 74, false, 6, HB, { ...sb, dc: 3 });
  const shop = (nm: string, x: number, y: number, w: number, h: number, dx: number, dy: number, sd: 'n' | 's' | 'e' | 'w', f: (x: number, y: number) => void) => {
    room(G, nm, x, y, w, h, { ...HB }); door(G, dx, dy, { sg: [[nm.split(' ')[0], sd]] }); f(x, y);
  };
  shop('Café', 81, 4, 7, 3, 82, 7, 's', (x, y) => { for (const q of [1.6, 4, 6.2]) tbl(G, x + q, y + 1.6, 1, 1, 0x8a7a5a); bx(G, x + 3.5, y + 0.3, 5, 1, 0.6, 0x6f7378); item(G, 'ration', x + 3, y + 0.3, 1.02, 2); blood(G, x + 5, y + 2.4, 1.2); });
  shop('Barbershop', 81, 23, 7, 3, 82, 22, 'n', (x, y) => { for (let q = 0; q < 3; q++) bx(G, x + 1.5 + q * 2, y + 2.4, 0.7, 1, 0.7, 0x7a2a2a); bx(G, x + 3.5, y + 2.94, 6, 1, 0.06, [0.16, 0.2, 0.22], { y: 1, c: 0 }); body(G, x + 4, y + 1.2, 0x6b6f5a, false); });
  shop('Kiosk', 67, 8, 3, 3, 70, 10, 'e', (x, y) => { bx(G, x + 2.2, y + 1.5, 0.6, 1, 2.4, 0x6b5a48); item(G, 'peaches', x + 2.2, y + 1, 1.02); shelf(G, x + 0.3, y + 1.5, 0.5, 2.4, { cols: [0xc9a227, 0x7a4a34] }); });
  shop('Florist', 67, 19, 3, 3, 70, 19, 'e', (x, y) => { for (let q = 0; q < 4; q++) P(G, 'cyl', x + 0.6 + (q % 2) * 1.2, y + 0.8 + Math.floor(q / 2) * 1.4, 0.5, 0.5, 0.5, 0x6b5a48); overgrow(G, { x, y, w: 3, h: 3, ht: 3.2 } as TRoom, 0.6, true); });
  shop('Transit office', 86, 8, 3, 5, 85, 11, 'w', (x, y) => { desk(G, x + 1.6, y + 0.6, 1.8, 0.7); item(G, 'batt', x + 1.6, y + 0.6, 0.78); shelf(G, x + 2.7, y + 3, 0.5, 2.4); });
  shop('Lost property', 86, 17, 3, 5, 85, 18, 'w', (x, y) => { shelf(G, x + 2.7, y + 2.4, 0.5, 3, { cols: [0x4d5a66, 0x6b5a3c, 0x8a7a6a] }); crates(G, x + 1, y + 3.6, 1); item(G, 'bandage', x + 1.2, y + 1.4, 0.02); });
  const CV: [number, number, number, number, number, number, string, Flat][] = [
    [67, 4, 7, 3, 71, 7, 'C1', [{}, 'clean', 'peaches']], [74, 4, 7, 3, 79, 7, 'C2', [{ card: 'C2' }, 'nest', 'medkit']], [81, 4, 7, 3, 84, 7, 'C3', [{ open: true }, 'body', 'bandage', 'N4.3']],
    [67, 23, 7, 3, 71, 22, 'C4', [{ open: true }, 'clean', 'ration']], [74, 23, 7, 3, 79, 22, 'C5', [{ open: true }, 'worm', 'peaches']], [81, 23, 7, 3, 84, 22, 'C6', [{}, 'worm', 'batt']],
    [67, 8, 3, 3, 70, 8, 'C7', [{ card: 'C7' }, 'clean', 'shells']], [67, 19, 3, 3, 70, 21, 'C8', [{}, 'clean', 'ration']], [86, 8, 3, 5, 85, 9, 'C9', [{}, 'gore', 'batt']], [86, 17, 3, 5, 85, 20, 'C10', [{}, 'post', 'bandage']],
  ];
  for (const [x, y, w, h, dx, dy, nm, v] of CV) flatRect(S2, x, y, w, h, dx, dy, nm, v, HB);
}

/* a flat of any shape: bed in the corner away from the door, table in the middle with what was left on it, and what happened here */
function flatRect(D: Deck, x: number, y: number, w: number, h: number, dx: number, dy: number, nm: string, v: Flat, HB: TRoomOpts): void {
  room(D, 'Residence ' + nm, x, y, w, h, { ...HB, fl: 0x74685a, lit: v[1] === 'worm' || v[1] === 'nest' ? 'none' : 'main', ...(v[1] === 'nest' ? { motes: 'flesh' } : {}) }); door(D, dx, dy, v[0]);
  const cx = x + w / 2, cz = y + h / 2, fx = dx < cx ? x + w - 0.6 : x + 0.6, fz = dy < cz ? y + h - 1.1 : y + 1.1, ox = dx < cx ? x + 0.4 : x + w - 0.4, oz = dy < cz ? y + h - 0.35 : y + 0.35;
  bed(D, fx, fz, true, 0x5f6b78); tbl(D, cx, cz, 1.2, 0.8, 0x6b5a48); item(D, v[2], cx, cz, 0.78); bx(D, ox, oz, 0.45, 1.9, 0.45, 0x5a5448);
  const vx = cx + (fx < cx ? 0.9 : -0.9), vz = cz + (fz < cz ? 0.7 : -0.7);
  if (v[1] === 'gore') { gore(D, vx, vz, 4); body(D, vx, vz, pick([0x4a5560, 0x8a8f96, 0x6b6f5a]), true); mut(D, 'skitter', vx, cz); }
  else if (v[1] === 'worm') { mut(D, 'worm', vx - 0.5, vz); mut(D, 'worm', vx + 0.5, vz); mut(D, 'worm', vx, cz); }
  else if (v[1] === 'nest') { eggs(D, vx, vz, 3); eggs(D, ox, oz - 0.3, 2); mut(D, 'skitter', vx, cz); }
  else if (v[1] === 'post') mut(D, 'husk', vx, vz, { post: 1, yaw: Math.atan2(dx - vx, dy - vz) });
  else if (v[1] === 'body') corpse(D, vx, vz, pick([0x4a5560, 0x6b6f5a, 0x7a5a50]), true, { label: 'Search the resident', say: 'A room card on a lanyard. Not for this flat.', keys: [v[3]] });
}

/* the ground floor of block k: the street's rooms, out of the old Commons */
function groundFloor(D: Deck, x0: number, north: boolean, k: number, HB: TRoomOpts, at: { y0?: number; fy?: number; dc?: number } = {}): void {
  const y0 = at.y0 || (north ? 8 : 19), fy = at.fy || (north ? 11 : 18), dc = at.dc || 3, sd = north ? 's' : 'n', back = north ? y0 + 0.3 : y0 + 2.7, front = north ? y0 + 2.6 : y0 + 0.4, mid = y0 + 1.5;
  const R = (nm: string, o: TRoomOpts = {}, dopt: TDoorOpts = {}) => { room(D, nm, x0, y0, 7, 3, { ...HB, ...o }); door(D, x0 + dc, fy, { sg: [[nm.split(' ')[0], sd]], ...dopt }); };
  if (north) switch (k) {
    case 0: R('Canteen', {}, { open: true }); for (const dz of [-0.6, 0.6]) tbl(D, x0 + 2.6, mid + dz, 3.2, 0.8, 0x8a8578); bx(D, x0 + 6, back, 1.8, 1, 0.6, 0x6f7378); item(D, 'peaches', x0 + 6, back, 1.02, 2);
      note(D, 'diary', x0 + 2.6, mid - 0.6, 0.78); blood(D, x0 + 4.4, front, 2); blood(D, x0 + 1, mid, 1.4); mut(D, 'husk', x0 + 5.4, mid + 0.6); mut(D, 'husk', x0 + 0.8, mid, { post: 1, yaw: -PI / 2 }); break;
    case 1: R('Kitchen', { fl: 0x8f9492, wl: 0xa9aeab }, { stuck: true }); bx(D, x0 + 3.5, back, 6, 0.9, 0.6, 0x7c8186); bx(D, x0 + 6.5, mid, 0.8, 1.9, 0.7, 0xb4b8ba);
      item(D, 'knife', x0 + 2.5, back, 0.92); item(D, 'ration', x0 + 4.4, back, 0.92, 2); mut(D, 'grabber', x0 + 3.5, y0 + 0.12, { yaw: 0 }); eggs(D, x0 + 1, front, 3); break;
    case 2: R('Commissary', {}, { stuck: true }); shelf(D, x0 + 2, back + 0.1, 3, 0.5, { jars: 1 }); shelf(D, x0 + 5.5, back + 0.1, 2.4, 0.5); item(D, 'peaches', x0 + 5, mid, 0.02); break;
    case 3: R('Laundry', { lit: 'none' }); for (let q = 0; q < 4; q++) bx(D, x0 + 1 + q * 1.4, back, 0.9, 1, 0.8, 0xb8bcc0); mut(D, 'worm', x0 + 2, mid); mut(D, 'worm', x0 + 3, mid + 0.4); mut(D, 'worm', x0 + 5, mid); eggs(D, x0 + 6.2, front, 3); break;
    case 4: R('Chapel'); for (let q = 0; q < 3; q++) bx(D, x0 + 1.5 + q * 1.8, mid + 0.2, 1.4, 0.45, 0.5, 0x5a4a3c); bx(D, x0 + 3.5, back, 1.6, 1, 0.6, 0x6b5a48); gore(D, x0 + 5.6, front, 3); body(D, x0 + 5, mid, 0x4a5560, false); break;
    case 5: R('Maintenance', { ...UTIL, c: 'RES' }); genset(D, 'RES', x0 + 5.6, y0 + 0.7, x0 + 5, y0 + 1.3); shelf(D, x0 + 1.5, back + 0.1, 2.4, 0.5); item(D, 'batt', x0 + 1.2, back + 0.1, 1.06, 2); item(D, 'bandage', x0 + 2.6, mid, 0.02); break;
    case 6: R('Post room'); shelf(D, x0 + 1.5, back + 0.1, 2.4, 0.5, { cols: [0xb9a98a, 0x8a7a6a] }); tbl(D, x0 + 4.5, mid, 2, 0.8); item(D, 'batt', x0 + 4.5, mid, 0.78); break;
    case 7: R('Recreation', { lit: 'none' }); bx(D, x0 + 2.5, mid, 2.4, 0.8, 1.3, 0x3a2e22); bx(D, x0 + 2.5, mid, 2.3, 0.04, 1.2, 0x2f5a40, { y: 0.8, c: 0 }); bx(D, x0 + 5.6, back, 2, 0.45, 0.8, 0x5a4a44);
      bx(D, x0 + 6.4, front, 0.9, 0.5, 0.6, 0x4a5238); item(D, 'goggles', x0 + 6.4, front, 0.5); item(D, 'batt', x0 + 0.6, back, 0.02);
      corpse(D, x0 + 4.4, front, 0x6b6f5a, false, { label: 'Search the resident', say: 'Swimming trunks, a towel, a room card.', keys: ['C2'] }); eggs(D, x0 + 1, front, 4); mut(D, 'skitter', x0 + 3.6, mid); mut(D, 'skitter', x0 + 1.4, back + 0.4); break;
  }
  else switch (k) {
    case 0: R('Gymnasium'); bx(D, x0 + 2, mid, 3, 0.08, 2, 0x3a4a5a, { c: 0 }); for (let q = 0; q < 3; q++) P(D, 'cyl', x0 + 5 + q * 0.6, back, 0.4, 0.4, 0.4, 0x2a2c2e); mut(D, 'husk', x0 + 3.5, mid, { post: 1, yaw: 0 }); break;
    case 1: R('School room'); for (let q = 0; q < 3; q++) for (const dz of [-0.5, 0.5]) tbl(D, x0 + 1.6 + q * 1.8, mid + dz, 1, 0.6, 0x8a7a5a); bx(D, x0 + 3.5, back, 3, 1.2, 0.06, 0x2a3a2c, { y: 1, c: 0 }); eggs(D, x0 + 6, front, 3); mut(D, 'skitter', x0 + 5.5, mid); break;
    case 2: R('Library', { lit: 'none' }); for (let q = 0; q < 3; q++) shelf(D, x0 + 1.2 + q * 2.3, back - 0.1, 1.8, 0.5); shelf(D, x0 + 3.5, mid + 0.2, 3, 0.5); break;
    case 3: R('Stores', { ...UTIL, c: 'RES' }, { kind: 'heavy' }); crates(D, x0 + 1.5, mid, 2); crates(D, x0 + 5.5, mid, 2); item(D, 'ration', x0 + 3.5, back, 0.02, 2); item(D, 'batt', x0 + 3.5, mid, 0.02); break;
    case 4: R('Trauma centre', { ...MED, c: 'RES' }, { kind: 'heavy' }); for (let q = 0; q < 4; q++) medbed(D, x0 + 0.6 + q * 1.5, y0 + 1.9);
      shelf(D, x0 + 6.7, mid, 0.5, 2.6, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24, 0xa8b4c0] }); for (const z of [y0 + 0.6, mid, y0 + 2.4]) item(D, 'medkit', x0 + 6.65, z, 1.06); item(D, 'bandage', x0 + 6.65, mid + 0.5, 0.61, 2);
      tbl(D, x0 + 5.4, front, 0.8, 0.7, 0xb4b8ba); note(D, 'clinic', x0 + 5.4, front, 0.78); break;
    case 5: R('Water room', { ...UTIL, c: 'RES' }); for (const q of [1.6, 5.4]) P(D, 'cyl', x0 + q, mid, 2.2, 2.6, 2.2, 0x3b4d57); bx(D, x0 + 3.5, back, 6, 0.14, 0.14, 0x3d4042, { y: 2.4, c: 0 }); break;
    case 6: R('Workshop', { ...UTIL, c: 'RES' }); tbl(D, x0 + 3, back + 0.2, 4, 0.9, 0x54504a); item(D, 'pipe', x0 + 3, mid + 0.6, 0.02); item(D, 'batt', x0 + 5.4, back + 0.2, 0.78); break;
    case 7: R('Bar', {}, { open: true }); bx(D, x0 + 3.5, mid, 5, 1, 0.6, 0x4a3a2c); for (let q = 0; q < 4; q++) P(D, 'cyl', x0 + 1.8 + q * 1.2, mid - 0.7, 0.4, 0.7, 0.4, 0x2a2c2e); blood(D, x0 + 2, front, 1.6); mut(D, 'husk', x0 + 5.6, back, { post: 1, yaw: 0 }); break;
  }
}

/* ===== Horticulture, the east end of the main level. Its own security, its own power, and nobody has pruned anything.
   The post off the airlock; three parallel grow galleries on a cross passage, with the tissue lab and Holt's office north of them and the
   seed vault and infirmary south; the arboretum, a 16 m cavern with the cave bulkhead breached in its north wall; and east of it the
   exhaust shaft, where ladderway B passes. ===== */
function buildHorticulture(G: Deck): void {
  const H: TRoomOpts = { ...HRT, c: 'HORT' };
  /* the post: the guard who kept his pass, the backup set that still runs, and the door into the labs */
  const post = room(G, 'Security post', 98, 12, 4, 6, { ...SEC, c: 'HORT', em: 1 }); desk(G, 100.6, 12.5, 1.8, 0.7); note(G, 'hsec', 100.2, 12.45, 0.78); genset(G, 'HORT', 101.3, 16.6, 100.7, 17.2);
  corpse(G, 99.4, 16.4, 0x2c3440, true, { label: 'Search the guard', say: 'Horticulture had its own security. This one kept his pass.', keys: ['h'] });
  door(G, 102, 14, { card: 'h', sg: [['Labs', 'w'], ['Security', 'e']] });
  /* the cross passage, and the three galleries off it */
  const cross = room(G, 'Cross passage', 103, 6, 1, 18, { ...H, em: 1 });
  const gal = ([['Grow gallery north', 6, {}], ['Grow gallery', 13, { em: 1 }], ['Grow gallery south', 20, { lit: 'none' }]] as [string, number, TRoomOpts][])
    .map(([nm, y, o]) => room(G, nm, 104, y, 13, 4, { ...H, ht: 6, ...o }));
  /* two long beds a gallery, a tile short of each end and with the aisle between them on the doors' line */
  for (const R of gal) for (const dz of [0.8, 3.2]) {
    bx(G, 110.5, R.y + dz, 22, 0.7, 1.1, 0x6f6a5e); bx(G, 110.5, R.y + dz, 21.6, 0.06, 0.9, 0x2e2418, { y: 0.7, c: 0 });
    for (let q = 0; q < 14; q++) P(G, 'ico', 105.3 + q * 0.78 + rnd(-0.1, 0.1), R.y + dz, rnd(0.3, 0.7), rnd(0.4, 1.8), rnd(0.3, 0.7), pick([...GR, 0x8c4a44]), { y: 0.72, c: 0 });
  }
  /* north: the tissue lab and the director of research's office. South: the seed vault and the infirmary */
  const lab = room(G, 'Tissue lab', 106, 1, 6, 4, { ...H, fl: 0x7d8588, wl: 0x9aa89c, flick: 1 }); door(G, 108, 5, { sg: [['Tissue lab', 's']] });
  tbl(G, 108, 2.4, 3, 0.8, 0xaab2b5); tbl(G, 111.4, 3, 0.8, 2, 0xaab2b5); for (const x of [106.6, 107.6]) P(G, 'cyl', x, 1.5, 0.8, 2.2, 0.8, [0.16, 0.3, 0.24] as Colour, { c: 1 }); note(G, 'journal', 108, 2.35, 0.78); item(G, 'batt', 107.5, 2.4, 0.78, 2);
  room(G, 'Director of research', 113, 1, 4, 4, { ...HAB, c: 'HORT', fl: 0x5e5248, lc: [0.85, 0.78, 0.62] }); door(G, 114, 5, { code: 2, sg: [['Dr. M. Holt', 's']] });
  desk(G, 115, 1.6, 2, 0.8, { c: 0x4a3a2c }); shelf(G, 113.3, 3, 0.5, 2.4, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] }); bed(G, 116.6, 3.4, true, 0x7a5a50); note(G, 'holt', 114.6, 1.55, 0.78); item(G, 'batt', 115.35, 1.6, 0.78, 2); item(G, 'medkit', 113.6, 4.6, 0.02);
  room(G, 'Seed vault', 106, 25, 5, 4, { ...UTIL, c: 'HORT' }); door(G, 108, 24, { kind: 'heavy', sg: [['Seed vault', 'n']] });
  shelf(G, 106.3, 27, 0.5, 3, { jars: 1, cols: [0x6a8a44, 0xcbbfa8, 0x8c4a44] }); shelf(G, 110.7, 27, 0.5, 3, { jars: 1, cols: [0x6a8a44, 0xcbbfa8] }); item(G, 'medkit', 108.5, 28.5, 0.02); item(G, 'kit', 110.65, 26.6, 1.06);
  room(G, 'Infirmary', 112, 25, 4, 4, { ...MED, c: 'HORT' }); door(G, 113, 24, { sg: [['Infirmary', 'n']] });
  medbed(G, 112.4, 26.8); shelf(G, 115.7, 27.5, 0.5, 2.4, { cols: [0xd4d8d4, 0x8c2f24] }); item(G, 'medkit', 115.65, 27.2, 1.06); item(G, 'bandage', 115.65, 28, 1.06, 2);
  /* the arboretum: hills, sick trees, and what is left of Holt */
  for (const y of [8, 14, 20]) door(G, 117, y, { open: y === 14, sg: [['Arboretum', 'w']] });
  const arb = cave(G, 'Arboretum', 118, 6, 15, 15, { ...HRT, c: 'HORT', ht: 16, lit: 'always', lc: [0.5, 0.24, 0.4] });
  hill(G, 122, 17, 4, 1.6, arb); hill(G, 129, 9.5, 3.5, 1.2, arb); hill(G, 128, 17.5, 3, 1, arb); vault(G, 125, 13, 8, 4, arb); roughen(G, arb, 0.15, 1.5);
  for (const [x, z, h] of [[121.5, 10, 7], [126, 15, 9], [123, 17.5, 6.5], [130, 11, 7.5], [129.5, 18, 6], [120.5, 13.6, 5.5]]) tree(G, x, z, h, 0, true);
  mut(G, 'bloat', 127.6, 13, { sit: 1, yaw: -PI / 2, holt: 1 }); note(G, 'last', 125.6, 13.6, 0.03);
  for (let k = 0; k < 8; k++) bx(G, 127.4 - rnd(0, 1.4), 13 + rnd(-0.6, 0.6), rnd(0.8, 2), 0.07, 0.07, pick([0x6e2b28, 0x3f6a3a]), { y: rnd(0.02, 0.5), c: 0, ry: rnd(-0.5, 0.5), rz: rnd(-0.2, 0.2) });
  /* the bulkhead to the cave, in the north wall: Horticulture drilled through it */
  room(G, 'Breach', 125, 3, 1, 2, { ...ROCKP, lit: 'none', nolamp: 1, noroam: 1 }); door(G, 125, 5, { stuck: true, sg: [['Cave', 's']] });
  ladder(G, 'CV', 125.5, 3.5, 125.5, 4.4, PI, false, { bare: true, label: 'Crawl through the breach' });
  for (let k = 0; k < 6; k++) P(G, 'ico', 125 + rnd(0.1, 0.9), 3 + rnd(0, 2), rnd(0.3, 0.7), rnd(0.2, 0.5), rnd(0.3, 0.7), pick(GR), { c: 0, y: rnd(0, 1.6) });
  /* east: the exhaust shaft. Ladderway B up to Cargo, and on down to the plant level */
  door(G, 133, 14, { sg: [['Exhaust shaft', 'w']] }); room(G, 'Exhaust shaft', 134, 12, 4, 6, { ...UTIL, c: 'HORT', em: 1 });
  ladder(G, 'B1', 136.6, 12.6, 135.6, 13.4, PI / 2, true); ladder(G, 'B2', 136.6, 16.6, 135.6, 16.4, PI / 2, false);
  /* the green, everywhere */
  for (const [R, d, gl] of [[cross, 0.7, true], [gal[0], 0.9, true], [gal[1], 0.6, true], [gal[2], 1.1, true], [arb, 1, true], [lab, 0.5, false], [post, 0.12, false]] as [TRoom, number, boolean][]) overgrow(G, R, d, gl);
  for (const [x, z, yaw] of [[103.12, 8, PI / 2], [103.12, 21, PI / 2], [116.88, 15.5, -PI / 2], [108.5, 9.88, PI]]) mut(G, 'vine', x, z, { yaw });
  mut(G, 'vine', 118.12, 19, { yaw: PI / 2 }); mut(G, 'vine', 133.88, 14.6, { yaw: -PI / 2 });
  for (const [x, z] of [[106, 7], [110, 8.4], [114, 7.2], [107, 21], [111, 22.4], [115, 21.4], [121, 16], [124, 19], [130, 15]]) mut(G, 'rootworm', x, z);
}
