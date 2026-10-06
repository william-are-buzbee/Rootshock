import type { CircuitDef, LadderDef } from '../content/types';
import { ITEMS, keyName } from '../content/items';
import { NOTES, type Note } from '../content/notes';
import type { Rng } from '../core/rng';
import type { PowerLevel } from '../world/light';

/* The game's state beyond bodies and space: power, what you carry and know, your health, your light. It is all plain
   data, so a save can write it out (step 7). What happens is reported as events for the presentation to show and play;
   what the player asks of the menus comes back in as commands, applied at the start of the next step, so a run stays a
   sequence of inputs that can be replayed. */

export interface Slot { id: string; n: number }

export type SimEvent =
  | { type: 'say'; text: string }
  | { type: 'sfx'; name: string; x?: number; z?: number; big?: boolean }
  | { type: 'note'; key: string }
  | { type: 'pad' }
  | { type: 'lift' }
  | { type: 'power'; loud: boolean }
  | { type: 'end'; win: boolean; msg: string };

export type Command =
  | { type: 'use'; slot: number }
  | { type: 'drop'; slot: number }
  | { type: 'light'; tool: string }
  | { type: 'pad'; key: string }
  | { type: 'padClose' }
  | { type: 'lift'; level: string }
  | { type: 'read'; key: string };

export interface StationState {
  circuits: Record<string, CircuitDef>;
  ladders: Record<string, LadderDef>;
  /** Gen-1 is running */
  main: boolean;
  /** a fuse is in Gen-1's socket */
  fuseIn: boolean;
}

export interface Game {
  station: StationState | null;
  inv: Slot[];
  cap: number;
  tools: string[];
  keys: string[];
  worn: string[];
  weapon: string | null;
  notes: Record<string, Note>;
  read: string[];
  code: string;
  code2: string;
  hp: number;
  /** charge left in the light's battery, 0..100 */
  batt: number;
  /** which light is in hand, and whether it is on */
  light: string | null;
  lightOn: boolean;
  /** the keypad in front of you: what it wants, what you have typed, which door */
  pad: { code: string; typed: string; door: number } | null;
  ended: { win: boolean; msg: string } | null;
  time: number;
  events: SimEvent[];
  commands: Command[];
}

export function makeGame(rng: Rng, station: StationState | null): Game {
  const code = String(1000 + rng.int(9000)), code2 = String(1000 + rng.int(9000));
  return {
    station, inv: [], cap: 10, tools: [], keys: [], worn: [], weapon: null, notes: NOTES(code, code2), read: [], code, code2,
    hp: 100, batt: 100, light: null, lightOn: false, pad: null, ended: null, time: 0, events: [], commands: [],
  };
}

/** the power on a circuit: 2 fed by Gen-1, 1 its backup set, 0 dead. A level with no station (the test bed) is all lit. */
export function power(g: Game, c: string): PowerLevel {
  const s = g.station;
  if (!s) return 2;
  const C = s.circuits[c];
  if (!C) return 0;
  if (s.main && C.on && !C.broken) return 2;
  return C.back ? 1 : 0;
}

export const say = (g: Game, text: string): void => { g.events.push({ type: 'say', text }); };
export const sfx = (g: Game, name: string, at?: { x: number; z: number }, big?: boolean): void => {
  g.events.push({ type: 'sfx', name, x: at?.x, z: at?.z, big });
};

export const has = (g: Game, id: string): boolean => g.tools.includes(id) || g.inv.some(s => s.id === id);

export function consume(g: Game, i: number): void {
  const s = g.inv[i];
  if (--s.n <= 0) {
    g.inv.splice(i, 1);
    if (g.weapon === s.id) g.weapon = null;
  }
}

export function giveKey(g: Game, k: string): void {
  if (!g.keys.includes(k)) g.keys.push(k);
  say(g, keyName(k) + '.');
}

/** take something: into your hands, onto you, or into what you know. False if your hands are full. */
export function give(g: Game, id: string, n = 1): boolean {
  const it = ITEMS[id];
  if (!it) return false;
  if (it.key) { if (!g.keys.includes(it.key)) g.keys.push(it.key); say(g, it.n + '.'); return true; }
  if (it.per) n *= it.per;
  if (it.worn) {
    if (!g.worn.includes(id)) g.worn.push(id);
    say(g, id === 'goggles' ? 'Swim goggles. You will be able to see under water.' : id === 'rebreather' ? 'Rebreather. Four times the air.' : it.n + '. You put it on.');
    return true;
  }
  if (it.tool) {
    if (!g.tools.includes(id)) g.tools.push(id);
    if (!g.light) g.light = id;
    say(g, id === 'flash' ? 'Flashlight. F switches it.' : 'Dive lantern. A small circle of light all round you, and the only kind that works under water. F switches it.');
    return true;
  }
  const s = g.inv.find(q => q.id === id);
  if (s && it.stack) { s.n += n; say(g, it.n + (n > 1 ? ' ×' + n : '') + '.'); return true; }
  if (g.inv.length >= g.cap) { say(g, 'Your hands are full. Tab, and put something down.'); return false; }
  g.inv.push({ id, n });
  say(g, it.n + (n > 1 ? ' ×' + n : '') + '.');
  if (it.w && !g.weapon) g.weapon = id;
  return true;
}

export function readNote(g: Game, key: string): void {
  if (!g.notes[key]) return;
  if (!g.read.includes(key)) g.read.push(key);
  g.events.push({ type: 'note', key });
  sfx(g, 'paper');
}

/** F: switch the light in hand on or off, or switch to another light */
export function toggleLight(g: Game, want: string | null, underWater: boolean): void {
  if (want && has(g, want) && g.light !== want) { g.light = want; g.lightOn = false; }
  if (underWater && has(g, 'lantern')) g.light = 'lantern';
  if (!g.light || !has(g, g.light)) {
    g.light = has(g, 'flash') ? 'flash' : has(g, 'lantern') ? 'lantern' : null;
    if (!g.light) return;
  }
  if (!g.lightOn) {
    if (g.light === 'flash' && underWater) { say(g, 'The flashlight is dead in the water.'); sfx(g, 'deny'); return; }
    if (g.batt <= 0) {
      const i = g.inv.findIndex(s => s.id === 'batt');
      if (i < 0) { say(g, 'No batteries.'); return; }
      consume(g, i); g.batt = 100;
    }
  }
  g.lightOn = !g.lightOn;
  sfx(g, 'take');
}

/** a step of the light: the battery runs down, and a fresh one goes in when it dies, if you have one */
export function runLight(g: Game, dt: number, underWater: boolean): void {
  if (g.lightOn && g.light === 'flash' && underWater) { g.lightOn = false; sfx(g, 'deny'); say(g, 'The flashlight goes under and dies. It is not sealed.'); }
  if (!g.lightOn) return;
  g.batt -= (dt * 100) / (g.light === 'flash' ? 270 : 420);
  if (g.batt <= 0) {
    const i = g.inv.findIndex(s => s.id === 'batt');
    if (i >= 0) { consume(g, i); g.batt = 100; say(g, 'The light dies. You thumb in a fresh battery.'); }
    else { g.batt = 0; g.lightOn = false; say(g, 'The light is dead.'); }
  }
}

/** use what is in a slot: take a weapon in hand, eat, bandage, change a battery */
export function useItem(g: Game, i: number): void {
  const s = g.inv[i];
  if (!s) return;
  const it = ITEMS[s.id];
  if (it.w) g.weapon = g.weapon === s.id ? null : s.id;
  else if (it.heal) {
    if (g.hp >= 100) say(g, 'You are not hurt.');
    else { g.hp = Math.min(100, g.hp + it.heal); consume(g, i); sfx(g, 'eat'); }
  } else if (s.id === 'batt') {
    if (!has(g, 'flash') && !has(g, 'lantern')) say(g, 'Nothing to put it in.');
    else if (g.batt > 90) say(g, 'The light is still strong.');
    else { g.batt = 100; consume(g, i); say(g, 'Fresh battery.'); }
  } else if (s.id === 'fuse') say(g, 'It belongs in a generator.');
  else if (s.id === 'kit') say(g, 'It mends a broken service connection. One of them.');
  else if (it.per) say(g, 'Ammunition. It needs the gun.');
}

export function hurt(g: Game, dmg: number, why: string): void {
  if (g.ended) return;
  g.hp -= dmg;
  sfx(g, 'hurt');
  if (g.hp <= 0) { g.hp = 0; end(g, false, why); }
}

export function end(g: Game, win: boolean, msg: string): void {
  if (g.ended) return;
  g.ended = { win, msg };
  g.events.push({ type: 'end', win, msg });
}
