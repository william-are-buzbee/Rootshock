/* What things are made of (engine.md §15). One table that the sound, the look and the sim all read, so 'steel' means the
   same thing to each of them. Plain data: nothing here knows about three.js or the page.

   A property goes in only when something reads it. For now that is the voice a foot comes down with; how a material
   takes the flashlight, how it rings when struck, and what it does when pried, cut or wetted come in as they are built. */

export type Mat = 'concrete' | 'paving' | 'grating' | 'steel' | 'rock' | 'wood' | 'glass';

/** the voice a foot or a body coming down on it makes (present/audio.ts) */
export type Tread = 'concrete' | 'metal' | 'rock' | 'wood';

export interface MatDef {
  /** what it is, in a word or two */
  n: string;
  tread: Tread;
}

export const MATS: Record<Mat, MatDef> = {
  concrete: { n: 'Concrete', tread: 'concrete' },
  /** the Commons' street: flags laid on the cavern floor, gritty underfoot */
  paving: { n: 'Paving', tread: 'rock' },
  /** a walkway's open steel mesh: it rings */
  grating: { n: 'Steel grating', tread: 'metal' },
  /** plate and section: a platform's deck, a door's slab */
  steel: { n: 'Steel', tread: 'metal' },
  rock: { n: 'Rock', tread: 'rock' },
  /** a crate's boards: hollow */
  wood: { n: 'Wood', tread: 'wood' },
  /** a window's sealed pane: nothing stands on one, but it is hard and dull if anything did */
  glass: { n: 'Glass', tread: 'concrete' },
};

/** what a room's floor, walls and ceiling are */
export interface RoomMats { floor: Mat; wall: Mat; ceiling: Mat }

/** the usual rooms: fitted ones are concrete; a walkway is grating over open air; a cave is rock all round; the
 *  Commons' street is paved, between the blocks' fronts, under rock painted as sky */
export const FITTED: RoomMats = { floor: 'concrete', wall: 'concrete', ceiling: 'concrete' };
export const WALKWAY: RoomMats = { floor: 'grating', wall: 'concrete', ceiling: 'concrete' };
export const CAVERN: RoomMats = { floor: 'rock', wall: 'rock', ceiling: 'rock' };
export const STREET: RoomMats = { floor: 'paving', wall: 'concrete', ceiling: 'rock' };
