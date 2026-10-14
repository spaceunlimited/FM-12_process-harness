#!/usr/bin/env node
// Installs the process harness into the FM-12 XR sandbox template you are standing in.
// Adds files only. Never overwrites, never deletes anything it did not create.
//   npx -y <this package>             install (skips files that already exist)
//   npx -y <this package> --update    refresh the harness files; keeps every brief, plan and the log
//   npx -y <this package> --remove    delete the harness files; keeps every brief, plan and the log
//   ... --remove --all                also delete those
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'harness');
const DEST = process.cwd();
const args = new Set(process.argv.slice(2));
const { EXPECTED, STALE, MINE } = await import(pathToFileURL(join(SRC, '.claude', 'hooks', 'lib.mjs')).href);
const mine = (rel) => MINE.test(rel);                                       // the student's writing, any round

const fail = (msg) => { console.error(`\n✗ ${msg}\n`); process.exit(1); };
const posix = (p) => p.split(sep).join('/');

if (args.has('--help') || args.has('-h')) {
  console.log('Run this inside your FM-12 template folder.\n  (no flag)   install\n  --update    refresh harness files, keep your briefs, plans and log\n  --remove    delete harness files, keep your briefs, plans and log (--all removes those too)');
  process.exit(0);
}
const looksLikeTemplate = existsSync(join(DEST, 'CAPABILITIES.md')) && existsSync(join(DEST, 'src', 'experience'));
if (!looksLikeTemplate && !args.has('--remove'))
  fail('This does not look like the FM-12 template folder (no CAPABILITIES.md and src/experience/).\n  cd into your template folder, then run the command again.');

if (args.has('--remove')) {
  let removed = 0, kept = [];
  const extra = [];                                                         // later rounds: BRIEF-2.md, process/PLAN-2.md, …
  const scan = (dir, re) => {
    try { for (const f of readdirSync(join(DEST, dir))) if (re.test(f)) extra.push(dir === '.' ? f : `${dir}/${f}`); }
    catch { /* folder not there: nothing to collect */ }
  };
  scan('.', /^BRIEF-\d+\.md$/);
  scan('process', /^PLAN(?:-\d+)?\.md$/);
  for (const rel of [...EXPECTED, ...STALE, ...extra]) {
    const abs = join(DEST, rel);
    if (!existsSync(abs)) continue;
    if (mine(rel) && !args.has('--all')) { kept.push(rel); continue; }
    unlinkSync(abs); removed++;
  }
  // drop the folders we created, but only if they are now empty
  for (const d of ['.claude/skills/brief', '.claude/skills/next-step', '.claude/skills/fake-it', '.claude/skills/verify', '.claude/skills/log',
    '.claude/skills/retro', '.claude/skills/round', '.claude/skills/create-skill', '.claude/skills/harness-check', '.claude/skills',
    '.claude/agents', '.claude/rules', '.claude/hooks', '.claude', 'process']) {
    try { if (existsSync(join(DEST, d)) && readdirSync(join(DEST, d)).length === 0) rmdirSync(join(DEST, d)); } catch { /* leave it */ }
  }
  console.log(`\nprocess harness removed: ${removed} files deleted.` + (kept.length ? `\nkept (yours): ${kept.join(', ')}` : '') +
    '\nRestart Claude Code. The template is as it was.\n');
  process.exit(0);
}

const update = args.has('--update');
let added = 0, updated = 0, kept = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : place(p); } };
const place = (abs) => {
  const rel = posix(relative(SRC, abs)), to = join(DEST, rel);
  if (existsSync(to)) {
    if (update && !mine(rel)) { copyFileSync(abs, to); updated++; } else kept++;
    return;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(abs, to); added++;
};
walk(SRC);
let stale = 0;
if (update) for (const rel of STALE) {                                       // files an older harness had and this one does not
  const abs = join(DEST, rel);
  if (existsSync(abs)) { unlinkSync(abs); stale++; try { if (readdirSync(dirname(abs)).length === 0) rmdirSync(dirname(abs)); } catch { /* leave it */ } }
}
console.log(`\nprocess harness: ${added} files added, ${updated} updated, ${kept} already there and left untouched` + (stale ? `, ${stale} outdated removed` : '') + '.\n');
const check = spawnSync(process.execPath, [join(DEST, '.claude', 'hooks', 'session-start.mjs'), '--check'], { cwd: DEST, stdio: 'inherit' });
console.log(check.status === 0
  ? '\nDone. Quit Claude Code if it is running and start it again in this folder.\n'
  : '\nInstalled, but the check above reports a problem. Read it before you start Claude Code.\n');
