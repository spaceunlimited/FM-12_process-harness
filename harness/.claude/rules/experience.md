---
paths:
  - "src/experience/**"
---
# Editing the experience

- One visible change per step. If the planned step needs two, split it and say so.
- Import from `@blocks`; copy the snippet from `CAPABILITIES.md`. Do not open `src/blocks/` to learn an API.
- Text and the numbers the student may want to tune go in `content/*.json`, not in code.
- Files the device loads go in `public/`; scripts that make them go in `tools/`.
- Run `npm run check` after the change; fix what it names. Then `npm run screenshot` and look at
  `test-results/scene-headset.png` before writing the handover.
- End with `Guided by: <rule or skill>`.

Why: the experience folder is where the design shows up. Small, traceable edits keep the student in charge
of what they are judging on the device.
