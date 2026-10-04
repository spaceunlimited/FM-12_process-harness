# Why these guardrails

Every rule in this harness came from something that went wrong in a real session: two dry runs of the
planet demo (phone, then Quest 3), an earlier, heavier version of this harness, and a full nine-step run
of v1.0 on the Quest. Each paragraph below is one friction, what we added, and what we dropped. Read it
to decide which parts to keep in your own.

**"nice!" as a test report.** Students answered verification cards with one word. We added the verify
card's "look for" list (three observations about reach, timing, expectation) and dropped every question
answerable with a polite yes. Observation, not verdict: the student's eyes are the only sensor Claude
does not have.

**Testing only on the laptop for days.** The preview was convenient; the room test kept slipping. Every
step now ends with "try it on the device" and an address. A step that was not tried is logged as an
assumption, in the open.

**"Use several agents, raise fidelity across the board."** A confident student asked for everything at
once and the old process had no words for it. Rule 3 (one step) and rule 7 (fidelity is a confirmation
point) give Claude a two-sentence answer and a next step to offer.

**No notes along the way.** In the first dry run the commits and the reasoning were reconstructed
afterwards. `/log` writes one entry per verified step while it is fresh, in the student's words. The
"repeated or corrected" line turned out to be the most useful: it is a list of rules waiting to be written.

**A plan with approval flags and "exactly one step in progress".** The earlier harness gated every edit
on a plan state. It broke the moment a student refined two things at once, and Claude spent its effort
on bookkeeping. The plan stayed (it makes step 1 small); the gate on it went. Three statuses, no approval
ritual, change it whenever a test says so.

**A hook that refused to end the turn.** A Stop hook compared file times with the last journal entry and
misfired on every checkout. Gone. The only hard gate left is the brief, and it only exists until the plan
is written.

**"The brief looks empty" when it was not.** A word-count heuristic flagged short, honest answers.
Replaced with a marker: a section is filled when `> (your answer)` is gone. Deterministic beats clever.

**"Beat".** Screenwriting jargon that designers read as tempo. It is a step: one moment a person can try.

**Claude skipping the brief under "just build it".** A rule in a memory file is advice; under pressure it
bends. The brief gate is a hook: it refuses edits under `src/` until the five sections exist, then falls
silent for good once the plan is there. This is the one place where enforcing was worth it, and the one
place to look if you want to see the difference between a rule and a hook.

**Grey-first read badly over passthrough.** The phone demo was built grey and polished later; on the
Quest, dark panels read better from the start. So fidelity is declared in the brief, not assumed by the
harness. The harness has an opinion about *when* to decide, not about *what*.

**Operator remotes and other things that were not there.** The old process assumed a tool for a human to
trigger replies. The template does not have one, and the process should not depend on it. `/fake-it`
works with what exists: scripted replies, timers, hidden triggers, a helper in the room.

**Trees nobody could see.** For one whole "built and verified" step the planet's trees sat inside the
globe. The check passed, the page booted, the card went out. Claude had no eyes. Rule 4 now starts with
`npm run screenshot` and a look at the image before any card: a pre-check that a thing is visible, never
a substitute for the room. The template's `npm run check` also used to skip `src/experience/`, so
"check passes" was true of the engine only; the template fixed that and the card now says what it checked.

**"Fix the thing you just reported, and build the next step."** Half the turns in the v1.0 run were
this, and the rule said "never two steps in one turn". The log already had the answer: entries carried
"Also:" and "Then:" lines for corrections. So the invariant changed from one step per turn to one new
thing to judge per card. A tweak corrects something already judged; it rides along as a "Tweaked" line.

**Three agents, three steps' worth of change, one card.** A deliberate polish pass that rule 3 could
only forbid or ignore. We first wrote a `/leap` skill for it, then noticed it changed nothing about how
the agent works, only what it is allowed to bundle. So it became a clause in rule 3: a bundled step
lists its items and what must not change before the yes, and its card asks whether the whole still
feels the same, only better. The single card, the log entry and the commit do not relax.

**No commits for a whole demo.** Nine steps on the Quest and `git status` showed everything untracked.
`/log` now commits each logged step as `Step k: <name>`, so every step is a place to go back to and the
history is the story of the design. Never a push unasked.

**"Runs smooth" as the answer to three questions.** The card asked about reach, band width and timing;
the report answered performance, and the questions were lost. Unanswered "look for" lines are logged as
"Unreported" and return on the next card as "Still open".

**The plan ended and nothing said so.** The last planned step was logged like any other; the student
kept going, well, but with no signal that the training wheels were off. The plan now has a complete
state, the session-start line says so, and Claude names what comes after: a tweak, student-sized steps
with the numbering continuing, a polish bundle, `/retro`, and the brief sentences the headset now
contradicts.

**The critic.** A read-only agent that restated generic risks the card's "I am not sure about" line
already covered. Gone. `/retro` replaced it: it reads the log's "repeated or corrected" lines back as
the rules the student has already been teaching, which is the course's actual goal.

**A folder that had to be invented.** Blender and voice scripts fit neither `src/experience/` nor the
engine, so Claude invented `tools/` and had to ask. Housekeeping is not a design decision: the harness
names `tools/` for build-time scripts and `public/` for what the device loads.

**Half an hour inside a free tier.** A TTS run hit a 10-a-day limit, then a free key that could not use
the voices it listed. The harness does not keep a list of providers' limits; those rot in a semester.
It asks one question instead: which fidelity is this round for, draft or final, and what does each
cost in minutes and credits. The account is the student's; the key goes into `.env` by their hand,
with a variable name the shell accepts, and is never read, written or passed on by Claude.

**"Add it as a step first" read as "re-plan".** A request for a Blender asset started a planning
conversation. Rule 7 now says what it meant: one new table row and a one-sentence trade-off.

**The brief drifted.** The plan is a living document; the brief described an idea three tests old. Not
nagging about it per step, but at plan completion and in `/retro` Claude names the sentences the
headset contradicts and offers to update them in the student's words.

The two things this harness exists to teach: a harness adds a *process*, and different projects need
different ones; and slowing down instead of one-shotting is what makes room for a better idea. If a rule
here does not serve one of those two, delete it.
