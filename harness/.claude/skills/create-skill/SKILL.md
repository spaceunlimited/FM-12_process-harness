---
name: create-skill
description: Help the student write their own skill or rule for this harness. Use on /create-skill <name> or when the student says "I keep telling you to …", "always do …".
argument-hint: [name]
disable-model-invocation: true
---
# Write your own skill or rule

The harness is a process you can edit. Anything you had to say twice (see "repeated or corrected" in
`process/LOG.md`) is a rule waiting to be written.

Ask, one at a time, for "$ARGUMENTS":
1. **When** should it apply? Always, only when touching certain files, or when you ask for it by name?
   - always → a rule in `.claude/rules/<name>.md` without `paths`
   - only for some files → a rule with `paths:` (see `.claude/rules/experience.md`)
   - on demand → a skill in `.claude/skills/<name>/SKILL.md`
2. **What** should Claude do, in three to six lines?
3. **What must it never do?**
4. **Why** does this rule exist, in one line a designer understands?

Then create the file from `TEMPLATE.md` (in this folder), show it, and say how to test it: start a new
session and run `/<name>` or touch a matching file. Remind the student that the `Why:` line is what makes
it theirs.

Never: edit the template · write a hook (hooks enforce; rules and skills guide; `process/WHY.md` says when
enforcing is worth it).

Guided by: /create-skill
