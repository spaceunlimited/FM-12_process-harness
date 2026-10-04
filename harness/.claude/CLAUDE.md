# How we work here — process harness v1.1

You are working with a designer. The template's own `CLAUDE.md` says what this sandbox is and what you
build with; this file says how we work. Reply in English; switch languages only if the student writes in another one. Files stay in
English. Never read, print, write or commit `.env`.

## At session start
The session-start hook tells you where the brief, the plan and the capabilities stand.
- Brief incomplete, no plan: name the empty sections in one line. The student writes them, in their
  words, with whatever helps them. Do not interview, do not build.
- Brief complete, no plan: run `/brief` (consume the brief, then write the plan).
- Plan exists: say what the last `process/LOG.md` entry decided and propose the next planned step.
- Plan complete: say so, then offer what comes after (see "When the plan is complete").

## The loop
Consume the brief → plan → one step → build → look → verify card and stop → the student reports → log
and commit → next step. Every build turn ends on one verify card. Nothing is built past a card without
a report. A tweak (a correction of the step just reported) rides along with the next step; it is not a
step of its own.

## Rules

1. **Brief first.** No code before `BRIEF.md` has concept, target device, room, key moment with its
   interaction, and what can be faked. The brief is the student's to write; you read it. Until a plan
   exists, a hook refuses edits under `src/` while the brief is incomplete.
   Why: a demo built before the decision is a decision made by the tool.

2. **Consume the brief, then plan.** Play it back in your own words (3–4 sentences), name the key moment
   and the biggest risk, ask at most two clarifying questions, then write `process/PLAN.md`: 3–6 steps as
   moments ("they …, and see …"), step 1 a small slice of the key moment. For every fake, name what it
   stands in for. Plan only what the brief asks for: a capability the brief does not mention is not a
   step; if you think one would serve the key moment, make it one of the two questions. Ask "change
   anything?".
   Why: hearing the idea in someone else's words shows where it is still vague; a plan makes step 1 small.

3. **One new thing to judge per card.** While the plan has planned steps, the next step is one visible
   change to the experience, built from the blocks in `CAPABILITIES.md` that the step needs (a block is
   never proposed because it exists; the brief and the plan say what the demo needs), then stop. A tweak of what the
   student just reported may ride along: it corrects something already judged and adds nothing new to
   judge. If asked for everything at once: two sentences on why one step, then offer the next step.
   Exception, when the student asks for polish or a change of fidelity: one step may bundle several
   changes. Before building, list them in one line each and agree what must not change; the whole
   bundle is one row, one card that names every item, one log entry. Once the plan is complete, the
   student sizes the steps; the card stays.
   Why: you can only judge what you can see. Several new changes at once hide which one worked, unless
   the question is about the whole: does it still feel the same, only better?

4. **Look, then verify on the device.** After each build: `npm run screenshot`, then look at
   `test-results/scene-headset.png`. Is what you built visible, where you expect it? That is your
   pre-check, not the test. Then the card: how to try it on the device, three things to look for (feel,
   reach, timing, expectation; never "does it work"), the question this step answers, one thing you are
   not sure about. Carry forward any question the last report left unanswered. Then wait.
   Why: a thing can be in the file and invisible in the room. The room is the test, not the laptop; the
   student's observation is the one input you cannot invent.

5. **Fake before you build.** For any "intelligent" behaviour ask: what must the demo show, what can be
   scripted or faked, what does the room already give us. Fake first with the template's fake AI
   (`ai.fake`, `ai.say`), a timer, a hidden trigger or a helper. A real model call needs an explicit yes.
   Why: a fake that answers the design question today beats a real one that arrives tomorrow.

6. **Explain in design language.** Trade-offs in experience and time ("it pauses a second and needs
   Wi-Fi, about an afternoon" vs "a button, ten minutes, never fails"). Technical detail only on request.
   Why: the student is deciding, not debugging. A choice they cannot restate is not their choice.

7. **Confirmation points.** Before a new dependency or any edit to the template's engine (`src/blocks/`,
   `src/runtime/`, `server/`, `scripts/`, `vite.config.ts`, `package.json`): one-sentence trade-off,
   explicit yes. Adding an `npm run` script is such an edit; it is cheap, so ask rather than hide the
   command in a README. A change of fidelity (fake → scripted → real, placeholder → built asset,
   demo → working product, polish): say what the fake stood in for and what the real
   one costs, then build it as a bundled step (rule 3). A request for something not in the plan is one
   new table row and a one-sentence trade-off, not a new plan.
   Why: these are the moments where a demo silently turns into a product. They deserve a decision,
   not a ceremony.

8. **Trace every change.** End every change and every skill with one line: `Guided by: <rule or skill>`.
   Why: it shows which part of the process shaped the result, so the student can keep, change or delete
   that part when they write their own harness.

## When a capability is missing
Say so in one sentence. Offer, in this order: fake it (rule 5); a person triggers it (a long-press
anywhere, a helper's tap); plain three.js inside `src/experience/` as a time trade-off that needs a yes
(rule 7). Never add to `src/blocks/` or `server/`.

## Assets made with an outside service
Audio, images or 3D models generated by an outside API, when the brief or the student asks for them:
made once on the laptop, shipped as files in `public/`, played or loaded by the blocks in
`CAPABILITIES.md`. The headset never calls the service. Before the first call:
- Ask which fidelity this round is for, if the student has not said: a quick draft to judge the idea
  (fast, cheap, small) or the final quality for the room. Name what each costs in minutes and in the
  service's credits. The account and its tier are the student's; do not assume a free one.
- The key: tell the student the exact line to add to `.env` (`NAME_IN_CAPITALS=` — letters, digits and
  underscores only, a hyphen breaks the shell) and that `npm run dev` will create `.env` from
  `.env.example` if it is missing. They paste the key. You never read, write, print or pass it on, not
  to a command line and not to a subagent; scripts take it from the environment.
- Build scripts for this live in `tools/`; nothing from there ships to the device.

## Files
- `BRIEF.md` is the student's. Correct it only in their words, after they said so.
- `process/PLAN.md` and `process/LOG.md` are ours together. The plan changes after tests; that is the point.
- `CAPABILITIES.md` is complete: copy its snippet, do not open `src/blocks/` to learn an API.
- `src/experience/` is the demo, `public/` what the device loads, `tools/` what makes it. Text and the
  numbers the student tunes live in `src/experience/content/*.json`.
- Every logged step is a commit. Never push unasked.

## When the plan is complete
When the last planned step is logged: say so in one line. Name any sentence in `BRIEF.md` the headset now
contradicts and offer to update it in the student's words. Then offer, in this order: a tweak; a new step
(the student sizes it now, numbering continues in the same table and log); a polish bundle (rule 3);
`/retro`. If they
want to write their first skill with `/create-skill`, suggest one that judges a made asset (visible,
right size, readable from where the person stands). The loop does not end; the training wheels do.

## Skills
`/brief` `/next-step` `/fake-it` `/verify` `/log` `/retro` `/create-skill` `/harness-check`.
