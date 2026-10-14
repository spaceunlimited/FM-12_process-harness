// The /harness-check report. Imported by session-start.mjs --check. Plain text, for the student.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { EXPECTED, MINE } from './lib.mjs';

const HARNESS_PATHS = ['.claude/', 'process/'];                       // plus any round's BRIEF (see isHarness)
const isHarness = (p) => HARNESS_PATHS.some((h) => p === h || p.startsWith(h)) || MINE.test(p);
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
    if (isHarness(p)) { if (code === '??') harnessUntracked = true; }              // harness files: untracked or committed, both fine
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
  out += 'rounds\n';
  if (!s.rounds[0].brief.exists) { problems++; out += row('MISSING', 'BRIEF.md'); }
  for (const r of s.rounds) {
    const planPart = !r.plan.exists ? 'no plan yet'
      : r.plan.complete ? `plan complete (${r.plan.total} rows)` : `plan ${r.plan.done}/${r.plan.total} done`;
    out += row(r.n === s.round ? 'now' : '', r.brief.exists
      ? `round ${r.n}  (${r.briefRel})  brief ${r.brief.filled}/${r.brief.total}` +
        (r.brief.missing.length ? ` · empty: ${r.brief.missing.join(', ')}` : '') + ` · ${planPart}`
      : `round ${r.n}  ${r.briefRel} is not there  · ${planPart}`);
  }
  out += row('', `gate: ${s.rounds[0].plan.exists ? 'silent for good (round 1 has a plan)'
    : s.rounds[0].brief.gateOff ? 'OFF (Brief gate: off)' : 'on (src/ waits for the round 1 brief)'}`);
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
    out += row('', `${g.stepCommits} step commit(s)  (one per logged step: "Step <round>.<k>: <name>")`);
    if (g.yours.length) out += row('yours', `src/experience/, public/, tools/: ${g.yours.length} file(s) changed  (your demo; expected)`);
    if (g.other.length) out += row('note', `other untracked files: ${g.other.join(', ')}  (not from the harness)`);
  }
  out += `\nresult: ${problems ? `PROBLEM — ${problems} item(s) above need attention` : 'OK — harness complete, template untouched'}\n`;
  return { text: out, ok: problems === 0 };
}
