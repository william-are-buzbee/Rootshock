/* What you carry, drawn: one small picture for each thing (content/items.ts), a card for each key you know and a sheet
   for each paper you have read. Drawn on a 48 grid in the text's colour (currentColor), as the inventory shows them;
   the name is the hover's (panels.ts). */

const S = (d: string) => `<path d="${d}"/>`;
const F = (d: string) => `<path class="f" d="${d}"/>`;
const T = (d: string) => `<path class="t" d="${d}"/>`;

const VEST = 'M16 7h4q4 7 8 0h4l7 7-3 9v18H12V23l-3-9z';
const CARD = 'M7 13h34a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2z';

const ICONS: Record<string, string> = {
  baton: T('M15 33L39 9') + `<path class="t w" d="M9 39l6-6"/>` + S('M15 33l-3-6'),
  pipe: T('M11 37L35 13') + S('M7 34l7 7M32 10l7 7'),
  wrench: T('M9 39L27 21') + F('M22 20l10-10 7 3-3 3-4-1-5 5 3 4-3 2z'),
  adjwrench: T('M9 39L28 20') + `<path class="t" d="M38.8 13.4A6 6 0 1 1 34.6 9.2"/>`,
  pistol: F('M7 14h33v7H24l-1 4h-4l-2 12H9l3-16H7z') + S('M19 21v2a3 3 0 0 0 5 0'),
  shotgun: F('M12 16h33v4H22v5H12zM25 21h10v5H25zM12 17L2 21v7l10-3z'),
  ammo9: F('M10 22h6v16h-6zM21 22h6v16h-6zM32 22h6v16h-6z') + S('M10 22q3-10 6 0M21 22q3-10 6 0M32 22q3-10 6 0'),
  shells: S('M11 12h7v20h-7zM21 12h7v20h-7zM31 12h7v20h-7z') + F('M10 32h9v6h-9zM20 32h9v6h-9zM30 32h9v6h-9z'),
  knife: F('M20 24L41 7Q36 21 24 28z') + T('M19 29L9 39') + S('M17 23l8 8'),
  axe: T('M10 40L34 16') + F('M29 11l8 8 4-1q2-9-5-14l-1 4zM31 13l-6-6 3-3 6 6'),
  flash: T('M10 38L29 19') + F('M26.5 14.5L32.8 6.8 41.2 15.2 33.5 21.5z') + S('M17 31l-2-2'),
  lantern: F('M13 12h22v6H13zM13 33h22v7H13z') + S('M15 18h18v15H15zM20 18v15M28 18v15M18 12V8h12v4'),
  batt: S('M17 12h14v28H17z') + F('M21 7h6v5h-6zM17 30h14v10H17z') + S('M24 17v6M21 20h6'),
  medkit: S('M7 15h34v24H7zM18 15v-5h12v5') + `<path class="t" d="M24 20v14M17 27h14"/>`,
  bandage: S('M22 13a11 11 0 1 0 0.01 0M22 20a4 4 0 1 0 0.01 0M22 35h20v-6H31'),
  ration: S('M6 18h36v12H6z') + F('M6 18h5v12H6zM37 18h5v12h-5z') + S('M16 22h16M16 26h10'),
  peaches: S('M14 12v25a10 3 0 0 0 20 0V12') + `<ellipse cx="24" cy="12" rx="10" ry="3"/>` + F('M14 19h20v11H14z'),
  fuse: S('M13 17h22v14H13z') + F('M6 15h8v18H6zM34 15h8v18h-8z') + S('M2 24h4M42 24h4'),
  kit: S('M6 16h36v23H6zM18 16v-4h12v4') + `<path class="t" d="M27 20l-6 9h7l-5 7"/>`,
  armor: `<path class="f h" d="${VEST}"/>` + S(VEST),
  tacvest: `<path class="f h" d="${VEST}"/>` + S(VEST) + F('M15 26h7v8h-7zM26 26h7v8h-7z'),
  hardhat: F('M10 32a14 14 0 0 1 28 0z') + `<path class="t" d="M5 33h38"/>` + S('M24 18v-4'),
  goggles: S('M7 18h15v12H7zM26 18h15v12H26zM22 23h4M7 24H3M41 24h4'),
  rebreather: S('M9 15a5 5 0 0 1 10 0v24H9zM19 19c9 0 11 5 11 11') + F('M25 30h10v7H25zM9 24h10v3H9z'),
  liftkey: S('M16 17a7 7 0 1 0 0.01 0M23 24h19M36 24v6M41 24v5'),
  card: S(CARD) + F('M5 18h38v4H5z') + S('M10 27h8v4h-8z'),
  paper: S('M12 6h17l7 7v29H12zM29 6v7h7') + `<path class="h" d="M17 20h14M17 26h14M17 32h9"/>`,
};

/** the picture for a thing (an item's id, 'card', 'liftkey' or 'paper'); `tint` colours what marks a card's kind */
export function icon(id: string, tint?: string): string {
  const body = ICONS[id] ?? S('M10 10h28v28H10z');
  return `<svg class="ico" viewBox="0 0 48 48" aria-hidden="true"${tint ? ` style="--tint:${tint}"` : ''}>${body}</svg>`;
}

/** the picture for a key you know: the director's is a key, the rest are cards, marked by whose they are */
export function keyIcon(k: string): string {
  if (k === 'lift') return icon('liftkey');
  const tint = ({ s: '#8e2a20', o: '#5f7f99', h: '#6b8f4e', e: '#c9a227', surf: '#d9d3c1' } as Record<string, string>)[k] ?? '#86857c';
  return icon('card', tint);
}

/** put down: an arrow into a tray */
export const DROP = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10M7 10l5 5 5-5M4 19h16"/></svg>';
