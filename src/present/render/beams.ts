import * as THREE from 'three';
import type { Loose } from '../../world/light';
import { BEAMS, SHADOW, SHADOW_CAM, U } from './shader';

/* Flashlights lying on (world/light.ts, Loose): the nearest few to the eye are drawn with their beams, each from its lens
   with a shadow map of its own, rendered every frame from there (what it lights moves: the cast, doors, crates). The map
   holds depth only; LIGHTS in shader.ts reads it. What is drawn into it is what stands in the light's way: not dust, drips
   or prints, nothing see-through, and not what you hold. */

const FAR = 40; // a beam farther than this from the eye is not drawn

export class Beams {
  private targets: THREE.WebGLRenderTarget[];
  private cams: THREE.PerspectiveCamera[];
  private depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide });

  constructor() {
    this.targets = Array.from({ length: BEAMS }, () => {
      const t = new THREE.WebGLRenderTarget(SHADOW, SHADOW, { depthBuffer: true });
      t.depthTexture = new THREE.DepthTexture(SHADOW, SHADOW, THREE.UnsignedIntType);
      t.depthTexture.minFilter = t.depthTexture.magFilter = THREE.NearestFilter;
      return t;
    });
    this.cams = Array.from({ length: BEAMS }, () => new THREE.PerspectiveCamera(SHADOW_CAM.fov, 1, SHADOW_CAM.near, SHADOW_CAM.far));
    U.uSh0.value = this.targets[0].depthTexture;
    U.uSh1.value = this.targets[1].depthTexture;
  }

  /** draw the shadow maps of the beams nearest `eye` among `lights`, and say where they are */
  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, eye: THREE.Vector3, lights: readonly Loose[]): void {
    const near = lights
      .filter(L => L.kind === 'flash' && L.k > 0)
      .map(L => ({ L, d: Math.hypot(L.x - eye.x, L.y - eye.y, L.z - eye.z) }))
      .filter(o => o.d < FAR)
      .sort((a, b) => a.d - b.d)
      .slice(0, BEAMS);
    for (let i = 0; i < BEAMS; i++) U.uBeam.value[i].w = 0;
    if (!near.length) return;
    /* what is not in a beam's way, hidden while the maps are drawn */
    const hidden: THREE.Object3D[] = [];
    scene.traverse(o => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (o.visible && ((o as THREE.Points).isPoints || (o as THREE.Camera).isCamera || m?.transparent)) { o.visible = false; hidden.push(o); }
    });
    const was = renderer.getRenderTarget(), over = scene.overrideMaterial;
    scene.overrideMaterial = this.depthOnly;
    near.forEach(({ L }, i) => {
      const cam = this.cams[i];
      cam.position.set(L.x, L.y, L.z);
      cam.up.set(0, 1, 0);
      if (Math.abs(L.dy) > 0.95) cam.up.set(1, 0, 0);
      cam.lookAt(L.x + L.dx, L.y + L.dy, L.z + L.dz);
      cam.updateMatrixWorld();
      U.uBeamM.value[i].multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
      U.uBeam.value[i].set(L.x, L.y, L.z, L.k);
      U.uBeamDir.value[i].set(L.dx, L.dy, L.dz);
      renderer.setRenderTarget(this.targets[i]);
      renderer.clear();
      renderer.render(scene, cam);
    });
    scene.overrideMaterial = over;
    renderer.setRenderTarget(was);
    for (const o of hidden) o.visible = true;
  }
}
