/* Every sound is synthesised, as before: noise and tones shaped on the spot, panned by where the thing is. Ported from the
   first engine's audio section. Sounds are played from the sim's events. */

const RANGE: Record<string, number> = { door: 46, roar: 55, thud: 40, hstep: 18, moan: 28, tap: 24, skit: 24, slosh: 20, swing: 10 };

export class Audio {
  private ac: AudioContext | null = null;
  private master!: GainNode;
  private noise!: AudioBuffer;
  private hum!: GainNode;
  private pan = 0;

  /** audio can only start on a click */
  start(): void {
    if (this.ac) { void this.ac.resume(); return; }
    try {
      const ac = new AudioContext();
      this.ac = ac;
      this.master = ac.createGain(); this.master.gain.value = 0.55; this.master.connect(ac.destination);
      this.noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      /* the station's drone, and Gen-1's hum (silent until it runs) */
      for (const f of [46, 49.3]) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.06; o.connect(g); g.connect(this.master); o.start(); }
      const o = ac.createOscillator(), fl = ac.createBiquadFilter();
      this.hum = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = 100; fl.type = 'lowpass'; fl.frequency.value = 220; this.hum.gain.value = 0;
      o.connect(fl); fl.connect(this.hum); this.hum.connect(this.master); o.start();
    } catch { this.ac = null; }
  }

  setHum(on: boolean): void {
    if (this.ac) this.hum.gain.value = on ? 0.035 : 0;
  }

  private out(): AudioNode {
    if (!this.pan || !this.ac!.createStereoPanner) return this.master;
    const p = this.ac!.createStereoPanner();
    p.pan.value = this.pan;
    p.connect(this.master);
    return p;
  }
  private tn(f0: number, f1: number, dur: number, type: OscillatorType, vol: number): void {
    if (vol < 0.003) return;
    const ac = this.ac!, o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.out()); o.start(t); o.stop(t + dur + 0.02);
  }
  private nz(dur: number, vol: number, freq: number, type: BiquadFilterType = 'lowpass'): void {
    if (vol < 0.003) return;
    const ac = this.ac!, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
    s.buffer = this.noise; f.type = type; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out()); s.start(t, Math.random() * 0.5, dur + 0.05);
  }

  /** a sound from a place: distance sets the level, bearing sets the pan. (from: the listener and the way they face) */
  at(n: string, x: number, z: number, from: { x: number; z: number; yaw: number }, big = false): void {
    if (!this.ac) return;
    const dx = x - from.x, dz = z - from.z, d = Math.hypot(dx, dz);
    this.pan = d < 0.6 ? 0 : Math.max(-1, Math.min(1, (dx * Math.cos(from.yaw) - dz * Math.sin(from.yaw)) / d)) * 0.85;
    this.play(n, d, big);
    this.pan = 0;
  }

  play(n: string, d = 0, big = false): void {
    if (!this.ac) return;
    let v = Math.max(0, Math.min(1, 1 - d / (RANGE[n] ?? 22)));
    if (v <= 0) return;
    v *= v;
    switch (n) {
      case 'step': this.nz(0.06, 0.06 * v, 300); break;
      case 'hstep': if (big) { this.nz(0.12, 0.5 * v, 140); this.tn(60, 40, 0.1, 'sine', 0.3 * v); } else this.nz(0.07, 0.32 * v, 380); break;
      case 'slosh': this.nz(0.3, 0.22 * v, 700, 'bandpass'); this.nz(0.2, 0.15 * v, 250); break;
      case 'swing': this.nz(0.14, 0.12 * v, 1200, 'bandpass'); break;
      case 'hit': this.nz(0.12, 0.5, 260); this.tn(95, 50, 0.14, 'square', 0.2); break;
      case 'clang': this.tn(900, 700, 0.18, 'triangle', 0.15); this.nz(0.05, 0.2, 2000, 'bandpass'); break;
      case 'hurt': this.tn(180, 60, 0.35, 'sawtooth', 0.3); this.nz(0.2, 0.3, 500); break;
      case 'thud': this.nz(0.25, 0.7 * v, 120); break;
      case 'door': this.nz(0.4, 0.5 * v, 260); this.tn(85, 48, 0.35, 'sine', 0.35 * v); this.tn(320, 180, 0.12, 'square', 0.05 * v); break;
      case 'take': this.tn(520, 780, 0.07, 'sine', 0.1); break;
      case 'deny': this.tn(140, 140, 0.15, 'square', 0.1); break;
      case 'power': this.nz(0.6, 0.7, 90); this.tn(40, 100, 2.5, 'sawtooth', 0.12); break;
      case 'paper': this.nz(0.15, 0.1, 3000, 'highpass'); break;
      case 'eat': this.nz(0.2, 0.12, 800); break;
      case 'tap': this.tn(big ? 500 : 1400, big ? 300 : 900, 0.025, 'square', 0.1 * v); break;
      case 'skit': this.tn(900, 1500, 0.15, 'sawtooth', 0.09 * v); break;
      case 'moan': this.tn(190, 120, 0.7, 'sawtooth', 0.12 * v); this.tn(285, 170, 0.6, 'sine', 0.1 * v); break;
      case 'roar': this.tn(120, 55, 0.8, 'sawtooth', 0.4 * v); this.nz(0.7, 0.3 * v, 600); break;
      case 'shot': this.nz(0.18, 0.9, 1800); this.tn(220, 60, 0.12, 'square', 0.4); break;
      case 'boom': this.nz(0.4, 1, 900); this.tn(120, 40, 0.3, 'sawtooth', 0.6); break;
      case 'load': this.tn(300, 380, 0.05, 'triangle', 0.05); break;
    }
  }
}
