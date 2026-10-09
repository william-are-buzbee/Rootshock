import { PI, clamp, hex, scale3, type Colour } from '../../core/math';
import type { Rng } from '../../core/rng';
import { CAVERN, DOORWAY, FITTED, STREET, WALKWAY, type Mat, type RoomMats } from '../materials';
import type { Aim, LadderDef, LitRule, Motes, Shape } from '../types';
import { LevelBuilder, type Palette } from './builder';

/* The first engine's way of laying out a level, kept so its levels port nearly line for line.

   A level is one or more decks: grids of 2 m tiles, each a walkable layer at its own height (a hall, and walkways
   above it). Rooms, doors, caves and terrain are laid out on the tiles; props are placed in tile units with sizes in
   metres. Nothing is built until finish(), which compiles every deck into the world's shapes: rooms carved in the grid,
   floor slabs under every upper deck, walkways with rails at their open edges, doors with doorways, platforms, cave
   surfaces from the terrain fields, ceiling fittings, and the props.

   Positions: tile (i, j) has its low corner at the deck's org + (2i, 2j) in plan metres. */

export const T = 2;

/** a colour as the first engine wrote it: a hex number, or channels (above 1.5 means emissive) */
export type Col = number | Colour;

export interface TRoomOpts {
  ht?: number;
  fl?: number; wl?: number; st?: number;
  lit?: LitRule; lc?: Colour; em?: number | boolean; c?: string; flick?: number | boolean;
  /** a walkway or rung over open air: a slab with rails at its open edges */
  open?: number | boolean;
  /** a hole in the deck for stairs ('st') or a platform ('el'): no floor */
  hole?: string | number;
  /** rock: floor, walls and ceiling follow the terrain fields */
  cave?: number | boolean;
  /** only the air over lower rooms: no floor where a room lies below */
  air?: number | boolean;
  /** what hangs in its air, if not dust */
  motes?: Motes;
  sky?: number;
  /** what its floor, walls and ceiling are made of, where not the usual: rock for a cave, grating for a walkway, paving
   *  under a sky, concrete for the rest */
  mat?: Partial<RoomMats>;
  /** its floor this far over the deck's (under it, if negative): a sunken court. Its ceiling rides on its floor */
  dy?: number;
  nolamp?: number | boolean; noroam?: number | boolean; safe?: number | boolean;
}

export interface TRoom {
  id: number; name: string; x: number; y: number; w: number; h: number;
  ht: number; dy: number; fl: number; wl: number; st: number;
  lit: LitRule; lc: Colour; em: boolean; c: string; flick: boolean;
  open: boolean; hole: string | null; cave: boolean; air: boolean; sky?: number; motes?: Motes; mat: RoomMats;
  nolamp: boolean; noroam: boolean; safe: boolean;
  /** a cave of any outline (caveShape): its tiles are the deck's tiles marked with its id, and x, y, w, h bound them */
  shaped?: boolean;
}

export interface TDoorOpts {
  kind?: 'light' | 'heavy'; open?: boolean; card?: string; code?: number; stuck?: boolean; seal?: boolean; vent?: boolean; lift?: boolean; glass?: boolean;
  c?: string; msg?: string;
  /** signs over it: [text, which side of the doorway it is read from] */
  sg?: [string, 'n' | 's' | 'e' | 'w'][];
}

interface TProp {
  shape: Shape; x: number; z: number; y: number; sx: number; sy: number; sz: number; c: Colour;
  ry: number; rz: number; glow: number; pw: [Colour, Colour] | null; pc: string | null; solid: boolean; loose: boolean; mat?: Mat;
}

/** a level as the first engine described it, before it is compiled */
export interface LevelInfo { id: string; name: string; c: string; org?: [number, number] }

export interface Deck {
  lv: LevelInfo; name: string; c: string; W: number; H: number; org: [number, number]; y0: number; li: number;
  /** a ground floor over a basement: its floor is the rock, and a slab is laid only where something lies below */
  ground: boolean;
  /** wading water over every room (its depth), or every room flooded to the roof */
  wet: number; deep: number;
  g: Uint8Array; rm: Int16Array; nom: Uint8Array;
  rooms: TRoom[]; doors: Map<number, TDoorOpts & { x: number; y: number }>;
  above: Deck | null; below: Deck | null;
  hf: Float32Array | null; cf: Float32Array | null; hset: Uint8Array | null;
  props: TProp[];
  cols: [number, number, number, number, number, number][];
  lamps: { x: number; z: number; r: number; c: Colour; h?: number }[];
  /** cameras (in tile units, their lens h metres up, yaw as the cast's) and the zones' speakers */
  cams: { x: number; z: number; h: number; yaw: number; fov: number; range: number; c: string; zone: string }[];
  speakers: { zone: string; x: number; z: number; pa?: string }[];
  /** blood on the floor: middle and reach, in metres */
  stains: { x: number; z: number; r: number }[];
  elevs: { tx: number; tz: number; w: number; h: number; lo: Deck; hi: Deck; c: string; name: string }[];
  stairs: { tx: number; tz: number; len: number; dir: 'n' | 's' | 'e' | 'w'; lo: Deck; hi: Deck }[];
  /** steps within a deck: from a sunken floor up to the deck's own, or between any two heights over it */
  flights: { tx: number; tz: number; w: number; h: number; y0: number; y1: number; n: number; dir: 'n' | 's' | 'e' | 'w'; c: number }[];
  items: { id: string; x: number; z: number; y: number; n: number; on?: Aim }[];
  notes: { key: string; x: number; z: number; y: number }[];
  muts: { type: string; x: number; z: number; o: Record<string, unknown> }[];
  uses: { kind: string; x: number; z: number; y: number; o: Record<string, unknown> }[];
  marks: Record<string, [number, number, number]>;
  conn: Set<string>;
  /** standing water of its own (a pool): tiles x0, z0 to x1, z1, its surface in metres over the deck's floor */
  water: [number, number, number, number, number][];
}

/* ---- the level being built: decks share a builder, a seeded rng, and the station's ladderways */
let cur: { b: LevelBuilder; rng: Rng; ladders: Record<string, LadderDef>; decks: Deck[] } | null = null;

/** start a level: every deck made until finishLevel() belongs to it */
export function beginLevel(lv: LevelInfo, ladders: Record<string, LadderDef>): void {
  const b = new LevelBuilder(lv.id, lv.name, { circuit: lv.c });
  cur = { b, rng: b.rng, ladders, decks: [] };
}
const C = () => {
  if (!cur) throw new Error('tiles: no level begun');
  return cur;
};
export const rnd = (a: number, b?: number): number => C().rng.range(a, b);
export const pick = <X>(a: readonly X[]): X => C().rng.pick(a);
export const mul3 = (c: Colour, k: number): Colour => scale3(c, k);
const col = (c: Col): Colour => hex(c);

export function mkDeck(lv: LevelInfo, W: number, H: number, o: { y0?: number; li?: number; wet?: number; deep?: number; ground?: boolean } = {}): Deck {
  const D: Deck = {
    lv, name: lv.name, c: lv.c, W, H, org: lv.org ?? [0, 0], y0: o.y0 ?? 0, li: o.li ?? 0, wet: o.wet ?? 0, deep: o.deep ?? 0, ground: !!o.ground,
    g: new Uint8Array(W * H), rm: new Int16Array(W * H).fill(-1), nom: new Uint8Array(W * H),
    rooms: [], doors: new Map(), above: null, below: null, hf: null, cf: null, hset: null,
    props: [], cols: [], lamps: [], cams: [], speakers: [], stains: [], elevs: [], stairs: [], flights: [], items: [], notes: [], muts: [], uses: [], marks: {}, conn: new Set(), water: [],
  };
  C().decks.push(D);
  return D;
}
export function stack(lo: Deck, hi: Deck): void {
  if (lo.W !== hi.W || lo.H !== hi.H) throw new Error('Stacked layers must share one grid: ' + lo.name);
  lo.above = hi; hi.below = lo;
}
export function dnAt(D: Deck, k: number): Deck | null {
  let n = D.below;
  while (n && !n.g[k]) n = n.below;
  return n;
}

/* ---- rooms and doors */
export const WHITE: Colour = [0.8, 0.85, 0.9];
export function room(D: Deck, name: string, x: number, y: number, w: number, h: number, o: TRoomOpts = {}): TRoom {
  const r: TRoom = {
    id: D.rooms.length, name, x, y, w, h, ht: o.ht ?? 3.2, dy: o.dy ?? 0, fl: o.fl ?? 0x6b6e6a, wl: o.wl ?? 0x7c7f7a, st: o.st ?? 0x555555,
    lit: o.lit ?? 'main', lc: o.lc ?? WHITE, em: !!o.em, c: o.c ?? D.c, flick: !!o.flick,
    open: !!o.open, hole: o.hole ? String(o.hole) : null, cave: !!o.cave, air: !!o.air, ...(o.sky !== undefined ? { sky: o.sky } : {}), ...(o.motes ? { motes: o.motes } : {}),
    mat: { ...(o.cave ? CAVERN : o.open ? WALKWAY : o.sky !== undefined ? STREET : FITTED), ...o.mat },
    nolamp: !!o.nolamp, noroam: !!o.noroam, safe: !!o.safe,
  };
  D.rooms.push(r);
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { D.g[j * D.W + i] = 1; D.rm[j * D.W + i] = r.id; }
  return r;
}
/** two doors only (world.md §4): light, and heavy. Either may carry a card reader or a keypad, or be jammed or sealed. */
export function door(D: Deck, x: number, y: number, o: TDoorOpts = {}): void {
  const i = y * D.W + x;
  D.g[i] = 1; D.rm[i] = -2;
  D.doors.set(i, { x, y, ...o });
}

/* ---- props, in tile units with sizes in metres */
export interface POpts { y?: number; ry?: number; rz?: number; glow?: number; pw?: [Col, Col]; pc?: string; c?: 0 | 1; loose?: boolean; mat?: Mat }
export function P(D: Deck, shape: Shape, x: number, z: number, sx: number, sy: number, sz: number, c: Col, o: POpts = {}): void {
  const y = o.y ?? 0, solid = o.c === 1 || (o.c !== 0 && sy >= 0.3 && y < 1.6 && shape !== 'ico');
  D.props.push({
    shape, x: x * T, z: z * T, y, sx, sy, sz, c: col(c), ry: o.ry ?? 0, rz: o.rz ?? 0, glow: o.glow ?? 0,
    pw: o.pw ? [col(o.pw[0]), col(o.pw[1])] : null, pc: o.pc ?? null, solid: solid || !!o.loose, loose: !!o.loose, ...(o.mat ? { mat: o.mat } : {}),
  });
}
export const bx = (D: Deck, x: number, z: number, sx: number, sy: number, sz: number, c: Col, o?: POpts): void => P(D, 'box', x, z, sx, sy, sz, c, o);
/** an invisible solid under furniture drawn in parts: centre (x, z) in tiles, w by d metres, up to h */
export function colT(D: Deck, x: number, z: number, w: number, d: number, h = 0.76): void {
  D.cols.push([x * T - w / 2, z * T - d / 2, x * T + w / 2, z * T + d / 2, 0, h]);
}
export function lamp(D: Deck, x: number, z: number, r: number): void {
  P(D, 'cyl', x, z, 0.06, 1.5, 0.06, 0x2a2c2e, { c: 0 });
  bx(D, x, z, 0.34, 0.22, 0.12, [2.95, 2.9, 2.65], { y: 1.5, c: 0 });
  bx(D, x, z, 0.5, 0.05, 0.5, 0x2a2c2e, { c: 0 });
  D.lamps.push({ x: x * T, z: z * T, r, c: [0.78, 0.74, 0.6], h: 1.5 });
}
/** blood on the floor at (x, z) in tiles, reaching r metres: walked through, it comes away on your soles */
export function stain(D: Deck, x: number, z: number, r: number): void { D.stains.push({ x: x * T, z: z * T, r }); }
export function item(D: Deck, id: string, x: number, z: number, y = 0, n = 1): Deck['items'][number] {
  const it = { id, x: x * T, z: z * T, y, n };
  D.items.push(it);
  return it;
}
export function note(D: Deck, key: string, x: number, z: number, y = 0): void { D.notes.push({ key, x: x * T, z: z * T, y }); }
export function mut(D: Deck, type: string, x: number, z: number, o: Record<string, unknown> = {}): void { D.muts.push({ type, x, z, o }); }
export function use(D: Deck, kind: string, x: number, z: number, y: number, o: Record<string, unknown> = {}): void { D.uses.push({ kind, x, z, y, o }); }

/* ---- terrain: values at tile corners. hf lifts a floor, cf a cave's ceiling */
export function field(D: Deck, k: 'hf' | 'cf'): Float32Array {
  return D[k] ?? (D[k] = new Float32Array((D.W + 1) * (D.H + 1)));
}
export function fieldAt(D: Deck, h: Float32Array | null, x: number, z: number): number {
  if (!h) return 0;
  const W1 = D.W + 1, fx = clamp(x / T, 0, D.W - 1e-4), fz = clamp(z / T, 0, D.H - 1e-4), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
  return h[j * W1 + i] * (1 - u) * (1 - v) + h[j * W1 + i + 1] * u * (1 - v) + h[(j + 1) * W1 + i] * (1 - u) * v + h[(j + 1) * W1 + i + 1] * u * v;
}
/** floor height at deck-local metres (x, z) */
export const hfAt = (D: Deck, x: number, z: number): number => fieldAt(D, D.hf, x, z);
export function hill(D: Deck, cx: number, cz: number, rad: number, h: number, R: TRoom): void {
  const f = field(D, 'hf'), W1 = D.W + 1, e = R.cave ? 0 : 1;
  for (let j = R.y + e; j <= R.y + R.h - e; j++) for (let i = R.x + e; i <= R.x + R.w - e; i++) {
    const d = Math.hypot(i - cx, j - cz) / rad;
    if (d < 1) { const q = Math.cos((d * PI) / 2); f[j * W1 + i] += h * q * q; }
  }
}
export function vault(D: Deck, cx: number, cz: number, rad: number, h: number, R: TRoom): void {
  const f = field(D, 'cf'), W1 = D.W + 1;
  for (let j = R.y; j <= R.y + R.h; j++) for (let i = R.x; i <= R.x + R.w; i++) {
    const d = Math.hypot(i - cx, j - cz) / rad;
    if (d < 1) { const q = Math.cos((d * PI) / 2); f[j * W1 + i] += h * q * q; }
  }
}
/** a barrel vault across a cave's short side: the ceiling rises by h along its middle */
export function arch(D: Deck, R: TRoom, h: number): void {
  const f = field(D, 'cf'), W1 = D.W + 1, ax = R.w < R.h;
  for (let j = R.y; j <= R.y + R.h; j++) for (let i = R.x; i <= R.x + R.w; i++) f[j * W1 + i] += h * Math.sin(PI * (ax ? (i - R.x) / R.w : (j - R.y) / R.h));
}
export function slope(D: Deck, R: TRoom, dir: 'n' | 's' | 'e' | 'w', h0: number, h1: number): void {
  const f = field(D, 'hf'), W1 = D.W + 1, ax = dir === 'e' || dir === 'w', rev = dir === 'w' || dir === 'n', L = ax ? R.w : R.h;
  for (let j = R.y; j <= R.y + R.h; j++) for (let i = R.x; i <= R.x + R.w; i++) {
    const t = (ax ? i - R.x : j - R.y) / L;
    f[j * W1 + i] = h0 + (h1 - h0) * (rev ? 1 - t : t);
  }
}
/** break up a cave's floor and ceiling. Corners shared with a door or an ordinary room are left alone, so place doors first */
export function roughen(D: Deck, R: TRoom, fa: number, ca: number): void {
  const hf = field(D, 'hf'), cf = field(D, 'cf'), W = D.W, W1 = W + 1;
  const pinned = (i: number, j: number): boolean => {
    let own = false;
    for (const [di, dj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
      const ti = i + di, tj = j + dj;
      if (ti < 0 || tj < 0 || ti >= W || tj >= D.H) continue;
      const k = tj * W + ti;
      if (D.rm[k] === R.id) own = true;
      if (D.g[k] && !(D.rm[k] >= 0 && D.rooms[D.rm[k]].cave)) return true;
    }
    return !own;
  };
  for (let j = R.y; j <= R.y + R.h; j++) for (let i = R.x; i <= R.x + R.w; i++) {
    if (pinned(i, j)) continue;
    hf[j * W1 + i] += rnd(-fa, fa);
    cf[j * W1 + i] += rnd(-ca, ca);
  }
}
export const ROCKP = { fl: 0x4a443c, wl: 0x5a5248, st: 0x5a5248 };
export function cave(D: Deck, name: string, x: number, y: number, w: number, h: number, o: TRoomOpts = {}): TRoom {
  return room(D, name, x, y, w, h, { ...ROCKP, cave: 1, ht: 4, lit: 'none', nolamp: 1, ...o });
}

/* ---- caves of any outline (engine.md §14). A shape is f(x, z) in tiles: the floor height at a point inside it, or null
   outside. Tiles test their centres and go to the first shape that claims them; tile corners take the floor of the first
   shape to set them, so where shapes meet, the earlier one rules. The room's x, y, w, h bound its tiles, as the other
   terrain tools expect. In the compiled level a deck's shaped caves are one floor and one roof, masked to their tiles. */
export function caveShape(D: Deck, name: string, f: (x: number, z: number) => number | null, o: TRoomOpts = {}): TRoom {
  const R = room(D, name, 0, 0, 0, 0, { ...ROCKP, cave: 1, ht: 4, lit: 'none', nolamp: 1, ...o });
  R.shaped = true;
  const hf = field(D, 'hf'), W1 = D.W + 1, set = D.hset ?? (D.hset = new Uint8Array(W1 * (D.H + 1)));
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let j = 0; j < D.H; j++)
    for (let i = 0; i < D.W; i++) {
      const k = j * D.W + i;
      if (D.g[k]) continue;
      const h = f(i + 0.5, j + 0.5);
      if (h === null) continue;
      D.g[k] = 1; D.rm[k] = R.id;
      x0 = Math.min(x0, i); y0 = Math.min(y0, j); x1 = Math.max(x1, i); y1 = Math.max(y1, j);
      for (const [ci, cj] of [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]]) {
        const c = cj * W1 + ci;
        if (set[c]) continue;
        const q = f(ci, cj);
        hf[c] = q === null ? h : q; set[c] = 1;
      }
    }
  R.x = x0; R.y = y0; R.w = x1 - x0 + 1; R.h = y1 - y0 + 1;
  return R;
}
/** a little wander in an outline, the same every time */
const wob = (i: number, j: number) => 0.45 * Math.sin(i * 1.3 + j * 0.7) + 0.3 * Math.sin(j * 1.9 - i * 0.4);
function nearPath(pts: [number, number, number][], x: number, z: number): { d: number; h: number } {
  let d = 1e9, h = 0;
  for (let s = 0; s < pts.length - 1; s++) {
    const a = pts[s], b = pts[s + 1], dx = b[0] - a[0], dz = b[1] - a[1], t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz), 0, 1);
    const e = Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t);
    if (e < d) { d = e; h = a[2] + (b[2] - a[2]) * t; }
  }
  return { d, h };
}
/** a passage along pts [[x, z, floor], ...], r tiles either side of its line */
export function tunnel(D: Deck, name: string, pts: [number, number, number][], r: number, o: TRoomOpts = {}): TRoom {
  return caveShape(D, name, (x, z) => { const q = nearPath(pts, x, z); return q.d < r + wob(x, z) * 0.6 ? q.h : null; }, o);
}
/** an elliptical chamber, its floor given by fl(x, z) */
export function chamber(D: Deck, name: string, cx: number, cz: number, rx: number, rz: number, fl: (x: number, z: number) => number, o: TRoomOpts = {}): TRoom {
  return caveShape(D, name, (x, z) => (Math.hypot((x - cx) / rx, (z - cz) / rz) < 1 + wob(x, z) / Math.max(rx, rz) ? fl(x, z) : null), o);
}
/** a pool in a cave floor: the floor sinks under standing water. (The first engine drew a dark disc and kept you out of it
 *  with a hidden kerb; here the water is real, and you can wade and swim in it.) */
export function pool(D: Deck, R: TRoom, cx: number, cz: number, r: number, depth: number): void {
  const level = hfAt(D, cx * T, cz * T) - 0.35;
  hill(D, cx, cz, r + 1, -depth, R);
  D.water.push([cx - r - 1, cz - r - 1, cx + r + 1, cz + r + 1, level]);
}

/* ---- ways between layers */
/** walk-up stairs between a hall and the rung above it. (tx, tz) is the first tile; dir is the way you climb. */
export function stairs(lo: Deck, hi: Deck, tx: number, tz: number, len: number, dir: 'n' | 's' | 'e' | 'w'): void {
  const ax = dir === 'e' || dir === 'w', w = ax ? len : 1, h = ax ? 1 : len;
  room(hi, '', tx, tz, w, h, { hole: 'st', noroam: 1, nolamp: 1 });
  for (let j = tz; j < tz + h; j++) for (let i = tx; i < tx + w; i++) { lo.nom[j * lo.W + i] = 1; hi.nom[j * hi.W + i] = 1; }
  lo.stairs.push({ tx, tz, len, dir, lo, hi });
  const rev = dir === 'w' || dir === 'n';
  const ti = ax ? (rev ? tx : tx + len - 1) : tx, tj = !ax ? (rev ? tz : tz + len - 1) : tz;
  const li = ti + (ax ? (rev ? -1 : 1) : 0), lj = tj + (!ax ? (rev ? -1 : 1) : 0);
  hi.conn.add(lj * hi.W + li + ':' + (tj * hi.W + ti));
}
/** steps over tiles (tx, tz) w by h, rising from y0 to y1 (metres over the deck's floor) toward dir, in n steps: down
 *  into a sunken floor (room dy), say. They stand on the floor of the room they are in. */
export function flight(D: Deck, tx: number, tz: number, w: number, h: number, y0: number, y1: number, dir: 'n' | 's' | 'e' | 'w', n: number, c = 0x5a5d60): void {
  D.flights.push({ tx, tz, w, h, y0, y1, n, dir, c });
}
/** a platform that carries you, and cargo, between a hall floor and its rung. Needs power. */
export function elev(lo: Deck, hi: Deck, tx: number, tz: number, w: number, h: number, c: string, nm = 'Cargo elevator'): void {
  room(hi, '', tx, tz, w, h, { hole: 'el', noroam: 1, nolamp: 1 });
  for (let j = tz; j < tz + h; j++) for (let i = tx; i < tx + w; i++) { lo.nom[j * lo.W + i] = 1; hi.nom[j * hi.W + i] = 1; }
  lo.elevs.push({ tx, tz, w, h, lo, hi, c, name: nm });
  bx(lo, tx + w / 2, tz + h / 2, w * T, 0.01, h * T, 0xb89b2e, { y: 0.012, c: 0 });
  bx(lo, tx + w / 2, tz + h / 2, w * T - 0.4, 0.01, h * T - 0.4, 0x2a2c2e, { y: 0.016, c: 0 });
}
/** stairs to another level: you fade, and arrive at the far level's mark for this one */
export function stairUp(D: Deck, ix: number, iz: number, ax: number, az: number, yaw: number, to: string): void {
  use(D, 'stair', ix, iz, 1, { to, from: D.lv.id, up: 1 });
  D.marks['stair:' + to] = [ax, az, yaw];
  for (let k = 0; k < 5; k++) bx(D, ix, iz - 0.3 + k * 0.15, 1.3, 0.24 * (k + 1), 0.3, 0x5a5d60, { c: 0 });
}
export function stairDn(D: Deck, ix: number, iz: number, ax: number, az: number, yaw: number, to: string): void {
  use(D, 'stair', ix, iz, 0.4, { to, from: D.lv.id, up: 0 });
  D.marks['stair:' + to] = [ax, az, yaw];
  bx(D, ix, iz, 1.3, 0.02, 1.5, 0x030405, { y: 0.014, c: 0 });
  for (const s of [-0.7, 0.7]) bx(D, ix + s / T, iz, 0.06, 1, 1.5, 0x8a7a2a, { c: 0 });
}
/** one end of a ladderway. A ladder is a fade, not a climb. Place it after the room it stands in. */
export function ladder(D: Deck, id: string, ix: number, iz: number, ax: number, az: number, yaw: number, up: boolean, o: { label?: string; bare?: boolean } = {}): void {
  const L = C().ladders[id], k = Math.floor(iz) * D.W + Math.floor(ix), R = D.rm[k] >= 0 ? D.rooms[D.rm[k]] : null;
  const h = up ? (R ? R.ht : 3.2) : 1.1, broken = !!(L && L.broken);
  use(D, 'ladder', ix, iz, up ? 1.2 : 0.4, { id, up: up ? 1 : 0, text: o.label });
  D.marks['ladder:' + id] = [ax, az, yaw];
  if (o.bare) return;
  for (const s of [-0.25, 0.25]) bx(D, ix + s / T, iz, 0.06, h, 0.06, 0x8a7a2a, { c: 0 });
  for (let y = 0.3; y < h - 0.05; y += 0.3) if (!(broken && y > 1.2 && C().rng.chance(0.5))) bx(D, ix, iz, 0.5, 0.04, 0.04, 0x8a7a2a, { y, c: 0 });
  if (!up) bx(D, ix, iz, 1, 0.02, 1, 0x030405, { y: 0.014, c: 0 });
  if (broken) for (let k2 = 0; k2 < 5; k2++) P(D, 'ico', ix + rnd(-0.4, 0.4), iz + rnd(-0.4, 0.4), rnd(0.2, 0.5), rnd(0.15, 0.35), rnd(0.2, 0.5), pick([0x5a5248, 0x4a443c, 0x6b6a64]), { c: 0 });
}

/** a way through water to another level (a dive): you arrive at that level's mark 'dive:' + this level's id. `under`: it
 *  goes down into water with no air (the first time, you are told to count) */
export function dive(D: Deck, x: number, z: number, y: number, to: string, label: string, under = false): void {
  use(D, 'dive', x, z, y, { to, label, ...(under ? { under: 1 } : {}) });
}

/* ---- compile: every deck of the level, into the builder */
const DOORPAL = { fl: [0.2, 0.21, 0.22] as Colour, wl: [0.27, 0.28, 0.3] as Colour, st: [0.22, 0.23, 0.25] as Colour };
const SLAB = 0.25;

export function finishLevel(start?: [number, number, number]) {
  const { b, decks } = C();
  const X = (D: Deck, tx: number) => D.org[0] + tx * T, Z = (D: Deck, tz: number) => D.org[1] + tz * T;
  /** plan position of deck-local metres */
  const px = (D: Deck, x: number) => D.org[0] + x, pz = (D: Deck, z: number) => D.org[1] + z;
  const roomAtTile = (D: Deck, k: number) => (D.rm[k] >= 0 ? D.rooms[D.rm[k]] : null);
  /** a sunken (or raised) room's floor, at deck-local metres */
  const dyAt = (D: Deck, lx: number, lz: number) => {
    const i = Math.floor(lx / T), j = Math.floor(lz / T);
    return i >= 0 && j >= 0 && i < D.W && j < D.H ? roomAtTile(D, j * D.W + i)?.dy ?? 0 : 0;
  };
  const floorY = (D: Deck, lx: number, lz: number) => D.y0 + hfAt(D, lx, lz) + dyAt(D, lx, lz);

  decks.sort((a, c) => a.y0 - c.y0);
  for (const D of decks) {
    /* rooms */
    for (const R of D.rooms) {
      if (R.hole || R.shaped) continue;
      const opts = {
        pal: { fl: R.fl, wl: R.wl, st: R.st } as Palette, lit: R.lit, lc: R.lc, em: R.em, circuit: R.c, flick: R.flick,
        nolamp: true, plain: R.open || R.cave, safe: R.safe, noroam: R.noroam, ...(R.sky !== undefined ? { sky: R.sky } : {}), motes: R.motes,
        mat: R.mat,
      };
      const x0 = X(D, R.x), z0 = Z(D, R.y), x1 = X(D, R.x + R.w), z1 = Z(D, R.y + R.h);
      if (R.cave) {
        b.cave(R.name, x0, z0, x1, z1, {
          ...opts, y0: D.y0, ht: R.ht, res: T,
          floor: (x, z) => fieldAt(D, D.hf, x - D.org[0], z - D.org[1]),
          /* a cave's roof rides on its floor, as before */
          ceil: (x, z) => fieldAt(D, D.hf, x - D.org[0], z - D.org[1]) + fieldAt(D, D.cf, x - D.org[0], z - D.org[1]),
        });
      } else b.room(R.name, x0, z0, x1, z1, { ...opts, y0: D.y0 + R.dy, ht: R.ht });
    }
    shapedCaves(b, D);
    /* water: wading depth over every room and doorway, or every room flooded over its roof; and pools */
    if (D.wet || D.deep) {
      const top = D.y0 + (D.wet || Math.max(2.4, ...D.rooms.map(R => R.ht)) + 1);
      for (const R of D.rooms) if (!R.hole && R.w > 0) b.water(X(D, R.x), Z(D, R.y), X(D, R.x + R.w), Z(D, R.y + R.h), top);
      for (const d of D.doors.values()) b.water(X(D, d.x), Z(D, d.y), X(D, d.x + 1), Z(D, d.y + 1), top);
    }
    for (const [x0, z0, x1, z1, lv] of D.water) b.water(X(D, x0), Z(D, z0), X(D, x1), Z(D, z1), D.y0 + lv);
    /* doorways, and the doors in them */
    for (const [k, d] of D.doors) {
      const x0 = X(D, d.x), z0 = Z(D, d.y), cx = x0 + T / 2, cz = z0 + T / 2;
      b.room('', x0, z0, x0 + T, z0 + T, { pal: { fl: 0, wl: 0, st: 0 }, y0: D.y0, ht: 2.4, doorway: true, nolamp: true, lit: 'main', circuit: D.c, mat: DOORWAY });
      const R = b.level.rooms[b.level.rooms.length - 1];
      R.floor = DOORPAL.fl; R.wall = DOORPAL.wl; R.stripe = DOORPAL.st;
      const ns = !!(D.g[k - D.W] && D.g[k + D.W]), heavy = d.kind === 'heavy', th = heavy ? 0.36 : d.vent ? 0.12 : 0.14;
      let circuit = d.c ?? '';
      if (!circuit) { circuit = D.c; for (const o of [-D.W, D.W, -1, 1]) { const r = roomAtTile(D, k + o); if (r) { circuit = r.c; break; } } }
      const y0 = floorY(D, (d.x + 0.5) * T, (d.y + 0.5) * T);
      b.door(ns ? x0 : cx - th / 2, ns ? cz - th / 2 : z0, ns ? x0 + T : cx + th / 2, ns ? cz + th / 2 : z0 + T, 2.4, {
        kind: d.kind ?? 'light', alongX: ns, open: !!d.open, stuck: !!d.stuck, seal: !!d.seal, vent: !!d.vent, lift: !!d.lift,
        card: d.card, code: d.code, circuit, msg: d.msg, ...(d.glass ? { glass: true } : {}),
      });
      b.level.doors[b.level.doors.length - 1].y0 = y0;
      b.level.doors[b.level.doors.length - 1].y1 = y0 + 2.4;
      for (const [text, dir] of d.sg ?? []) {
        const y = y0 + 2.74;
        if (dir === 'w') b.sign(text, x0 - 0.03, y, cz, -PI / 2, circuit);
        else if (dir === 'e') b.sign(text, x0 + T + 0.03, y, cz, PI / 2, circuit);
        else if (dir === 'n') b.sign(text, cx, y, z0 - 0.03, PI, circuit);
        else b.sign(text, cx, y, z0 + T + 0.03, 0, circuit);
      }
    }
    /* floors under an upper deck: a slab under every tile that is not a hole (or air over a room below that reaches up
       through it: the street's cavern under its own sky, not a flat's ceiling), row by row */
    const through = (k: number) => {
      const lo = dnAt(D, k), R = lo && roomAtTile(lo, k);
      return !!R && lo!.y0 + R.ht > D.y0 + 0.01;
    };
    if (D.below) {
      /* a walkway's slab is its own floor, so it takes the walkway's colour; under a fitted room it is the doorway grey.
         A run stops where the colour does, or a walkway's would carry on under the room its door opens into. */
      const slabAt = (k: number): number | null => {
        const R = roomAtTile(D, k);
        if (!D.g[k] || (R && (R.hole || (R.air && through(k)))) || (D.ground && !dnAt(D, k))) return null;
        return R?.open ? R.fl : -1;
      };
      /* a walkway's is grating, as its floor is; a room's is concrete */
      for (let j = 0; j < D.H; j++)
        for (let i = 0; i < D.W; ) {
          const c = slabAt(j * D.W + i);
          if (c === null) { i++; continue; }
          let n = 1;
          while (i + n < D.W && slabAt(j * D.W + i + n) === c) n++;
          b.block(X(D, i), D.y0 - SLAB, Z(D, j), X(D, i + n), D.y0, Z(D, j + 1), (c >= 0 ? hex(c) : DOORPAL.fl) as Colour, c >= 0 ? 'grating' : 'concrete');
          i += n;
        }
    }
    /* rails along a walkway's edges over open air, and beside a stair opening */
    for (let j = 0; j < D.H; j++)
      for (let i = 0; i < D.W; i++) {
        const k = j * D.W + i, R = roomAtTile(D, k);
        if (!D.g[k] || !R || !R.open) continue;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ni = i + di, nj = j + dj, n = nj * D.W + ni, inside = ni >= 0 && nj >= 0 && ni < D.W && nj < D.H;
          const NR = inside && D.g[n] ? roomAtTile(D, n) : null, hole = NR?.hole;
          const air = inside && !D.g[n] && !!dnAt(D, n), st = hole === 'st' && !D.conn.has(k + ':' + n);
          if (!air && !st) continue;
          const e = 0.1, lx0 = di ? (di > 0 ? (i + 1) * T - e : i * T) : i * T, lx1 = di ? (di > 0 ? (i + 1) * T : i * T + e) : (i + 1) * T;
          const lz0 = dj ? (dj > 0 ? (j + 1) * T - e : j * T) : j * T, lz1 = dj ? (dj > 0 ? (j + 1) * T : j * T + e) : (j + 1) * T;
          b.box(px(D, (lx0 + lx1) / 2), pz(D, (lz0 + lz1) / 2), lx1 - lx0, 1, lz1 - lz0, [0.35, 0.33, 0.2], { y: D.y0, solid: true });
        }
      }
    /* ceiling fittings, every third tile, as before */
    for (const R of D.rooms) {
      if (R.nolamp || R.open || R.hole || R.cave || R.sky !== undefined || R.air) continue;
      for (let j = 0; j < R.h; j++)
        for (let i = 0; i < R.w; i++) {
          if (i % 3 !== (R.w > 1 ? 1 : 0) || j % 3 !== (R.h > 1 ? 1 : 0)) continue;
          const dead = R.lit === 'none', tx = R.w === 2 ? R.x + 1 : R.x + i + 0.5, tz = R.h === 2 ? R.y + 1 : R.y + j + 0.5;
          b.box(X(D, tx), Z(D, tz), 1.1, 0.06, 0.3, dead ? 0x2a2c2e : 0xe8eef2, { y: D.y0 + R.dy + R.ht - 0.07, glow: dead ? 1 : 3, solid: false });
          if (!dead) b.fixture(X(D, tx), D.y0 + R.dy + R.ht - 0.08, Z(D, tz));
        }
      /* its air grilles: one at each end of a long room, at the far end of a short one, in the middle of its width and
         clear of the light fittings. They are what the room's air is drawn toward while its fans run. */
      const long = R.w >= R.h, n = long ? R.w : R.h, mid = Math.floor((long ? R.h : R.w) / 2);
      const clear = (k: number) => (k % 3 === 1 && n > 1 ? (k === 0 ? 1 : k - 1) : k);
      for (const k of n >= 6 ? [0, n - 1] : [n - 1]) {
        const i = long ? clear(k) : mid, j = long ? mid : clear(k);
        /* flush with the ceiling as built: on the 0.25 m grid, so a 3.2 m room's is at 3.25 */
        const gx = X(D, R.x + i + 0.5), gz = Z(D, R.y + j + 0.5), gy = Math.ceil((D.y0 + R.dy + R.ht) / 0.25 - 1e-6) * 0.25;
        b.box(gx, gz, 0.6, 0.03, 0.6, 0x2a2c2e, { y: gy - 0.04, solid: false });
        for (let s = 0; s < 4; s++) b.box(gx + (long ? 0 : -0.21 + s * 0.14), gz + (long ? -0.21 + s * 0.14 : 0), long ? 0.54 : 0.05, 0.02, long ? 0.05 : 0.54, 0x55585c, { y: gy - 0.06, solid: false });
        b.vent(gx, gy - 0.05, gz);
      }
    }
    /* services under a bare ceiling (a suspended or plastered one hides them): along a room's length, by one of its
       long walls, a cable tray and two pipes on hangers, a quarter metre down. Only in rooms tall enough that they
       clear the doors with room to spare, and not in the halls, whose ceilings are too far up to show them. */
    for (const R of D.rooms) {
      if (R.open || R.hole || R.cave || R.shaped || R.air || R.sky !== undefined || R.mat.ceiling !== 'concrete' || R.ht < 3 || R.ht > 6 || Math.max(R.w, R.h) < 3) continue;
      /* up among the light fittings they would take the full glare of them: they are lit as if a little shaded */
      const long = R.w >= R.h, side = R.id % 2, top = D.y0 + R.dy + R.ht, DIM = 0.5;
      /* a run's length, and where along and across the room it lies: `off` metres in from the wall on its side */
      const L = (long ? R.w : R.h) * T, a0 = long ? X(D, R.x) : Z(D, R.y);
      const across = (off: number) => (long ? Z(D, side ? R.y + R.h : R.y) + (side ? -off : off) : X(D, side ? R.x + R.w : R.x) + (side ? -off : off));
      const at = (along: number, off: number): [number, number] => (long ? [a0 + along, across(off)] : [across(off), a0 + along]);
      const run = (off: number, d: number, drop: number, c: number) => {
        const [x, z] = at(L / 2, off);
        /* a cylinder lying along the run: tipped onto its side, then turned to the room's length; its middle `drop` down */
        b.prop('cyl', x, z, d, L - 0.04, d, c, { y: top - drop - (L - 0.04) / 2, rz: PI / 2, ry: long ? 0 : PI / 2, solid: false, mat: 'steel', glow: DIM });
      };
      const [tx, tz] = at(L / 2, 0.22);
      b.box(tx, tz, long ? L - 0.04 : 0.26, 0.05, long ? 0.26 : L - 0.04, 0x6b6e70, { y: top - 0.3, solid: false, mat: 'steel', glow: DIM });
      const pipes = [0x3d5a44, 0x7a3a2a, 0x8a8a84, 0x4a5a6a];
      run(0.48, 0.11, 0.2, pipes[R.id % 4]);
      run(0.64, 0.07, 0.24, pipes[(R.id + 1) % 4]);
      for (let k = 1; k < L / 2; k++) {
        const [hx, hz] = at(k * 2, 0.22), [px, pz] = at(k * 2, 0.56);
        b.box(hx, hz, 0.02, 0.25, 0.02, 0x3a3d40, { y: top - 0.25, solid: false, glow: DIM });
        b.box(px, pz, long ? 0.03 : 0.3, 0.03, long ? 0.3 : 0.03, 0x3a3d40, { y: top - 0.15, solid: false, glow: DIM });
        b.box(px, pz, 0.02, 0.12, 0.02, 0x3a3d40, { y: top - 0.15, solid: false, glow: DIM });
      }
    }
    /* platforms between this deck and the one above */
    for (const E of D.elevs) b.platform(X(D, E.tx), Z(D, E.tz), X(D, E.tx + E.w), Z(D, E.tz + E.h), E.lo.y0, E.hi.y0, 0x4a4f55, { name: E.name, circuit: E.c });
    /* stairs: a hidden ramp under visible steps */
    for (const S of D.stairs) {
      const ax = S.dir === 'e' || S.dir === 'w', rev = S.dir === 'w' || S.dir === 'n', w = ax ? S.len : 1, hh = ax ? 1 : S.len;
      const x0 = X(D, S.tx), z0 = Z(D, S.tz), x1 = X(D, S.tx + w), z1 = Z(D, S.tz + hh), rise = S.hi.y0 - S.lo.y0;
      b.ramp(x0, z0, x1, z1, S.lo.y0, S.hi.y0, S.dir, 0x5a5d60);
      b.level.surfaces[b.level.surfaces.length - 1].hidden = true;
      const N = S.len * 4, L = S.len * T;
      for (let q = 0; q < N; q++) {
        const pos = rev ? 1 - (q + 0.5) / N : (q + 0.5) / N, sh = ((q + 1) / N) * rise;
        if (ax) b.box(x0 + pos * L, (z0 + z1) / 2, L / N, sh, T - 0.3, q % 2 ? 0x5a5d60 : 0x54575a, { y: S.lo.y0, solid: false });
        else b.box((x0 + x1) / 2, z0 + pos * L, T - 0.3, sh, L / N, q % 2 ? 0x5a5d60 : 0x54575a, { y: S.lo.y0, solid: false });
      }
    }
    /* steps within the deck: solid blocks, one a step */
    for (const F of D.flights) b.steps(X(D, F.tx), Z(D, F.tz), X(D, F.tx + F.w), Z(D, F.tz + F.h), D.y0 + F.y0, D.y0 + F.y1, F.n, F.dir, F.c);
    /* props, colliders, lamps */
    for (const p of D.props)
      b.prop(p.shape, px(D, p.x), pz(D, p.z), p.sx, p.sy, p.sz, p.c, {
        y: floorY(D, p.x, p.z) + p.y, ry: p.ry, rz: p.rz, glow: p.glow ? 3 : 1, solid: p.solid, loose: p.loose, mat: p.mat,
        ...(p.pw ? { pw: p.pw, pc: p.pc ?? D.c } : {}),
      });
    for (const [x0, z0, x1, z1, lo, hi] of D.cols) {
      const y = floorY(D, (x0 + x1) / 2, (z0 + z1) / 2);
      b.collider(px(D, (x0 + x1) / 2), pz(D, (z0 + z1) / 2), x1 - x0, hi - lo, z1 - z0, y + lo);
    }
    /* what the later steps need */
    for (const it of D.items) b.item(it.id, px(D, it.x), floorY(D, it.x, it.z) + it.y, pz(D, it.z), it.n, it.on);
    for (const L of D.lamps) b.lamp(px(D, L.x), floorY(D, L.x, L.z) + (L.h ?? 1), pz(D, L.z), L.r, L.c);
    for (const S of D.stains) b.stain(px(D, S.x), floorY(D, S.x, S.z), pz(D, S.z), S.r);
    for (const C of D.cams) b.camera(X(D, C.x), floorY(D, C.x * T, C.z * T) + C.h, Z(D, C.z), C.yaw, { fov: C.fov, range: C.range, circuit: C.c, zone: C.zone });
    for (const S of D.speakers) b.speaker(S.zone, X(D, S.x), floorY(D, S.x * T, S.z * T), Z(D, S.z), S.pa ? { pa: S.pa } : {});
    for (const nt of D.notes) b.note(nt.key, px(D, nt.x), floorY(D, nt.x, nt.z) + nt.y, pz(D, nt.z));
    for (const m of D.muts) b.mutant(m.type, X(D, m.x), floorY(D, m.x * T, m.z * T), Z(D, m.z), m.o);
    for (const u of D.uses) b.use(u.kind, X(D, u.x), floorY(D, u.x * T, u.z * T) + u.y, Z(D, u.z), u.o);
    for (const [name, [ax, az, yaw]] of Object.entries(D.marks)) b.mark(name, X(D, ax), floorY(D, ax * T, az * T), Z(D, az), yaw);
  }
  if (start) b.start(X(decks[0], start[0]), Z(decks[0], start[1]), start[2]);
  const level = b.finish();
  cur = null;
  return level;
}


/* A deck's caves of any outline: each a room carved tile by tile (from just under its floor to just over its roof there),
   all of them under one floor and one roof, masked to their tiles. One surface, so where two caves meet the floor and
   the roof run on without a seam; a roof's height over a corner is the floor there, plus the tallest headroom of the
   caves that share the corner, plus the ceiling field. Their palette and materials are the first cave's. */
function shapedCaves(b: LevelBuilder, D: Deck): void {
  const S = D.rooms.filter(R => R.shaped && R.w > 0);
  if (!S.length) return;
  const W = D.W, W1 = W + 1, ids = new Set(S.map(R => R.id)), q = 0.25;
  let i0 = Infinity, j0 = Infinity, i1 = -Infinity, j1 = -Infinity;
  for (const R of S) { i0 = Math.min(i0, R.x); j0 = Math.min(j0, R.y); i1 = Math.max(i1, R.x + R.w); j1 = Math.max(j1, R.y + R.h); }
  const nx = i1 - i0 + 1, nz = j1 - j0 + 1, mask: number[] = new Array((nx - 1) * (nz - 1)).fill(0), ht = new Float32Array(nx * nz);
  for (let j = j0; j < j1; j++)
    for (let i = i0; i < i1; i++) {
      const r = D.rm[j * W + i];
      if (!ids.has(r)) continue;
      mask[(j - j0) * (nx - 1) + (i - i0)] = 1;
      for (const [di, dj] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const c = (j - j0 + dj) * nx + (i - i0 + di); ht[c] = Math.max(ht[c], D.rooms[r].ht); }
    }
  const hf = field(D, 'hf'), cf = field(D, 'cf');
  const fl: number[] = [], cl: number[] = [];
  for (let j = 0; j < nz; j++)
    for (let i = 0; i < nx; i++) {
      const c = (j + j0) * W1 + i + i0, f = D.y0 + hf[c];
      fl.push(f); cl.push(f + ht[j * nx + i] + cf[c]);
    }
  /* carve each cave's tiles, and find how far the surfaces reach */
  let lo = Infinity, hi = -Infinity;
  for (const R of S) {
    const lw = R.w, lz = R.h, clo: number[] = [], chi: number[] = [];
    for (let j = R.y; j < R.y + R.h; j++)
      for (let i = R.x; i < R.x + R.w; i++) {
        if (D.rm[j * W + i] !== R.id) { clo.push(0); chi.push(0); continue; }
        const cs = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([di, dj]) => (j - j0 + dj) * nx + (i - i0 + di));
        const f = Math.min(...cs.map(c => fl[c])), c = Math.max(...cs.map(k => cl[k]));
        clo.push(Math.floor((f - 0.01) / q) * q); chi.push(Math.ceil((c + 0.01) / q) * q);
        lo = Math.min(lo, f); hi = Math.max(hi, c);
      }
    const ylo = Math.min(...clo.filter((v, k) => v < chi[k])), yhi = Math.max(...chi.filter((v, k) => clo[k] < v));
    const x0 = D.org[0] + R.x * T, z0 = D.org[1] + R.y * T;
    const r = b.room(R.name, x0, z0, x0 + lw * T, z0 + lz * T, {
      pal: { fl: R.fl, wl: R.wl, st: R.st }, lit: R.lit, lc: R.lc, em: R.em, circuit: R.c, flick: R.flick,
      nolamp: true, plain: true, safe: R.safe, noroam: R.noroam, y0: ylo, ht: yhi - ylo, motes: R.motes, mat: R.mat,
    });
    r.cells = { res: T, nx: lw, nz: lz, lo: clo, hi: chi };
  }
  const x0 = D.org[0] + i0 * T, z0 = D.org[1] + j0 * T, x1 = D.org[0] + i1 * T, z1 = D.org[1] + j1 * T, P0 = S[0];
  b.lattice('floor', x0, z0, x1, z1, T, nx, nz, fl, Math.floor(lo / q) * q - q, P0.fl, P0.mat.floor, mask);
  b.lattice('ceiling', x0, z0, x1, z1, T, nx, nz, cl, Math.ceil(hi / q) * q + q, scale3(hex(P0.wl), 0.6), P0.mat.ceiling, mask);
}
