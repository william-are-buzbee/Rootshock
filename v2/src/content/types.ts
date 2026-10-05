import type { Colour } from '../core/math';

/* A level as data. Builders in content/build produce it; world/compile turns it into a World.
   All positions are plan metres in the station's frame: x east, z south, y up from the surface. */

export interface RoomDef {
  id: number;
  name: string;
  /** the open volume: floor at y0, ceiling at y0 + ht */
  x0: number; z0: number; x1: number; z1: number;
  y0: number; ht: number;
  floor: Colour; wall: Colour; stripe: Colour;
  /** the room's own light, already scaled by whether it is powered */
  light: Colour;
}

/** solid built back into open space: a platform, a step, a plinth. Part of the world, not a prop. */
export interface BlockDef {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
  colour: Colour;
}

/** an invisible solid: one box around furniture that is drawn as many parts */
export interface ColliderDef {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
}

export type Shape = 'box' | 'cyl' | 'ico';

/** a thing standing in a room. (x, z) is its centre, y its base */
export interface PropDef {
  shape: Shape;
  x: number; y: number; z: number;
  sx: number; sy: number; sz: number;
  ry: number; rz: number;
  colour: Colour;
  /** multiplies the light it receives: fittings that should read as lit */
  glow: number;
  /** blocks bodies (an axis-aligned box around it) */
  solid: boolean;
}

export interface Start { x: number; y: number; z: number; yaw: number }

export interface LevelDef {
  id: string;
  name: string;
  seed: string;
  rooms: RoomDef[];
  blocks: BlockDef[];
  props: PropDef[];
  colliders: ColliderDef[];
  start: Start;
}
