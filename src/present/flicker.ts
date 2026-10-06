/* A failing tube: dim for a slot, eleven slots a second, at random but the same for everyone who asks. The shader dims
   the rooms that flicker by it and the soundscape crackles by it, so the buzz drops out exactly when the light does. */

/** is a flickering light dimmed at time t (seconds)? */
export function flickerAt(t: number): boolean {
  const x = Math.sin(Math.floor(t * 11)) * 43758.5453;
  return x - Math.floor(x) >= 0.72;
}
