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

### The Security flesh (an offshoot of the flesh; agreed)

- **Origin.** Security watched the Commons turn, on Security's own cameras, and walled itself off. It was not enough: some small
  amount got through anyway, and Security's own staff began to change. They are the youngest branch of the flesh.
- **Character.** The most technologically able of the flesh. They kept the station's systems and grew into them: their overseer
  runs the cameras and the security controls, and does not need to see you to have you hunted (see §8).
- **The survivors.** A smaller group of Security's staff, still human, sectioned themselves off from the changed ones. The changed
  held the controls for the way out, and the surface lift is close by; they locked it away to protect themselves, and damaged it.
  The survivors killed themselves, or made a run for an exit and were killed or stopped by something on the way. None of them
  made it.
- **Why the exit (proposed).** The surface lift scans for a clean body (§3). The changed cannot pass it, and anyone clean who did
  would bring the owners' purge down on everyone left below. Breaking it is the flesh's logic in small: act first or be annihilated.
  It is also why a clean stranger walking out of Holding is a threat to them.
- **Towards you:** for now, they want you dead. (Whether they would rather take you, and how, is open: §6.)
- **Towards the Commons:** kinship and threat at once, as the plants and the flesh are to each other.
- **Territory:** Security and the Cargo cavern.
- **Rank and file:** the patrols (changed staff, still nearly human, some in uniform), skitters and their eggs; the overseer's hand
  (§8).

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
6. **Switch over** to the new station and retire the old one. **Done** (`engine.md` §13, step 9). Rewriting the old
   floor-numbered text is not a priority; it will be rewritten as part of the levels.

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
8. **Taking you rather than killing you.** Do the Security flesh (or any of the flesh) want you changed rather than dead: pinned
   down and infected, or killed and the body mutated after? Does a body need to be alive to change? For now they kill you. (The
   death screen already says "Grafted" and "Lowfield keeps what it is given", which allows either.)

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
cavern is the nest, seen first on the overseer's monitors and visited last, a disgusting, porous, eggy place of pustules and
cancerous growth, rather than a second level-sized area competing for attention.

**The beats (agreed)**

1. **Opening: dark, and no flashlight.** You wake in Holding. The lit path (the emergency lights on the OPS backup set, Holding's
   own low light) is the way to go, slowly, tensely, up to the main floor. The first fear should be a sound: something heard and
   not seen.
2. **The flashlight, on a body.** It opens choices: go back and see the start properly, or explore the eerily quiet rooms and the
   main hallway.
3. **The infected half.** Rooms and vents full of skitters and eggs; patrols down the hallways. The line between safe and not
   safe is clear and physical: a threshold you choose to cross (a door, a change in the colour of the light, eggs starting at a
   doorframe), not a gradient. The safe half is the part the survivors held, which is why it is quiet: they are dead.
4. **Climax: the overseer.** The whole operations centre has become one mutated growth, flesh grown into the cameras and the
   security controls. It watches its young in the cargo nest, and it watches you.
5. **Release.** With the overseer dead the cameras are glass, its hand stops hunting, doors stay as you leave them, and power is
   no longer a danger. The patrols are still there, but they are only patrols. The level gets smaller without getting empty.

**The overseer (agreed)**

- **Brain:** the growth in the operations centre. It is to be destroyed, not bargained with or blinded.
- **Eyes:** the cameras, across the level. Only the overseer sees through them.
- **Hand:** an engorged mutant made of Security's staff, the level's thresher. It goes where the cameras see you, and follows you
  for as long as the overseer lives; when it dies, the hand stops seeking you.
- **Power is the trade.** Security needs power for things you want (card readers, the Cargo platforms, the fan door on ladderway
  B), but power wakes the cameras. Switching on is what makes you visible: the same bargain as Gen-1 and the rib freak, in another
  shape.

**Three layers of being found (agreed)**

- **Cameras → the hand.** Answered by blind spots, cutting the power, or breaking a camera (loud: a cost, per §4).
- **Patrols → their own senses.** Sight, light and sound, as everywhere else. They do not know where you are because the overseer
  does.
- **The overseer's other tools (proposed):** it can lock a powered door on you, and you hear the bolt before it goes; a dead door
  cannot be locked, so cutting power defends as well as exposes. **Open:** one indirect way to bring the patrols, by something
  they can hear: an alarm or the PA sounding where you are. They come to the noise, not to the overseer.

Every one of the overseer's moves should be seen or heard before it lands (a camera's light, the bolt), and have an answer.

**The survivors are the tutorial (proposed).** Each body on an escape route was stopped by one particular thing: one at a card
reader with no card, one at a heavy door with no power, one under a camera, one who stayed in Holding and gave up. Each teaches
an obstacle before you meet it, without a word; the body with the flashlight is the first. No survivor's body is only dressing.
(The officer in the lobby already reads this way: "Whatever opened him did it from behind.")

**The way out (proposed).** The surface lift needs more than Gen-1: it was damaged, and needs mending (a kit or a part, §4), and
its controls are in the operations centre. The exit and the climax share a room. The other ways out stay: ladderway A down, and
B once Cargo has power.

**What the game needs for it**

- **New:** cameras as fixed eyes: a sight check from each camera, a visible light while it is live, and what it sees sent to the
  hand. A door the overseer can lock. The overseer itself, and the hand.
- **Already there:** patrols (the cast keep rounds), vents (loose panels; crawling under), grabbing and dragging (a start for the
  hand), caves of any outline (for the nest's organic shapes), backup sets and the power rules, the progression checker (to prove
  the level, and every way of spending power in it, can still be finished).
