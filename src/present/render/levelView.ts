import * as THREE from 'three';
import type { Sim } from '../../sim/sim';
import type { Lighting } from '../../world/light';
import { CastView } from './castView';
import { buildLevelMesh, type LevelMesh } from './levelMesh';
import { LightVolume } from './lightVolume';
import { Overlay } from './overlay';
import { staticMaterial } from './shader';
import { Things } from './things';

/* One level, drawn: its mesh, what moves in it, its cast, all in one group. Kept once made, so going back to a level is
   only showing it again (as the first engine kept every deck and hid the others). */
export class LevelView {
  readonly group = new THREE.Group();
  readonly overlay: Overlay | null;
  private mesh: LevelMesh;
  private volume: LightVolume;
  private things: Things;
  private cast: CastView;
  /** how long it took to mesh, for the dev readout */
  readonly meshMs: number;

  constructor(readonly sim: Sim, L: Lighting, dev: boolean) {
    const t0 = performance.now();
    this.mesh = buildLevelMesh(sim.world, L);
    this.volume = new LightVolume(L);
    const m = new THREE.Mesh(this.mesh.geometry, staticMaterial());
    m.frustumCulled = false;
    this.group.add(m);
    this.meshMs = performance.now() - t0;
    this.things = new Things(this.group, sim, L);
    this.cast = new CastView(this.group, sim, L);
    this.overlay = dev ? new Overlay(this.group, sim) : null;
  }

  /** this is the level being drawn: the shader reads its light */
  bind(): void {
    this.volume.bind();
  }

  /** the power changed (or may have, while you were elsewhere): light it all again */
  relight(L: Lighting): void {
    this.mesh.relight(L);
    this.volume.sync(L);
    this.things.setLighting(L);
    this.cast.setLighting(L);
  }

  /** only these rooms: a light coming on room by room */
  relightRooms(L: Lighting, rooms: Iterable<number>): void {
    this.mesh.relightRooms(L, rooms);
  }

  /** the light as L has it now (a door moving, a room coming on): only what has changed is sent to the card */
  syncLight(L: Lighting): void {
    this.volume.sync(L);
  }

  update(alpha: number): void {
    this.things.update();
    this.cast.update(alpha);
    this.overlay?.update();
  }
}
