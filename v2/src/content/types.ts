import type { Colour } from '../core/math';

/* A level as data. Builders in content/build produce it; world/compile turns it into a World.
   All positions are plan metres in the station's frame: x east, z south, y up from the surface. */

export interface RoomDef {
  id: number;
  name: string;
  /** rock, not building: plain walls, no dado or stripe */
  cave: boolean;
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
  /** can be pushed and knocked about (a crate); otherwise it never moves */
  loose: boolean;
}

/** a sloped or uneven surface: a ramp, a cave's floor or ceiling. Heights are given on a lattice of `res` metres
 *  (nx by nz corners, row by row from (x0, z0)) and blended between. A floor is solid from `base` up to it;
 *  a ceiling is solid from it up to `base`. */
export interface SurfaceDef {
  kind: 'floor' | 'ceiling';
  x0: number; z0: number; x1: number; z1: number;
  res: number; nx: number; nz: number;
  h: number[];
  base: number;
  colour: Colour;
  /** draw its edges down to the base (a ramp standing in a room); off where walls already hide them (a cave floor) */
  sides: boolean;
}

/** standing water: a level over a rectangle */
export interface WaterDef {
  x0: number; z0: number; x1: number; z1: number;
  level: number;
}

/** a door: a slab that fills a doorway and slides up into the lintel when something comes near */
export interface DoorDef {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
}

/** a platform that carries what stands on it between two heights. Its top is at y0 or y1. */
export interface PlatformDef {
  x0: number; z0: number; x1: number; z1: number;
  y0: number; y1: number;
  colour: Colour;
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
  surfaces: SurfaceDef[];
  water: WaterDef[];
  doors: DoorDef[];
  platforms: PlatformDef[];
  start: Start;
}
