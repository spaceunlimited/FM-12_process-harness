#!/usr/bin/env node
// SessionStart hook: one visible line for the student, one opening instruction for Claude.
// With --check: prints the /harness-check report instead. Never throws, always exits 0 (1 only in --check with problems).
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readText, parseBrief, parsePlan, headings, harnessVersion, readStdinJson } from './lib.mjs';

const CHECK = process.argv.includes('--check');

export function gather(root) {
  return {
    version: harnessVersion(root),
    brief: parseBrief(readText(root, 'BRIEF.md')),
    plan: parsePlan(readText(root, 'process/PLAN.md')),
    caps: headings(readText(root, 'CAPABILITIES.md')),                 // null if the file is missing
    logEntries: (readText(root, 'process/LOG.md') || '').match(/^## \d{4}-/gm)?.length ?? 0,
    templateClaudeMd: existsSync(join(root, 'CLAUDE.md')),
  };
}

function sessionOutput(s) {
  const { brief: b, plan: p } = s;
  const briefPart = !b.exists ? 'BRIEF.md missing' : `brief ${b.filled}/${b.total}${b.gateOff ? ' · gate OFF' : ''}`;
  const planPart = !p.exists ? 'no plan yet' : p.complete ? `plan complete (${p.total} steps)` : `plan ${p.done}/${p.total} done`;
  const capsPart = s.caps ? `${s.caps.length} capabilities` : 'no CAPABILITIES.md';
  const ctx = [`Process harness v${s.version} is active.`];
  if (p.exists && p.complete) {
    ctx.push(`The plan is complete (process/PLAN.md, ${p.total} steps done or dropped; process/LOG.md has ${s.logEntries} entries). ` +
      'Open with what the last LOG entry decided and that the plan is complete. Name any sentence in BRIEF.md the demo now ' +
      'contradicts and offer to update it in the student\'s words. Then offer: a tweak, a new step the student sizes (numbering ' +
      'continues), a polish bundle (rule 3), /retro. Do not replay the brief.');
  } else if (p.exists) {
    ctx.push(`A plan exists (process/PLAN.md, ${p.done}/${p.total} steps done; process/LOG.md has ${s.logEntries} entries). ` +
      'Open with what the last LOG entry decided and propose the next planned step; a tweak from the last report rides along. ' +
      'Do not replay the brief or ask brief questions.');
  } else if (!b.exists) {
    ctx.push('BRIEF.md is missing. Tell the student this does not look like a harness-equipped template folder and suggest /harness-check. Do not build.');
  } else if (b.missing.length) {
    ctx.push(`BRIEF.md has ${b.filled}/${b.total} required sections. Empty: ${b.missing.join(', ')}. ` +
      'Open with one line naming them; the student writes them in their own words (by hand, from notes, with any tool). ' +
      'If they paste text, place it under the right headings verbatim and confirm. Do not interview section by section, do not build.' +
      (b.gateOff ? ' Note: the brief gate is switched off in BRIEF.md.' : ' A hook refuses edits under src/ until the brief is complete.'));
  } else {
    ctx.push('BRIEF.md is complete and there is no plan yet. Run /brief: play the brief back in 3-4 sentences, ' +
      'ask at most two clarifying questions, then write process/PLAN.md and ask "change anything?".');
  }
  ctx.push(s.caps
    ? `CAPABILITIES.md blocks (${s.caps.length}): ${s.caps.join(', ')}. Use the ones a step needs, never one because it exists; copy the snippet; never open src/blocks/. ` +
      'After every build: npm run check, then npm run screenshot and look at test-results/scene-headset.png before the verify card.'
    : 'CAPABILITIES.md was not found: this may not be the template folder. Work from the template\'s root CLAUDE.md only and do not invent block names.');
  return {
    systemMessage: `Process harness v${s.version} · ${briefPart} · ${planPart} · ${capsPart} · /harness-check for details`,
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
