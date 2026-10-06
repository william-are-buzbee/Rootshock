import * as THREE from 'three';
import { U } from './shader';
import { flickerAt } from '../flicker';

/** The renderer, the scene and the camera. It draws; it decides nothing. */
export class View {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(72, 1, 0.06, 140);

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

  /** show this level's group, and only it */
  show(group: THREE.Object3D): void {
    if (group.parent !== this.scene) this.scene.add(group);
    for (const c of this.scene.children) if (c !== this.camera && c.type === 'Group') c.visible = c === group;
  }

  draw(time: number): void {
    U.uTime.value = time;
    U.uFlick.value = flickerAt(time) ? 1 : 0;
    this.renderer.render(this.scene, this.camera);
  }
}
