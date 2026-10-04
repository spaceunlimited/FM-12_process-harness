#!/usr/bin/env node
// PreToolUse (Edit|Write|MultiEdit|NotebookEdit). The gate only exists before the plan:
// while process/PLAN.md does not exist, edits under src/ wait for the five required brief sections.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projectRoot, readText, parseBrief, isUnderSrc, readStdinJson } from './lib.mjs';

const allow = () => process.exit(0);                        // silence = no opinion; normal permission flow continues
try {
  const input = await readStdinJson();
  const root = projectRoot(input);
  const file = input.tool_input?.file_path || input.tool_input?.notebook_path;
  if (!isUnderSrc(root, input.cwd, file)) allow();          // BRIEF.md, process/, .claude/, anything else: fine
  if (existsSync(join(root, 'process/PLAN.md'))) allow();   // past the brief: the gate never speaks again
  const brief = parseBrief(readText(root, 'BRIEF.md'));
  if (brief.gateOff || brief.missing.length === 0) allow();
  const n = brief.missing.length, names = brief.missing.join(', ');
  process.stdout.write(JSON.stringify({
    systemMessage: `Brief first: ${n} section${n > 1 ? 's' : ''} of BRIEF.md still empty (${names}). src/ waits until then.`,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `Brief first. BRIEF.md is ${brief.filled}/${brief.total}: ${names} still show "> (your answer)". ` +
        'The student writes those sections in their own words (keep the "## " headings as they are). ' +
        'Once the brief is complete, run /brief to play it back and write the plan; after that this gate is silent. ' +
        'To build without a brief, change the line in BRIEF.md to "Brief gate: off".',
    },
  }));
} catch { /* a broken gate must never lock the project */ }
process.exit(0);
