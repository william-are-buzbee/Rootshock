import { ITEMS, keyName } from '../content/items';
import { STATION_NAMES } from '../content/names';
import { end, give, giveKey, consume, makeNoise, power, readNote, say, sayOnce, sfx, type Game } from './game';
import { locked, occupied, sendPlatform, type Door, type Platform } from './movers';
import { eyeHeight } from './player';
import type { Sim } from './sim';
import { riders } from './sim';
import { soundZone, speakerY } from './eyes';

/* What you can use, and what using it does: E on whatever you are looking at. The labels and the answers are the first
   engine's (interaction, in archive/first-engine.html), so the station reads as it did. */

export interface Usable {
  x: number; y: number; z: number;
  /** how near you have to be */
  r: number;
  label(): string | null;
  act(): void;
  off?: boolean;
  /** a name for one whose state a save must keep (a body searched) */
  key?: string;
}

/** an item lying in the world */
export interface WorldItem { id: string; n: number; x: number; y: number; z: number; taken: boolean; raw?: boolean }

export function buildUsables(sim: Sim): Usable[] {
  const g = sim.game, out: Usable[] = [], L = sim.world.def;
  for (const d of sim.doors) {
    const D = d.def;
    out.push({ x: (D.x0 + D.x1) / 2, y: D.y0 + (D.vent ? 0.6 : 1.3), z: (D.z0 + D.z1) / 2, r: D.vent ? 1.7 : 2.6, label: () => doorLabel(sim, d), act: () => doorAct(sim, d) });
  }
  for (const p of sim.platforms) if (p.def.call) out.push(platformUse(sim, p, 0), platformUse(sim, p, 1));
  /* a camera can be smashed, with something in your hand, and is heard well off; so can a zone's speaker, in the ceiling
     (or, over the atrium's well, leaning out from the gallery's rail), but only from below */
  const smash = (at: { x: number; y: number; z: number }, done: () => void) => () => {
    if (!g.weapon) { say(g, 'With what? You would want something heavy in your hand.'); sfx(g, 'deny'); return; }
    done();
    sfx(g, 'smash', at, true);
    makeNoise(g, 14);
  };
  for (const c of sim.cams) {
    const C = c.def;
    out.push({ x: C.x, y: C.y, z: C.z, r: 2.4, label: () => (c.broken ? null : 'Smash the camera'), act: smash(C, () => { c.broken = true; c.hold = 0; }) });
  }
  for (const S of L.speakers ?? []) {
    const at = { x: S.x, y: speakerY(sim.world, S) - 0.25, z: S.z };
    out.push({
      ...at, r: 3.2, label: () => (sim.mute.includes(S.zone) || sim.player.body.y > at.y - 2 ? null : 'Smash the speaker'),
      act: smash(at, () => { sim.mute.push(S.zone); }),
    });
  }
  for (const it of sim.items) out.push(itemUse(sim, it));
  for (const n of L.notes) {
    const note = g.notes[n.key];
    if (note) out.push({ x: n.x, y: n.y + 0.05, z: n.z, r: 2, label: () => 'Read: ' + note.t.toLowerCase(), act: () => readNote(g, n.key) });
  }
  L.uses.forEach((u, ui) => {
    const o = u.opts as Record<string, never>;
    const base = { x: u.x, y: u.y, z: u.z, r: 2.4, key: 'use' + ui };
    switch (u.kind) {
      case 'body': {
        const use: Usable = {
          ...base, label: () => (o.label as string) ?? 'Search the body',
          act: () => {
            use.off = true;
            if (o.say) say(g, o.say);
            for (const k of (o.keys as string[]) ?? []) giveKey(g, k);
            if (o.note) { if (!g.read.includes(o.note)) g.read.push(o.note); say(g, 'Armory: ' + g.code + '. You will not forget it.'); }
          },
        };
        out.push(use);
        break;
      }
      case 'backup': {
        const c = o.c as string;
        out.push({
          ...base, label: () => 'Backup set, ' + (STATION_NAMES[c] ?? c) + ': ' + (g.station?.circuits[c]?.back ? 'running' : 'stopped'),
          act: () => {
            const C = g.station?.circuits[c];
            if (!C) return;
            C.back = !C.back;
            g.events.push({ type: 'power', loud: false });
            say(g, C.back ? (power(g, c) === 2 ? 'The backup set turns over. With Gen-1 on the floor it changes nothing.' : 'The backup set catches. Half-light in the halls; the rooms stay dark. Doors that can, will open for anything.') : 'The backup set coughs out.');
          },
        });
        break;
      }
      case 'panel': {
        /* `cut`: cut through by hand, not burned out */
        const c = o.c as string, cut = !!o.cut, name = STATION_NAMES[c] ?? c;
        out.push({
          ...base,
          label: () => { const C = g.station?.circuits[c]; return 'Service connection, ' + name + ': ' + (!C ? 'none' : C.broken ? (cut ? 'cut through' : 'burned through') : C.on ? 'closed' : 'open'); },
          act: () => {
            const C = g.station?.circuits[c];
            if (!C) return;
            if (C.broken) {
              const i = g.inv.findIndex(s => s.id === 'kit');
              if (i < 0) {
                say(g, cut ? 'The feed has been cut clean through behind the switch, by hand. It would need cable, crimps, a proper splice.' : 'The feed is burned through behind the switch. It would need cable, crimps, a proper splice.');
                sfx(g, 'deny');
                return;
              }
              consume(g, i); C.broken = false; C.on = true; sfx(g, 'clang'); say(g, 'You splice the feed and close the switch.');
              /* the circuit comes live on Security's board, and the board sounds the zone it is in */
              if (o.zone) soundZone(sim, o.zone as string);
            } else {
              C.on = !C.on;
              /* a branch takes what its feed has; anything else takes Gen-1 */
              const live = power(g, C.feed ?? c) > 0, up = C.feed ? (live ? 'The ' + name + ' takes power.' : 'Nothing upstream to take.') : g.station!.main ? 'That floor takes power.' : 'Nothing upstream to take.';
              say(g, C.on ? 'Switch closed. ' + up : C.feed ? 'Switch open. The ' + name + ' is cut off.' : 'Switch open. That floor is cut off from Gen-1.');
            }
            g.events.push({ type: 'power', loud: false });
          },
        });
        break;
      }
      case 'elev': {
        /* a lift between two levels, off a circuit (the Security elevator): you arrive at the far level's mark for this one */
        const c = o.c as string, to = o.to as string;
        out.push({
          ...base, label: () => 'Elevator: ' + (g.station?.names[to] ?? to),
          act: () => {
            if (power(g, c) < 1) { say(g, 'The panel is dark. The car runs off the ' + (STATION_NAMES[c] ?? c) + ', and that is dead.'); sfx(g, 'deny'); return; }
            if (!g.station?.built.includes(to)) { say(g, 'The car answers. Where it goes is not built yet.'); return; }
            sfx(g, 'door', u);
            makeNoise(g, 10);
            g.travel = { level: to, mark: 'elev:' + L.id };
          },
        });
        break;
      }
      case 'fuse':
        out.push({
          ...base, label: () => (g.station?.fuseIn ? null : 'Fuse socket'),
          act: () => {
            const i = g.inv.findIndex(s => s.id === 'fuse');
            if (i < 0 || !g.station) { say(g, 'A scorched, empty socket. Gen-1 will not hold a load without a fuse.'); sfx(g, 'deny'); return; }
            consume(g, i); g.station.fuseIn = true; sfx(g, 'clang'); say(g, 'The fuse seats with a clunk.');
          },
        });
        break;
      case 'breaker':
        out.push({
          ...base, label: () => 'Gen-1 main breaker: ' + (g.station?.main ? 'on' : 'off'),
          act: () => {
            const s = g.station;
            if (!s) return;
            if (!s.fuseIn) { sfx(g, 'door'); say(g, 'The lever throws, and nothing answers. The bus is open.'); return; }
            s.main = !s.main;
            g.events.push({ type: 'power', loud: s.main });
            say(g, s.main ? 'Gen-1 takes the load. Five floors of station wake up over your head. The lifts will run.' : 'Gen-1 winds down. The dark comes back in from the far end.');
          },
        });
        break;
      case 'lift':
        out.push({ ...base, label: () => 'Lift panel', act: () => { if (power(g, 'LIFT') < 2) { say(g, 'The lift is dead. It runs off Gen-1 and nothing else.'); sfx(g, 'deny'); return; } g.events.push({ type: 'lift' }); } });
        break;
      case 'ladder': {
        const id = o.id as string, up = !!o.up, here = L.id;
        const other = () => g.station?.ladders[id]?.ends?.find(e => e !== here);
        out.push({
          ...base, label: () => (o.text as string) ?? (up ? 'Ladder up: ' : 'Ladder down: ') + (g.station?.names[other() ?? ''] ?? 'nowhere'),
          act: () => {
            const S = g.station?.ladders[id], to = other();
            if (S?.broken) { say(g, S.broken); sfx(g, 'deny'); return; }
            const n = S?.need;
            if (n?.power && power(g, n.power) < 1) { say(g, n.msg ?? 'It will not open.'); sfx(g, 'deny'); return; }
            if (!to || !g.station?.built.includes(to)) { say(g, 'The ladderway is clear. Where it leads is not built yet.'); return; }
            if (S?.say) say(g, S.say);
            sfx(g, 'step');
            makeNoise(g, 6);
            g.travel = { level: to, mark: 'ladder:' + id };
          },
        });
        break;
      }
      case 'stair': {
        const to = o.to as string;
        out.push({
          ...base, label: () => (o.up ? 'Stairs up' : 'Stairs down') + (g.station?.names[to] ? ': ' + g.station.names[to] : ''),
          act: () => {
            if (!g.station?.built.includes(to)) { say(g, 'Where these lead is not built yet.'); return; }
            g.travel = { level: to, mark: 'stair:' + L.id };
          },
        });
        break;
      }
      case 'dive': {
        const to = o.to as string;
        out.push({
          ...base, label: () => o.label as string,
          act: () => {
            if (!g.station?.built.includes(to)) { say(g, 'Where this goes is not built yet.'); return; }
            sfx(g, 'slosh');
            g.travel = { level: to, mark: 'dive:' + L.id };
            if (o.under) sayOnce(g, 'dive', g.worn.includes('rebreather') ? 'The rebreather ticks. You have time.' : 'One lungful. Count it.');
          },
        });
        break;
      }
      case 'look':
        out.push({ ...base, label: () => (o.label as string) ?? 'Look', act: () => say(g, o.text as string) });
        break;
    }
  });
  return out;
}

/** a cargo platform's button at one of its ends (0 the bottom, 1 the top): ride it to the other end if you are on it,
 *  or call it to you if it is at the other end */
function platformUse(sim: Sim, p: Platform, end: 0 | 1): Usable {
  const g = sim.game, d = p.def, call = d.call!, b = sim.player.body;
  const onIt = () => b.x > d.x0 && b.x < d.x1 && b.z > d.z0 && b.z < d.z1 && Math.abs(b.y - p.y) < 0.6;
  return {
    x: (d.x0 + d.x1) / 2, y: (end ? d.y1 : d.y0) + 1.1, z: (d.z0 + d.z1) / 2, r: 3.6,
    label: () => {
      if (p.moving) return null;
      if (onIt()) return p.target === end ? call.name + ': ' + (end ? 'down' : 'up') : null;
      return p.target !== end ? 'Call the ' + call.name.toLowerCase() : null;
    },
    act: () => {
      if (power(g, call.circuit) < 1) { say(g, 'No power to it. The platform sits where it stopped.'); sfx(g, 'deny'); return; }
      sendPlatform(p, onIt() ? (end ? 0 : 1) : end);
      sfx(g, 'door', { x: (d.x0 + d.x1) / 2, y: p.y, z: (d.z0 + d.z1) / 2 });
      makeNoise(g, 12);
    },
  };
}

export function itemUse(sim: Sim, it: WorldItem): Usable {
  const g = sim.game;
  const use: Usable = {
    x: it.x, y: it.y + 0.05, z: it.z, r: 2,
    label: () => (it.taken ? null : 'Take ' + ITEMS[it.id].n.toLowerCase()),
    act: () => {
      const per = ITEMS[it.id].per;
      if (give(g, it.id, it.raw && per ? it.n / per : it.n)) {
        it.taken = true; use.off = true; sfx(g, 'take');
        const k = sim.items.indexOf(it);
        if (sim.world.def.lamps.some(L => L.item === k)) g.events.push({ type: 'relight' });
      }
    },
  };
  return use;
}

export function doorLabel(sim: Sim, d: Door): string | null {
  const D = d.def, g = sim.game;
  if (D.glass) return null;
  if (D.vent) return d.open ? null : 'Loose panel';
  if (D.lift) return 'Call the surface lift';
  if (D.seal) return 'Jammed shut';
  if (D.stuck) return sim.player.crouch ? null : 'Jammed half open';
  const L = power(g, D.circuit), rd = D.card ? 'Card reader' : 'Keypad';
  if (d.bolt > 0) return 'Bolted';
  if (D.kind === 'heavy') {
    if (L < 2) return 'Heavy door: no power';
    if (locked(d)) return rd;
    return d.open ? 'Door control: close' : 'Door control: open';
  }
  if (L > 0) return locked(d) ? rd : null;
  if (locked(d)) return rd + ': dark'; // fail-secure: no power, no way through
  return d.open ? 'Slide the door shut' : 'Slide the door open';
}

export function doorAct(sim: Sim, d: Door): void {
  const D = d.def, g = sim.game, at = { x: (D.x0 + D.x1) / 2, y: D.y0, z: (D.z0 + D.z1) / 2 };
  if (D.lift) {
    if (power(g, D.circuit) < 2 || power(g, sim.world.def.circuit) < 2) {
      say(g, g.station?.main ? 'Gen-1 is up but this floor is not taking it. The feed is open somewhere below.' : 'The call button is dead. The surface lift runs off Gen-1, five floors down.');
      sfx(g, 'deny');
      return;
    }
    if (!g.keys.includes('surf') && !g.keys.includes('lift')) { say(g, "Power, and a slot. It wants a surface pass from the Armory, or the director's own key."); sfx(g, 'deny'); return; }
    end(g, true, 'lift');
    return;
  }
  if (D.seal) { say(g, D.msg ?? 'It does not move. Something on the other side shifts its weight.'); sfx(g, 'deny'); return; }
  if (d.bolt > 0) { say(g, D.keep ? 'Bolted from the inside. The lock hums with the power behind it, and on the other side something wet shifts against the door.' : 'Bolted, from somewhere else. The lock hums with the power behind it.'); sfx(g, 'deny'); return; }
  if (D.stuck) { say(g, 'Jammed at waist height. You could get under it. Not everything could.'); return; }
  if (D.vent) { d.open = true; sfx(g, 'clang', at); makeNoise(g, 7); say(g, 'The panel comes away in your hands. There is a way through.'); return; }
  const L = power(g, D.circuit), heavy = D.kind === 'heavy';
  if (heavy && L < 2) { say(g, L ? 'The backup set cannot move a door this size.' : 'A door this heavy does not move without power.'); sfx(g, 'deny'); return; }
  if (locked(d)) {
    if (L === 0) { say(g, D.card ? 'The reader is dark. It needs power to read a card, and the door will not slide.' : 'The keypad is dark, and the door will not slide.'); sfx(g, 'deny'); return; }
    if (D.card) {
      if (!g.keys.includes(D.card)) { say(g, 'The reader wants: ' + keyName(D.card) + '.'); sfx(g, 'deny'); return; }
      d.unlocked = true; sfx(g, 'take'); say(g, 'The reader takes the card.');
      if (!heavy) return;
    } else {
      g.pad = { code: D.code === 2 ? g.code2 : g.code, typed: '', door: sim.doors.indexOf(d) };
      g.events.push({ type: 'pad' });
      return;
    }
  }
  if (!heavy && L > 0) return;
  if (d.open && occupied(d, riders(sim))) return;
  d.open = !d.open;
  d.hold = 3;
  sfx(g, 'door', at);
  makeNoise(g, heavy ? 10 : 7);
}

/** a key on the keypad in front of you */
export function padKey(g: Game, sim: Sim, k: string): void {
  const p = g.pad;
  if (!p) return;
  p.miss = undefined;
  if (k === 'C') p.typed = '';
  else if (p.typed.length < 4) p.typed += k;
  sfx(g, 'take');
  if (p.typed.length === 4) {
    if (p.typed === p.code) {
      const d = sim.doors[p.door];
      if (d) d.unlocked = true;
      g.pad = null;
      say(g, 'The keypad goes green.');
    } else { sfx(g, 'deny'); p.miss = p.typed; p.typed = ''; }
  }
}

/** what you are looking at that can be used: the nearest thing roughly where you look, within its reach */
export function findUsable(sim: Sim): (Usable & { text: string }) | null {
  const p = sim.player, b = p.body, eye = b.y + eyeHeight(p), cp = Math.cos(p.pitch);
  const f = [-Math.sin(p.yaw) * cp, Math.sin(p.pitch), -Math.cos(p.yaw) * cp];
  let best: (Usable & { text: string }) | null = null, bs = 0.78;
  for (const u of sim.usables) {
    if (u.off) continue;
    const dx = u.x - b.x, dy = u.y - eye, dz = u.z - b.z, d = Math.hypot(dx, dy, dz);
    if (d > u.r) continue;
    const dot = d < 0.5 ? 1 : (dx * f[0] + dy * f[1] + dz * f[2]) / d;
    if (dot <= bs) continue;
    const text = u.label();
    if (!text) continue;
    bs = dot;
    best = Object.assign(u, { text });
  }
  return best;
}

