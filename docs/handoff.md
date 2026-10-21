# Handoff: Security, second pass

For whoever picks this up in a new session. The design was settled in conversation and written into `docs/world.md`; this
is the map from it to the code, and the order to build it in. The previous handoff (bodies with physics) is kept at the
end: its asks, tools and open items still stand.

## The design, and where it is

All in `docs/world.md`. Read these first, in this order:

- §8, *Security*, **The second pass**: what goes (the overseer, the hand, the knock, the bolts, and their names), the
  cameras that guard armed places (not speed), running heard, the alarm answered in a hurry (alarm fatigue dropped), the
  lobby (a grand stair down from the checkpoint), one control room (the operations room, beside the head end on
  critical power; cameras on their branches' comms cupboards; spot monitors in the booth and the duty office), the
  camera wall in the operations room, the changed (intelligent but sedated; the plant growing
  out of them), one tool per room, the night round, the vaccinator, power on or off, flickering as a trope, the big dark
  section, call points, lockdown, load on the backup set, no alarm on the way out.
- §8, **The opening**: the six beats, from the IV pump's alarm to the fail-safe release.
- §3, *Who you are* and *The timeline*: sedated weeks on a false alarm; you start clean; the cut now happens at the start.
- §8, **Cargo, made larger**, and **Production** (later steps; not this one).
- §4, *Time and sleep* and *The water*; §10, *The sleepless* (later; not this one).

The old Security text in §8 is marked superseded but kept, because it describes what is built. When a piece is rebuilt,
rewrite or remove the old text for it in the same PR.

## The order (proposed; put it to the owner if it should change)

Each step its own PR, playable on its own.

1. **Take out the overseer and the hand.** Their cast entries, models, the knock, the bolts, the overseer's own sight
   and seat, `manned()`, their saves and tests. The level must still play and finish without them (the progression
   checker says so). The operations room stays a room for now (§8: its new answer is open).
2. **Cameras that guard places.** Lockdown arms restricted places; a camera on one takes you moving at any pace, and
   elsewhere only records; the changed keep out of them. Shown by floor paint and signs. Speed moves to the ears (tune
   the running noise). Take out alarm fatigue: every one in earshot hurries to the speaker, faster when it sees another
   hurrying. Then lockdown in place of the bolts (an alarm seals that zone's powered doors, heard
   and seen) and break-glass call points.
3. **The lobby, and the screens.** A re-layout, so before the steps that place things in the wing: the grand lobby
   between the shaft and the wing (about 40 by 30 m, 12 to 14 m tall), the wing and everything east of it pushed east.
   The surface cage lands on the second floor (+5), its hallway runs to the checkpoint, and the checkpoint opens onto
   the head of the grand stair; the hoist stays at the ground-floor shaft station with the hazard store. The statue, the
   lounge, the bar, the luminous ceiling; all on SEC, dark until the mend. The progression checker must still pass both
   routes. Then the first screens: the checkpoint booth shows the lobby, the shaft's landings and the checkpoint (on SEC,
   so it wakes with the mend), which is the camera-viewing mechanic the operations room's wall later grows from. The
   wing's control room becomes the briefing room in the same pass (its 33 screens go). The owner will playtest the way
   in from above.
4. **The changed.** Rename the husk's role in the text and the UI (no "husk" said in the game); then the intelligence:
   they notice a thrown breaker and come to look for who threw it, notice a door left open, and use cards. Slow and
   readable throughout. Their look (tobacco leaf in shelves out of neck and shoulders) is a model job; ask before
   spending long on it.
5. **The night round.** One of the changed walking a round with a flashlight that lights what it points at (so cameras see
   you in its beam), carrying a card you can take.
6. **The opening.** The suite on a night setting; the IV pump; the other patient (awake, tally marks, banging); the night
   round brought by the noise, trying each door with its card (reader beeps), the medical hold on yours, the scene
   started when you first look out (a timer behind it); the survivors' cut a minute on; the fail-safe release into
   emergency light. Moves the cut from before the game into it.
7. **The vaccinator**, then the big dark section and the one-tool-per-room ordering of the level, then load on the backup
   set. Then Cargo as an L.

## Where things are now

Step 2's first half is done: cameras guard the armed rooms they hang in (`RoomDef.armed`, `Cam.guard`, `EYES.still`;
the rest only record), the way into each was marked (red door signs and hazard paint; since taken out, the camera in view
from each way in being the tell),
the cast keep armed rooms out of their rounds, alarm fatigue is out, and every husk in earshot hurries to the speaker,
faster with another in sight hurrying (`ANSWER` in `sim/cast.ts`). Running noise is left as it is until played.
Lockdown is done too: rooms carry their alarm zone (`RoomDef.zone`, set from a table at the end of `buildUpper`), and
each klaxon round bolts the zone's doors that have power to move (`Door.down`, `Door.drawing`, `LOCKDOWN` in
`sim/eyes.ts`), with the old bolt sounds and a red lamp over the door. And the call points, one a zone (`callPoint`, a
use of kind `call`). Step 2 is done.

Step 3's first half is done: the lobby (world.md §8, *The lobby*, *Where it goes*, for what was built and why the wing
did not move), the second-floor checkpoint and surface landing, the surface cage moved up to +5, Goods inward for the
hoist, and `grandStair` (`content/build/fittings.ts`). The booth's screens are done too: a console (`monitors`, a use of
kind `watch`), `Sim.watch` and `watching` in `sim/eyes.ts`, and the view in `present/ui/feed.ts`; the four cameras it shows
are named (`CameraDef.name`). The wing's control room is the briefing room now, and the duty office's screen (a
console with a sequencer, `dwell`) is done. Step 3 is done.

Step 4 has begun: Security's staff carry their cards (`Mutant.cards`, set from `LevelDef.cards` and the room they start in;
`carded` and the 'staff' rules in `sim/fields.ts`; `Door.pass` in `sim/movers.ts`; tests in `test/changed.test.ts`). The
code keeps the name `husk`; the dev tools say "changed". The breaker is searched for (the 'search' state and `SEARCH` in
`sim/cast.ts`). A door left open is noticed and shut (the 'shut' state, `LEFT`, `Mutant.door`). Their look is done
too (`changed()` in `render/castView.ts`, for a husk with `cards`; the leaf from `shelf()` in `render/castKit.ts`, each
cluster merged into one mesh by `merged()`, so one draw call). Step 4 is done.
The camera wall waits on a way into the operations room.

Step 5 has begun: the night round walks (`nightround` in `MT`, `sim/cast.ts`: the 'round' state, `walkRound`,
`ROUND`; its stops are `RoundStop`s, given to `mut()` as `round` on any deck). Its flashlight is a loose light like one
lying on (`torchRay`, put among `looseLights` in `sim/sim.ts`), so it lights you for it and for the cameras by the same
`vis`; what a beam throws back is made again only once it has moved a quarter metre or turned (`DRIFT` in
`world/light.ts`). At a stop with `tries` it shows the reader its card (`tryDoor`): `Door.beep` and `beepOk` show green
or red on the reader (`render/things.ts`). Drawn on the husk's model with the flashlight in its left hand
(`render/castView.ts`). Tests: `test/nightround.test.ts`. Save version 7. What step 5 still lacks is its card for you
to take (talk it through with the owner first).

Step 6 is done: the opening (world.md §8, *The opening*, **Built**, for what plays and where it differs from the beats).
`sim/opening.ts` times it (`Opening`, `OPENING`: the look out, the cut after the night round has gone, the pump, being
weak); a new game only (`SimOpts.opening`, `makeRun`'s `opening`, set in `main.ts` unless `?level=`). The rest is rules,
general, in their places: fail-safe locks (`DoorDef.failsafe`, `failSafe` in `sim/movers.ts`, also at `makeSim`);
emergency cells (`RoomDef.batt`, in `roomLight`); a round's stops that want a circuit live, come once, or take the other
patient (`RoundStop.need`, `once`, `take`); a sound made somewhere else drawing the cast (`noiseAt`); the night round coming to
the glass to look in when it cannot reach you (the 'peer' state, `PEER`, `reaches`, `glassSpot`); the other patient (`MT.patient`,
`patient()`, its model and skeleton). `mut()` takes places on other decks in its options (`TStop`; `at` for where it
stands). Save version 8. Tests: `test/opening.test.ts`. Found on the way: the operations room was a round's destination
(lit, grown shut, reached only up the armed stair); it is `noroam` now.

The opening's second pass, after the owner played it (world.md §8, *The opening*, **Built**): the suite laid out again
(the hall 14 m wide; rooms 3 and 4, empty, in sight of your window); the trigger is standing at your door or window
(`atDoor`, `OPENING.near`, `dwell`); the other patient warns you (states 'bang', 'warn', 'dark', 'hide' in `patient()`;
`noiseAt` says when its noise has roused the night round, which looks toward it `ROUND.roused` before it comes); the
night round touches them limp and drags them (`take`, `dragged`, `drop`, `Mutant.drag`; the loose body's `limp` and `pin`
in `sim/ragdoll.ts`); green rooms are looked into (`RoundStop.look`), and the suite is walked faster (`RoundStop.pace`);
the cut 10 s after it reaches the stair's top, then black for `OPENING.black` before the cells (their own supply,
`CELLS`, watching `SEC`: `Batt`). Light switches: `use` of kind `switch`, on rooms' own circuits (`ISO1`, `ISO2`).
The timeline is a week, not weeks (world.md §3), and Security fell to a late child of Pia (§2).

The third pass, in the dark (world.md §8, *The opening*, **Built**): the cut is days old (SEC broken from the start); the
suite runs on its own failing set, `ISO` (`back` set by `makeOpening`, dropped by `fail()` in `sim/opening.ts`, with a
`winddown`), its rooms flickering (`flick`), its locks, readers and pumps on it, and the cells watching it. The medical
hold, `GONE`, the light switches and the patient's 'dark' state are gone; every isolation door is on a guard's card. The
night round strikes the other patient twice before it takes them (`BEAT`; a blow at another of the cast, `Blow.at`;
`beaten()` leaves blood, `Sim.pools`, saved, drawn in `castView.ts`), sweeps each room it opens from the doorway
(`ROUND.into`), and in the opening takes you if it gets to you (`takesYou`: `end()`, game over). Card-carriers after you
now come through the card doors between (`staffField` in `sim/fields.ts`, a cache, so not saved), and nobody walks
straight at you through glass (`chase`). Your washroom's door is a hand-slid one (on the dead `SEC`), so it stays shut
behind you. Room 4 is walled off from the bay. Save version 10.

The fourth pass, the graft (world.md §8, *The opening*, **Built**): the other patient is struck out cold (`take`,
`slack`), dragged into the hall by the ankle, heavy rather than flailing (`RAG.slack`, and a limp body is not drawn
after its feet), leaving smears (`Sim.pools` kind `smear`), and grafted at a round stop (`RoundStop.graft`: `graftHere`,
`grafting`, `GRAFT`, the night round's `graft` timer, `stutters` for the view and the soundscape's hard flicker in
`present/flicker.ts`); then left out cold (patient state 'out', `lies`, `bleed`; `grafted`, drawn as a shelf of leaf
on the forearm, the gown streaked). The rooms are walked into and looked right round (`RoundStop.about`, `ROUND.about`);
a tries stop's `wait` is a pause before the card. Footprints through the new pools are the renderer's (`Prints.spilt`),
now foot-shaped; every pool is discs (`SPLAT` in `castView.ts`, `blood()` in `content/build/fittings.ts`). The take
respects god mode. Save version 11.

**On the back burner** (the owner set Security aside here; pick these up with them, not unasked):
- Step 7 above (the vaccinator, the big dark section, load on the backup set, Cargo as an L).
- How you get into the operations room, which the camera wall waits on.
- Call points as fire alarms instead (doors released, the changed sent to the muster hall), not lockdown: the owner's call.
  Releasing card doors would let you past the card progression, so it would want ordinary doors only.
- The `lockers` note (`content/notes.ts`) still describes the overseer ("it can see you… Screens off, it is blind"): lore
  for the owner to rewrite.
- The range's doorway steps 0.16 in light (`test/light.test.ts` samples around it by name).
- Playtest questions left open: whether lockdown should let the staff through; whether dark armed rooms, guarded mostly
  by your own flashlight, have teeth enough; the feeds' brightness at the start (`present/ui/feed.ts`); the running noise;
  the call points' size; the statue (a placeholder: the logo or a gardening motif later).

Step 1 is done: the overseer, the hand, the knock and the bolts are out of the code and of world.md §8 (old saves do not
load: save version 6). §10's lineage still names the overseer in three places (rules 1 and 8, *Security's first*): left
for the owner, since they are cosmology, not the level.

- `src/sim/eyes.ts`: cameras (`makeCams`, `camLive`, `camSees`), zones and speakers (`soundZone`, `heard`), alarms
  (`makeAlarm`, `restoreAlarms`), and `updateEyes`, which runs them. Tests: `test/eyes.test.ts`.
- `src/sim/cast.ts`: the cast. `Ai` and the kinds table near the top; answering an alarm (`answer`); the power-failure
  drill (`drill`). Tests: `test/cast.test.ts`.
- `src/sim/movers.ts`: doors (`locked`). `src/sim/interact.ts`: card readers and keypads (`doorLabel`, `doorAct`).
- `src/content/levels/upper.ts`: the level. The isolation suite is near the top (rooms round a common hall, the patient,
  the guard's dropped light); the start is `finishLevel` at the end (room 1, facing its door). The muster hall and the
  operations room (behind glass, its staff grown to its screens as dressing, its door grown shut) are in the middle; Cargo
  is `buildCargo`. Tests: `test/upper.test.ts`, `test/progress.test.ts` (the checker).
- `src/present/render/things.ts`: cameras and speakers drawn. `src/present/render/castView.ts`: models (`BUILD`, `ANIM`).
  `src/present/audio.ts`: the klaxon, the camera's servo.
- `src/sim/save.ts`: saves carry cameras, alarms and smashed speakers.

## Asks for this step

- Discussion first when something is not in world.md: the owner likes to talk a design through before it is built.
- Clarity over cleverness: power is on or off; every threat seen or heard before it lands, and with an answer.
- No new speech for the cast. No alarm on leaving the level.
- The combat asks below still hold (ask before anything that changes how combat plays).

---

# The previous handoff: bodies with physics

### Where it stands

- Merged: corpses loose (#68), corpses kept (#69), knockdowns loose (#70), muscle tone and corpse gravity (#71),
  reflexes (#72), stagger steps (#73).
- This branch (`claude/eager-fermi-bp97gu`, its own PR): four things found playing. The chop's shove went sideways
  (combat.ts, `landOn`); the dead flew (ragdoll.ts, `loose`, `RAG.shove`); the dying worm swam (`writhe`); the
  floored husk spun on its feet (`stagger`'s upright hold); the grabber could only be hit at its head (combat.ts,
  `GRAB`). engine.md §6, *After play, as built*, has the numbers.

### The asks that stand

- `src/sim/` and `src/world/` never import three.js or touch the page; the sim runs headless (vitest).
- Determinism: seeded randomness only; two identical runs end identically. Saves are plain data (`sim/save.ts`; the
  ragdoll's `Rag` is plain numbers). The world is rebuilt from the level, never saved. world.ts is the authority for
  characters, sight, sound, pathfinding; the ragdoll asks it, never the other way.
- **Ask before anything that changes how combat plays**: damage, poise, knockdown thresholds, and (by extension)
  when and where a blow lands. Tuned by feel; the owner likes where they are.
- `npm run check` (types and tests) before every push. Headless tests for anything new. Look at it in the built
  game with headless Chromium. House style: comments and docs in clipped prose in the game's register; constants in
  tables, each with a comment. Commit: a short title, a prose body saying why. A PR per step: what changed, what was
  measured, what is not built. Record what was built and measured, and what was tried and set aside, in engine.md §6.

### Where things are

- `src/sim/ragdoll.ts`: all of it. `SKEL` (each kind's points, rigid cluster, sticks, joint limits, hinges, tone,
  hands, legs), `RAG` (the solver and how blows land on a body), `REFLEX`, `STAGGER`. `makeRag`/`loose` turn a body
  loose with the blow in it; `updateCorpses` steps them all (budget 16 awake, asleep costs nothing); `begin` and
  `finish` are the two halves of a step; `knockRag` is a blow on one already loose.
- `src/sim/cast.ts`: `hitMutant` (the shove, the kill, the knockdown), `floored`, `kill`.
- `src/sim/combat.ts`: your blows. `sweep` traces the swing (`sim/sweep.ts`: `PATHS`, `ACTIVE`, `along`); `landOn`
  makes the hit (shove, its way, `Hit.at`, `Hit.way`); `knock` is a swing through a corpse; `fire` the guns.
- `src/present/render/rig.ts`: draws a loose body with the model's own boxes (`RIG` per model), blends in and out.
- `src/present/render/castView.ts`: the models (`BUILD`, `ANIM`); the husk's and thresher's legs have knees for it.

### How to see what it does

- In the game: `npm run dev`, then `/?dev&level=testbed`, north into the arena. Keys 1 to 6 put down the cast, 0
  kills them all (again: clears the dead), T slow motion, Y your weapon, U freezes them, O the colliders. The hit log
  is in the dev readout. `window.rs` is the run: `rs.sim`, `rs.step(rs.run, input)`.
- Headless numbers: `test/probes/` (README there). `aim`, `kill`, `down`, each with knobs. Every fault in this
  branch was found by one of these first; looking at the game said only "it looks wrong".
- Headless Chromium (Playwright is preinstalled, not a dependency): put `playwright-core` in a scratch folder
  (`npm i playwright-core`), serve with `npx vite --port 5173`, and drive it:

      const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
      const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto('http://localhost:5173/?dev&level=testbed');
      await page.waitForFunction(() => window.rs?.sim);
      await page.click('#title').catch(() => {});
      // T twice, then step it by hand from page.evaluate: import('/src/sim/input.ts') for noInput,
      // import('/src/sim/cast.ts') for spawn and hitMutant, rs.step(rs.run, { ...noInput(), attack: true })

  One 404 on load is the favicon, and is not a page error.

### Open

1. **The axe's aim** (asked about, not changed). The owner: "you'd think to just place the crosshair and swing; it
   doesn't land where you'd expect". Measured (`aim` probe): a chop meets the first thing its arc comes down on, so
   on anything tall it lands 22 to 43° above the crosshair wherever you aim (the top of a husk's head, from 1 m); on
   low things within 12°. Its reach is a radius from your eye (axe 1.7 m, more looking down), and nothing 2.5 m off is
   reached. Ways to go, each a change to how combat plays, so put to the owner first:
   - start the chop's arc lower (`PATHS.chop.from` 50° to 25°, say), so it lands nearer the crosshair, and a little
     later (by up to 0.1 s on a husk close by), and reaches less above you;
   - have the one under the crosshair met where the arc crosses the crosshair, the arc catching only others first;
   - leave it, and draw where it will land (the dev overlay already draws the path: `sweepPath`).
   The sideways shove (fixed here) will have made it feel worse than it is: try it again first.
2. **The overseer's hit volume** is the grabber's old head ball, 2 m up, above a mound 1.6 m high. Probably the same
   fault; not reported, so not touched.
3. **Knockdowns still turn some**: 118° in all while down across eighteen floorings, most of it lying and rolling
   after it is down; worst 208°. If it still reads as a trip, look at `RAG.local` and `RAG.tip` for the living (each
   alone made little difference to the spin, but that was with the spin's real cause in) and the brace.
4. **The stagger is fragile.** When a floored body goes down swings with small changes (engine.md, *Stagger steps*:
   "fragile"). The test for it allows the thresher's steps only 0.1 s over none (0.77 s against 0.62).
5. Not built, and never asked for: a reel that stumbles (a reel is the model's animation); corpses that block.

### What was learned

- Measure before touching: each fault here had an obvious suspect that was not it. The spin was not the local
  impulse, the tip, the anchor, or the steps (each off alone, it still spun); it was a pull on three of a rigid body's
  six points. Turn things off one at a time with `SET=`, and trace one case step by step (`TRACE=1`).
- Anything pulled on part of a rigid cluster turns the cluster. Pull all of it, or a point that is not in one.
- A wave along a body on a floor with friction is locomotion.
- Normalising a sum of two units can amplify rounding into a direction. Weight by what each is worth before adding.
- The fight's numbers (shove, poise, closing) are tuned for the living, on a cylinder with strong friction. A loose
  body given the same is a lighter, slipperier thing: give it its own share, and cap it.
- Tests that stood for a feel ("the axe carries it further than the baton") turn out to stand for a fault later.
  Write what it should look like, and check it against the owner's words.
