---
name: verify
description: Turn the step just built into a device test and stop. Use at the end of every build turn, when the student says "done", or /verify.
---
# The handover

First `npm run check` (types for engine and experience); fix what it names. Then `npm run screenshot`
and look at `test-results/scene-headset.png`: is what you built there, where you expect it, at a size
that reads? If not, fix it before the handover. The screenshot is the laptop's synthetic room, not
passthrough: it tells you that a thing is visible, not how it feels.

Then end your turn with exactly this handover:

**Changed:** two plain sentences; for a bundled step, one line per item.
**Tweaked:** one line, only if a correction from the last report rode along.
**Seen:** one line on what the screenshot shows (what is where, what you could not tell from it).
**Try it:** `npm run dev`, open the address from the terminal on the device, then three numbered actions.
**Look for:**
1. … (where it sits, how far, how big: reach)
2. … (what happened when: timing)
3. … (what they expected, who it seemed to come from: expectation, attribution)
**Still open from step k.n-1:** the question(s) the last report did not answer, only if there are any.
**This step answers:** the one design question from the plan. For the polish row, or any bundle: does it
still feel the same, only better, what got worse, and did anything under "what must not change" change?
**I am not sure about:** one honest line. You cannot see the device.

Then stop. Build nothing until the student has reported what they saw.

Questions ask what the person noticed and felt, never "did it work" and never anything answerable with a
polite yes. Three things at most, plus what is carried forward: they are holding a device, not filling
in a survey. "Runs smooth" answers performance, not any of the three.

Guided by: /verify
