import { noInput, type Input } from '../sim/input';

const SENS = 0.0022;

/** Keys and mouse in, one Input per sim step out. Presses are held until a step takes them; mouse movement is
 *  added up until a step takes it, and until then the camera shows it anyway (pending), so looking never lags. */
export class Controls {
  private keys: Record<string, boolean> = {};
  private press = { jump: false, crouch: false, light: false };
  readonly pending = { yaw: 0, pitch: 0 };
  /** pointer capture refused (some embedded browsers): drag to look instead */
  private dragLook = false;
  private dragging = false;
  enabled = false;

  constructor(private canvas: HTMLCanvasElement, private onUnlock: () => void) {
    window.addEventListener('keydown', e => {
      if (e.code === 'Tab' || e.code === 'Space') e.preventDefault();
      if (e.repeat) return;
      this.keys[e.code] = true;
      if (!this.enabled) return;
      if (e.code === 'Space') this.press.jump = true;
      else if (e.code === 'KeyC') this.press.crouch = true;
      else if (e.code === 'KeyF') this.press.light = true;
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; });
    document.addEventListener('mousemove', e => {
      if (!this.enabled || !(this.locked() || (this.dragLook && this.dragging))) return;
      this.pending.yaw -= e.movementX * SENS;
      this.pending.pitch -= e.movementY * SENS;
    });
    canvas.addEventListener('mousedown', () => { if (this.dragLook) this.dragging = true; });
    window.addEventListener('mouseup', () => { this.dragging = false; });
    document.addEventListener('pointerlockchange', () => { if (!this.locked() && this.enabled && !this.dragLook) this.onUnlock(); });
  }

  locked(): boolean {
    return document.pointerLockElement === this.canvas;
  }

  lock(): void {
    if (this.dragLook) return;
    try {
      const r = this.canvas.requestPointerLock() as unknown as Promise<void> | undefined;
      r?.catch?.(() => { this.dragLook = true; });
    } catch {
      this.dragLook = true;
    }
  }

  /** the input for one sim step */
  take(): Input {
    const k = this.keys, i = noInput();
    if (!this.enabled) return i;
    i.forward = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    i.strafe = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
    i.run = !!(k.ShiftLeft || k.ShiftRight);
    i.yaw = this.pending.yaw; i.pitch = this.pending.pitch;
    this.pending.yaw = 0; this.pending.pitch = 0;
    i.jump = this.press.jump; i.crouch = this.press.crouch; i.light = this.press.light;
    this.press = { jump: false, crouch: false, light: false };
    return i;
  }
}
