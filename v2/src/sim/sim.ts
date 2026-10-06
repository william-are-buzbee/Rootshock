import type { LevelDef, StationDef } from '../content/types';
import { Rng } from '../core/rng';
import { STEP } from '../core/loop';
import { World } from '../world/world';
import { clamp } from '../core/math';
import { Lighting } from '../world/light';
import { castBodies, castMovers, makeCast, updateCast, type Mutant } from './cast';
import { makeHands, updateHands, type Hands } from './combat';
import { makeFields, refreshFields, updateFields, type Fields } from './fields';
import { hurt, makeGame, makeNoise, power, runLight, toggleLight, unwear, useItem, type Command, type Game, type StationState, say, sfx } from './game';
import type { Input } from './input';
import { buildUsables, findUsable, itemUse, padKey, type Usable, type WorldItem } from './interact';
import { LooseSet, makeLoose } from './loose';
import { makeDoor, makePlatform, updateDoor, updatePlatform, type Door, type Platform, type Rider } from './movers';
import { airFor, eyeHeight, makePlayer, updatePlayer, type Player } from './player';

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
  /** what lives here */
  cast: Mutant[];
  /** how far everything is from you, for the cast; null on a level with no cast */
  fields: Fields | null;
  hands: Hands;
  /** worms close about you: two together will bite */
  wormN: number;
  /** the light as it is now, for being seen; made again when the power changes */
  lighting: Lighting | null;
}

export interface SimOpts {
  /** the run's seed: the keypad codes, and anything else drawn at random during play */
  seed?: number | string;
  /** the station this level belongs to: its circuits and ladderways. Without one, everything is powered. */
  station?: StationDef;
  /** another level of the same run: its game (what you carry and know, the power) and its draws of chance */
  game?: Game;
  rng?: Rng;
}

export function makeSim(level: LevelDef, o: SimOpts = {}): Sim {
  const world = new World(level), s = level.start, rng = o.rng ?? new Rng(o.seed ?? level.seed);
  const loose = new LooseSet(level.props.filter(p => p.loose).map(p => makeLoose(world, p)), world);
  const station: StationState | null = o.station ? {
    circuits: structuredClone(o.station.circuits), ladders: structuredClone(o.station.ladders), main: o.station.main, fuseIn: false,
    names: { ...o.station.names }, built: o.station.levels.map(l => l.id),
  } : null;
  const sim: Sim = {
    tick: 0, world, loose, rng, game: o.game ?? makeGame(rng, station),
    player: makePlayer(world, s.x, s.y, s.z, s.yaw),
    doors: level.doors.map(d => makeDoor(world, d)),
    platforms: level.platforms.map(p => makePlatform(world, p)),
    items: level.items.map(it => ({ ...it, taken: false })),
    usables: [], focus: null, cast: [], fields: null, hands: makeHands(), wormN: 0, lighting: null,
  };
  sim.usables = buildUsables(sim);
  sim.cast = makeCast(sim, level.mutants);
  if (sim.cast.length) { sim.fields = makeFields(sim); refreshFields(sim, sim.fields); }
  if (!o.game && o.station && level.id === o.station.start && o.station.intro) say(sim.game, o.station.intro);
  return sim;
}

/** everything a mover can carry or must not crush */
export function riders(sim: Sim): Rider[] {
  return [sim.player.body, ...sim.loose.all, ...castBodies(sim)];
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
    case 'unwear': unwear(g, c.id); break;
    case 'pad': padKey(g, sim, c.key); break;
    case 'padClose': g.pad = null; break;
    case 'read': if (g.notes[c.key]) { g.events.push({ type: 'note', key: c.key }); sfx(g, 'paper'); } break;
    case 'lift': {
      const here = sim.world.def.id;
      if (c.level === here) break;
      if (!g.station?.built.includes(c.level)) { say(g, (g.station?.names[c.level] ?? 'That level') + ' is not built in v2 yet.'); break; }
      g.travel = { level: c.level, mark: 'lift' };
      break;
    }
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
  const rs = riders(sim), b = sim.player.body, movers = [b, ...castMovers(sim)], n0 = g.events.length;
  for (const d of sim.doors) {
    if (updateDoor(d, rs, movers, power(g, d.def.circuit), STEP)) sfx(g, 'door', { x: (d.def.x0 + d.def.x1) / 2, z: (d.def.z0 + d.def.z1) / 2 });
  }
  for (const p of sim.platforms) {
    /* it lands with a thud and rattles on the way */
    const how = updatePlatform(p, rs, STEP), at = { x: (p.def.x0 + p.def.x1) / 2, z: (p.def.z0 + p.def.z1) / 2 };
    if (how === 'arrived') sfx(g, 'thud', at);
    else if (how === 'moving' && sim.rng.chance(STEP * 6)) sfx(g, 'hstep', at, true);
  }

  /* take a rebreather off under water and you have what is in your lungs */
  sim.player.airMax = airFor(g.worn);
  sim.player.air = Math.min(sim.player.air, sim.player.airMax);
  const { stride, hit } = updatePlayer(sim.world, sim.player, input, STEP);
  /* walking into something loose shoves it */
  if (hit && hit !== 'world' && hit.kind === 'loose') {
    const o = sim.loose.all.find(q => q.dyn === hit), len = Math.hypot(stride.dx, stride.dz);
    if (o && len > 0) sim.loose.push(o, stride.dx / len, stride.dz / len, stride.speed * 0.9, sim.tick);
  }
  /* falls hurt (as before: past 10 m/s, 6 a metre a second); breath that runs out hurts more */
  const p = sim.player;
  if (p.impact > 10) { hurt(g, (p.impact - 10) * 6, 'It was further down than it looked.', 0.5); makeNoise(g, 8); }
  else if (p.impact > 4) { sfx(g, 'step'); makeNoise(g, 5); }
  if (p.air <= 0) hurt(g, 14 * STEP, 'Your chest made the decision for you, and the water came in.', 0, false); // quietly
  if (p.jumped) makeNoise(g, 3);
  /* your own footsteps, as before: a step every 1.7 m (2.3 running), quieter walking, none crouched; water sloshes */
  const wet = p.water !== 'dry';
  p.stepD += p.moved;
  if (p.stepD > (wet ? 1.3 : p.running ? 2.3 : 1.7)) {
    p.stepD = 0;
    if (wet) sfx(g, 'slosh');
    else if (!p.crouch) sfx(g, 'step', undefined, false, p.running ? 0 : 8);
  }
  /* what you are doing carries this far: walking, more running, nothing creeping; a loud thing lingers half a second */
  if (g.noiseT > 0) g.noiseT -= STEP; else g.noiseI = 0;
  const steps = p.moved > 1e-3 ? (p.water === 'swimming' ? 3 : p.water === 'wading' ? 5 : p.crouch ? 0 : p.running ? 9 : 4) : 0;
  updateHands(sim, input);
  g.noise = Math.max(steps, g.noiseI);

  if (input.light) toggleLight(g, null, underWater(sim));
  runLight(g, STEP, underWater(sim));
  /* how easily you are seen: the light you stand in, your own, and crouching */
  if (sim.cast.length) {
    sim.lighting ??= new Lighting(sim.world, c => power(g, c));
    const c = sim.lighting.atPoint(b.x, b.y + 0.5, b.z), lum = Math.max(c[0], c[1], c[2]);
    g.vis = clamp(0.3 + lum * 0.8 + (g.lightOn ? 0.35 : 0), 0.3, 1.3) * (p.crouch ? 0.6 : 1);
  }
  if (sim.fields) updateFields(sim, sim.fields);
  updateCast(sim);
  sim.loose.update(STEP, sim.tick, rs);

  const f = findUsable(sim);
  sim.focus = f ? { text: f.text } : null;
  if (input.use && f) f.act();
  /* the power changed: the light is made again; Gen-1 coming up is heard all over the floor and felt, anything less clunks */
  for (let i = n0; i < g.events.length; i++) {
    const e = g.events[i];
    if (e.type !== 'power') continue;
    sim.lighting = null;
    if (e.loud) { makeNoise(g, 30); g.events.push({ type: 'shake', k: 0.4 }); }
    else sfx(g, 'door');
  }
}

