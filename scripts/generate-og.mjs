// Generates Open Graph images (1200x630 PNG) from an SVG template using sharp.
// Run locally after adding/changing SIM providers, then commit the PNGs:
//   node scripts/generate-og.mjs                 # everything
//   node scripts/generate-og.mjs airalo giffgaff # only these slugs
// PNGs are committed (not generated in CI) so builds never depend on server fonts.
// Passing slugs keeps the diff to the images that actually changed — PNG bytes
// differ between sharp builds, so a full re-run rewrites all of them.
import sharp from 'sharp';
import { mkdir, readdir, readFile } from 'node:fs/promises';

const W = 1200;
const H = 630;
const OUT = 'public/og';
const only = new Set(process.argv.slice(2));
const wanted = (slug) => only.size === 0 || only.has(slug);

// Mark inverted for dark grounds: white body, ink pads, one accent pad.
const chip = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <rect x="0" y="0" width="64" height="76" rx="9" fill="#f5f7f8"/>
    <path d="M20 12h10a16 16 0 0 1 16 16v14a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V20a8 8 0 0 1 8-8z" fill="#0d131a"/>
    <rect x="18" y="18" width="11" height="9" rx="1.5" fill="#f5f7f8"/>
    <rect x="31" y="18" width="11" height="9" rx="1.5" fill="#0f4c81"/>
    <rect x="18" y="29" width="11" height="9" rx="1.5" fill="#f5f7f8"/>
    <rect x="31" y="29" width="11" height="9" rx="1.5" fill="#f5f7f8"/>
  </g>`;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SANS = "'Segoe UI', 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const MONO = "Consolas, 'SF Mono', Menlo, 'Courier New', monospace";

// Dark ink card, hairline rules, one accent bar. No gradient, no glow: the
// violet wash these cards used to carry was the loudest "AI template" tell on
// the one asset that travels furthest (social, chat unfurls).
function svg({ title, subtitle, meta = '', big = false }) {
  const titleSize = big ? 80 : 62;
  // Long titles overflow the 1200px canvas — shrink the font until it fits
  // (~0.56em average glyph width for a semibold sans).
  const effSize = Math.max(38, Math.min(titleSize, Math.floor(1020 / (title.length * 0.56))));
  const titleY = 340;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0d131a"/>
  <rect x="0" y="0" width="${W}" height="5" fill="#0f4c81"/>
  ${chip(80, 66, 1.15)}
  <text x="188" y="118" font-family="${MONO}" font-size="26" letter-spacing="4" fill="#8fa0b1">SIMDIRS</text>
  <text x="188" y="150" font-family="${MONO}" font-size="18" letter-spacing="3.5" fill="#4e5f70">SIM / ESIM INDEX</text>
  <line x1="80" y1="228" x2="1120" y2="228" stroke="#22303d" stroke-width="1"/>
  <text x="80" y="${titleY}" font-family="${SANS}" font-size="${effSize}" font-weight="600" letter-spacing="-1.5" fill="#f4f7f9">${escape(title)}</text>
  <text x="80" y="${titleY + 74}" font-family="${MONO}" font-size="28" fill="#93a3b3">${escape(subtitle)}</text>
  <text x="80" y="${titleY + 126}" font-family="${MONO}" font-size="20" letter-spacing="1.5" fill="#5b6b7b">${escape(meta.toUpperCase())}</text>
  <line x1="80" y1="530" x2="1120" y2="530" stroke="#22303d" stroke-width="1"/>
  <text x="80" y="578" font-family="${MONO}" font-size="24" letter-spacing="1" fill="#6f8090">simdirs.com</text>
  <rect x="1046" y="562" width="74" height="3" fill="#0f4c81"/>
</svg>`;
}

async function render(name, data) {
  await sharp(Buffer.from(svg(data))).png().toFile(`${OUT}/${name}.png`);
  console.log(`✓ ${OUT}/${name}.png`);
}

await mkdir(OUT, { recursive: true });
if (wanted('default')) {
  await render('default', {
    title: 'Travel SIM & eSIM Directory',
    subtitle: 'What it costs, where it exits, how long it lasts',
  });
}

for (const file of await readdir('src/content/sims')) {
  if (!file.endsWith('.json')) continue;
  const slug = file.replace('.json', '');
  if (!wanted(slug)) continue;
  const d = JSON.parse(await readFile(`src/content/sims/${file}`, 'utf8'));
  // plansFrom 0 means a free trial / free-to-apply line, never "$0.00".
  const price = Number(d.plansFrom) > 0 ? `From $${Number(d.plansFrom).toFixed(2)}` : 'Free tier';
  // Single-country listings (coverage 1) would read "1+ countries" here.
  const reach = Number(d.coverage) <= 1 ? '1 country' : `${d.coverage}+ countries`;
  await render(`sims-${slug}`, {
    title: d.name.en,
    subtitle: `${price} · ${reach} · ${d.network.en}`,
    meta: `checked ${d.updatedAt}`,
    big: true,
  });
}

// News posts: per-post OG image (title + date), wired via NewsDetailView.
// ZH and EN share one image keyed by slug — the EN title renders on it.
for (const file of await readdir('src/content/news/en')) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace('.md', '');
  if (!wanted(slug)) continue;
  const raw = await readFile(`src/content/news/en/${file}`, 'utf8');
  // Content files are checked out with CRLF on Windows, so the fence has to
  // tolerate \r\n or every post is skipped without a word.
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) continue;
  const title = (fm[1].match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1];
  // `m` matters: without it `^` only matches the start of the frontmatter
  // block, so the date silently came back empty.
  const date = (fm[1].match(/^date:\s*(\S+)/m) || [])[1] || '';
  if (!title) continue;
  await render(`news-${slug}`, { title, subtitle: 'Field note', meta: `published ${date}` });
}
