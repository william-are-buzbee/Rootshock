import type { LevelDef } from '../content/types';
import { Rng } from '../core/rng';
import { STEP } from '../core/loop';
import { World } from '../world/world';
import type { Input } from './input';
import { makePlayer, updatePlayer, type Player } from './player';

/* The simulation: everything that is true about the game, advanced one fixed step at a time.
   Nothing here touches three.js or the page (engine.md §3). */
export interface Sim {
  tick: number;
  world: World;
  player: Player;
  rng: Rng;
}

export function makeSim(level: LevelDef, seed: number | string = level.seed): Sim {
  const world = new World(level), s = level.start;
  return { tick: 0, world, player: makePlayer(s.x, s.y, s.z, s.yaw), rng: new Rng(seed) };
}

export function step(sim: Sim, input: Input): void {
  sim.tick++;
  updatePlayer(sim.world, sim.player, input, STEP);
}
