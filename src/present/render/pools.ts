import type * as THREE from 'three';
import type { Lighting } from '../../world/light';
import type { World } from '../../world/world';
import { POOL_FIX, POOL_ROOMS, U } from './shader';

/* Which rooms the shader pools light in (render/shader.ts): those with fittings nearest you, as many as fit, each with
   its fittings. Further off, a room is lit evenly by its own light, as before; the fog has mostly taken it by then.
   Chosen again a few times a second, or at once when the lighting or the level changes. */

let last: { L: Lighting | null; t: number } = { L: null, t: 0 };

export function updatePools(w: World, L: Lighting, cam: THREE.Vector3, dt: number): void {
  last.t -= dt;
  if (L === last.L && last.t > 0) return;
  last = { L, t: 0.25 };
  const near: { room: number; d: number }[] = [];
  for (const [room] of L.fixtures) {
    const R = w.rooms[room];
    const dx = Math.max(R.x0 - cam.x, 0, cam.x - R.x1), dz = Math.max(R.z0 - cam.z, 0, cam.z - R.z1);
    const dy = Math.max(R.y0 - cam.y, 0, cam.y - (R.y0 + R.ht));
    near.push({ room, d: Math.hypot(dx, dy * 2, dz) });
  }
  near.sort((a, b) => a.d - b.d);
  /* a little over the room's walls; more over its floor and ceiling, which lie on the 0.25 m grid and so can stand a
     few centimetres off the room's nominal height (a 3.2 m room's ceiling is at 3.25) */
  const A = U.uBoxA.value, B = U.uBoxB.value, F = U.uFix.value, e = 0.05, ey = 0.3;
  let nb = 0, nf = 0;
  for (const { room } of near) {
    const fx = L.fixtures.get(room)!;
    if (nb >= POOL_ROOMS || nf + fx.length > POOL_FIX) break;
    const R = w.rooms[room];
    A[nb].set(R.x0 - e, R.z0 - e, R.x1 + e, R.z1 + e);
    B[nb].set(R.y0 - ey, R.y0 + R.ht + ey);
    for (const f of fx) F[nf++].set(f.x, f.y, f.z, nb);
    nb++;
  }
  U.uBoxN.value = nb;
  U.uFixN.value = nf;
}
