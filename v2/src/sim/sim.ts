import type { LevelDef } from '../content/types';
import { Rng } from '../core/rng';
import { STEP } from '../core/loop';
import { World } from '../world/world';
import type { Input } from './input';
import { LooseSet, makeLoose } from './loose';
import { makeDoor, makePlatform, updateDoor, updatePlatform, type Door, type Platform, type Rider } from './movers';
import { makePlayer, updatePlayer, type Player } from './player';

/* The simulation: everything that is true about the game, advanced one fixed step at a time.
   Nothing here touches three.js or the page (engine.md §3). */
export interface Sim {
  tick: number;
  world: World;
  player: Player;
  doors: Door[];
  platforms: Platform[];
  loose: LooseSet;
  rng: Rng;
}

export function makeSim(level: LevelDef, seed: number | string = level.seed): Sim {
  const world = new World(level), s = level.start;
  const loose = new LooseSet(level.props.filter(p => p.loose).map(p => makeLoose(world, p)), world);
  return {
    tick: 0, world, loose, rng: new Rng(seed),
    player: makePlayer(world, s.x, s.y, s.z, s.yaw),
    doors: level.doors.map(d => makeDoor(world, d)),
    platforms: level.platforms.map(p => makePlatform(world, p)),
  };
}

/** everything a mover can carry or must not crush */
export function riders(sim: Sim): Rider[] {
  return [sim.player.body, ...sim.loose.all];
}

export function step(sim: Sim, input: Input): void {
  sim.tick++;
  const rs = riders(sim);
  for (const d of sim.doors) updateDoor(d, rs, STEP);
  for (const p of sim.platforms) updatePlatform(p, rs, STEP);

  const { stride, hit } = updatePlayer(sim.world, sim.player, input, STEP);
  /* walking into something loose shoves it */
  if (hit && hit !== 'world' && hit.kind === 'loose') {
    const o = sim.loose.all.find(q => q.dyn === hit), len = Math.hypot(stride.dx, stride.dz);
    if (o && len > 0) sim.loose.push(o, stride.dx / len, stride.dz / len, stride.speed * 0.9, sim.tick);
  }
  sim.loose.update(STEP, sim.tick, rs);
}
