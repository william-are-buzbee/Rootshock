/** What the player asked for during one sim step. The presentation fills it from keys and mouse;
 *  a test or a replay can fill it from anything. */
export interface Input {
  /** -1..1: forward/back, right/left */
  forward: number;
  strafe: number;
  run: boolean;
  /** radians to turn this step */
  yaw: number;
  pitch: number;
  /** presses: true on the one step they happened */
  jump: boolean;
  crouch: boolean;
  light: boolean;
  /** held: swim up (jump key), swim down (crouch key) */
  rise: boolean;
  sink: boolean;
}

export const noInput = (): Input => ({ forward: 0, strafe: 0, run: false, yaw: 0, pitch: 0, jump: false, crouch: false, light: false, rise: false, sink: false });
