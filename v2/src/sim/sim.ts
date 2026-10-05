import type { LevelDef, StationDef } from '../content/types';
import { Rng } from '../core/rng';
import { STEP } from '../core/loop';
import { World } from '../world/world';
import { hurt, makeGame, power, runLight, toggleLight, useItem, type Command, type Game, type StationState, say, sfx } from './game';
import type { Input } from './input';
import { buildUsables, findUsable, itemUse, padKey, type Usable, type WorldItem } from './interact';
import { LooseSet, makeLoose } from './loose';
import { makeDoor, makePlatform, updateDoor, updatePlatform, type Door, type Platform, type Rider } from './movers';
import { eyeHeight, makePlayer, updatePlayer, type Player } from './player';

/* The simulation: everything that is true about the game, advanced one fixed step at a time.
   Nothing here touches three.js or the page (engine.md §3). */
export interface Sim {
  tick: number;
  world: World;
  player: Player;
  doors: Door[];
  platforms: Platform[];
  loose: LooseSet;
  items: WorldItem[];
  usables: Usable[];
  /** what you are looking at that can be used, and what it says */
  focus: { text: string } | null;
  game: Game;
  rng: Rng;
}

export interface SimOpts {
  /** the run's seed: the keypad codes, and anything else drawn at random during play */
  seed?: number | string;
  /** the station this level belongs to: its circuits and ladderways. Without one, everything is powered. */
  station?: StationDef;
}

export function makeSim(level: LevelDef, o: SimOpts = {}): Sim {
  const world = new World(level), s = level.start, rng = new Rng(o.seed ?? level.seed);
  const loose = new LooseSet(level.props.filter(p => p.loose).map(p => makeLoose(world, p)), world);
  const station: StationState | null = o.station ? {
    circuits: JSON.parse(JSON.stringify(o.station.circuits)), ladders: JSON.parse(JSON.stringify(o.station.ladders)), main: o.station.main, fuseIn: false,
  } : null;
  const sim: Sim = {
    tick: 0, world, loose, rng, game: makeGame(rng, station),
    player: makePlayer(world, s.x, s.y, s.z, s.yaw),
    doors: level.doors.map(d => makeDoor(world, d)),
    platforms: level.platforms.map(p => makePlatform(world, p)),
    items: level.items.map(it => ({ ...it, taken: false })),
    usables: [], focus: null,
  };
  sim.usables = buildUsables(sim);
  return sim;
}

/** everything a mover can carry or must not crush */
export function riders(sim: Sim): Rider[] {
  return [sim.player.body, ...sim.loose.all];
}

const underWater = (sim: Sim) => {
  const b = sim.player.body;
  return b.y + eyeHeight(sim.player) < sim.world.waterAt(b.x, b.z);
};

/** what the menus asked for since the last step */
function command(sim: Sim, c: Command): void {
  const g = sim.game, b = sim.player.body;
  switch (c.type) {
    case 'use': useItem(g, c.slot); break;
    case 'drop': {
      const s = g.inv[c.slot];
      if (!s) return;
      g.inv.splice(c.slot, 1);
      if (g.weapon === s.id) g.weapon = null;
      let x = b.x - Math.sin(sim.player.yaw) * 0.7, z = b.z - Math.cos(sim.player.yaw) * 0.7;
      if (sim.world.solidAt(x, b.y + 0.1, z)) { x = b.x; z = b.z; }
      const it: WorldItem = { id: s.id, n: s.n, x, y: sim.world.groundBelow({ x, z, hx: 0.1, hz: 0.1, round: true }, b.y + 0.5), z, taken: false, raw: true };
      sim.items.push(it);
      sim.usables.push(itemUse(sim, it)); // only the new thing: rebuilding all would forget what was searched

      sfx(g, 'step');
      break;
    }
    case 'light': toggleLight(g, c.tool, underWater(sim)); break;
    case 'pad': padKey(g, sim, c.key); break;
    case 'padClose': g.pad = null; break;
    case 'read': if (g.notes[c.key]) g.events.push({ type: 'note', key: c.key }); break;
    case 'lift': say(g, 'The lift goes nowhere yet: no other level is built in v2.'); break;
  }
}

/** apply what the menus asked for. The world does not move while a menu is open; this alone runs then. */
export function applyCommands(sim: Sim): void {
  for (const c of sim.game.commands.splice(0)) command(sim, c);
}

export function step(sim: Sim, input: Input): void {
  const g = sim.game;
  applyCommands(sim);
  if (g.ended) return;
  sim.tick++;
  g.time += STEP;
  const rs = riders(sim), b = sim.player.body;
  for (const d of sim.doors) {
    if (updateDoor(d, rs, [b], power(g, d.def.circuit), STEP)) sfx(g, 'door', { x: (d.def.x0 + d.def.x1) / 2, z: (d.def.z0 + d.def.z1) / 2 });
  }
  for (const p of sim.platforms) updatePlatform(p, rs, STEP);

  const { stride, hit } = updatePlayer(sim.world, sim.player, input, STEP);
  /* walking into something loose shoves it */
  if (hit && hit !== 'world' && hit.kind === 'loose') {
    const o = sim.loose.all.find(q => q.dyn === hit), len = Math.hypot(stride.dx, stride.dz);
    if (o && len > 0) sim.loose.push(o, stride.dx / len, stride.dz / len, stride.speed * 0.9, sim.tick);
  }
  /* falls hurt (as before: past 10 m/s, 6 a metre a second); breath that runs out hurts more */
  const p = sim.player;
  if (p.impact > 10) { hurt(g, (p.impact - 10) * 6, 'It was further down than it looked.'); sfx(g, 'thud'); }
  else if (p.impact > 4) sfx(g, 'step');
  if (p.air <= 0) hurt(g, 14 * STEP, 'Your chest made the decision for you, and the water came in.');

  if (input.light) toggleLight(g, null, underWater(sim));
  runLight(g, STEP, underWater(sim));
  sim.loose.update(STEP, sim.tick, rs);

  const f = findUsable(sim);
  sim.focus = f ? { text: f.text } : null;
  if (input.use && f) f.act();
}

