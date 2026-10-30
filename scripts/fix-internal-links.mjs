// Internal links must end in a slash: without it Cloudflare 307s to the
// trailing-slash form, and worker.js then 301s again. Only markdown link
// targets that are site-relative are touched, so prose parentheses and
// external URLs are left alone.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(md|json)$/.test(p)) files.push(p);
  }
})('src/content');

const RE = /\]\((\/(?!\/)[^)\s#?]*?)(?=[)#?\s])/g;
let changed = 0;

for (const f of files) {
  const before = readFileSync(f, 'utf8');
  let n = 0;
  const after = before.replace(RE, (m, path) => {
    if (path.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(path)) return m;
    n++;
    return `](${path}/`;
  });
  if (after !== before) {
    writeFileSync(f, after);
    changed++;
    console.log('patched', f, n);
  }
}
console.log('files changed:', changed);
