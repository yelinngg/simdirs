// Generates Open Graph images (1200x630 PNG) from an SVG template using sharp.
// Run locally after adding/changing SIM providers, then commit the PNGs:
//   node scripts/generate-og.mjs
// PNGs are committed (not generated in CI) so builds never depend on server fonts.
import sharp from 'sharp';
import { mkdir, readdir, readFile } from 'node:fs/promises';

const W = 1200;
const H = 630;
const OUT = 'public/og';

const chip = (x, y, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <rect x="0" y="0" width="64" height="76" rx="10" fill="#4f46e5"/>
    <path d="M22 14h10a16 16 0 0 1 16 16v14a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="#e0e7ff"/>
    <rect x="20" y="20" width="11" height="9" rx="1.5" fill="#4f46e5"/>
    <rect x="33" y="20" width="11" height="9" rx="1.5" fill="#6366f1"/>
    <rect x="20" y="31" width="11" height="9" rx="1.5" fill="#6366f1"/>
    <rect x="33" y="31" width="11" height="9" rx="1.5" fill="#4f46e5"/>
  </g>`;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg({ title, subtitle, big = false }) {
  const titleSize = big ? 84 : 64;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#312e81"/>
      <stop offset="0.55" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1050" cy="90" r="220" fill="#ffffff" opacity="0.06"/>
  <circle cx="130" cy="580" r="180" fill="#ffffff" opacity="0.06"/>
  ${chip(80, 80, 1.6)}
  <text x="80" y="${big ? 400 : 350}" font-family="Arial, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="${titleSize}" font-weight="800" fill="#ffffff">${escape(title)}</text>
  <text x="80" y="${big ? 480 : 440}" font-family="Arial, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        font-size="34" fill="#c7d2fe">${escape(subtitle)}</text>
  <text x="80" y="560" font-family="Arial, 'Segoe UI', sans-serif"
        font-size="30" font-weight="700" fill="#e0e7ff">SimDirs · simdirs.com</text>
</svg>`;
}

async function render(name, data) {
  await sharp(Buffer.from(svg(data))).png().toFile(`${OUT}/${name}.png`);
  console.log(`✓ ${OUT}/${name}.png`);
}

await mkdir(OUT, { recursive: true });
await render('default', {
  title: 'Travel SIM & eSIM Directory',
  subtitle: 'Compare coverage, prices and networks — all in one place',
});

for (const file of await readdir('src/content/sims')) {
  if (!file.endsWith('.json')) continue;
  const slug = file.replace('.json', '');
  const d = JSON.parse(await readFile(`src/content/sims/${file}`, 'utf8'));
  await render(`sims-${slug}`, {
    title: d.name.en,
    subtitle: `From $${Number(d.plansFrom).toFixed(2)} · ${d.coverage}+ countries · ${d.network}`,
    big: true,
  });
}
