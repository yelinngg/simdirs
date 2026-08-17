// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Deployment URL, resolved at build time (Astro config runs in Node, so any env var is readable):
// 1. SITE_URL   — set once in Cloudflare Workers Builds settings (or CI) to your workers.dev / custom domain
// 2. CF_PAGES_URL — auto-injected by Cloudflare Pages, no setup needed
// 3. fallback   — local builds
const site =
  process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? 'https://simdirs.com';

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
  integrations: [sitemap()],
});
