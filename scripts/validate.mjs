import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
let failed = false;
const ok = (cond, msg) => {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + msg);
  if (!cond) failed = true;
};

ok(/^\s*<!DOCTYPE html>/i.test(html), 'DOCTYPE vorhanden');
ok(/<title>[^<]+<\/title>/.test(html), '<title> vorhanden');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
ok(scripts.length === 1, 'genau ein <script>-Block');

const tmp = join(mkdtempSync(join(tmpdir(), 'filter-werkstatt-')), 'game.js');
writeFileSync(tmp, scripts.join('\n'));
const check = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
ok(check.status === 0, 'JavaScript-Syntax (node --check)' + (check.status === 0 ? '' : '\n' + check.stderr));

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
const refs = new Set([...scripts.join('\n').matchAll(/e[lm]\('([^']+)'\)/g)].map(m => m[1]));
const dynamicPrefixes = ['lbl-', 'sl-', 'val-'];
const missing = [...refs].filter(r => !ids.has(r) && !dynamicPrefixes.some(p => r.startsWith(p)));
ok(missing.length === 0, 'alle DOM-Referenzen vorhanden' + (missing.length ? ' (fehlt: ' + missing.join(', ') + ')' : ''));

const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
ok(external.length === 0, 'keine externen Ressourcen, Datei laeuft eigenstaendig' + (external.length ? ' (' + external.join(', ') + ')' : ''));

process.exit(failed ? 1 : 0);
