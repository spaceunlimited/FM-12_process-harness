// Shared by session-start.mjs, brief-gate.mjs and check.mjs. Node >= 20, no dependencies.
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED = ['Concept', 'Target device', 'What the room provides',
  'Key moment and key interaction', 'What can be faked'];               // Fidelity is pre-filled
export const REQUIRED_ROUND = ['What the last round taught us', 'What this round adds',
  'The key moment now', 'What can still be faked'];                     // round 2+: shorter, it extends
export const PLACEHOLDER = '> (your answer)';
export const EXPECTED = ['.claude/CLAUDE.md', '.claude/settings.json', '.claude/hooks/lib.mjs',
  '.claude/hooks/session-start.mjs', '.claude/hooks/brief-gate.mjs', '.claude/hooks/check.mjs',
  '.claude/rules/experience.md', '.claude/rules/engine.md',
  '.claude/skills/brief/SKILL.md', '.claude/skills/brief/PLAN-TEMPLATE.md',
  '.claude/skills/next-step/SKILL.md', '.claude/skills/fake-it/SKILL.md', '.claude/skills/verify/SKILL.md',
  '.claude/skills/log/SKILL.md', '.claude/skills/retro/SKILL.md',
  '.claude/skills/round/SKILL.md', '.claude/skills/round/ROUND-BRIEF-TEMPLATE.md',
  '.claude/skills/create-skill/SKILL.md', '.claude/skills/create-skill/TEMPLATE.md',
  '.claude/skills/harness-check/SKILL.md',
  'BRIEF.md', 'process/INSTALL.md', 'process/WHY.md', 'process/LOG.md'];
export const STALE = ['.claude/agents/critic.md'];                      // v1.0 files that --update removes
export const MINE = /^(?:BRIEF(?:-\d+)?\.md|process\/(?:PLAN(?:-\d+)?|LOG)\.md)$/;  // the student's writing, any round

export function projectRoot(input = {}) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd
    || resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');    // .claude/hooks -> root
}

export function readText(root, rel) {                                    // null if missing, never throws
  try { return readFileSync(join(root, rel), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); }
  catch { return null; }
}

// Rounds: round 1 is BRIEF.md + process/PLAN.md, round k is BRIEF-k.md + process/PLAN-k.md.
// The current round is the highest one that has a brief; round 1 is always in the list.
export function rounds(root) {
  const seen = new Map();
  const entry = (n) => {
    if (!seen.has(n)) seen.set(n, {
      n,
      briefRel: n === 1 ? 'BRIEF.md' : `BRIEF-${n}.md`,
      planRel: n === 1 ? 'process/PLAN.md' : `process/PLAN-${n}.md`,
      briefExists: false, planExists: false,
    });
    return seen.get(n);
  };
  const scan = (dir, re, key) => {
    try {
      for (const f of readdirSync(join(root, dir))) {
        const m = re.exec(f);
        const n = m ? (m[1] ? Number(m[1]) : 1) : 0;
        if (n >= 1) entry(n)[key] = true;
      }
    } catch { /* unreadable folder: round 1 only */ }
  };
  scan('.', /^BRIEF(?:-(\d+))?\.md$/, 'briefExists');
  scan('process', /^PLAN(?:-(\d+))?\.md$/, 'planExists');
  entry(1);
  const list = [...seen.values()].sort((a, b) => a.n - b.n);
  const withBrief = list.filter((r) => r.briefExists);
  const current = withBrief.at(-1) || list[0];
  return { list, current, previous: list.find((r) => r.n === current.n - 1) || null };
}

export const requiredFor = (n) => (n > 1 ? REQUIRED_ROUND : REQUIRED);

export function parseBrief(text, required = REQUIRED) {
  if (text == null) return { exists: false, filled: 0, total: required.length, missing: required, gateOff: false };
  const bodies = {};
  for (const chunk of text.split(/^## +/m).slice(1)) {
    const nl = chunk.indexOf('\n');
    const name = chunk.slice(0, nl < 0 ? undefined : nl).replace(/\s*\(.*$/, '').trim().toLowerCase();
    bodies[name] = (nl < 0 ? '' : chunk.slice(nl + 1)).replace(/<!--[\s\S]*?-->/g, '');
  }
  const unfilled = (b) => b === undefined || b.includes(PLACEHOLDER) || b.trim() === '';
  const missing = required.filter((n) => unfilled(bodies[n.toLowerCase()]));
  return { exists: true, filled: required.length - missing.length, total: required.length, missing,
           gateOff: /^\s*Brief gate:\s*off\s*$/im.test(text) };
}

export function parsePlan(text) {
  if (text == null) return { exists: false, done: 0, total: 0, complete: false };
  const rows = text.split('\n').filter((l) => /^\|\s*\d+\s*\|/.test(l));
  const status = (l) => (/\|\s*(\w+)\s*\|?\s*$/.exec(l)?.[1] || '').toLowerCase();
  const done = rows.filter((l) => status(l) === 'done').length;
  const open = rows.filter((l) => !['done', 'dropped'].includes(status(l))).length;
  return { exists: true, done, total: rows.length, complete: rows.length > 0 && open === 0 };
}

export const headings = (text) =>
  text == null ? null : [...text.matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1]);

export function harnessVersion(root) {
  const first = (readText(root, '.claude/CLAUDE.md') || '').split('\n')[0];
  return /process harness v([\w.]+)/i.exec(first)?.[1] || '?';
}

export function isUnderSrc(root, cwd, filePath) {                        // abs or rel, / or \, any case
  if (!filePath) return false;
  const rel = relative(root, resolve(cwd || root, filePath)).split(sep).join('/').toLowerCase();
  return rel === 'src' || rel.startsWith('src/');                        // '../x' and other drives fall through
}

export async function readStdinJson() {
  if (process.stdin.isTTY) return {};                                    // run by hand: don't block
  let s = '';
  for await (const c of process.stdin) s += c;
  try { return JSON.parse(s); } catch { return {}; }
}
