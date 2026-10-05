import { PI } from '../../core/math';
import { CELL, DARK, LevelBuilder, OPS, SEC, UTIL } from '../build/builder';
import { column, crates, shelf, table } from '../build/kit';
import type { LevelDef } from '../types';

/* A place for proving the engine, not part of the station. The hall: steps, a mezzanine, a ledge you can jump onto, a wall
   you cannot, a crawl you have to crouch through, a dark room for the flashlight. Through the door south, the lab: a ramp
   up to a balcony, a lift to a gallery, a pool with a shallow end, crates to push, and a cave off its east side. */
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

  /* the door south, in a short passage */
  b.room('Passage', 7, 12, 9, 13.75, { ht: 2.6, pal: UTIL, light: [0.32, 0.33, 0.36], nolamp: true });
  b.room('', 7, 13.75, 9, 14, { ht: 2.4, pal: UTIL, light: [0.32, 0.33, 0.36], nolamp: true });
  b.room('Passage', 7, 14, 9, 16, { ht: 2.6, pal: UTIL, light: [0.32, 0.33, 0.36], nolamp: true });
  b.door(7, 13.75, 9, 14, 2.4);

  b.room('Lab', 0, 16, 16, 34, { ht: 6, pal: SEC, light: [0.62, 0.66, 0.7] });
  /* a ramp up to a balcony 2 m up */
  b.block(0, 0, 26, 5, 2, 34, 0x55585c);
  b.ramp(1, 18, 3, 26, 0, 2, 's', 0x5f6266);
  /* a lift up to a gallery 3 m up */
  b.block(10, 0, 28, 16, 3, 34, 0x55585c);
  b.platform(8, 30, 10, 32, 0.2, 3);
  /* a pool: a shallow shelf at the west end, deep water beyond */
  b.room('Pool', 6, 18, 12, 24, { y0: -3, ht: 3, pal: SEC, light: [0.4, 0.5, 0.55], nolamp: true });
  b.block(6, -3, 18, 7.5, -0.5, 24, 0x4a5a5c);
  b.water(6, 18, 12, 24, -0.15);
  /* crates to push: a few loose, and a stack */
  for (const [x, z] of [[13, 19], [14.3, 19], [13, 20.3], [14.3, 21.6]]) b.box(x, z, 1.1, 1.1, 1.1, 0x6a4a34, { loose: true });
  b.box(13, 19, 0.9, 0.9, 0.9, 0x3a5a6a, { y: 1.1, loose: true });
  crates(b, 3.5, 31, 2);

  /* the cave, east through a short tunnel: rock, a rising uneven floor, a vaulted ceiling */
  b.room('Tunnel', 16, 20, 18, 22, { ht: 2.6, pal: { fl: 0x4a443c, wl: 0x5a5248, st: 0x5a5248 }, light: [0.12, 0.14, 0.12], nolamp: true, cave: true });
  const rise = (x: number) => Math.max(0, (x - 18) / 14);
  b.cave('Cave', 18, 14, 32, 30, {
    ht: 3, light: [0.1, 0.17, 0.12],
    floor: (x, z) => rise(x) * 1.2 + 0.4 * Math.sin(x * 0.9) * Math.sin(z * 0.7) * rise(x),
    ceil: (x, z) => 1.6 * Math.sin((Math.PI * (z - 14)) / 16) + 0.3 * Math.sin(x * 1.3 + z),
  });
  for (const [x, z, s] of [[24, 18, 1.2], [28, 25, 1.6], [21, 27, 0.9]]) b.prop('ico', x, z, s, s * 0.7, s, 0x5a5248, { solid: true });

  b.start(3, 3, -PI / 2);
  return b.finish();
}
