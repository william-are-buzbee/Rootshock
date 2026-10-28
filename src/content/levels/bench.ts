import { PI } from '../../core/math';
import type { LevelDef } from '../types';
import { beginLevel, bx, door, finishLevel, floor, room, use, type LevelInfo } from '../build/plan';
import { OFF, SEC, desk, tbl } from '../build/furnish';
import { bracket, climb, colonise, crown, engulf, grower, hang, knot, litter, runner, tobacco } from '../build/overgrowth';

/* A bench for the bush's growth (content/build/overgrowth.ts), not part of the station: ?level=bench. In Security's
   finish, all of it lit. North of the corridor, the kit laid out piece by piece, each with a look to say what it is:
   shelves out of the wall, two walls climbed, stalks young to old, a ceiling hung, leaf over the floor young to cured,
   a runner and its seedling, the mound where it takes, a desk and a chair grown over. South, an office it has
   colonised from its far corner; out of its door, the front coming along the corridor; and at the corridor's end a
   runner under the locker room's door, the first leaf in, the room past it still clean. */

export const BENCH: LevelInfo = { id: 'bench', name: 'The bench', c: 'BENCH' };

export function bench(): LevelDef {
  beginLevel(BENCH, {});
  const F = floor(BENCH), H = { ht: 3 };
  const say = (x: number, z: number, label: string, text: string) => use(F, 'look', x, z, 1, { label, text });

  /* the kit */
  room(F, 'Kit', 0, 0, 20, 10, { ...SEC, ...H });
  const g = grower('bench');
  /* shelves out of the north wall, small to large, and the knot they come out of */
  knot(F, 1.2, 0.25, 0.08, 0.3, g);
  bracket(F, 1.2, 0.5, 0.04, 0, 2, 0.24, g, { age: 0.2 });
  bracket(F, 2.2, 1.05, 0.04, 0, 3, 0.4, g, { age: 0.4 });
  bracket(F, 1.6, 1.75, 0.04, 0.15, 4, 0.6, g, { age: 0.6 });
  say(1.8, 1.2, 'Shelves', 'Leaf in shelves out of a woody knot, stacked the way a bracket fungus stacks: as it comes out of the changed, at whatever size the wall gives it. bracket(), knot()');
  /* the wall climbed: newly, and long since, in flower */
  climb(F, 4.6, 0, 's', 1.5, { w: 0.7, age: 0.05 });
  say(4.6, 1.2, 'Climbing, new', 'A stem up the wall, leaf pressed flat along it, a shelf out of a knot. climb(), young');
  climb(F, 7.6, 0, 's', 2.75, { w: 1.4, age: 0.55, bloom: true });
  say(7.6, 1.2, 'Climbing, old', 'Up to the ceiling and branching, more shelves low down, flowering at the top. climb(), old, in bloom');
  /* stalks up out of the floor, seedling to old */
  ([[10.6, 0.3, 0, false], [12, 0.75, 0.15, false], [13.6, 1.25, 0.3, false], [15.4, 1.75, 0.45, true], [17.6, 1.6, 0.85, true]] as const).forEach(([x, h, age, bl], k) => {
    tobacco(F, x, 2.2, h, { age, bloom: bl });
    say(x, 3.1, ['Seedling', 'Young stalk', 'Stalk', 'In flower', 'Old, curing'][k], ['Wild tobacco, rustica, a hand high: what a runner puts up where it ends.', 'Leaf up it, turned each from the last.', 'The lowest leaves largest and hanging heaviest.', 'Its pale yellow flowers, tubes with flared mouths, thrown out on short stalks.', 'The lowest leaf cured yellow and brown, the first to go; seed setting among the flowers.'][k] + ' tobacco()');
  });
  /* leaf over the floor: new, half cured, cured */
  ([[2.2, 0], [4.8, 0.45], [7.4, 0.9]] as const).forEach(([x, dry], k) => {
    litter(F, x, 6, 1, { dry });
    say(x, 6, ['Leaf, new', 'Leaf, curing', 'Leaf, cured'][k], 'Leaf grown and fallen over the floor, thicker toward the middle. litter(), ' + ['green', 'half cured', 'cured brown'][k]);
  });
  /* a ceiling hung with it, clear of the lights */
  hang(F, 12, 6, 3);
  say(12, 6, 'Hung', 'Out of a knot on the ceiling, runners over it after the air, and strands hung with leaf, as tobacco hangs in a barn to cure. hang()');
  /* a runner, and its seedling */
  runner(F, [[1.2, 8.9], [2.4, 8.6], [3.6, 8.75], [4.9, 8.4], [6.1, 8.55], [7.3, 8.2], [8.4, 8.35]], 0.12, 0.03, { leaf: 0.6, tip: true, g: grower('bench runner') });
  say(4.9, 8.4, 'Runner', 'What it spreads by: woody, half sunk in the floor, knuckled at its bends, putting up leaf; a seedling where it ends. runner()');
  /* where it takes */
  crown(F, 17.4, 6.6, 1);
  say(17.4, 5.4, 'Where it took', 'A mound of knots grown into each other, shelves stacked out of it all round, stalks out of the top, in flower. crown()');
  /* a desk and a chair grown over */
  tbl(F, 12.4, 8.9, 1.6, 0.8, 0x5b5d5f); bx(F, 12.4, 8.1, 0.45, 0.45, 0.45, 0x3a3d40);
  engulf(F, 12.4, 8.9, 1.6, 0.8, 0.76, { cover: 0.8 }); engulf(F, 12.4, 8.1, 0.45, 0.45, 0.45, { cover: 0.6 });
  say(13.6, 8.3, 'Grown over', 'A desk and its chair: leaf over the top and off the edges, stems up the legs, a shelf out of the side. engulf()');

  /* the corridor; the office, colonised from its south-west corner; the locker room, all but clean */
  room(F, 'Corridor', 0, 10.5, 26, 2.5, { ...SEC, ...H, motes: 'spores' });
  door(F, 10.5, 10.25);
  room(F, 'Office', 2, 13.5, 9, 7.5, { ...OFF, ...H, motes: 'spores' });
  door(F, 6.5, 13.25, { sg: [['Office', 'n']] });
  desk(F, 4.4, 18.2, 1.6, 0.8); bx(F, 4.4, 17.4, 0.45, 0.45, 0.45, 0x3a3d40);
  desk(F, 8.6, 15.4, 1.6, 0.8); bx(F, 8.6, 16.2, 0.45, 0.45, 0.45, 0x3a3d40);
  bx(F, 10.7, 19.4, 0.5, 1.3, 0.6, 0x5f6266); bx(F, 10.7, 18.6, 0.5, 1.3, 0.6, 0x5f6266); // filing cabinets against the east wall
  const office = F.rooms.find(r => r.name === 'Office')!, corridor = F.rooms.find(r => r.name === 'Corridor')!;
  colonise(F, office, 2.6, 20.4, 9);
  engulf(F, 4.4, 18.2, 1.6, 0.8, 0.76, { cover: 0.95, age: 0.6 }); engulf(F, 4.4, 17.4, 0.45, 0.45, 0.45, { cover: 0.9, age: 0.6 });
  engulf(F, 8.6, 15.4, 1.6, 0.8, 0.76, { cover: 0.25, age: 0.2 });
  /* out of its door, thinning along the corridor both ways */
  colonise(F, corridor, 6.5, 13.25, 7, { dens: 0.8 });
  room(F, 'Locker room', 15, 13.5, 9, 6.5, { ...SEC, ...H });
  door(F, 20.5, 13.25, { sg: [['Lockers', 'n']] });
  for (let x = 15.6; x < 19.5; x += 0.55) bx(F, x, 19.7, 0.5, 1.9, 0.5, 0x4d5a66); // lockers along the south wall
  for (let x = 21.6; x < 23.7; x += 0.55) bx(F, x, 19.7, 0.5, 1.9, 0.5, 0x4d5a66);
  bx(F, 19.5, 16.8, 2.4, 0.45, 0.4, 0x6b5a48); // the bench between them
  /* the runner along the corridor and under the door, the first leaf in */
  runner(F, [[11.6, 12.3], [13, 12.5], [14.6, 12.35], [16.2, 12.55], [17.8, 12.4], [19.3, 12.6], [20.4, 12.9], [20.6, 13.6], [20.4, 14.4], [20.9, 15.1]], 0.07, 0.025, { leaf: 0.3, tip: true, g: grower('bench trail') });
  litter(F, 20.9, 15.1, 0.5, { n: 6, dry: 0 });
  say(20.4, 14.4, 'The front', 'A runner come along the corridor and under the door, and the first leaf in. The room past it is still clean.');

  return finishLevel([25.2, 11.75, PI / 2]); // at the corridor's east end, looking west along it
}
