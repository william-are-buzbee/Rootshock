import type { Colour } from '../core/math';

/* A level as data. Builders in content/build produce it; world/compile turns it into a World.
   All positions are plan metres in the station's frame: x east, z south, y up from the surface. */

/** how a room is lit. 'main': by its circuit (full power: lc; backup: lc dimmed, if it has emergency lights; else dark).
 *  'always': lc whatever the power (cells under their own supply). 'none': never. */
export type LitRule = 'main' | 'always' | 'none';

/** what hangs in a room's air: dust, unless it is the green's (spores) or the flesh's (flecks) */
export type Motes = 'dust' | 'spores' | 'flesh';

export interface RoomDef {
  id: number;
  name: string;
  /** rock or a walkway, not a fitted room: plain walls, no dado or stripe */
  plain: boolean;
  /** the open volume: floor at y0, ceiling at y0 + ht */
  x0: number; z0: number; x1: number; z1: number;
  y0: number; ht: number;
  floor: Colour; wall: Colour; stripe: Colour;
  lit: LitRule;
  /** the colour of its lights when lit */
  lc: Colour;
  /** has emergency lights: lit (dimly) on backup power */
  em: boolean;
  /** the circuit that powers it */
  circuit: string;
  /** its lights stutter */
  flick: boolean;
  /** a doorway: lit by the rooms either side of it */
  doorway: boolean;
  /** for the cast: a refuge they do not enter (safe), a room they do not wander into (noroam) */
  safe: boolean;
  noroam: boolean;
  /** what hangs in its air, if not dust: the green's spores, or the flesh's flecks (present/render/motes.ts) */
  motes?: Motes;
  /** a cavern's roof painted as sky: its ceiling is this colour, and no fittings hang from it */
  sky?: Colour;
  /** a cave of any outline (engine.md §14): only these tiles are its own, each carved from lo to hi. The box above
   *  (x0 to x1, y0 to y0 + ht) bounds them. Tile (i, j) has its low corner at (x0 + i * res, z0 + j * res); a tile with
   *  lo >= hi is not the room's. */
  cells?: { res: number; nx: number; nz: number; lo: number[]; hi: number[] };
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
  /** a fitting that shows power: colour when its circuit is dead, and when it is live */
  pw?: [Colour, Colour];
  /** the circuit for pw */
  pc?: string;
}

/** a light of its own (a battery work lamp, a glowing growth): a pool of light, in its room only, whatever the power. It
 *  reaches r metres from where it is (x, y, z): a lamp on the floor does not light a ceiling far over it */
export interface LampDef {
  x: number; y: number; z: number;
  r: number;
  colour: Colour;
  /** the thing lying about that gives it (a flashlight dropped still on): it goes out once that is taken. Its index in items. */
  item?: number;
}

/** a ceiling fitting: a point its room's light shines down from */
export interface FixtureDef {
  x: number; y: number; z: number;
}

/** an air grille in a ceiling: its middle */
export interface VentDef {
  x: number; y: number; z: number;
}

/** a pool of blood on a floor: its middle and about how far it runs */
export interface StainDef {
  x: number; y: number; z: number; r: number;
}

/** a sign over a doorway: text on a plate, facing (yaw) the way it is read from */
export interface SignDef {
  text: string;
  x: number; y: number; z: number;
  yaw: number;
  circuit: string;
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
  /** solid but not drawn: the ramp under a flight of steps */
  hidden?: boolean;
  /** only some of its lattice squares are there ((nx - 1) by (nz - 1), row by row; 1 where it is): the floor or roof of
   *  caves of any outline */
  mask?: number[];
}

/** standing water: a level over a rectangle */
export interface WaterDef {
  x0: number; z0: number; x1: number; z1: number;
  level: number;
}

/** a door: a slab that fills a doorway and slides up into the lintel. What opens it is decided by its rules
 *  (engine.md §9, world.md §4): light doors open for anything near, heavy ones from a button on full power; either may
 *  carry a card reader or keypad; some are jammed half open, welded shut, or are loose panels. */
export interface DoorDef {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
  kind: 'light' | 'heavy';
  /** the slab runs along x (people pass north and south) rather than along z */
  alongX: boolean;
  open: boolean;
  /** jammed part open: crouch under it */
  stuck: boolean;
  /** welded shut for good */
  seal: boolean;
  /** a loose wall panel, not a door */
  vent: boolean;
  /** the main lift's door */
  lift: boolean;
  /** a pane of glass, sealed: bodies stop at it, sight and light go through (a window) */
  glass?: boolean;
  card?: string;
  code?: number;
  circuit: string;
  /** what it says when it will not open */
  msg?: string;
}

/** data the later steps use (engine.md §13): kept with the level now so the level is ported once */
export interface ItemDef { id: string; x: number; y: number; z: number; n: number }
export interface NoteDef { key: string; x: number; y: number; z: number }
export interface MutantDef { type: string; x: number; y: number; z: number; opts: Record<string, unknown> }
/** something to use: a corpse to search, a panel, a backup set, a ladder, the lift */
export interface UseDef { kind: string; x: number; y: number; z: number; opts: Record<string, unknown> }

/** a platform that carries what stands on it between two heights. Its top is at y0 or y1. */
export interface PlatformDef {
  x0: number; z0: number; x1: number; z1: number;
  y0: number; y1: number;
  colour: Colour;
  /** worked by a button on a circuit (the station's cargo platforms); without it, it goes when stood on */
  call?: { name: string; circuit: string };
}

/** a camera: fixed eyes on a circuit (world.md §8). Its lens at (x, y, z), looking along yaw (as the cast: 0 is south,
 *  a quarter turn east), over a cone fov wide, as far as range in good light. Held in view, you sound its zone. */
export interface CameraDef {
  x: number; y: number; z: number;
  yaw: number; fov: number; range: number;
  circuit: string;
  zone: string;
}

/** a zone's speaker, where its alarm sounds: (x, y, z) the floor under it, which is where whatever answers it comes to */
export interface SpeakerDef { zone: string; x: number; y: number; z: number }

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
  lamps: LampDef[];
  /** ceiling fittings: where each room's own light comes from, so it falls in pools below them (world/light.ts) */
  fixtures?: FixtureDef[];
  /** air grilles in fitted ceilings: where a room's air is drawn to and heard from while its fans run (motes.ts) */
  vents?: VentDef[];
  /** blood on the floor, wet enough to walk out of with it on your soles (present/render/prints.ts) */
  stains?: StainDef[];
  /** the overseer's eyes, and the speakers its alarms sound from (sim/eyes.ts) */
  cameras?: CameraDef[];
  speakers?: SpeakerDef[];
  signs: SignDef[];
  items: ItemDef[];
  notes: NoteDef[];
  mutants: MutantDef[];
  uses: UseDef[];
  /** named places: where you arrive by the lift, by each ladder, by stairs from each level */
  marks: Record<string, Start>;
  /** the circuit for anything that does not name one */
  circuit: string;
  start: Start;
}

/** how a circuit starts: on (fed by Gen-1 when it runs), with a working backup set, or broken (its feed is burned or cut).
 *  A branch (`feed`) takes its power from another circuit through its own service connection, not from Gen-1: whatever
 *  that circuit has, it has, while its connection is closed and whole. */
export interface CircuitDef { on: boolean; back: boolean; broken?: boolean; feed?: string; tag?: string }

/** a ladderway between two levels: broken (why it does not go), or needing something to pass */
export interface LadderDef {
  broken?: string; need?: { power?: string; msg?: string }; say?: string;
  /** the two levels it joins, by id */
  ends?: [string, string];
}

export interface StationDef {
  levels: { id: string; name: string; circuit: string; build: () => LevelDef }[];
  circuits: Record<string, CircuitDef>;
  ladders: Record<string, LadderDef>;
  /** Gen-1 is running */
  main: boolean;
  /** where the game begins: this level's own start */
  start: string;
  /** what you are told as it begins */
  intro?: string;
  /** every level's name, ported or not (a ladder names where it goes before that level is built) */
  names: Record<string, string>;
}
