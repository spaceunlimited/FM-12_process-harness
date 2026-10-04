// Shared by session-start.mjs, brief-gate.mjs and check.mjs. Node >= 20, no dependencies.
import { readFileSync } from 'node:fs';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED = ['Concept', 'Target device', 'What the room provides',
  'Key moment and key interaction', 'What can be faked'];               // Fidelity is pre-filled
export const PLACEHOLDER = '> (your answer)';
export const EXPECTED = ['.claude/CLAUDE.md', '.claude/settings.json', '.claude/hooks/lib.mjs',
  '.claude/hooks/session-start.mjs', '.claude/hooks/brief-gate.mjs', '.claude/hooks/check.mjs',
  '.claude/rules/experience.md', '.claude/rules/engine.md',
  '.claude/skills/brief/SKILL.md', '.claude/skills/brief/PLAN-TEMPLATE.md',
  '.claude/skills/next-step/SKILL.md', '.claude/skills/fake-it/SKILL.md', '.claude/skills/verify/SKILL.md',
  '.claude/skills/log/SKILL.md', '.claude/skills/retro/SKILL.md',
  '.claude/skills/create-skill/SKILL.md', '.claude/skills/create-skill/TEMPLATE.md',
  '.claude/skills/harness-check/SKILL.md',
  'BRIEF.md', 'process/INSTALL.md', 'process/WHY.md', 'process/LOG.md'];
export const STALE = ['.claude/agents/critic.md'];                      // v1.0 files that --update removes

export function projectRoot(input = {}) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd
    || resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');    // .claude/hooks -> root
}

export function readText(root, rel) {                                    // null if missing, never throws
  try { return readFileSync(join(root, rel), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); }
  catch { return null; }
}

export function parseBrief(text) {
  if (text == null) return { exists: false, filled: 0, total: REQUIRED.length, missing: REQUIRED, gateOff: false };
  const bodies = {};
  for (const chunk of text.split(/^## +/m).slice(1)) {
    const nl = chunk.indexOf('\n');
    const name = chunk.slice(0, nl < 0 ? undefined : nl).replace(/\s*\(.*$/, '').trim().toLowerCase();
    bodies[name] = (nl < 0 ? '' : chunk.slice(nl + 1)).replace(/<!--[\s\S]*?-->/g, '');
  }
  const unfilled = (b) => b === undefined || b.includes(PLACEHOLDER) || b.trim() === '';
  const missing = REQUIRED.filter((n) => unfilled(bodies[n.toLowerCase()]));
  return { exists: true, filled: REQUIRED.length - missing.length, total: REQUIRED.length, missing,
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
