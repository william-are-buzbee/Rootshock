import { PI } from '../../core/math';
import { CELL, DARK, LevelBuilder, OPS, UTIL } from '../build/builder';
import { column, crates, shelf, table } from '../build/kit';
import type { LevelDef } from '../types';

/* A room for proving the engine, not part of the station: steps, a mezzanine, a ledge you can jump onto, a wall you
   cannot, a crawl you have to crouch through, a dark room for the flashlight. */
export function testbed(): LevelDef {
  const b = new LevelBuilder('testbed', 'Test bed');

  b.room('Hall', 0, 0, 16, 12, { ht: 4, pal: OPS });
  b.block(12, 0, 0, 16, 1, 4, 0x5a5d60); // mezzanine, 1 m up
  b.steps(10, 0, 12, 2, 0, 1, 4, 'e', 0x5a5d60); // four 25 cm steps up to it
  b.block(2, 0, 9, 4, 0.75, 12, 0x6b5a3c); // a ledge you can jump onto
  b.block(6, 0, 9, 7, 1.75, 12, 0x55585c); // and one you cannot
  table(b, 5, 4, 2, 0.95);
  shelf(b, 0.3, 5, 0.5, 2.4);
  column(b, 8, 6, 4);
  crates(b, 13.5, 9, 3);

  b.room('Service corridor', 16, 5, 24, 7, { ht: 2.4, pal: UTIL, light: [0.32, 0.33, 0.36] });

  b.room('Dark store', 24, 2, 32, 10, { pal: CELL, light: DARK });
  crates(b, 29, 4, 4);
  crates(b, 27, 8.5, 2);

  b.room('Crawlway', -6, 8.5, 0, 10, { ht: 1.25, pal: UTIL, light: [0.3, 0.25, 0.18], nolamp: true });
  b.room('Closet', -10, 6, -6, 12, { ht: 3, pal: UTIL, light: [0.5, 0.12, 0.08] });

  b.start(3, 3, -PI / 2);
  return b.finish();
}
