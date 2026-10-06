import { ITEMS } from '../content/items';
import { NOTES } from '../content/notes';
import type { LevelDef, StationDef } from '../content/types';
import { MT } from './cast';
import { makeFields } from './fields';
import { spotsNear } from './progress';
import { makeSim } from './sim';

/* Level validation (engine.md §10): what can be known to be wrong with the station's content without playing it.
   Errors are mistakes; 'later' marks what waits on a level not yet ported (a ladder's other end). Run by the tests,
   so `npm run check` fails on an error. */

export interface Problem { level: string; what: string; later?: boolean }

const KINDS = new Set(['body', 'backup', 'panel', 'fuse', 'breaker', 'lift', 'ladder', 'stair', 'look']);

export function validateStation(station: StationDef, levels: LevelDef[] = station.levels.map(l => l.build())): Problem[] {
  const out: Problem[] = [], notes = NOTES('\u0001', '\u0002'), names = new Set(station.levels.map(l => l.name));
  /* what the whole station gives you: keys (from bodies and from things carried), and which codes are written down */
  const keys = new Set<string>(), codes = new Set<number>();
  for (const L of levels) {
    for (const u of L.uses) if (u.kind === 'body') {
      for (const k of (u.opts.keys as string[]) ?? []) keys.add(k);
      if (u.opts.note) codes.add(1);
    }
    for (const it of L.items) { const k = ITEMS[it.id]?.key; if (k) keys.add(k); }
    for (const n of L.notes) {
      const b = notes[n.key]?.b ?? '';
      if (b.includes('\u0001')) codes.add(1);
      if (b.includes('\u0002')) codes.add(2);
    }
  }
  /* codes some paper carries, placed or not */
  const written = new Set<number>();
  for (const n of Object.values(notes)) { if (n.b.includes('\u0001')) written.add(1); if (n.b.includes('\u0002')) written.add(2); }
  const circuits = new Set(Object.keys(station.circuits));
  for (const L of levels) {
    const bad = (what: string, later = false) => out.push({ level: L.id, what, ...(later ? { later } : {}) });
    const circuit = (c: string, of: string) => { if (c !== L.circuit && !circuits.has(c)) bad(`${of}: no circuit ${c}`); };
    if (!circuits.has(L.circuit)) bad(`the level's own circuit ${L.circuit} is not one of the station's`);
    for (const it of L.items) if (!ITEMS[it.id]) bad(`an item that does not exist: ${it.id}`);
    for (const n of L.notes) if (!notes[n.key]) bad(`a note that does not exist: ${n.key}`);
    for (const m of L.mutants) if (!MT[m.type]) bad(`a mutant that does not exist: ${m.type}`);
    L.doors.forEach((D, k) => {
      circuit(D.circuit, `door ${k}`);
      if (D.card && !keys.has(D.card)) {
        /* a card that exists as a thing to carry may be lying on a level not yet ported */
        if (Object.values(ITEMS).some(it => it.key === D.card)) bad(`door ${k} wants card ${D.card}, found on no level ported yet`, true);
        else bad(`door ${k} wants card ${D.card}, which nobody carries and nothing gives`);
      }
      if (D.code && !codes.has(D.code)) {
        if (written.has(D.code)) bad(`door ${k} wants code ${D.code}, written on a paper no level ported yet holds`, true);
        else bad(`door ${k} wants code ${D.code}, which is written down nowhere`);
      }
    });
    for (const P of L.platforms) if (P.call) circuit(P.call.circuit, `platform ${P.call.name}`);
    for (const s of L.signs) circuit(s.circuit, `sign ${s.text}`);
    for (const u of L.uses) {
      if (!KINDS.has(u.kind)) { bad(`a thing to use of unknown kind: ${u.kind}`); continue; }
      const c = u.opts.c as string | undefined;
      if ((u.kind === 'backup' || u.kind === 'panel') && (!c || !circuits.has(c))) bad(`${u.kind} for a circuit that does not exist: ${c}`);
      if (u.kind === 'ladder') {
        const S = station.ladders[u.opts.id as string];
        if (!S) bad(`ladder ${u.opts.id} is not one of the station's ladderways`);
        else if (!S.broken && !S.to) bad(`ladder ${u.opts.id} does not say where it goes`);
        else if (S.to && !names.has(S.to)) bad(`ladder ${u.opts.id} goes to ${S.to}, not ported yet`, true);
        if (S?.need?.power) circuit(S.need.power, `ladder ${u.opts.id}`);
      }
      if (u.kind === 'stair' && !station.levels.some(l => l.id === u.opts.to)) bad(`stairs to ${u.opts.to}, not ported yet`, true);
    }
    /* everything is somewhere a body can stand and reach it */
    const sim = makeSim(L, { station }), nav = (sim.fields ?? makeFields(sim)).nav;
    const reach = (what: string, x: number, y: number, z: number, r: number) => { if (!spotsNear(nav, x, y, z, r).length) bad(`${what} is out of reach of anywhere to stand`); };
    for (const it of L.items) reach(`${it.id} at ${it.x}, ${it.z}`, it.x, it.y + 0.05, it.z, 2);
    for (const n of L.notes) reach(`note ${n.key} at ${n.x}, ${n.z}`, n.x, n.y + 0.05, n.z, 2);
    for (const u of L.uses) reach(`${u.kind} at ${u.x}, ${u.z}`, u.x, u.y, u.z, 2.4);
    if (nav.locate(L.start.x, L.start.y, L.start.z) < 0) bad('the start is not on the nav graph');
    for (const [k, m] of Object.entries(L.marks)) if (nav.locate(m.x, m.y, m.z) < 0) bad(`mark ${k} is not on the nav graph`);
  }
  return out;
}
