# Mockups

Pages for looking at designs before they are built into the game. Each is a single HTML file that runs on its own in a
browser (three.js comes from a CDN), and each has been published as a private claude.ai artifact.

- `creatures.html`: the overseer and its hand, with their states and the knock code.
- `elders.html`: the elders of the lineage (`docs/world.md` §10), at true scale beside a 1.8 m figure, in the game's own
  kit of boxes, cylinders and icosahedra: Pia (her three stages), Ines, Dale and his line, Sam, Tom, and Holt's cave. One
  tab each; buttons switch states. `window.__rs` in the console exposes each scene and its `set…` function.
- `lineage.html`: the family tree and an entry for each elder. Generated: edit `lineage/template.html` (the cards) or
  `lineage/build.py` (the tree's nodes), then run `python3 mockups/lineage/build.py`.

**Testing offline.** Where the CDN cannot be reached, a headless browser can serve three.js from `node_modules`: route
`https://cdn.jsdelivr.net/**` to `node_modules/three/build/`.

**Set aside.** June, a sixth elder, was mocked up and shelved; her tab is in the history at `e0672ba`.
