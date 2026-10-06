import { FixedLoop } from './core/loop';
import { testbed } from './content/levels/testbed';
import { STATION } from './content/station';
import { Lighting } from './world/light';
import { applyCommands, makeSim, step, type Sim } from './sim/sim';
import { power } from './sim/game';
import { AIR } from './sim/player';
import { CameraRig, type Prev } from './present/camera';
import { Controls } from './present/controls';
import { Audio } from './present/audio';
import { View } from './present/render/view';
import { Things } from './present/render/things';
import { Overlay } from './present/render/overlay';
import { U } from './present/render/shader';
import { Hud } from './present/ui/hud';
import { Panels } from './present/ui/panels';

/* Boot: content -> world -> sim, and the page around it. The frame runs whole sim steps for the time that passed, then draws
   between the last two. The sim reports what happened as events (messages, sounds, a note to show, the power changing);
   the menus send what the player chose back as commands. */

const params = new URLSearchParams(location.search);
const DEV = params.has('dev');

const canvas = document.getElementById('c') as HTMLCanvasElement;
const hud = new Hud();
let view: View;
try {
  view = new View(canvas);
} catch {
  document.getElementById('titleg')!.textContent = 'This browser could not start WebGL.';
  throw new Error('no WebGL');
}

/* which level: the station's start by default; ?level=<id> for another, or the test bed. ?power=full: everything on. */
const want = params.get('level') ?? STATION.start;
const entry = STATION.levels.find(l => l.id === want);
const level = want === 'testbed' || !entry ? testbed() : entry.build();
const station = want === 'testbed' || !entry ? undefined : STATION;
if (station && params.get('power') === 'full') { station.main = true; for (const c of Object.values(station.circuits)) { c.on = true; c.broken = false; } }
const sim: Sim = makeSim(level, { seed: (Math.random() * 2 ** 32) >>> 0, station });
const lightingNow = () => new Lighting(sim.world, c => power(sim.game, c));
let lighting = lightingNow();
const t0 = performance.now();
view.setLevel(sim.world, lighting);
const meshMs = performance.now() - t0;
const things = new Things(view.scene, sim, lighting);
const overlay = DEV ? new Overlay(view.scene, sim) : null;

const rig = new CameraRig();
const loop = new FixedLoop();
const audio = new Audio();
const prev: Prev = { x: 0, y: 0, z: 0 };
let mode: 'title' | 'play' | 'pause' | 'panel' | 'end' = 'title';

const controls = new Controls(canvas, () => { if (mode === 'play') setMode('pause'); });
const panels = new Panels(c => sim.game.commands.push(c), () => sim.game, () => { if (mode === 'panel') { setMode('play'); controls.lock(); } });
if (overlay) controls.onKey.set('KeyG', () => overlay.toggle());

function setMode(m: typeof mode): void {
  mode = m;
  controls.enabled = m === 'play';
  hud.show('title', m === 'title');
  hud.show('pause', m === 'pause');
  hud.show('hud', m !== 'title');
}
function openPanel(fn: () => void): void {
  setMode('panel');
  fn();
}

hud.onClick('title', () => { audio.start(); setMode('play'); controls.lock(); });
hud.onClick('pause', () => { setMode('play'); controls.lock(); });
document.getElementById('end')!.addEventListener('click', () => location.reload());

/* keys the menus handle: Tab for what you carry, Esc and E to step back, digits on a keypad, R to start again */
window.addEventListener('keydown', e => {
  if (e.repeat) return;
  const c = e.code;
  if (mode === 'play' && (c === 'Tab' || c === 'KeyI')) { openPanel(() => panels.show('inv')); return; }
  if (mode === 'end' && c === 'KeyR') { location.reload(); return; }
  if (mode !== 'panel') return;
  const open = panels.open;
  if (open === 'pad') {
    const m = /^(?:Digit|Numpad)(\d)$/.exec(c);
    if (m) sim.game.commands.push({ type: 'pad', key: m[1] });
    else if (c === 'Backspace') sim.game.commands.push({ type: 'pad', key: 'C' });
    else if (c === 'Escape' || c === 'Tab') panels.close();
  } else if (c === 'Escape' || c === 'Tab' || c === 'KeyI' || (c === 'KeyE' && open !== 'inv') || (c === 'Space' && open === 'note')) panels.close();
});

/** what the sim reported this frame */
function events(): void {
  const g = sim.game, b = sim.player.body;
  for (const ev of g.events.splice(0)) {
    switch (ev.type) {
      case 'say': panels.say(ev.text); break;
      case 'sfx': if (ev.x !== undefined) audio.at(ev.name, ev.x, ev.z!, { x: b.x, z: b.z, yaw: sim.player.yaw }, ev.big); else audio.play(ev.name); break;
      case 'note': openPanel(() => panels.showNote(g, ev.key)); break;
      case 'pad': openPanel(() => { panels.show('pad'); panels.renderPad(g); }); break;
      case 'lift': openPanel(() => panels.showLift(STATION.levels.map(l => ({ id: l.id, name: l.name, here: l.id === level.id })))); break;
      case 'power':
        lighting = lightingNow();
        view.relight(lighting);
        things.setLighting(lighting);
        audio.setHum(!!g.station?.main);
        if (ev.loud) audio.play('power');
        break;
      case 'end': setMode('end'); if (document.pointerLockElement) document.exitPointerLock(); panels.showEnd(g, ev.win, ev.msg); break;
    }
  }
  if (panels.open === 'pad') { panels.renderPad(g); if (!g.pad) panels.close(); }
  if (panels.open === 'inv') panels.renderInv();
}

let last = 0, fps = 60, flick = 0;
function frame(t: number): void {
  requestAnimationFrame(frame);
  const dt = last ? Math.min(0.25, (t - last) / 1000) : 0;
  last = t;
  /* the world runs while you play; while a menu is open it stands still and only takes the menu's commands */
  if (mode === 'play') {
    const n = loop.advance(dt);
    for (let k = 0; k < n; k++) {
      const b = sim.player.body;
      prev.x = b.x; prev.y = b.y; prev.z = b.z;
      step(sim, controls.take());
    }
  } else if (mode === 'panel') applyCommands(sim);
  if (!sim.tick) { const b = sim.player.body; prev.x = b.x; prev.y = b.y; prev.z = b.z; }
  rig.update(view.camera, sim, prev, mode === 'play' ? loop.alpha : 1, dt, controls.pending);
  /* a failing battery stutters */
  const g = sim.game;
  flick -= dt;
  if (flick < 0 && Math.random() < dt * (g.batt < 20 ? 1.4 : 0.3)) flick = 0.05 + Math.random() * 0.2;
  if (flick > 0 && g.lightOn) U.uFlash.value *= 0.25;
  things.update();
  overlay?.update();
  events();

  const p = sim.player, under = p.under;
  U.uWet.value = under ? 1 : 0;
  U.uFog.value += ((under ? 0.21 : 0.032) - U.uFog.value) * Math.min(1, dt * 4);
  panels.prompt(mode === 'play' ? sim.focus?.text ?? null : null);
  panels.status(g, p.air < AIR - 0.01 ? p.air / AIR : null, p.crouch);

  const b = sim.player.body, room = sim.world.roomAt(b.x, b.y + 0.5, b.z);
  hud.setRoom(room?.name ?? '', level.name, dt);
  if (dt > 0) fps += (1 / dt - fps) * 0.05;
  hud.dev(DEV ? `${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.z.toFixed(2)}  ${room?.name ?? 'rock'}  ${b.ground ? 'ground' : 'air'}  ${Math.round(fps)} fps\n${sim.world.grid.chunkCount} chunks  mesh ${meshMs.toFixed(0)} ms` : null);
  view.draw(t / 1000);
}
/* ?dev: the sim on the window, for poking at from the console or a test script */
if (DEV) (window as unknown as { rs: unknown }).rs = { sim, overlay, step };

setMode('title');
requestAnimationFrame(frame);
