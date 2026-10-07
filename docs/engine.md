# Rootshock: the v2 engine

The plan for rebuilding the game on foundations that can take new features without surgery. It records what has been
agreed, what is proposed, and what is still open, in the same way as `world.md`. Status markers:

- **Agreed**: decided; build to it.
- **Proposed**: the recommended direction, not yet committed.
- **Open**: needs a decision before it is built.

`world.md` says what the game is. This document says how it is built.

---

## 1. Why rebuild

The first engine (`index.html`, one file; now `archive/first-engine.html`) grew a 3D world on top of a 2D engine, and
only part of the engine followed.

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
- **Agreed: it lives in `v2/`** until it replaces the first engine. **Done (step 9):** it is the game, at the repository
  root; the first engine is archived at `archive/first-engine.html`.
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

### Layout (proposed; at the repository root since step 9)

```
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
- **Slopes** (step 8): a body climbs any floor that rises smoothly, a few centimetres a step, so a rise of up to a
  metre between neighbours is a walk both ways too, if the ground between climbs without a step over 0.25 m. On a
  steep floor a spot stands on the highest point under it. The cave's passages need both.
- **Doors and platforms are decided when walked, not when built.** The graph runs through every door; a field asks
  each door's state as it spreads. Who passes, as the first engine had it:
  - **crawl** (skitters, worms): open doors, jammed ones (under), and light doors that open by themselves;
  - **hands** (husks): any door a hand can work: not welded, panelled, jammed, heavy, locked or the lift's. A husk
    slides a dead light door open by hand and comes through;
  - **big** (bloat, thresher): no doors at all.
  Headroom filters too: 1 m to crawl, 1.8 m for a husk, 2.2 m for the big ones.
- **Flow fields to the player**, one for each kind of body and one for sound, by Dijkstra over the graph. One is
  refreshed each step in turn (about 2.5 ms each on the upper station's 7,600 spots), so each is at most four steps
  old and no step pays for all of them. A roam (a husk keeping its rounds) gets a field of its own to a room lit as
  the power stands, picked at random, one new route a step across the whole cast (`rounds` in `sim/cast.ts`).
  One standing in the dark makes for the nearest lit room it can get to as the doors stand now (a locked door bars it),
  and with none keeps still until the light comes.
- **Agreed: mutants use stairs and elevators.** Stairs, ramps, walkways and drops are walked like any floor.
  Platforms: anything rides one that goes by itself; a husk calls one that has power, walks to its middle, rides it,
  and steps off at the top (tested: Cargo on backup, a husk follows you up to Tier 1). **Ladders**: the cast needs
  none. Every ladder in the station leads off its level, and the cast does not leave its level.
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
  the render read the same state, through one rule (`circuitPower` in `world/light.ts`). A circuit is fed by Gen-1
  through its service connection, or is a branch (`feed`) that has whatever the circuit feeding it has, through its
  own; either way, at least what its own backup set gives. The Security wing is a branch off Ops (`world.md` §8).
- **Doors**: one system runs the rules for light, heavy, stuck, sealed, vent and lift doors, card and keypad locks.
  Collision, pathing and sight learn a door's state from its mover, never from a special case.
- **Interaction**: anything with `interactable` is found by one query (in reach, in view, unobstructed), as today's
  `findInt`.
- **Cameras and zone alarms** (`sim/eyes.ts`, `world.md` §8): `LevelDef.cameras` (a lens, a yaw, a cone, a range, a circuit,
  a zone) and `LevelDef.speakers` (one a zone: the floor under it). A live camera sees you as the cast do (range times how
  visible you are, the cone, a clear line); held `EYES.hold` it sounds its zone. An alarm keeps a route to its speaker and how
  far its sound carries (both made once, when it starts, and again on load); each time the klaxon goes round, a husk in earshot
  that is not hunting takes the state `answer` and walks the route (its own copy). Saves keep each camera's state and the
  alarms; the routes are made again.

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
- **Audio**: the synthesised sounds carry over, positioned from sim events (`present/audio.ts`). Since: a sound from a
  place reaches you the way the cast hears you (§8), along the sound field, so a shut door or rock muffles it and puts
  it further off; feet sound like what they fall on (concrete, a walkway's grating, rock, a puddle, a crate, a
  platform); you are heard jumping and landing, splashing in, gasping up; under water everything is dull. What the sim
  has no need to say is the soundscape's (`present/soundscape.ts`): the cast breathing, clicking, gurgling and dragging
  themselves along, their deaths, crates scraping and landing, caves dripping, your heart when you are badly hurt. It
  reads the sim and never draws on its seeded numbers. Every room echoes by how much air is in it (three synthesised
  echoes, a small room's, a hall's and a vast space's, mixed by the room's volume; rock rings more). The station makes its own noises now and then, from your room or one near it, overhead, muffled by what is between
  (`ambientFor`): a fitted room's pipes knock (more with its pumps running, sometimes a run of water hammer), its frame
  groans (more the bigger it is) and its metal ticks; a cave's rock settles, grit coming down after. When the power
  changes, metal ticks for a while as it warms or cools, and the pipes knock as the pumps take up or let go.
  A fitted room's air is heard moving while its fans run, louder, brighter and to one side near a grille: a soft rush on Gen-1, barely a breath on a backup set,
  and none in a dead room, where the dust hangs (`roomAir`). Gen-1 is heard from
  its board in the generator hall, along the rooms, and winds up and down; on the other levels it is a rumble in the
  rock. A flickering room buzzes and crackles in step with its light: the shader and the soundscape both ask
  `present/flicker.ts` when the tube is dimmed.
- **Light and air** (since): the flashlight is held, not glued to the eye: the beam trails the view by about 70 ms and
  sways with your stride (`present/camera.ts`); its cone is a reflector's (a hot centre, a faint ring at its rim, a
  wide dim spill); and a wall close in front of it throws a little light back around you (one ray a frame). The eye
  adapts (`uExpo`): it opens slowly in the dark and narrows fast in light, so a room coming on glares. The dark is
  grained in the shader, most where it is darkest. A fitted room's light falls in pools under its ceiling fittings (`LevelDef.fixtures`, `POOL` in `world/light.ts`):
  a point takes 0.55 of the room's light plus 1.3 times what its fittings throw at it, down and falling off, so the
  floor under a tube is lit above the room's level and the corners and the ceiling below it. The shader does it per
  pixel for the rooms near you (`render/pools.ts`); what moves, and what the cast see you by, ask `Lighting.lit`, so
  between the lights you are a little harder to see. A room on its backup set is lit amber; its brightest channel, which
  is what the cast see you by, is what it was. Power that comes on is seen to (`present/cascade.ts`): room by room out
  from where you are, each tube striking (on, off a moment, on) as it catches, and heard to near you; only the rooms
  that flip are lit again (`LevelMesh.relightRooms`). Power going off is not staged, and the sim's light changes at
  once. A lamp's light reaches r metres from where the lamp is, up and down as well as across, so a light on the floor
  does not light a ceiling far over it. A lamp can be given by a thing lying about (`LampDef.item`: a flashlight dropped
  still on, which is drawn pointing at its beam's pool); once that is taken the lamp is out, and the level is lit again at
  once (`relight`), with no tubes striking. Motes (`present/render/motes.ts`) hang in the air about you, square flecks lit as a surface is (by the room as much as by your beam, never brighter than the wall beside them): with a live circuit the air
  is drawn toward the room's ceiling grilles (`LevelDef.vents`: one at each end of a long fitted room, one in a short
  one) and turns up into them, on a backup set barely, and in a dead room it hangs and settles;
  caves drift on their own. Moving air carries dust off: a ventilated room shows a quarter of a stuffy one's, a room on
  its backup set about half. Each speck has its own velocity, easing toward the air's, and anything moving through it,
  you or the cast, drags it along and shoves it aside; it keeps that push until the air takes it back. A room says what is in its air (`RoomDef.motes`): spores in Horticulture and the cave,
  dark red flecks in the Cargo nest and the nest residences, dust elsewhere; even there most specks are dust, with the
  room's own kind among them. A door shut twenty seconds or more breathes out
  at you when it opens, with a gust you hear.
- **Footprints** (since; `present/render/prints.ts`): flat blocks, the one shape blood has in the station. Each
  walker leaves one a pace, the size of the foot that made it (as the models in `castView` have them) and its pace by
  kind (yours and a husk's left and right, the thresher's broader and further apart, a skitter's small, quick and
  splayed wide, a worm's one wide patch), a touch smaller and fainter as what is on its soles runs out. Out of
  water they are wet for a dozen or so, which dry off in half a minute; through blood (a pool the level was built with,
  `LevelDef.stains`, or under one of the cast that fell) red for about ten, and those stay; through what a green one
  bled, green. A print that comes down on one already there grows it (to 1.6 times its first size) instead of lying on top. None in
  water, on a crate or on a platform. The newest 256 are kept; they are looks only, not saved. Bleeding is for later.
- **Drips** (since; `present/render/drips.ts`): a level's caves and rooms over standing water drip from fixed points
  (one to three a room, found from the level's id, so the same each load), each with roof above and a fall of a metre
  or more under it. A drop falls now and then; on water it spreads a square ring, on stone a small splash over a
  patch kept dark and wet; and it is heard where it lands (a plink on water, a tap on stone), not anywhere.
- **A fight's feel** (since): a swing let go early is a jab, weaker and slow to recover from, not nothing: it stuns and knocks
  back in proportion to how far it was loaded (a quarter-loaded jab, a quarter as much); a blow that
  lands, or meets a wall, holds the swing still a moment (hit-stop) and dips the view; a hurt from one of the cast
  knocks the view away from it and flashes the edge of the screen on its side; a husk's or skitter's wind-up that you
  step back from is heard to miss; the cast are rocked back when struck, and a light one knocked back slides its
  0.3 m (from a full blow) over a sixth of a second. A swing lands on whatever in reach is nearest the crosshair (the nearer of two about
  as near it), so with two in front of you, you choose which you hit by looking at it.
- **Their blows, as yours** (since): a husk's, a skitter's and the thresher's (on foot, not its charge) blow is three
  motions (`BLOWS` in `sim/cast.ts`). The wind-up is the tell: heard (a husk draws breath, a skitter clicks, the
  thresher growls) and seen (arm drawn up, rearing, arms spread); it turns to follow you for the first part of it, then
  holds its line, shaking at the top. The strike is short and lunges a little along that line, and lands only on you in
  an arc in front of it (a husk ±55°, a skitter ±35°, the thresher ±70°), within its reach and about level with it, so a
  step round it as it commits is a step out of it. Then it recovers where the blow left it, not moving or turning,
  longer when it met nothing (a husk 0.5 s, 0.85 s on a miss). A blow of yours that catches it recovering does a
  quarter more and stuns it longer; one that catches it winding up loses it the blow. A swing loaded while you dodge
  lands in that time; one begun after does not. A worm's (one of a pair; one alone only touches you) and a swimmer's
  reach is the same three motions, short: a rasp and the head lifted for 0.3 s, a grab, a quarter of a second open; a
  light put on a worm as it lifts puts it off. ?dev, O draws each blow's arc while it is under way.
- **Nothing fights in one plane** (since): everything is drawn two-sided, so two faces in one plane (a button flush with
  its post, a box on a shelf or the floor, a crate on a crate) showed through each other as you moved. Each prop and
  each part of a thing is drawn 1 to 7 mm larger than it is, different for neighbours (`apart` in `levelMesh.ts`). A
  grid floor or ceiling that a sloped surface covers (a cave flat at its room's floor) is not drawn at all.
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
     it exactly. 180 KB on the upper station, all but 21 KB of it the fields.
   - **In the page**: a run left part way (paused, the tab hidden, the page closed) is kept, and the title offers to go
     on from it, or to start again. Going on uses the save up, so a death is still a death: there was no saving at all
     in the first engine, and this keeps its stakes while not losing a run to a closed tab. Dev pages do not save.
   - **The progression checker** (`sim/progress.ts`): plays the level as a puzzle (keys, codes known, fuses and kits,
     every circuit's state, where you stand) over the real nav graph with the real door and platform rules, searching
     every state you can bring about, from the start or from any save. It reports the rooms and things you never reach,
     the shortest list of things to do to reach each way off the level, soft-locks (what a choice loses for good), and
     dead ends (places you can drop into and not climb out of); and, since step 9, breath under water (below).
     Facts from levels not yet built can be given (Gen-1
     running, a code known). On the upper station: 105 states in 0.2 s; both ladderways reachable (B once Cargo has its
     backup set), the Armory and the hazard store shut until Gen-1, no soft-locks, no dead ends; given Gen-1 and the
     Armory code, everything is in reach and the surface pass is all the way out needs. Proved also on a small level
     built to go wrong: one kit, two burned connections, and a pit. `rs.progress()` prints it in a `?dev` page.
   - **Level validation** (`sim/validate.ts`, run by the tests and so by `npm run check`): things that do not exist,
     circuits that do not, cards nobody carries, codes written nowhere, ladders that do not say where they go, and
     anything placed out of reach of anywhere to stand. What waits on a level not yet ported (ladder A1's other end; the
     Armory code, on Aldana's hand in the sump) is marked as such, not as a mistake.
8. **The other levels**, one at a time. **Done.**
   - **Travel** (`sim/run.ts`): a run is every level you have been to, each its own sim and world, sharing one game
     (what you carry and know, the power) and one draw of chance. Only the level you are on moves; one you leave waits
     as you left it, as in the first engine. Ladders, stairs and the lift ask for a trip; the run takes you to the far
     level's mark for the way you came (a ladderway now names the two levels it joins). A level is built the first time
     you go there (the main level: 1 s, its nav graph most of it, behind the fade). A run saves and loads whole. The
     page keeps each level's drawing once made, so going back is only showing it again.
   - **The main level** (`content/levels/main.ts`), ported from `buildMain`, `buildSquare`, `flatRect`, `groundFloor`
     and `buildHorticulture`: the Commons and its galleries and flats, the Square, Horticulture and the arboretum. 165
     rooms, 2,808 props, 71 doors, 69 of the cast; built in 46 ms. Shot beside the first engine with full power, view
     for view; the dressing that the first engine scattered by chance falls differently, as it did between its loads.
   - **Settled on the way**: storeys 3.5 m apart, not 3.4, so floors fall on the grid (§14); open air over a lower room
     has no floor only where that room reaches up through it (the street under its cavern), not over a flat's roof; a
     cavern's sky is drawn (its roof in its colour, lit up, no fittings), as before.
   - **Cost**: a step on the main level, everyone awake, 0.7 ms (worst 2 ms); the upper station 0.25 ms. What made the
     difference: a body standing still on firm ground is not asked about its footing, and the moving things near a
     footprint are found by their bounds before anything else is asked of them.
   - **Checked**: validation clean (the ladders on to the plant level and the cave wait for those levels); the checker
     from the foot of ladder A1 reaches Horticulture and every way on, with Gen-1 everything; 10 states, 85 ms. The
     checker now takes what only ever adds (keys, codes, things carried) all at once and trims each route to what its
     goal needs, which took it from thousands of states to tens.
   - **The plant level** (`content/levels/plant.ts`), ported from `buildPlant`: Engineering on the spine, Distribution
     with each floor's service connection, the backup plant, the link, and the generator hall with Gen-1's fuse socket
     and breaker. 32 rooms, 17 of the cast; built in 15 ms. Shot beside the first engine, view for view. Ladder A2
     stays collapsed; B2 down the exhaust shaft is the way in.
   - **Checked**: validation clean but for ladder A3, which waits for the sump. From the foot of B2 the checker reaches
     every room and thing, and Gen-1 running (a goal of its own when it was off at the start) in three steps: take the
     main fuse, seat it, start Gen-1. 8 states, 54 ms. Switching power on is now taken at once like a key, and off is
     never tried: power only opens ways now that locks fail secure, and a switch can be thrown back. Before that, the
     plant level's connections and backup sets made 2,434 states and 1.2 s.
   - **The sump and the drowned sump** (`content/levels/sump.ts`), ported from `buildSump` and `buildSumpDeep`: the
     hall at wading depth, the pump station, its control office (the dive lantern, the last log), the filters; under
     them the intake gallery, the flooded link, and Sergeant Aldana with the Armory code on her hand.
   - **Water on a level** is real now: a deck's `wet` is wading water over every room and doorway, `deep` floods every
     room over its roof. Where the water fills a room to the roof there is no surface to float up to, so you hang
     where you are and swim up or down as you choose; the first engine held you at the floor. Your breath runs from
     the moment you go in. **Dives** (the intake grates, the flooded link, the pool) are uses that travel, as ladders
     do: each comes out at the far level's mark `dive:` + the level you left. The first dive under says "One lungful.
     Count it."
   - **Fixed on the way**: wading water tints the view and closes it in, and goggles thin the fog under water, as
     before; the water is the first engine's colour; swimmers ride just under the surface of shallow water.
   - **The cave** (`content/levels/cave.ts`), ported from `buildCave`: the entry passage from the breach, the upper
     chamber and the spring branch climbing to the crack, the descent through breakdown, the great chamber and the
     green's arboretum, the lower passage, and the lower chamber with its pool, which is the flooded link. 7 rooms,
     568 props, 11 of the cast; built in 42 ms and compiled in 40; the nav graph (4,929 spots) 0.6 s; 1,819 chunks
     (15 MB). The pool is real water you can wade and swim in; the first engine drew a dark disc and kept you out of
     it with a hidden kerb.
   - **Caves of any outline** (§14): built as the first engine wrote them (`caveShape`, `tunnel`, `chamber`, in
     `tiles.ts`). Each is one room carved tile by tile, from just under its floor to just over its roof there
     (`RoomDef.cells`); a deck's caves share one floor and one roof, masked to their tiles (`SurfaceDef.mask`), so
     where a passage opens into a chamber there is no seam: the roof rises across the mouth instead of stepping. A
     cave's roof now rides on its floor, as in the first engine (over the arboretum's hills it had stayed level).
   - **Settled on the way**: the cave's passages are steeper than the nav graph allowed (the lower passage falls 12 m
     in 15, and where a tunnel leaves a chamber the first tile can be steeper than 45°). A body always climbed them;
     the graph now does too (§7). Before, the checker found the descent and the lower passage one-way drops and the
     lower chamber out of reach. Proof: a test walks you by the graph from the pool up to the breach, 58 m higher.
   - **Shot** beside the first engine, view for view: the sump at full power, the drowned sump and the cave with the
     dev light on, and the arboretum under its new roof.
   - **Checked**: each level validates clean, and so does the whole station: nothing waits any more (ladders A3 and
     CV, the Armory code). The checker: from the foot of A3, the ladder and the dive (the lift with Gen-1); in the
     drowned sump, both dives; from the breach, every chamber and passage and both ways out, no dead ends.
   - **Cost**: a step with everyone awake, 0.12 ms in the sump, 0.07 drowned, 0.15 in the cave (worst 4.5 ms).
   - **Logs are logs**: the last one in pump control sends you down "shaft B in the filter room", which the sump does
     not have. What a paper says is what its writer believed, not a map.
9. **Swap. Done.** v2 is the game.
   - **Where things are**: the game's sources are at the repository root (`index.html`, `src/`, `test/`); the first
     engine is archived, as it was, at `archive/first-engine.html`. Pages publishes the game at the site's root and the
     archive beside it (`.github/workflows/pages.yml`); `check.yml` runs types, tests and a build on every pull request
     but those that touch only the docs. The title links to the test bed, the station with the lights on, and the first
     engine. A run in progress keeps its save across the move.
   - **Breath in the checker**: where water fills a room to its roof, a place counts as in reach only if you can get
     there and on to air (or a dive up into it) on the breath you have now, swimming at 2.4 m/s; with a rebreather on
     you hold 150 s, without it 35. A rebreather counts while you wear it, and once taken (it goes on as you take it).
     Each thing is judged on its own; one breath is not planned around several. Through a dive down into such water, the
     report says what the far side holds on the breath you would take down. On the drowned sump one breath reaches
     everything, so the rebreather changes nothing there yet; on 12 s, the flooded link to the cave is out of reach.
     Proved also on a small level: 100 m of flooded tunnel, out of reach on one breath, in reach with the rebreather on,
     and out again when it comes off.
   - **Worn things come off**: click one under Worn in the inventory and it goes into a free hand; use it there to put it
     on again. A rebreather taken off under water leaves you one lungful.
   - **The tracker** (`?dev`, P): the checker's report from where you stand, at the top left, run again when what it
     depends on changes (what you hold, wear and know, the power, the room you are in) and every half second under
     water, so your reach shrinks as your breath does. A text version of the "reachable now" overlay `world.md` §5
     asks of the dev map, which is not built yet. It costs what the checker costs: 0.2 s on the upper station when you
     change room with it open.

---

## 14. Open questions

1. **Grid cell size**: 0.25 m, kept. The upper station costs 16 MB of grid; a chunk that is all one room could be
   stored as a single value if a bigger level needs it.

### Settled

- **Caves with irregular outlines** (step 8): stamped tile by tile, with the floor and roof surfaces masked to them;
  one floor and one roof for all of a deck's caves (§13, the cave).

- **Locks without power** (step 8): fail-secure, as `world.md` §4 has it. A card reader or keypad stays locked with
  its circuit dead, and needs power to read; once a card or code has opened a door, it stays unlocked. The first
  engine's rule (a dead lock is no lock) let a backup set switched off open a card door; the checker found it.

- **Storey heights** (step 8): 3.5 m, on the grid. The main level's storeys were 3.4 m; the 10 cm is not to be seen.

- **Mutants on stairs, ladders and elevators**: yes (§7).
- **Physical objects**: yes, unless they cost the frame rate (§6).
- **Publishing (agreed)**: GitHub Pages, from a workflow (`.github/workflows/pages.yml`). Every push to `main` publishes
  the game at the site root and the first engine at `archive/first-engine.html` (until step 9: the first engine at the
  root and v2 at `/v2/`). This needs the repository's Pages source set to **GitHub Actions** (Settings → Pages → Build
  and deployment → Source).
- **`station-plan.md`**: dropped. It was an earlier idea; the station now lives in the level builders, which are the
  reference for its layout and coordinates.
