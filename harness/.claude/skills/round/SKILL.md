---
name: round
description: Open the next round with a new brief that extends the last one. Use when a round is complete and the student says "next round", "round 2", "what comes after this", "keep going with a new brief", or /round.
---
# Open the next round

A round is one brief, one plan ending in its polish row, and the steps between. When it is complete the
demo is presentable; the next round is where it gets more interaction or more story. The brief of a new
round is short: what came before is established, not re-asked.

1. Check the current round's plan (`process/PLAN.md` for round 1, `process/PLAN-k.md` after that). If any
   row is still `planned` (the polish row counts), name those rows in one line and stop. A round ends
   with polish, not with the last feature.
2. If `/retro` has not run since the last LOG entry, say so and offer it first: the patterns it finds are
   what this brief is built on. The student may decline.
3. Write `BRIEF-<k+1>.md` from `ROUND-BRIEF-TEMPLATE.md` (in this folder). Fill in only the carried-over
   line, which is target device, what the room provides and fidelity, read from the previous brief.
   Every section keeps its `> (your answer)` marker.
4. Then, in chat, name what this round could build on: two to four lines, each from the log or the last
   round's brief ("the reach question came back three times", "the story stops after the first reply").
   Prompts, not answers. Say which sentences of the old brief the demo now contradicts.
5. Append a separator to `process/LOG.md`: `# Round <k+1>` on its own line. Say that the brief is the
   student's to write and that `/brief` turns it into a plan when they are done.

Then stop.

From round 2 on the student sizes the steps: a row may be a moment that bundles several changes. The
handover, the device test, the log entry and the commit do not relax (rule 3).

Never: fill a brief section · write the plan here (that is `/brief`) · re-ask device or room · build ·
open a round while rows are still planned.

Guided by: /round
