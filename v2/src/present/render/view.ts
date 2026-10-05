import * as THREE from 'three';
import type { World } from '../../world/world';
import { buildLevelGeometry } from './levelMesh';
import { U, staticMaterial } from './shader';

/** The renderer, the scene and the camera. It draws; it decides nothing. */
export class View {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(72, 1, 0.06, 140);
  private level: THREE.Mesh | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setClearColor(0x000000);
    this.camera.rotation.order = 'YXZ';
    const size = () => {
      const w = window.innerWidth, h = window.innerHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', size);
    size();
  }

  setLevel(w: World): void {
    if (this.level) {
      this.scene.remove(this.level);
      this.level.geometry.dispose();
    }
    this.level = new THREE.Mesh(buildLevelGeometry(w), staticMaterial());
    this.level.frustumCulled = false;
    this.scene.add(this.level);
  }

  draw(time: number): void {
    U.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }
}
