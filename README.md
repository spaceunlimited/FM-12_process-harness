# FM-12 process harness

A small process you add to the FM-12 WebXR sandbox template on purpose. It moderates how a mixed-reality
prototype gets designed and built with Claude Code: read the brief, plan the steps, build one, test it
on the device, write down what you saw, then the next one. Always about the interaction and what the
person experiences, not about the code.

It is documentation only: a `.claude/` folder with one memory file, two path rules, two small hooks and
eight skills; a `BRIEF.md` template; and a `process/` folder with the install notes, a log, and the story
of why each guardrail exists. No runtime code, no dependencies, no changes to the template. It relies on
the template's `npm run check` and `npm run screenshot`.

**Install:** from inside your template folder, run

```sh
npx -y github:spaceunlimited/FM-12_process-harness
```

It copies `harness/` in and never overwrites. Or copy the contents of `harness/` in by hand. Step by
step, remove and update: [`harness/process/INSTALL.md`](harness/process/INSTALL.md).

It exists to teach two things: a harness adds a *process*, and different projects need different ones;
and slowing down instead of one-shotting makes room for a better idea.
[`harness/process/WHY.md`](harness/process/WHY.md) shows where each rule came from.

Version: see the first line of `harness/.claude/CLAUDE.md`.
