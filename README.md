# Rootshock

A first-person game set in Lowfield Station, a facility deep under a field. [`docs/world.md`](docs/world.md) says what
the game is; [`docs/engine.md`](docs/engine.md) says how it is built.

The first engine, a single page the game began as, is kept as it was in
[`archive/first-engine.html`](archive/first-engine.html): open it to compare, or add `?dev=newstation` to see the
station the game now plays.

## Running it

You need [Node.js](https://nodejs.org) 22 or later. From the repository root:

```
npm install        # once, and whenever package.json changes
npm run dev        # serves the game at http://localhost:5173 and reloads on every save
```

Open `http://localhost:5173/?dev` for the position readout and `window.rs.sim` in the browser console. Dev keys: V fly,
G god, B bright, O draws every collider, P the tracker (what the progression checker says you can reach from where you
stand). `?level=<id>` starts on another level (`upper`, `main`, `plant`, `sump`, `sumpdeep`, `cave`, or `testbed`);
`?power=full` starts with everything on.

| command | what it does |
|---|---|
| `npm run dev` | play it while you work on it |
| `npm run check` | type-check and run the tests (level validation and the progression checker among them); run this before pushing |
| `npm test` | the tests only |
| `npm run build` | build the publishable game into `dist/` |
| `npm run preview` | serve what `build` produced |

Every push to `main` publishes the game with GitHub Pages (`.github/workflows/pages.yml`), with the first engine at
`archive/first-engine.html`.

## Where things are

```
src/core      maths, seeded random numbers, the fixed-step loop
src/content   levels as data, and the kit for writing them (build/)
src/world     the level compiled into one spatial model; every spatial question goes here
src/sim       the game itself: bodies, the player, the cast, one step at a time. No three.js, no page.
src/present   drawing, the camera, keys and mouse, the HUD
test          tests; they run the sim with no browser
docs          the design (world.md) and the engine (engine.md)
archive       the first engine
```

The rule that keeps it malleable: `sim/` and `world/` never import three.js or touch the page.
