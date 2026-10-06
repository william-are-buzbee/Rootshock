import type { LevelDef } from '../content/types';
import { NOTES } from '../content/notes';
import { Rng } from '../core/rng';
import { syncBody } from './body';
import { restoreRoute } from './cast';
import type { Game } from './game';
import { buildUsables, type WorldItem } from './interact';
import { doorBox, placePlatform } from './movers';
import { makeSim, type Sim, type SimOpts } from './sim';

/* Save and load (engine.md §10). A save is plain data: everything in the sim that can change, by name or by the order
   it was made in (a level loaded twice makes the same things in the same order). The world itself is never saved;
   it is built again from the level. Fields over the nav graph are made again on load; a line of sight is looked along
   again. Loaded, a run plays on exactly as it would have. */

export const SAVE_VERSION = 1;

/** copy the named fields of an object */
const pick = <T extends object, K extends keyof T>(o: T, keys: readonly K[]): Pick<T, K> => {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = structuredClone(o[k]);
  return out;
};
const put = <T extends object>(o: T, data: Partial<T>): void => { Object.assign(o, structuredClone(data)); };

const GAME = ['inv', 'cap', 'tools', 'keys', 'worn', 'weapon', 'read', 'code', 'code2', 'hp', 'batt', 'light', 'lightOn', 'pad',
  'ended', 'time', 'noise', 'noiseI', 'noiseT', 'vis', 'once', 'kills', 'god'] as const;
const PLAYER = ['yaw', 'pitch', 'crouch', 'wantStand', 'moved', 'impact', 'water', 'air', 'airMax', 'under', 'slow', 'kx', 'kz',
  'running', 'jumped', 'stepD', 'fly'] as const;
const BODY = ['x', 'y', 'z', 'vy', 'h', 'ground'] as const;
const DOOR = ['t', 'open', 'unlocked', 'hold'] as const;
const PLATFORM = ['y', 'target', 'wait', 'moving', 'armed'] as const;
const LOOSE = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'awake', 'ground', 'still', 'woke'] as const;
const MUTANT = ['x', 'y', 'z', 'px', 'py', 'pz', 'yaw', 'state', 'st', 'cd', 'stun', 'hp', 'post', 'wt', 'wm', 'wx', 'wz', 'tk',
  'lost', 'bt', 'burst', 'flee', 'ct', 'cdir', 'tgt', 'grab', 'tense', 'wind', 'windT', 'stk', 'fled', 'side', 'spot', 'mv',
  'hit', 'ph', 'dead', 'gone', 'dest', 'los', 'losAt', 'still'] as const;

/** what a rider stands on, by the moving thing's id */
const onId = (r: { on: { id: number } | null }) => r.on?.id ?? 0;

export interface Save {
  v: number;
  level: string;
  tick: number;
  rng: number;
  game: Partial<Game> & { station: Game['station'] };
  player: Record<string, unknown>;
  body: Record<string, unknown>;
  doors: Record<string, unknown>[];
  platforms: Record<string, unknown>[];
  loose: Record<string, unknown>[];
  items: WorldItem[];
  /** usables turned off that are not items (bodies searched), by key */
  spent: string[];
  cast: Record<string, unknown>[];
  hands: Sim['hands'];
  /** what each rider stands on (by id): the player, the loose things, the cast, in that order */
  on: number[];
  /** the fields over the nav graph as they stood (they are made in turn, so cannot be made again exactly) */
  fields: { from: number; turn: number; made: Record<string, string>; crawl: string; hands: string; big: string; sound: string } | null;
}

/* a float array as text, exactly */
const pack = (a: Float32Array): string => {
  const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};
const unpack = (s: string, into: Float32Array): void => {
  const t = atob(s), b = new Uint8Array(into.buffer, into.byteOffset, into.byteLength);
  if (t.length !== b.length) throw new Error('save does not fit this level\'s nav graph');
  for (let i = 0; i < b.length; i++) b[i] = t.charCodeAt(i);
};

export function save(sim: Sim): Save {
  const g = sim.game;
  return {
    v: SAVE_VERSION,
    level: sim.world.def.id,
    tick: sim.tick,
    rng: sim.rng.state(),
    game: { ...pick(g, GAME), station: structuredClone(g.station) },
    player: pick(sim.player, PLAYER),
    body: pick(sim.player.body, BODY),
    doors: sim.doors.map(d => pick(d, DOOR)),
    platforms: sim.platforms.map(p => pick(p, PLATFORM)),
    loose: sim.loose.all.map(o => pick(o, LOOSE)),
    items: structuredClone(sim.items),
    spent: sim.usables.filter(u => u.off && u.key).map(u => u.key!),
    cast: sim.cast.map(m => ({ ...pick(m, MUTANT), ride: structuredClone(m.ride), body: m.body ? pick(m.body, BODY) : null })),
    hands: structuredClone(sim.hands),
    on: [sim.player.body, ...sim.loose.all, ...sim.cast.map(m => m.body)].map(r => (r ? onId(r) : 0)),
    fields: sim.fields && {
      from: sim.fields.from, turn: sim.fields.turn, made: { ...sim.fields.made },
      crawl: pack(sim.fields.crawl), hands: pack(sim.fields.hands), big: pack(sim.fields.big), sound: pack(sim.fields.sound),
    },
  };
}

/** a sim of `level` as the save left it */
export function load(level: LevelDef, data: Save, o: SimOpts = {}): Sim {
  /* a level of a run that is not the one you are on shares the run's game and chance: those are not this save's to set */
  const shared = !!o.game;
  if (data.v !== SAVE_VERSION) throw new Error(`save version ${data.v}, expected ${SAVE_VERSION}`);
  if (data.level !== level.id) throw new Error(`save is of ${data.level}, not ${level.id}`);
  const sim = makeSim(level, o), g = sim.game;
  g.events.length = 0; // what it said as it began was said long ago
  sim.tick = data.tick;
  if (!shared) {
    sim.rng = new Rng(data.rng);
    put(g, data.game as Partial<Game>);
    g.notes = NOTES(g.code, g.code2);
  }

  put(sim.player, data.player as never);
  put(sim.player.body, data.body as never);
  syncBody(sim.player.body);
  sim.doors.forEach((d, i) => { put(d, data.doors[i] as never); Object.assign(d.dyn, doorBox(d, d.t)); });
  sim.platforms.forEach((p, i) => { put(p, data.platforms[i] as never); placePlatform(p); });
  sim.loose.all.forEach((q, i) => { put(q, data.loose[i] as never); q.sync(); });

  /* what lies about, what has been taken, and what has been used up */
  sim.items = structuredClone(data.items);
  sim.usables = buildUsables(sim);
  const spent = new Set(data.spent);
  for (const u of sim.usables) if (u.key && spent.has(u.key)) u.off = true;
  sim.cast.forEach((m, i) => {
    const { body, ride, ...own } = data.cast[i];
    put(m, own as never);
    m.ride = structuredClone(ride as typeof m.ride) ?? null;
    if (m.body) {
      put(m.body, body as never);
      syncBody(m.body);
      if (m.dead) { const k = sim.world.dyn.indexOf(m.body.dyn); if (k >= 0) sim.world.dyn.splice(k, 1); }
    }
  });
  sim.hands = structuredClone(data.hands);
  sim.lighting = null;
  const F = sim.fields, d = data.fields;
  if (F && d) {
    F.from = d.from; F.turn = d.turn; F.made = { ...d.made };
    unpack(d.crawl, F.crawl); unpack(d.hands, F.hands); unpack(d.big, F.big); unpack(d.sound, F.sound);
  }
  for (const m of sim.cast) restoreRoute(sim, m);
  const byId = new Map(sim.world.dyn.map(d => [d.id, d]));
  [sim.player.body, ...sim.loose.all, ...sim.cast.map(m => m.body)].forEach((r, i) => { if (r) r.on = byId.get(data.on[i]) ?? null; });
  return sim;
}
