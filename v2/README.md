# Rootshock v2

The rebuild described in [`docs/engine.md`](../docs/engine.md). The current game is still `index.html` at the
repository root; this folder replaces it once it reaches parity.

## Running it

You need [Node.js](https://nodejs.org) 22 or later. From this folder:

```
npm install        # once, and whenever package.json changes
npm run dev        # serves the game at http://localhost:5173 and reloads on every save
```

Open `http://localhost:5173/?dev` for the position readout, and `window.rs.sim` in the browser console.

| command | what it does |
|---|---|
| `npm run dev` | play it while you work on it |
| `npm run check` | type-check and run the tests; run this before pushing |
| `npm test` | the tests only |
| `npm run build` | build the publishable game into `dist/` |
| `npm run preview` | serve what `build` produced |

## Where things are

```
src/core      maths, seeded random numbers, the fixed-step loop
src/content   levels as data, and the kit for writing them (builder.ts, kit.ts)
src/world     the level compiled into one spatial model; every spatial question goes here
src/sim       the game itself: bodies, the player, one step at a time. No three.js, no page.
src/present   drawing, the camera, keys and mouse, the HUD
test          tests; they run the sim with no browser
```

The rule that keeps it malleable: `sim/` and `world/` never import three.js or touch the page.
