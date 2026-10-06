/* Every sound is synthesised, as before: noise and tones shaped on the spot, panned by where the thing is. Ported from the
   first engine's audio section, and grown since: footsteps that know what they fall on, and voices for the cast.
   Sounds are played from the sim's events and from the soundscape (soundscape.ts), which says where each one is. */

/** what a foot comes down on */
export type Surf = 'concrete' | 'metal' | 'rock' | 'wood' | 'wet';

/** how a sound reaches you: how far it travelled, which side it comes from (-1 left to 1 right), how muffled by what is
 *  between (0 open air, 1 through rock); big for the heavy kind; what it stands on; how hard (0..1) */
export interface Voice { d?: number; pan?: number; muffle?: number; big?: boolean; surf?: Surf; k?: number }

const RANGE: Record<string, number> = {
  door: 46, roar: 55, thud: 40, hstep: 18, moan: 28, tap: 24, skit: 24, slosh: 20, swing: 10, whiff: 14, gust: 24, strike: 30, knock: 32, groan: 55, tick: 12, settle: 45, step: 30, rattle: 30,
  breath: 10, mutter: 20, click: 14, gurgle: 22, growl: 30, slither: 10, bubble: 12, creak: 12, drip: 30, scrape: 20, crate: 30,
  'die-husk': 40, 'die-skitter': 36, 'die-bloat': 46, 'die-thresher': 50, 'die-worm': 20, 'die-swimmer': 20, 'die-grabber': 24,
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export class Audio {
  private ac: AudioContext | null = null;
  private master!: GainNode;
  /** every sound from the world goes through here, and from here into the room's echo */
  private bus!: GainNode;
  /** the steady sounds (the drone, Gen-1, a cave's air, a tube's buzz): no echo of their own */
  private amb!: GainNode;
  /** muffles everything when your ears are under water */
  private under!: BiquadFilterNode;
  private dest!: AudioNode;
  private noise!: AudioBuffer;
  /** Gen-1: its note, how loud, how bright, and from which side */
  private hum!: { o: OscillatorNode; sub: OscillatorNode; g: GainNode; f: BiquadFilterNode; p: StereoPannerNode | null };
  /** a cave's air moving */
  private bed!: GainNode;
  /** a room's moving air: silent where the fans are dead */
  private air!: GainNode;
  private airTone!: BiquadFilterNode;
  private airPan: StereoPannerNode | null = null;
  /** the echo of a small room, a hall and a vast space, each as loud as the room you are in is like it */
  private space: GainNode[] = [];
  /** a failing tube */
  private buzz!: GainNode;
  /** footsteps alternate feet */
  private foot = false;
  /** what the steady sounds were last set to, so they are only touched when that changes */
  private last: Record<string, string> = {};
  private changed(k: string, ...v: number[]): boolean {
    const s = v.map(x => x.toFixed(2)).join();
    if (this.last[k] === s) return false;
    this.last[k] = s;
    return true;
  }

  /** audio can only start on a click */
  start(): void {
    if (this.ac) { void this.ac.resume(); return; }
    try {
      const ac = new AudioContext();
      this.ac = ac;
      this.master = ac.createGain(); this.master.gain.value = 0.55; this.master.connect(ac.destination);
      this.under = ac.createBiquadFilter(); this.under.type = 'lowpass'; this.under.frequency.value = 22000; this.under.connect(this.master);
      this.bus = ac.createGain(); this.bus.connect(this.under);
      this.amb = ac.createGain(); this.amb.connect(this.under);
      this.dest = this.bus;
      /* the echo: noise dying away, sooner and brighter for a small room, slower and darker for a vast one */
      for (const [secs, dark] of [[0.45, 0.2], [1.6, 0.4], [3.4, 0.6]]) {
        const cv = ac.createConvolver(), g = ac.createGain();
        cv.buffer = this.impulse(secs, dark); g.gain.value = 0;
        this.bus.connect(cv); cv.connect(g); g.connect(this.under);
        this.space.push(g);
      }
      this.noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      /* the station's drone, and Gen-1's hum (silent until it runs) */
      for (const f of [46, 49.3]) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.06; o.connect(g); g.connect(this.amb); o.start(); }
      const o = ac.createOscillator(), sub = ac.createOscillator(), fl = ac.createBiquadFilter(), hg = ac.createGain(), sg = ac.createGain();
      const hp = ac.createStereoPanner ? ac.createStereoPanner() : null;
      o.type = 'sawtooth'; o.frequency.value = 25; sub.frequency.value = 12.5; sg.gain.value = 1.4;
      fl.type = 'lowpass'; fl.frequency.value = 220; hg.gain.value = 0;
      o.connect(fl); sub.connect(sg); sg.connect(fl); fl.connect(hg);
      if (hp) { hg.connect(hp); hp.connect(this.amb); } else hg.connect(this.amb);
      o.start(); sub.start();
      this.hum = { o, sub, g: hg, f: fl, p: hp };
      /* air in the rock: noise, low and slow, silent until you are in a cave */
      const s = ac.createBufferSource(), bf = ac.createBiquadFilter();
      s.buffer = this.noise; s.loop = true; bf.type = 'bandpass'; bf.frequency.value = 240; bf.Q.value = 0.6;
      this.bed = ac.createGain(); this.bed.gain.value = 0;
      s.connect(bf); bf.connect(this.bed); this.bed.connect(this.amb); s.start();
      /* a room's air handling: a soft rush of moving air, silent where the fans are dead */
      const an = ac.createBufferSource(), af = ac.createBiquadFilter(), al = ac.createBiquadFilter();
      an.buffer = this.noise; an.loop = true; an.playbackRate.value = 0.7;
      af.type = 'bandpass'; af.frequency.value = 900; af.Q.value = 0.45; al.type = 'lowpass'; al.frequency.value = 2600;
      this.air = ac.createGain(); this.air.gain.value = 0; this.airTone = al;
      this.airPan = ac.createStereoPanner ? ac.createStereoPanner() : null;
      an.connect(af); af.connect(al); al.connect(this.air);
      if (this.airPan) { this.air.connect(this.airPan); this.airPan.connect(this.amb); } else this.air.connect(this.amb);
      an.start();
      /* a fluorescent tube's buzz: mains hum and its harsh overtones */
      const bz = ac.createOscillator(), bh = ac.createBiquadFilter();
      bz.type = 'sawtooth'; bz.frequency.value = 120; bh.type = 'highpass'; bh.frequency.value = 900;
      this.buzz = ac.createGain(); this.buzz.gain.value = 0;
      bz.connect(bh); bh.connect(this.buzz); this.buzz.connect(this.amb); bz.start();
    } catch { this.ac = null; }
  }

  /** a room's echo: noise dying away over `secs`, losing its highs first, more so the darker */
  private impulse(secs: number, dark: number): AudioBuffer {
    const ac = this.ac!, sr = ac.sampleRate, n = Math.floor(secs * sr), pre = Math.floor(0.012 * sr), b = ac.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      let lp = 0;
      for (let i = pre; i < n; i++) {
        const t = (i - pre) / sr, a = Math.min(0.97, dark + (0.5 * t) / secs);
        lp = lp * a + (Math.random() * 2 - 1) * (1 - a);
        d[i] = (lp * Math.exp((-6.9 * t) / secs)) / Math.sqrt((1 - a) / (1 + a));
      }
    }
    return b;
  }

  /** Gen-1: running or not, how loud it is where you are (0..1), how muffled, which side. It winds up and down. */
  setHum(on: boolean, level = 1, muffle = 0, pan = 0): void {
    if (!this.ac || !this.changed('hum', +on, level, muffle, pan)) return;
    const t = this.ac.currentTime, H = this.hum;
    H.o.frequency.setTargetAtTime(on ? 100 : 25, t, on ? 0.8 : 1.6);
    H.sub.frequency.setTargetAtTime(on ? 50 : 12.5, t, on ? 0.8 : 1.6);
    H.g.gain.setTargetAtTime(on ? 0.12 * level : 0, t, on ? 0.5 : 1.4);
    H.f.frequency.setTargetAtTime(160 + 1100 * level * (1 - muffle), t, 0.3);
    H.p?.pan.setTargetAtTime(pan, t, 0.1);
  }

  /** the echo of where you are: how much of a small room's, a hall's and a vast space's */
  setSpace(small: number, hall: number, vast: number): void {
    if (!this.ac || !this.changed('space', small, hall, vast)) return;
    const t = this.ac.currentTime;
    [small, hall, vast].forEach((v, i) => this.space[i].gain.setTargetAtTime(v, t, 0.35));
  }

  /** a failing tube: how near (0..1), and whether it is dimmed this moment */
  setBuzz(level: number, dim: boolean): void {
    if (this.ac && this.changed('buzz', level, +dim)) this.buzz.gain.setTargetAtTime(0.018 * level * (dim ? 0.12 : 1), this.ac.currentTime, 0.008);
  }

  /** your ears under water: everything dull and close */
  setUnder(on: boolean): void {
    if (!this.ac || !this.changed('under', +on)) return;
    this.under.frequency.setTargetAtTime(on ? 420 : 22000, this.ac.currentTime, on ? 0.05 : 0.12);
  }

  /** the air moving in the room you are in, 0 (dead still) to 1 (its fans on Gen-1): spools up and runs down. `near`
   *  (0..1): how close its nearest grille is, which makes it louder and brighter; `pan`: which side the grille is on */
  setAir(k: number, near = 0, pan = 0): void {
    if (!this.ac || !this.changed('air', k, Math.round(near * 20), Math.round(pan * 20))) return;
    const t = this.ac.currentTime;
    this.air.gain.setTargetAtTime(0.03 * k * (0.55 + 0.9 * near), t, k > 0 ? 1.2 : 0.9);
    this.airTone.frequency.setTargetAtTime(2000 + 2400 * near, t, 0.3);
    this.airPan?.pan.setTargetAtTime(pan * near, t, 0.2);
  }

  /** the cave's air, 0 to 1 */
  setBed(k: number): void {
    if (this.ac && this.changed('bed', k)) this.bed.gain.setTargetAtTime(0.05 * k, this.ac.currentTime, 0.8);
  }

  /** where this sound's parts go: muffled by what is between, then to its side */
  private chain(pan: number, muffle: number): AudioNode {
    const ac = this.ac!;
    let to: AudioNode = this.bus;
    if (pan && ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; p.connect(to); to = p; }
    if (muffle > 0.02) {
      const f = ac.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 18000 * Math.pow(300 / 18000, Math.min(1, muffle));
      f.connect(to); to = f;
    }
    return to;
  }
  /** a tone sweeping f0 to f1, `t` seconds from now, rising over `atk` and dying away */
  private tn(f0: number, f1: number, dur: number, type: OscillatorType, vol: number, t = 0, atk = 0): void {
    if (vol < 0.003) return;
    const ac = this.ac!, o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + t;
    o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    if (atk > 0) { g.gain.setValueAtTime(0.001, t0); g.gain.linearRampToValueAtTime(vol, t0 + atk); } else g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + Math.max(dur, atk + 0.01));
    o.connect(g); g.connect(this.dest); o.start(t0); o.stop(t0 + Math.max(dur, atk) + 0.02);
  }
  /** filtered noise, `t` seconds from now; its filter sweeps to f1 if given, rises over `atk` */
  private nz(dur: number, vol: number, freq: number, type: BiquadFilterType = 'lowpass', t = 0, q = 1, f1 = 0, atk = 0): void {
    if (vol < 0.003) return;
    const ac = this.ac!, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t0 = ac.currentTime + t;
    s.buffer = this.noise; f.type = type; f.frequency.setValueAtTime(freq, t0); f.Q.value = q;
    if (f1 > 0) f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    if (atk > 0) { g.gain.setValueAtTime(0.001, t0); g.gain.linearRampToValueAtTime(vol, t0 + atk); } else g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + Math.max(dur, atk + 0.01));
    s.connect(f); f.connect(g); g.connect(this.dest); s.start(t0, Math.random() * 0.5, Math.max(dur, atk) + 0.05);
  }

  /** a foot coming down on something, at `vol`, `t` seconds from now */
  private step(s: Surf, vol: number, t = 0): void {
    const p = rnd(0.88, 1.12) * ((this.foot = !this.foot) ? 1 : 0.94);
    switch (s) {
      case 'metal': // grating: it rings
        this.tn(95 * p, 60, 0.08, 'sine', 0.4 * vol, t);
        this.nz(0.05, 0.55 * vol, 1300 * p, 'bandpass', t, 1.2);
        this.tn(380 * p, 365 * p, 0.18, 'triangle', 0.16 * vol, t);
        this.tn(1130 * p, 1090 * p, 0.1, 'triangle', 0.07 * vol, t);
        this.nz(0.04, 0.25 * vol, 2400 * p, 'bandpass', t + 0.05, 1.5);
        break;
      case 'rock': // grit underfoot
        this.tn(90 * p, 50, 0.06, 'sine', 0.35 * vol, t);
        for (let i = 0, at = t; i < 4; i++, at += rnd(0.01, 0.025)) this.nz(0.025, rnd(0.25, 0.5) * vol, rnd(1800, 3600), 'bandpass', at, 2);
        break;
      case 'wood': // a crate's lid: hollow
        this.tn(190 * p, 130 * p, 0.12, 'sine', 0.55 * vol, t);
        this.tn(420 * p, 300, 0.05, 'triangle', 0.12 * vol, t);
        this.nz(0.05, 0.35 * vol, 500, 'lowpass', t);
        break;
      case 'wet': // a puddle
        this.tn(90, 55, 0.06, 'sine', 0.3 * vol, t);
        this.nz(0.12, 0.45 * vol, 1800 * p, 'bandpass', t, 0.7, 900);
        this.nz(0.16, 0.25 * vol, 600 * p, 'bandpass', t + 0.02, 1);
        break;
      default: // concrete: the heel, then the toe
        this.tn(110 * p, 55, 0.07, 'sine', 0.5 * vol, t);
        this.nz(0.05, 0.6 * vol, 700 * p, 'bandpass', t, 0.8);
        this.nz(0.04, 0.3 * vol, 1500 * p, 'bandpass', t + 0.045, 1);
    }
  }
  /** something heavy putting its weight down */
  private heavy(s: Surf, vol: number): void {
    const p = rnd(0.85, 1.15);
    this.tn(58 * p, 32, 0.22, 'sine', 0.55 * vol);
    this.nz(0.16, 0.5 * vol, 160 * p);
    if (s === 'wet') { this.nz(0.35, 0.4 * vol, 900, 'bandpass', 0.02, 0.8, 300); return; }
    this.step(s, 0.3 * vol);
  }

  play(n: string, o: Voice = {}): void {
    if (!this.ac) return;
    let v = Math.max(0, Math.min(1, 1 - (o.d ?? 0) / (RANGE[n] ?? 22)));
    if (v <= 0) return;
    v *= v;
    const big = !!o.big, surf = o.surf ?? 'concrete', k = o.k ?? 0.5;
    this.dest = this.chain(o.pan ?? 0, o.muffle ?? 0);
    try {
      switch (n) {
        /* you */
        case 'step': this.step(surf, 0.16 * v); break;
        case 'land':
          this.step(surf, (0.16 + 0.25 * k));
          this.tn(80, 40, 0.12 + 0.1 * k, 'sine', 0.25 + 0.5 * k);
          this.nz(0.15 + 0.15 * k, 0.15 + 0.5 * k, 200);
          if (k > 0.5) this.nz(0.08, 0.15 * k, 3200, 'highpass', 0.05); // what you carry rattles
          break;
        case 'jump': this.nz(0.08, 0.1, 900, 'bandpass', 0, 1, 500); this.nz(0.15, 0.04, 2500, 'bandpass', 0.02, 1, 1200, 0.04); break;
        case 'slosh': this.nz(0.3, 0.22 * v, rnd(600, 800), 'bandpass', 0, 1, 400); this.nz(0.2, 0.15 * v, 250); break;
        case 'stroke': this.nz(0.45, 0.14 * v, 500, 'bandpass', 0, 0.8, 1100, 0.15); this.nz(0.3, 0.08 * v, 250, 'lowpass', 0.1); break;
        case 'splash':
          this.nz(0.6, 0.5 * k, 900, 'bandpass', 0, 0.7, 300); this.nz(0.3, 0.35 * k, 3000, 'highpass');
          this.tn(110, 40, 0.25, 'sine', 0.3 * k);
          break;
        case 'gasp': this.nz(0.45, 0.12 + 0.12 * k, 1300, 'bandpass', 0, 1.2, 700, 0.05); this.nz(0.5, 0.07, 900, 'bandpass', 0.55, 1.5, 500, 0.1); break;
        case 'heart': this.tn(60, 40, 0.12, 'sine', 0.2 + 0.25 * k); this.tn(55, 38, 0.1, 'sine', 0.14 + 0.18 * k, 0.22); break;
        case 'bubble':
          for (let i = 0, at = 0; i < 3 + (big ? 3 : 0); i++, at += rnd(0.04, 0.12)) { const f = rnd(350, 900); this.tn(f, f * 1.7, 0.05, 'sine', 0.07 * v, at); }
          break;

        /* the cast */
        case 'hstep':
          if (big) { this.heavy(surf, v); break; }
          this.step(surf, 0.3 * v);
          if (Math.random() < 0.6) this.nz(0.18, 0.1 * v, 400, 'bandpass', 0.06, 1.5, 900, 0.05); // a foot dragged
          break;
        case 'tap': {
          const f = big ? rnd(450, 650) : rnd(1200, 1700);
          for (let i = 0, at = 0; i < 3; i++, at += rnd(0.02, 0.035)) this.tn(f * rnd(0.9, 1.1), f * 0.65, 0.025, 'square', (i ? 0.06 : 0.1) * v, at);
          if (surf === 'wet') this.nz(0.1, 0.12 * v, 1600, 'bandpass', 0, 1);
          break;
        }
        case 'skit': this.tn(900, 1500, 0.15, 'sawtooth', 0.09 * v); break;
        case 'moan': this.tn(190, 120, 0.7, 'sawtooth', 0.12 * v); this.tn(285, 170, 0.6, 'sine', 0.1 * v); break;
        case 'roar': this.tn(120, 55, 0.8, 'sawtooth', 0.4 * v); this.nz(0.7, 0.3 * v, 600); break;
        case 'swing': this.nz(0.14, 0.12 * v, 1200, 'bandpass'); break;
        case 'whiff': this.nz(big ? 0.32 : 0.22, (big ? 0.2 : 0.15) * v, big ? 600 : 1000, 'bandpass', 0, 1.5, big ? 200 : 320, 0.05); break; // a blow that met nothing
        case 'breath': // a husk at rest: in, and a long way out
          this.nz(0.6, 0.06 * v, 600, 'bandpass', 0, 3, 900, 0.4);
          this.nz(0.9, 0.07 * v, 800, 'bandpass', 0.7, 3, 450, 0.2);
          break;
        case 'mutter': { const f = rnd(120, 170); this.tn(f, f * 0.7, 0.45, 'sawtooth', 0.07 * v, 0, 0.08); this.nz(0.4, 0.05 * v, 650, 'bandpass', 0, 2, 0, 0.08); break; }
        case 'click': for (let i = 0, at = 0; i < 2 + Math.floor(Math.random() * 3); i++, at += rnd(0.06, 0.18)) this.tn(rnd(1800, 2600), 1400, 0.015, 'square', 0.06 * v, at); break;
        case 'gurgle': this.nz(0.8, 0.12 * v, 180, 'bandpass', 0, 4, 420, 0.2); this.tn(70, 58, 0.7, 'sine', 0.12 * v, 0, 0.2); break;
        case 'growl': this.tn(rnd(62, 74), 55, 1.2, 'sawtooth', 0.11 * v, 0, 0.3); this.nz(1.1, 0.1 * v, 280, 'lowpass', 0, 1, 0, 0.3); break;
        case 'slither': this.nz(0.35, 0.08 * v, 1200, 'bandpass', 0, 2, 700, 0.1); break;
        case 'creak': { const f = rnd(110, 160); this.tn(f, f * 0.9, 0.6, 'sawtooth', 0.05 * v, 0, 0.2); this.nz(0.5, 0.05 * v, 1800, 'bandpass', 0, 6, 0, 0.2); break; }
        case 'die-husk':
          this.tn(170, 70, 1.1, 'sawtooth', 0.14 * v, 0, 0.05); this.tn(255, 90, 0.9, 'sine', 0.1 * v);
          this.nz(0.25, 0.45 * v, 140, 'lowpass', 0.55);
          break;
        case 'die-skitter': this.tn(1500, 300, 0.5, 'sawtooth', 0.09 * v); this.nz(0.2, 0.3 * v, 200, 'lowpass', 0.3); break;
        case 'die-bloat':
          this.nz(1.3, 0.3 * v, 320, 'bandpass', 0, 2, 110, 0.1); this.tn(90, 40, 1.2, 'sawtooth', 0.18 * v);
          this.nz(0.4, 0.7 * v, 110, 'lowpass', 0.9); this.tn(55, 30, 0.35, 'sine', 0.5 * v, 0.9);
          break;
        case 'die-thresher':
          this.tn(140, 35, 1.4, 'sawtooth', 0.35 * v); this.nz(1.2, 0.3 * v, 400);
          this.nz(0.35, 0.7 * v, 120, 'lowpass', 0.8); this.tn(50, 30, 0.3, 'sine', 0.5 * v, 0.8);
          break;
        case 'die-worm': case 'die-swimmer': this.nz(0.3, 0.25 * v, 700, 'bandpass', 0, 1.5, 200); this.tn(300, 120, 0.3, 'sine', 0.08 * v); break;
        case 'die-grabber': this.tn(220, 90, 0.5, 'sawtooth', 0.1 * v); this.nz(0.1, 0.3 * v, 2500, 'bandpass', 0, 2); break;

        /* the station */
        case 'door': this.nz(0.4, 0.5 * v, 260); this.tn(85, 48, 0.35, 'sine', 0.35 * v); this.tn(320, 180, 0.12, 'square', 0.05 * v); break;
        case 'thud': this.nz(0.25, 0.7 * v, 120); break;
        case 'rattle':
          for (let i = 0, at = 0; i < 3; i++, at += rnd(0.03, 0.08)) { const f = rnd(500, 1400); this.tn(f, f * 0.96, 0.08, 'triangle', 0.08 * v, at); }
          this.nz(0.12, 0.25 * v, 1500, 'bandpass', 0, 1.5);
          this.tn(60, 40, 0.1, 'sine', 0.2 * v);
          break;
        case 'crate': this.tn(170, 110, 0.15, 'sine', (0.25 + 0.4 * k) * v); this.nz(0.2, (0.3 + 0.4 * k) * v, 300); this.nz(0.06, 0.15 * k * v, 2000, 'bandpass', 0.01); break;
        case 'scrape': this.nz(0.25, 0.14 * v, 300, 'bandpass', 0, 2, 520, 0.03); this.nz(0.2, 0.1 * v, 150, 'lowpass'); break;
        case 'zap': this.nz(0.06, 0.14 * k, 4200, 'highpass'); this.tn(120, 118, 0.05, 'square', 0.03 * k); break;
        case 'tink': this.tn(2600, 2100, 0.012, 'square', 0.025 * k); break;
        /* the station's own noises (soundscape.ts) */
        case 'knock': // a pipe knocking; k: how many, as water hammer runs along it
          for (let i = 0, at = 0, n = 1 + Math.round(k * 4); i < n; i++, at += rnd(0.1, 0.22)) {
            const f = rnd(140, 190), fall = 1 - i / (n + 1);
            this.tn(f, f * 0.6, 0.09, 'square', 0.08 * v * fall, at); this.nz(0.07, 0.12 * v * fall, 700, 'bandpass', at, 3);
          }
          break;
        case 'groan': // the structure taking its load: a long, low metal moan
          this.tn(rnd(48, 62), rnd(38, 46), rnd(1.6, 2.6), 'sawtooth', 0.05 * v, 0, 0.6);
          this.nz(2.2, 0.035 * v, 240, 'bandpass', 0, 5, rnd(380, 520), 0.7);
          break;
        case 'tick': { // metal warming or cooling
          const f = rnd(2200, 3400);
          this.tn(f, f * 0.8, 0.008, 'square', 0.035 * v);
          if (Math.random() < 0.35) this.tn(f * 0.9, f * 0.7, 0.008, 'square', 0.025 * v, rnd(0.05, 0.12));
          break;
        }
        case 'settle': // rock settling: a dull shift in the dark, and grit coming down after it
          this.nz(0.9, 0.18 * v, 90, 'lowpass', 0, 1, 0, 0.15);
          for (let i = 0, at = rnd(0.3, 0.6); i < 2 + Math.floor(Math.random() * 3); i++, at += rnd(0.05, 0.3)) this.tn(rnd(1800, 3200), 1500, 0.02, 'triangle', 0.03 * v, at);
          break;
        case 'strike': // a tube's starter clicks and it catches with a burst of mains buzz
          this.tn(2400, 2000, 0.012, 'square', 0.05 * v);
          this.tn(100, 100, 0.12, 'square', 0.03 * v, 0.03);
          this.nz(0.1, 0.04 * v, 3200, 'bandpass', 0.03, 2);
          break;
        case 'gust': // a shut room's air let out: a long low breath, rising and falling away
          this.nz(1.4, (0.12 + 0.12 * k) * v, 260, 'bandpass', 0, 0.7, 520, 0.25);
          this.nz(0.9, (0.05 + 0.05 * k) * v, 1400, 'bandpass', 0.1, 1.2, 700, 0.2);
          break;
        case 'drip': { const f = rnd(1400, 2600); this.tn(f, f * 0.5, 0.06, 'sine', 0.05 * v); this.tn(f, f * 0.5, 0.06, 'sine', 0.015 * v, 0.17); break; }

        /* what you do */
        case 'hit': this.nz(0.12, 0.5, 260); this.tn(95, 50, 0.14, 'square', 0.2); break;
        case 'clang': this.tn(900, 700, 0.18, 'triangle', 0.15); this.nz(0.05, 0.2, 2000, 'bandpass'); break;
        case 'hurt': this.tn(180, 60, 0.35, 'sawtooth', 0.3); this.nz(0.2, 0.3, 500); break;
        case 'take': this.tn(520, 780, 0.07, 'sine', 0.1); break;
        case 'deny': this.tn(140, 140, 0.15, 'square', 0.1); break;
        case 'power': this.nz(0.6, 0.7, 90); this.tn(40, 100, 2.5, 'sawtooth', 0.12); break;
        case 'paper': this.nz(0.15, 0.1, 3000, 'highpass'); break;
        case 'eat': this.nz(0.2, 0.12, 800); break;
        case 'shot': this.nz(0.18, 0.9, 1800); this.tn(220, 60, 0.12, 'square', 0.4); break;
        case 'boom': this.nz(0.4, 1, 900); this.tn(120, 40, 0.3, 'sawtooth', 0.6); break;
        case 'load': this.tn(300, 380, 0.05, 'triangle', 0.05); break;
      }
    } finally { this.dest = this.bus; }
  }
}
