# Probes

Measurements, not tests: each runs the real sim headless and writes what it found to `probe-<name>.txt` (in the
directory `PROBE_OUT` names, or here; git ignores them). Nothing in them fails. They are kept because the faults they
were written for were found by measuring, not by looking, and the next one will be too.

    npx vitest run --config test/probes/vitest.config.ts            # all of them
    npx vitest run --config test/probes/vitest.config.ts down       # one

- `aim.probe.ts`: where a swing lands against the crosshair, each kind stood in front of you at 1 to 2.5 m, aimed at
  low to high. `WEAPON=pipe` for the side swing, `KINDS=husk,grabber` for fewer.
- `kill.probe.ts`: where what a real swing kills lies, axe and pipe: how far its middle went along your line, across
  it, and how high it rose.
- `down.probe.ts`: the axe flooring a husk (as hard as one run into): how far its shoulders turn on the plan while it
  is down, and how far its hips go out. `TRACE=1` prints one fall step by step.

- `step.probe.ts`: what a sim step costs on each level (mean, median, 95th, worst), walking; and the page's share of
  the light each frame.
- `placement.probe.ts`: everything `test/placement.ts` finds on every level, in the room it is in: things you pick up
  over, off or in what they lie on, fittings hanging in the air or running into walls (with their colour, to find them
  by), panes along their openings, rails against walls, what is drawn or pinned on a board hanging off its edge. The growth and stains the test lets meet rock are listed too.
  `KIND=floats` for one.
- `loops.probe.ts`: how each level is joined up, from the nav graph: its rooms and the links between them (doors by
  what they want, openings, platforms, drops), how many loops there are on foot and with drops, the rooms on a loop,
  the dead ends, and what cannot be walked to from the rest. A loop is a way round, which is what a patrol needs to be
  gone round rather than waited out. `LEVEL=upper` for one; `LINKS=1` lists every link.

- `golden.probe.ts`: every level as compiled, to compare with after a change to how levels are written that should
  change nothing, or only what it says. `SAVE=<dir>` writes each level's definition and grid there (before the change);
  `CHECK=<dir>` builds them again and lists what differs: by part, the first few things in each, and how many cells of
  the grid (and where the first are). `LEVEL=upper` for one.

`SET='STAGGER.upright=0;RAG.tip=0.6'` tries constants for one run (`kill` and `down`), without touching the tables.
To compare with what was there before a change: `git stash push <file>`, run with `PROBE_OUT` elsewhere, pop it.

`swing.ts` has the two pieces each uses: one of the cast stood in front of you in the test bed's arena, and a click
with a weapon aimed at a share of its height.
