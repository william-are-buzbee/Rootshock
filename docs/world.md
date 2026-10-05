# Rootshock: world and progression

The design bible for the next pass. It records what has been agreed, what is proposed, and what is still open, so the work can be
picked up by anyone (or any session) without the conversation that produced it. Status markers:

- **Agreed**: decided; build to it.
- **Proposed**: a direction both sides like, not yet committed.
- **Open**: needs a decision before it is built.

The station itself (layout, levels, coordinates) is in the level builders in `index.html` (`NEWSTATION`, behind
`?dev=newstation`), and later in `v2/src/content/levels`.

---

## 1. Premise

**Lowfield Station** is a deep underground facility built and paid for by a well-funded owner (**open**: corporation, government, or
one rich individual). Its stated purpose is commercial.

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

- **Origin.** A member of staff touched the animal part of a plant hybrid (a mutated arm, not the plant growth). The sample carried
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

**Accession 31.** Delivered sedated in a sealed crate, signed for like seed, held for transfer to Horticulture (see the intake slip
in holding). Nobody came to collect them, and then Gen-1 dropped.

- **Start:** an unaligned pawn.
- **End:** the physical, mechanical arbiter of the station, and its political actor: kingmaker, liaison, or neither.
- **Why both sides need you (proposed):** the surface lift has a decontamination scanner and will only carry a clean body. Each tribe
  needs a clean courier to get anything, or anyone, out. That is why you are worth keeping alive and using, and it is why your own
  mutation decides which endings remain open.

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
  **Open:** limited fuel; backup sets as repairables.
- **Gen-1:** the global answer that changes a whole level, or the whole station, at once.
- **Gen-1 capacity (proposed):** Gen-1 cannot carry every service connection at once, so the distribution panel becomes a choice:
  which levels get power, which doors and lifts work, and where things wake. With the tribes, it becomes a political lever: grow
  lights for the plants or heat for the flesh.

### Repair kits (agreed)

General-purpose, like System Shock 2's upgrade modules: one kit fixes one significant thing, so spending it is a real decision
between unlike options.

- **Repairables:** backup sets, lifts and platforms, ladder sections, broken doors into new areas, service connections, pumps, the
  hoist, the Security elevator.
- **Fewer kits than repairables**, so each player builds a different route.
- **Every way of spending must still finish:** alternative routes, or one guaranteed late kit. The checker proves it.

**Example (proposed): the Security elevator.** A broken lift from Security straight down to the Commons, or as far as the drowned
sump. One kit repairs it. Spending a kit there puts Aldana's Armory code within reach almost at once, but the rebreather is behind
a heavy door that needs Gen-1, so that early dive is made on one lungful. The same kit could have mended Cargo's platforms (and
whatever they lead to) or a backup set.

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

### Mutation and the drugs (proposed)

- **The drugs are the player's upgrades and their infection, in one item.** Painkiller: slow healing, no pain feedback. Stimulant:
  speed, no need to rest. Rave tablet: you see what is hidden, and things that are not there. Anaesthetic: silence, or slowness.
- **Every dose adds mutagen.** Mutation is a stat the player chooses to raise, not only a death.
- **What mutation changes:** how the green treats you (vines part, rootworms ignore you, the great chamber opens); how the flesh
  treat you; whether the surface scanner will pass you.

### Factions (proposed)

- **Territory** per tribe; **favour** with each leader; a **truce** state in which rank and file ignore you inside their leader's
  territory.
- **Diegetic contact, no dialogue system:** notes, terminals, intercoms, a voice through a door. Proposed: the plants reach you
  through Holt's terminal in the tissue lab; the flesh through the Commons PA.
- **Political levers that already exist in the station:** the distribution panel (Gen-1 routing), the sump pumps, the generator hall,
  the surface lift.

### Endings (proposed)

1. **Surface lift:** the proper exit. Gen-1, a credential (the surface pass or the director's key), and a clean scan.
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
6. **Switch over** to the new station and retire the old one. Rewriting the old floor-numbered text is not a priority; it will be
   rewritten as part of the levels.

---

## 6. Open questions

1. **Who owns the facility?** Corporation, government or individual, and is there a **third pressure**: their purge protocol as a
   clock, or an ending of its own?
2. **Full mutation:** death, ending, or a playable state? (Leaning: playable, at least partway.)
3. **Can you walk among the mutants unharmed?** If yes, faction AI is a real engine job (truce, territory). If no, the politics stay
   at arm's length, through terminals and intercoms.
4. **The mutagen's official name.**
5. **The big locks:** one or two per ending, to be decided once the endings are.
6. **Backup sets:** limited fuel? repairable?
7. **How many repair kits, and where.**

---

## 7. What pass 3 got right (keep this)

The third pass was small but genuinely fun:

- There were real access problems: you could try most of the doors in an area and still not know how to go on.
- Going to the generator room was the climax.
- Sneaking past the thresher, the flailing ribcage mutant, was genuinely horrifying: open the door and see it charge in some
  direction in the dark.
- Turning the lights on and making yourself more visible was a real trade.

The aim is for every level to feel like that, while staying non-linear and open to exploration.
