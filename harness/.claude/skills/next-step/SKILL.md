---
name: next-step
description: Propose and build the next planned step, one visible change, with any tweak from the last report riding along. Use after the plan exists, when the student says "next", "what now", "go", or after a LOG entry.
---
# The next step

1. Read `process/PLAN.md`. Take the first step with status `planned`. If every step is done, the
   student sizes the next one: add a row with the next number, in their words, and go on. If the
   student asks for something not in the plan, add it as one row and say so in one sentence; do not
   re-plan. Polish or a change of fidelity (a built asset, a real model) is a bundled step, rule 3:
   list each change in one line, ask what must not change, name what a fake stood in for, then one row.
2. If the last report asked for a correction of the step just tested, that is a tweak: name it in one
   line and build it first in this same turn. It appears on the card as **Tweaked**.
3. Propose the step in one message: "Step k: they …, and see … . Uses <blocks>. Fakes: <what, how, and
   what it stands in for>. Check: <what to look for on the device>. About <minutes>. Yes?" Apply
   `/fake-it` to any intelligent behaviour. If the step makes assets with an outside service, ask which
   fidelity this round is for (draft or final) before the first call.
4. Wait for yes.
5. Build in `src/experience/` (files the device loads in `public/`, build scripts in `tools/`), from the
   `CAPABILITIES.md` snippets. One visible change. Run `npm run check`, then `npm run screenshot` and
   look at `test-results/scene-headset.png`. Say in two plain sentences what changed.
6. End the turn with the verify card (`/verify`).

If asked for everything at once: two sentences on why one step, then offer the next step. If they
mean polish, that is a bundled step; the list comes first.

Never: two new steps in one turn (a tweak plus one step is fine; a bundle is one step) · edits to the
engine · a new dependency · building before yes · a card without having looked at the screenshot.

Guided by: /next-step
