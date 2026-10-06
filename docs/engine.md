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
- **Slopes and caves (agreed, built in step 2): sloped surfaces.** A ramp, a cave floor or a cave ceiling is a
  heightfield: heights on a lattice (0.5 m for caves), blended between. A floor is solid from a base up to it; a
  ceiling, from it up. They are answered exactly, not by the grid, so a ramp is smooth to walk and to look at. A cave
  is a room carved in the grid from its lowest floor to its highest ceiling, with a floor surface and a ceiling
  surface inside; the walls are grid walls, plain rock with no dado or stripe.
- **Small props** (crates, tables, shelves) are not stamped into the grid. They are boxes, oriented boxes or cylinders
  in a spatial hash, so they can later move.
- **Everything that moves is a `Dyn`**: a box the sim keeps up to date in the world's list. Doors, platforms, loose
  crates and bodies (a body's bounding box) all are, so each of them collides with all the others through the same
  queries, and a query names which one it hit.

### Queries (the whole API)

Shapes are footprints on the plan (a circle for a body, a rectangle for a crate) between two heights.

| query | used by |
|---|---|
| `solidAt(p)` | everything |
| `overlap(footprint, y0, y1)` → what it hit | movement, crushing checks, pushing crates |
| `sweep(footprint, y0, y1, delta)` → how far it gets | movement, sliding crates |
| `pushOut(footprint, y0, y1)` → the smallest nudge free | getting unstuck |
| `groundBelow(footprint, top)` → height | standing, stepping, falling |
| `ceilingAbove(footprint, from)` → height | jumping, standing up |
| `raycast(from, to)` → fraction of the way clear | sight, aim, melee, flashlight |
| `waterAt(x, z)` → surface | wading, swimming, air |
| `roomAt(p)` → room | room names, light, sound, AI territory |

Each query is answered against the grid, the fixed solids, the sloped surfaces and the moving solids, in that order.

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

As built in step 5 (`world/nav.ts`, `sim/fields.ts`):

- **The nav graph is built from the grid**: a spot wherever something can stand, on a 1 m lattice in plan and at
  every floor height (grid floors and sloped surfaces both), so one graph covers every layer of a level: a walkway and
  the hall under it are one place to the cast. Each spot knows its headroom, its room and the door it stands in, if
  any. Built once per level with everything that moves moved aside, and shared by every run of that level.
- **Edges** go to the eight neighbouring columns: a walk (a step up to 0.5 m, as a body climbs), or a drop (down to
  2.5 m, one way). Diagonals only where both squares beside them are open, so no corner is cut through rock. A
  platform joins the spots on it at the bottom to the spots beside it at the top.
- **Doors and platforms are decided when walked, not when built.** The graph runs through every door; a field asks
  each door's state as it spreads. Who passes, as the first engine had it:
  - **crawl** (skitters, worms): open doors, jammed ones (under), and light doors that open by themselves;
  - **hands** (husks): any door a hand can work: not welded, panelled, jammed, heavy, locked or the lift's. A husk
    slides a dead light door open by hand and comes through;
  - **big** (bloat, thresher): no doors at all.
  Headroom filters too: 1 m to crawl, 1.8 m for a husk, 2.2 m for the big ones.
- **Flow fields to the player**, one for each kind of body and one for sound, by Dijkstra over the graph. One is
  refreshed each step in turn (about 2.5 ms each on the upper station's 7,600 spots), so each is at most four steps
  old and no step pays for all of them. A roam (a husk keeping its rounds) gets a field of its own to a room picked
  at random, one new route a step across the whole cast.
- **Agreed: mutants use stairs and elevators.** Stairs, ramps, walkways and drops are walked like any floor.
  Platforms: anything rides one that goes by itself; a husk calls one that has power, walks to its middle, rides it,
  and steps off at the top (tested: Cargo on backup, a husk follows you up to Tier 1). **Ladders are not yet**: every
  ladder on the upper station leads off the level, and the cast does not leave its level. Ladders within a level come
  with the first level that has one (step 8).
- A refuge (`safe`) is only kept out of the cast's rounds, as in the first engine; a hunter follows you into one.
- **Fields are cheap** (step 6): each is made from arrays of who may enter which spot (no call per edge), only when you
  have moved or a door or platform has changed, and only as far out as anything could use it (90 m for a hunt, 40 for
  sound).

---

## 8. Perception

As built in step 5 (`sim/cast.ts`), the first engine's senses on the new world:

- **Sight** is a raycast from its eye to yours through the world model (walls, shut doors, crates and props hide you;
  bodies do not), within a range scaled by how visible you are: the light where you stand (`Lighting`), your own light,
  and crouching, as the first engine had it. A line of sight is looked along at most ten times a second.
- **Sound travels through space, not through walls**: what you do carries a distance (walking 4 m, running 9,
  wading 5, creeping 0; a jump 3, a landing 5, a door 7 or 10, a blow 6 to 10, a gun 36, for half a second), and a
  mutant hears it if the sound field puts it nearer than that. A shut light door adds 6 m, a heavy or welded one 12.
  Running in the next room is heard; running two floors up is not.
- **Memory**: not yet. As in the first engine, a hunter follows the field to where you are now, and gives up after
  losing sight of you for a while. Going to where it last heard you instead is a later refinement.

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

**As built in step 4.** The game's state is plain data in the sim (`sim/game.ts`): circuits and Gen-1, keys, what you
carry (ten slots), lights and battery, what you wear, papers read, health, the run's keypad codes. What happens comes out
as events (a message, a sound and where it came from, a note to show, a keypad, the power changing, the end); what the
player chooses in a menu goes back in as commands, applied at the start of the next step, so a run is still only a
sequence of inputs. The door rules, the labels and the answers are the first engine's, line for line
(`sim/movers.ts`, `sim/interact.ts`). The world stands still while a menu is open, as it did.

---

## 10. Determinism, saving, testing

- **Seeded randomness.** Each level is dressed from its own seed, so it looks the same on every load. The sim has its
  own seeded generator. `Math.random` is not used in `content/`, `world/` or `sim/`.
- **Stable ids.** Each world numbers what moves from 1, in the order it is made, so a level loaded twice gives the
  same ids and a save can name things by them.
- **Save and load** serialise the sim state: entities, circuits, inventory, flags, the player. The world model is
  rebuilt from content, never saved. A loaded run plays on exactly as the original would have (step 7).
- **Headless.** The sim runs in Node without a browser. That enables:
  - **Unit tests** for queries, the body controller, door rules, power.
  - **Level validation** at build time: every ladder has two ends, every key, card and code exists somewhere
    reachable, every door has a circuit.
  - **The progression checker** from `world.md` §4: prove from a save that the game can still be finished.
- **Nothing may hang.** Every test has a 10 s limit and every CI job a 10 minute one.
- **Proposed tools:** Vitest for tests; `npm run check` runs types, tests and level validation.

---

## 11. Presentation

- **The shader carries over**: unlit is black; baked room light plus flashlight cone plus lantern; flat shading from
  derivatives; fog; the wet tint; emissive colours.
- **Light (agreed, built in step 3)** follows the first engine's rules, in `world/light.ts`: each room is lit by its
  rule and its circuit's power (full, backup with emergency lights, or dark), doorways borrow from either side, lamps
  make pools in their own room. The level's mesh is lit per vertex, and every vertex remembers which room lights it,
  so a power change relights the level without rebuilding it (1.4 ms for the upper station). The sim will read the
  same light for stealth. `?power=full` shows a level with everything on.
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
2. **World model and body, the rest. Done.**
   - **Sparse grid**: chunks of 16³ cells exist only where there is space; the mesher walks only those.
   - **Queries** for circle and rectangle footprints; `sweep`, `raycast` and `pushOut`.
   - **Sloped surfaces**: ramps, cave floors and ceilings (§4).
   - **Doors** slide up when anything comes near and never close on it.
   - **Platforms** carry what stands on them and never crush it. One leaves when someone steps on after it has
     stopped, so it does not carry you off while you stand on it.
   - **Water**: wading slows you; in deep water you float, swim up and down, haul yourself out onto a ledge up to
     1.7 m above your feet, and your breath runs down while your head is under.
   - **Loose crates**: pushed by walking into them, knocked off stacks, carried by what they stand on, asleep when
     still. The awake budget is 16; a tumbling pile of 48 measured 0.46 ms per step headless, under 3% of a frame.
   - **Test bed lab wing** (through the door south of the hall): a ramp to a balcony, a lift to a gallery, a pool
     with a shallow shelf, crates to push, a cave. **Collider overlay**: `?dev`, then G.
3. **The upper station, static. Done.**
   - **The tile adapter** (`content/build/tiles.ts`, `fittings.ts`) keeps the first engine's way of laying out a
     level: decks of 2 m tiles, rooms, doors, caves and terrain fields, walkways, platforms, and its furniture kit.
     Levels port nearly line for line, then compile into v2 shapes: rooms, floor slabs under upper decks, rails on
     walkway edges, doorways with doors, cave surfaces from the terrain, ceiling fittings, props.
   - **The upper station and the Cargo cavern** (`content/levels/upper.ts`), ported from `buildUpper` and
     `buildCargo2`, with the station's circuits and ladderways (`content/station.ts`). It is now what v2 starts in;
     `?level=testbed` for the test bed.
   - **Carried as data for later steps**: items, notes, the cast, things to use (corpses, panels, backup sets,
     ladders, the lift), door rules (cards, codes, heavy, sealed, jammed), signs, marks. Doors open for anything near
     except welded and jammed ones; the rest of their rules come in step 4.
   - **Doors, platforms and signs** are drawn as they were.
   - **Reachability** (`sim/reach.ts`): a flood on foot from the start, doors open, platforms joining their ends.
     A test proves every room is reachable except the three behind welded doors. It is the seed of the progression
     checker.
   - **Measured** on the upper station: 58 rooms, 726 props, 2,081 chunks (16 MB of grid), 52 ms to build and
     compile, 200 to 300 ms to mesh in the browser (about 1 s under the test runner), 67,000 vertices.
4. **Doors, power, interaction, items, inventory, notes, HUD. Done.**
   - **Power**: circuits, backup sets, service connections, Gen-1's fuse and breaker; a change relights the level,
     door lights and signs (1.4 ms).
   - **Doors** with all their rules: light doors open for you on a live circuit and slide by hand on a dead one; heavy
     doors need Gen-1 and their button; card readers and keypads (the Armory code is drawn per run); welded, jammed
     (crouch under) and loose-panel doors; the surface lift as the way out.
   - **Things to use**: items to take (drawn as they were), notes to read (all eighteen, word for word), corpses to
     search for cards, backup sets, panels, cargo platforms called and ridden on power, ladders that check their gates.
     Ladders, stairs and the lift say so when the level they lead to is not built yet.
   - **You**: health, falls and drowning hurt, a flashlight to find and a battery that runs down, ten slots, the end
     screen (death, or the surface).
   - **The HUD and menus** as they were: messages, the use prompt, health, breath and battery bars, what is in hand;
     the inventory (Tab), a note, the keypad, the lift panel. The sounds, synthesised as before.
   - **Proof** (`test/puzzle.test.ts`): the upper station's gates played headless through the real interaction (stand
     near, look, press E): the flashlight, the officer's card and the control room, heavy doors on backup, the Armory
     keypad on Gen-1 with the run's code, Cargo's doors by hand, its backup set and the platform up to Tier 1,
     ladderway B's gate, the fuse, the dead surface lift, a note, a fall.
   - **Not yet**: travel between levels waits for the other levels (step 8); saving (step 7).
5. **Mutants and combat. Done.**
   - **The nav graph and fields** (§7) and **perception** (§8).
   - **The cast** (`sim/cast.ts`): the first engine's seven behaviours, ported nearly line for line: the husk (keeps
     rounds or a post, hunts, swings, flees when hurt, lurks, comes back), the skitter (bursts, rears and drops on
     you), the bloat (wanders its room), the thresher (roars, charges, knocks you back, staggers off a wall), worms
     (shy of your light, harmless alone, two together bite), the swimmer, and the grabber (only its head counts). Their
     stats, ranges, timings and death lines are the old ones. Each is a body like yours: it falls, rides platforms,
     works doors, and blocks you and its kind; a dead one leaves the world. All randomness is the run's seed, so the
     same run plays the same twice (tested).
   - **Combat** (`sim/combat.ts`): hold to load a swing, let go to throw it, as before (early is nothing); the damage,
     reach and stun of each weapon from its mass and kind; guns fire on the press, spend a round, and are heard far
     off; hits stun by mass, knock light things back, and turn each kind as it turned. Armour takes its share.
   - **Presentation**: the old models and their animation, the weapon in hand with its load, swing and kick, the hit
     flash on them and the hurt flash and shake on you, blood where they fall, and their sounds placed where they are.
   - **Proof** (`test/cast.test.ts`): the graph reaches every room and everything stands on it; big bodies keep out of
     doors and shut doors muffle sound; a husk does not see you crouched behind it but hears you run; one that sees
     you comes and hurts; a husk slides a dead door open to reach you; a husk calls a platform and rides it up after
     you; a swing must be loaded; a pistol spends a round, is heard and kills; the same seed plays the same.
   - **Measured** on the upper station (22 of the cast): the graph has 7,585 spots and 55,700 edges and takes about
     0.5 s to build (once per level); twenty seconds of running about with everyone awake averages 1 to 1.7 ms a step
     under the test runner, with rare spikes to 13 ms (a field refresh and a new roam route landing together, or the
     collector). Worth smoothing before the bigger levels.
   - **Not yet**: ladders for the cast (§7); memory of where you were heard (§8); body against body by mass (§6:
     bodies block each other; a blow knocks light ones back).
6. **Parity check against the first engine's upper station. Done.**
   - **How**: an audit of every player-facing behaviour of the first engine on the upper station, each checked in both
     codebases (found at parity: movement and camera numbers, noise and visibility, light and battery,
     items, weapons, the cast's stats and states, doors, interaction, HUD, sounds, content); the same six views shot in
     both (`?dev=newstation` in the first engine), at the start's power; the cost of a step timed in the same browser.
   - **Looks**: the same, view for view, once an open door was lit by its doorway (it had been lit by the rock it slid
     into, and drawn black) and slid as far up as before.
   - **Fixed**: your footsteps (a step every 1.7 m, 2.3 running, quieter walking, none crouched); hunters follow you
     into refuges again; a better weapon goes into your hand as you take it; a gun's label counts its rounds; you walk
     through the soft ones of the cast (all but the bloat and the thresher), which stop short of you; a platform is
     heard when called, rattles and thuds; the opening line; Gen-1 coming up is heard (30 m) and felt; a power change
     clunks; a prised panel is heard; ladders say where they go; a wrong code shows a moment; the papers' sound; a
     missed swing rings off what is straight ahead; the end screen counts what you put down; the death screen stays
     red; the room's name waits for you to open your eyes; blood is relit with the room; the rebreather holds 150 s of
     air; drowning is quiet; capture refused once falls back to dragging with a hint (refused later, it pauses; Esc
     pauses while dragging); Q loads a swing; a drag never swings. Dev keys as before: V fly, G god, B bright (O for
     the collider overlay); `?power=full` starts the hum.
   - **Cost**: a step was 1.3 ms against the first engine's 0.08 ms a frame, with spikes to 13 ms; now 0.45 ms, with
     the worst about 2 ms (one 6 ms outlier, the collector). Loading takes 1 s against 0.5 s; half of it is the nav
     graph, which could be stored with the level later.
   - **Different on purpose**: sound goes through the rooms, not the walls (§8); a mutant on another tier sees and
     hears you (one world, walkways are not safe ground); husks call and ride a powered platform (agreed in §7); crates
     and furniture block sight; signs dim with their own door's circuit rather than the level's; the cast block each
     other rather than jostle.
   - **Not yet**: starting again without reloading the page (a reload needs a click to start); the dev map, menu and
     level select; the wet and underwater camera (no water on the upper station).
7. **Save and load, level validation, the progression checker. Done.**
   - **Save and load** (`sim/save.ts`): a save is plain data, everything that can change and nothing that cannot (the
     world is built again from the level): the game, you, doors, platforms, crates, what lies about and what was
     searched, the cast to the last timer, what each body stands on, and the fields over the nav graph (packed; they are
     made in turn, so cannot be made again exactly). A round's route is now made from the level's shape alone, so it can
     be. Proof: a run saved, written out as text, loaded, and played on for 1,200 steps alongside the original matches
     it exactly. About 200 KB.
   - **In the page**: a run left part way (paused, the tab hidden, the page closed) is kept, and the title offers to go
     on from it, or to start again. Going on uses the save up, so a death is still a death: there was no saving at all
     in the first engine, and this keeps its stakes while not losing a run to a closed tab. Dev pages do not save.
   - **The progression checker** (`sim/progress.ts`): plays the level as a puzzle (keys, codes known, fuses and kits,
     every circuit's state, where you stand) over the real nav graph with the real door and platform rules, searching
     every state you can bring about, from the start or from any save. It reports the rooms and things you never reach,
     the shortest list of things to do to reach each way off the level, soft-locks (what a choice loses for good), and
     dead ends (places you can drop into and not climb out of). Facts from levels not yet built can be given (Gen-1
     running, a code known). On the upper station: 105 states in 0.2 s; both ladderways reachable (B once Cargo has its
     backup set), the Armory and the hazard store shut until Gen-1, no soft-locks, no dead ends; given Gen-1 and the
     Armory code, everything is in reach and the surface pass is all the way out needs. Proved also on a small level
     built to go wrong: one kit, two burned connections, and a pit. `rs.progress()` prints it in a `?dev` page.
   - **Level validation** (`sim/validate.ts`, run by the tests and so by `npm run check`): things that do not exist,
     circuits that do not, cards nobody carries, codes written nowhere, ladders that do not say where they go, and
     anything placed out of reach of anywhere to stand. What waits on a level not yet ported (ladder A1's other end; the
     Armory code, on Aldana's hand in the sump) is marked as such, not as a mistake.
8. **The other levels**, one at a time.
9. **Swap**: v2 becomes the game at the root; the old one is archived.

---

## 14. Open questions

1. **Grid cell size**: 0.25 m, kept. The upper station costs 16 MB of grid; a chunk that is all one room could be
   stored as a single value if a bigger level needs it.
2. **Caves with irregular outlines.** The first engine's caves are tunnels and chambers of any shape (`caveShape`,
   `tunnel`, `chamber`); the upper station has none. Their outline can be stamped cell by cell with surfaces masked
   to it; to be built with the level that first needs it (step 8).
3. **Storey heights off the 0.25 m grid.** The main level's storeys are 3.4 m apart; the grid would make them 3.5.
   Either the content moves to 3.5 m or the slabs become exact solids. Decide when porting the main level.

### Settled

- **Mutants on stairs, ladders and elevators**: yes (§7).
- **Physical objects**: yes, unless they cost the frame rate (§6).
- **Publishing v2 while it is in progress (agreed)**: GitHub Pages, from a workflow (`.github/workflows/pages.yml`).
  Every push to `main` publishes the old game at the site root, as now, and the latest v2 build at `/v2/`. This needs
  the repository's Pages source set to **GitHub Actions** (Settings → Pages → Build and deployment → Source).
- **`station-plan.md`**: dropped. It was an earlier idea; the station now lives in the level builders, which are the
  reference for its layout and coordinates.
