import { clamp } from '../core/math';
import type { Mutant } from '../sim/cast';
import type { SimEvent } from '../sim/game';
import type { Loose } from '../sim/loose';
import type { Sim } from '../sim/sim';
import type { Dyn, World } from '../world/world';
import type { Audio, Surf, Voice } from './audio';

/* Where each sound is, and the sounds nobody in the sim needs to know about. A sound from a place comes to you the way
   the cast hears you (engine.md §8): along the rooms between, so a closed door or a wall of rock muffles it and makes it
   further off than it looks. Feet are heard on what they fall on. The cast breathe, click and gurgle as they go, cry
   out when they die; crates scrape and land; caves drip; your heart is heard when you are badly hurt. All of it is
   looks only, so it draws on Math.random and never on the sim's seeded numbers. */

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** what the floor is at a place: a puddle, a cave's rock, a walkway's grating, a crate's lid or a platform; else concrete */
export function floorAt(w: World, x: number, y: number, z: number, on: Dyn | null = null): Surf {
  if (on) return on.kind === 'loose' ? 'wood' : on.kind === 'mover' ? 'metal' : 'concrete';
  if (w.waterAt(x, z) > y + 0.03) return 'wet';
  for (const s of w.surfaces) {
    const d = s.def;
    if (d.kind !== 'floor' || d.sides || d.hidden || x < d.x0 || x > d.x1 || z < d.z0 || z > d.z1 || !s.has(x, z)) continue;
    if (Math.abs(s.heightAt(x, z) - y) < 0.25) return 'rock';
  }
  const R = w.roomAt(x, y + 0.3, z);
  if (R?.cells || R?.sky !== undefined) return 'rock';
  return R?.plain ? 'metal' : 'concrete';
}

/** how a sound made at (x, y, z) reaches you: how far it has to come, from which side, how muffled. Through the rooms
 *  where the cast's sound field reaches; past it, or with no way through, as if through the rock. */
export function hearing(sim: Sim, x: number, y: number | undefined, z: number): Required<Pick<Voice, 'd' | 'pan' | 'muffle'>> {
  const p = sim.player, b = p.body, dx = x - b.x, dz = z - b.z, dp = Math.hypot(dx, dz);
  const pan = dp < 0.6 ? 0 : clamp((dx * Math.cos(p.yaw) - dz * Math.sin(p.yaw)) / dp, -1, 1) * 0.85;
  const straight = y === undefined ? dp : Math.hypot(dp, y - b.y);
  const F = sim.fields;
  if (!F || F.from < 0 || y === undefined) return { d: straight, pan, muffle: 0 };
  const s = F.nav.locate(x, y, z);
  if (s < 0) return { d: straight, pan, muffle: 0 };
  const path = F.sound[s];
  if (!Number.isFinite(path)) return { d: straight * 1.5 + 8, pan: pan * 0.6, muffle: 1 };
  const extra = Math.max(0, path - straight);
  return { d: straight + extra * 0.6, pan: pan * (1 - clamp(extra / 20, 0, 0.5)), muffle: clamp(extra / 14, 0, 1) };
}

/** what each of the cast says at rest, and how often (seconds, least and most) */
const IDLE: Partial<Record<string, { n: string; t: [number, number] }>> = {
  husk: { n: 'breath', t: [5, 11] }, skitter: { n: 'click', t: [3, 8] }, bloat: { n: 'gurgle', t: [4, 9] },
  thresher: { n: 'growl', t: [4, 8] }, grabber: { n: 'creak', t: [7, 14] },
};
/** the footsteps, which are heard on what they fall on */
const FEET = new Set(['hstep', 'tap']);

interface Heard { dead: boolean; t: number; x: number; z: number; walked: number }
interface Crate { ground: boolean; vmin: number; x: number; z: number; slid: number }

export class Soundscape {
  private sim: Sim | null = null;
  private cast = new WeakMap<Mutant, Heard>();
  private crates = new WeakMap<Loose, Crate>();
  private was = { water: 'dry', under: false, air: 0, vy: 0 };
  private heart = 0;
  private drip = 2;
  private bubbles = 2;

  constructor(private audio: Audio) {}

  /** a sound the sim made */
  event(sim: Sim, ev: Extract<SimEvent, { type: 'sfx' }>): void {
    const p = sim.player, b = p.body;
    let n = ev.name;
    const v: Voice = { big: ev.big, k: ev.k };
    if (ev.x === undefined) {
      v.d = ev.d ?? 0;
      if (n === 'step' || n === 'land') v.surf = floorAt(sim.world, b.x, b.y, b.z, b.on);
      if (n === 'slosh' && p.water === 'swimming') n = 'stroke';
    } else {
      Object.assign(v, hearing(sim, ev.x, ev.y, ev.z!));
      if (FEET.has(n) && ev.y !== undefined) v.surf = floorAt(sim.world, ev.x, ev.y, ev.z!);
    }
    this.audio.play(n, v);
  }

  private at(sim: Sim, n: string, x: number, y: number, z: number, o: Voice = {}): void {
    this.audio.play(n, { ...o, ...hearing(sim, x, y, z) });
  }

  /** a frame of play: what the sim does not say */
  update(sim: Sim, dt: number): void {
    const p = sim.player, b = p.body, g = sim.game, w = sim.world, A = this.audio;
    if (sim !== this.sim) { this.sim = sim; this.was = { water: p.water, under: p.under, air: p.air, vy: 0 }; }

    /* water: in with a splash, under it everything dull, up again gasping */
    A.setUnder(p.under);
    if (this.was.water === 'dry' && p.water !== 'dry') {
      const vy = Math.min(this.was.vy, b.vy);
      if (vy < -3) A.play('splash', { k: clamp(-vy / 12, 0.3, 1) });
    }
    if (this.was.under && !p.under && this.was.air < p.airMax * 0.7) A.play('gasp', { k: 1 - this.was.air / p.airMax });
    if (p.under && (this.bubbles -= dt) < 0) {
      const short = p.air < p.airMax * 0.3;
      this.bubbles = short ? rnd(0.5, 1.4) : rnd(1.8, 4.5);
      A.play('bubble', { d: 2, big: short });
    }
    this.was.water = p.water; this.was.under = p.under; this.was.air = p.air; this.was.vy = b.vy;

    /* badly hurt, you hear your heart, faster as it gets worse */
    if (g.hp < 35 && !g.ended) {
      const k = 1 - Math.max(0, g.hp) / 35;
      if ((this.heart -= dt) < 0) { this.heart = 1.1 - 0.5 * k; A.play('heart', { k }); }
    } else this.heart = 0;

    /* the cast as they go: voices at rest, worms dragging themselves along, swimmers' bubbles, and a cry at the end */
    for (const m of sim.cast) {
      let h = this.cast.get(m);
      if (!h) this.cast.set(m, (h = { dead: m.dead, t: rnd(1, 6), x: m.x, z: m.z, walked: 0 }));
      if (m.dead) {
        if (!h.dead) { h.dead = true; this.at(sim, 'die-' + m.ai, m.x, m.y, m.z, { big: m.big }); }
        continue;
      }
      const moved = Math.hypot(m.x - h.x, m.z - h.z);
      h.x = m.x; h.z = m.z;
      if (moved > 0 && moved < 1) {
        h.walked += moved;
        if (m.ai === 'worm' && h.walked > 0.7) { h.walked = 0; this.at(sim, 'slither', m.x, m.y, m.z); }
        else if (m.ai === 'swimmer' && h.walked > 2.5) { h.walked = 0; this.at(sim, 'bubble', m.x, m.y, m.z); }
      }
      if ((h.t -= dt) > 0) continue;
      const I = IDLE[m.ai];
      if (!I) { h.t = 5; continue; }
      const hunting = m.state === 'hunt' || m.state === 'pursue';
      if (m.ai === 'husk' && hunting) { h.t = rnd(2.5, 5); this.at(sim, 'mutter', m.x, m.y, m.z); continue; }
      h.t = rnd(I.t[0], I.t[1]);
      if (m.state !== 'charge' && m.state !== 'wind') this.at(sim, I.n, m.x, m.y, m.z, { big: m.big });
    }

    /* crates: they scrape when shoved and land with a knock */
    for (const o of sim.loose.all) {
      let c = this.crates.get(o);
      if (!c) this.crates.set(o, (c = { ground: o.ground, vmin: 0, x: o.x, z: o.z, slid: 0 }));
      if (!o.awake) { c.ground = o.ground; c.x = o.x; c.z = o.z; continue; }
      if (!o.ground) c.vmin = Math.min(c.vmin, o.vy);
      else if (!c.ground && c.vmin < -3) this.at(sim, 'crate', o.x, o.y, o.z, { k: clamp(-c.vmin / 10, 0, 1) });
      if (o.ground) c.vmin = 0;
      const slid = Math.hypot(o.x - c.x, o.z - c.z);
      if (o.ground && slid > 0.3 * dt) { c.slid += slid; if (c.slid > 0.5) { c.slid = 0; this.at(sim, 'scrape', o.x, o.y, o.z); } }
      c.ground = o.ground; c.x = o.x; c.z = o.z;
    }

    /* caves breathe and drip; so does anywhere near standing water */
    const cave = floorAt(w, b.x, b.y, b.z) === 'rock';
    A.setBed(cave ? 1 : 0);
    if ((this.drip -= dt) < 0) {
      this.drip = rnd(1.2, 4.5);
      const wet = cave || [[0, 0], [6, 0], [-6, 0], [0, 6], [0, -6]].some(([ox, oz]) => w.waterAt(b.x + ox, b.z + oz) > -Infinity);
      if (wet) A.play('drip', { d: rnd(3, 16), pan: rnd(-0.8, 0.8), muffle: rnd(0, 0.3) });
    }
  }
}

