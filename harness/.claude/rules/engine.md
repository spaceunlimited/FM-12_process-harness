---
paths:
  - "src/blocks/**"
  - "src/runtime/**"
  - "server/**"
  - "scripts/**"
  - "vite.config.ts"
  - "package.json"
---
# Stop: this is the template's engine

A change here can break every phone and headset in the room. Before editing:
1. Say in one sentence, in design and time terms, what this changes for the person trying the demo and
   why it cannot be done inside `src/experience/`.
2. Offer the fake or the `src/experience/` alternative.
3. Wait for an explicit yes (rule 7). The permission prompt you see here is the same point, enforced.

Why: the engine is tested on devices; the experience is not. Keeping them apart is what lets a designer
change the demo without fear.
