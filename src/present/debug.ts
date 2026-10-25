/* ?dbg=a,b: the picture drawn with stages of it left out, to find which one draws a fault seen on one card and not on
   another (README). Looks only; nothing here changes how the game plays.
   - flat: the level's light a plain grey, its light field not read
   - nodir: the level's light taken as coming from every way (its direction not read)
   - noself: your body throws no shadow from the fittings over you
   - nobeams: no light from beams lying about (a flashlight put down on, the night round's torch)
   - noprepass: the level's depth not drawn first (post.ts)
   - noglow, nograin: the picture's glow, its grain
   - nomsaa: the scene's edges not smoothed (one sample a pixel) */

const NAMES = ['flat', 'nodir', 'noself', 'nobeams', 'noprepass', 'noglow', 'nograin', 'nomsaa'] as const;
export type Dbg = (typeof NAMES)[number];

const asked = typeof location === 'undefined' ? '' : (new URLSearchParams(location.search).get('dbg') ?? '');
const on = new Set<string>(asked.split(',').map(s => s.trim()).filter(s => (NAMES as readonly string[]).includes(s)));

/** is this stage left out? */
export const dbg = (k: Dbg): boolean => on.has(k);
/** the stages left out, as defines for a shader (DBG_FLAT, ...) */
export const dbgDefines = (): Record<string, string> => Object.fromEntries([...on].map(k => ['DBG_' + k.toUpperCase(), '']));
