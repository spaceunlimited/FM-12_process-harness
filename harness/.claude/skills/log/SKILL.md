---
name: log
description: Record what the student saw and decided after a device test, then commit the step. Use when the student reports on a verify card, says "next" after a test, or /log.
---
# Log the step

1. If the student said "next" without a report, ask once: "What did you see? One sentence is enough."
   If still nothing, log "not tried on the device; assumption: …".
2. Append to the end of `process/LOG.md`. Never insert above an existing entry; one entry per step, in
   the order the steps were built. Numbers continue past the last planned step.

```
## YYYY-MM-DD · Step k · <step name>
- Student decided: <their words, verbatim>
- Claude decided: <what you chose and why, one line>
- Repeated or corrected: <anything the student had to say twice, or "none">
- Unreported: <"look for" questions the report did not answer, or leave the line out>
```

   A tweak that rode along with this step gets a line `- Then: …` under the entry of the step it
   corrected, not an entry of its own. Anything under "Unreported" goes onto the next card as "Still
   open from step k".
3. Set the step's Status in `process/PLAN.md` to `done`, or leave it `planned` if a tweak is coming.
   If the test changed the plan (a step added, dropped, reordered), change the table and say so.
4. Commit: `git add -A && git commit -q -m "Step k: <step name>"`. `.env` is ignored by the template's
   `.gitignore`; if `git status` ever lists it, stop and tell the student before anything else. No git,
   or not a repository: say so once and go on without. Never push unasked.
5. Hand over. If planned steps remain: "Next: step k+1, or tweak this one?" If this was the last planned
   step: say the plan is complete, name any sentence in `BRIEF.md` the headset now contradicts and offer
   to update it in the student's words, then offer a tweak, a new step the student sizes, a polish
   bundle, `/retro` (see "When the plan is complete" in `.claude/CLAUDE.md`).

Keep the student's words as they said them, not paraphrased into product language. No code detail.
The "repeated or corrected" line is the raw material for the student's own harness.

Guided by: /log
