<!-- Skill: save as .claude/skills/<name>/SKILL.md -->
---
name: <name>
description: <one sentence: what it does and when Claude should use it. Include the words a student would say.>
---
# <Title>

1. <first thing Claude does>
2. <second>
3. <how it ends: what it shows the student, and whether it waits>

Never: <one or two things>.

Why: <one line a designer understands>.

Guided by: /<name>

<!-- Rule: save as .claude/rules/<name>.md. Delete the "paths" block to apply it always. -->
---
paths:
  - "src/experience/**"
---
# <Title>

- <what to do>
- <what not to do>

Why: <one line>.
