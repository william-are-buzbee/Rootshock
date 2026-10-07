import { FixedLoop } from './core/loop';
import { testbed } from './content/levels/testbed';
import { STATION } from './content/station';
import { Lighting } from './world/light';
import { applyCommands, makeSim, simLighting, type Sim } from './sim/sim';
import { levelDef, loadRun, makeRun, saveRun, soloRun, stepRun, type Run } from './sim/run';
import { save } from './sim/save';
import { checkProgress, describe, type CheckOpts } from './sim/progress';
import { readStore, writeStore } from './present/store';
import { CameraRig, type Prev } from './present/camera';
import { Controls } from './present/controls';
import { Audio } from './present/audio';
import { Soundscape } from './present/soundscape';
import { View } from './present/render/view';
import { LevelView } from './present/render/levelView';
import { HandsView } from './present/render/handsView';
import { Motes } from './present/render/motes';
import { Prints } from './present/render/prints';
import { Drips } from './present/render/drips';
import { Cascade } from './present/cascade';
import { updatePools } from './present/render/pools';
import { U } from './present/render/shader';
import { Hud } from './present/ui/hud';
import { Panels } from './present/ui/panels';

/* Boot: content -> world -> sim, and the page around it. The frame runs whole sim steps for the time that passed, then draws
   between the last two. The sim reports what happened as events (messages, sounds, a note to show, the power changing,
   another level); the menus send what the player chose back as commands. A run holds every level you have been to;
   each is drawn as its own group, kept once made. */

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
const inStation = STATION.levels.some(l => l.id === want);
if (inStation && params.get('power') === 'full') { STATION.main = true; for (const c of Object.values(STATION.circuits)) { c.on = true; c.broken = false; } }
/* a run left part way (paused, tab hidden, page closed) goes on from where it was; going on uses the save up, so a
   death is still a death. Dev pages and the test bed do not save. (The key keeps the name it had when this was v2, so
   a run in progress survives the move to the site's root.) */
const SAVE_KEY = 'rootshock-v2:run', saving = !DEV && inStation && !params.has('level');
const stored = saving ? readStore(SAVE_KEY) : null;
let resumed: Run | null = null;
if (stored) try { resumed = loadRun(STATION, JSON.parse(stored)); } catch { writeStore(SAVE_KEY, null); }
const seed = (Math.random() * 2 ** 32) >>> 0;
const run: Run = resumed ?? (inStation ? makeRun(STATION, { seed, start: want }) : soloRun(makeSim(testbed(), { seed })));
let sim: Sim = run.here;
let mode: 'title' | 'play' | 'pause' | 'panel' | 'end' = 'title';
function suspend(): void {
  if (saving && sim.tick > 0 && !sim.game.ended && mode !== 'title' && mode !== 'end') writeStore(SAVE_KEY, JSON.stringify(saveRun(run)));
}
if (resumed) {
  document.getElementById('titleg')!.textContent = 'Click to go on where you left off';
  const line = document.createElement('p'), again = document.createElement('a');
  line.className = 'aside';
  again.href = '#'; again.textContent = 'Or start again from the cell.';
  again.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); writeStore(SAVE_KEY, null); location.reload(); });
  line.append(again);
  document.getElementById('title')!.append(line);
}
document.addEventListener('visibilitychange', () => { if (document.hidden) suspend(); });
window.addEventListener('pagehide', suspend);

/* each level drawn once, and lit by the power as it is when you are there */
const lightingNow = () => simLighting(sim);
let lighting = lightingNow();
const levels = new Map<Sim, LevelView>();
function levelView(): LevelView {
  let lv = levels.get(sim);
  if (!lv) levels.set(sim, (lv = new LevelView(sim, lighting, DEV)));
  else lv.relight(lighting);
  return lv;
}
let here = levelView();
view.show(here.group);
view.scene.add(view.camera); // the hand rides on it
const handsView = new HandsView(view.camera, sim, lighting);
let hurtFx = 0, hitFx = 0;
const hitDir = document.getElementById('hitdir')!;

const rig = new CameraRig();
const prints = new Prints(view.scene, lighting);
const drips = new Drips(view.scene, lighting, (x, y, z, water) => scape.dripAt(sim, x, y, z, water));
const motes = new Motes(view.scene, lighting, (x, y, z, k) => scape.gust(sim, x, y, z, k));
const loop = new FixedLoop();
const audio = new Audio();
const scape = new Soundscape(audio);
const prev: Prev = { x: 0, y: 0, z: 0 };
const fade = document.getElementById('fade')!;

const controls = new Controls(canvas, () => { if (mode === 'play') setMode('pause'); }, text => panels.say(text));
const panels = new Panels(c => sim.game.commands.push(c), () => sim.game, () => { if (mode === 'panel') { setMode('play'); controls.lock(); } });
/* ?dev keys, as the first engine had them: V fly, G god, B bright; O for the collider overlay; P for the tracker */
const devFlags = { bright: false, track: false };
if (DEV) {
  controls.onKey.set('KeyV', () => { sim.player.fly = !sim.player.fly; });
  controls.onKey.set('KeyG', () => { sim.game.god = !sim.game.god; });
  controls.onKey.set('KeyB', () => { devFlags.bright = !devFlags.bright; U.uBright.value = devFlags.bright ? 0.55 : 0; });
  controls.onKey.set('KeyO', () => here.overlay?.toggle());
  controls.onKey.set('KeyP', () => { devFlags.track = !devFlags.track; tracked = ''; });
}

/* the tracker (?dev, P): the progression checker on where you stand, run again whenever what it depends on changes (what
   you hold, wear and know, the power, the room you are in) and every half second while you are under water, so you see
   your breath's reach shrink. A level on the far side of a dive is looked at as it stands, or fresh if not yet visited. */
let tracked = '', trackT = 0;
const previews = new Map<string, Sim>();
function track(dt: number): void {
  if (!devFlags.track || !inStation) { hud.track(null); return; }
  const g = sim.game, b = sim.player.body, R = sim.world.roomAt(b.x, b.y + 0.5, b.z);
  const sig = JSON.stringify([sim.world.def.id, R?.id, g.inv, g.worn, g.keys, g.read, g.station, sim.doors.map(d => d.unlocked), sim.items.map(i => i.taken)]);
  trackT -= dt;
  if (sig === tracked && !(sim.player.under && trackT <= 0)) return;
  tracked = sig; trackT = 0.5;
  const far = (id: string) => run.sims.get(id) ?? previews.get(id) ?? (previews.set(id, makeSim(levelDef(STATION, id), { station: STATION, seed: 1 })), previews.get(id)!);
  try { hud.track(describe(checkProgress(sim, { through: far }))); } catch (e) { hud.track('The tracker cannot say: ' + (e as Error).message); }
}

function setMode(m: typeof mode): void {
  if (m === 'pause') suspend();
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

hud.onClick('title', () => { writeStore(SAVE_KEY, null); audio.start(); setMode('play'); controls.lock(); });
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

/** a power change being seen to come on, or null */
let cascade: Cascade | null = null;
function relightAll(L: Lighting): void {
  lighting = L;
  here.relight(L);
  handsView.setLighting(L);
  motes.setLighting(L);
  prints.setLighting(L);
  drips.setLighting(L);
}

/** you are on another level: draw it, light it, and fade in as the first engine did */
function arrive(): void {
  sim = run.here;
  cascade = null;
  lighting = lightingNow();
  here = levelView();
  view.show(here.group);
  handsView.sim = sim;
  handsView.setLighting(lighting);
  motes.setLighting(lighting);
  prints.setLighting(lighting);
  drips.setLighting(lighting);
  rig.reset();
  const b = sim.player.body;
  prev.x = b.x; prev.y = b.y; prev.z = b.z;
  fade.style.transition = 'none';
  fade.style.opacity = '1';
  requestAnimationFrame(() => { fade.style.transition = 'opacity .65s'; fade.style.opacity = '0'; });
}

/** what the sim reported this frame */
function events(): void {
  const g = sim.game;
  for (const ev of g.events.splice(0)) {
    switch (ev.type) {
      case 'say': panels.say(ev.text); break;
      case 'sfx': scape.event(sim, ev); break;
      case 'note': openPanel(() => panels.showNote(g, ev.key)); break;
      case 'pad': openPanel(() => { panels.show('pad'); panels.renderPad(g); }); break;
      case 'lift': openPanel(() => panels.showLift(STATION.levels.map(l => ({ id: l.id, name: l.name, here: l.id === sim.world.def.id })))); break;
      case 'level': break; // the run has moved you already: see arrive()
      case 'power': {
        /* what comes on comes on room by room, out from where you are; what goes off goes at once */
        const b = sim.player.body, R = sim.world.roomAt(b.x, b.y + 0.5, b.z);
        const from = cascade ? cascade.L.to : lighting;
        cascade = new Cascade(sim.world, from, lightingNow(), R?.id ?? -1, r => scape.strike(sim, sim.world.rooms[r]));
        relightAll(cascade.L);
        scape.powerChanged();
        if (ev.loud) audio.play('power');
        break;
      }
      case 'relight':
        /* a light of its own went out: at once, no tubes striking (a power change under way is seen to at once too) */
        cascade = null;
        relightAll(lightingNow());
        break;
      case 'hurt':
        hurtFx = ev.shake > 0 ? 1 : Math.max(hurtFx, 0.7); rig.shake = Math.max(rig.shake, ev.shake);
        if (ev.from) {
          /* which way it came from, as you face: 0 ahead, a quarter turn right, half behind */
          const b = sim.player.body, a = Math.atan2(ev.from.x - b.x, -(ev.from.z - b.z)) + sim.player.yaw;
          rig.struck(a);
          hitDir.style.setProperty('--hx', (50 + 50 * Math.sin(a)).toFixed(1) + '%');
          hitDir.style.setProperty('--hy', (50 - 50 * Math.cos(a)).toFixed(1) + '%');
          hitFx = 1;
        }
        break;
      case 'impact': rig.impact(ev.k); break;
      case 'shake': rig.shake = Math.max(rig.shake, ev.k); break;
      case 'end': setMode('end'); if (document.pointerLockElement) document.exitPointerLock(); panels.showEnd(g, ev.win, ev.msg); break;
    }
  }
  if (panels.open === 'pad') { panels.renderPad(g); if (!g.pad) panels.close(); }
  if (panels.open === 'inv') panels.renderInv();
}

let last = 0, fps = 60, flick = 0, expo = 1;
function frame(t: number): void {
  requestAnimationFrame(frame);
  const dt = last ? Math.min(0.25, (t - last) / 1000) : 0;
  last = t;
  /* the world runs while you play; while a menu is open it stands still and only takes the menu's commands. A lift
     chosen from its panel is a command: the step after it is the one that takes you. */
  if (mode === 'play') {
    const n = loop.advance(dt);
    for (let k = 0; k < n; k++) {
      const b = sim.player.body;
      prev.x = b.x; prev.y = b.y; prev.z = b.z;
      stepRun(run, controls.take());
      if (run.here !== sim) { events(); arrive(); }
    }
  } else if (mode === 'panel') applyCommands(sim);
  if (!sim.tick) { const b = sim.player.body; prev.x = b.x; prev.y = b.y; prev.z = b.z; }
  rig.update(view.camera, sim, prev, mode === 'play' ? loop.alpha : 1, dt, controls.pending);
  /* a failing battery stutters */
  const g = sim.game;
  flick -= dt;
  if (flick < 0 && Math.random() < dt * (g.batt < 20 ? 1.4 : 0.3)) flick = 0.05 + Math.random() * 0.2;
  if (flick > 0 && g.lightOn) { U.uFlash.value *= 0.25; U.uBounce.value *= 0.25; }
  here.update(mode === 'play' ? loop.alpha : 1);
  /* the eye: it opens in the dark, slowly, and narrows against light quickly, so a room coming on glares a moment.
     It adapts to what is around you and to your own light, close in front of you. */
  {
    const b = sim.player.body, l = lighting.atPoint(b.x, b.y + 1, b.z);
    const seen = Math.max(l[0], l[1], l[2]) + U.uFlash.value * 0.12 + U.uBounce.value * 2 + U.uLamp.value * 0.3;
    const k = Math.min(1, Math.max(0, (seen - 0.02) / 0.48)), want = devFlags.bright ? 1 : 1.4 - 0.5 * k * k * (3 - 2 * k);
    expo += (want - expo) * Math.min(1, dt * (want > expo ? 0.6 : 4));
    U.uExpo.value = expo;
  }
  if (cascade) {
    const flipped = cascade.update(dt);
    if (flipped.length) here.relightRooms(lighting, flipped);
    if (cascade.done) { relightAll(cascade.L.to); cascade = null; }
  }
  handsView.update(rig.bob, t / 1000);
  motes.resize(view.renderer.domElement.height, view.camera.fov);
  motes.update(sim, view.camera.position, mode === 'play' ? dt : 0);
  updatePools(sim.world, lighting, view.camera.position, dt);
  prints.update(sim, mode === 'play' ? dt : 0);
  drips.resize(view.renderer.domElement.height, view.camera.fov);
  drips.update(sim, mode === 'play' ? dt : 0);
  scape.placedDrips = drips.count > 0;
  hurtFx = Math.max(0, hurtFx - dt * 0.9);
  hitFx = Math.max(0, hitFx - dt * 1.6);
  hitDir.style.opacity = hitFx.toFixed(2);
  events();
  if (mode === 'play') scape.update(sim, dt, t / 1000);

  /* water: tinted and close in wading water, more so under it (less with goggles), as before */
  const p = sim.player, under = p.under, wet = p.water !== 'dry';
  U.uWet.value = under ? 1 : wet ? 0.4 : 0;
  const fog = (under ? (g.worn.includes('goggles') ? 0.075 : 0.21) : wet ? 0.045 : 0.032) * (devFlags.bright ? 0.25 : 1);
  U.uFog.value += (fog - U.uFog.value) * Math.min(1, dt * 4);
  panels.prompt(mode === 'play' ? sim.focus?.text ?? null : null);
  panels.status(g, p.air < p.airMax - 0.01 ? p.air / p.airMax : null, p.crouch, hurtFx);

  const b = sim.player.body, room = sim.world.roomAt(b.x, b.y + 0.5, b.z);
  hud.setRoom(room?.name ?? '', sim.world.def.name, mode === 'title' ? 0 : dt); // the label waits for you to open your eyes
  if (dt > 0) fps += (1 / dt - fps) * 0.05;
  if (DEV) track(dt);
  hud.dev(DEV ? `${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.z.toFixed(2)}  ${room?.name ?? 'rock'}  ${b.ground ? 'ground' : 'air'}  ${Math.round(fps)} fps\n${sim.world.def.name}: ${sim.world.grid.chunkCount} chunks  mesh ${here.meshMs.toFixed(0)} ms  ${['fly', 'god', 'bright'].filter(k => k === 'fly' ? sim.player.fly : k === 'god' ? sim.game.god : devFlags.bright).join(' ')}\nV fly  G god  B bright  O colliders  P tracker` : null);
  view.draw(t / 1000);
}
/* ?dev: the run on the window, for poking at from the console or a test script */
if (DEV) (window as unknown as { rs: unknown }).rs = {
  run, get sim() { return sim; }, step: stepRun, save: () => save(sim), saveRun: () => saveRun(run),
  progress: (o?: CheckOpts) => describe(checkProgress(sim, o)),
};

setMode('title');
requestAnimationFrame(frame);
