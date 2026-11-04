# Mockups

Pages for looking at designs before they are built into the game. Each is a single HTML file that runs on its own in a
browser (three.js comes from a CDN), and each has been published as a private claude.ai artifact.

- `creatures.html`: the overseer and its hand, with their states and the knock code.
- `elders.html`: the elders of the lineage (`docs/world.md` §10), at true scale beside a 1.8 m figure, in the game's own
  kit of boxes, cylinders and icosahedra: Pia (her three stages), Ines, Dale and his line, Sam, Tom, and Holt's cave. One
  tab each; buttons switch states. `window.__rs` in the console exposes each scene and its `set…` function.
- `mutants.html`: a bench for Security's changed (`docs/world.md` §8), in the game's kit: sliders for their build and
  their walk (the floor moves at the walk's pace, so a planted foot should hold still), what they still wear, and growth
  clicked onto them (eyes, pustules, leaf shelves, stalks, roots, knots; the wheel sizes them). Saves designs as JSON
  (`rootshock-changed/1`, described at the top of its script); the published copy keeps them where Claude can read them.
  *Security's seven* (the Saved tab) is a line-up of the upper station's changed, one for each, newest to oldest;
  *Pia's lines* are examples of the bone, bloat and plant lines that founded the Commons, young to old and each young god.
  `window.__rs` in the console exposes the state.
- `heads.html`: a bench for the heads of Pia's lines (`docs/world.md` §10): a row for each line (the bone line's middle
  years, Security's changed, a young bloat), each head on the same body so only the head differs; and *Ageing*, the
  bone line young to old at its own sizes beside a 1.8 m figure. The fifth pass, after four rounds of picks: the
  bone line's bone grows over the outside, never through, and its face comes down to the mouth and then goes (as built,
  just the mouth, the smooth skull); the bloat face up, high on the head, and with its face's contrast taken down; the
  plant line moved to `plants.html`, the shelf over the eyes kept here as the closest so far. The old of the bone
  line is a person packed inside their own bone at a person's proportions, about 2.4 m: the torso's flesh pressed raw up
  to the ribs, the limbs gone wholly to bone, thick because the limb is still inside, though a sixth thinner than the
  fourth pass had them. Seen in a concrete room: as a
  line-up, close to, or from your eye at the game's 72° and a chosen distance; lit, under a tube, or dark with a
  flashlight; in the built palette or a darker one, flat or mottled, upright or hunched. Keep, maybe or drop each, with
  a note: the published copy keeps them where Claude can read them (collection `picks`, described at the top of its
  script). `window.__rs` in the console exposes the state.
- `plants.html`: the plant mutants, as a numbered collection. Designed again from the start after the head bench's plant
  heads were all dropped or left at maybe, over four passes of picks; the passes' rows are in the history. *Kept* holds
  every one kept so far and *Held* the maybes worth building on, each numbered for good so a variant can be asked for by
  its number, and each under the id its pick was made with, so the verdicts and notes come with it. Visual first: which
  line each belongs to waits until the list is long enough to sort. So far: the bud head (furled leaf over the skull and
  eyes, no mouth) and its heavier form; the bush's line covered head to toe and grown through by a stalk, newest to
  oldest (`docs/world.md` §8, *The changed*, *The look, from the plant bench*); and sprouts through the body, out of the
  eyes first (the crown, all over, overgrown). *New* holds the variants the notes asked for, 16 to 34: the head
  swallowed, sizes of the grown through and the first keep, the crown rooted, propped on its eye stalks and sunk into
  the floor, and the big stalks moved off the eyes; with bark, roots and broken floor among the pieces. Then 35 to 42
  (the swallowed head without its clipping, the rooted crown at other sizes and on a trunk, faces for two of the
  overgrown), and *Maybe* and *Dropped* tabs: where each stands is set from the picks (`GROUPS`), and a dropped
  number is never reused. *Generate* rolls new ones from templates made of the kept families (leaf spiral, stalk
  through, sprouting, rooted) at a stage of life from newest to oldest: the stage sets each template's ranges (size,
  clothes, growth, curing, bark, roots, the head), and within them each rolls its own big stalks (how many, out of
  where, how large), face and sprouts; no two in a batch put their big stalks in the same places. A generated one's id
  (`g-<template>-<stage>-<seed>`) rebuilds it exactly (`genome()`, `buildGen()`); the ones kept from a batch are saved
  as they were rolled (`SAVED`) and numbered into the collection, so changing the generator never changes them. Since
  its first batch: a fifth template, *Petalled* (plates out of the body, a bloom of yellow flowers on the old), an
  *Ancient* stage for the rooted (the root taking it to the head, the arms gone in, the green top fierce), buds that
  flower yellow, faces under bark, and no more than two with eye stalks in a batch; then the petalled's petals made the
  bud's own leaves, lapping down the body as armour, and young sprouting given more on the body. The head bench's engine, room, views and lights; the line-up shows six at
  a time round the one picked, and *Silhouette* draws each as a flat dark shape on a pale room, to compare outlines. Keep,
  maybe or drop each, with a note (collection `picks`, described at the top of its script). `window.__rs` in the console
  exposes the state.
- `cargo.html`: Cargo made larger (`docs/world.md` §8, *Cargo, sketched, and built*, which says what the build changed),
  at true scale in the game's kit: the nave, the warehouse arm (room and pillar), the freight shaft at the corner and the
  chambers off them, with the station's rooms round it and the old Cargo as an outline to compare. Overview, plan (a 10 m
  grid) or walk; *Lights out* leaves the nest's glow and your flashlight. Each place picked says what it is for.
  `window.__rs` in the console exposes the scene, `select(id)`, `setMode(m)` and `setDark(b)`.
- `lineage.html`: the family tree and an entry for each elder. Generated: edit `lineage/template.html` (the cards) or
  `lineage/build.py` (the tree's nodes), then run `python3 mockups/lineage/build.py`.

**Testing offline.** Where the CDN cannot be reached, a headless browser can serve three.js from `node_modules`: route
`https://cdn.jsdelivr.net/**` to `node_modules/three/build/`.

**Set aside.** June, a sixth elder, was mocked up and shelved; her tab is in the history at `e0672ba`.
