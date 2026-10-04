---
name: fake-it
description: Design the faked or scripted version of an intelligent behaviour before building anything real. Use whenever a step involves AI, recognition, understanding, "it knows", "it notices", or /fake-it <behaviour>.
argument-hint: [behaviour]
---
# Fake it first

Ask, for the behaviour $ARGUMENTS:
1. What must the demo show for this to land for the person trying it?
2. What can be scripted or faked so that it shows exactly that?
3. What does the room already give us (a fixed object, a helper, a known position, a time)?

Then write a small table and build the cheapest row that answers the design question:

| Behaviour | fake / scripted / real | Trigger | Block |
|---|---|---|---|
| it notices you sat down | fake | timer | `ai.say` |
| it answers a question | scripted | `Prompt` choice, keyword | `ai.fake(responses)` |
| it hears you | scripted | `voice.listen` with `fallbackPhrases` | `voice`, `ai.say` |
| a helper triggers it | fake | `onLongPress('anywhere')` or a helper's tap | `ai.say` |

Only rows for behaviours the brief or the student asks for; the table shows the shape, not a menu.

Add one line on what each row stands in for ("stands in for: a model judging the planet") and one on
what the student tells visitors afterwards ("the noticing was a timer"). Honesty after the demo is
part of the method.

Files generated once with an outside service are still a fake: the headset plays or shows a file.
Before the first call, ask which fidelity this round is for (draft or final) and what each costs; the
key stays with the student (see "Assets made with an outside service" in `.claude/CLAUDE.md`).

A real model call (`ai.mode = 'live'`) is a confirmation point: state the cost in time and what it
changes for the person, offer the fake, and wait for an explicit yes.

Never: call a live model unasked · add a server route · apologise for faking.

Guided by: /fake-it
