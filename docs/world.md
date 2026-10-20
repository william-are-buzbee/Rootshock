# Rootshock: world and progression

The design bible for the next pass. It records what has been agreed, what is proposed, and what is still open, so the work can be
picked up by anyone (or any session) without the conversation that produced it. Status markers:

- **Agreed**: decided; build to it.
- **Proposed**: a direction both sides like, not yet committed.
- **Open**: needs a decision before it is built.

The station itself (layout, levels, coordinates) is in the level builders in `src/content/levels`, ported from the first
engine's `NEWSTATION` (archived in `archive/first-engine.html`, behind `?dev=newstation`).

---

## 1. Premise

**Lowfield Station** is a deep underground facility built and paid for by a family (**agreed**), rich enough to want a sky
down there. Its stated purpose is commercial.

### The station as built (agreed)

What the walls are, and why, before what colour they are. Plausibility first; then the family's money on top of it.

- **Mined, about 400 m down.** Too deep to dig a pit and bury a building (that stops at 30 or 40 m): it was drilled and
  blasted from shafts, as a mine is, and reached by the cage. The upper station is at 400 m, the main level 450, the plant
  500, the sump 522; the cave is a limestone stream cave the builders found.
- **Three layers, and every room shows one.** *The rock*: blasted, held with rock bolts (a square plate every 1.5 m),
  sprayed with shotcrete, which is lumpy, follows the rock and has no formwork seams. *The box*: most rooms are buildings
  stood inside the caverns, of block or studs and board, with their own roof under the rock; this is why rooms are boxes.
  *The finish*: where the money shows.
- **What being underground rules.** Fire first: no way out and nowhere for smoke to go, so the finishes are what does not
  burn (stone, metal, glass, tile, terrazzo); wood and fabric are rare, and the lobby's bar and sofas are the family
  breaking its own rules for comfort. Water always comes back: bare cement weeps white salts, bolts weep rust; paint
  takes a brown tide mark. Everything came down the shaft, so what was poured or laid in place in small pieces wins:
  terrazzo, tile, stone in panels. And the soft finishes (board, carpet, ceiling tile, veneer) last only while the
  dehumidifiers run.
- **The hole is the expense.** Excavation and support dwarf any finish, and depth doubles or trebles every finish's cost
  alike (the haul, the labour), so the good finish costs proportionally less down here. A rich owner finishes nicely
  wherever people work, not only where visitors look.
- **Built in the late 70s or 80s, refitted since: two layers to read.** The family's own fabric is where people
  walked: terrazzo underfoot (the halls, the atrium, the muster hall), painted block in Security, glazed tile where
  things are washed down, plaster in homes, limestone and a bronze band where visitors came (the surface landing, the
  lobby and its gallery). The refit laid its own over it: coated floors in Security and Horticulture, sheet vinyl in
  medical rooms and kitchens, plasterboard and carpet tile in the offices. A room dug and left as dug (utility rooms,
  the plant, the bays, the sump, the tunnels) is shotcrete on a poured floor, services on hangers under its crown.
- **By money, from the bottom (for reference).** Exposed shotcrete and a sealed slab cost nothing past the support;
  painted block and a coated floor are an institution; board, carpet and a suspended ceiling an office; glazed tile and
  coved vinyl are hygiene (money buys stainless, not marble); terrazzo is old money; stone, brushed metal and bronze are
  the lobby. Light is the finish too: expensive is concealed and warm, cheap is a bare tube.
- **Doors (agreed).** Where rooms were dug apart, the rock between them is metres thick and a doorway is a short
  passage, lined with the finish of the grander side, its door in the middle sliding sideways into the rock. Each door
  says where it is: the family's walnut pairs trimmed in bronze off the lobby; a clinic's pale pair with windows, wide
  for a bed; a veneered office door with a strip of glass; Security's painted steel with a wired pane; heavy steel for
  the Armory and its like; and in dug places, roller shutters, which rise (as does anything jammed: you crouch under
  it). Where a cavern was divided into rooms, walls are half-metre partitions, and that is where glass goes: labs and
  wards onto their corridors, offices onto their halls (built: the infirmary, the briefing room, the duty office, the
  tissue lab's glass wall, the director's window). Still to place: a control room over the generator hall, glass
  balustrades on the lobby's gallery, a gallery over the arboretum, clerestories, vision panels in more doors.
  Single doors are to narrow to about 1.2 m inside the 2 m opening; the big cast (the thresher, the big skitter) then
  use only double doors, archways and shutters (agreed, not built).
- **Signs and thresholds (agreed).** Signs are lit as everything is, retroreflective under a beam, and take the style
  of their wall. Armed rooms are not marked on the floor or the sign: the camera is the tell.
- **Decay (proposed, not built).** The money rots first when the power dies: ceiling tiles sag, board mottles with
  mould, veneer swells, carpet goes sour; the shotcrete looks as it did. Ties the look to the power and the time since
  the fall.

### The plant

A crop akin to tobacco, coca leaf or kratom: legal, ordinary, chewed or smoked for a mild lift. The facility exists to breed new
strains of it and sell what they produce, legally or not.

### The mutagen

A substance that behaves like a cancer: applied to a living thing, it raises the rate of mutation enormously. The facility uses it to
force the plant through generations of change in weeks.

- **Name (open).** "The shock" is good as staff slang and ties to the title, but too on the nose as the official name. Proposed: a
  clinical compound name on the paperwork, "shock" in people's mouths. Note that *transplant shock* (root shock) is a real
  horticultural term for the stress a plant suffers when it is moved. The player was transplanted.

### What it made

It worked, beyond expectation. The plant became a whole product line:

- stronger leaf (less per cigarette), mild chewing and cigar grades;
- refined oils and resins;
- pain relief, anaesthetics;
- CNS stimulants;
- rave tablets for visuals, deeper hallucinogens, perception-altering compounds;
- pleasure enhancers.

### What went wrong

The products carried traces of the mutagen, bound to plant cells. The people who tested them were the first to change.

- **A seed takes root.** In each tester, the plant material seeded a small organ that goes on making the drug they took: the
  painkiller tester no longer feels pain, the stimulant tester no longer sleeps, the hallucinogen tester never stops seeing.
- **The brain adapts instead of fighting.** The mutagen drives hyper-plasticity (growth factors, youth, cognitive flexibility). The
  brain rebuilds itself around the new organ and the new body until it works. Each person changes differently; no two are alike,
  and none can be copied.
- **They stay intelligent.** They keep their reason, their foresight, their ability to plan. Some of them document their own changes.
- **Hybrid bodies.** Because the mutagen came in a plant cell, these first mutants are plant and animal both: plant structures grow
  out alongside the animal changes (extended bone, red flesh).
- **Secrecy.** Early changes could be hidden. Once the mind turned, they understood exactly what the facility would do to them if it
  knew: liquidation, confinement, or the same experiments it ran on the plant. They hid it, as a group, and nobody outside
  Horticulture noticed.

---

## 2. The two tribes

### The plants (the first tribe)

The testers and those they turned, centred on Horticulture.

- **Mindset.** A group that kept a secret together, in an echo chamber of altered minds, and talked itself into a victim's
  certainty: act first or be annihilated. They are not entirely wrong. Their logic is open to interpretation, and the game should
  let the player read it either way.
- **Leader (proposed): Dr M. Holt**, director of research, already in the game as the bloat sitting in the arboretum with the last
  note.
- **Territory:** Horticulture, the arboretum, the cave (the great chamber is their real arboretum), the sump.
- **Wants:** grow light and water. The flooded sump is useful to them, perhaps a breeding ground for aquatic forms (the swimmers).
  They do not want it pumped dry.
- **Rank and file (existing monsters):** rootworms, vines, the growth; swimmers in the water.

### The flesh (the second tribe)

- **Origin.** A member of staff touched the animal part of a plant hybrid (a mutated arm, not the plant growth; in §10 this is Pia's touch, in her stupor, and the arm is an ordinary one). The sample carried
  perhaps a twentieth of the plant influence, so they became a mostly flesh mutant, with the same plasticity.
- **Mindset.** The infection carried the mindset. He inherited the plants' tribalism, victimhood and fear of eradication, as his own
  private terror. It drove him to take others by force and make them change with him, one and then more, until the bloc was strong
  enough to take the Commons. (This is the game's darkest thread: an analogue of assault and abuse of power. It lands harder implied,
  through notes and through what the Commons has become, than shown. Keep it restrained, in the game's clipped register.)
- **Leader (proposed): the keeper**, the bloat in the director's residence who wears the director's lift key.
- **Territory:** the Commons and the Square.
- **Wants:** energy, food and heat. They have lived on dwindling stores and backup-generator warmth. They want Engineering: the warm
  generator hall is where mats of edible flesh could be grown and harvested.
- **Rank and file (existing monsters):** husks, skitters, worms; the thresher.

### The Security flesh (an offshoot of the flesh; agreed)

- **Origin.** Security watched the Commons turn, on Security's own cameras, and walled itself off. It was not enough: some small
  amount got through anyway, and Security's own staff began to change. They are the youngest branch of the flesh.
- **Character.** The most technologically able of the flesh. They kept the station's systems running from habit; the cameras
  watch for them on a lockdown protocol, with nobody behind the screens (see §8).
- **The survivors.** A smaller group of Security's staff, still human, sectioned themselves off from the changed ones. The changed
  held the controls for the way out, and the surface lift is close by; they locked it away to protect themselves, and damaged it.
  To blind the cameras on their side, the survivors cut the service connection to their own wing and lived in the dark (§8).
  The survivors killed themselves, or made a run for an exit and were killed or stopped by something on the way. None of them
  made it.
- **Why they hold the way out (open).** Not a scanner (the clean-body scan is dropped: §6, question 10). A working idea: the flesh
  fear being found more than anything (see *Secrecy*, above); anyone who reaches the surface and talks brings the people with fire.
  So the way out is not a door they cannot pass but one they will not let be opened, and anyone walking out of Holding is a
  witness.
- **Towards you:** for now, they want you dead. (Whether they would rather take you, and how, is open: §6.)
- **Towards the Commons:** kinship and threat at once, as the plants and the flesh are to each other.
- **Territory:** Security and the Cargo cavern.
- **Rank and file:** the patrols (changed staff, still nearly human, some in uniform), skitters and their eggs (§8).

### Between them

Both are intelligent, self-aware and changing fast, and they see each other as a threat to scarce resources.

- **Contested ground:** Engineering and the generator hall (farm, power), perhaps the Commons itself (space).
- **Possible moves:** fight; bargain (the flesh offer the plants food for access to Gen-1); the plants refuse to let the sump be drained.
- **The long game.** The oldest of them may see mutagen reaching the surface as inevitable, and the real contest as who is strongest
  when it does. Winning big *now*, before the other side can break free, matters more than any one room.

### Two tiers (proposed)

Fully intelligent tribes sit awkwardly with monsters that attack on sight. Resolve it in two tiers:

- **Leaders** are intelligent; you deal with them.
- **Rank and file** are instinctive and territorial; you fight them or avoid them.

A leader's favour calls off its rank and file inside its own territory. This keeps the horror of pass 3 (the thresher in the dark)
and adds politics above it.

---

## 3. The player

**Who you are.** The old answer (Accession 31, delivered sedated in a crate, signed for like seed) is dropped: nobody is
trafficked in. You are staff, held in Security's **medical isolation suite**, a well-appointed set of rooms rarely used, for
staff who may have been exposed to something. (The papers in the suite tell this story now; others still tell the old one of
accessions and transfers: the chief of security's, the keeper's, Holt's memorandum.)

- **A false alarm, kept under (agreed).** You were isolated for an exposure, early in the visible outbreak, and sedated while
  they watched for signs. It was a false alarm: weeks on, you would have changed by now if it were not. The doctor who could
  have cleared you was gone; the survivors could not tell, and kept you under ("keep the two in Iso under; we don't know what
  they are"), changing the bags until they could no longer reach the suite. The sedative is an ordinary hospital drug, its
  real name on the bag, so nobody reads it as one of the station's products.
- **You start clean (agreed).** The one clean body on the station. Every graft after this is your choice, and so is staying
  clean.
- **How long (agreed in outline):** six to eight weeks under. The station fell while you slept (below).

**The timeline (agreed in outline).** Long enough for the lineage to grow up, none of it seen. Rough, to be pinned down:

| When | What |
|---|---|
| Months before | The trials; the testers change and hide it. Dale's sleepless weeks, and the energetics born in his blackouts |
| Two or three months before | Pia's touch; the founder; the Commons falls, over weeks |
| Six to eight weeks before | Security sees it and seals itself; some gets through anyway. You are exposed, or seem to be, and put under |
| The last weeks | Security turns from inside; the survivors fall back into the wing and keep you sedated |
| Days before | The survivors can no longer reach the suite; the other patient's bag runs dry, and they wake |
| The start | Yours runs dry |

- **Start:** an unaligned pawn.
- **End:** the physical, mechanical arbiter of the station, and its political actor: kingmaker, liaison, or neither.
- **Why either side needs you (open).** The decontamination scanner that made you a "clean courier" is dropped (§6, question 10).
  You start clean (above); whether you stay so is open: you bash a great deal of mutant apart, and it is hard to believe none
  of it got on you.

---

## 4. Mechanics

### Design rules (agreed)

- **Levels may be largely self-contained.** Distinct levels with their own internal logic are fine (System Shock 2 and Prey do
  this). Cross-level links should be few and attached to **memorable objects** ("the Armory code", "Gen-1"), never to the names of
  corridors nobody remembers.
- **Decisions must differ.** Not every decision should feel the same, and not every player should make the same ones.
- **Obstacle or flavour.** An obstacle must **cost** something (a resource, health, noise, time, exposure), **need** something (an
  item, knowledge), or force a choice between exclusive options. Anything the player can do by default at no cost is flavour, not
  progression. (Jammed half-open doors and loose panels are flavour unless given a cost.)
- **No soft-locks.** Non-linear routes plus spendable resources make soft-locks likely. The progression checker (below) must prove
  every save can still finish.
- **Nothing was built for this (proposed).** Nobody who built or runs the station could know an outbreak like this was possible.
  Every defence in it is ordinary equipment doing a job it was never meant for: Security's cameras, fail-safe cell doors, a panel
  board. A lock or a gate that only makes sense if someone saw this coming does not belong.

### Doors and locks (agreed)

Two independent questions per door.

**What moves it**

- **Light door:** slides by hand when unpowered. Powered, it opens either by a **button** or **automatically** (two variants).
- **Heavy door:** does not move without adequate power. Unpowered, it is closed; powered, it behaves like a light door.

**What locks it**

- **None.**
- **Card or keypad: fail-secure.** Locked with the power off, and the reader needs power to read. A card door needs power *and* the
  card. (Replaces the old rule, where a dead circuit let every restricted door open by hand. That was memorable but makes no sense
  for a security building.)
- **Mechanical key:** works with no power at all; a physical key carried by someone.

**Exceptions and alternatives**

- **Fail-safe doors**, few and visibly marked (life-safety signage): they release when power dies. The holding cells are one, which
  is why your cell opened when Gen-1 dropped.
- **Brute force (proposed):** break a lock or pry a door, at a cost: loud, slow, weapon wear, or a repair kit.

### Power

- **Backup sets (agreed in principle):** emergency circuits only. Dim halls, dark rooms, critical loads. That is believable: real
  emergency lighting runs at a small fraction of normal output. Reasons to run one: card readers and keypads, door buttons and
  automatic doors, platforms, terminals and cameras; set against noise that wakes things and the light that makes you visible.
  **Open:** limited fuel (brainstormed as a possible McGuffin: §9, Fuel); backup sets as repairables.
- **Gen-1:** the global answer that changes a whole level, or the whole station, at once.
- **Gen-1 capacity (proposed):** Gen-1 cannot carry every service connection at once, so the distribution panel becomes a choice:
  which levels get power, which doors and lifts work, and where things wake. With the tribes, it becomes a political lever: grow
  lights for the plants or heat for the flesh.

### Repair kits (agreed)

General-purpose, like System Shock 2's upgrade modules: one kit fixes one significant thing, so spending it is a real decision
between unlike options.

- **Repairables:** backup sets, lifts and platforms, ladder sections, broken doors into new areas, service connections, pumps, the
  hoist.
- **Fewer kits than repairables**, so each player builds a different route.
- **Every way of spending must still finish:** alternative routes, or one guaranteed late kit. The checker proves it.

**Example (agreed): the survivors' cut.** The first kit decision. One kit mends the service connection the survivors cut (§8),
which relights their wing and, with it, the Security elevator: the stairs Security ought to have, made a lift, down to the
main level's shaft station. There is no ladderway down the main shaft from Security, so the kit buys the quick way down; the
long way is ladderway B, through Cargo, last. The elevator is not a repairable of its own; it is what the mended feed buys. The
same kit could have mended Cargo's platforms (and whatever they lead to) or a backup set. Security can be finished without it.

### Obstacles we can build with

- **Doors and locks,** above.
- **Vertical:** stairs; ladderways broken or gated; platforms needing power; the hoist needing Gen-1; dives limited by air.
- **Body:** air underwater (the rebreather extends it), battery life, noise from running, crouching under low gaps, **fall damage**
  (one-way drops: you can get down, not back up).
- **Monsters as locks:** grabbers and vines hold doorways; worms back away from light, so a lantern clears a tunnel; swimmers are
  drawn to the lantern; bloats plug corridors; the thresher charges blind in the dark; husks hunt by sight and sound.
- **Infested routes:** a stairwell held by one strong enemy, or full of eggs and skitters, or overgrown. Give each a second answer
  besides combat: light, a lure, another way round.
- **Proposed additions:** doors barred from one side (shortcuts you open from the far side); draining the sump (deep becomes wading,
  the cave pool falls; a whole level changes state); Gen-1 capacity.

### Mutation and the drugs (shelved)

Set aside, not decided against. The product line will probably be in the game in some form, but not necessarily as the player's
upgrades; and whether the player mutates at all, and what it changes, is open with the rest of who you are (§3).

- *Shelved idea:* the drugs as upgrades and infection in one item (painkiller: slow healing, no pain feedback; stimulant: speed;
  rave tablet: you see what is hidden, and things that are not there), every dose adding mutagen, mutation as a stat the player
  raises; it would change how the green and the flesh treat you.

### Factions (proposed)

- **Territory** per tribe; **favour** with each leader; a **truce** state in which rank and file ignore you inside their leader's
  territory.
- **Diegetic contact, no dialogue system:** notes, terminals, intercoms, a voice through a door. Proposed: the plants reach you
  through Holt's terminal in the tissue lab; the flesh through the Commons PA.
- **Political levers that already exist in the station:** the distribution panel (Gen-1 routing), the sump pumps, the generator hall,
  the surface lift, and the water (below).

### Time and sleep (agreed)

- **Time passes when you sleep, or wait.** Sleep in a safe room: you heal, the game saves, and the world moves on (things
  grow, rounds change, the sleepless go a stage further: §10). Awake, time runs in real time, agonisingly slowly; waiting on
  purpose is the same clock run faster. Deterministic and legible: the world changes overnight, and you chose the night.
- **Drinking** is a small heal at a tap or fountain. Not a survival meter: its only real question is what is in the water.
- **Dale's graft costs you sleep.** A few nights you cannot use a bed (no rest, no healing by it), with his line's symptoms
  (a microsleep as a half-second blackout, things at the edge of sight); then immunity, and the sleepless keep off your smell.

### The water (agreed)

- **Why it is clean on day one.** The mutagen came out of the aquifer core (§10), and the company knows exactly what is in its
  source water, because it harvests it. So the treatment plant is the most serious protection on the station: filtration, UV,
  chlorine, sealed and automatic, run by the people with most to lose. Not a defence against an outbreak (§4, *Nothing was built
  for this*): ordinary treatment against a contaminant they knew. That is why a shower grafted nobody.
- **Where you dose it.** Upstream of treatment, anything put in is killed. Downstream (the clean tanks, the distribution) it is
  not. Getting there is a break-in, a strategic point, not a pump to mend; and once it is open, it is open to others too.
- **What goes in: a choice in the manner of New Vegas's Helios One.** Not whether the mutants reach the surface: they do; that
  is canon. What goes in the water decides who they are when they do: whose line the next generation grows from. Nothing; or
  one line or several: Pia, Dale (his eldest, he would ask, for the milder dose), and in principle anyone whose tissue you
  carry; or **you**, which makes you the station's mother stock (the grower's term for the plant cuttings are taken from:
  any sex), your line plugged into whatever takes the world. A selfish play, and probably not only yours to think of.
- **Small effects, stacking.** It changes the developmental story, not the plot, the ending or the mechanics. What shows: the
  fluid-colour tells (§10, *Tells*) in what changes afterwards, mixed by what went in; a little in how lines treat you; the
  epilogue's account of the world; perhaps the water's own colour. Each ingredient has one plain contribution, so any mixture
  is readable.
- **Open:** how tissue is carried (a sample kit, an offered wrist, cut from the dead); whether wastewater is the other way in
  (everything flushed goes toward the sump, the green's side); whether Holt's raw water belongs in the list at all (it would make
  everyone more plainly plant, and changes little else).

### Endings (proposed)

1. **Surface lift:** the proper exit. Gen-1 and a credential (the surface pass or the director's key); what else, if anything, is
   open (§6, question 10).
2. **Exhaust shaft:** climb out past the fans. They must be stopped, which means power *off*: the inverse of the first.
3. **The spring crack:** widened, through the heart of the green.
4. **Staying:** take fully and become part of the station. An ending, not a death.

Each tribe's cause adds variants: who you carry out, what you leave in charge, whether the mutagen reaches the surface.

---

## 5. Build order (proposed)

Each phase is playable on its own.

1. **Foundations:** the door and lock model; repair kits and repairables; an audit of existing obstacles against the obstacle rule;
   the **progression checker**: a dev tool that models items, keys, codes, power states, kits and one-way drops, searches every
   state, and reports soft-locks, unreachable items, shortest routes and the number of distinct routes, with a "reachable now"
   overlay on the dev map.
2. **Mutation and the drugs:** mutation as a player stat, the product line as consumables.
3. **Factions:** monster faction tags, hostile and truce states, leaders, diegetic contact; then the levers (Gen-1 routing, the pumps).
4. **Endings.**
5. **Level by level:** make each level its own "pass 3": a local loop that can leave a player unsure how to go on after trying most
   doors, with a thread or two into the larger game. Start with the upper station.
6. **Switch over** to the new station and retire the old one. **Done** (`engine.md` §13, step 9). Rewriting the old
   floor-numbered text is not a priority; it will be rewritten as part of the levels.

---

## 6. Open questions

1. **Who owns the facility?** Corporation, government or individual, and is there a **third pressure**: their purge protocol as a
   clock, or an ending of its own? Whoever they are, they cannot know an outbreak like this is possible, so a purge could only be a
   generic incident response (lose contact for so long, seal the shaft, send a team), not a plan for mutants.
2. **Full mutation:** death, ending, or a playable state? (Intended: the player mutates, or tries to resist it, by grafting (§10). Built later; the game must be fun without it.)
3. **Can you walk among the mutants unharmed?** If yes, faction AI is a real engine job (truce, territory). If no, the politics stay
   at arm's length, through terminals and intercoms.
4. **The mutagen's official name.**
5. **The big locks:** one or two per ending, to be decided once the endings are.
6. **Backup sets:** limited fuel? repairable?
7. **How many repair kits, and where.**
8. **Taking you rather than killing you.** Do the Security flesh (or any of the flesh) want you changed rather than dead: pinned
   down and infected, or killed and the body mutated after? Does a body need to be alive to change? For now they kill you. (The
   death screen already says "Grafted" and "Lowfield keeps what it is given", which allows either.) One answer is proposed: the
   vaccinator (§8) takes you rather than kills you, and grafts you as it would anyone.
9. **Security's ways in and out.** To be revisited as a whole. The rule for now: nothing skips Security's opening (§8, *The opening*), and
   the way into the Commons is somewhere that takes some access to reach, not a walk from the start. As built, both ways down
   are earned (the elevator wants the wing mended; ladderway B wants Operations' card and Cargo's power), and both land at the
   main level's shaft station, a walk from the Commons. Whether that landing should itself need access is part of the question.
10. **Why don't they just leave?** The scanner at the surface lift is dropped: detaining someone for a positive test is a stretch
   even here, and the mutants do not need one way out. The flesh could learn to bore through rock; Horticulture's green could
   walk out of the cave. So why stay? What their talk points at is that the mutagen (this strain, here) will either be smothered
   in the crib or spread, and to them spreading is inevitable. Candidates, none agreed:
   - **The crib.** This strain was bred under grow lights, in warm, wet, filtered air. The surface (winter, sun, drought) would
     kill it as it is. The station is where it can still change fast enough to survive up there: it stays to grow up first.
   - **The roots.** The green is tethered to something it cannot move (a mother growth in the great chamber, say), and plants
     do not walk out: they are carried, as seed and spore and down the water. It may be leaving already, slowly, through the
     spring crack (the third ending). What it wants is carriers.
   - **The lid.** The flesh need nobody up top to notice until they are too many to smother. They stay, and keep everyone else
     in, because a witness is the end of them (see the Security flesh, above).
   Crib, roots and lid together would split the tribes over you: the flesh want you kept in (you are a witness), the green want
   you to leave (you are a carrier).

---

## 7. What pass 3 got right (keep this)

The third pass was small but genuinely fun:

- There were real access problems: you could try most of the doors in an area and still not know how to go on.
- Going to the generator room was the climax.
- Sneaking past the thresher, the flailing ribcage mutant, was genuinely horrifying: open the door and see it charge in some
  direction in the dark.
- Turning the lights on and making yourself more visible was a real trade.

**Its pacing**, beat by beat, which is what each level should have in its own way:

1. **A clear loop at once.** The opening shows you a flashlight, then a dark hallway with a monster under a light. Access brings a
   new area.
2. **Rising action with a choice of risk.** Kill a spider, or brave the more dangerous upper floor, to get the fuse safely.
3. **A climax that ties power to danger.** The rib freak charging unpredictably round the generator room; turning Gen-1 on makes
   you visible to it.
4. **Release.** A new sense of mastery: the world is open and lit, the enemies are no longer so frightening, the world feels
   smaller.
5. **More than one way out.** The surface or the sump; never one solution. Leaving because the mutant let you go is a feeling of
   its own.

The aim is for every level to feel like that, while staying non-linear and open to exploration.

---

## 8. Levels

Each level's own pass 3 (§5, phase 5): its beats, its threat, and what it needs that the game does not have yet.

### Security (the upper station)

Security's own interpretation of pass 3. One loop, one climax. **Scope (proposed):** the level is Security and Ops; the Cargo
cavern is the nest, seen first through Cargo control's window and visited last, a disgusting, porous, eggy place of pustules and
cancerous growth, rather than a second level-sized area competing for attention.

#### The second pass (supersedes the overseer and its hand)

Security is the entrance to the game: slower and more exploratory than what follows, its threats legible and seen before they
land. Built from play, not from the cosmology, and married to it after. Where this and the rest of this section disagree, this
wins; the older text stays only because it describes what is built, until the level is rebuilt.

- **What goes (agreed).** The overseer, the hand, the knock and the overseer's bolts, and their names: nothing in the game is
  called the overseer or the hand again. The critical feed's reason (an overseer that could not be blinded) goes with them;
  the feed stays, for the head end and the PA (*One control room*, below). **Kept:** cameras, zones and speakers, the boards and their breakers, cards, the survivors'
  cut, the power-failure drill (now a choice: below).
- **The cameras guard places, not paces (agreed; supersedes cameras that weigh speed).** Ordinary CCTV on a lockdown
  protocol, as any facility runs it, with nobody behind the screens. Lockdown arms the restricted places: the board, the
  Armory, Operations, the wing's thresholds, wherever Security kept people out. A live camera on an armed place takes anyone
  moving in it, at any pace, as far as the light lets it see; stand stock still and it loses you, as motion detection does.
  Anywhere else a camera only records. The changed never trip one: they were staff, and from habit they still keep out of
  where they were never cleared to go. So the lesson is knowing where the lines are, and the line is the camera: one
  hangs in every armed room in plain view from each way in (no hazard paint, no ALARMED AREA: the owner's call), and its
  light is green while it watches and red while it holds you, so there is still a moment to step back out. Dark is still blind. (Built cameras weigh your speed, `SPEED` and `holdRate` in
  `sim/eyes.ts`: that goes, and an armed place takes its place. The cone, the light, the hold of about a second and a half,
  the zones and their speakers stay.) **Built,** with the wing's threshold as its corridor (the changed's own checkpoint
  post stays theirs, and on their rounds once the wing is lit): below, *Being found*.
- **Running is heard (agreed).** Speed belongs to the ears, not the cameras. Running is loud and carries; walking carries a
  little; creeping is silent. The changed hear a runner and come to look. Moving like them is still the lesson, taught by
  sound. (Your steps already carry: 9 m running, 4 walking, nothing creeping. Tuning, not a new system: left as it is
  until it is played.)
- **Answering an alarm (agreed; alarm fatigue is dropped).** A klaxon means something is loose, and every one of the changed
  that hears it hurries to the speaker, faster than its rounds, and faster again when it sees another already hurrying: one
  starts and the rest catch it. They go to the speaker, not to you, look about a while, and go back. Nothing cleverer for
  now. **Built:** alarm fatigue is out, the answer hurries again (2.6 m/s), and faster (3.4) with another in sight
  hurrying.
- **The camera wall is yours (agreed).** Cameras are for whoever looks at them, and the one who takes the seat is you. The
  operations room (the control room: *One control room*, below) is the reward: get in and take it, and its screens show every live camera on
  the level, the changed on their rounds, the night round's beam, which armed places are lit, where the vaccinator is. A
  room to plan the rest of Security from, and to come back to. A camera with no power shows black, so cutting a branch
  blinds you too. How you get in and take it is open (the door grown shut with bodies; what is grown to its screens).
  - *The station's feeds.* The wall also carries cameras from elsewhere on the station: the Commons, Horticulture, Cargo's
    bay, places you have not been. They are the level's creep, deliberately hard to make out: low light, a few frames a
    second, static, a feed that drops whenever something crosses it, a shape in one frame and not the next, a screen that is
    black until you notice it is not. Never explained on the screen; understood, if at all, when you get there. Dread, not
    danger: nothing on a station feed can reach you here.
  - *Smaller screens first (agreed).* Real buildings have one control room and a few spot monitors where a desk needs
    to see its own doors. Here, two, each a taste of the wall before the wall: the checkpoint booth (the lobby, the
    shaft's landings and the checkpoint itself) and the duty office (one screen, cycling the hall's cameras). Each
    console shows only its own area's cameras, as a booth's login would. **Built,** the booth's: sit at its desk and the
    view is the camera's, from its lens, grey and lined as a monitor's, with the feed's name and a clock; strafe for the
    next of its four (the lobby, the checkpoint, the surface landing, the shaft station); use, being hurt, or the screens
    losing their power stands you up. While you watch the world goes on, and you are not looking at it. A camera with
    no power or smashed shows no signal. The cameras see you too: from out there, all of you. **Built,** the duty
    office's too: the screen on its desk, on Ops' power from the start, shows the hall's two cameras and the four in the
    rooms off it (the electrical room, the Armory, the range, the operations stair), a sequencer stepping through them
    every five seconds; a press steps it at once. A branch you have opened is black on it. The operations room's wall
    grows from the same console.
- **One control room, wired as a real one (agreed; supersedes Security control's wall).** Every camera feeds recorders and
  a core switch, the head end, and the control room sits beside the head end on protected power. Here:
  - *The operations room is Security's control room,* the only full wall. Its nine screens are large displays, each
    split into tiles, as a modern room is: the founders' showpiece, oversized behind armoured glass over the muster hall,
    two rows of consoles for a room that usually seated one bored operator. Built to impress visitors more than to catch
    anyone; nobody was worried.
  - *The head end is in the UPS room behind it,* on the critical feed (CRIT) and its battery: the recorders, the core
    switch, the PA's amplifiers. That is the critical feed's reason now (the overseer's is gone): the security system
    itself and the PA, which is life-safety equipment, as real buildings protect them. The feed stays.
  - *The cameras are not on critical power.* Each area's cameras draw their power down their own cables from a comms
    cupboard (a network switch in a closet), and each cupboard is on its area's branch: the founders put a battery on
    the head end and none on the cupboards. So cutting a branch blinds that branch's cameras (as built), and the wall
    shows black tiles for them: it shows what has power, and nothing else. The wing's cupboard is on SEC, which is why
    the survivors' cut blinded the wing, on the wall as well as in the corridor.
  - *Spot monitors run on their own area's power:* the booth on SEC, so it wakes with the mend, when the changed start
    walking the lit wing and the lobby and there is something worth watching; the duty office on Ops, its tiles black
    for any branch you have cut.
  - *The station's feeds* come over the backbone from each area's own head end, so a feed is live only while its area
    has power: the wall's station tiles wake as the station does (Gen-1, a backup set), a quiet clock of progress.
  - *The wing's control room stops being one.* The 14 by 10 m room behind the atrium's north wall becomes the response
    team's briefing room: the plan table, a projection screen, the station's maps on the walls, chairs in rows. Still
    the survivors' last room and still behind the officer's card, as built; the 33 screens go. **Built:** the screen
    across the north wall and a projector over the aisle (lit with the wing's power), the lectern with the shift note
    on it, three rows of chairs (two knocked over), the station's plans on the walls, and the survivors' bedrolls and
    cans along the back wall.
- **The lobby (agreed).** A well-funded station, built when nobody was worried, puts its money where visitors see it
  first. The checkpoint is the small, functional part; past it, the place opens up. Prey's lobby is the model, and Alien:
  Isolation's grand rooms at twice the size each way: call it 40 by 30 m and 12 to 14 m to the ceiling, a starting figure
  to tune in the build. The tallest room in Security (the atrium gives that up; it stays the threshold). Proposed:
  - *The way in is from above.* The surface cage lands on the second floor (+5); the hoist, freight, stays at the
    ground-floor shaft station with the hazard store, so goods never crossed the lobby. Off the surface landing, a
    hallway; at its end, the checkpoint (the bag scanner, the arch, the turnstiles, the booth behind glass); through it,
    the head of a grand staircase, and the whole lobby below you at once. The descent is the dazzle.
  - *On the floor:* a statue in the middle, a lounge, a bar, all the soft furnishings a station 400 m down did not need.
    The statue is of the family that built the place for now (not called "the founder": that name belongs to the
    flesh, §10); a placeholder, to be retooled once the lore is down, likely the corporate logo or a gardening motif.
    A luminous ceiling, backlit panels made to pass for daylight, because the family wanted a sky down here.
  - *Its power:* on the wing's feed (SEC), so dark at the start. A black void overhead, the statue's face in your beam,
    the bar's bottles catching the emergency light; the survivors' half, and they raided the bar. Mending the cut lights
    it end to end, ceiling and all: the dazzle the family meant, arriving when it costs you, since a lit lobby is one the
    changed walk.
  - *It is the way out too.* The surface lift is the game's last door, so the last room you cross is the first one a
    visitor saw, and the last climb is the grand stair. Whether the surface hallway is an armed place is open (*No
    alarm on the way out*, below).
  - *Its cameras* only record: a public room is not armed. The checkpoint and the surface hallway are where the lines
    are. Its upper volume meets Security's second floor somewhere, a vent or a service walkway behind the ceiling
    panels (open).
  - *Where it goes:* north of the shaft, west of the wing, where the old checkpoint and open ground were. **Built**
    there without moving the wing: shifting it east would have moved Cargo, the exhaust shaft and ladderway B off their
    lines to the levels above and below. 38 by 24 m and 13 m tall (a little under the 40 by 30 aimed at; a strip along
    its south-east reaches the corridor's door). The grand stair is four tiles wide down the middle, rising south to a
    gallery along the south wall; the checkpoint, its booth and its line are on the second floor behind the gallery,
    and the surface landing and cage west of that, over the shaft. On the ground floor, freight comes off the hoist
    into *Goods inward*, through to the hazard store and the corridor. The bar is under the gallery's west end, the
    lounge east of the stair; the false sky is an emitting panel under the ceiling, lit with the wing's power. Its
    camera, high in the north-east corner, only records.
- **The changed (agreed).** No longer husks: the word says empty, and they are not. Pia's line (§10): **intelligent, but
  sedated.** They think, slowly, and without much caring. They notice and come to look (a breaker thrown means someone threw
  it; a door left open is noticed), they use cards (a card door is safe from them no longer, only from you), and they are slow
  enough to read: watch one and you can tell what it will do. The intelligence shows in what they do, never in surprises. No
  speech, for now. **The plant shows on them**: tobacco leaf out of the neck and shoulders in shelves, the way bracket fungus
  grows from a stump; glassy eyes. Plants growing through and out of people is the level's disgust, more than raw flesh.
  (Supersedes *drills, not instructions* and *how much wit the staff have*, below. The power-failure drill stays as something
  one of them chooses: someone goes to the board, slowly, and looks about for who threw it.)
  - *The word.* "Husk" is never said in the game (it was only ever a name in the code, which keeps it, and in the dev
    tools, which say "changed" now).
  - *Cards (built).* Security's own staff carry their cards: those that start in one of Security's alarm zones. A card
    door with power opens for one of them, the reader beeping, and shuts after, still locked to you; while it is held
    open you can slip through behind. A dark reader reads no card, and an alarm's bolt beats one. Cargo's workers carry
    none, so Cargo's still wait in their dark behind Operations' card; nor does anything on the other levels.
  - *The breaker searched for (built).* The one that goes to the board goes slowly now (1.6 m/s), and once the breaker
    is back on, it turns from the board and looks about for whoever threw it: a quarter of a minute or so about the
    board, a few metres at most, walking a spot at a time (1.2 m/s) and stopping to look round. Looking, it sees farther
    than on its rounds (18 m by the light you are in) and all round, not only the way it faces. Then back to its rounds.
  - *A door left open (built).* A door that does not shut itself (one slid open by hand with no power to it, or a heavy
    one left open by its button) and stands open when it was shut to begin with is noticed. One of the staff on its
    rounds that sees it (within 14 m, in front of it, lit, in plain view) walks over at its rounds' pace to its near
    side, looks through a moment, and shuts it, if it can: a heavy one only with power enough to move it. Only one goes
    to a door. Leave a door open behind you, and it tells them someone came through.
- **One tool per room (agreed).** Each space teaches one thing before a later one asks for all of them: the flashlight; a
  sound before a sight; the night round's beam far off; one armed place under one camera, its speaker with two of the changed
  in earshot, a safe failure (step over the line, hide, watch them come and go); a small board, and one of them walking over to throw it back on; a card;
  then the big dark section that asks for everything; then out.
- **The night round (agreed).** One of the changed still walks the night shift's round with a flashlight. Its beam is the most
  legible threat in the game, seen down a corridor long before it arrives; it smokes out the dark; and **its beam lights you
  for the cameras.** It carries a card. It is the one that tries the doors in the opening (below), so you have watched it
  kill before you meet it, and its card is the one you take.
- **The vaccinator (agreed): Security's big one.** One of Dale's eldest (§10), big and wrong in its own way, come up into
  Security because the changed there are a fresh population, ungrafted. It vaccinates everyone, and to it you are staff like
  any other. Old enough to have recovered: intelligent in one thing, which it does with ritual care; ask anything else of it
  and nothing is there.
  - *The changed flee it:* its graft is nights of torment, and they know its smell. A lit room emptying is its tell.
  - *It comes to the klaxon, and to running:* it listens for the fast, and the fast are what it is for. Run, and you are what
    it is looking for.
  - *Seen first through glass:* a guard held down, the offered wrist, and that guard restless for a while afterwards. What
    being caught means, shown without a word.
  - *Caught,* for now, you are hurt badly. The graft waits for the player grafting (§10).
- **Power is on or off (agreed).** For clarity, a thing has power or it does not: the generator's dim backup light, and
  later single appliances broken, powered or not. Nothing in between that the mechanics depend on.
- **Flickering lights: a horror trope, not a system (agreed).** Used for tension early, while you are weak, scared and new to
  the place: a failing tube in a corridor, a room that stutters. Dressing over the power rule, never a state you have to
  read. (Built: a room's `flick`.) The formal flicker hall (lights in banks, each its own breaker and state) is dropped, and
  with it the figures that moved only in the dark.
- **The big dark section (agreed).** What the flicker hall was for, simply: a larger section of Security, dark, that the night
  round's beam sweeps through. Wider than the muster hall today (by a quarter to a half), so you see further and the beam
  carries.
- **Call points (agreed).** Break-glass call points, as in any building: sound a zone yourself, to pull the changed off a door
  or out of a room. (The vaccinator comes to it too.) **Built:** below, *Being found*.
- **Lockdown (agreed),** in place of the bolts: an alarm seals that zone's powered doors, heard and seen (the bolts, the red
  lights). Protocol, no hand on a board. **Built:** below, *Being found*.
- **Load on the backup set (agreed, provisional).** Too many branches on and everything browns out, Gen-1's capacity (§4)
  taught small. Kept for now because it is interesting; it may go.
- **No alarm on the way out (agreed).** Leaving the level is not where the alarm is: the Security elevator rings no chime that
  calls anything.
- **The mass: not Security's (moved).** A room grown shut on something you never see whole belongs wherever Pia's people have
  been longest, the Commons likely; Security is just an area of the game. The operations room needs a new answer (open).
- **Threats, in rising order:** the night round (light), the cameras (place), the vaccinator (light and speed, and a purpose). Skitters
  and eggs go back to Cargo's nest: four kinds of threat on the first level is one too many.

**The opening (agreed).** Replaces beats 1 and 2 below, and the dark start: starting in pitch black asks for fear before the
game has shown you anything to fear. It is SS2's window: see it first, from safety, then the calm, then the game opens.

1. **Waking.** The first sound is your IV pump's empty-bag alarm. The suite has power, on its night setting: low, warm pools.
   You are weak (open: whether the first minute is unsteady). Time has passed, and shows: the dated label on the empty bag,
   the dead plants, dust, the nurses' station whiteboard with sedation orders weeks old. The intercom: static.
2. **The other patient.** Across the common area, behind their own window: awake for days (their bag ran out first), tally
   marks on their wall, no food, banging on the glass. They see you wake.
3. **The night round comes,** brought by the banging (noise draws them, taught before a step). Seen from pool to pool: an
   outline, and pieces of it, the leaf at a shoulder as it passes under a lamp. The night setting keeps the look partial.
4. **It tries the doors** with its card: each reader beeps, red. The other patient's goes green. You see the start; they are
   pulled out of sight of the window, or a blind comes down; the rest is heard.
5. **It tries yours:** red, twice. Yours is under a medical hold, which wants a doctor's override no guard's card carries. If
   it saw you, it stays and looks in, its face at your glass lit by your own room: the one clear look, and the scare. Down below
   the window, or in the washroom, and it does not see you: the first lesson in hiding, taught while you can do nothing else.
   Then it goes.
6. **The release.** A minute on, the power dies: the last survivors cut the wing's feed to blind the cameras with this thing
   loose. The isolation doors are fail-safe and let go. Emergency light only, dim, not black. Later, a note: *we cut it the
   moment it came through holding. We forgot the suite was fail-safe.*

The scene starts when you first look out of the window (a timer behind it), and is kept short. **This moves the cut** from long
before the game to its first minutes: the survivors die on the far side of it, some of them just now (the one by the cut has
the cutters still in hand, and the blood is fresh). The flashlight on the guard is still the next beat, in dim light now.

**Cargo, made larger (agreed).** The best-looking place in the game, and too small for what it has to hold. An L, not an I: one
arm the bay (Pia's eggs, the nest Security tends, porous and organic), the other the warehouse; at the corner a new lift
system (a freight hoist; or, as a bigger idea, a gantry crane spanning the warehouse that you ride or move to bridge a gap,
its cab a glass lookout). Its working rooms (the backup set's, the vehicle bay) grow too, with mezzanines and glass lookouts
of their own: every lookout another chance to see something before you meet it. Kept believable: a cavern that size needs an
air-handling plant (fans the height of a room, ducts you can crawl, a plenum; where Tom's spores matter later), forklifts a
charging room, a warehouse sprinklers or a deluge system (perhaps a tool: flood a section). What else realistically belongs
should be added. Below it, production (below).

**The beats (agreed)**

1. **Opening: dark, and no flashlight.** The power goes out, and the isolation suite's doors let go (see Holding, below). The
   only light is a flashlight on the floor, still on, where a guard dropped it; you go to it, and then up, slowly, tensely, into
   the survivors' dead wing. The first fear should be a sound: something heard and not seen.
2. **The flashlight, on a body.** It opens choices: go back and see the start properly, or explore the eerily quiet rooms and the
   main hallway.
3. **The infected half.** Rooms and vents full of skitters and eggs; patrols down the hallways. The line between safe and not
   safe is clear and physical: a threshold you choose to cross (a door, a change in the colour of the light, eggs starting at a
   doorframe), not a gradient. The safe half is the part the survivors held, which is why it is quiet: they are dead. The
   threshold is the power line: their half lit and watched, yours dark and blind. Stepping into the amber is stepping into view.
4. **Climax: getting out (agreed).** The way out: the nest in Cargo and ladderway B, or the run for the Security elevator once
   the wing is mended and its cameras wake.
5. **Release: leaving.** Off the level, down.

**Power: two halves (agreed)**

- **Their half is lit.** The changed live in Ops and want to see: their side runs on the OPS backup set, with its cameras live
  from the start.
- **Your half is dead, and the survivors did it.** They cut the service connection to their own wing to blind its cameras, and
  lived and died in the dark. One of the tutorial bodies lies by the cut (below).
- **Mending it is optional.** One repair kit mends the cut: the first kit decision, now or save it for Cargo. Security can be
  finished without it, and the checker proves both routes.
- **What mending buys:** the wing relights; the Security elevator runs again (down to the main level, §4); its light and button
  doors and card readers wake. **What it costs:** the wing's cameras wake too, you are easier to see in the light, and the patrols'
  rounds now take in the wing (below). The circuit comes live on Security's board and the board sounds that zone at once, so the
  first thing the mended feed brings is someone to the cut.
- **Timing:** the game starts as the power goes out, and the isolation suite's doors, fail-safe, let go (see Holding, below). No
  battery holds them first.
- **The surface lift (proposed):** what mends it is one unique part, not a kit. Count its locks before adding any: Gen-1, a
  credential and the mend are three.

**Holding: the medical isolation suite (proposed; its light and its first minutes are superseded by *The opening*, above)**

- **What it is.** Not a prison: a well-funded lab's isolation suite, for staff who may have been exposed (and, rarely, held for
  something they did). Nice, and almost never used. You are the only one in it, living.
- **Bigger, darker, lower.** About twice today's size each way (roughly 35 by 25 m), but smaller than the atrium, which stays the
  level's big moment. Sunk a storey below the wing (the 50 m of rock between levels has room to spare; nothing else moves), with
  a wide stair up to the Security corridor.
- **More going on.** A few isolation rooms round a common area (table, sofas, a kitchenette); a nurses' or guards' station half
  a storey up, looking down over it (an echo of the Cargo overlook), which takes in today's guard post.
- **The light.** None of its own. The flashlight on the floor at the foot of the station's stair, on the guard who dropped it,
  lights itself and a little round it, and goes out when you take it. Exit signs over the stair glow green on their own
  batteries (as the code requires), a second, quieter light to follow. Nothing hunts you here.
- **Built.** A storey down (-4.5 m), under the wing's north side: a double-height hall (22 by 20 m) with a kitchenette, a
  table, a sofa before a dead screen and plants nobody watered; three isolation rooms off it, room 3 with its own washroom;
  and over the hall's south end, at the wing's level, the nurses' station, a balcony with the station's desk, which a double
  stair up the east wall climbs to, and which opens onto the Security corridor. You wake in room 1, whose door looks across
  the hall at the stair's foot: a guard face down there, his flashlight still on beside him, and an exit sign. A patient lies
  in room 2. The old cells and guard post are gone. The suite and the station are refuges, and dark with the wing; mended,
  they light amber like the rest of it.

**The layout (proposed)**

- **A highway.** The spine (Security corridor, Operations corridor, Cargo link) is the level's one orienting hall, Castlevania
  style: a long stretch, then a single landmark. In the dark it shows only as far as your beam, which hides the size of the place;
  mending the cut lights it end to end, so the release beat's "the world feels smaller" is seen, not told.
- **The bend is the landmark, and the threshold.** A 90° turn into a two-storey atrium where the dark half meets the lit one. Its
  stair climbs to a gallery round the atrium, which branches off into the second floor rather than shadowing the highway. (A round
  room with a structure in the middle is the alternative; it waits on curved built walls.) A well-funded facility can afford it.
- **The muster hall (agreed; built).** The second leg leaves the atrium south and opens into the hall where the response team
  drilled. It has to be crossed, and crossed back: the deputy director's card (Cargo's) is at its far, west end, under the
  operations room's glass. Flat, long and lit, about 58 by 24 m: a
  promenade round a sunken court, mall-like rather than industrial. The court is 1.25 m down, with steps the length of both
  long sides (the team sat on them for the muster) and glass balustrades at the ends; the ceiling over it lifts from 4.5 m to
  8.5, the drill clock hanging in the middle, and the operations room looks down on it. The lobby is now the tallest space (*The second pass*). Pillars, crowd barriers, benches
  and shield racks break the sight lines. Every room off it has a door, and how far apart the doors are is how hard the crossing is: the electrical room at the west end, the locker room and
  the Armory on the north side, the range, the duty office (a window on the hall) and the operations stair on the south,
  Maintenance at the east end.
- **The operations room, behind glass (agreed; built).** Control rooms overlook what they run, as Cargo control does the bay.
  The operations room is on the second floor, over the hall's south side, its north wall eight panes of armoured glass onto
  the court: every crossing is under it. From the hall you see into it, lit by its room's emergency light and by a sick glow
  that needs no power; what is left of its staff are grown to its screens. (Its new answer: the camera wall, *The second pass*.) Its stair climbs from the east bays to a landing where the door is grown shut with bodies:
  no way in on the first pass. A way in comes later, once there are other places worth going first; the level should become
  non-linear then, not now. Eggs and a floor dragged red thicken toward the stair.
- **The electrical room's board (agreed; built).** Not a room for one switch: a panel board breaking Ops' feed out to
  branches, side by side, each a trade. *Muster hall west* (HALL): the hall's lights west of the east bays, the court and its four
  cameras; cut, the hall goes black, its eyes with it, and its husks go looking for light. *Muster hall east* (EAST):
  their lights, the operations stair and their two cameras. A third way is spare. A lamp over the cabinet shows each live.
  Cutting a branch blinds the cameras on it.
- **Critical operations power (agreed; built).** As in real buildings, the room that runs security is not on a general
  board: its power is protected, its panel and battery backup in a locked room inside its own perimeter. The operations room
  (its screens, its board, its lights) and Security's PA are on their own critical feed (CRIT) straight off Ops' set, panelled
  in the UPS room behind the operations room. The electrical room's schedule says so, in red. So no zone can be silenced
  but by smashing its speaker. (Its first reason, an overseer that could not be blinded, is gone; it stays for the head end and
  the PA: *One control room*, *The second pass*.) A seed for later: control rooms sit on raised floors,
  a cable void under the tiles; a crawl from a service hatch up into the UPS room would be a believable way in that is not
  through the bodies at its door. This is the pattern for power elsewhere (proposed): a board
  per area, a few labelled breakers that each feed a handful of rooms, never a switch per room. A switch per room would be
  a switch for the threat, and real buildings are wired by panel, not by room. Doors stay safe to cut: exits let go without
  power, and readers keep their lock only against coming in.
- **Rooms built to the new standard (agreed).** Wider, longer, taller, with a landmark or a flourish; no utilitarian boxes.
  The range is 28 m of lanes, not a closet. The checkpoint: everyone off the surface came through it (the bag scanner, the
  arch, turnstiles, a booth behind glass), on the second floor before the lobby's stair (*The second pass*). The wing's row of doors is broken by the locker room, the survivors' back way into
  the hall. The briefing room is a vestibule (the plan table, a window on the corridor) opening into a 14 by 10 m room
  behind the atrium's north wall: a projection screen, the lectern, chairs in rows (*One control room*, *The second
  pass*). The infirmary is
  a 16 by 8 m ward of four curtained beds, with a treatment bay behind glass and a chair pulled up to the last bed. The hazard
  store moves off the checkpoint, where things came off the hoist (same gate: Gen-1). Still to do: the wing's corridor could
  widen where its rooms branch off (a trunk, not a straight pipe).
- **A second floor over Security**, at about +5, the height of Cargo's Tier 1, reaching east to the cavern.
- **A window onto the bay.** A glass wall high on the cavern's west side: the nest seen in person, from above, before you go.
  The bay is black until its backup set runs, so the nest must give off its own sick glow, and it should sit nearer the window
  than the cavern's far end (about 120 m today). The glass works both ways: the bay can see you. A view only, not a door; at
  Tier 1's height a door would skip the platforms. A shortcut, if any, is a door barred from the bay side.

**Being found (as built; the changed's wit is *The second pass*, to come)**

- **Cameras → the zone alarm → any patrol in earshot.** The klaxon starting is the tell, and you have a few seconds to answer
  it: leave the zone, break its speaker or the camera (loud: a cost, per §4), or cut the power. **Built** (`sim/eyes.ts`),
  with nobody behind the screens. Lockdown arms six rooms: the wing's corridor, the electrical room, the Armory, the
  range, the operations stair and the chief of security's office. Each has a camera inside that guards it; the other
  three (the atrium's threshold, high in the court's ceiling, the east bays' north-east corner) only record, and have
  no light. A guard sees along its cone as far as the light you are in lets it, as the cast do, so in a dark armed room
  it sees you only near it, unless your flashlight is on. It takes you moving in its room at any pace: its light turns
  from green to red with a servo's whir, and held about a second and a half, you sound its zone. Stand still in its view
  and it lets go a little at a time (it forgets a full hold in about three seconds); step out of its view or out of the
  room and it lets go at once. It sounds once for a sighting, and keeps the zone sounding while it still sees you
  moving; to sound it again it must have let you go. The way in is not marked; its camera is seen from it (tested).
  The speaker's beacon turns and the klaxon goes round
  for twelve seconds; each time it goes round, any of the changed that hears it and is not already after you leaves its
  rounds or its post and hurries to the speaker (2.6 m/s; 3.4 with another in sight hurrying too), not to you. There
  one stands and looks about a while, then goes back to its rounds; it finds you only if it sees or hears you on the
  way. Their rounds never take in an armed room. A camera can be
  smashed with something in your hand: loud. So can a zone's speaker, and that zone has no voice: seen there, no klaxon
  sounds and no husk hears it or comes.
  Speakers are wired from the PA, not from the rooms they hang in, and the PA is critical power: no breaker quiets a zone.
  The wing's and the muster hall's hang in a ceiling you can reach; the atrium's hangs high in the well, in reach only leaning
  out from the east gallery's rail. Four zones: the wing, the atrium, the muster hall's west end ('muster'), and Operations
  ('ops': the Operations corridor and the hall's east bays, its speaker in the corridor). The guards: the wing corridor's
  looks down it from the checkpoint end, dead until the cut is mended; the electrical room's, the Armory's and the
  range's are on the hall's breaker (HALL) and sound the muster hall; the operations stair's (on EAST) and the chief's
  office's (on Ops' bus) sound Operations. Mending the wing sounds it (its circuit comes live on the board).
- **Lockdown.** Every room in Security belongs to one of the four zones (the hall's east bays are Operations'), and a door
  to the zones of the rooms either side of it. Each time a zone's klaxon goes round, every door in the zone with power to
  move is bolted: you hear the bolt drawn for about a second before it goes home, time to get through, and a red lamp
  over the door flashes, then holds. A bolted door opens for nothing, you or the changed, and says so; it holds while the
  alarm sounds and lets go when it stops. A door without power cannot be bolted, and one that loses its power lets its
  bolt go: exits fail safe. So a light door on a branch you can open is a way out of a lockdown, a heavy door the backup
  set cannot move is never bolted, and the dead wing's doors stay as they are until the cut is mended (when the wing
  sounds at once, and bolts slam down its length). Taken by the electrical room's camera, you are bolted in with it
  until the alarm dies.
- **Call points.** One a zone, red, at shoulder height by the zone's way out: the wing's in its corridor by the
  checkpoint, the atrium's by the way south, the hall's at its west end by the electrical room and the range,
  Operations' in its corridor by the speaker. Break the glass with your thumb (a little noise) and the zone sounds as if
  a camera had you: the klaxon, the changed hurrying to the speaker, the lockdown. Once each: the glass stays broken.
  Wired to the zone's PA, so the dead wing's still sounds, and a zone whose speaker is smashed has no voice here either.
- **Why they come: drills, not instructions.** The changed were Security's staff. For years a zone alarm meant "respond there",
  and what is left of them still does. It is conditioning, not command.
- **Patrols → their own senses.** Sight, light and sound, as everywhere else. They come to an alarm they can hear, not to you.
- **Patrols walk lit rooms only (agreed: every husk, everywhere).** Husks hunt by sight, so they keep their rounds where they
  can see, and go to the light if they can. That is why the dead wing is quiet, and why mending the cut brings them into it
  with no orders at all: lit, it is theirs to walk. One standing in the dark makes for the nearest light it can reach; with
  none it can reach, it keeps still (Cargo's husks wait in the dark: the only light is behind Operations' card). Cutting the
  power strands them. A husk on a post in the dark is a deliberate exception, and the more frightening for it. **Built.**
  Note: on the main level before Gen-1 the only light is Horticulture's backup set, so the Commons' roaming husks drift
  toward the green's territory (open: whether something should keep them out).
- **The power-failure drill (agreed; built).** The staff were drilled for a dead circuit as for an alarm. When you open a
  breaker, each of the staff it leaves in the dark has a fair chance (a quarter) to go at once to the board and throw it back
  on, so a crowd nearly always sends someone and one alone may not. Any other still in the dark later may go, the odds
  climbing until, three minutes on, it surely would (between 30 s and 180 s, most of them late). One who reaches the light
  has stopped noticing; posts keep their posts. You hear it go back on. A cut cable is another thing: no one mends a cut cable by habit. That is why the
  survivors cut the wing's feed with bolt cutters instead of throwing its switch: the staff kept throwing it back.
- **How much wit the staff have (agreed).** Habit and a hand. They keep rounds where they can see, answer an alarm by going
  to its speaker, go to the board when the lights go, slide a door, throw a switch. They do not reason: they do not hunt
  whoever cut the power, cannot use a card or a code, cannot cut or mend a cable, and forget what they were doing once they
  are back in the light. Anything new they do should be a drill they once had, not a thought.
- **Power is the trade.** Security needs power for things you want (card readers, the Cargo platforms, the fan door on ladderway
  B), but power wakes the cameras. Switching on is what makes you visible: the same bargain as Gen-1 and the rib freak, in another
  shape.

Every threat should be seen or heard before it lands (a camera's light, the klaxon), and have an answer.

**The survivors are the tutorial (proposed).** Each body on an escape route was stopped by one particular thing: one at a card
reader with no card, one at a heavy door with no power, one under a camera, one by the cut with the cutters still in hand, one
who stayed in Holding and gave up. Each teaches an obstacle before you meet it, without a word; the body with the flashlight is
the first. No survivor's body is only dressing. (The officer at the checkpoint already reads this way: "Whatever opened him did
it from behind." So does Reyes, a step short of the electrical room in the muster hall.)

**The way out (proposed).** The surface lift needs more than Gen-1: it was damaged, and needs mending (one unique part, not a
kit; see Power, above): that is why you are kept in. The other ways
down: the Security elevator once the wing is mended, and ladderway B once Cargo has power. There is no ladderway A from
Security: the main shaft carries only the hoist (Gen-1) and the surface cage.

**Built so far.** The wing is a branch circuit (SEC) off Ops, cut at the start, with its splice panel near the
threshold and the guard who cut it; a kit in Maintenance, on Ops' side, mends it (the hazard store's stays behind Gen-1).
Mended, the wing lights amber, the briefing room's reader wakes, and the Security elevator runs, down to the main level's
shaft station and back (ladderway A is gone). The highway runs east from the lobby
through the dark wing and opens without a door into the atrium; the second leg runs south past the offices into the muster
hall, with Maintenance (the Ops backup set) off its east end and the operations room over its south side, behind glass. The gallery climbs the core's east side to +5 and branches east to
Cargo control, whose east wall is the window: three bays of glass over the bay. Cargo is behind Operations' card (the deputy director, at
the far end), so it comes last. The Armory's and the hazard store's heavy doors run off Ops' bus, so they wait on Gen-1
whether or not the wing is mended.

**What the game needs for it**

- **New:** nothing for now. (Cameras, the zone alarm and its speakers, the operations room behind glass, the window's glass and
  the sunken court are built: above.)
- **Content:** done. The window is three bays of glass in Cargo control's east wall (`DoorDef.glass`: a sealed pane that stops
  bodies and lets sight through). In the dark the bay is black but for the nest's own glow: pustules among the eggs on the
  rungs, and its edge, creeping west over the floor below the window toward the door, a sick red.
- **Already there:** patrols (the cast keep rounds), vents (loose panels; crawling under), grabbing and dragging (a start for the
  hand), caves of any outline (for the nest's organic shapes), backup sets and the power rules, the progression checker (to prove
  the level, and every way of spending power in it, can still be finished).
- **For the second pass** (above): cameras that guard armed places; running heard; the alarm answered in a hurry; the
  camera wall; the changed made intelligent (investigating, using cards);
  the night round and its beam; the vaccinator; call points and lockdown; load on the backup set; the big dark section; the
  opening (the pump, the other patient, the card at each door, the medical hold); Cargo as an L. To be put in order before any of it is built.

### Production (agreed)

The station grows the crop (Horticulture) and ships it (Cargo), and had nothing between: a real operation needs a production
floor. Drying, **curing**, the extraction labs, the packing line.

- **Where.** A deck under Cargo, reached by the freight lift: the goods come up from it into the warehouse arm, and up from
  Cargo to the surface, so the flow reads right. Below rather than beside, so Cargo itself has room to grow, so the freight
  shaft is a hole between the two levels (a lookout down it before you go), and so an elder is not met on the first level:
  you see his children's work in the warehouse, and hear of him, first.
- **Dale's seat: the curing hall.** Hot and humid, cured leaf hanging in racks all round him that read like his own shelves.
  He sits in a **casing vat** (casing: the sugars and flavourings real leaf is dipped in), industrial equipment where the tub
  was, so the tub belongs to the room and not to a bathroom.
- **What he wants.** He knows the stimulant line kills, and that one sleepless reaching the surface (or one of his own line
  hungry for more, which he would never say aloud) would be a catastrophe. He grafts no one himself; his eldest go out and
  vaccinate by hand (the vaccinator, §8), which is slow, and they are few. What he wants of you is his eldest's dose in the
  clean water (§4, *The water*). Once it is there, he is nearly done: what is left is to kill or wait out the sleepless.
- **His story** is the village (§10): the energetics born in his blackouts, spread while he was not himself, and he barely
  remembers them. The guilt is why he inoculates.
- **The sleepless here:** chaos, not order (§10, *The sleepless*).

---

## 9. Immersion (brainstorm; for reference)

**Not decided.** A brainstorming session, kept so later passes can come back to it. Nothing here is agreed or even proposed in
the sense above; the notes on each idea record how it was received ("liked", "questionable"), not a commitment. Promote an
idea to §4 or §8, with a status, when it is taken up.

The question was what a sense of place is built from that is easy to overlook: the floor you stand on, not the furniture. Already
in hand before it, and not repeated here: real air currents with visible particles, a flashlight that moves like a held one,
physics objects, mass and physics as the ground of combat and damage, the owning family and its princelings, water and the
sumps, generators and service connections. Already built (`engine.md` §11): rooms that echo by their size, the station settling
and ticking, doors breathing out dust, footprints, footsteps by material, and an eye that adapts to the dark.

### The body (liked; the most important)

**Built, a first pass** (`engine.md` §11, *Your body*): the body under the eye, its shadow from a flashlight lying on and
from the fittings over you. Not yet: the cast's shadows from fittings, a swimming pose, the shadow as a tell.

- **Render your whole body in first person**, so a light throws your shadow. You cannot see yourself yet.
- **Your own beam barely shows it.** The flashlight is at your hand, so your shadow falls behind you. You see it by other
  lights: fittings, a flashlight lying about, a lantern. That is the better half: your shadow tells you where the other lights
  are.
- **Engine cost.** A light lying about already has a shadow map (`render/beams.ts`, the two nearest), so the body can join
  those cheaply. The light field is worked out once per level from fixed geometry, so nothing that moves throws a shadow from
  a fitting today: that wants something new (shadow maps for the nearest few fittings, or capsule shadows). Whichever it is,
  the cast should throw them too: a husk's shadow round a corner before the husk is the payoff.
- **Shadow as a tell (open).** Your shadow in a doorway gives you away. Shown to the player first; whether the cast see it is
  a later call, and hard to make fair.
- **Practicalities.** The head is hidden from the camera but kept in the shadow pass; feet land in step with the footstep
  sounds; poses for crouching, ladders and swimming. Rough blocks are fine: the cast are boxes and blobs for now.

### Senses of place

- **Heat (liked).** Rock warms with depth, machines throw heat, a dead room drifts to the rock's temperature. Seen as breath
  in the beam, condensation on cold pipes, shimmer over the generator hall. The flesh want heat (§2), so a temperature field
  maps their want. Mostly presentation, with a hook or two (where the flesh gather).
- **Vibration (liked).** Gen-1 felt as a faint tremor in the view, puddles that ripple, the thresher's footfalls arriving
  before its sound. Sound says what is near; vibration says what is heavy.
- **Depth markers (liked).** Painted on the shafts ("−412 m"). With them, photoluminescent egress strips that keep glowing after
  the power dies and fade over hours (real ones do; a quiet clock), and cold air down the intake shaft, sometimes with snow in
  it: the only sign of a season, and of a surface at all.
- **Pressure.** Ventilation doors heavy to open against the fans and slamming shut on their own, gaps that whistle, ears
  popping in the lifts, one door changing the draught somewhere else. The air currents' other half; a door that is not a lock.
- **Your own body's noise.** Breath that comes harder after running, and is a noise the cast hear; holding it to hide, for a
  while; a gunshot in a small concrete room leaving you half-deaf for a few seconds.
- **Dark adaptation (questionable; may still go in).** The eye already adapts (`uExpo`), on the screen only. The rest is
  tuning: slow enough to matter, so a bright tube costs you your night eyes, and perhaps a short glare from looking into a
  light. Smaller than it sounds.

### Making the existing systems pay

- **The station's clock (liked; will be used).** The facility keeps time: messages, chimes and routine announcements from the
  speakers on a schedule, timers, sump pumps cycling on their float switches, Horticulture's irrigation. The building's routine
  going on without its people. It suits Security's staff, who answer alarms from habit (§8).
- **Scent on the air.** The cast smell you downwind, so the ventilation is played, not only seen.
- **Brownouts.** A big motor starting (a pump) dips every light on its network: power reads as one system, and something
  else switching on is heard and seen.
- **Mass in the hands.** What you carry slows you and makes you heavier and louder underfoot; valves, cranks, hoists and
  levers worked by hand.
- **Bad air (questionable).** Dead ends without ventilation gather CO₂ or methane; a flame shows the draught (it leans), goes
  blue, or goes out. A reason to want the fans on and a tool that shows the invisible. If it goes in at all: once, in one
  place, with a clear tell.

### Fuel (open; possibly the thing we need)

Limited fuel for the backup sets (the open question in §4, Power, and §6, question 6) may be the McGuffin: a resource that
ties the generators together and answers questions not yet faced.

- **It is mass.** A jerrycan is carried, sloshes, slows you and makes you louder.
- **It links every generator** to one choice: which set runs, for how long.
- **It is political.** The flesh want energy (§2); fuel is something to bargain with.
- **The catch.** Fuel beside repair kits is two spendable currencies doing similar work. Either their jobs differ plainly (kits
  mend once; fuel keeps things running) or one replaces the other. Count it in cans, not litres, so the progression checker can
  still search every state.

### Left out

Hunger and thirst, sanity meters, anything that is upkeep rather than sensation.

---

## 10. The lineage (proposed)

The mutants as one family. Where this and §2 disagree, this is the newer thinking; §2 is to be reconciled with it as the
levels are built. None of it has to reach the player: the game plays without it, and rewards anyone who looks (see *Tells*).

### The mutagen is a graft

- **A living tissue, not a chemical.** The tissue Horticulture took from the aquifer core is the mutagen. Infection is a
  graft: the host is the **rootstock**, the tissue the **scion**, and the notes already talk this way ("a cultivar that takes
  badly"). Every mutant is a cutting of the same source, so a tribe is a family, and how related two mutants are is how many
  grafts apart they are.
- **It keeps you changing, not alive.** It cannot raise the dead or stop a bleed, and it slows without new grafts. Things die
  when they are killed. New grafts are the only way to speed up, which is a reason to infect.
- **The plant.** Every green form is wild tobacco, *Nicotiana rustica*, mutated its own way: Pia took its stalk, leaves and
  flowers and grew into a tree; Dale wears its leaves, in shelves, the colour of nicotine; Holt breeds the whole plant for
  structure. Not every line shows the plant: Ines shows none. The rest are to be worked out the same way: which part of the plant, and what it became.
- **The people.** Lowfield is in a country with some racial diversity, and its staff reflect it. "Skin" in these notes means
  any human skin tone, and a mutant keeps its host's: an elder's children differ in skin as in build, because each grew on its
  own body.
- **Almost nothing looks human.** By the time of the game nearly every mutant is far from the person it was; one that still
  looks human is in the first stages of change, and those are rare.
- **Generations.** The crop is generation 1; the elders, who took it from the crop, are 2; their children 3, and so on.

### The rules

1. **Strain, rootstock, habit.** You inherit your grafter's strain as it was on the day you were grafted, grown on your own body,
   and your body grows whatever you do (the overseer watched screens and grew one great eye).
2. **Time alone makes a strain.** Change without passing it on and you drift from your parent; change beside someone and you
   drift together. The elders are whoever changed longest alone.
3. **Every organ makes a problem, and the body grows a way round it.** A mutant flooded with its own drug evolves a tolerance
   or a bypass, not a stupor. The **crisis** is the time that takes, and it leaves scars the solution keeps.
4. **Young tissue carries the drug; old tissue carries the cure.** A graft from an elder still in crisis passes on the organ
   without the way round it; one from an elder past it passes on the way round. The same graft cures the sick and infects the
   clean. Children grafted during a parent's crisis are the dangerous ones.
5. **You age into your solution.** Solutions that need stillness go to plant; those that need action go to flesh. Elders are
   big, each in its own silhouette (tall, wide, heavy, rooted, coiled); an elder who is not big has a reason.
6. **An idea in the parent is an instinct in the child.** Effects dull with each generation; instincts do not.
7. **Mutation keeps what the human had.** A mutant that came from a person still sleeps, eats and breathes; the new
   organs are added to the old ones, not swapped for them. So every mutant can be kept awake, and Dale's stimulant is a danger to
   all of them, not only to people.
8. **Kin by smell; a mind only in one body.** Mutants know kin by smell, and elders are the strongest source of the smell their
   line knows as home, which is why they are fed and grow huge. A shared mind needs shared tissue: fused bodies (the overseer,
   the hand) and Holt's one root system. Everything else talks by smell, sound and touch.

### The village

The testers lived in a large isolation room in Horticulture: a small village built to hold six people for as long as a trial
ran, and, in the worst case, through sickness or death. They were encouraged to repeat the same dose, for consistent reports.
Nobody expected worse than a bad night.

### The elders

- **Maren Holt (director of research).** Raw tissue from the beds, through a burn on her hand. Her way round is care: she grafts
  the plants onto herself slowly, choosing each one, and shapes herself with them, and she has never stopped. She is the green
  god, and she is a level: Horticulture (to be rebuilt much larger) is colonised by her, and the cave under it, larger again
  and open to explore, is her body entire, the leaf on the floor, the cane standing, what hangs from the roof, what is trained
  up the walls, all one plant on one root. Her face is in it somewhere, a person's size, eyes closed, the colour of the rest:
  a dot in an ocean. She pushes the crop the way farmers pushed wild corn into maize: leaves big enough to roof a room, stalks
  strong enough to build with. Her line is the only one that is bred, not born, and her root system is the station's one true
  hivemind (she feels footsteps on soil, not on stone). Above her kin because every other elder can only make more of
  itself, and Holt can make something new; and the only one who plans by growing. *Children:* her cultivars (leaf giants,
  cane, espalier screens, heliotropes that turn to follow a light, stranglers, seed-throwers), and in the cave her hunters:
  one generation of plant-like, motile predators grafted from parts of her, the least human things on the station (cane for
  legs, a body of folded leaf, a pod for a head that splits open). Among her stand massive sunflowers, leaning on heavy
  stalks, too heavy to hold their heads up to the light, each ringed by small ones; and Pia's tobacco flowers come out of
  the rock and up out of the floor: something of her, without words. *Open:* her tell, and how she can be hurt. *Inside:* Tom is
  her longest bet, and Sam carries her light.
- **Pia Lind (painkiller).** The stupor: glassy eyes, pupils pinned whatever the light, pustules, numb to pain and to
  everything, her metabolism slowed to a crawl. She does not fight it; she slows into something stationary and survives as
  that. **You meet her as the tree, or nearly:** the Commons tree, a rustica grown to about 13 m, risen out of a planter and through the floor,
  its roots spread far across the court. The stalk has thickened to a ridged trunk, still in leaf, in flower and setting seed,
  and past the flowers it keeps going, narrowing to a point that runs on up through the roof of the Commons: no tobacco does
  that. The swollen foot of the stalk was her body; her face is a smear in the wood, hollows you could walk past. She cannot
  speak. A living god to both tribes: the flesh tolerate a plant because it is their mother, and tap her for milk. *Spreads:*
  early, by a touch in her stupor, with an ordinary arm (nothing about the arm is special; it is only what she touched people
  with); late, by a cutting from the tree laid on you. What the Commons carry is that early snapshot of her, the flesh and the
  opiate, not the tree. Grafting her takes the edge off, and you lose something you do not miss. *Children:* early, the dazed,
  husk-like; mid, half stalk and half flesh, Pia caught mid-change; late, sessile, quietly euphoric, still feeling. Old Pias grow
  faster as they age, so the tree is a clock. *Tell:* milky sap.
- **Ines Calder (hallucinogen).** She never stops seeing. Her brain grows until it can carry the visions without believing
  them, and what is left is lucid and finds patterns in everything. Very tall (about 7 m), lanky, with a big head: the growth
  went to the head and to what perceives. Human and fleshy, in her own skin, and reads as an ordinary mutant: no plant shows on her at
  all. She paints great walls and cannot
  stop. She painted as a hobby, before, and her scenes mean something: they come from her life before, and see ahead.
  *Spreads:* wet paint, and slivers she cuts from herself. *Children:* the eldest are still seeing, still in it. Her children ape
  the colours and the structure of her work, and spread it elsewhere in the station at low resolution; her grandchildren get
  only the vague colours and shapes right. *Tell:* height and a big head; murals and street art (quality shows
  distance from her, wet paint means one is near).
- **Dale Mercer (strong leaf; employee of the month).** Weeks without sleep: rage, blackouts. The energetics were born then,
  and he barely remembers them. His brain learns to ignore the stimulant; he sleeps and is himself again, but the organ never
  stops making it, and he is very infectious. Now he is an elder, and the plant shows on him: tobacco leaf grows out of him in
  shelves, stacked the way a bracket fungus stacks, tinted the colour of nicotine, over the shoulders where a head would be,
  down the back and the flanks and the legs. He has no head at all: a chest, nicotine-stained, sat in a tub of his own
  stimulant on two thick, knotted, too-long legs, one knee up out of it and one leg out over the side to the floor, and from
  one hole low in his front what he makes runs into the tub. There is no throne; the tub's high back only reads as one from
  across the room. He is inoculating the station: there are too many sleepless children for his death to fix anything, so he
  leaves low doses where people drink and has his eldest give grafts for rapid immunity. He will not graft anyone himself.
  Nobody wants a second dose; it means a bad night. *A graft from his eldest:* a few nights awake on the edge, then immunity;
  your blood carries the stimulant, and the sleepless keep away from your smell. *Children:* his line looks like him. His
  eldest are as wrong as he is: chests on legs, the same colour, fewer leaves and less of the ooze, each wrong its own way (on
  stilts, on legs like trunks, one arm grown huge). About half keep a head at full growth, the same tobacco colour as the rest,
  lumped and hairless; the leaf comes out of the tops of them, head or shoulders, in more or less. Nipples and navels are dots,
  and Dale's chest is no more muscled than theirs. The bigger have the hole; the small ones have only a navel. The growth goes into the legs, as Dale's did: one with a hole
  stands at least a third taller than one without, on legs grown long and thick. The sleepless
  are the same kind, still in it, hunched and plainly mad, and mostly keep their heads. The antidote child breaks the drug down instead and wants the spreading
  stopped, not managed; late children are mild. *Tell (the sleepless):* teeth grinding you can hear, never still. If it sits
  down, it is past it. *The tub as a hazard:* every mutant sleeps (rule 7), so any mutant that gets enough of it goes
  sleepless too.

  *The sleepless (agreed).* Not rabid: sleep loss does not make an animal of you. It kills (rats kept awake die in two or
  three weeks, eating more and wasting anyway, their heat failing, their skin in sores; fatal familial insomnia kills people
  the same slow way), and before it kills it unravels you. So the line is mostly dying, with rare survivors, and they suffer.
  In stages, one a night or so, so that what you met yesterday is something else today:

  | Stage | When | What it is | Tell |
  |---|---|---|---|
  | Wired | the first day or two | restless, irritable, energetic; running hot (stimulants do), so it sheds clothes and goes for the cold: cold stores, chillers, the water | teeth grinding |
  | Frightened | the third and fourth | hallucinating, paranoid, dropping into microsleeps; lashes out at whatever startles it, and at things that are not there. The dangerous one | grinding; sudden stillness, then not |
  | Failing | the fifth on | tremor, unsteady, wasted, sores; its heat gone now, so it huddles on warm machinery: the dying crawl toward the curing hall, and Dale | teeth chattering; shivering |
  | After | the end | most die. A few adapt and sleep at last, for days (do not wake it), and wake as someone else: cognition grown back new, not the person restored | silence, lying down |

  - *Together, and not.* Kin by smell (rule 8) draws them together; paranoia cannot bear it. They gather, and the gatherings
    come apart in violence. (Open: whether that is too clean.)
  - *Their places* are chaos, not order: furniture thrown, barricades built in a panic and torn down again, walls scratched,
    skin scratched raw (the feeling of something under it, a real stimulant symptom), sweat, shed clothes, light fittings
    smashed (their pupils blown wide, light hurts: Pia's line needs the light, Dale's breaks it). Off, frantic and human; not
    gross the way Pia's children are.
  - *Not punding.* Stimulant users fall into compulsive repeated tasks, and it was floated (the warehouse sorted for ever) and
    dropped: too neat, and the sleepless would not all do it.
- **Tom Wren (mild leaf).** Sleepless but calm; he wrote letters home until only his writing hand moved. He was a very big
  man, four times a man's size, and he lay down and stopped, and was grown through. He is still plainly a man, ashen, on his
  back with his knees a little up and one hand over his letters, but his own spore producers have come up through him, out of
  his chest, belly, thighs and face, torn skin round each: ribbed stalks, pale green, plant more than animal, each with a
  sulphur-yellow mouth at the top that opens and throws spores with the draught and holds shut when the fans stop. *Where:*
  Holt moved him to a zone of his own and sealed it, her roots packed into the doorway, so he can sit in a later reach of the
  game. Round him is his bubble: the smaller producers he threw, grown up out of the floor, thicker the nearer they are
  to him. *Spreads:* spores on the air, "as far as it can travel". *Tell:* yellow dust that follows the air.
  *The spores and you (proposed):* a spore is a graft like any other and needs living tissue to take: a wound, or long, heavy
  breathing of it. One breath does nothing; a cut in his zone, or hours in it unmasked, does. The rebreather keeps them out,
  so his zone is somewhere you go equipped, and a wound taken there is the danger. On the floor, on the dead, on anything
  organic, they grow into new producers. *Inside:* Holt is not containing him but saving him for the surface; opening his
  zone lets him out on your schedule, not hers.
- **Sam Okoro (a bit of everything).** Took every product at least once, and the niche strains nobody else touched (a DMT-like,
  a psilocybin-like): the trial's most watched subject. Moody like Janus, kind like the aedra; never psychotic, never violent;
  driven to fairness. A big man, about 3.3 m, long in the leg and less heavy than his height suggests; his body a patchwork of
  pieces swapped with friends: a graft is how he shows affection. The whites of his eyes are neon, the pupils
  black, and he still wears a loincloth cut from a station sheet: what he keeps of being a man. His left arm glows, far brighter than the mushrooms crowded on that side of him, and in a dark room it is the light.
  His blood glows too, but only out of him: cut him and it shines where it runs and pools. *His graft* treats the mind, not
  the body: sleeplessness still wrecks you, but you stop being violent about it and can carry on, and the soundtrack gains
  something that is not in the room. *Inside:* the arm's light was Holt's gift. Her heliotropes follow light, so they always
  know where he is; and the spores in his blood are her tissue, which makes him fond of her. His warmth toward Holt was grown.
- **June Pryor (oils and resins; a lab technician): set aside.** A sixth elder, a person turned to hardened sap and kept by
  Holt as grafting wax, was mocked up and shelved: there are enough elders. Nothing else depends on her.

### The young gods

- **The founder (generation 3).** Touched by Pia in her stupor. Pia's fear of eradication was a thought;
  in the founder it became biology. It took others by force and turned the Commons.
- **Pia's generations.** The opiate dulls with each generation; the fear does not, so the youngest are the most violent and the
  oldest the largest and most stupefied.

  | Gen | Who | Can | Opiate | Fear |
  |---|---|---|---|---|
  | 2 | Pia | nothing; cannot speak | full | an idea |
  | 3 | the dazed, the founder | gesture | heavy | in the founder, an instinct |
  | 4 | the Commons bloc | walk, track you with their heads | some | strong |
  | 5 | Commons husks | act; ignore their own pain | faint | strong, and turned outward |

- **The mother.** A woman of the Commons bloc whose graft took in the womb; touch her and you lay eggs too. Her hatchlings have
  no host and lose most of the human look. She lays in Cargo, where nothing green can reach.
- **Security's first.** Taken by a hatchling in Cargo, so it inherited no fear and no thought, only drills; it sits up out of
  the middle of the overseer (§8). Hatchlings imprint on whoever tends the clutch, so Security raises the Commons' young, guards
  a nest it cannot add to, and wants a mother of its own.

### Grafting as treatment

Grafting is a verb as well as an infection. Ines's eldest children, still seeing, are the example: no words, only a diagnosis
and a choice of tissue.

| Graft | Does | Costs |
|---|---|---|
| none | mercy | a life |
| old Pia | eases the visions; starts the wood | slows their tolerance, so it lasts longer |
| young Pia | a strong painkiller; an Ines × Pia hybrid | grows up clever, creative, checked out |
| old Ines | races them to tolerance | they become more like her |
| Sam | they can bear it | nothing is cured |

Each graft needs a visible change within a minute (it stops pacing, sits, paints better), or the player cannot learn it. The
same pattern serves Dale's sleepless. **The player mutating (intended, built later):** the obvious next step is grafting
yourself. The game must be fun without it, so it waits (§6, question 2).

### Tells

The player is never told any of this; they read it.

- **Fluid colour is lineage:** Pia milk, Dale nicotine, Ines her own pigment, Tom spore-yellow, Holt green, Sam a glow.
  Two colours on one body is a hybrid.
- **Behaviour is stage:** never still means crisis; sitting means past it.
- **Size is age,** in each elder's own silhouette.
- **Motif is descent from Ines,** degrading by generation.
- **Scars** show which crisis it survived.
- **An offered wrist,** cut open and held out, is a graft offered, in every lineage.

### Open

- Holt: what marks her work, and how she can be hurt.
- Is the founder the thresher? What do the young gods look like?
- Where Ines paints. (Dale: the curing hall: §8, *Production*.)
- **The mass (proposed, moved from Security).** A room grown shut, its glass sweating, something pressed flat against it that
  you never see whole, the changed feeding at its door: a late child of Pia's, sessile, in the Commons or wherever her people
  have been longest. A door you want opened, not a fight.
- The antidote child: a name, and where it went.
- Holt's lab journal (`src/content/notes.ts`) has her cutting out her own fear; that is dropped, and the note is to be
  rewritten with the levels. So is the resident's diary, whose Pia has an arm that reaches for the lamp on its own: the arm has
  no will of its own.
- Tom: his producers throw spores (not tobacco's seed after all); whether they are tobacco in any way is open.
- Ines's murals: to be designed as particular scenes, with the copies worked down from them.
