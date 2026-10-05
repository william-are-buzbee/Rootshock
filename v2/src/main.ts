import { FixedLoop } from './core/loop';
import { testbed } from './content/levels/testbed';
import { makeSim, step, type Sim } from './sim/sim';
import { CameraRig, type Prev } from './present/camera';
import { Controls } from './present/controls';
import { View } from './present/render/view';
import { Hud } from './present/ui/hud';

/* Boot: content -> world -> sim, and the page around it. The frame runs whole sim steps for the time that passed, then draws
   between the last two. */

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

const level = testbed();
const sim: Sim = makeSim(level);
view.setLevel(sim.world);

const rig = new CameraRig();
const loop = new FixedLoop();
const prev: Prev = { x: 0, y: 0, z: 0 };
let mode: 'title' | 'play' | 'pause' = 'title';

const controls = new Controls(canvas, () => {
  if (mode === 'play') setMode('pause');
});

function setMode(m: typeof mode): void {
  mode = m;
  controls.enabled = m === 'play';
  hud.show('title', m === 'title');
  hud.show('pause', m === 'pause');
  hud.show('hud', m !== 'title');
}

hud.onClick('title', () => { setMode('play'); controls.lock(); });
hud.onClick('pause', () => { setMode('play'); controls.lock(); });

let last = 0, fps = 60;
function frame(t: number): void {
  requestAnimationFrame(frame);
  const dt = last ? Math.min(0.25, (t - last) / 1000) : 0;
  last = t;
  if (mode === 'play') {
    const n = loop.advance(dt);
    for (let k = 0; k < n; k++) {
      const b = sim.player.body;
      prev.x = b.x; prev.y = b.y; prev.z = b.z;
      step(sim, controls.take());
    }
  }
  if (!sim.tick) { const b = sim.player.body; prev.x = b.x; prev.y = b.y; prev.z = b.z; }
  rig.update(view.camera, sim, prev, mode === 'play' ? loop.alpha : 1, dt, controls.pending);

  const b = sim.player.body, room = sim.world.roomAt(b.x, b.y + 0.5, b.z);
  hud.setRoom(room?.name ?? '', level.name, dt);
  if (dt > 0) fps += (1 / dt - fps) * 0.05;
  hud.dev(DEV ? `${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.z.toFixed(2)}  ${room?.name ?? 'rock'}  ${b.ground ? 'ground' : 'air'}  ${Math.round(fps)} fps` : null);
  view.draw(t / 1000);
}
/* ?dev: the sim on the window, for poking at from the console or a test script */
if (DEV) (window as unknown as { rs: unknown }).rs = { sim };

setMode('title');
requestAnimationFrame(frame);
