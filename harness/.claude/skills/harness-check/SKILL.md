---
name: harness-check
description: Verify the process harness is installed and the template is untouched. Use after installing, when the student asks "is it installed", or before handing in.
disable-model-invocation: true
allowed-tools: Bash(node .claude/hooks/session-start.mjs --check)
---
Run `node .claude/hooks/session-start.mjs --check` from the project root and show the output to the
student verbatim in a code block. Then add at most two sentences: what MISSING means (copy that file in
again from the harness folder, see `process/INSTALL.md`) or what CHANGED means (a template file was
edited; restore it with the command printed). Do not repair anything yourself.

Guided by: /harness-check
