import { PI, type Colour } from '../../core/math';
import type { LevelDef, LadderDef } from '../types';
import {
  arch, beginLevel, bx, cave, colT, door, elev, finishLevel, flight, item, ladder, floor, mut, note, P, roughen, room, stack, stairs, use, type Floor, type LevelInfo, type RoomOpts,
} from '../build/plan';
import {
  BAY, FAM, MED, OFF, OPS, SEC, UTIL, WALK, blood, callPoint, camera, container, corpse, desk, eggs, exitSign, forklift, genset, gore, grandStair, liftRoom, medbed, monitors, panel, POLE, shelf, speaker, tbl,
} from '../build/furnish';

/** the block skim-coated smooth: the corridors the wing's people walked every day */
const SKIM = (o: RoomOpts): RoomOpts['mat'] => ({ ...o.mat, wall: 'plaster' });
const X = (t: number) => -10 + 2 * t, Z = (t: number) => -30 + 2 * t, L = (t: number) => 2 * t;

/* Upper station, 400 m down. Off the main shaft, the Security wing (x 14 to 66) and Operations (x 64 to 110, south to
   z 54), with a two-storey atrium where they meet; the Cargo cavern (x 110 to 240); the exhaust shaft (x 260). Start here.
   Ported from the first engine (archive/first-engine.html, buildUpper and buildCargo2) on the tile adapter, in tile
   units; Security and Ops since laid out again around the highway and its bend (world.md §8).
   The frame: org [-10, -30], so tile i is plan x = 2i - 10 and tile j is plan z = 2j - 30. */

export const UPPER: LevelInfo = { id: 'upper', name: 'Upper station', c: 'OPS', cards: true }; // Security's staff carry their cards

export function buildUpper(ladders: Record<string, LadderDef>): LevelDef {
  beginLevel(UPPER, ladders);
  /* the ground floor, over a basement a storey down (the isolation suite) where it needs one */
  const lv = UPPER, D = floor(lv, { terrain: [-10, -30, 270, 66], ground: true }), B = floor(lv, { terrain: [-10, -30, 270, 66], y0: -4.5 });
  /* the rungs over the ground floor at +5, +10 and +15: Tier 1 also carries the second floor over Ops */
  const tier = (y0: number, li: number) => floor(lv, { terrain: [-10, -30, 270, 66], y0, li }), T1 = tier(5, 1), T2 = tier(10, 2), T3 = tier(15, 3);
  stack(B, D); stack(D, T1); stack(T1, T2); stack(T2, T3);
  /* the main shaft: the hoist cage (runs on Gen-1) at the ground floor, where freight came off, and over it on the second
     floor the surface cage, where people did. No ladderway down it: the way down from Security is its own elevator, in
     the atrium (below) */
  liftRoom(D, 0, -2, 5, -1);
  room(D, 'Shaft station', 6, -2, 6, 6, { ...UTIL, c: 'SEC', em: 1, safe: 1 }); door(D, 13, 1, { sg: [['Goods inward', 'w'], ['Shaft station', 'e']] });
  room(T1, 'Surface cage', 0, -2, 4, 4, { ...OPS, c: 'LIFT', nolamp: 1, noroam: 1, safe: 1 }); door(T1, 5, -1, { kind: 'heavy', c: 'LIFT', lift: true, sg: [['Surface', 'e']] });

  /* The Security wing: the lobby off the shaft, the first leg of the highway, and the rooms off it. Its feed hangs off
     Ops, and the survivors cut it to blind the cameras on their side (world.md §8): dark at the start, and a kit mends
     it. */
  /* where freight came in: off the hoist, through to the hazard store and the corridor, never across the lobby. A
     wall between them, the lobby's limestone on one face and the dock's sprayed rock on the other: they were one open
     space, the stone meeting the shotcrete in one plane beside the lobby's door */
  room(D, 'Goods inward', 14, -0.75, 16, 10.75, { ...UTIL, c: 'SEC', ht: 4, em: 1 }); door(D, 31, 1, { sg: [['Security', 'w'], ['Goods inward', 'e']] });
  bx(D, 22, 8.8, 3.6, 0.9, 0.7, 0x4a4f55);
  mut(D, 'husk', 18, 6.8, { post: 1, yaw: PI / 2 });

  /* People came up the shaft to the second floor: off the surface cage, a landing, and the checkpoint (world.md §8,
     The lobby). Everyone off the surface came through here: the bag scanner and its belt, the arch, the turnstiles, and
     the booth behind glass that watched them do it. Through it, the head of the grand stair, and the lobby below */
  room(T1, 'Surface landing', 6, -2, 6, 6, { ...FAM, c: 'SEC', ht: 3.6, em: 1 }); door(T1, 13, 1, { sg: [['Checkpoint', 'w'], ['Surface', 'e']] });
  room(T1, 'Checkpoint', 14, 0, 16, 12, { ...OPS, c: 'SEC', ht: 4, em: 1 }); door(T1, 25.4, -1, { sg: [['Surface lift', 'n'], ['Lobby', 's']] });
  bx(T1, 20, 3.2, 0.9, 0.95, 4, 0x5f6266); bx(T1, 20, 4, 1.1, 1, 1.6, 0x3a3d40, { y: 0.95 }); bx(T1, 20, 2.4, 0.7, 0.04, 0.5, 0x4a3a2c, { y: 0.95, c: 0 });
  bx(T1, 20, 0.6, 0.1, 1, 1.2, 0x8a8e8c); // the rail that closes the line at the wall
  for (const z of [18, 19.1]) bx(T1, 20, Z(z), 0.25, 2.3, 0.25, 0x8a8e8c); bx(T1, 20, 7.1, 0.35, 0.25, 2.45, 0x8a8e8c, { y: 2.3, c: 0 });
  /* the turnstiles: each arm out from its post's south face across the lane, short of the next post or the wall */
  for (const z of [19.8, 20.6]) { bx(T1, 20, Z(z), 0.9, 1, 0.3, 0x5f6266); bx(T1, 20.44, Z(z + 0.2065), 0.05, 0.05, 0.6, 0x8a8e8c, { y: 0.9, ry: 0.5, c: 0 }); }
  bx(T1, 25, 9, 0.06, 2.4, 6, [0.55, 0.66, 0.7], { mat: 'glass' }); bx(T1, 26.9, 6, 3.8, 2.4, 0.06, [0.55, 0.66, 0.7], { mat: 'glass' }); // the booth's glass, its way in at the east end
  desk(T1, 27.6, 10.6, 2.4, 0.7, { bare: 1 }); bx(T1, 27.6, 9.4, 0.45, 0.45, 0.45, 0x2c2f33);
  /* the booth's monitors: two screens on the desk, showing the checkpoint's own cameras (world.md §8, smaller screens
     first): the lobby below, the checkpoint, the surface landing, the shaft station. On the wing's feed: dark until the
     cut is mended, when the changed start walking the lit lobby and there is something worth watching */
  for (const x of [18.45, 19.15]) {
    bx(T1, X(x), 10.86, 0.6, 0.44, 0.08, 0x22262a, { y: 0.76, c: 0 }); // on the desk, at its back edge
    bx(T1, X(x), 10.81, 0.52, 0.36, 0.02, [0.04, 0.05, 0.05], { y: 0.84, c: 0, pw: [[0.04, 0.05, 0.05], [2.3, 2.42, 2.38]], pc: 'SEC' });
  }
  monitors(T1, 27.6, 9.8, 1.1, 'SEC', ['Lobby', 'Checkpoint', 'Surface landing', 'Shaft station']);
  /* and what they watch, recording: the line from the north-west corner, the landing from by the checkpoint's door, the
     shaft station from over goods inward's */
  camera(T1, 14.8, 0.8, 3.5, 0.79, 'SEC', 'wing', { name: 'Checkpoint' });
  camera(T1, 11.2, 3.2, 3.1, -2.17, 'SEC', 'wing', { name: 'Surface landing' });
  camera(D, 11.2, -1.2, 2.8, -1.17, 'SEC', 'wing', { name: 'Shaft station' });
  bx(T1, 14.8, 5, 0.45, 0.42, 2.6, 0x5f6266); bx(T1, 14.3, 10.4, 0.5, 1.8, 1.4, 0x56636e);
  corpse(T1, 22.8, 4.4, 0x2c3440, true, { label: 'Officer', say: 'A security officer. Whatever opened him did it from behind.', keys: ['s'] });

  /* The lobby: where the money shows (world.md §8, The lobby). A hall 38 by 24 m and 13 m to a luminous ceiling,
     backlit panels made to pass for daylight 400 m down. Down the grand stair from the checkpoint's gallery: the statue
     in the middle (the family that built the place; a placeholder, the logo or a gardening motif later), a lounge to the
     east, a bar under the gallery to the west. On the wing's feed: dark at the start, and the survivors raided the bar;
     mended, it lights end to end */
  const LB: RoomOpts = { ...FAM, c: 'SEC', ht: 13, em: 1, lc: [0.92, 0.86, 0.74] };
  /* its south-east reaches a row further, to the corridor's door; the west keeps a wall's width off the shaft's doors */
  room(D, 'Lobby', -8, -28, 38, 24, LB); room(D, 'Lobby', 14, -4, 16, 2.75, LB); // to goods inward's wall, half a metre off its floor
  door(D, 31, -3, { sg: [['Security', 'w'], ['Lobby', 'e']] });
  const LG: RoomOpts = { ...WALK, ht: 8, c: 'SEC', fl: FAM.fl, wl: FAM.wl, mat: { floor: 'terrazzo', wall: 'stone', upper: 'plaster', datum: 3.2 } };
  room(T1, 'Lobby gallery', -8, -6, 38, 2, LG); room(T1, 'Lobby gallery', 14, -4, 16, 2, LG);
  grandStair(D, T1, 8, -18, 8, 12, 's');
  /* the false sky: emitting (2 + its colour), with power. A diffuser hung under the roof, wall to wall and over the
     strip by the gallery too, deep enough that the light fittings and air grilles are behind it: their light comes
     through it, and they are not seen */
  for (const [x, z, w, d] of [[10.5, 7, 38, 24], [16, 13.5, 16, 2]] as const) bx(D, X(x), Z(z), w, 0.18, d, [0.1, 0.1, 0.1], { y: 12.82, c: 0, pw: [[0.08, 0.08, 0.09], [2.85, 2.82, 2.72]], pc: 'SEC' });
  /* the statue: a plinth, and a figure in bronze looking up at the false sky */
  bx(D, 12, -23.6, 3.4, 1.1, 3.4, 0x9a9384); bx(D, 12, -23.6, 3.6, 0.12, 3.6, 0x7d776a, { y: 1.1, c: 0 });
  for (const dx of [-0.25, 0.25]) bx(D, X(11 + dx / 2), -23.6, 0.42, 2.1, 0.5, 0x6b5a3a, { y: 1.22 });
  bx(D, 12, -23.6, 1.2, 1.7, 0.6, 0x6b5a3a, { y: 3.3, c: 0 }); bx(D, 12, -23.7, 0.55, 0.6, 0.55, 0x6b5a3a, { y: 5.0, rz: 0.15, c: 0 });
  bx(D, 12.8, -23.6, 0.3, 1.5, 0.3, 0x6b5a3a, { y: 4.5, rz: -0.5, c: 0 }); bx(D, 11.2, -23.6, 0.3, 1.3, 0.3, 0x6b5a3a, { y: 3.4, rz: 0.2, c: 0 });
  /* the lounge, east: sofas round low tables, and planters gone to stalks */
  for (const [x, z] of [[15.5, 4], [15.5, 8.5]] as const) {
    bx(D, X(x), Z(z), 1.8, 0.42, 1, 0x3a3226);
    for (const [ox, oz, w, d] of [[0, -1.25, 3.2, 0.9], [0, 1.25, 3.2, 0.9], [1.45, 0, 0.9, 2.6]] as const) { bx(D, X(x + ox), Z(z + oz), w, 0.45, d, 0x5a3e34); bx(D, X(x + ox + (ox ? 0.17 : 0)), Z(z + oz + (oz > 0 ? 0.17 : oz < 0 ? -0.17 : 0)), ox ? 0.25 : w, 0.9, ox ? d : 0.25, 0x4e352c, { c: 0 }); }
  }
  for (const [x, z] of [[2.2, 1.6], [7, 1.6], [18.6, 1.6], [18.6, 11]] as const) { bx(D, X(x), Z(z), 1.2, 0.8, 1.2, 0x6e6a62); for (let k = 0; k < 4; k++) P(D, 'ico', X(x + Math.cos(k * 1.7) * 0.15), Z(z + Math.sin(k * 1.7) * 0.15), 0.2, 0.9 + k * 0.2, 0.2, 0x5a4a2e, { y: 0.8, c: 0 }); }
  /* the bar, under the gallery to the west: a counter, stools, and the bottles on the back wall that caught the
     emergency light; the survivors took what they could carry */
  bx(D, -1, -7.4, 10, 1.0, 0.7, 0x4a3226); bx(D, -1, -7.4, 10.3, 0.16, 0.85, 0x2a2c2e, { y: 1.0, c: 0 }); // a heavy top on a solid counter
  bx(D, -1, -4.3, 10, 2.4, 0.3, 0x3a2a20, { y: 0.2 }); for (const y of [1.1, 1.7]) bx(D, -1, -4.6, 10, 0.04, 0.35, 0x2a2c2e, { y, c: 0 });
  for (let k = 0; k < 22; k++) if ((k * 7) % 5 !== 0) P(D, 'cyl', X(2.2 + k * 0.22), -4.56, 0.08, 0.3, 0.08, [[0.35, 0.55, 0.3], [0.6, 0.35, 0.15], [0.7, 0.68, 0.6], [0.3, 0.2, 0.15]][k % 4] as [number, number, number], { y: 1.14 + (k % 2) * 0.6, c: 0 });
  for (let k = 0; k < 6; k++) P(D, 'cyl', X(2.4 + k * 0.8), -9.2, 0.4, 0.75, 0.4, 0x2c2f33); // the stools
  bx(D, -3.8, -9.6, 0.4, 0.05, 0.25, 0x5a6a50, { y: 0.01, ry: 0.6, c: 0 }); P(D, 'cyl', 2.6, -9.8, 0.08, 0.3, 0.08, 0x355530, { y: -0.11, rz: 1.5, c: 0 }); // a bottle, dropped (on its side: its middle 4 cm up)
  /* its eye: one high in the north-east corner, over the lounge; the lobby is a public room, not armed, so it records */
  camera(D, 29.2, -27.2, 9, -0.79, 'SEC', 'wing', { name: 'Lobby' }); // looking south-west, over the lounge to the stair

  /* off goods inward, where things came off the hoist: hazardous storage, its suits on the wall and its rebreathers.
     Its heavy door runs off Ops' own bus, not the wing's: it waits on Gen-1 either way, cut or mended */
  room(D, 'Hazardous storage', 14, 12, 12, 10, { ...UTIL, c: 'SEC' }); door(D, 17, 11, { kind: 'heavy', c: 'OPS', sg: [['Hazard store', 'n']] });
  for (const [x, z] of [[12.6, 25.4], [13.3, 25.5], [12.6, 24.7], [17.4, 21.4], [16.8, 21.4]]) P(D, 'cyl', X(x), Z(z), 0.6, 0.9, 0.6, 0xc9a227);
  for (let k = 0; k < 3; k++) bx(D, X(14.6 + k * 0.6), 12.06, 0.5, 1.5, 0.12, 0xc9a227, { y: 0.4, c: 0 }); // hazmat suits on their pegs, against the wall
  shelf(D, 25.4, 17.2, 0.5, 2.2, { cols: [0xc9a227, 0x3d4042] }); bx(D, 20.8, 20.8, 0.8, 0.6, 0.6, 0x3a4030);
  item(D, 'rebreather', 20.8, 20.8, 0.6); item(D, 'kit', 25.3, 16.6, 1.06);
  const SC: RoomOpts = { ...SEC, c: 'SEC', ht: 4.5, em: 1, safe: 1, armed: 1, mat: SKIM(SEC) };
  room(D, 'Security corridor', 32, -4, 36, 6, SC);
  /* the cut, near the wing's end: the cabinet left open, the cable through, and the one who did it */
  panel(D, 'SEC', 64.8, -4.68, 's', { cut: 1, zone: 'wing' }); // mended, it comes live on Security's board, and the wing sounds
  bx(D, 64.8, -4.71, 0.12, 2.7, 0.08, 0x2a2c2e, { y: 1.8, c: 0 }); // its conduit, up the wall to the ceiling
  /* the cut ends, hanging out of the bottom of the open cabinet */
  P(D, 'cyl', 64.6, -4.65, 0.07, 0.6, 0.07, 0x1d1f21, { y: 0.38, rz: 0.35, c: 0 }); P(D, 'cyl', 65, -4.65, 0.07, 0.45, 0.07, 0x1d1f21, { y: 0.51, rz: -0.3, c: 0 });
  corpse(D, 62.4, -2.2, 0x2c3440, false, { label: 'Guard', say: 'A guard, days dead, bolt cutters still in his hand. Behind him the feed to the wing is cut clean through.' });
  blood(D, 63, -1.4, 1.3); note(D, 'cut', 63.8, -1.2, 0.02); // days ago: the survivors' cut, to blind the wing's cameras
  /* the wing's eye, dead with it until the cut is mended: its corridor, past the checkpoint, is armed, and the camera
     looks down it from the lobby end. Mended, the way along the wing is watched */
  speaker(D, 'wing', 50, -1, 'CRIT'); camera(D, 32.8, -3.4, 3.9, PI / 2, 'SEC', 'wing');
  /* what was left of a barricade across the mouth of the wing */
  bx(D, 66.8, -2.6, 1.8, 0.75, 0.7, 0x5b5d5f, { ry: 0.5 });
  /* North, a storey down: the medical isolation suite (world.md §8, Holding and The opening). Isolation rooms round a tall
     common hall, and over its south end, at the wing's own level, the nurses' station that the stair climbs to. The wing's
     feed is days cut; the suite runs on its own small backup set, kept for its locks, its readers and its pumps, and
     failing: its fittings low and stuttering. When it dies its emergency lights come up on their own cells, as the code
     wants: dimmer and cooler, not dark. You wake in room 1, on the west side; the other patient is in room 2, by the foot
     of the stair, their window facing yours across the hall; rooms 3 and 4, empty, are along the north side between you,
     in sight of your window; every isolation room's door is fail-safe: locked while the set runs, let go when it dies */
  const NIGHT: Colour = [0.3, 0.26, 0.2], BATT = { colour: [0.06, 0.065, 0.075] as Colour, supply: 'CELLS', watch: 'ISO' };
  const ISO: RoomOpts = { fl: 0x4c5250, wl: 0x6f7a77, st: 0x3f7f6b, c: 'ISO', em: 1, flick: 1, safe: 1, lc: NIGHT, batt: BATT, mat: { floor: 'vinyl', wall: 'block' } };
  const ROOM: RoomOpts = { ...ISO, lc: [0.5, 0.42, 0.32] };
  /* the hall, and its north-east bay at the stair's foot, walled off from room 4: the partition between them meets
     the one along the north side, so room 4 keeps its corner and nobody walks round the end of either */
  const IS: RoomOpts = { ...ISO, ht: 8 }, ISP: RoomOpts = { ...IS, part: 1 };
  room(B, 'Isolation suite', 42, -22, 14, 14, IS); room(B, 'Isolation suite', 53.25, -28, 2.75, 6, IS);
  /* and up to the partitions: the north side's, and rooms 1 and 2's, west and east. Room 1's is no taller than the
     room: over it, beyond the hall's west wall, are the check-in hall and screening */
  room(B, 'Isolation suite', 42, -22.75, 11.25, 0.75, ISP);
  room(B, 'Isolation suite', 41.25, -22, 0.75, 4, { ...ISP, ht: 3.2 }); room(B, 'Isolation suite', 56, -26, 0.75, 6, ISP);
  /* a room in use: its bed, its pump on its pole and the last bag hung on it, dry; its bed lamp on (`lamp`), whoever is
     in it shows against it at the glass. (x, y) its north-west corner, the
     partition with its door and observation window on its east (east) or west side, the window `win` rows in; its sill
     high enough that crouched under it nobody outside sees you */
  const isoRoom = (k: number, x: number, y: number, east: boolean, win: number, dr: number, lamp = false) => {
    const dx = east ? x + 3 : x - 1, bed = east ? x + 0.4 : x + 2.6, pole = bed + (east ? POLE.across : -POLE.across) / 2, at = y + 1.5 + POLE.along / 2;
    room(B, 'Isolation room ' + k, X(x) - (east ? 0 : 0.75), Z(y), 6.75, 6, lamp ? { ...ROOM, lc: [1.5, 1.25, 0.88] } : ROOM);
    door(B, X(dx) + 1, Z(y + dr) + 1, { span: 2, card: 's', failsafe: true, c: 'ISO', sg: [['Isolation ' + k, east ? 'e' : 'w']] }); door(B, X(dx) + 1, Z(y + win) + 1, { span: 2, glass: true, glaze: 'obs' });
    medbed(B, X(bed), Z(y + 1.5), east ? 1 : -1); bx(B, X(bed + (east ? 0.6 : -0.6)), Z(y + 0.45), 0.45, 0.5, 0.4, 0xb8bcc0);
    bx(B, X(pole), Z(at), 0.22, 0.17, 0.13, 0xd8dcd8, { y: 1.02, c: 0 }); // the pump on the bed's pole, its screen lit while it has power
    bx(B, X(pole + (east ? 0.06 : -0.06)), Z(at), 0.02, 0.07, 0.09, [0.05, 0.06, 0.05], { y: 1.08, c: 0, pw: [[0.05, 0.06, 0.05], [2.3, 2.55, 2.4]], pc: 'ISO' });
    return { x: pole, z: at };
  };
  /* yours, on a guard's card like the rest */
  const p1 = isoRoom(1, 22, 3, true, 1, 2); // its window straight across the hall at room 2's
  use(B, 'pump', X(p1.x), Z(p1.z), 1.1);
  use(B, 'look', X(p1.x), Z(p1.z), 1.55, { label: 'IV bag', text: 'MIDAZOLAM 100 mg in 100 mL sodium chloride 0.9%. Isolation 1. Hung 11/11, 23:10, M.O. Empty.' });
  use(B, 'look', 40.66, -23.4, 1.4, { label: 'Intercom', text: 'Static, and nothing under it.', sfx: 'static' });
  note(B, 'intake', 36, -23.1, 0.52);
  /* your washroom, out of sight of the hall, behind room 1: its door a plain one, slid by hand, that stays as you leave it
     (on the wing's dead feed, so no motor of its own) */
  room(B, 'Washroom', 34, -16, 6, 4, ROOM); door(B, 37.4, -17, { c: 'SEC' });
  for (const x of [22.3, 23.1]) bx(B, X(x), -12.6, 0.5, 0.85, 0.6, 0xc8ccd0); bx(B, 39, -15, 1, 2.1, 1, 0x8a9a94, { c: 0 });
  /* the other patient's, by the stair's foot: awake for days, their bag run dry first, and their lamp on. Tally marks by
     the bed, the chair they hit the glass with, the drawers turned out for anything to eat, and their hands on the inside
     of the window */
  const p2 = isoRoom(2, 34, 2, false, 2, 1, true); // its window straight across at yours, over the stair's foot
  use(B, 'look', X(p2.x), Z(p2.z), 1.55, { label: 'IV bag', text: 'MIDAZOLAM 100 mg in 100 mL sodium chloride 0.9%. Isolation 2. Hung 8/11, 22:50, M.O. Dry, days ago.' });
  for (let k = 0; k < 3; k++) bx(B, X(35.1 + k * 0.05), -25.995, 0.012, 0.32, 0.01, 0x2a2622, { y: 1.15, c: 0 });
  /* on the glass, the room's side of it (the pane's 3 cm in the middle of the wall) */
  for (const [z, y] of [[4.35, 1.45], [4.55, 1.62], [4.7, 1.38], [4.45, 1.8]]) bx(B, 57.018, Z(z), 0.006, 0.09, 0.07, 0x5a4a3e, { y, c: 0 });
  bx(B, 60.8, -20.8, 0.45, 0.45, 0.45, 0x5f6266, { rz: PI / 2 - 0.15, ry: 0.4 }); // the chair, on its side by the window
  /* the drawers against the wall, pulled half out */
  bx(B, 61.2, -25.775, 0.6, 0.8, 0.45, 0x5f6266); for (const y of [0.2, 0.5]) bx(B, 61.2, -25.475, 0.5, 0.18, 0.4, 0x6a6e70, { y, c: 0 });
  room(B, 'Washroom', 58, -18, 6, 4, ROOM); door(B, 61.4, -19, { open: true });
  for (const z of [6.3, 7.1]) bx(B, 63.4, Z(z), 0.5, 0.85, 0.6, 0xc8ccd0); bx(B, 59.2, -15, 1, 2.1, 1, 0x8a9a94, { c: 0 });
  /* rooms 3 and 4, made up and empty, along the north side of the hall, between you: their doors open to a guard's card */
  for (const [k, x, w, cab] of [[3, 26, 4, 45.5], [4, 29, 4.75, 52.25]] as const) {
    room(B, 'Isolation room ' + k, X(x), -28, w, 4.75, ROOM); door(B, X(x) + 1, -23, { span: 2, card: 's', failsafe: true, c: 'ISO', sg: [['Isolation ' + k, 's']] });
    medbed(B, X(x + 1), -27); bx(B, cab, -24.8, 0.45, 0.5, 0.4, 0xb8bcc0);
  }
  /* the hall: a kitchenette under the balcony, a table, plants nobody watered */
  bx(B, 47, -8.32, 5, 0.88, 0.6, 0x5a5e60); bx(B, 47, -8.34, 5.1, 0.04, 0.66, 0x8a8e8c, { y: 0.88, c: 0 }); bx(B, 47, -8.18, 5, 0.7, 0.35, 0x5a5e60, { y: 1.6, c: 0 });
  bx(B, 52.8, -8.36, 0.8, 1.9, 0.7, 0xb8bcc0);
  tbl(B, 46.8, -15.6, 2.4, 1.2, 0x6b5a48); for (const [x, z] of [[28, 6.65], [28.8, 6.65], [28, 7.75], [28.8, 7.75]]) bx(B, X(x), Z(z), 0.45, 0.45, 0.45, 0x3a3d40);
  for (const [x, z] of [[26.4, 7.6], [26.4, 8.5]]) { P(B, 'cyl', X(x), Z(z), 0.5, 0.5, 0.5, 0x8a6a4a); P(B, 'ico', X(x), Z(z), 0.8, 0.5, 0.8, 0x5a4a34, { y: 0.5, c: 0 }); } // clear of the door to the retreat
  /* the stair up to the station, wide, against the east wall; by its foot a flashlight, out, where somebody dropped it */
  stairs(B, D, 52, -22, 2, 10, 's'); stairs(B, D, 54, -22, 2, 10, 's'); exitSign(B, 56.725, -20.8, 3, 'w'); // on the wall the stair climbs
  item(B, 'flash', 53.85, -27, 0.02);
  room(D, "Nurses' station", 36, -12, 22, 6, { ...WALK, c: 'SEC', ht: 3.5, safe: 1, fl: 0x4c5250, wl: 0x6f7a77 }); door(D, 47.4, -5, { open: true, sg: [['Isolation', 's']] });
  exitSign(D, 47, -6.025, 2.5, 'n');
  desk(D, 41, -6.8, 1.8, 0.7, { bare: 1 }); bx(D, 41, -6.6, 0.5, 0.34, 0.06, 0x22262a, { y: 0.76, c: 0 }); bx(D, 41, -6.64, 0.44, 0.28, 0.02, [0.06, 0.12, 0.1], { y: 0.79, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]], pc: 'SEC' });
  bx(D, 41, -8, 0.45, 0.45, 0.45, 0x2c2f33); bx(D, 51, -6.6, 1.6, 0.42, 0.4, 0x44484c);
  /* the whiteboard on the wall behind the desk, its sedation orders seven weeks old: read off the board itself */
  bx(D, 52.8, -6.02, 1.7, 1.0, 0.04, 0xe2e2da, { y: 1.15, c: 0 });
  for (let k = 0; k < 5; k++) { const w = 0.7 + (k % 3) * 0.2; bx(D, X(31.75 - (k % 2) * 0.075 - w / 4), -6.045, w, 0.03, 0.01, 0x2a3a6a, { y: 1.9 - k * 0.15, c: 0 }); } // its lines, from a margin on the reader's left (east)
  note(D, 'board', 52.8, -6.05, 1.5, true);
  item(D, 'batt', 41.8, -6.8, 0.78); note(D, 'duty', 40.2, -6.9, 0.78); item(D, 'baton', 50.4, -6.6, 0.44); item(D, 'ration', 51.6, -6.6, 0.44);
  /* The briefing room (world.md §8, one control room): where the response team was told what the day held, and the
     survivors' last room. A vestibule off the corridor, with the plan table and a window onto the corridor they held,
     opens into the room proper, which runs east behind the atrium's north wall: a projection screen across its north
     wall, the lectern, chairs in rows with an aisle down the middle, the station's plans on the walls. The survivors
     slept at the back of it. Behind the officer's card, and dark with the wing. */
  room(D, 'Briefing room', 60, -14, 6, 8.75, { ...OFF, c: 'SEC', ht: 4 }); door(D, 63.4, -5, { card: 's', sg: [['Briefing', 's']] });
  room(D, 'Briefing room', 60, -24, 14, 10, { ...OFF, c: 'SEC', ht: 4 });
  door(D, 61, -5, { seal: true, glass: true }); room(D, 'Security corridor', 60, -4.75, 6, 0.75, { ...SC, part: 1 }); // the vestibule's wall on the corridor, a window in it
  bx(D, 67, -23.98, 10, 2.9, 0.04, 0xd8d4c4, { y: 0.9, c: 0 }); bx(D, 67, -23.97, 10.2, 0.12, 0.06, 0x2a2c2e, { y: 3.8, c: 0 }); // the screen, on the wall
  bx(D, 67, -17.6, 0.5, 0.25, 0.6, 0x2c2f33, { y: 3.4, c: 0 }); bx(D, 67, -17.6, 0.06, 0.35, 0.06, 0x2c2f33, { y: 3.65, c: 0 }); // the projector, on its rod from the ceiling
  bx(D, 67, -17.92, 0.16, 0.12, 0.04, [0.05, 0.05, 0.05], { y: 3.45, c: 0, pw: [[0.05, 0.05, 0.05], [2.9, 2.85, 2.7]], pc: 'SEC' });
  bx(D, 62.4, -22.2, 0.6, 1.1, 0.5, 0x4a3a2c); bx(D, 62.4, -22.28, 0.7, 0.05, 0.6, 0x3a2c22, { y: 1.1, c: 0 }); // the lectern, its top flat enough for the briefing to lie on
  /* the chairs, as the last briefing left them; a few knocked over since */
  for (const [z, zi] of [[4.8, 0], [5.8, 1], [6.8, 2]] as const) for (const [x, xi] of [[36.3, 0], [37, 1], [37.7, 2], [39.3, 3], [40, 4]] as const) {
    const k = zi * 5 + xi, down = k === 3 || k === 11;
    if (down) { bx(D, X(x), Z(z + 0.2), 0.45, 0.45, 0.45, 0x2c2f33, { ry: 0.4 + k * 0.2, rz: PI / 2 - 0.1 }); continue; }
    bx(D, X(x), Z(z), 0.45, 0.45, 0.45, 0x2c2f33, { ry: ((k * 7) % 5 - 2) * 0.05 }); bx(D, X(x), Z(z + 0.1), 0.45, 0.5, 0.05, 0x2c2f33, { y: 0.45, c: 0 }); // its back, on the seat's back edge
  }
  /* the station's plans, on the walls: a floor to a sheet */
  for (const [x, z, ew] of [[35.0075, 4.3, true], [35.0075, 6.4, true], [39.6, 7.9925, false]] as const) {
    bx(D, X(x), Z(z), ew ? 0.03 : 2.2, 1.4, ew ? 2.2 : 0.03, 0xd8d4c4, { y: 1.2, c: 0 });
    for (let k = 0; k < 4; k++) bx(D, X(x + (ew ? 0.01 : (k - 1.5) * 0.25)), Z(z + (ew ? (k - 1.5) * 0.25 : -0.01)), ew ? 0.02 : 0.3, 0.6 + (k % 2) * 0.3, ew ? 0.3 : 0.02, [0x39485a, 0x8c2f24, 0x4a5a3a, 0x8a7a4a][k], { y: 1.45, c: 0 });
  }
  /* where the survivors slept: bedrolls along the back wall, and what they ate */
  for (const x of [39.9, 40.95]) bx(D, X(x), -14.9, 1.9, 0.14, 0.7, 0x4a5240, { c: 0 });
  for (const [x, z] of [[39.2, 7.1], [39.35, 7.3], [41.6, 7.05]] as const) P(D, 'cyl', X(x), Z(z), 0.08, 0.11, 0.08, 0x8a8e8c, { c: 0 });
  tbl(D, 63, -10.4, 2.6, 1.4, 0x4a3a2c); bx(D, 63, -10.4, 2.2, 0.01, 1.1, 0xd8d4c4, { y: 0.76, c: 0 }); // the plan of the floor, pinned out
  shelf(D, 73.4, -20, 0.5, 2.4, { cols: [0x4d5a66, 0x7a4a34, 0x8a7a4a] });
  note(D, 'cams', 62.4, -22.24, 1.16); item(D, 'batt', 71.2, -14.9, 0.16, 2); item(D, 'ammo9', 61, -7, 0.02);
  /* South off the wing: the locker room, the survivors' back way into the muster hall (a door at each end, down the
     aisle between the banks), and the infirmary. The back door is the wing's, on its feed like the room: cut, it slides
     by hand; and it makes the level's first loop, the wing to the hall by the atrium or by the lockers */
  room(D, 'Locker room', 32, 3.25, 16, 18.75, { ...SEC, c: 'SEC', safe: 1 }); door(D, 39.4, 3, { sg: [['Lockers', 'n']] });
  door(D, 39.4, 23, { c: 'SEC', sg: [['Lockers', 's']] });
  /* its wall on the corridor a partition, a strip of glass along its top sharing the corridor's light */
  room(D, 'Security corridor', 32, 2, 16, 0.75, { ...SC, part: 1 }); for (const x of [21, 22, 26, 27, 28]) door(D, X(x) + 1, 3, { span: 2, seal: true, glass: true, glaze: 'high' });
  for (const z of [19.5, 22.5]) for (const x of [22.4, 26.6]) { bx(D, X(x), Z(z), 5.6, 2, 1, 0x4d5a66); bx(D, X(x), Z(z), 5.64, 0.05, 1.04, 0x3a444c, { y: 2, c: 0 }); }
  for (const x of [22.4, 26.6]) for (const z of [18.2, 21, 23.8]) bx(D, X(x), Z(z), 4.4, 0.45, 0.4, 0x6b5a48);
  for (const [x, z, ry] of [[23.5, 19.848, 0.9], [25.6, 22.861, -1.1], [21.8, 22.8705, 1.3]] as const) bx(D, X(x), Z(z), 0.5, 1.8, 0.03, 0x56636e, { y: 0.15, ry, c: 0 }); // doors left open, swung out from the banks' faces
  note(D, 'lockers', 42.4, 12, 0.47); item(D, 'bandage', 44.8, 17.6, 0.47); bx(D, 36.2, 20.8, 1.6, 0.45, 0.4, 0x6b5a48, { ry: 0.35 }); blood(D, 39, 20.4, 1.1);
  /* the infirmary: a ward of four beds behind curtains down the south wall, and at the east end a treatment bay behind
     glass, with its table and crash cart. They kept the hurt here, in the dark, and someone sat with the last of them */
  room(D, 'Infirmary', 50, 3.25, 16, 8.75, { ...MED, c: 'SEC', safe: 1, ht: 3.6 }); door(D, 57, 3, { sg: [['Infirmary', 'n']] });
  /* the ward's wall on the corridor is a partition, windows either side of the door: the nurses could see who came */
  room(D, 'Security corridor', 50, 2, 16, 0.75, { ...SC, part: 1 }); for (const x of [31, 35, 36]) door(D, X(x) + 1, 3, { span: 2, seal: true, glass: true });
  for (const x of [30.6, 31.9, 33.2, 34.5]) medbed(D, X(x), 9.2);
  /* the curtains, hung from tracks on the ceiling */
  for (const x of [31.25, 32.55, 33.85]) {
    bx(D, X(x), 9.2, 0.04, 1.9, 1.7, 0xb9c4bd, { y: 0.15, c: 0 }); bx(D, X(x), 9.2, 0.05, 0.04, 1.8, 0x9aa0a4, { y: 3.46, c: 0 });
    for (const dz of [-0.4, 0, 0.4]) bx(D, X(x), Z(19.6 + dz), 0.01, 1.42, 0.01, 0x9aa0a4, { y: 2.04, c: 0 });
  }
  bx(D, 58.4, 7.4, 0.45, 0.45, 0.45, 0x5f6266); blood(D, 59, 9.2, 0.8); // the chair pulled up to the last bed
  bx(D, 60.5, 5.6, 0.05, 2.1, 3.2, [0.55, 0.66, 0.7], { mat: 'glass' }); // the treatment bay's glass
  bx(D, 63.2, 6, 0.8, 0.9, 2, 0xb9c4bd); bx(D, 65, 8.4, 0.6, 0.95, 0.5, 0x8c2f24); bx(D, 50.7, 4.6, 0.6, 0.9, 0.5, 0xc8ccd0); // table, crash cart, sink
  /* the treatment bay's shelf, against its south wall across from the table. Its middle on a column of the light's
     lattice (lightField.ts), so its ends fall past the half way to the next: what is dark inside it stays inside it,
     not a slab on the wall beside it */
  shelf(D, 53.6, 4.6, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] }); shelf(D, 63.125, 11.75, 1.8, 0.5, { cols: [0xd4d8d4, 0xb9c4bd, 0x8c2f24] });
  item(D, 'bandage', 62.5, 11.75, 1.04, 2); item(D, 'medkit', 63.6, 11.75, 1.04);

  /* The atrium: the highway's bend, and the threshold. The wing's leg runs into it from the west, dark; it is lit,
     theirs, and the second leg leaves it south for Operations. Two storeys, a gallery round two sides at +5 with a
     stair up the core, and in the middle the core itself: the Security elevator, on the wing's feed. */
  const AT: RoomOpts = { ...OPS, ht: 9.5, em: 1, lc: [0.85, 0.8, 0.68] };
  for (const [x, y, w, h] of [[39, 9, 10, 3], [39, 16, 10, 5], [39, 12, 3, 4], [46, 12, 3, 4]]) room(D, 'Atrium', X(x), Z(y), L(w), L(h), AT);
  room(D, 'Security elevator', 76, -4, 4, 4, { ...SEC, c: 'SEC', em: 1, noroam: 1 }); door(D, 75, -0.6, { sg: [['Security elevator', 'w']] });
  bx(D, 79.97, -2, 0.06, 0.5, 0.4, 0x2c2f33, { y: 1.1, c: 0 }); use(D, 'elev', 79.8, -2, 1.3, { c: 'SEC', to: 'main' }); D.marks['elev:main'] = [78, -2, PI / 2];
  room(D, 'Phase 2', 76, -18, 4, 4, { ...UTIL, lit: 'none', nolamp: 1, noroam: 1 }); door(D, 77, -13, { kind: 'heavy', seal: true, msg: 'Welded shut. Stencilled across it: PHASE 2. NOT COMMISSIONED.', sg: [['Phase 2', 's']] });
  stairs(D, T1, 82, -8, 2, 12, 'n');
  const GW: RoomOpts = { ...WALK, ht: 4.5, c: 'OPS', mat: { wall: 'block' } };
  room(T1, 'Gallery', 68, -12, 20, 4, GW); room(T1, 'Gallery', 84, -8, 4, 20, GW);
  /* the atrium's eye: one on the threshold from the south-west corner, which only records (the atrium is not armed);
     its speaker high in the well by the east gallery's rail, out of reach but from there */
  speaker(D, 'atrium', 83.4, 9.2, 'CRIT'); camera(D, 68.6, 11.2, 3.8, PI, 'OPS', 'atrium');
  /* where the light changes, it starts: eggs at the threshold, on their side */
  eggs(D, 68.8, -3.2, 2); eggs(D, 68.6, 1.2, 3); blood(D, 82.6, 8.6, 1.4);
  /* the second leg: south from the atrium between the offices, and out into the muster hall */
  room(D, 'Operations corridor', 74, 12, 6, 12, { ...OPS, ht: 4.5, em: 1, mat: SKIM(OPS) });
  /* the Operations zone sounds here: the corridor, and the hall's east bays */
  speaker(D, 'ops', 77, 20, 'CRIT'); mut(D, 'husk', 77, 18); mut(D, 'husk', 72, 7); blood(D, 76, 15.4, 1.2);
  /* the chief's office is armed, its camera in the far corner on the door */
  for (const [nm, x, y, dopt, east] of [['Office: operations', 37, 22, { open: true }, false], ['Office: chief of security', 46, 22, { card: 'o' }, true]] as const) {
    room(D, nm, X(x), Z(y), 8, 8, { ...OFF, c: 'OPS', lc: [0.85, 0.78, 0.62], armed: east }); door(D, X(east ? x - 1 : x + 4) + 1, Z(y + 1) + 1, { ...east ? { ...dopt, sg: [['Chief of security', 'w']] } : dopt, span: 2 });
    desk(D, X(x + 2), Z(y + 3.4), 1.8, 0.7, { c: 0x4a3a2c }); bx(D, X(x + 2), Z(y + 2.7), 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, X(east ? x + 3.7 : x + 0.3), Z(y + 1.6), 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  }
  camera(D, 89.2, 21.2, 2.8, -1.99, 'OPS', 'ops');
  note(D, 'mgr', 67.4, 20.7, 0.78); item(D, 'batt', 68.8, 20.8, 0.78); note(D, 'chief', 85.4, 20.7, 0.78); item(D, 'ammo9', 86.8, 20.8, 0.78); item(D, 'medkit', 89, 14.8, 0.02);
  room(D, 'Maintenance', 82, 24, 8, 10, { ...UTIL, c: 'OPS' }); door(D, 81, 27, { sg: [['Maintenance', 'w']] });
  genset(D, 'OPS', 88.6, 29, 87.4, 29); shelf(D, 85.2, 33.4, 1.8, 0.5, { cols: [0xc9a227, 0x3d4042] }); item(D, 'kit', 85.2, 33.4, 1.06);

  /* The muster hall: where the response team drilled (world.md §8). Long, flat and lit, on Ops' backup set: a promenade
     round a sunken court, the court's ceiling lifted into a coffer, and rooms off every side, each with a door. Over its
     south side, behind a wall of glass on the court, the operations room, over every crossing. Its east bays, the stair
     up to it hang off their own breaker (EAST), in the electrical room at the far, west end; the room itself is on critical
     power, which nothing out here can switch. */
  const MH: RoomOpts = { ...OPS, ht: 4.5, em: 1, lc: [0.86, 0.82, 0.72], c: 'HALL' };
  for (const [x, y, w, h] of [[16, 27, 8, 12], [24, 27, 12, 2], [24, 37, 12, 2]] as const) room(D, 'Muster hall', X(x), Z(y), L(w), L(h), MH);
  room(D, 'Muster hall', 62, 24, 18, 24, { ...MH, c: 'EAST' });
  /* the court: 1.25 m down (five steps; floors keep to the grid's quarter metres), with steps the length of both long sides (they sat on them for the muster) and a glass
     balustrade at each end; over it the ceiling lifts to 8.5 m, the drill clock hangs in the middle, and the operations
     room looks down on it through its glass */
  room(D, 'Muster court', 38, 28, 24, 16, { ...MH, dy: -1.25, ht: 9.75 });
  flight(D, 38, 28, 24, 4, -1.25, 0, 'n', 5); flight(D, 38, 40, 24, 4, -1.25, 0, 's', 5);
  for (const x of [23.96, 36.04]) { bx(D, X(x), 36, 0.06, 1, 16, [0.55, 0.66, 0.7], { mat: 'glass' }); bx(D, X(x), 36, 0.12, 0.06, 16.1, 0x5a5d60, { y: 1, c: 0 }); }
  bx(D, 50, 36, 2.6, 1.1, 0.5, 0x22262a, { y: 6.2, c: 0 });
  for (const z of [32.87, 33.13]) bx(D, 50, Z(z), 2.2, 0.7, 0.02, [0.05, 0.04, 0.04], { y: 6.4, c: 0, pw: [[0.05, 0.04, 0.04], [2.6, 0.5, 0.3]], pc: 'HALL' });
  for (const x of [29.5, 30.5]) bx(D, X(x), 36, 0.04, 2.45, 0.04, 0x2a2c2e, { y: 7.3, c: 0 }); // its rods, up to the coffer's ceiling
  for (const [x, z, c] of [[27, 29.01, 0x39485a], [33, 29.01, 0x8a7a4a], [27, 36.99, 0x8a7a4a], [33, 36.99, 0x39485a]] as const) bx(D, X(x), Z(z), 1.4, 2.2, 0.04, c, { y: 5.9, c: 0 });
  bx(D, 39.4, 36, 0.6, 1.1, 0.5, 0x4a3a2c); P(D, 'cyl', 39, 33.2, 0.05, 2.2, 0.05, 0x8a8a84, { c: 0 }); bx(D, 39, 33.6, 0.03, 0.6, 0.9, 0x39485a, { y: 1.5, c: 0 });
  eggs(D, 52, 34.4, 3); eggs(D, 46.8, 37.6, 2); blood(D, 49, 36, 1.6);
  /* pillars round the court and down both ends; the track painted round the hall; benches, the muster board, shields */
  for (const [x, z] of [[19.5, 30.5], [19.5, 35.5], [40.5, 30.5], [40.5, 35.5], [23.5, 28.5], [36.5, 28.5], [23.5, 37.5], [36.5, 37.5]]) {
    bx(D, X(x), Z(z), 0.9, 4.5, 0.9, 0x8c887e); bx(D, X(x), Z(z), 1, 0.3, 1, 0x5a5d60, { c: 0 });
  }
  for (const z of [27.4, 38.6]) bx(D, 50.4, Z(z), 55.2, 0.01, 0.12, 0xc9a227, { y: 0.012, c: 0 });
  for (const x of [16.4, 44]) bx(D, X(x), 36, 0.12, 0.01, 22.4, 0xc9a227, { y: 0.012, c: 0 });
  bx(D, 29, 24.025, 3.2, 1.6, 0.05, 0x2c3440, { y: 1.1, c: 0 }); for (let k = 0; k < 5; k++) bx(D, X(18.81 + k * 0.345), 24.055, 0.42, 0.56, 0.01, 0xd8d4c4, { y: 1.5 + (k % 2) * 0.4, c: 0 });
  for (const z of [29.6, 36.4]) bx(D, 22.5, Z(z), 0.4, 0.45, 3, 0x6b5a48);
  for (let k = 0; k < 4; k++) bx(D, 22.132, Z(34.9 + k * 0.3), 0.12, 1.2, 0.55, 0x3a3d40, { y: 0.003, rz: 0.12, c: 0 }); // shields, leaning on the wall
  /* the east bays: crowd barriers left where the last drill had them */
  for (const [x, z, ry] of [[39, 33, 0], [42.5, 31.4, 0.4], [42, 35.2, -0.3], [38, 29.2, PI / 2]] as const) {
    bx(D, X(x), Z(z), 0.3, 1.05, 2.4, 0xc9a227, { ry }); bx(D, X(x), Z(z), 0.32, 0.12, 2.42, 0x2a2c2e, { y: 0.6, ry, c: 0 });
  }
  /* its eyes: the hall is a promenade, not armed, so the two out here only record (one high in the coffer, on the
     hall's own breaker; one in the east bays' north-east corner, on EAST). The rooms off it that are armed have their
     own, inside, on the hall's breaker: the electrical room, the Armory, the range; and the operations stair, on EAST,
     sounding the Operations zone. The speaker hangs low enough to reach; like every speaker on the level it is on the
     PA, which is on critical power: smashing it is the only answer */
  speaker(D, 'muster', 29, 36, 'CRIT');
  camera(D, 38.2, 36, 7.6, PI / 2, 'HALL', 'muster', { name: 'Muster court' }); camera(D, 79.4, 24.6, 4, -PI / 4, 'EAST', 'ops', { name: 'East bays' });

  /* west, off the hall's far end: the electrical room, and the one who came for it. Armed: its camera hangs over the
     door looking across at the board, so the way to the board is in its view. The board breaks Ops' feed out to the hall
     (HALL: its lights, the court, the cameras of the rooms off it, this one's too) and its east bays (EAST: their
     lights, the operations stair, two cameras): each a trade, and a third way left spare. The operations room and the PA are not on it: they are
     critical operations power, panelled inside the operations room's own walls, and its schedule says so. A lamp over
     the cabinet for each branch, for the critical feed, and for Ops itself */
  room(D, 'Electrical room', 10, 32, 10, 8, { ...UTIL, c: 'OPS', safe: 1, armed: 1 }); door(D, 21, 35, { sg: [['Electrical', 'e']] });
  camera(D, 19.2, 32.6, 2.8, -1.08, 'HALL', 'muster', { name: 'Electrical room' });
  bx(D, 10.02, 35, 0.04, 1.7, 3.4, 0x3a3d40, { y: 0.55, c: 0 });
  for (const [c, z] of [['HALL', 31.6], ['EAST', 32.5]] as const) panel(D, c, 10.11, Z(z), 'e', { brk: 1 });
  bx(D, 10.08, 36.8, 0.08, 0.5, 0.5, 0x2c2f33, { y: 1.1, c: 0 }); // the spare way, blanked
  use(D, 'look', 10.4, 36.8, 1.6, { label: 'Panel schedule', text: 'Typed, under plastic. 1: MUSTER HALL WEST (AND COURT). 2: MUSTER HALL EAST (AND OPS STAIR). 3: SPARE. Below, in red: OPERATIONS AND SECURITY PA ARE CRITICAL LOADS. FED FROM THE UPS ROOM BEHIND OPERATIONS. NOT ON THIS BOARD.' });
  bx(D, 15, 32.4, 4.4, 2.2, 0.6, 0x4a4f55);
  for (const [k, c] of (['HALL', 'EAST', 'CRIT', 'OPS'] as const).entries()) bx(D, X(11.65 + k * 0.6), 32.72, 0.5, 0.3, 0.04, [0.2, 0.2, 0.2], { y: 1.5, c: 0, pw: [[0.2, 0.2, 0.2], [0.4, 2.6, 0.6]], pc: c });
  bx(D, 17.6, 38.4, 1.2, 1.6, 1, 0x44525a); bx(D, 14.8, 39.85, 3.4, 0.08, 0.3, 0x2a2c2e, { y: 2.8, c: 0 }); item(D, 'batt', 12, 38.8, 0.02);
  corpse(D, 23.8, 35.6, 0x2c3440, true, { label: 'Guard', say: 'A guard, a step short of the electrical room. REYES, on the name tape. Opened from the side, by something that kept going.' });
  blood(D, 25.2, 36.8, 1.8);

  /* north, off the hall: the Armory, the response team's, where they kept what they drilled with. Armed, its camera
     in the north-west corner on the door */
  room(D, 'Armory', 50, 14, 10, 8, { ...SEC, c: 'OPS', armed: 1 }); camera(D, 50.8, 14.8, 2.8, 0.53, 'HALL', 'muster', { name: 'Armory' }); door(D, 55, 23, { kind: 'heavy', code: 1, c: 'OPS', sg: [['Armory', 's']] });
  shelf(D, 50.6, 17.2, 0.5, 3, { empty: 1 }); shelf(D, 59.4, 17.2, 0.5, 3, { empty: 1 }); bx(D, 55, 15, 0.9, 0.7, 0.7, 0x3a4030);
  for (let k = 0; k < 6; k++) bx(D, X(30.9 + k * 0.62), 19.2, 0.05, 2.4, 0.05, 0x2a2c2e, { c: 0 }); bx(D, 54.8, 19.2, 3.2, 0.05, 0.05, 0x2a2c2e, { y: 2.4, c: 0 }); // the cage
  item(D, 'pistol', 50.7, 15.8, 1.06); item(D, 'ammo9', 50.7, 17, 1.06, 2); item(D, 'shotgun', 50.7, 18.4, 1.06); item(D, 'shells', 59.3, 16, 1.06, 2); item(D, 'tacvest', 59.3, 18, 1.06); item(D, 'surf', 55, 15, 0.7);

  /* south, off the hall: the range (dark until Gen-1: it has no emergency lights), the duty office with its window on
     the hall, and the stair up to the operations room */
  room(D, 'Firing range', 22, 50, 28, 8, { ...SEC, c: 'OPS', ht: 3.4, armed: 1 }); door(D, 25.4, 49, { sg: [['Range', 'n']] });
  camera(D, 22.8, 50.8, 3, 1.24, 'HALL', 'muster', { name: 'Firing range' }); // armed, its camera by the door looking down the lanes: blind until Gen-1 lights them
  bx(D, 29.2, 53, 0.5, 1, 6, 0x44484c); for (const z of [41, 42, 43]) bx(D, 30.1, Z(z), 0.9, 1.8, 0.06, 0x5a5d60);
  for (const z of [40.5, 41.5, 42.5]) { bx(D, 39.6, Z(z), 20, 0.06, 0.06, 0x2a2c2e, { y: 3.1, c: 0 }); bx(D, 48.6, Z(z), 0.06, 1, 0.5, 0xc8c0a0, { y: 1, c: 0 }); bx(D, 48.6, Z(z), 0.06, 0.06, 0.06, 0x2a2c2e, { y: 2, c: 0 }); }
  bx(D, 49.7, 54, 0.3, 3.2, 8, 0x3a3226); for (const x of [21.5, 23.5, 25.5, 27.5]) bx(D, X(x), 54, 0.8, 0.05, 8, 0x5a5d60, { y: 2.6, rz: 0.5, c: 0 });
  item(D, 'ammo9', 29.2, 52, 1.02);
  room(D, 'Duty office', 52, 49.25, 8, 8.75, { ...OFF, c: 'OPS', lc: [0.85, 0.78, 0.62] }); door(D, 53.4, 49, { sg: [['Duty office', 'n']] });
  for (const x of [33, 34]) door(D, X(x) + 1, 49, { span: 2, seal: true, glass: true }); room(D, 'Muster hall', 52, 48, 8, 0.75, { ...MH, part: 1 }); // its wall on the hall, the window in it
  desk(D, 57, 51.2, 1.8, 0.7, { c: 0x4a3a2c }); bx(D, 57, 52.6, 0.45, 0.45, 0.45, 0x2c2f33); shelf(D, 59.4, 55.2, 0.5, 1.8, { cols: [0x7a4a34, 0x4d5a66, 0x8a7a4a] });
  item(D, 'peaches', 56.2, 51.2, 0.78); item(D, 'bandage', 57.8, 51.1, 0.78); note(D, 'memo', 57, 51.36, 0.78);
  /* the desk's screen: the hall's cameras and the rooms off it, a sequencer stepping through them, on Ops' power
     (world.md §8, smaller screens first). A branch you have opened is black on it */
  monitors(D, 57, 52, 1.1, 'OPS', ['Muster court', 'East bays', 'Electrical room', 'Armory', 'Firing range', 'Operations stair'], { dwell: 5 });
  /* the deputy director, at the far end of the hall from Cargo's door, under the glass: she ran for the range */
  corpse(D, 23.6, 44.8, 0x4a4238, false, { label: 'Manager', say: 'DEPUTY DIRECTOR, OPERATIONS. She got as far as the range door. Her pass is still on its lanyard.', keys: ['o'] });
  /* the stair up to the operations room: a tall well off the east bays, and the landing at its head, where the door is
     grown shut. Armed, as the way to Operations. Eggs, and the floor dragged red, thicken toward it */
  room(D, 'Operations stair', 64, 50, 6, 12, { ...OPS, c: 'EAST', em: 1, ht: 9.5, armed: 1 }); door(D, 67.4, 49, { sg: [['Operations', 'n']] });
  stairs(D, T1, 66, 50, 2, 12, 's');
  room(T1, 'Operations stair', 64, 62, 6, 4, { ...OPS, c: 'EAST', em: 1, ht: 3.2, armed: 1 });
  camera(T1, 67, 65.2, 2.8, PI, 'EAST', 'ops', { name: 'Operations stair' }); // armed: from the landing, down the well to the door
  door(T1, 63, 63.4, { seal: true, msg: 'Bodies. Grown into the frame and into each other, floor to lintel, faces turned in. Something behind them is breathing.' });
  for (const z of [35.6, 36.8, 38]) blood(D, X(38.4 + (z - 36) * 0.15), Z(z), 1.1); eggs(D, 64.6, 46.6, 3); eggs(D, 69.2, 45.2, 2);
  for (const z of [41, 43, 44.6]) { eggs(D, 64.9, Z(z), 2); eggs(D, 69.2, Z(z + 0.5), 2); }
  eggs(T1, 64.8, 63, 4); eggs(T1, 69, 64.6, 3); gore(T1, 65.2, 64.4, 3); mut(T1, 'husk', 67.2, 63.2, { post: 1, yaw: PI / 2 });
  /* the operations room, over the hall's south side: a wall of glass on the court, and along the back wall its screens,
     what was left of its staff at each (below). Its door is grown shut, so it is no round's to walk to (the way toward it
     is up the armed stair, which the rounds keep out of) */
  room(T1, 'Operations room', 38, 46, 24, 18, { ...OFF, c: 'CRIT', ht: 4, em: 1, lc: [0.7, 0.74, 0.8], noroam: 1 });
  for (let x = 26; x <= 33; x++) door(T1, X(x) + 1, 45, { span: 2, seal: true, glass: true, c: 'CRIT' });
  tbl(T1, 48.6, 62.8, 20, 0.7, 0x3a3d40); // short of the east wall: the door comes in there
  for (let k = 0; k < 9; k++) { bx(T1, X(24.7 + k * 1.15), 63.97, 2.1, 1.2, 0.06, 0x22262a, { y: 1.1, c: 0 }); bx(T1, X(24.7 + k * 1.15), 63.93, 2, 1.1, 0.02, [0.05, 0.07, 0.08], { y: 1.15, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]], pc: 'CRIT' }); }
  eggs(T1, 40, 47.2, 3); eggs(T1, 59.8, 48, 4); gore(T1, 43, 52, 3); gore(T1, 57.2, 55, 3); blood(T1, 50, 56, 2.4);
  mut(D, 'skitter', 45.2, 54); eggs(D, 42.8, 56.6, 2); // the range
  /* east of the atrium, behind Operations' card: the link to Cargo, and over it on the second floor, Cargo control */
  door(D, 89, -1, { card: 'o', c: 'OPS', sg: [['Cargo', 'w']] }); room(D, 'Cargo link', 90, -2, 18, 4, { ...UTIL, c: 'CARGO', em: 1 });
  door(D, 109, -1, { sg: [['Cargo cavern', 'w']] });
  door(T1, 89, 3.4, { sg: [['Cargo control', 'w']] }); room(T1, 'Cargo control', 90, -6, 18, 14, { ...OFF, c: 'CARGO', ht: 4 });
  tbl(T1, 106.6, 0, 0.8, 4, 0x3a3d40); bx(T1, 104.8, 0, 0.45, 0.45, 0.45, 0x2c2f33); for (const z of [14.2, 15.8]) bx(T1, 106.8, Z(z), 0.5, 0.3, 0.06, 0x22262a, { y: 0.76, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.5, 2.75]], pc: 'CARGO' });
  /* the window onto the bay: three bays of glass in the east wall, high over the floor (world.md §8) */
  for (const r of [13, 15, 17]) door(T1, 109, Z(r) + 1, { span: 2, seal: true, glass: true, c: 'CARGO' });
  use(T1, 'look', 106.8, 0, 1.5, { label: 'Window', text: 'Thick glass, and the bay a long way down. Out on the rungs something glows, the colour of a healing burn.' });
  buildCargo(D, T1, T2, T3);
  /* at each screen, what is left of one of the operations staff, grown to it: a hunched trunk, a hand on the desk and
     one swollen eye at the glass of it, joined to its neighbours and by a cord of meat toward the middle of the room.
     Dressing for now: the room's new answer is open (world.md §8) */
  const MEAT = [0xa8705e, 0x9a6252, 0xb07a66, 0xa06854]; // their flesh
  for (let k = 0; k < 9; k++) {
    const x = 24.7 + k * 1.15, z = 45.75;
    bx(T1, X(x), Z(z), 0.45, 0.35, 0.45, 0x2c2f33); // still in the chair
    bx(T1, X(x), Z(z), 0.55, 0.85, 0.45, MEAT[k % 4], { y: 0.35, rz: ((k * 7) % 5 - 2) * 0.06 }); // the trunk, hunched to its screen
    P(T1, 'ico', X(x), Z(z + 0.08), 0.42, 0.4, 0.42, MEAT[(k + 1) % 4], { y: 1.15, c: 0 });
    P(T1, 'ico', X(x + ((k % 3) - 1) * 0.04), Z(z + 0.22), 0.36, 0.34, 0.24, 0xd8d0c0, { y: 1.22, c: 0 }); // its eye, swollen to the screen
    P(T1, 'ico', X(x + ((k % 3) - 1) * 0.04), Z(z + 0.265), 0.14, 0.14, 0.06, 0x15100e, { y: 1.26, c: 0 });
    P(T1, 'ico', X(x + 0.18), 62.7, 0.26, 0.12, 0.2, MEAT[(k + 2) % 4], { y: 0.76, c: 0 }); // its hand on the desk
    if (k < 8) bx(T1, X(x + 0.575), Z(z - 0.05), 1.95, 0.16, 0.14, MEAT[k % 4], { y: 0.75 + (k % 2) * 0.12, c: 0 }); // grown into the next
    const dx = (30.7 - x) * 2, dz = (40.1 - z) * 2, len = Math.hypot(dx, dz); // and into the back of the body
    bx(T1, X((x + 30.7) / 2), Z((z + 40.1) / 2), len, 0.16, 0.18, MEAT[k % 4], { y: 0.5 + (k % 3) * 0.1, ry: -Math.atan2(dz, dx), c: 0 });
  }
  /* a light that needs no power: pustules come up through the floor in the middle of the room, the colour of a healing
     burn, so from the hall there is always something behind the glass, lit from below */
  for (const [x, z, n] of [[29.6, 39.1, 3], [32, 39.4, 3], [29.4, 41.1, 3], [31.8, 41.6, 2]] as const) {
    for (let k = 0; k < n; k++) { const sz = 0.14 + ((k * 7) % 5) * 0.03; P(T1, 'ico', X(x + Math.cos(k * 2.3) * 0.12), Z(z + Math.sin(k * 2.3) * 0.1), sz, sz * 0.7, sz, [2.75, 2.36, 2.2], { y: -sz * 0.15, c: 0 }); }
    T1.lamps.push({ x: X(x), z: Z(z), r: 4.5, c: [0.5, 0.17, 0.1], h: 0.4 });
  }
  /* and two of the staff on their rounds of the hall */
  mut(D, 'husk', 31, 28); mut(D, 'husk', 67, 44);
  /* break-glass call points, one a zone, by its way out: the wing's by the checkpoint, the atrium's by the way south,
     the hall's at its west end by the electrical room and the range, Operations' in its corridor by the speaker */
  callPoint(D, 35, 2.75, 'n', 'wing'); callPoint(D, 71, 12, 'n', 'atrium'); callPoint(D, 22, 42, 'e', 'muster'); callPoint(D, 74, 21, 'e', 'ops');
  /* Security's alarm zones, room by room: an alarm locks down the doors of its zone (sim/eyes.ts). The hall's east bays
     are Operations', with their own breaker; the suite below, the shaft and Cargo are in none */
  const ZONES: Record<string, string> = {
    Checkpoint: 'wing', Lobby: 'wing', 'Lobby gallery': 'wing', 'Goods inward': 'wing', 'Surface landing': 'wing', 'Hazardous storage': 'wing', 'Security corridor': 'wing', "Nurses' station": 'wing', 'Briefing room': 'wing',
    'Locker room': 'wing', Infirmary: 'wing',
    Atrium: 'atrium', 'Security elevator': 'atrium', Gallery: 'atrium',
    'Muster hall': 'muster', 'Muster court': 'muster', 'Electrical room': 'muster', Armory: 'muster', 'Firing range': 'muster', 'Duty office': 'muster',
    'Operations corridor': 'ops', 'Office: operations': 'ops', 'Office: chief of security': 'ops', Maintenance: 'ops', 'Operations stair': 'ops',
  };
  for (const R of [...D.rooms, ...T1.rooms]) if (ZONES[R.name]) R.zone = R.name === 'Muster hall' && R.c === 'EAST' ? 'ops' : ZONES[R.name];
  /* the night round (world.md §8): one of the changed still walking the night shift's round, flashlight on. It begins on
     the nurses' station's balcony, looking down into the suite, and stays until something draws it (the opening: the
     other patient at the glass). Then, the one night it does so, down into the suite, at a purposeful walk: the other
     patient's door at the stair's foot, which its card opens, and the other patient, struck down where they hide and
     dragged out by an ankle into the hall, in sight of your window, and grafted there, and left; rooms 4 and 3 opened
     and searched, walked into and looked right round (not the washrooms); a while at your door before it opens it, and
     yours searched; and back up and out. After that its round is the wing, which is dark, and it walks it anyway, by its beam: along
     the corridor to the briefing room's reader and the cut, back past the nurses' station, and out round the lobby. Last
     of the cast but one, so the rest keep their places in it */
  const once = { need: 'ISO', once: true }, quick = { ...once, pace: 1.4 };
  mut(D, 'nightround', 51, -9.4, { yaw: PI, round: [
    { F: D, x: 51, z: -9.4, wait: 600, ...once }, { F: B, x: 54, z: -24, wait: 0.3, ...quick }, { F: B, x: 54.8, z: -23, tries: 1, ...quick },
    { F: B, x: 59.4, z: -22, wait: 1.2, take: true, ...quick }, { F: B, x: 54.6, z: -24, wait: 0.2, ...quick }, { F: B, x: 48.8, z: -19.2, graft: true, ...quick },
    { F: B, x: 49, z: -21.2, tries: 1, look: 0.5, ...quick }, { F: B, x: 50, z: -26, wait: 2.2, about: true, ...quick },
    { F: B, x: 43, z: -21.2, tries: 1, look: 0.5, ...quick }, { F: B, x: 44, z: -26, wait: 2.2, about: true, ...quick },
    { F: B, x: 42, z: -19, wait: 3, tries: 1, look: 0.5, ...quick }, { F: B, x: 37.2, z: -21.2, wait: 3, about: true, ...quick },
    { F: D, x: 53, z: -9.6, wait: 0.2, ...quick }, { F: D, x: 47, z: -2.8, wait: 0.5, ...quick },
    { F: D, x: 63, z: -2.8, tries: 1 }, { F: D, x: 64.4, z: -1.2, wait: 4 }, { F: D, x: 47, z: -3.2, wait: 3 },
    { F: D, x: 27, z: -7, wait: 2 }, { F: D, x: 16, z: -17, wait: 4 }, { F: D, x: 23, z: -24, wait: 3 }, { F: D, x: 34, z: -1, wait: 2 },
  ] });
  /* the other patient, at their window in room 2, and where they crouch to hide (under the sill). Listed after the night
     round, last of all */
  mut(D, 'patient', -10, -30, { at: { F: B, x: 58.8, z: -21}, yaw: -PI / 2, state: 'wait', hide: { F: B, x: 58.6, z: -21.1} });
  buildHub(B, D, T1, T2); // last: everything built before it keeps its place in the level's lists
  return finishLevel([37.2, -21, PI / 2], B); // in isolation room 1, by the bed, turned to the pump; the window behind you (arrivals and the plant stair are over it)
}

/* The lobby as the upper station's hub (world.md §8, *The lobby as a hub*): every way off it but the corridor's door
   and the grand stair is here. East, arrivals: the desk the lobby opens onto, and screening behind it, which opens onto
   the nurses' station. Below, the family's retreat: a stair down from the lobby's north-west corner to a lounge, its
   humidor and a pool, and a passage on to the isolation suite, the retreat's second way out. Over the wing at +5, a
   corridor from the lobby's gallery to the atrium's, the mess and administration off it, and the stair to the air
   plant, which climbs on into the space over the false sky. Behind the bar, the kitchen, and a passage round the back
   of the shaft to goods inward. All of it on the wing's feed, dark until the cut is mended, and in the wing's zone. */
function buildHub(B: Floor, D: Floor, T1: Floor, T2: Floor): void {
  const wing = { c: 'SEC', em: 1, zone: 'wing' };
  /* shelving with its goods in fixed places (shelf() draws them at random, and would move everything drawn after) */
  const rack = (Dk: Floor, x: number, z: number, w: number, d: number, cols: number[]) => {
    const ns = d > w, L = ns ? d : w;
    for (const y of [0.1, 0.55, 1, 1.45, 1.86]) bx(Dk, X(x), Z(z), w, 0.04, d, 0x4a4d50, { y, c: 0 });
    for (const s of [-1, 1]) bx(Dk, X(x + (ns ? 0 : (s * (L / 2 - 0.02)) / 2)), Z(z + (ns ? (s * (L / 2 - 0.02)) / 2 : 0)), ns ? w : 0.04, 1.9, ns ? 0.04 : d, 0x3a3d40, { c: 0 });
    [0.14, 0.59, 1.04, 1.49].forEach((y, b) => {
      for (let k = 0; k < 4; k++) {
        if ((k + b) % 3 === 0) continue;
        const t = (-L / 2 + 0.1 + ((L - 0.2) / 4) * (k + 0.5)) / 2, s = 0.22, deep = Math.min(0.24, (ns ? w : d) - 0.08);
        bx(Dk, X(x + (ns ? 0 : t)), Z(z + (ns ? t : 0)), ns ? deep : s, 0.16 + ((k * 3 + b) % 4) * 0.04, ns ? s : deep, cols[(k + b) % cols.length], { y, c: 0, goods: true });
      }
    });
    colT(Dk, X(x), Z(z), w, d, 1.9);
  };
  const seat = (Dk: Floor, x: number, z: number, c: number) => { bx(Dk, X(x), Z(z), 0.45, 0.45, 0.45, c); };
  /* a screen on a desk, facing west or north (s -1) or east or south (s 1), lit with the wing */
  const screen = (Dk: Floor, x: number, z: number, y: number, ew: boolean, s = -1) => {
    bx(Dk, X(x), Z(z), ew ? 0.06 : 0.5, 0.34, ew ? 0.5 : 0.06, 0x22262a, { y, c: 0 });
    bx(Dk, X(x + (ew ? s * 0.02 : 0)), Z(z + (ew ? 0 : s * 0.02)), ew ? 0.02 : 0.44, 0.28, ew ? 0.44 : 0.02, [0.04, 0.05, 0.05], { y: y + 0.03, c: 0, pw: [[0.04, 0.05, 0.05], [2.2, 2.75, 2.5]], pc: 'SEC' });
  };
  const planter = (Dk: Floor, x: number, z: number) => {
    bx(Dk, X(x), Z(z), 1.2, 0.8, 1.2, 0x6e6a62);
    for (let k = 0; k < 4; k++) P(Dk, 'ico', X(x + Math.cos(k * 1.7) * 0.15), Z(z + Math.sin(k * 1.7) * 0.15), 0.2, 0.9 + k * 0.2, 0.2, 0x5a4a2e, { y: 0.8, c: 0 });
  };

  /* Arrivals. The lobby's east wall opens on the desk where crews on rotation and visitors checked in: the customer's
     side of the station, its finish already less than the lobby's (carpet and paint, not stone). Behind the desk, the
     door to screening, where everyone arriving or leaving was looked over for exposure; it opens onto the nurses'
     station, which is why the isolation suite is a stair from the front door */
  const CK: RoomOpts = { ...OFF, ...wing, ht: 4, fl: 0x6a6258, wl: 0xa39a8a, st: 0x7a5a30, lc: [0.92, 0.86, 0.74], mat: { floor: 'carpet', wall: 'plaster', ceiling: 'tiles' } };
  room(D, 'Check-in hall', 32, -28, 9.5, 8.75, CK); room(D, 'Check-in hall', 30, -26, 2, 4, { ...CK, mat: FAM.mat }); // the opening, in the lobby's stone
  bx(D, 35.2, -24.2, 0.7, 1.05, 5.6, 0x8a8070, { mat: 'stone' }); bx(D, 35.2, -24.2, 0.8, 0.05, 5.7, 0x3a3026, { y: 1.05, c: 0 }); // the desk, facing the lobby
  for (const z of [2.2, 3.6]) { screen(D, 22.72, z, 1.1, true, 1); seat(D, 23.3, z, 0x2c2f33); } // the staff's side, east
  bx(D, 35.24, -24.2, 0.3, 0.18, 0.26, 0xb8bcc0, { y: 1.1, c: 0 }); // the badge printer
  for (const z of [1.8, 2.6, 3.4, 4.2]) P(D, 'cyl', 33.1, Z(z), 0.06, 0.95, 0.06, 0x8a7a4a); // the queue's posts, their tape gone
  bx(D, 41.1, -24.2, 0.5, 0.9, 5.6, 0x5a5048); bx(D, 41.49, -24.2, 0.02, 0.9, 2.4, 0xd8d4c4, { y: 1.3, c: 0 }); // cabinets, and the rotation board over them
  item(D, 'batt', 41.1, -25.8, 0.9);
  door(D, 37, -19, { sg: [['Screening', 'n']] });
  room(D, 'Screening', 32, -18.75, 9.5, 4.75, { ...MED, ...wing }); // it and the hall short of the isolation hall's top, a wall between door(D, 39, -13, { sg: [['Isolation', 'n'], ['Screening', 's']] });
  for (const x of [21.8, 25.2]) { bx(D, X(x), -17, 2, 0.7, 0.8, 0xb8c4bd); bx(D, X(x - 0.35), -17, 0.5, 0.08, 0.6, 0xe2e2da, { y: 0.7, c: 0 }); } // couches, a pillow on each
  desk(D, 36.2, -14.9, 1.2, 0.6, { bare: 1 }); screen(D, 23.1, 7.68, 0.76, false); seat(D, 23.1, 7.0, 0x2c2f33);
  item(D, 'bandage', 35.76, -14.9, 0.76);

  /* The retreat, a storey under the lobby: the family's, and their buyers'. A stair down from the lobby's north-west
     corner, behind glass and planting, to a lounge panelled in wood (the family's indulgence: nothing else down here
     burns), with a window that is a lit panel; off it the humidor, glazed, where the product line was sampled; through
     the passage, a pool cut into the limestone; and the plant room that serves them. The passage goes on to the
     isolation suite: the retreat's second way out, as fire code wants of a room below ground, and the family's private
     door to their clinic. A plain door for now, on the wing's dead feed, slid by hand from either side */
  /* one flight two tiles wide, stone like the grand stair, its lounge side a balustrade that rises with it to the lobby's
     floor, where the glass takes over */
  for (const k of [1, 2]) stairs(B, D, X(k), -24, 2, 10, 's', true);
  for (let q = 0, N = 20; q < N; q++) {
    const sh = ((q + 1) / N) * 4.5, z = 3 + ((q + 0.5) / N) * 5, d = 10 / N; // 10 m of stair, 4.5 m of rise
    bx(B, -6.16, Z(z), 3.68, sh, d, q % 2 ? 0xb3ab9c : 0xa9a192, { c: 0, flush: true });
    bx(B, -4.16, Z(z), 0.32, Math.min(sh + 1.05, 4.5), d, 0x8f877a, { flush: true });
  }
  const GL: Colour = [0.55, 0.66, 0.7];
  for (const [x, z, sx, sz] of [[3.03, 5.5, 0.06, 10], [2, 2.97, 4, 0.06]] as const) {
    bx(D, X(x), Z(z), sx, 1, sz, GL, { mat: 'glass' }); bx(D, X(x), Z(z), sx > 1 ? sx : 0.07, 0.07, sz > 1 ? sz : 0.07, 0x5e4424, { y: 1, c: 0, mat: 'steel' });
  }
  planter(D, 3.7, 4.2); planter(D, 3.7, 6.2);
  const RL: RoomOpts = { ...wing, ht: 3.8, fl: 0x3e342a, wl: 0x5a4030, st: 0x7a5a30, lc: [0.95, 0.78, 0.55], mat: { floor: 'stone', wall: 'wood', ceiling: 'plaster' } };
  room(B, 'Retreat lounge', -4, -28, 14, 16, RL); room(B, 'Retreat lounge', -8, -28, 4, 2, RL);
  room(B, 'Retreat lounge', -8, -26, 4, 12, { ...RL, ht: 4.5, nolamp: 1 }); // the stairwell, open to the lobby over it
  for (const z of [3.2, 6.4]) {
    bx(B, 2.4, Z(z), 1.6, 0.4, 0.9, 0x2a2420);
    for (const s of [-1, 1]) { bx(B, 2.4, Z(z + s * 0.9), 2.6, 0.45, 0.85, 0x6a3a2a); bx(B, 2.4, Z(z + s * 1.16), 2.6, 0.9, 0.22, 0x5a3024, { c: 0 }); }
    bx(B, 5.2, Z(z), 0.85, 0.45, 0.85, 0x6a3a2a); bx(B, 5.72, Z(z), 0.22, 0.9, 0.85, 0x5a3024, { c: 0 });
  }
  bx(B, 2.4, -27.7, 3, 0.85, 0.5, 0x4a3226); for (const x of [5.9, 6.1, 6.6]) P(B, 'cyl', X(x), -27.7, 0.1, 0.28, 0.1, 0x6a4a2a, { y: 0.85, c: 0 }); // the sideboard, its decanters
  item(B, 'peaches', 1, -27.7, 0.85);
  bx(B, 2, -12.03, 6, 1.6, 0.03, [0.06, 0.06, 0.07], { y: 0.8, c: 0, pw: [[0.06, 0.06, 0.07], [2.75, 2.82, 2.92]], pc: 'SEC' }); // the window: a lit panel of sky
  for (const x of [4.515, 5.5, 6.5, 7.485]) bx(B, X(x), -12.07, 0.06, 1.6, 0.02, 0x3a2c22, { y: 0.8, c: 0 }); // its frame and mullions
  for (const y of [0.8, 2.34]) bx(B, 2, -12.07, 6, 0.06, 0.02, 0x3a2c22, { y, c: 0 });
  room(B, 'Retreat lounge', 10, -28, 0.75, 8, { ...RL, part: 1 });
  room(B, 'Humidor', 11.25, -28, 4.75, 8, { ...wing, ht: 3, fl: 0x4a3426, wl: 0x8a5a3a, st: 0x5a3a24, lc: [0.95, 0.8, 0.6], mat: { floor: 'wood', wall: 'wood', ceiling: 'wood' } });
  door(B, 11, -24.6, { sg: [['Humidor', 'w']] }); for (const z of [1, 3, 4]) door(B, 11, Z(z) + 1, { span: 2, glass: true, glaze: 'full' });
  for (const z of [2, 4]) rack(B, 12.75, z, 0.5, 2.6, [0x7a4a2a, 0x8a6a3a, 0x6a3a24, 0xa08a4a]);
  /* the trial lots have taken: leaf out of the cedar, in shelves, as it comes out of the changed */
  for (const [z, y] of [[1.7, 1.04], [2.3, 0.59], [3.8, 1.49], [4.4, 0.14]]) P(B, 'ico', 15.4, Z(z), 0.36, 0.22, 0.3, 0x8a8a3a, { y, c: 0 });
  tbl(B, 13.2, -24, 0.9, 1.6, 0x5a3e2a); bx(B, 13.2, -24.4, 0.25, 0.06, 0.18, 0x7a4a2a, { y: 0.76, c: 0 }); bx(B, 13.1, -23.6, 0.22, 0.05, 0.16, 0x8a6a3a, { y: 0.76, c: 0 });
  const PH: RoomOpts = { ...wing, ht: 4, fl: 0x9a968a, wl: 0x6a8a88, st: 0x3f6a6a, lc: [0.8, 0.9, 0.95], mat: { floor: 'stone', wall: 'glazed', ceiling: 'plaster' } };
  room(B, 'Pool hall', 18, -28, 14, 16, PH);
  room(B, 'Pool', 20, -26, 10, 10, { ...PH, dy: -1.5, ht: 5.5, fl: 0x4a8a9a, wl: 0x3a7a8a, mat: { floor: 'glazed', wall: 'glazed', ceiling: 'plaster' }, nolamp: 1 });
  flight(B, 20, -20, 4, 4, -1.5, 0, 's', 6, 0x9a968a); // steps down into it at the shallow end
  B.water.push([20, -26, 30, -16, -0.25]); // chest deep: you wade it
  for (const z of [3, 4.5]) for (const x of [15.0075, 19.9925]) bx(B, X(x), Z(z), 0.03, 0.18, 0.3, [0.1, 0.12, 0.12], { y: 0.5, c: 0, pw: [[0.1, 0.12, 0.12], [2.1, 2.6, 2.9]], pc: 'SEC' }); // its lights, under the water
  for (const z of [2.5, 4.2, 5.9]) bx(B, 30.9, Z(z), 0.7, 0.35, 1.9, 0xd8d4c4); // loungers
  planter(B, 14.5, 1.7); planter(B, 14.5, 7.4);
  room(B, 'Retreat plant', -8, -10, 14, 4, { ...UTIL, ...wing, noroam: 1 }); door(B, 7, -9, { sg: [['Plant room', 'e']] });
  bx(B, -6.9, -8, 2, 1.8, 2.6, 0x6b6e70, { mat: 'steel' }); // the air handler against the wall, and the smoke extract's fan
  for (const x of [4.4, 5.6]) P(B, 'cyl', X(x), -9.2, 1, 1.8, 1, 0x8a8a84, { mat: 'steel' }); // the pool's filters
  for (const x of [4.2, 5.2]) P(B, 'cyl', X(x), -7.2, 0.7, 0.7, 0.7, 0x3d5a44, { mat: 'steel' }); // its pumps
  bx(B, 4, -6.9, 1.6, 0.9, 0.7, 0x5a5048); item(B, 'adjwrench', 4, -6.9, 0.9);
  const PS: RoomOpts = { ...wing, ht: 3, fl: 0x5a5d5a, wl: 0x8a8e88, st: 0x3f7f6b, mat: { floor: 'vinyl', wall: 'plaster' } };
  room(B, 'Retreat passage', 8, -10, 32, 4, PS);
  door(B, 9.4, -11, { sg: [['Pool', 'n'], ['Lounge', 's']] }); door(B, 25, -11, { sg: [['Pool', 's']] });
  door(B, 41, -8.6, { c: 'SEC', sg: [['Isolation', 'w'], ['Private', 'e']] }); exitSign(B, 39.975, -9, 2.5, 'w'); // the fire exit, lit on its own battery

  /* Over the wing, at +5: the floor world.md has long asked for. A corridor from the lobby's gallery to the atrium's,
     so the wing can be gone round upstairs; off it the mess and the station's administration, and the stair up to the
     plant that keeps the lobby's air */
  const UC: RoomOpts = { ...SEC, ...wing, ht: 3.5, mat: SKIM(SEC) };
  /* a wall between it and the lobby's air, but where it meets the gallery */
  room(T1, 'Upper corridor', 30.5, -12, 3.5, 10, UC); room(T1, 'Upper corridor', 30, -6, 0.5, 4, { ...UC, part: 1 }); room(T1, 'Upper corridor', 34, -12, 34, 4, UC);
  const PL: RoomOpts = { ...UTIL, ...wing, ht: 3.5, noroam: 1 };
  room(T1, 'Plant stair', 32, -26, 8, 12, PL); room(T1, 'Plant stair', 40, -26, 2, 12, { ...PL, ht: 7.5 }); // the stairwell, up to the plant
  door(T1, 35, -13, { sg: [['Plant room', 's']] }); stairs(T1, T2, 40, -26, 2, 10, 'n');
  bx(T1, 33.2, -24.8, 1, 3.4, 1, 0x6b6e70, { mat: 'steel' }); // the lobby's air, in its riser
  room(T1, 'Staff mess', 44, -26, 10, 12, { ...OFF, ...wing, mat: { floor: 'vinyl', wall: 'plaster', ceiling: 'tiles' } }); door(T1, 47.4, -13, { sg: [['Mess', 's']] });
  for (const x of [28.2, 30.4]) for (const z of [4.2, 6.2]) { tbl(T1, X(x), Z(z), 1.6, 0.8, 0x8a8e8c); for (const s of [-1, 1]) seat(T1, x, z + s * 0.45, 0x3a3d40); }
  bx(T1, 47, -25.6, 4, 0.9, 0.6, 0x8a8e8c); bx(T1, 53, -25.5, 0.8, 1.9, 0.7, 0xb8bcc0); P(T1, 'cyl', 45.4, -25.6, 0.16, 0.24, 0.16, 0x2a2c2e, { y: 0.9, c: 0 }); // the counter, the fridge, a kettle
  item(T1, 'ration', 46.4, -25.6, 0.9);
  room(T1, 'Administration', 56, -26, 10, 12, { ...OFF, ...wing }); door(T1, 61.4, -13, { sg: [['Administration', 's']] });
  for (const x of [34.5, 36.5]) for (const z of [3.5, 5.8]) { desk(T1, X(x), Z(z), 1.4, 0.7, { bare: 1 }); screen(T1, x, z + 0.1, 0.76, false); seat(T1, x, z - 0.45, 0x2c2f33); }
  for (const z of [3, 4, 5]) bx(T1, 65.5, Z(z), 0.5, 1.3, 0.5, 0x5f6266); // filing
  /* the air plant, at +10, and the space over the false sky: half a metre over the lobby's roof, a dark plenum of
     grating between the backs of the ceiling's light boxes. Steps up into it from the plant, the whole length of the
     room (any steeper and nothing that walks could follow you up) */
  room(T2, 'Air plant', 32, -30, 10, 4, { ...UTIL, ...wing, ht: 6, noroam: 1 });
  flight(T2, 32, -30, 8, 4, 0, 3.5, 'w', 16);
  bx(T2, 41, -29.2, 0.9, 2.2, 0.7, 0x6b6e70, { mat: 'steel' });
  const SV: RoomOpts = { ...wing, em: 0, air: 1, dy: 3.5, ht: 2.4, noroam: 1, fl: 0x4a4c4e, wl: 0x4a4640, st: 0x4a4640, mat: { floor: 'grating', wall: 'shot', ceiling: 'shot' } };
  room(T2, 'Sky void', -8, -28, 38, 24, SV); room(T2, 'Sky void', 30, -28, 2, 2, SV);
  for (const x of [2.5, 5.5, 8.5, 11.5, 14.5, 17.5]) for (const z of [2.5, 5.5, 8.5, 11.5]) {
    bx(T2, X(x), Z(z), 2.8, 0.4, 2.8, 0x3a3c3e); bx(T2, X(x), Z(z), 2.6, 0.02, 2.6, 0x8a8e8c, { y: 0.4, c: 0 }); // a light box's back, its access panel
  }

  /* Behind the bar: the kitchen that served it and the lounges, and a passage round the back of the shaft to goods
     inward, so that stock never crossed the lobby */
  room(D, 'Kitchen', -8, -2, 6, 12, { ...wing, fl: 0x6a6e6a, wl: 0xb8bcb4, st: 0x8c2f24, mat: { floor: 'epoxy', wall: 'glazed', ceiling: 'tiles' } });
  door(D, -7, -3, { sg: [['Staff only', 'n']] });
  bx(D, -7.6, 4, 0.6, 0.9, 10, 0x8a8e8c, { mat: 'steel' }); bx(D, -7.6, 0.4, 0.56, 0.02, 0.9, 0x1d1f21, { y: 0.9, c: 0 }); // the counter, and its hob
  rack(D, 3.75, 16, 0.5, 3, [0x8a8e8c, 0x6b5a3c, 0x4d5a66, 0x7a4a34]); bx(D, -3.4, 8.8, 0.8, 0.6, 0.8, 0x6b5a3c);
  item(D, 'ration', -7.6, 7.2, 0.9, 2); item(D, 'peaches', -7.6, 6, 0.9);
  room(D, 'Service passage', -2, 6, 14, 4, { ...UTIL, ...wing }); door(D, 13, 7, { sg: [['Goods inward', 'w']] });
  bx(D, 2, 8.8, 0.8, 1.6, 0.7, 0x6b6e70, { mat: 'steel' }); // a roll cage, empty
}

/* the Cargo cavern: a 20 m vault, x 110 to 240, with three tiers stepped up its north side at +5, +10 and +15 and a platform
   between each. Dead and black until its backup set runs, which also moves the platforms, and wakes the nest that thickens
   toward the roof. East of it, the link to the exhaust shaft and ladderway B under the sealed fan door. */
function buildCargo(D: Floor, T1: Floor, T2: Floor, T3: Floor): void {
  const cav = cave(D, 'Cargo cavern', 110, -14, 130, 28, { ...BAY, ht: 20, c: 'CARGO', lit: 'main', em: 1, motes: 'flesh' }); arch(D, cav, 5); roughen(D, cav, 0, 1.2);
  const TW: RoomOpts = { ...WALK, ht: 5, c: 'CARGO', motes: 'flesh', mat: { wall: 'shot', ceiling: 'shot' } };
  room(T1, 'Tier 1', 126, -14, 96, 10, TW); room(T2, 'Tier 2', 134, -14, 78, 10, TW); room(T3, 'Tier 3', 142, -14, 50, 10, TW);
  elev(D, T1, 130, -8, 4, 4, 'CARGO', 'Cargo platform'); elev(T1, T2, 138, -8, 4, 4, 'CARGO', 'Cargo platform'); elev(T2, T3, 146, -8, 4, 4, 'CARGO', 'Cargo platform');
  /* the gantry crane, on rails along both walls */
  for (const z of [8.2, 21.8]) bx(D, 175, Z(z), 128, 0.5, 0.4, 0x5a5d60, { y: 17.4, c: 0 });
  bx(D, 170, 0, 1, 0.8, 27.4, 0xc9a227, { y: 17.6, c: 0 }); bx(D, 170, 3, 1.4, 0.6, 1.4, 0x2a2c2e, { y: 17, c: 0 }); bx(D, 170, 3, 0.05, 8.6, 0.05, 0x2a2c2e, { y: 8.4, c: 0 }); bx(D, 170, 3, 0.5, 0.4, 0.5, 0x8a7a2a, { y: 8, c: 0 });
  /* the floor: receiving at the west end, containers and forklifts, the nest at the east end */
  blood(D, 118, 2, 1.4);
  container(D, 134, 10, false, 2); container(D, 150, 10, false, 3); container(D, 180, 10.4, false, 2); container(D, 198, 8.8, true, 1); container(D, 158, -10, false, 1); container(D, 186, -10.8, false, 1);
  container(D, 166, 4.8, true, 2); container(D, 210, 5.2, true, 3); forklift(D, 142, 3, true); forklift(D, 192, 3.6, false);
  mut(D, 'husk', 150, -0.8); mut(D, 'husk', 182, 0.8);
  for (const [x, z, n] of [[114, 12, 4], [117, 18, 5], [119, 10, 3], [121, 15, 5], [123, 20, 4], [116, 14.6, 3]]) eggs(D, X(x), Z(z), n); gore(D, 226, 1, 4); blood(D, 230, -4, 2);
  mut(D, 'worm', 224, 2); mut(D, 'worm', 226, 4); mut(D, 'worm', 223, 4.8); mut(D, 'skitter', 232, -6); mut(D, 'husk', 214, 8, { post: 1, yaw: -PI / 2 });
  /* the tiers: thicker with every one */
  container(T1, 174, -10.8, false, 1); for (const [x, z] of [[85, 10], [99, 9], [108, 11]]) eggs(T1, X(x), Z(z), 4); mut(T1, 'skitter', 166, -8); mut(T1, 'skitter', 198, -10);
  for (const [x, z] of [[76, 9], [84, 11], [90, 9], [96, 10.6], [103, 9.4], [108, 10]]) eggs(T2, X(x), Z(z), 5); gore(T2, 176, -10, 4); mut(T2, 'skitter', 162, -10); mut(T2, 'skitter', 184, -8); mut(T2, 'skitter', 200, -10.8);
  mut(T2, 'grabber', 170, -13.76, { yaw: 0 });
  for (const [x, z] of [[77, 9], [80.6, 11], [83, 9.4], [86, 10.8], [89, 9], [92, 11], [95, 9.6], [98, 10.6]]) eggs(T3, X(x), Z(z), 6); gore(T3, 166, -10, 5); gore(T3, 178, -10.8, 4);
  mut(T3, 'skitter', 154, -10); mut(T3, 'skitter', 170, -7.2); mut(T3, 'skitter', 184, -12);
  /* the nest's own light: pustules among the eggs that glow a sick red, enough to be seen across the bay in the dark; and
     its edge, creeping west over the floor toward the door, below Cargo control's window */
  for (const [x, z, n] of [[66, 19.5, 3], [70, 17.8, 4], [73.5, 19.6, 5], [77, 18.2, 4]] as const) eggs(D, X(x), Z(z), n);
  for (const [Dk, x, z] of [[D, 66.6, 19.2], [D, 70.5, 18], [D, 74, 19.4], [T1, 85, 10], [T2, 84, 11], [T2, 90, 9], [T3, 80.6, 11], [T3, 86, 10.8], [T3, 92, 11]] as const) {
    for (let k = 0; k < 5; k++) P(Dk, 'ico', X(x + (k - 2) * 0.22), Z(z + ((k * 7) % 3 - 1) * 0.25), 0.38, 0.3, 0.38, [2.6, 0.9, 0.55], { y: k % 2 ? 0 : -0.08, c: 0 });
    Dk.lamps.push({ x: X(x), z: Z(z), r: 5.5, c: [0.55, 0.18, 0.1], h: 0.5 });
  } bx(T3, 182, -11.2, 1.1, 0.6, 1.1, 0x6b5a3c); item(T3, 'fuse', 182, -11.2, 0.6); item(T3, 'batt', 180, -9.2, 0.02, 2);
  /* south of the floor: the cargo office, with the backup set, and the vehicle bay */
  room(D, 'Cargo office', 114, 16, 8, 8, { ...OFF, c: 'CARGO' }); door(D, 117.4, 15, { sg: [['Cargo office', 'n']] });
  desk(D, 116.8, 22.6, 1.8, 0.7); note(D, 'manifest', 116.2, 22.5, 0.78); item(D, 'batt', 117.5, 22.6, 0.78); genset(D, 'CARGO', 120.6, 17.4, 119.4, 18.6); item(D, 'bandage', 114.8, 17, 0.02);
  room(D, 'Vehicle bay', 126, 16, 12, 8, { ...UTIL, c: 'CARGO' }); door(D, 131, 15, { sg: [['Vehicles', 'n']] });
  forklift(D, 128, 20.6, true); forklift(D, 134.8, 20.4, true); item(D, 'batt', 136.8, 17, 0.02); item(D, 'pipe', 132, 23.2, 0.02);
  /* east: the link to the exhaust shaft, and the top of ladderway B */
  door(D, 241, -1, { sg: [['Exhaust shaft', 'w']] }); room(D, 'Exhaust link', 242, -2, 12, 4, { ...UTIL, c: 'CARGO', em: 1 }); mut(D, 'grabber', 247, -1.76, { yaw: 0 });
  door(D, 255, -1, { sg: [['Fan station', 'w']] }); room(D, 'Fan station', 256, -6, 10, 12, { ...UTIL, c: 'CARGO', ht: 6, em: 1 });
  P(D, 'cyl', 261.2, -0.8, 4.4, 0.8, 4.4, 0x3b4046, { y: 5.2, c: 0 }); for (let k = 0; k < 4; k++) bx(D, 261.2, -0.8, 4, 0.06, 0.5, 0x5a5d60, { y: 5.14, c: 0, ry: (k * PI) / 4 }); // the fan, in the ceiling
  ladder(D, 'B1', 263.2, 3.2, 261.2, 2.8, PI / 2, false);
}

