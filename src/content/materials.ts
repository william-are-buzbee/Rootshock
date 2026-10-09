/* What things are made of (engine.md §15). One table that the sound, the look and the sim all read, so 'steel' means the
   same thing to each of them. Plain data: nothing here knows about three.js or the page.

   A property goes in only when something reads it: the voice a foot comes down with (present/audio.ts), and how the
   material takes the light (present/render/shader.ts). How it rings when struck, and what it does when pried, cut or
   wetted, come in as they are built. */

export type Mat =
  | 'concrete' | 'block' | 'plaster' | 'tiles' | 'glazed' | 'paving'
  | 'grating' | 'steel' | 'rock' | 'wood' | 'glass';

/** the voice a foot or a body coming down on it makes (present/audio.ts) */
export type Tread = 'concrete' | 'metal' | 'rock' | 'wood';

/** what is drawn on it, from where it is in the world (render/shader.ts): poured concrete's blotches and formwork, a
 *  wall of painted block, smooth paint, a suspended ceiling's tiles, glazed tile, paving flags, steel plate with its
 *  seams, an open steel mesh, raw rock, boards; or nothing */
export type Pattern = 'none' | 'cast' | 'block' | 'plaster' | 'tiles' | 'glazed' | 'flags' | 'plate' | 'mesh' | 'rock' | 'boards';

/** how it takes the light. The flashlight's highlight on it: how bright (gloss, 0..1) and how tight (a broad sheen at
 *  8, a pin of light at 80), and how much it takes the material's own colour (metal 1: steel shines as steel; paint
 *  0: a white glint). How rough it is to light raking across it (bump, 0..1), and how much it shows the station's
 *  wear (grime at the foot of a wall, water run down from the ceiling): none on raw rock. */
export interface Look { pattern: Pattern; gloss: number; tight: number; metal: number; bump: number; wear: number }

export interface MatDef {
  /** what it is, in a word or two */
  n: string;
  tread: Tread;
  look: Look;
}

const look = (pattern: Pattern, gloss: number, tight: number, metal: number, bump: number, wear = 1): Look => ({ pattern, gloss, tight, metal, bump, wear });

export const MATS: Record<Mat, MatDef> = {
  /** poured: blotched, with the formwork's seams and tie holes on walls and ceilings */
  concrete: { n: 'Concrete', tread: 'concrete', look: look('cast', 0.04, 8, 0, 0.35) },
  /** concrete block, painted: courses and mortar, a little sheen to the paint */
  block: { n: 'Painted block', tread: 'concrete', look: look('block', 0.12, 14, 0, 0.5) },
  /** smooth painted plaster: an eggshell sheen and almost nothing else */
  plaster: { n: 'Painted plaster', tread: 'concrete', look: look('plaster', 0.2, 12, 0, 0.12) },
  /** a suspended ceiling: mineral tiles, pitted, in a grid of painted T-bar */
  tiles: { n: 'Ceiling tiles', tread: 'concrete', look: look('tiles', 0.03, 8, 0, 0.3) },
  /** glazed ceramic wall tile: glassy, in a grid of grout */
  glazed: { n: 'Glazed tile', tread: 'concrete', look: look('glazed', 0.75, 70, 0, 0.25) },
  /** the Commons' street: flags laid on the cavern floor, gritty underfoot */
  paving: { n: 'Paving', tread: 'rock', look: look('flags', 0.03, 8, 0, 0.45) },
  /** a walkway's open steel mesh: it rings */
  grating: { n: 'Steel grating', tread: 'metal', look: look('mesh', 0.45, 40, 0.8, 0) },
  /** plate and section: a platform's deck, a door's slab, a container's skin */
  steel: { n: 'Steel', tread: 'metal', look: look('plate', 0.45, 50, 0.85, 0.2) },
  rock: { n: 'Rock', tread: 'rock', look: look('rock', 0.05, 14, 0, 1, 0) },
  /** a crate's boards: hollow */
  wood: { n: 'Wood', tread: 'wood', look: look('boards', 0.08, 10, 0, 0.3) },
  /** a window's sealed pane: nothing stands on one, but it is hard and dull if anything did */
  glass: { n: 'Glass', tread: 'concrete', look: look('none', 1, 120, 0, 0, 0) },
};

/** every material in a fixed order: the renderer numbers them from 1 by it (0 is a thing that says nothing of itself) */
export const MAT_ORDER = Object.keys(MATS) as Mat[];

/** what a room's floor, walls and ceiling are */
export interface RoomMats { floor: Mat; wall: Mat; ceiling: Mat }

/** the usual rooms: fitted ones are concrete; a walkway is grating over open air; a cave is rock all round; the
 *  Commons' street is paved, between the blocks' plastered fronts, under rock painted as sky. A doorway is its steel
 *  frame. */
export const FITTED: RoomMats = { floor: 'concrete', wall: 'concrete', ceiling: 'concrete' };
export const WALKWAY: RoomMats = { floor: 'grating', wall: 'concrete', ceiling: 'concrete' };
export const CAVERN: RoomMats = { floor: 'rock', wall: 'rock', ceiling: 'rock' };
export const STREET: RoomMats = { floor: 'paving', wall: 'plaster', ceiling: 'rock' };
export const DOORWAY: RoomMats = { floor: 'concrete', wall: 'steel', ceiling: 'steel' };
