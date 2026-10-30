// Deploy pre-check: every internal href in dist/ must resolve to a built file.
// The build minifies HTML and drops attribute quotes, so the pattern accepts
// `href="/x/"` and `href=/x/` alike. Run after `npm run build`.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(DIST);

const targets = new Set(files.map((f) => '/' + relative(DIST, f).split('\\').join('/')));
const HREF = /href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

const missing = new Map();
const noSlash = [];
let count = 0;

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const page = '/' + relative(DIST, f).split('\\').join('/');

  for (const m of html.matchAll(HREF)) {
    const href = (m[1] ?? m[2] ?? m[3] ?? '').split('#')[0].split('?')[0];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    count++;

    if (/\.(xml|png|svg|txt|ico|woff2|css|js|webmanifest)$/.test(href)) {
      if (!existsSync(join(DIST, href))) missing.set(href, (missing.get(href) ?? new Set()).add(page));
      continue;
    }

    // A link without the trailing slash costs an extra 307 before the 301 in
    // worker.js, so flag it rather than let it pass silently.
    if (!href.endsWith('/')) noSlash.push([page, href]);
    const asIndex = href.endsWith('/') ? href + 'index.html' : href + '/index.html';
    if (!targets.has(asIndex)) missing.set(href, (missing.get(href) ?? new Set()).add(page));
  }
}

console.log(`pages ${files.length} · internal hrefs ${count} · missing ${missing.size} · no-slash ${noSlash.length}`);
for (const [href, pages] of [...missing].slice(0, 20)) console.log('  MISSING', href, '<-', [...pages].slice(0, 3).join(' '));
for (const [p, h] of noSlash.slice(0, 20)) console.log('  NO-SLASH', p, h);

if (missing.size || noSlash.length) process.exit(1);
