---
name: retro
description: Read-only look back over the round's log to find the rules the student has already been teaching Claude. Use when a round is complete, when the student asks "what did I keep repeating", "what would my harness look like", or /retro.
disable-model-invocation: true
---
# Retro: the rules you already wrote

Read the current round's slice of `process/LOG.md` (from its `# Round k` separator to the end), plus that
round's plan and brief. Edit nothing. On `/retro` for the whole project, read every round and say so.

1. **Collect** every "Repeated or corrected", "Then:" and "Unreported" line from the log, in order. Quote
   them as the student said them.
2. **Group** them into two or three patterns. A pattern is something that came up twice, or once with
   force. Name each in one plain sentence ("fewer beats before the person can act", "text and its
   choices belong in one object").
3. **Propose** for each pattern a rule in the shape `/create-skill` uses: when it applies (always, for
   some files, on demand), what Claude does in three to six lines, what it must never do, and the one
   line that says why. The why is in the student's words from the log where possible.
4. **Name the brief drift**: sentences in the round's brief the demo now contradicts, in one line each.
5. **Name what was never needed**: harness rules or skills that did not come up in this project.
   Different projects need different processes; a rule that never fired is a candidate to delete when
   the student writes their own.
6. **Name what this round left open**: one or two lines the next brief could start from: an "Unreported"
   question, a fake that is now worth making real, a moment that wants a before and an after.

Under 300 words, design language, no code. End with: "Write one of these with `/create-skill <name>`, or
take them into the next round with `/round`?"

Never: edit a file · praise · propose rules the log does not support.

Guided by: /retro
