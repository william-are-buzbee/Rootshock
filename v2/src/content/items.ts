/* Everything that can be carried, as the first engine had it. A weapon carries its handling (w); stackable things count
   (stack, and per: how many come in one find); a tool is a light; worn things go on; a key is not carried but known. */

export interface WeaponDef {
  mass: number;
  type?: 'blunt' | 'edge' | 'fist';
  len?: number;
  gun?: boolean;
  dmg?: number;
  range?: number;
  cone?: number;
  ammo?: string;
  cd?: number;
}

export interface ItemDef {
  /** its name */
  n: string;
  /** what it is, in a line */
  d?: string;
  w?: WeaponDef;
  stack?: boolean;
  /** how many in one find (rounds in a box) */
  per?: number;
  heal?: number;
  tool?: boolean;
  worn?: boolean;
  /** knowing it opens things: the key it stands for */
  key?: string;
}

export const ITEMS: Record<string, ItemDef> = {
  baton: { n: "Guard's baton", d: 'Rubber over a steel core, 1.1 kg. Better than your hands.', w: { mass: 1.1, type: 'blunt', len: 0.5 } },
  pipe: { n: 'Lead pipe', d: 'A metre of old plumbing, 2.4 kg. Slow. It ends arguments.', w: { mass: 2.4, type: 'blunt', len: 0.7 } },
  wrench: { n: 'Pipe wrench', d: 'Steel, 1.6 kg. Quicker than the pipe, lighter on arrival.', w: { mass: 1.6, type: 'blunt', len: 0.45 } },
  adjwrench: { n: 'Adjustable wrench', d: "Chrome steel, 1.1 kg. An engineer's tool. Handy, not heavy.", w: { mass: 1.1, type: 'blunt', len: 0.4 } },
  pistol: { n: 'Service pistol', d: '9 mm. One click, one round. Everything on the floor hears it.', w: { gun: true, dmg: 36, range: 32, cone: 0.985, ammo: 'ammo9', cd: 0.38, mass: 0.9 } },
  shotgun: { n: 'Shotgun', d: '12 gauge. Ruinous up close, a suggestion at distance.', w: { gun: true, dmg: 105, range: 15, cone: 0.93, ammo: 'shells', cd: 1.05, mass: 3.2 } },
  ammo9: { n: '9 mm rounds', d: 'Loose rounds for the pistol.', stack: true, per: 12 },
  shells: { n: 'Shotgun shells', d: '12 gauge.', stack: true, per: 6 },
  knife: { n: 'Kitchen knife', d: '200 g of edge. Fast. You have to stand very close.', w: { mass: 0.2, type: 'edge', len: 0.25 } },
  axe: { n: 'Fire axe', d: '3.2 kg with an edge. Every swing is a commitment.', w: { mass: 3.2, type: 'edge', len: 0.9 } },
  flash: { n: 'Flashlight', tool: true },
  lantern: { n: 'Dive lantern', tool: true },
  batt: { n: 'Battery', d: 'A fresh cell. Fits the flashlight and the lantern.', stack: true },
  medkit: { n: 'Trauma kit', d: 'Restores most of your health.', heal: 60 },
  bandage: { n: 'Bandage', d: 'Stops the bleeding.', heal: 25, stack: true },
  ration: { n: 'Ration bar', d: 'Dense, grey, edible.', heal: 8, stack: true },
  peaches: { n: 'Canned peaches', d: 'Syrup and all.', heal: 14, stack: true },
  fuse: { n: 'Main fuse', d: 'Ceramic cartridge fuse, heavy as a brick. Fits a generator bus.' },
  kit: { n: 'Splice kit', d: 'Crimps, sleeves, a length of heavy cable. Mends one broken service connection.' },
  armor: { n: 'Stab vest', worn: true },
  hardhat: { n: 'Hard hat', worn: true },
  tacvest: { n: 'Tactical vest', worn: true },
  goggles: { n: 'Swim goggles', worn: true },
  rebreather: { n: 'Rebreather', worn: true },
  surf: { n: 'Surface lift pass', key: 'surf' },
  liftkey: { n: "Director's lift key", key: 'lift' },
};

const KEYN: Record<string, string> = {
  s: 'Security keycard', o: 'Operations pass', h: 'Horticulture security pass', e: 'Engineering keycard', surf: 'Surface lift pass', lift: "Director's lift key",
};
export const keyName = (k: string): string => KEYN[k] ?? 'Room card, Residence ' + k;
