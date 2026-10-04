// The /harness-check report. Imported by session-start.mjs --check. Plain text, for the student.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { EXPECTED } from './lib.mjs';

const HARNESS_PATHS = ['.claude/', 'BRIEF.md', 'process/'];
const YOURS = ['src/experience/', 'public/', 'tools/'];               // the student's areas: changes here are the work, not a problem
const row = (tag, text) => `  ${tag.padEnd(8)} ${text}\n`;

function git(root) {
  const r = spawnSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: root, encoding: 'utf8' });
  if (r.error?.code === 'ENOENT') return { skip: 'git is not installed; cannot compare. The harness only writes .claude/, BRIEF.md, process/.' };
  if (r.status !== 0) return { skip: 'not a git folder; cannot compare. The harness only writes .claude/, BRIEF.md, process/.' };
  const changed = [], yours = [], other = [];
  let harnessUntracked = false;
  for (const line of r.stdout.split('\n').filter(Boolean)) {
    const code = line.slice(0, 2), p = line.slice(3).replace(/^"|"$/g, '').split(' -> ').pop();
    const harness = HARNESS_PATHS.some((h) => p === h || p.startsWith(h));
    if (harness) { if (code === '??') harnessUntracked = true; }                   // harness files: untracked or committed, both fine
    else if (code === '??') { if (YOURS.some((y) => p.startsWith(y))) yours.push(p); else other.push(p); }
    else if (YOURS.some((y) => p.startsWith(y))) yours.push(p);
    else changed.push(p);
  }
  const log = spawnSync('git', ['log', '--oneline', '--grep=^Step [0-9]'], { cwd: root, encoding: 'utf8' });
  const stepCommits = log.status === 0 ? log.stdout.split('\n').filter(Boolean).length : 0;
  return { changed, yours, other, harnessUntracked, stepCommits };
}

export function report(root, s) {
  let out = `Process harness v${s.version} — check  (${root})\n\nharness files\n`;
  let problems = 0;
  for (const rel of EXPECTED) {
    const ok = existsSync(join(root, rel));
    if (!ok) problems++;
    out += row(ok ? 'ok' : 'MISSING', rel);
  }
  out += 'brief & plan\n';
  if (!s.brief.exists) { problems++; out += row('MISSING', 'BRIEF.md'); }
  else out += row('', `brief ${s.brief.filled}/${s.brief.total}` +
    (s.brief.missing.length ? ` · empty: ${s.brief.missing.join(', ')}` : '') +
    ` · ${!s.plan.exists ? 'no plan yet' : s.plan.complete ? `plan complete (${s.plan.total} steps)` : `plan ${s.plan.done}/${s.plan.total} done`}` +
    ` · gate: ${s.plan.exists ? 'silent (plan exists)' : s.brief.gateOff ? 'OFF (Brief gate: off)' : 'on'}`);
  out += 'template\n'
    + row(s.templateClaudeMd ? 'ok' : 'MISSING', 'CLAUDE.md')
    + row(s.caps ? 'ok' : 'MISSING', `CAPABILITIES.md${s.caps ? `  (${s.caps.length} blocks)` : ''}`)
    + row(existsSync(join(root, 'src/experience/main.ts')) ? 'ok' : 'MISSING', 'src/experience/main.ts');
  if (!s.templateClaudeMd || !s.caps) problems++;
  if (existsSync(join(root, 'scripts/check-standalone.mjs'))) {
    const l = spawnSync(process.execPath, ['scripts/check-standalone.mjs', '--lint-only'], { cwd: root, encoding: 'utf8' });
    out += row(l.status === 0 ? 'ok' : 'CHANGED', 'standalone lint (the template does not mention the harness)');
    if (l.status !== 0) problems++;
  }
  const g = git(root);
  out += 'git\n';
  if (g.skip) out += row('skip', g.skip);
  else {
    if (g.changed.length) {
      problems++;
      out += row('CHANGED', `tracked template files modified: ${g.changed.join(', ')}`)
          +  row('', 'restore with: git checkout -- <file>');
    } else out += row('ok', 'no template file is modified (outside src/experience/, public/, tools/)');
    out += row('ok', g.harnessUntracked ? 'harness files untracked: .claude/, BRIEF.md, process/  (committed with the first logged step)'
                                        : 'harness files committed or unchanged');
    out += row('', `${g.stepCommits} step commit(s)  (one per logged step: "Step k: <name>")`);
    if (g.yours.length) out += row('yours', `src/experience/, public/, tools/: ${g.yours.length} file(s) changed  (your demo; expected)`);
    if (g.other.length) out += row('note', `other untracked files: ${g.other.join(', ')}  (not from the harness)`);
  }
  out += `\nresult: ${problems ? `PROBLEM — ${problems} item(s) above need attention` : 'OK — harness complete, template untouched'}\n`;
  return { text: out, ok: problems === 0 };
}
