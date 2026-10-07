import { PI } from '../../core/math';
import type { LevelDef, LadderDef } from '../types';
import {
  arch, beginLevel, bx, cave, door, elev, finishLevel, item, ladder, mkDeck, mut, note, P, roughen, room, stack, stairs, use, type Deck, type LevelInfo, type TRoomOpts,
} from '../build/tiles';
import {
  BAY, MED, OPS, SEC, UTIL, WALK, blood, container, corpse, crates, desk, droppedLight, eggs, exitSign, forklift, genset, gore, liftRoom, medbed, panel, shelf, tbl,
} from '../build/fittings';

/* Upper station, 40 m down. Off the main shaft, the Security wing (x 14 to 66) and Operations (x 64 to 110, south to
   z 54), with a two-storey atrium where they meet; the Cargo cavern (x 110 to 240); the exhaust shaft (x 260). Start here.
   Security's patrols keep to the light (lit: 1): their rounds go only to lit rooms, and in the dark they keep still.
   Ported from the first engine (archive/first-engine.html, buildUpper and buildCargo2) on the tile adapter, in tile
   units; Security and Ops since laid out again around the highway and its bend (world.md §8).
   The frame: org [-10, -30], so tile i is plan x = 2i - 10 and tile j is plan z = 2j - 30. */

export const UPPER: LevelInfo = { id: 'upper', name: 'Upper station', c: 'OPS', org: [-10, -30] };

export function buildUpper(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(UPPER, ladders);
  /* the ground floor, over a basement a storey down (the isolation suite) where it needs one */
  const lv = UPPER, D = mkDeck(lv, 140, 44, { ground: true }), B = mkDeck(lv, 140, 44, { y0: -4.5 });
  /* the rungs over the ground floor at +5, +10 and +15: Tier 1 also carries the second floor over Ops */
  const tier = (y0: number, li: number) => mkDeck(lv, 140, 44, { y0, li }), T1 = tier(5, 1), T2 = tier(10, 2), T3 = tier(15, 3);
  stack(B, D); stack(D, T1); stack(T1, T2); stack(T2, T3);
  /* the main shaft: the hoist cage (runs on Gen-1) and the surface cage. No ladderway down it: the way down from
     Security is its own elevator, in the atrium (below) */
  liftRoom(D, 5, 14, 7, 14);
  room(D, 'Shaft station', 8, 14, 3, 3, { ...UTIL, c: 'SEC', em: 1, safe: 1 }); door(D, 11, 14, { sg: [['Lobby', 'w'], ['Shaft station', 'e']] });
  room(D, 'Surface cage', 8, 11, 2, 2, { ...OPS, c: 'LIFT', nolamp: 1, noroam: 1, safe: 1 }); door(D, 8, 13, { kind: 'heavy', c: 'LIFT', lift: true, sg: [['Surface', 's']] });

  /* The Security wing: the lobby, the first leg of the highway, and the rooms off it. Its feed hangs off Ops, and the
     survivors cut it to blind the cameras on their side (world.md §8): dark at the start, and a kit mends it. */
  room(D, 'Lobby', 12, 10, 8, 10, { ...OPS, c: 'SEC', ht: 5, em: 1 }); door(D, 20, 14, { sg: [['Security', 'w'], ['Lobby', 'e']] });
  bx(D, 16, 17.6, 3, 1, 0.7, 0x6b5a48); bx(D, 18.6, 10.4, 1.8, 0.42, 0.45, 0x5f6266); bx(D, 12.4, 12, 0.45, 0.42, 1.4, 0x5f6266);
  corpse(D, 17.5, 12.5, 0x2c3440, true, { label: 'Search the officer', say: 'A security officer. Whatever opened him did it from behind.', keys: ['s'] }); mut(D, 'husk', 14, 18.4, { post: 1, yaw: PI / 2 });
  room(D, 'Security corridor', 21, 13, 18, 3, { ...SEC, c: 'SEC', ht: 4.5, em: 1, safe: 1 });
  /* the cut, near the wing's end: the cabinet left open, the cable through, and the one who did it */
  panel(D, 'SEC', 37.4, 13.06, 's', { cut: 1 }); bx(D, 37.4, 13.04, 0.12, 2.6, 0.08, 0x2a2c2e, { y: 1.8, c: 0 });
  P(D, 'cyl', 37.15, 13.16, 0.07, 0.6, 0.07, 0x1d1f21, { y: 1.15, rz: 0.35, c: 0 }); P(D, 'cyl', 37.65, 13.16, 0.07, 0.45, 0.07, 0x1d1f21, { y: 1.3, rz: -0.3, c: 0 });
  corpse(D, 36.2, 13.9, 0x2c3440, false, { label: 'Search the guard', say: 'A guard, bolt cutters still in his hand. Behind him the feed to the wing is cut clean through.' });
  /* what was left of a barricade across the mouth of the wing */
  bx(D, 38.4, 13.7, 1.8, 0.75, 0.7, 0x5b5d5f, { ry: 0.5 }); crates(D, 38.3, 15.3, 2);
  /* North, a storey down: the medical isolation suite (world.md §8). Rooms round a tall common hall, and over its south
     end, at the wing's own level, the nurses' station that the stair climbs to. It is dark with the wing: the only light
     is a flashlight dropped still on at the stair's foot, and the exit signs on their own batteries. You wake in room 1,
     whose door looks straight across the hall at both. */
  const ISO: TRoomOpts = { fl: 0x4c5250, wl: 0x6f7a77, st: 0x3f7f6b, c: 'SEC', em: 1, safe: 1 };
  room(B, 'Isolation suite', 23, 1, 11, 10, { ...ISO, ht: 8 });
  for (const [k, x, y, dx] of [[1, 19, 1, 22], [2, 19, 5, 22], [3, 35, 1, 34]] as const) {
    const east = dx > x, bed = east ? x + 0.4 : x + 2.6;
    room(B, 'Isolation room ' + k, x, y, 3, 3, { ...ISO, lc: [0.85, 0.85, 0.8] }); door(B, dx, y + 1, { open: true, sg: [['Isolation ' + k, east ? 'e' : 'w']] });
    medbed(B, bed, y + 1.5); bx(B, bed + (east ? 0.6 : -0.6), y + 0.45, 0.45, 0.5, 0.4, 0xb8bcc0); bx(B, east ? x + 2.2 : x + 0.6, east ? y + 2.4 : y + 0.6, 0.45, 0.45, 0.45, 0x5f6266);
  }
  note(B, 'intake', 20, 1.45, 0.52);
  corpse(B, 21.3, 6.4, 0x8a9a94, true, { label: 'Search the patient', say: 'A patient in a gown, curled on the floor by the door. No wound you can see. They stopped waiting.' });
  room(B, 'Washroom', 35, 5, 3, 2, ISO); door(B, 36, 4, { open: true }); // room 3's own: the stair has the hall's east wall
  for (const z of [5.3, 6.1]) bx(B, 37.7, z, 0.5, 0.85, 0.6, 0xc8ccd0); bx(B, 35.6, 6.5, 1, 2.1, 1, 0x8a9a94, { c: 0 });
  /* the hall: a kitchenette on the north wall, a table, a sofa before the screen, plants nobody watered */
  bx(B, 27.5, 1.16, 6, 0.88, 0.6, 0x5a5e60); bx(B, 27.5, 1.17, 6.1, 0.04, 0.66, 0x8a8e8c, { y: 0.88, c: 0 }); bx(B, 27.5, 1.09, 6, 0.7, 0.35, 0x5a5e60, { y: 1.6, c: 0 });
  bx(B, 31, 1.18, 0.8, 1.9, 0.7, 0xb8bcc0);
  tbl(B, 27, 5, 2.4, 1.2, 0x6b5a48); for (const [x, z] of [[26.6, 4.45], [27.4, 4.45], [26.6, 5.55], [27.4, 5.55]]) bx(B, x, z, 0.45, 0.45, 0.45, 0x3a3d40);
  bx(B, 25.6, 7.5, 0.9, 0.45, 2, 0x39485a); bx(B, 25.95, 7.5, 0.2, 0.45, 2, 0x39485a, { y: 0.45 }); bx(B, 24.6, 7.5, 2.2, 0.01, 2.6, 0x3a4a48, { y: 0.012, c: 0 });
  bx(B, 23.04, 7.5, 0.06, 0.7, 1.3, 0x15181b, { y: 1.3, c: 0 });
  for (const [x, z] of [[23.5, 1.6], [24.4, 10.4], [32.6, 10.4]]) { P(B, 'cyl', x, z, 0.5, 0.5, 0.5, 0x8a6a4a); P(B, 'ico', x, z, 0.8, 0.5, 0.8, 0x5a4a34, { y: 0.5, c: 0 }); }
  bx(B, 30.2, 2.1, 0.9, 1, 0.55, 0xa82a20);
  /* the stair up to the station, wide, against the east wall; at its foot the guard who brought the light this far */
  stairs(B, D, 32, 4, 5, 's'); stairs(B, D, 33, 4, 5, 's'); exitSign(B, 33.97, 3, 2.4, 'w');
  corpse(B, 31, 3.3, 0x2c3440, false, { label: 'Search the guard', say: 'A guard at the foot of the stairs, face down. He got this far with the light and no further.' });
  droppedLight(B, 31.9, 3.6); // clear of the ceiling's fittings, or its pool would light a dead tube up there
  /* the nurses' station: a balcony over the hall, at the wing's level, and out to the corridor */
  room(D, "Nurses' station", 23, 9, 11, 3, { ...WALK, c: 'SEC', ht: 3.5, safe: 1, fl: 0x4c5250, wl: 0x6f7a77 }); door(D, 28, 12, { open: true, sg: [['Isolation', 's']] });
  exitSign(D, 28.5, 11.97, 2.5, 'n');
  desk(D, 25.5, 11.6, 1.8, 0.7, { bare: 1 }); bx(D, 25.5, 11.7, 0.5, 0.34, 0.06, 0x22262a, { y: 0.76, c: 0 }); bx(D, 25.5, 11.68, 0.44, 0.28, 0.02, [0.06, 0.12, 0.1], { y: 0.79, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]], pc: 'SEC' });
  bx(D, 25.5, 11, 0.45, 0.45, 0.45, 0x2c2f33); bx(D, 30.5, 11.7, 1.6, 0.42, 0.4, 0x44484c);
  item(D, 'batt', 25.9, 11.6, 0.78); note(D, 'duty', 25.1, 11.55, 0.78); item(D, 'baton', 30.2, 11.7, 0.44); item(D, 'ration', 30.8, 11.7, 0.44);
  room(D, 'Security control', 35, 7, 3, 5, { ...SEC, c: 'SEC' }); door(D, 36, 12, { card: 's', sg: [['Control', 's']] });
  tbl(D, 36.5, 7.5, 5, 0.8);
  for (let k = 0; k < 4; k++) { bx(D, 35.6 + k * 0.6, 7.06, 1, 0.7, 0.06, 0x22262a, { y: 1.2, c: 0 }); bx(D, 35.6 + k * 0.6, 7.08, 0.9, 0.6, 0.02, [0.05, 0.07, 0.08], { y: 1.25, c: 0, pw: [[0.04, 0.05, 0.05], [2.3, 2.6, 2.75]], pc: 'SEC' }); }
  note(D, 'cams', 36.2, 7.5, 0.78); item(D, 'batt', 37.4, 7.5, 0.78, 2); item(D, 'ammo9', 35.5, 11.5, 0.02);
  /* south: the Armory, the range, the hazard store, the infirmary. The heavy doors and their keypads run off Ops' own
     bus, not the wing's: they wait on Gen-1 either way, cut or mended. */
  room(D, 'Armory', 21, 17, 5, 4, { ...SEC, c: 'SEC' }); door(D, 23, 16, { kind: 'heavy', code: 1, c: 'OPS', sg: [['Armory', 'n']] });
  shelf(D, 21.3, 19, 0.5, 3, { empty: 1 }); shelf(D, 25.7, 19, 0.5, 3, { empty: 1 }); bx(D, 23.5, 20.5, 0.9, 0.7, 0.7, 0x3a4030);
  item(D, 'pistol', 21.35, 18.3, 1.06); item(D, 'ammo9', 21.35, 18.9, 1.06, 2); item(D, 'shotgun', 21.35, 19.6, 1.06); item(D, 'shells', 25.65, 18.4, 1.06, 2); item(D, 'tacvest', 25.65, 19.4, 1.06); item(D, 'surf', 23.5, 20.5, 0.7);
  room(D, 'Firing range', 27, 17, 3, 7, { ...SEC, c: 'SEC', lit: 'none' }); door(D, 28, 16, { sg: [['Range', 'n']] });
  bx(D, 28.1, 19, 4, 1, 0.4, 0x44484c); for (const x of [27.5, 28.5, 29.5]) { bx(D, x, 23.6, 0.5, 1, 0.06, 0xc8c0a0, { y: 0.6, c: 0 }); bx(D, x, 23.6, 0.06, 0.6, 0.06, 0x2a2c2e, { c: 0 }); }
  item(D, 'ammo9', 27.6, 19, 1.02);
  room(D, 'Hazardous storage', 31, 17, 3, 4, { ...UTIL, c: 'SEC' }); door(D, 32, 16, { kind: 'heavy', c: 'OPS', sg: [['Hazard store', 'n']] });
  for (const [x, z] of [[31.4, 20.5], [32, 20.6], [31.4, 19.8], [33.6, 17.4]]) P(D, 'cyl', x, z, 0.6, 0.9, 0.6, 0xc9a227); shelf(D, 33.7, 19.6, 0.5, 2.2, { cols: [0xc9a227, 0x3d4042] }); bx(D, 32.6, 20.5, 0.8, 0.6, 0.6, 0x3a4030);
  item(D, 'rebreather', 32.6, 20.5, 0.6); item(D, 'kit', 33.65, 19.3, 1.06);
  room(D, 'Infirmary', 35, 17, 3, 4, { ...MED, c: 'SEC', safe: 1 }); door(D, 36, 16, { sg: [['Infirmary', 'n']] });
  medbed(D, 35.3, 19.6); shelf(D, 37, 20.7, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] }); item(D, 'bandage', 36.7, 20.65, 1.06, 2); item(D, 'medkit', 37.3, 20.65, 1.06);

  /* The atrium: the highway's bend, and the threshold. The wing's leg runs into it from the west, dark; it is lit,
     theirs, and the second leg leaves it south for Operations. Two storeys, a gallery round two sides at +5 with a
     stair up the core, and in the middle the core itself: the Security elevator, on the wing's feed. */
  const AT: TRoomOpts = { ...OPS, ht: 9.5, em: 1, lc: [0.85, 0.8, 0.68] };
  for (const [x, y, w, h] of [[39, 9, 10, 3], [39, 16, 10, 5], [39, 12, 3, 4], [46, 12, 3, 4]]) room(D, 'Atrium', x, y, w, h, AT);
  room(D, 'Security elevator', 43, 13, 2, 2, { ...SEC, c: 'SEC', em: 1, noroam: 1 }); door(D, 42, 14, { sg: [['Security elevator', 'w']] });
  bx(D, 44.96, 14, 0.06, 0.5, 0.4, 0x2c2f33, { y: 1.1, c: 0 }); use(D, 'elev', 44.9, 14, 1.3, { c: 'SEC', to: 'main' }); D.marks['elev:main'] = [44, 14, PI / 2];
  room(D, 'Phase 2', 43, 6, 2, 2, { ...UTIL, lit: 'none', nolamp: 1, noroam: 1 }); door(D, 43, 8, { kind: 'heavy', seal: true, msg: 'Welded shut. Stencilled across it: PHASE 2. NOT COMMISSIONED.', sg: [['Phase 2', 's']] });
  stairs(D, T1, 46, 11, 6, 'n');
  const GW: TRoomOpts = { ...WALK, ht: 4.5, c: 'OPS' };
  room(T1, 'Gallery', 39, 9, 10, 2, GW); room(T1, 'Gallery', 47, 11, 2, 10, GW);
  /* where the light changes, it starts: eggs at the threshold, on their side */
  eggs(D, 39.4, 13.4, 2); eggs(D, 39.3, 15.6, 3); blood(D, 40.5, 17.5, 1.4);
  /* the second leg: south to the operations room, offices either side, maintenance and the Ops backup set */
  room(D, 'Operations corridor', 42, 21, 3, 13, { ...OPS, ht: 4.5, em: 1 }); mut(D, 'husk', 43.5, 25, { lit: 1 }); mut(D, 'husk', 41, 18.5, { lit: 1 }); blood(D, 43, 27.5, 1.2);
  for (const [nm, x, y, dopt, east] of [['Office: operations', 37, 22, { card: 'o' }, false], ['Office: logistics', 37, 27, { open: true }, false], ['Office: chief of security', 46, 22, { card: 'o' }, true]] as const) {
    room(D, nm, x, y, 4, 4, { ...OPS, lc: [0.85, 0.78, 0.62] }); door(D, east ? x - 1 : x + 4, y + 1, dopt);
    desk(D, x + 2, y + 3.4, 1.8, 0.7, { c: 0x4a3a2c }); bx(D, x + 2, y + 2.7, 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, east ? x + 3.7 : x + 0.3, y + 1.6, 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  }
  note(D, 'mgr', 38.7, 25.35, 0.78); item(D, 'batt', 39.4, 25.4, 0.78); item(D, 'peaches', 39.4, 30.4, 0.78); item(D, 'bandage', 38.7, 30.35, 0.78); note(D, 'chief', 47.7, 25.35, 0.78); item(D, 'ammo9', 48.4, 25.4, 0.78); item(D, 'medkit', 49.5, 22.4, 0.02);
  room(D, 'Maintenance', 46, 27, 4, 5, { ...UTIL, c: 'OPS' }); door(D, 45, 28, { sg: [['Maintenance', 'w']] });
  genset(D, 'OPS', 49.3, 29.5, 48.7, 29.5); shelf(D, 47.6, 31.7, 1.8, 0.5, { cols: [0xc9a227, 0x3d4042] }); item(D, 'kit', 47.6, 31.7, 1.06);
  /* the operations room, at the end of the second leg: the overseer's, in time */
  room(D, 'Operations room', 37, 35, 13, 7, { ...OPS, ht: 5 }); door(D, 43, 34, { sg: [['Operations', 'n']] });
  tbl(D, 43.5, 38.2, 6, 2.2, 0x4a3a2c); for (let k = 0; k < 5; k++) for (const s of [-1, 1]) bx(D, 41.7 + k * 0.9, 38.2 + s * 0.85, 0.45, 0.45, 0.45, 0x2c2f33);
  for (let k = 0; k < 8; k++) { bx(D, 38.4 + k * 1.4, 41.94, 2, 1.2, 0.06, 0x22262a, { y: 1.3, c: 0 }); bx(D, 38.4 + k * 1.4, 41.92, 1.9, 1.1, 0.02, [0.05, 0.07, 0.08], { y: 1.35, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]] }); }
  corpse(D, 47.6, 36.2, 0x4a4238, false, { label: 'Search the manager', say: 'DEPUTY DIRECTOR, OPERATIONS. Her pass is still on its lanyard.', keys: ['o'] });
  note(D, 'memo', 42.5, 38.1, 0.78); eggs(D, 37.6, 35.6, 3); eggs(D, 49.3, 35.7, 4); mut(D, 'husk', 39.4, 40.2, { post: 1, yaw: 0 }); gore(D, 48.6, 40.6, 3); gore(D, 38.4, 41.2, 2);
  mut(D, 'skitter', 28.6, 22); eggs(D, 27.4, 23.2, 2); // the range
  /* east of the atrium, behind Operations' card: the link to Cargo, and over it on the second floor, Cargo control */
  door(D, 49, 14, { card: 'o', c: 'OPS', sg: [['Cargo', 'w']] }); room(D, 'Cargo link', 50, 14, 9, 2, { ...UTIL, c: 'CARGO', em: 1 });
  door(D, 59, 14, { sg: [['Cargo cavern', 'w']] });
  door(T1, 49, 16, { sg: [['Cargo control', 'w']] }); room(T1, 'Cargo control', 50, 12, 9, 7, { ...UTIL, c: 'CARGO', ht: 4 });
  tbl(T1, 58.3, 15, 0.8, 4, 0x3a3d40); bx(T1, 57.4, 15, 0.45, 0.45, 0.45, 0x2c2f33); for (const z of [14.2, 15.8]) bx(T1, 58.4, z, 0.5, 0.3, 0.06, 0x22262a, { y: 0.76, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]], pc: 'CARGO' });
  /* the window onto the bay: black glass for now (glass you can see through is still to be built: world.md §8) */
  bx(T1, 58.98, 15, 0.04, 2.2, 9.6, 0x0b0d0f, { y: 0.9, c: 0 }); for (let k = 0; k < 5; k++) bx(T1, 58.96, 12.6 + k * 1.2, 0.06, 2.2, 0.08, 0x2a2c2e, { y: 0.9, c: 0 });
  use(T1, 'look', 58.4, 15, 1.5, { label: 'Look out over the bay', text: 'Thick glass over the bay, and the floor a long way down. Nothing out there gives back any light.' });
  buildCargo(D, T1, T2, T3);
  return finishLevel([20.3, 2.5, -PI / 2]); // in isolation room 1, facing its door
}

/* the Cargo cavern: a 20 m vault, x 110 to 240, with three tiers stepped up its north side at +5, +10 and +15 and a platform
   between each. Dead and black until its backup set runs, which also moves the platforms, and wakes the nest that thickens
   toward the roof. East of it, the link to the exhaust shaft and ladderway B under the sealed fan door. */
function buildCargo(D: Deck, T1: Deck, T2: Deck, T3: Deck): void {
  const cav = cave(D, 'Cargo cavern', 60, 8, 65, 14, { ...BAY, ht: 20, c: 'CARGO', lit: 'main', em: 1, motes: 'flesh' }); arch(D, cav, 5); roughen(D, cav, 0, 1.2);
  const TW: TRoomOpts = { ...WALK, ht: 5, c: 'CARGO', motes: 'flesh' };
  room(T1, 'Tier 1', 68, 8, 48, 5, TW); room(T2, 'Tier 2', 72, 8, 39, 5, TW); room(T3, 'Tier 3', 76, 8, 25, 5, TW);
  elev(D, T1, 70, 11, 2, 2, 'CARGO', 'Cargo platform'); elev(T1, T2, 74, 11, 2, 2, 'CARGO', 'Cargo platform'); elev(T2, T3, 78, 11, 2, 2, 'CARGO', 'Cargo platform');
  /* the gantry crane, on rails along both walls */
  for (const z of [8.2, 21.8]) bx(D, 92.5, z, 128, 0.5, 0.4, 0x5a5d60, { y: 17.4, c: 0 });
  bx(D, 90, 15, 1, 0.8, 27.4, 0xc9a227, { y: 17.6, c: 0 }); bx(D, 90, 16.5, 1.4, 0.6, 1.4, 0x2a2c2e, { y: 17, c: 0 }); bx(D, 90, 16.5, 0.05, 8.6, 0.05, 0x2a2c2e, { y: 8.4, c: 0 }); bx(D, 90, 16.5, 0.5, 0.4, 0.5, 0x8a7a2a, { y: 8, c: 0 });
  /* the floor: receiving at the west end, containers and forklifts, the nest at the east end */
  crates(D, 62, 18, 2); blood(D, 64, 16, 1.4); crates(D, 66, 10, 2);
  container(D, 72, 20, false, 2); container(D, 80, 20, false, 3); container(D, 95, 20.2, false, 2); container(D, 104, 19.4, true, 1); container(D, 84, 10, false, 1); container(D, 98, 9.6, false, 1);
  container(D, 88, 17.4, true, 2); container(D, 110, 17.6, true, 3); crates(D, 92, 12, 2); crates(D, 106, 11, 2); forklift(D, 76, 16.5, true); forklift(D, 101, 16.8, false);
  mut(D, 'husk', 80, 14.6, { lit: 1 }); mut(D, 'husk', 96, 15.4, { lit: 1 });
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

