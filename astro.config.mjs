// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import indexnow from 'astro-indexnow';

// Deployment URL, resolved at build time (Astro config runs in Node, so any env var is readable):
// 1. SITE_URL   — set once in Cloudflare Workers Builds settings (or CI) to your workers.dev / custom domain
// 2. CF_PAGES_URL — auto-injected by Cloudflare Pages, no setup needed
// 3. fallback   — local builds
const site =
  process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'https://simdirs.com';

// Per-URL lastmod, taken from the content itself: `updatedAt` for providers and
// the post date for articles. A single build-time timestamp told search engines
// that all 108 pages changed on every deploy, which is both false and useless.
const lastmodByPath = (() => {
  /** @type {Map<string, Date>} */
  const map = new Map();
  const newest = { date: new Date(0) };

  for (const file of readdirSync('src/content/sims').filter((f) => f.endsWith('.json'))) {
    const { updatedAt } = JSON.parse(readFileSync(`src/content/sims/${file}`, 'utf8'));
    const date = new Date(updatedAt);
    // Provider pages are shared between locales and carry one update date.
    for (const prefix of ['', '/zh']) {
      map.set(`${prefix}/sims/${file.replace('.json', '')}/`, date);
    }
    if (date > newest.date) newest.date = date;
  }

  for (const lang of ['en', 'zh']) {
    for (const file of readdirSync(`src/content/news/${lang}`).filter((f) => f.endsWith('.md'))) {
      const raw = readFileSync(`src/content/news/${lang}/${file}`, 'utf8');
      const match = raw.match(/^date:\s*(\S+)/m);
      if (!match) continue;
      const date = new Date(match[1]);
      const path = `/news/${file.replace('.md', '')}/`;
      map.set(lang === 'zh' ? `/zh${path}` : path, date);
      if (date > newest.date) newest.date = date;
    }
  }

  for (const path of ['/', '/sims/', '/news/']) {
    map.set(path, newest.date);
    map.set(path === '/' ? '/zh/' : `/zh${path}`, newest.date);
  }

  return map;
})();

// IndexNow key. The matching verification file lives at public/<key>.txt and is
// served at the site root — the key is public by design (env var can override).
const INDEXNOW_KEY = 'edcf517ad82d3aad30ff0d61ba5eaf31';

export default defineConfig({
  site,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    // lastmod MUST be a Date object — a string logs "[WARN] Invalid input:
    // expected date…" and emits ZERO lastmod tags (verified on aixcove).
    // @astrojs/sitemap validates it with z.date() but ships a `string` type in
    // its .d.ts, hence the cast.
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const date = lastmodByPath.get(path);
        /** @type {any} */ const lastmod = date;
        return date ? { ...item, lastmod } : item;
      },
    }),
    compress(),
    indexnow({
      key: process.env.INDEXNOW_KEY ?? INDEXNOW_KEY,
    }),
  ],
});
