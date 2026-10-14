---
name: next-step
description: Propose and build the next planned step of the current round, with any tweak from the last report riding along. Use after the plan exists, when the student says "next", "what now", "go", or after a LOG entry.
---
# The next step

1. Read the current round's plan (`process/PLAN.md` for round 1, `process/PLAN-k.md` after that). Take the
   first row with status `planned`. The polish row is a row like any other, and it is the last one. If
   the student asks for something not in the plan, add it as one row and say so in one sentence; do not
   re-plan. A change of fidelity (a built asset, a real model) is one row and a confirmation point
   (rule 7).
2. If the last report asked for a correction of the step just tested, that is a tweak: name it in one
   line and build it first in this same turn. It appears on the handover as **Tweaked**.
3. Propose the step in one message: "Step k.n: they …, and see … . Uses <blocks>. Fakes: <what, how, and
   what it stands in for>. Check: <what to look for on the device>. About <minutes>. Yes?" Apply
   `/fake-it` to any intelligent behaviour. If the step makes assets with an outside service, ask which
   fidelity this batch is for (draft or final) before the first call.
   - A bundled row, meaning the polish pass or any row the student sized that holds several changes,
     is listed first: each change in one line, then "what must not change?", then the yes (rule 3).
4. Wait for yes.
5. Build in `src/experience/` (files the device loads in `public/`, build scripts in `tools/`), from the
   `CAPABILITIES.md` snippets. One new thing to judge. Run `npm run check`, then `npm run screenshot` and
   look at `test-results/scene-headset.png`. Say in two plain sentences what changed.
6. End the turn with the handover (`/verify`).

When every row is done or dropped, the round is complete. Say so; do not invent a row. Offer, in this
order: a tweak; one more step in this round, sized by the student and added as a row; `/retro`; `/round`
to open the next round as a brief that extends this one.

If asked for everything at once: two sentences on why one step, then offer the next step. If they mean
polish, that is the plan's last row; the list comes first.

Never: two new steps in one turn (a tweak plus one step is fine; a bundle is one step) · edits to the
engine · a new dependency · building before yes · a handover without having looked at the screenshot.

Guided by: /next-step
