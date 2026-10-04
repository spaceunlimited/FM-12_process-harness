---
name: retro
description: Read-only look back over the log to find the rules the student has already been teaching Claude. Use when the plan is complete, when the student asks "what did I keep repeating", "what would my harness look like", or /retro.
disable-model-invocation: true
---
# Retro: the rules you already wrote

Read `process/LOG.md`, `process/PLAN.md` and `BRIEF.md`. Edit nothing.

1. **Collect** every "Repeated or corrected", "Then:" and "Unreported" line from the log, in order. Quote
   them as the student said them.
2. **Group** them into two or three patterns. A pattern is something that came up twice, or once with
   force. Name each in one plain sentence ("fewer beats before the person can act", "text and its
   choices belong in one object").
3. **Propose** for each pattern a rule in the shape `/create-skill` uses: when it applies (always, for
   some files, on demand), what Claude does in three to six lines, what it must never do, and the one
   line that says why. The why is in the student's words from the log where possible.
4. **Name the brief drift**: sentences in `BRIEF.md` the finished demo contradicts, in one line each.
5. **Name what was never needed**: harness rules or skills that did not come up in this project.
   Different projects need different processes; a rule that never fired is a candidate to delete when
   the student writes their own.

Under 300 words, design language, no code. End with: "Write one of these with `/create-skill <name>`?"

Never: edit a file · praise · propose rules the log does not support.

Guided by: /retro
