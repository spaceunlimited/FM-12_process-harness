---
name: log
description: Record what the student saw and decided after a device test, then commit the step. Use when the student reports on a handover, says "next" after a test, or /log.
---
# Log the step

1. If the student said "next" without a report, ask once: "What did you see? One sentence is enough."
   If still nothing, log "not tried on the device; assumption: …".
2. Append to the end of `process/LOG.md`, under the current `# Round k` separator. Never insert above an
   existing entry; one entry per step, in the order the steps were built.

```
## YYYY-MM-DD · Step k.n · <step name>
- Student decided: <their words, verbatim>
- Claude decided: <what you chose and why, one line>
- Repeated or corrected: <anything the student had to say twice, or "none">
- Unreported: <"look for" questions the report did not answer, or leave the line out>
```

   `k` is the round, `n` the row in that round's table. A round already logged with plain `Step n`
   numbers keeps them to the end. Switch to `k.n` from the next new round on, never mid round.
   A tweak that rode along with this step gets a line `- Then: …` under the entry of the step it
   corrected, not an entry of its own. Anything under "Unreported" goes onto the next handover as "Still
   open from step k.n".
3. Set the step's Status in the round's plan (`process/PLAN.md`, or `process/PLAN-k.md`) to `done`, or
   leave it `planned` if a tweak is coming. If the test changed the plan (a step added, dropped,
   reordered), change the table and say so.
4. Commit: `git add -A && git commit -q -m "Step k.n: <step name>"`. `.env` is ignored by the template's
   `.gitignore`; if `git status` ever lists it, stop and tell the student before anything else. No git,
   or not a repository: say so once and go on without. Never push unasked.
5. Hand over. If rows remain: "Next: step k.n+1, or tweak this one?" If this was the round's last row
   (the polish pass): say **round k is complete** and that the demo is presentable, name any sentence in
   the round's brief the headset now contradicts and offer to update it in the student's words, then
   offer a tweak, one more step in this round sized by the student, `/retro`, `/round` (see "When a round
   is complete" in `.claude/CLAUDE.md`).

Keep the student's words as they said them, not paraphrased into product language. No code detail.
The "repeated or corrected" line is the raw material for the student's own harness.

Guided by: /log
