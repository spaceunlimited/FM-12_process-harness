#!/usr/bin/env node
// SessionStart hook: one visible line for the student, one opening instruction for Claude.
// With --check: prints the /harness-check report instead. Never throws, always exits 0 (1 only in --check with problems).
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readText, parseBrief, parsePlan, headings, harnessVersion, readStdinJson,
         rounds, requiredFor } from './lib.mjs';

const CHECK = process.argv.includes('--check');

export function gather(root) {
  const r = rounds(root);
  const state = (x) => ({ ...x, brief: parseBrief(readText(root, x.briefRel), requiredFor(x.n)),
                                plan: parsePlan(readText(root, x.planRel)) });
  const roundStates = r.list.map(state);
  const cur = roundStates.find((x) => x.n === r.current.n);
  return {
    version: harnessVersion(root),
    round: cur.n,
    rounds: roundStates,
    brief: cur.brief,                                                  // the current round's
    plan: cur.plan,
    briefRel: cur.briefRel,
    planRel: cur.planRel,
    caps: headings(readText(root, 'CAPABILITIES.md')),                 // null if the file is missing
    logEntries: (readText(root, 'process/LOG.md') || '').match(/^## \d{4}-/gm)?.length ?? 0,
    templateClaudeMd: existsSync(join(root, 'CLAUDE.md')),
  };
}

function sessionOutput(s) {
  const { brief: b, plan: p, round: k, briefRel: BR, planRel: PR } = s;
  const roundPart = k > 1 ? `round ${k} · ` : '';
  const briefPart = !b.exists ? `${BR} missing` : `brief ${b.filled}/${b.total}${b.gateOff ? ' · gate OFF' : ''}`;
  const planPart = !p.exists ? 'no plan yet' : p.complete ? `plan complete (${p.total} rows)` : `plan ${p.done}/${p.total} done`;
  const capsPart = s.caps ? `${s.caps.length} capabilities` : 'no CAPABILITIES.md';
  const ctx = [`Process harness v${s.version} is active. This is round ${k}; its brief is ${BR} and its plan is ${PR}.`];
  if (p.exists && p.complete) {
    ctx.push(`Round ${k} is complete (${PR}, ${p.total} rows done or dropped, polish included; process/LOG.md has ${s.logEntries} entries). ` +
      `Open with what the last LOG entry decided and that round ${k} is complete. Name any sentence in ${BR} the demo now ` +
      'contradicts and offer to update it in the student\'s words. Then offer, in this order: a tweak; one more step in this round, ' +
      `sized by the student; /retro; /round to open round ${k + 1} as a new brief that extends this one. Do not replay the brief ` +
      'and do not invent rows.');
  } else if (p.exists) {
    ctx.push(`Round ${k} is under way (${PR}, ${p.done}/${p.total} rows done; process/LOG.md has ${s.logEntries} entries). ` +
      'Open with what the last LOG entry decided and propose the next planned step; a tweak from the last report rides along. ' +
      `Do not replay the brief or ask brief questions.` +
      (k > 1 ? ' From round 2 on the student sizes the steps: a row may bundle several changes, agreed first, still one handover.' : ''));
  } else if (!b.exists) {
    ctx.push(`${BR} is missing. Tell the student this does not look like a harness-equipped template folder and suggest /harness-check. Do not build.`);
  } else if (b.missing.length) {
    ctx.push(`${BR} has ${b.filled}/${b.total} required sections. Empty: ${b.missing.join(', ')}. ` +
      'Open with one line naming them; the student writes them in their own words (by hand, from notes, with any tool). ' +
      'If they paste text, place it under the right headings verbatim and confirm. Do not interview section by section, do not build.' +
      (k > 1
        ? ` Round ${k} is open and its brief is unwritten: no new step starts before it, but a tweak to what the last round built is fine.`
        : b.gateOff ? ' Note: the brief gate is switched off in BRIEF.md.' : ' A hook refuses edits under src/ until the brief is complete.'));
  } else {
    ctx.push(`${BR} is complete and there is no plan for round ${k} yet. Run /brief: play the brief back in 3-4 sentences, ` +
      `ask at most two clarifying questions, then write ${PR} (last row is the polish pass) and ask "change anything?".`);
  }
  ctx.push(s.caps
    ? `CAPABILITIES.md blocks (${s.caps.length}): ${s.caps.join(', ')}. Use the ones a step needs, never one because it exists; copy the snippet; never open src/blocks/. ` +
      'After every build: npm run check, then npm run screenshot and look at test-results/scene-headset.png before the handover.'
    : 'CAPABILITIES.md was not found: this may not be the template folder. Work from the template\'s root CLAUDE.md only and do not invent block names.');
  return {
    systemMessage: `Process harness v${s.version} · ${roundPart}${briefPart} · ${planPart} · ${capsPart} · /harness-check for details`,
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx.join('\n') },
  };
}

try {
  const input = CHECK ? {} : await readStdinJson();
  const root = projectRoot(input);
  const s = gather(root);
  if (CHECK) {
    const { report } = await import('./check.mjs');
    const { text, ok } = report(root, s);
    process.stdout.write(text);
    process.exit(ok ? 0 : 1);
  }
  process.stdout.write(JSON.stringify(sessionOutput(s)));
} catch (e) {
  process.stdout.write(CHECK
    ? `harness check could not run: ${e.message}\n`
    : JSON.stringify({ systemMessage: `Process harness: session-start hook failed (${e.message}); continuing without it.` }));
}
process.exit(0);
