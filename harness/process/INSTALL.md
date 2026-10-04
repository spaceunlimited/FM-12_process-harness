# Process harness v1.1 — install, check, remove

The harness is three items copied into your template folder. It adds files and never changes one.
Only `.claude` is hidden (Claude Code requires that name); `BRIEF.md` and `process/` are visible.

## Install (under a minute)
1. Open the terminal you use for `npm run dev` and go into your template folder (the one with
   `CLAUDE.md` and `CAPABILITIES.md` in it):
   ```sh
   cd path/to/your-template-folder
   ```
2. Run the installer. It copies the harness files in, skips anything that already exists, and prints
   the check report. It refuses to run outside the template, so you cannot install it into the wrong folder.
   ```sh
   npx -y github:spaceunlimited/FM-12_process-harness
   ```
   Windows PowerShell:
   ```powershell
   npx.cmd -y github:spaceunlimited/FM-12_process-harness
   ```
3. Quit Claude Code if it is running, then start it again in the template folder:
   ```sh
   claude
   ```

### Without network, or if npx is not available
1. Get the harness, anywhere outside your template folder:
   ```sh
   git clone https://github.com/spaceunlimited/FM-12_process-harness
   ```
   or download the ZIP from the same page and unzip it.
2. Open its `harness/` folder. On macOS press **Cmd+Shift+.** to show the hidden `.claude` folder.
   Windows shows it already.
3. Move the three items **`.claude`**, **`BRIEF.md`**, **`process`** into your template folder, next to
   `CLAUDE.md` and `CAPABILITIES.md`. Nothing is overwritten; the template has none of these.
4. Restart Claude Code in the template folder.

Never use `tiged`/`degit … --force` into your project folder: with `--force` they delete the destination.

## Did it work?
- On start, the terminal shows one line: `Process harness v1.1 · brief 0/5 · no plan yet · 13 capabilities`.
- Type anything. Claude's first reply names the harness and the empty brief sections.
- `/harness-check` lists every harness file, the brief and plan status, and whether any template file
  changed. `/context` shows both `CLAUDE.md` and `.claude/CLAUDE.md` under Memory files.

## Is the template unchanged?
`/harness-check` prints `no tracked template file is modified` and `standalone lint … ok`. Those two
lines are the proof. Without git the check says so and falls back to the lint.

## Remove
1. From the template folder:
   ```sh
   npx -y github:spaceunlimited/FM-12_process-harness --remove
   ```
   This deletes the harness's own files and nothing else. `BRIEF.md`, `process/PLAN.md` and
   `process/LOG.md` are yours and stay; add `--all` to delete those too. Any other file in `.claude/`
   (for example a `settings.local.json` Claude Code wrote for you) is never touched.
2. If the harness was committed with your steps, take it out of git as well:
   ```sh
   git rm -r -q --cached .claude/CLAUDE.md .claude/settings.json .claude/hooks .claude/rules .claude/skills process/INSTALL.md process/WHY.md
   git commit -m "Remove the process harness"
   ```
3. Restart Claude Code.

By hand: delete `.claude/CLAUDE.md`, `.claude/settings.json`, `.claude/hooks`, `.claude/rules`,
`.claude/skills`, `process/INSTALL.md`, `process/WHY.md`, and `BRIEF.md`, `process` if you want them gone.

## Update
From the template folder:
```sh
npx -y github:spaceunlimited/FM-12_process-harness --update
```
Refreshes the harness files and removes files an older version had (v1.0's `.claude/agents/critic.md`);
never replaces `BRIEF.md`, `process/PLAN.md` or `process/LOG.md`. The version is the first line of
`.claude/CLAUDE.md`; `/harness-check` prints it. Restart Claude Code afterwards. If the version line does not
change, npx served a cached copy; run the same command with `--prefer-online` after `-y`.

## What is new in v1.1
From a full run of v1.0 on the Quest (`process/WHY.md` has the story behind each):
- Claude looks before it asks you to: `npm run screenshot`, then the card has a **Seen** line.
- A **tweak** of the step you just reported rides along with the next step; it is not a step.
- A polish pass or a change of fidelity is one bundled step: the list and what must not change are
  agreed first, then one card that names every item.
- Every logged step is a commit (`Step k: <name>`). Never a push.
- Questions you did not answer come back on the next card.
- The plan has an end. When it is complete, Claude says so and the steps become yours to size.
- `/retro` replaces the critic: it reads your log back as the rules you already wrote.
- Assets from outside services (audio, images, models): Claude asks which fidelity, draft or final; the
  key is yours to paste into `.env`.
