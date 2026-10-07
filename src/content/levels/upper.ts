import { PI } from '../../core/math';
import type { LevelDef, LadderDef } from '../types';
import {
  arch, beginLevel, bx, cave, door, elev, finishLevel, flight, item, ladder, mkDeck, mut, note, P, roughen, room, stack, stairs, use, type Deck, type LevelInfo, type TRoomOpts,
} from '../build/tiles';
import {
  BAY, MED, OPS, SEC, UTIL, WALK, blood, camera, container, corpse, crates, desk, droppedLight, eggs, exitSign, forklift, genset, gore, liftRoom, medbed, panel, shelf, speaker, tbl,
} from '../build/fittings';

/* Upper station, 40 m down. Off the main shaft, the Security wing (x 14 to 66) and Operations (x 64 to 110, south to
   z 54), with a two-storey atrium where they meet; the Cargo cavern (x 110 to 240); the exhaust shaft (x 260). Start here.
   Ported from the first engine (archive/first-engine.html, buildUpper and buildCargo2) on the tile adapter, in tile
   units; Security and Ops since laid out again around the highway and its bend (world.md §8).
   The frame: org [-10, -30], so tile i is plan x = 2i - 10 and tile j is plan z = 2j - 30. */

export const UPPER: LevelInfo = { id: 'upper', name: 'Upper station', c: 'OPS', org: [-10, -30] };

export function buildUpper(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(UPPER, ladders);
  /* the ground floor, over a basement a storey down (the isolation suite) where it needs one */
  const lv = UPPER, D = mkDeck(lv, 140, 48, { ground: true }), B = mkDeck(lv, 140, 48, { y0: -4.5 });
  /* the rungs over the ground floor at +5, +10 and +15: Tier 1 also carries the second floor over Ops */
  const tier = (y0: number, li: number) => mkDeck(lv, 140, 48, { y0, li }), T1 = tier(5, 1), T2 = tier(10, 2), T3 = tier(15, 3);
  stack(B, D); stack(D, T1); stack(T1, T2); stack(T2, T3);
  /* the main shaft: the hoist cage (runs on Gen-1) and the surface cage. No ladderway down it: the way down from
     Security is its own elevator, in the atrium (below) */
  liftRoom(D, 5, 14, 7, 14);
  room(D, 'Shaft station', 8, 14, 3, 3, { ...UTIL, c: 'SEC', em: 1, safe: 1 }); door(D, 11, 14, { sg: [['Checkpoint', 'w'], ['Shaft station', 'e']] });
  room(D, 'Surface cage', 8, 11, 2, 2, { ...OPS, c: 'LIFT', nolamp: 1, noroam: 1, safe: 1 }); door(D, 8, 13, { kind: 'heavy', c: 'LIFT', lift: true, sg: [['Surface', 's']] });

  /* The Security wing: the checkpoint at the shaft, the first leg of the highway, and the rooms off it. Its feed hangs
     off Ops, and the survivors cut it to blind the cameras on their side (world.md §8): dark at the start, and a kit
     mends it. */
  room(D, 'Checkpoint', 12, 10, 8, 10, { ...OPS, c: 'SEC', ht: 5, em: 1 }); door(D, 20, 14, { sg: [['Security', 'w'], ['Checkpoint', 'e']] });
  /* everyone off the shaft came through here: the bag scanner and its belt, the arch, the turnstiles, and the booth
     behind glass that watched them do it */
  bx(D, 16, 11.5, 0.9, 0.95, 6, 0x5f6266); bx(D, 16, 12, 1.1, 1, 1.6, 0x3a3d40, { y: 0.95 }); bx(D, 16, 11.2, 0.7, 0.04, 0.5, 0x4a3a2c, { y: 0.95, c: 0 });
  for (const z of [13, 14.1]) bx(D, 16, z, 0.25, 2.3, 0.25, 0x8a8e8c); bx(D, 16, 13.55, 0.35, 0.25, 2.45, 0x8a8e8c, { y: 2.3, c: 0 });
  for (const z of [15, 15.9]) { bx(D, 16, z, 0.9, 1, 0.3, 0x5f6266); bx(D, 16.25, z + 0.3, 0.05, 0.05, 0.9, 0x8a8e8c, { y: 0.9, ry: 0.5, c: 0 }); }
  bx(D, 17.6, 16.85, 3.4, 2.4, 0.06, [0.42, 0.52, 0.55]); bx(D, 16.05, 18.4, 0.06, 2.4, 3.1, [0.42, 0.52, 0.55]); // the booth's glass
  desk(D, 17.6, 18.6, 2.4, 0.7, { bare: 1 }); bx(D, 17.6, 18.8, 1.2, 0.36, 0.06, 0x22262a, { y: 0.76, c: 0 }); bx(D, 17.6, 19.4, 0.45, 0.45, 0.45, 0x2c2f33);
  bx(D, 18.6, 10.4, 1.8, 0.42, 0.45, 0x5f6266); bx(D, 12.4, 12, 0.45, 0.42, 1.4, 0x5f6266); bx(D, 12.15, 17.2, 0.5, 1.8, 3, 0x56636e);
  /* off the checkpoint, where things came off the hoist: hazardous storage, its suits on the wall and its rebreathers.
     Its heavy door runs off Ops' own bus, not the wing's: it waits on Gen-1 either way, cut or mended */
  room(D, 'Hazardous storage', 12, 21, 6, 5, { ...UTIL, c: 'SEC' }); door(D, 13, 20, { kind: 'heavy', c: 'OPS', sg: [['Hazard store', 'n']] });
  for (const [x, z] of [[12.6, 25.4], [13.3, 25.5], [12.6, 24.7], [17.4, 21.4], [16.8, 21.4]]) P(D, 'cyl', x, z, 0.6, 0.9, 0.6, 0xc9a227);
  for (let k = 0; k < 3; k++) bx(D, 14.6 + k * 0.6, 21.08, 0.5, 1.5, 0.12, 0xc9a227, { y: 0.4, c: 0 }); // hazmat suits on their pegs
  shelf(D, 17.7, 23.6, 0.5, 2.2, { cols: [0xc9a227, 0x3d4042] }); bx(D, 15.4, 25.4, 0.8, 0.6, 0.6, 0x3a4030);
  item(D, 'rebreather', 15.4, 25.4, 0.6); item(D, 'kit', 17.65, 23.3, 1.06);
  corpse(D, 17.5, 12.5, 0x2c3440, true, { label: 'Search the officer', say: 'A security officer. Whatever opened him did it from behind.', keys: ['s'] }); mut(D, 'husk', 14, 18.4, { post: 1, yaw: PI / 2 });
  room(D, 'Security corridor', 21, 13, 18, 3, { ...SEC, c: 'SEC', ht: 4.5, em: 1, safe: 1 });
  /* the cut, near the wing's end: the cabinet left open, the cable through, and the one who did it */
  panel(D, 'SEC', 37.4, 13.06, 's', { cut: 1, zone: 'wing' }); // mended, it comes live on Security's board, and the wing sounds bx(D, 37.4, 13.04, 0.12, 2.6, 0.08, 0x2a2c2e, { y: 1.8, c: 0 });
  P(D, 'cyl', 37.15, 13.16, 0.07, 0.6, 0.07, 0x1d1f21, { y: 1.15, rz: 0.35, c: 0 }); P(D, 'cyl', 37.65, 13.16, 0.07, 0.45, 0.07, 0x1d1f21, { y: 1.3, rz: -0.3, c: 0 });
  corpse(D, 36.2, 13.9, 0x2c3440, false, { label: 'Search the guard', say: 'A guard, bolt cutters still in his hand. Behind him the feed to the wing is cut clean through.' });
  /* the wing's eyes, dead with it until the cut is mended: one down the corridor from the lobby end */
  speaker(D, 'wing', 30, 14.5, 'PA'); camera(D, 21.4, 13.3, 3.9, PI / 2, 'SEC', 'wing');
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
  stairs(B, D, 32, 4, 5, 's'); stairs(B, D, 33, 4, 5, 's'); exitSign(B, 33.97, 4.6, 3, 'w'); // on the wall the stair climbs
  corpse(B, 31, 3.3, 0x2c3440, false, { label: 'Search the guard', say: 'A guard at the foot of the stairs, face down. He got this far with the light and no further.' });
  droppedLight(B, 31.9, 3.6, 33.4, 3.4); // thrown at the east wall, by the stair's foot
  /* the nurses' station: a balcony over the hall, at the wing's level, and out to the corridor */
  room(D, "Nurses' station", 23, 9, 11, 3, { ...WALK, c: 'SEC', ht: 3.5, safe: 1, fl: 0x4c5250, wl: 0x6f7a77 }); door(D, 28, 12, { open: true, sg: [['Isolation', 's']] });
  exitSign(D, 28.5, 11.97, 2.5, 'n');
  desk(D, 25.5, 11.6, 1.8, 0.7, { bare: 1 }); bx(D, 25.5, 11.7, 0.5, 0.34, 0.06, 0x22262a, { y: 0.76, c: 0 }); bx(D, 25.5, 11.68, 0.44, 0.28, 0.02, [0.06, 0.12, 0.1], { y: 0.79, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]], pc: 'SEC' });
  bx(D, 25.5, 11, 0.45, 0.45, 0.45, 0x2c2f33); bx(D, 30.5, 11.7, 1.6, 0.42, 0.4, 0x44484c);
  item(D, 'batt', 25.9, 11.6, 0.78); note(D, 'duty', 25.1, 11.55, 0.78); item(D, 'baton', 30.2, 11.7, 0.44); item(D, 'ration', 30.8, 11.7, 0.44);
  /* Security control: the board a human officer ran, and the survivors' last room. A vestibule off the corridor, with the
     plan table and a window onto the corridor they held, opens into the control room proper, which runs east behind the
     atrium's north wall: the camera wall across its north side, two rows of consoles facing it. Behind the officer's
     card, and dark with the wing. */
  room(D, 'Security control', 35, 8, 3, 4, { ...SEC, c: 'SEC', ht: 4 }); door(D, 36, 12, { card: 's', sg: [['Control', 's']] });
  room(D, 'Security control', 35, 3, 7, 5, { ...SEC, c: 'SEC', ht: 4 });
  door(D, 35, 12, { seal: true, glass: true });
  for (let i = 0; i < 11; i++) for (let j = 0; j < 3; j++) { // the wall: a few of its screens never came back
    const x = 35.6 + i * 0.6, y = 0.95 + j * 0.82;
    bx(D, x, 3.04, 1.16, 0.74, 0.06, 0x22262a, { y, c: 0 });
    if ((i * 3 + j * 5) % 7 !== 3) bx(D, x, 3.08, 1.06, 0.64, 0.02, [0.05, 0.07, 0.08], { y: y + 0.05, c: 0, pw: [[0.04, 0.05, 0.05], [2.3, 2.6, 2.75]], pc: 'SEC' });
    else bx(D, x, 3.08, 1.06, 0.64, 0.02, [0.12, 0.12, 0.12], { y: y + 0.05, c: 0 });
  }
  for (const z of [4.8, 6.3]) {
    tbl(D, 37.8, z, 9.6, 0.9, 0x3a3d40);
    for (let k = 0; k < 7; k++) {
      bx(D, 35.9 + k * 0.65, z - 0.1, 0.6, 0.36, 0.05, 0x22262a, { y: 0.76, ry: 0.12 * (k - 3), c: 0 });
      if (k % 2 === 0) bx(D, 35.9 + k * 0.65, z + 0.62, 0.45, 0.45, 0.45, 0x2c2f33, { ry: 0.3 * (k - 3) });
    }
  }
  tbl(D, 36.5, 9.8, 2.6, 1.4, 0x4a3a2c); bx(D, 36.5, 9.8, 2.2, 0.01, 1.1, 0xd8d4c4, { y: 0.76, c: 0 }); // the plan of the floor, pinned out
  shelf(D, 41.7, 5, 0.5, 2.4, { cols: [0x4d5a66, 0x7a4a34, 0x8a7a4a] });
  note(D, 'cams', 36.2, 4.8, 0.78); item(D, 'batt', 37.4, 6.3, 0.78, 2); item(D, 'ammo9', 35.5, 11.5, 0.02);
  /* South off the wing: the locker room, the survivors' back way into the muster hall (a door at each end, so the hand
     comes through neither), and the infirmary. */
  room(D, 'Locker room', 21, 17, 8, 9, { ...SEC, c: 'SEC', safe: 1 }); door(D, 24, 16, { sg: [['Lockers', 'n']] });
  for (const z of [19.5, 22.5]) for (const x of [22.4, 26.6]) { bx(D, x, z, 5.6, 2, 1, 0x4d5a66); bx(D, x, z, 5.64, 0.05, 1.04, 0x3a444c, { y: 2, c: 0 }); }
  for (const x of [22.4, 26.6]) for (const z of [18.2, 21, 23.8]) bx(D, x, z, 4.4, 0.45, 0.4, 0x6b5a48);
  for (const [x, z, ry] of [[23.5, 20.1, 0.9], [25.6, 22.9, -1.1], [21.8, 22.9, 1.3]] as const) bx(D, x, z, 0.5, 1.8, 0.03, 0x56636e, { y: 0.15, ry, c: 0 }); // doors left open
  note(D, 'lockers', 26.2, 21, 0.47); item(D, 'bandage', 27.4, 23.8, 0.47); bx(D, 23.1, 25.4, 1.6, 0.45, 0.4, 0x6b5a48, { ry: 0.35 }); blood(D, 24.5, 25.2, 1.1);
  /* the infirmary: a ward of four beds behind curtains down the south wall, and at the east end a treatment bay behind
     glass, with its table and crash cart. They kept the hurt here, in the dark, and someone sat with the last of them */
  room(D, 'Infirmary', 30, 17, 8, 4, { ...MED, c: 'SEC', safe: 1, ht: 3.6 }); door(D, 33, 16, { sg: [['Infirmary', 'n']] });
  for (const x of [30.6, 31.9, 33.2, 34.5]) medbed(D, x, 19.6);
  for (const x of [31.25, 32.55, 33.85]) bx(D, x, 19.6, 0.04, 1.9, 1.7, 0xb9c4bd, { y: 0.15, c: 0 }); // the curtains
  bx(D, 34.2, 18.7, 0.45, 0.45, 0.45, 0x5f6266); blood(D, 34.5, 19.6, 0.8); // the chair pulled up to the last bed
  bx(D, 35.25, 17.8, 0.05, 2.1, 3.2, [0.42, 0.52, 0.55]); // the treatment bay's glass
  bx(D, 36.6, 18, 0.8, 0.9, 2, 0xb9c4bd); bx(D, 37.5, 19.2, 0.6, 0.95, 0.5, 0x8c2f24); bx(D, 30.35, 17.3, 0.6, 0.9, 0.5, 0xc8ccd0); // table, crash cart, sink
  shelf(D, 31.8, 17.3, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] }); shelf(D, 37.6, 20.7, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] });
  item(D, 'bandage', 37.3, 20.65, 1.06, 2); item(D, 'medkit', 37.9, 20.65, 1.06);

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
  /* the atrium's eye: one on the threshold from the south-west corner; its speaker high in the well by the east gallery's
     rail, out of reach but from there */
  speaker(D, 'atrium', 46.7, 19.6, 'PA'); camera(D, 39.3, 20.6, 3.8, PI, 'OPS', 'atrium');
  /* where the light changes, it starts: eggs at the threshold, on their side */
  eggs(D, 39.4, 13.4, 2); eggs(D, 39.3, 15.6, 3); blood(D, 46.3, 19.3, 1.4);
  /* the second leg: south from the atrium between the offices, and out into the muster hall */
  room(D, 'Operations corridor', 42, 21, 3, 6, { ...OPS, ht: 4.5, em: 1 });
  /* the overseer's own zone sounds here, on Ops' feed and not its own switch, so it still calls the hand to its door
     once that switch is open */
  speaker(D, 'ops', 43.5, 25, 'PA'); camera(D, 44.6, 21.3, 3.8, 0, 'OPS', 'ops'); mut(D, 'husk', 43.5, 24); mut(D, 'husk', 41, 18.5); blood(D, 43, 22.7, 1.2);
  for (const [nm, x, y, dopt, east] of [['Office: operations', 37, 22, { open: true }, false], ['Office: chief of security', 46, 22, { card: 'o' }, true]] as const) {
    room(D, nm, x, y, 4, 4, { ...OPS, lc: [0.85, 0.78, 0.62] }); door(D, east ? x - 1 : x + 4, y + 1, dopt);
    desk(D, x + 2, y + 3.4, 1.8, 0.7, { c: 0x4a3a2c }); bx(D, x + 2, y + 2.7, 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, east ? x + 3.7 : x + 0.3, y + 1.6, 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  }
  note(D, 'mgr', 38.7, 25.35, 0.78); item(D, 'batt', 39.4, 25.4, 0.78); note(D, 'chief', 47.7, 25.35, 0.78); item(D, 'ammo9', 48.4, 25.4, 0.78); item(D, 'medkit', 49.5, 22.4, 0.02);
  room(D, 'Maintenance', 46, 27, 4, 5, { ...UTIL, c: 'OPS' }); door(D, 45, 28, { sg: [['Maintenance', 'w']] });
  genset(D, 'OPS', 49.3, 29.5, 48.7, 29.5); shelf(D, 47.6, 31.7, 1.8, 0.5, { cols: [0xc9a227, 0x3d4042] }); item(D, 'kit', 47.6, 31.7, 1.06);

  /* The muster hall: where the response team drilled, and where what is left of them, made one thing, keeps now (world.md
     §8). Long, flat and lit, on Ops' backup set: a promenade round a sunken court, the court's ceiling lifted into a
     coffer, and rooms off every side, each a refuge from the hand, which no door admits. Over its south side, behind a
     wall of glass on the court, the operations room: the overseer's, watching every crossing. Its east bays, the stair
     up to it and the room itself hang off their own breaker (CTL), in the electrical room at the far, west end. */
  const MH: TRoomOpts = { ...OPS, ht: 4.5, em: 1, lc: [0.86, 0.82, 0.72], c: 'HALL' };
  for (const [x, y, w, h] of [[16, 27, 8, 12], [24, 27, 12, 2], [24, 37, 12, 2]] as const) room(D, 'Muster hall', x, y, w, h, MH);
  room(D, 'Muster hall', 36, 27, 9, 12, { ...MH, c: 'CTL' });
  /* the court: 1.25 m down (five steps; floors keep to the grid's quarter metres), with steps the length of both long sides (they sat on them for the muster) and a glass
     balustrade at each end; over it the ceiling lifts to 8.5 m, the drill clock hangs in the middle, and the operations
     room looks down on it through its glass */
  room(D, 'Muster court', 24, 29, 12, 8, { ...MH, dy: -1.25, ht: 9.75 });
  flight(D, 24, 29, 12, 2, -1.25, 0, 'n', 5); flight(D, 24, 35, 12, 2, -1.25, 0, 's', 5);
  for (const x of [23.96, 36.04]) { bx(D, x, 33, 0.06, 1, 16, [0.42, 0.52, 0.55]); bx(D, x, 33, 0.12, 0.06, 16.1, 0x5a5d60, { y: 1, c: 0 }); }
  bx(D, 30, 33, 2.6, 1.1, 0.5, 0x22262a, { y: 6.2, c: 0 });
  for (const z of [32.86, 33.14]) bx(D, 30, z, 2.2, 0.7, 0.02, [0.05, 0.04, 0.04], { y: 6.4, c: 0, pw: [[0.05, 0.04, 0.04], [2.6, 0.5, 0.3]], pc: 'HALL' });
  for (const x of [29.5, 30.5]) bx(D, x, 33, 0.04, 0.9, 0.04, 0x2a2c2e, { y: 7.3, c: 0 });
  for (const [x, z, c] of [[27, 29.03, 0x39485a], [33, 29.03, 0x8a7a4a], [27, 36.97, 0x8a7a4a], [33, 36.97, 0x39485a]] as const) bx(D, x, z, 1.4, 2.2, 0.04, c, { y: 5.9, c: 0 });
  bx(D, 24.7, 33, 0.6, 1.1, 0.5, 0x4a3a2c); P(D, 'cyl', 24.5, 31.6, 0.05, 2.2, 0.05, 0x8a8a84, { c: 0 }); bx(D, 24.5, 31.8, 0.03, 0.6, 0.9, 0x39485a, { y: 1.5, c: 0 });
  eggs(D, 31, 32.2, 3); eggs(D, 28.4, 33.8, 2); blood(D, 29.5, 33, 1.6);
  /* pillars round the court and down both ends; the track painted round the hall; benches, the muster board, shields */
  for (const [x, z] of [[19.5, 30.5], [19.5, 35.5], [40.5, 30.5], [40.5, 35.5], [23.5, 28.5], [36.5, 28.5], [23.5, 37.5], [36.5, 37.5]]) {
    bx(D, x, z, 0.9, 4.5, 0.9, 0x8c887e); bx(D, x, z, 1, 0.3, 1, 0x5a5d60, { c: 0 });
  }
  for (const z of [27.4, 38.6]) bx(D, 30.2, z, 55.2, 0.01, 0.12, 0xc9a227, { y: 0.012, c: 0 });
  for (const x of [16.4, 44]) bx(D, x, 33, 0.12, 0.01, 22.4, 0xc9a227, { y: 0.012, c: 0 });
  bx(D, 19.5, 27.04, 3.2, 1.6, 0.05, 0x2c3440, { y: 1.1, c: 0 }); for (let k = 0; k < 5; k++) bx(D, 18.4 + k * 0.55, 27.08, 0.42, 0.56, 0.01, 0xd8d4c4, { y: 1.5 + (k % 2) * 0.4, c: 0 });
  for (const z of [29.6, 36.4]) bx(D, 16.25, z, 0.4, 0.45, 3, 0x6b5a48);
  for (let k = 0; k < 4; k++) bx(D, 16.1, 34.9 + k * 0.3, 0.12, 1.2, 0.55, 0x3a3d40, { y: 0.2, rz: 0.12, c: 0 });
  /* the east bays: crowd barriers left where the last drill had them */
  for (const [x, z, ry] of [[39, 33, 0], [42.5, 31.4, 0.4], [42, 35.2, -0.3], [38, 29.2, PI / 2]] as const) {
    bx(D, x, z, 0.3, 1.05, 2.4, 0xc9a227, { ry }); bx(D, x, z, 0.32, 0.12, 2.42, 0x2a2c2e, { y: 0.6, ry, c: 0 });
  }
  /* its eyes: the corners, the north wall over the court, and one high in the coffer, all on the hall's own breaker;
     the east bays' on CTL, one over the overseer's door, sounding its own zone. The speaker hangs low enough to reach */
  speaker(D, 'muster', 19.5, 33, 'PA');
  camera(D, 16.3, 27.3, 4, PI / 4, 'HALL', 'muster'); camera(D, 16.3, 38.7, 4, (3 * PI) / 4, 'HALL', 'muster');
  camera(D, 30, 27.2, 4, 0, 'HALL', 'muster'); camera(D, 24.1, 33, 7.6, PI / 2, 'HALL', 'muster');
  camera(D, 44.7, 27.3, 4, -PI / 4, 'CTL', 'ops'); camera(D, 42.5, 38.75, 4, PI, 'CTL', 'ops');

  /* west, off the hall's far end: the electrical room, and the one who came for it. Its board breaks Ops' feed out to
     the hall (HALL: its lights, the court, four of its cameras), the operations room and the east bays (CTL: the door
     the overseer bolts), and Security's PA (every zone's speaker): each a trade. A lamp over the cabinet for each, and
     one for Ops itself */
  room(D, 'Electrical room', 10, 31, 5, 4, { ...UTIL, c: 'OPS', safe: 1 }); door(D, 15, 32, { sg: [['Electrical', 'e']] });
  bx(D, 10.03, 32.5, 0.04, 1.7, 3.4, 0x3a3d40, { y: 0.55, c: 0 });
  for (const [c, z] of [['HALL', 31.6], ['CTL', 32.5], ['PA', 33.4]] as const) panel(D, c, 10.04, z, 'e', { brk: 1 });
  bx(D, 12.5, 31.2, 4.4, 2.2, 0.6, 0x4a4f55);
  for (const [k, c] of (['HALL', 'CTL', 'PA', 'OPS'] as const).entries()) bx(D, 11.2 + k * 0.9, 31.52, 0.5, 0.3, 0.04, [0.2, 0.2, 0.2], { y: 1.5, c: 0, pw: [[0.2, 0.2, 0.2], [0.4, 2.6, 0.6]], pc: c });
  bx(D, 13.8, 34.2, 1.2, 1.6, 1, 0x44525a); bx(D, 12.4, 34.85, 3.4, 0.08, 0.3, 0x2a2c2e, { y: 2.8, c: 0 }); item(D, 'batt', 11, 34.4, 0.02);
  corpse(D, 16.9, 32.8, 0x2c3440, true, { label: 'Search the guard', say: 'A guard, a step short of the electrical room. REYES, on the name tape. Opened from the side, by something that kept going.' });
  blood(D, 17.6, 33.4, 1.8);

  /* north, off the hall: the Armory, the response team's, where they kept what they drilled with */
  room(D, 'Armory', 30, 22, 5, 4, { ...SEC, c: 'OPS' }); door(D, 32, 26, { kind: 'heavy', code: 1, c: 'OPS', sg: [['Armory', 's']] });
  shelf(D, 30.3, 23.6, 0.5, 3, { empty: 1 }); shelf(D, 34.7, 23.6, 0.5, 3, { empty: 1 }); bx(D, 32.5, 22.5, 0.9, 0.7, 0.7, 0x3a4030);
  for (let k = 0; k < 6; k++) bx(D, 30.9 + k * 0.62, 24.6, 0.05, 2.4, 0.05, 0x2a2c2e, { c: 0 }); bx(D, 32.4, 24.6, 3.2, 0.05, 0.05, 0x2a2c2e, { y: 2.4, c: 0 }); // the cage
  item(D, 'pistol', 30.35, 22.9, 1.06); item(D, 'ammo9', 30.35, 23.5, 1.06, 2); item(D, 'shotgun', 30.35, 24.2, 1.06); item(D, 'shells', 34.65, 23, 1.06, 2); item(D, 'tacvest', 34.65, 24, 1.06); item(D, 'surf', 32.5, 22.5, 0.7);

  /* south, off the hall: the range (dark until Gen-1: it has no emergency lights), the duty office with its window on
     the hall, and the stair up to the operations room */
  room(D, 'Firing range', 16, 40, 14, 4, { ...SEC, c: 'OPS', ht: 3.4 }); door(D, 17, 39, { sg: [['Range', 'n']] });
  bx(D, 19.6, 41.5, 0.5, 1, 6, 0x44484c); for (const z of [41, 42, 43]) bx(D, 20.05, z, 0.9, 1.8, 0.06, 0x5a5d60);
  for (const z of [40.5, 41.5, 42.5]) { bx(D, 24.8, z, 20, 0.06, 0.06, 0x2a2c2e, { y: 3.1, c: 0 }); bx(D, 29.3, z, 0.06, 1, 0.5, 0xc8c0a0, { y: 1, c: 0 }); bx(D, 29.3, z, 0.06, 0.06, 0.06, 0x2a2c2e, { y: 2, c: 0 }); }
  bx(D, 29.85, 42, 0.3, 3.2, 8, 0x3a3226); for (const x of [21.5, 23.5, 25.5, 27.5]) bx(D, x, 42, 0.8, 0.05, 8, 0x5a5d60, { y: 2.6, rz: 0.5, c: 0 });
  item(D, 'ammo9', 19.6, 41, 1.02);
  room(D, 'Duty office', 31, 40, 4, 4, { ...OPS, lc: [0.85, 0.78, 0.62] }); door(D, 31, 39, { sg: [['Duty office', 'n']] });
  for (const x of [33, 34]) door(D, x, 39, { seal: true, glass: true });
  desk(D, 33.5, 40.6, 1.8, 0.7, { c: 0x4a3a2c }); bx(D, 33.5, 41.3, 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, 34.7, 42.6, 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  item(D, 'peaches', 33.1, 40.6, 0.78); item(D, 'bandage', 33.9, 40.55, 0.78); note(D, 'memo', 33.5, 40.6, 0.78);
  /* the deputy director, at the far end of the hall from Cargo's door, under the glass: she ran for the range */
  corpse(D, 16.8, 37.4, 0x4a4238, false, { label: 'Search the manager', say: 'DEPUTY DIRECTOR, OPERATIONS. She got as far as the range door. Her pass is still on its lanyard.', keys: ['o'] });
  /* the stair up to the operations room: a tall well off the east bays, and the landing at its head, where the door is
     grown shut. Eggs, and the floor dragged red, thicken toward it */
  room(D, 'Operations stair', 37, 40, 3, 6, { ...OPS, c: 'CTL', em: 1, ht: 9.5 }); door(D, 38, 39, { sg: [['Operations', 'n']] });
  stairs(D, T1, 38, 40, 6, 's');
  room(T1, 'Operations stair', 37, 46, 3, 2, { ...OPS, c: 'CTL', em: 1, ht: 3.2 });
  door(T1, 36, 46, { seal: true, msg: 'Bodies. Grown into the frame and into each other, floor to lintel, faces turned in. Something behind them is breathing.' });
  for (const z of [35.6, 36.8, 38]) blood(D, 38.4 + (z - 36) * 0.15, z, 1.1); eggs(D, 37.3, 38.3, 3); eggs(D, 39.6, 37.6, 2);
  for (const z of [41, 43, 44.6]) { eggs(D, 37.3, z, 2); eggs(D, 39.6, z + 0.5, 2); }
  eggs(T1, 37.4, 46.5, 4); eggs(T1, 39.5, 47.3, 3); gore(T1, 37.6, 47.2, 3); mut(T1, 'husk', 38.6, 46.6, { post: 1, yaw: PI / 2 });
  /* the operations room, over the hall's south side: a wall of glass on the court, and along the back wall its screens,
     an eye at each (below, with the overseer) */
  room(T1, 'Operations room', 24, 38, 12, 9, { ...OPS, c: 'CTL', ht: 4, em: 1, lc: [0.7, 0.74, 0.8] });
  for (let x = 26; x <= 33; x++) door(T1, x, 37, { seal: true, glass: true, c: 'CTL' });
  tbl(T1, 29.3, 46.4, 20, 0.7, 0x3a3d40); // short of the east wall: the door comes in there
  for (let k = 0; k < 9; k++) { bx(T1, 24.7 + k * 1.15, 46.94, 2.1, 1.2, 0.06, 0x22262a, { y: 1.1, c: 0 }); bx(T1, 24.7 + k * 1.15, 46.92, 2, 1.1, 0.02, [0.05, 0.07, 0.08], { y: 1.15, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]], pc: 'CTL' }); }
  eggs(T1, 25, 38.6, 3); eggs(T1, 34.9, 39, 4); gore(T1, 26.5, 41, 3); gore(T1, 33.6, 42.5, 3); blood(T1, 30, 43, 2.4);
  mut(D, 'skitter', 27.6, 42); eggs(D, 26.4, 43.3, 2); // the range
  /* east of the atrium, behind Operations' card: the link to Cargo, and over it on the second floor, Cargo control */
  door(D, 49, 14, { card: 'o', c: 'OPS', sg: [['Cargo', 'w']] }); room(D, 'Cargo link', 50, 14, 9, 2, { ...UTIL, c: 'CARGO', em: 1 });
  door(D, 59, 14, { sg: [['Cargo cavern', 'w']] });
  door(T1, 49, 16, { sg: [['Cargo control', 'w']] }); room(T1, 'Cargo control', 50, 12, 9, 7, { ...UTIL, c: 'CARGO', ht: 4 });
  tbl(T1, 58.3, 15, 0.8, 4, 0x3a3d40); bx(T1, 57.4, 15, 0.45, 0.45, 0.45, 0x2c2f33); for (const z of [14.2, 15.8]) bx(T1, 58.4, z, 0.5, 0.3, 0.06, 0x22262a, { y: 0.76, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]], pc: 'CARGO' });
  /* the window onto the bay: three bays of glass in the east wall, high over the floor (world.md §8) */
  for (const r of [13, 15, 17]) door(T1, 59, r, { seal: true, glass: true, c: 'CARGO' });
  use(T1, 'look', 58.4, 15, 1.5, { label: 'Look out over the bay', text: 'Thick glass, and the bay a long way down. Out on the rungs something glows, the colour of a healing burn.' });
  buildCargo(D, T1, T2, T3);
  /* the overseer: the operations staff, grown into one body (world.md §8). Flesh, not wiring: at each screen what is left
     of one of them, pared down to a hunched trunk, a hand on the desk and one swollen eye at the glass of it, joined to its
     neighbours and by a cord of meat to the body in the middle of the room. The body is several of them; its head, off to
     one side, is growing another, and its mouth is dragged sideways, pulling the face after it. It faces the glass, and
     the hall. Last, so the cast made before keep their places; its screens and its board are on its room's breaker. */
  mut(T1, 'overseer', 30.6, 39, { zone: 'ops', sit: 1, yaw: PI, screens: 'CTL' }); // its eyes: the head, close to the glass
  const MEAT = [0x8c4a44, 0x6e2b28, 0x9a6a5a, 0x7a3a34];
  for (let k = 0; k < 9; k++) {
    const x = 24.7 + k * 1.15, z = 45.75;
    bx(T1, x, z, 0.55, 0.85, 0.45, MEAT[k % 4], { y: 0.35, rz: ((k * 7) % 5 - 2) * 0.06 }); // the trunk, hunched to its screen
    P(T1, 'ico', x, z + 0.08, 0.42, 0.4, 0.42, MEAT[(k + 1) % 4], { y: 1.15, c: 0 });
    P(T1, 'ico', x + ((k % 3) - 1) * 0.04, z + 0.22, 0.36, 0.34, 0.24, 0xd8d0c0, { y: 1.22, c: 0 }); // its eye, swollen to the screen
    P(T1, 'ico', x + ((k % 3) - 1) * 0.04, z + 0.33, 0.14, 0.14, 0.06, 0x15100e, { y: 1.26, c: 0 });
    P(T1, 'ico', x + 0.18, 46.35, 0.26, 0.12, 0.2, MEAT[(k + 2) % 4], { y: 0.76, c: 0 }); // its hand on the desk
    if (k < 8) bx(T1, x + 0.575, z - 0.05, 0.7, 0.16, 0.14, MEAT[k % 4], { y: 0.75 + (k % 2) * 0.12, c: 0 }); // grown into the next
    const dx = (30 - x) * 2, dz = (40.6 - z) * 2, len = Math.hypot(dx, dz); // and into the body
    bx(T1, (x + 30) / 2, (z + 40.6) / 2, len, 0.16, 0.18, MEAT[k % 4], { y: 0.5 + (k % 3) * 0.1, ry: -Math.atan2(dz, dx), c: 0 });
  }
  /* the body: several of them, fused, limbs left where they came through */
  for (const [x, z, s, y] of [[29.5, 40.5, 1.6, 0.2], [30.5, 40.8, 1.4, 0.3], [29.9, 41.2, 1.2, 0.9], [30.9, 40.2, 1, 0.8], [29.2, 40, 0.9, 0.9]] as const) P(T1, 'ico', x, z, s, s * 0.8, s, MEAT[Math.round(x * 3) % 4], { y, c: 0 });
  for (const [x, z, ry, rz] of [[28.8, 40.8, 0.4, 0.9], [31.2, 41, -0.5, -0.8], [30.2, 41.6, 1.4, 0.6]] as const) bx(T1, x, z, 0.9, 0.12, 0.14, 0xb08a78, { y: 1.1, ry, rz, c: 0 });
  /* the head, off centre, facing the glass, with another coming out of it; the mouth dragged to one side */
  P(T1, 'ico', 30.7, 39.7, 1.3, 1.4, 1.2, 0x9a6a5a, { y: 1.55, c: 0 });
  P(T1, 'ico', 31.15, 39.55, 0.75, 0.7, 0.7, 0x8c5a50, { y: 2.45, c: 0 });
  P(T1, 'ico', 30.45, 39.38, 0.34, 0.3, 0.12, 0xd8d0c0, { y: 2.3, c: 0 }); P(T1, 'ico', 30.95, 39.42, 0.42, 0.24, 0.12, 0xd8d0c0, { y: 2.08, c: 0 });
  P(T1, 'ico', 30.45, 39.34, 0.12, 0.12, 0.05, 0x15100e, { y: 2.31, c: 0 }); P(T1, 'ico', 30.98, 39.38, 0.12, 0.12, 0.05, 0x15100e, { y: 2.09, c: 0 });
  bx(T1, 30.95, 39.42, 0.95, 0.16, 0.06, 0x2a0e0c, { y: 1.75, rz: 0.4, c: 0 }); // the mouth, dragged
  P(T1, 'ico', 31.25, 39.46, 0.2, 0.14, 0.06, 0xd8d0c0, { y: 2.65, c: 0 }); // the second face's one eye
  /* and its own sick light, which needs no power: pustules over the body like the nest's, so from the hall it is always
     there behind the glass, lit from within */
  for (const [x, z, y] of [[29.6, 40.2, 1.3], [30.4, 41.1, 1.5], [31.1, 40.4, 1.2], [29.3, 41, 1.6]] as const) {
    for (let k = 0; k < 4; k++) P(T1, 'ico', x + (k - 1.5) * 0.18, z + ((k * 5) % 3 - 1) * 0.15, 0.3, 0.24, 0.3, [2.6, 0.9, 0.55], { y: y + (k % 2) * 0.15, c: 0 });
    T1.lamps.push({ x: x * 2, z: z * 2, r: 4.5, c: [0.5, 0.17, 0.1], h: y });
  }
  mut(D, 'hand', 30, 33, { yaw: PI });
  /* and two of the staff on their rounds of the hall */
  mut(D, 'husk', 20.5, 29); mut(D, 'husk', 38.5, 37);
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
  mut(D, 'husk', 80, 14.6); mut(D, 'husk', 96, 15.4);
  for (const [x, z, n] of [[114, 12, 4], [117, 18, 5], [119, 10, 3], [121, 15, 5], [123, 20, 4], [116, 14.6, 3]]) eggs(D, x, z, n); gore(D, 118, 15.5, 4); blood(D, 120, 13, 2);
  mut(D, 'worm', 117, 16); mut(D, 'worm', 118, 17); mut(D, 'worm', 116.5, 17.4); mut(D, 'skitter', 121, 12); mut(D, 'husk', 112, 19, { post: 1, yaw: -PI / 2 });
  /* the tiers: thicker with every one */
  crates(T1, 80, 9.5, 2); container(T1, 92, 9.6, false, 1); for (const [x, z] of [[85, 10], [99, 9], [108, 11]]) eggs(T1, x, z, 4); mut(T1, 'skitter', 88, 11); mut(T1, 'skitter', 104, 10);
  for (const [x, z] of [[76, 9], [84, 11], [90, 9], [96, 10.6], [103, 9.4], [108, 10]]) eggs(T2, x, z, 5); gore(T2, 93, 10, 4); mut(T2, 'skitter', 86, 10); mut(T2, 'skitter', 97, 11); mut(T2, 'skitter', 105, 9.6);
  mut(T2, 'grabber', 90, 8.12, { yaw: 0 });
  for (const [x, z] of [[77, 9], [80, 11], [83, 9.4], [86, 10.8], [89, 9], [92, 11], [95, 9.6], [98, 10.6]]) eggs(T3, x, z, 6); gore(T3, 88, 10, 5); gore(T3, 94, 9.6, 4);
  mut(T3, 'skitter', 82, 10); mut(T3, 'skitter', 90, 11.4); mut(T3, 'skitter', 97, 9);
  /* the nest's own light: pustules among the eggs that glow a sick red, enough to be seen across the bay in the dark; and
     its edge, creeping west over the floor toward the door, below Cargo control's window */
  for (const [x, z, n] of [[66, 19.5, 3], [70, 17.8, 4], [73.5, 19.6, 5], [77, 18.2, 4]] as const) eggs(D, x, z, n);
  for (const [Dk, x, z] of [[D, 66.6, 19.2], [D, 70.5, 18], [D, 74, 19.4], [T1, 85, 10], [T2, 84, 11], [T2, 90, 9], [T3, 80, 11], [T3, 86, 10.8], [T3, 92, 11]] as const) {
    for (let k = 0; k < 5; k++) P(Dk, 'ico', x + (k - 2) * 0.22, z + ((k * 7) % 3 - 1) * 0.25, 0.38, 0.3, 0.38, [2.6, 0.9, 0.55], { y: 0.05 + (k % 2) * 0.2, c: 0 });
    Dk.lamps.push({ x: x * 2, z: z * 2, r: 5.5, c: [0.55, 0.18, 0.1], h: 0.5 });
  } bx(T3, 96, 9.4, 1.1, 0.6, 1.1, 0x6b5a3c); item(T3, 'fuse', 96, 9.4, 0.6); item(T3, 'batt', 95, 10.4, 0.02, 2);
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

