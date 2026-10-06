import type { StationDef } from './types';
import { buildUpper } from './levels/upper';
import { buildMain } from './levels/main';
import { buildPlant } from './levels/plant';

/* The station: its levels top to bottom, its circuits, its ladderways. Ported from NEWSTATION in the first engine.
   Levels not yet ported (main, plant, the sump, the cave) are added here as they are (engine.md §13, step 8). */

const ladders: StationDef['ladders'] = {
  A1: { say: 'Fifty metres of ladder down the main shaft, in the dark.', ends: ['upper', 'main'] },
  A2: { broken: 'The ladderway is collapsed below this landing. Rubble fills the shaft.', ends: ['main', 'plant'] },
  CV: { say: 'Through root and broken concrete, and the station ends. Rock, and the sound of water.', ends: ['main', 'cave'] },
  A3: { say: 'Down the main shaft, and the last rungs go into black water.', ends: ['plant', 'sump'] },
  B2: { say: 'Fifty metres down the exhaust shaft, into the warm.', ends: ['main', 'plant'] },
  B1: { need: { power: 'CARGO', msg: 'A fan door is sealed over the ladderway. Its release runs off the Cargo backup set.' }, say: 'The exhaust shaft, rung over rung against the draught.', ends: ['upper', 'main'] },
};

export const STATION: StationDef = {
  levels: [
    { id: 'upper', name: 'Upper station', circuit: 'OPS', build: () => buildUpper(ladders) },
    { id: 'main', name: 'Main level', circuit: 'RES', build: () => buildMain(ladders) },
    { id: 'plant', name: 'Plant level', circuit: 'ENG', build: () => buildPlant(ladders) },
  ],
  circuits: {
    OPS: { on: true, back: true, tag: 'upper station' },
    RES: { on: true, back: false, tag: 'main level' },
    ENG: { on: true, back: false, tag: 'plant level' },
    HYD: { on: true, back: false, broken: true, tag: 'the sump' },
    LIFT: { on: true, back: false },
    CARGO: { on: false, back: false, tag: 'Cargo' },
    HORT: { on: true, back: true, tag: 'Horticulture' },
  },
  ladders,
  /* "This morning the main generator dropped." */
  main: false,
  start: 'upper',
  intro: 'Gen-1 has dropped. The lock on your cell has let go.',
  names: { upper: 'Upper station', main: 'Main level', plant: 'Plant level', sump: 'The sump', sumpdeep: 'The sump, drowned', cave: 'The cave' },
};
