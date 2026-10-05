# Rootshock: the v2 engine

The plan for rebuilding the game on foundations that can take new features without surgery. It records what has been
agreed, what is proposed, and what is still open, in the same way as `world.md`. Status markers:

- **Agreed**: decided; build to it.
- **Proposed**: the recommended direction, not yet committed.
- **Open**: needs a decision before it is built.

`world.md` says what the game is. This document says how it is built.

---

## 1. Why rebuild

The current game (`index.html`, one file) grew a 3D world on top of a 2D engine, and only part of the engine followed.

- **Two physics worlds.** The player uses `probe()`, which understands stacked layers, terrain, stairs, elevators and
  ceilings. Mutants, dropped items and melee use `collides()`, a flat tile mask: to them a 30 cm crate is a wall and a
  stair is rock. Mutants never fall, climb or change layer; their height is snapped to the terrain.
- **Sight and pathing are flat and local.** `los()` checks one layer's tiles. Flow fields are rebuilt only for the
  layer the player stands on, so mutants on other layers of the same level follow a stale field.
- **Every feature is threaded through many places.** A door lives in the mesh builder, `collides`, `probe`, `los`,
  `bfs`, `nextTile`, the frame loop, `occupied` and the lighting pass. Adding a new kind of thing means editing all
  of them.
- **Simulation and presentation are tangled.** Game state, three.js meshes and DOM updates share functions. There is
  no save/load, no headless run, and nothing to test against.
- **Variable timestep, unseeded randomness.** Jumps and falls vary slightly with frame rate; level dressing changes on
  every load.

None of this is a reason to lose what works. The content, the look, the sound and the feel carry over (§12).

---

## 2. Decisions so far

- **Agreed: a rewrite, not a retrofit.** The engine is rebuilt; content and design are carried over.
- **Agreed: it lives in `v2/`.** The current game stays at the root, playable, until v2 reaches parity and replaces it.
- **Agreed: TypeScript.** Types catch the class of mistake a game this size keeps making (a tile index where a metre was
  meant, a missing field on a level definition) before the game runs.
- **Agreed: a build step (Vite).** The source is many small files; a build tool bundles them into a static page.
  `npm run dev` serves it with live reload; `npm run build` produces the files to publish.
- **Agreed: the new station only.** v2 builds the station from `NEWSTATION` (the `?dev=newstation` levels). The old
  six-floor station is not ported.
- **Agreed: no general physics library.** The world is a station of rooms, shafts and caves, not a pile of rigid bodies.
  A purpose-built world model (§4) fits it; cannon or rapier would fight it.
- **Agreed: current three.js from npm**, replacing r128 from a CDN.

---

## 3. Architecture

Four layers, each depending only on the ones above it:

```
content   level definitions, items, the cast, notes (pure data plus authoring helpers)
   │
world     compiles a level into one spatial model and answers every spatial question
   │
sim       entities, components, systems; fixed step; seeded; no three.js, no DOM
   │
present   renderer, audio, HUD and menus; reads sim state, sends input in
```

**The one hard rule (agreed once this doc is agreed): `sim/` and `world/` never import three.js or touch the DOM.**
That is what makes save/load, a headless run, tests and the progression checker possible.

### Layout (proposed)

```
v2/
  index.html
  package.json, tsconfig.json, vite.config.ts
  src/
    main.ts              boot: load content, build world, start loop
    core/                maths, seeded rng, fixed-step loop, events
    content/
      station.ts         the levels, circuits, ladders (from NEWSTATION)
      levels/upper.ts …  one file per level
      build/             authoring helpers: room, cave, tunnel, door, props (today's bx, shelf, tbl …)
      cast.ts, items.ts, notes.ts
    world/
      compile.ts         level definition -> world model
      grid.ts            sparse cell grid, chunks
      query.ts           solidAt, sweep, raycast, groundBelow, overlap
      nav.ts             nav graph and flow fields
      light.ts           baked light per cell
    sim/
      ecs.ts             entity store
      components.ts
      systems/           physics, movers, doors, power, ai, perception, combat, interaction, inventory, air …
      save.ts
    present/
      render/            mesh from authored geometry, the shader, viewmodel
      audio/             the synthesised sounds
      ui/                HUD, inventory, notes, keypad, lift panel, map, dev panel
    dev/                 ?dev tools, collider and nav overlays
  test/
```

---

## 4. The world model

The central decision. Everything spatial (collision, sight, sound, pathing, light) asks one structure, so a new kind of
thing is added once.

### Options considered

- **A. Generalised layered grid.** Today's model with its gaps closed: per 2 m tile, a list of floor/ceiling spans,
  plus heightfields. Cheap, fits current content. Weak at anything that is not a column: overhangs within a tile,
  slanted walls, vents, props.
- **B. Authored volumes compiled to a sparse 3D cell grid.** Uniform queries; caves, shafts and walkways stop being
  special cases. Costs memory and a compile step, both small at station scale.
- **C. Free meshes and a navmesh.** Most flexible; needs editor-grade tooling. Overkill.

**Proposed: B.**

### How B works

- **Authoring stays in shapes.** Levels are still written as rooms, caves, tunnels, doors and props, in plan metres
  (the station's one shared frame: x east, z south, y up from the surface, as the level builders use it now).
- **The compiler produces a query grid**: cells of 0.25 m, stored in 16³ chunks, only where there is space (rock is
  the default and costs nothing). Each cell holds what is there: rock, a room (open), or a block (solid built back
  into a room); later, flags such as `water`, `climbable`, `crawl`.
- **Surfaces are meshed from the grid (agreed, built in step 1).** Wherever open meets solid there is a face; faces
  are merged into the largest flat rectangles that share a colour, then cut where the palette changes (dado and
  stripe on walls, the 2 m checker on floors). For axis-aligned rooms this is exactly the flat look of the first
  engine, and it guarantees that what you see is what you collide with. It means **built geometry snaps to 0.25 m**.
- **Open: slopes and caves.** A grid alone would draw a cave floor as terraces. Caves and ramps will need their own
  surface: a heightfield mesh over their cells, with the grid still answering the queries. Decide in step 2.
- **Small props** (crates, tables, shelves) are not stamped into the grid. They are boxes, oriented boxes or cylinders
  in a spatial hash, so they can later move.
- **Movers** (doors, elevators, hatches, anything that changes shape at runtime) are colliders of their own, not grid
  cells. A door is a box that slides; an elevator is a box that rises and carries what stands on it.

### Queries (the whole API)

| query | used by |
|---|---|
| `solidAt(p)` | everything |
| `overlap(shape)` → hits | physics depenetration, door crush checks, item placement |
| `sweep(cylinder, delta)` → first hit, normal | movement |
| `groundBelow(p, maxDrop)` → height, surface | standing, stepping, falling |
| `raycast(from, to, mask)` → first hit | sight, aim, melee, flashlight |
| `waterAt(p)` → depth | wading, swimming, air |
| `regionAt(p)` → room id | room names, light, sound, AI territory |

Each query is answered against the grid, then props, then movers.

---

## 5. Entities and components

**Proposed:** plain objects with optional parts, held in a small entity store. Not a full ECS library.

A thing is defined by which parts it has:

| component | holds |
|---|---|
| `transform` | position, yaw |
| `body` | radius, height, crouch height, velocity, grounded, mass, movement abilities |
| `health` | hp, armour, damage sources |
| `ai` | brain type, state, target, memory |
| `senses` | sight range, hearing, light sensitivity |
| `interactable` | prompt, range, action |
| `powered` | circuit, needs (backup / full) |
| `lock` | card, code, unlocked |
| `mover` | shape, positions, speed, what it carries |
| `light` | colour, radius, flicker |
| `item` | item id, count |
| `noise` | loudness this tick |

Examples:

- **Door**: transform + mover + powered + lock + interactable.
- **Husk**: transform + body (opens doors) + health + ai + senses.
- **Work lamp**: transform + light (+ a prop collider).
- **Dropped crowbar**: transform + item + interactable (+ body, if things fall).

Systems run in a fixed order each tick: input → ai → physics → movers → doors and power → combat → interaction →
perception → air and light → events out.

---

## 6. Physics

- **Fixed step at 60 Hz** with an accumulator, rendering in between (agreed in principle; part of the determinism
  in §10).
- **Bodies are upright cylinders.** One controller for the player, mutants and falling items: move and slide along
  walls, step up to 0.5 m, gravity, ceilings, crouch, fall damage. Push out of anything a body ends up inside
  (depenetration), so nothing gets trapped.
- **Movers carry bodies.** Standing on an elevator moves you with it. A closing door either stops or pushes; it never
  passes through a body.
- **Body against body** resolves by mass: the player can be shoved, and can shove things lighter than they are.
- **Abilities live on the body**, not in special cases: `opensDoors`, `low` (under jammed doors), `big` (no doorways),
  `swims`, `climbs`, `fixed`.
- **Water** comes from cell flags: wading slows you, deep water switches to swimming, air runs down.
- **Agreed: physical objects**, as long as they do not cost the frame rate. Kicked crates, thrown items, bodies that
  slump. Proposed way to keep them cheap:
  - **Asleep by default.** A crate is a static prop until something touches it (a kick, a shove, a blast, a body
    falling on it). Only then does it become a body: gravity, slide, collide, settle.
  - **Asleep again when still.** A settled object goes back to being a static prop in its new place.
  - **Simple shapes.** Boxes and cylinders that stay upright or tip onto a face; no tumbling rigid-body solver.
  - **A budget.** A fixed number awake at once (start at 16); past that, the oldest settles where it is.
  - **Measured.** A step-2 test level with a pile of crates, timed headless, decides whether the budget holds.

---

## 7. Navigation

- **The nav graph is built from the grid**: walkable surfaces (floor with headroom) grouped into regions, linked by
  edges that carry a kind: walk, step, drop, stairs, ladder, elevator, door, under-jammed-door, vent, swim.
- **One graph per level**, across all its layers, so a walkway and the hall below it are one place to a mutant.
- **Each mutant filters edges by its abilities.** A skitter takes under-jammed-door edges; a thresher takes no door
  edges; a husk opens doors it can open.
- **Flow fields to the player**, recomputed on a budget for every level that is awake, not only the player's layer.
- **Agreed: mutants use stairs, ladders and elevators.** Walkways are not safe ground. Each still goes only where its
  body allows (proposed):
  - **Stairs, ramps, walkways, drops**: everything that walks.
  - **Ladders**: anything with `climbs` that fits the shaft; the bloat does not.
  - **Elevators**: anything standing on the platform rides it; things with hands (`opensDoors`) can call it.

---

## 8. Perception

- **Sight** is a raycast through the world model (floors and props hide you), scaled by the light at the target, as
  now (`G.vis`).
- **Sound travels through space, not through walls** (proposed): a noise spreads over the nav graph, losing loudness
  with distance, more through closed doors and more again through heavy ones. Running in the next room is heard;
  running two floors up is not. This replaces today's straight-line radius.
- **Memory**: a mutant that heard or saw something goes to where it was, not to where the player is now.

---

## 9. Power, doors, interaction

The rules in `world.md` §4 (doors and locks, power, repair kits) carry over unchanged. In v2 they are systems reading
components, not code threaded through the frame loop:

- **Power**: circuits are state; `powered` components read their level (0 dead, 1 backup, 2 full); the light bake and
  the render read the same state.
- **Doors**: one system runs the rules for light, heavy, stuck, sealed, vent and lift doors, card and keypad locks.
  Collision, pathing and sight learn a door's state from its mover, never from a special case.
- **Interaction**: anything with `interactable` is found by one query (in reach, in view, unobstructed), as today's
  `findInt`.

---

## 10. Determinism, saving, testing

- **Seeded randomness.** Each level is dressed from its own seed, so it looks the same on every load. The sim has its
  own seeded generator. `Math.random` is not used in `content/`, `world/` or `sim/`.
- **Save and load** serialise the sim state: entities, circuits, inventory, flags, the player. The world model is
  rebuilt from content, never saved.
- **Headless.** The sim runs in Node without a browser. That enables:
  - **Unit tests** for queries, the body controller, door rules, power.
  - **Level validation** at build time: every ladder has two ends, every key, card and code exists somewhere
    reachable, every door has a circuit.
  - **The progression checker** from `world.md` §4: prove from a save that the game can still be finished.
- **Proposed tools:** Vitest for tests; `npm run check` runs types, tests and level validation.

---

## 11. Presentation

- **The shader carries over**: unlit is black; baked room light plus flashlight cone plus lantern; flat shading from
  derivatives; fog; the wet tint; emissive colours.
- **Light is baked per cell** from the level's lights and circuits (proposed), so light no longer bleeds through walls
  and the stealth check reads the same values the renderer shows.
- **Audio**: the synthesised sounds carry over, positioned from sim events.
- **UI** stays in HTML over the canvas, with the current type and colours (Barlow Condensed, Newsreader, bone, ash,
  hazard).
- **Dev tools** carry over (`?dev`, fly, god, level select, map), plus overlays for colliders, nav graph and noise.

---

## 12. What carries over

- The new station's levels: upper station, main level and Commons, Horticulture, plant level, the sump and drowned
  sump, the cave. Ported into the v2 content format, keeping their plan coordinates.
- The cast and its behaviours (husk, skitter, bloat, thresher, worm, rootworm, swimmer, grabber, vine), items,
  weapons, notes, the lift, ladders, circuits, backup sets, repair kits.
- The look, the sound, the HUD.
- `world.md` §7: real access problems, the generator room as a climax, the thresher in the dark, light as a trade.
  v2 is not done until the upper station feels at least as good as it does now.

---

## 13. Build order (proposed)

Each step ends with something you can open and play.

1. **Scaffold. Done.** `v2/` with Vite, TypeScript, three.js, the fixed-step loop, the shader, and the test bed (a
   hall with steps, a mezzanine, ledges, a crawl, a dark room). Pulled forward from step 2 so there was something real
   to walk in: the dense grid, the basic queries (`overlapCylinder`, `groundBelow`, `ceilingAbove`, `roomAt`), the
   body controller (walk and slide, step up, gravity, ceilings, crouch), the greedy mesher. Tests run the sim headless,
   including one that proves two identical runs end identically, and one that enforces the layer rule (§3). CI runs
   them on every pull request that touches `v2/`.
2. **World model and body, the rest.** Chunked sparse grid; movers (doors, a moving platform that carries you);
   `sweep` and `raycast`; depenetration; water; slopes and cave surfaces. A test level for each. The collider
   overlay.
3. **The upper station, static.** Port its content: rooms, caves, props, light. Walk all of it.
4. **Doors, power, interaction, items, inventory, notes, HUD.** The upper station's access puzzle works end to end.
5. **Mutants.** Nav graph, flow fields, perception, the cast's behaviours, combat.
6. **Parity check** against the current upper station. Fix the feel before going on.
7. **Save and load, level validation, the progression checker.**
8. **The other levels**, one at a time.
9. **Swap**: v2 becomes the game at the root; the old one is archived.

---

## 14. Open questions

1. **Grid cell size**: 0.25 m for now. Confirm in step 2 by measuring a whole level once the grid is sparse.
2. **Slopes and cave surfaces** (§4): decide in step 2.

### Settled

- **Mutants on stairs, ladders and elevators**: yes (§7).
- **Physical objects**: yes, unless they cost the frame rate (§6).
- **Publishing v2 while it is in progress (agreed)**: GitHub Pages, from a workflow (`.github/workflows/pages.yml`).
  Every push to `main` publishes the old game at the site root, as now, and the latest v2 build at `/v2/`. This needs
  the repository's Pages source set to **GitHub Actions** (Settings → Pages → Build and deployment → Source).
- **`station-plan.md`**: dropped. It was an earlier idea; the station now lives in the level builders, which are the
  reference for its layout and coordinates.
