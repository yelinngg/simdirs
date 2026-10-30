# SimDirs

A bilingual travel SIM & eSIM directory. English at `/`, Chinese at `/zh/`.

Every provider is one JSON file, every article is one Markdown pair. There is no
database and no CMS; the site is built by Astro and deployed as static assets on
Cloudflare Workers.

## What is in here

```
src/content/sims/*.json        one provider per file, filename = URL slug
src/content/news/{en,zh}/*.md  articles, paired by identical filename
src/views/*.astro              page bodies, shared by both locales
src/pages/*.astro              thin route wrappers (one per locale)
src/i18n/ui.ts                 every label and SEO string, en + zh
src/lib/queries.ts             collection reads, sorting, static paths
astro.config.mjs               site URL, sitemap lastmod, IndexNow
worker.js                      www→apex, /en, legacy /post/* redirects
```

## Working on it

```sh
npm install
npx astro dev --background     # dev server; logs with `npx astro dev logs`
npm run build                  # astro check + build, must pass before pushing
npm run og                     # regenerate OG PNGs after editing providers/articles
npx wrangler deploy            # ship dist/ to Cloudflare
```

`npm run og` writes into `public/og/`, and those PNGs are committed, so CI never
depends on font rendering.

## Content rules

The full set lives in [AGENTS.md](./AGENTS.md). The three that break the build or
the site if you get them wrong:

- Localized fields need both `en` and `zh`, and articles need both language files.
- `plansFrom: 0` renders as *Free tier*, not `$0.00`. Never use 0 for "unknown".
- Exactly 9 providers carry `featured: true`; the homepage grid is 3×3.

## A note on tone

The copy is deliberately plain: numbers first, no em dashes used as glue, and the
downside is stated next to the upside. AGENTS.md has the checklist. When adding a
provider, match the voice of the neighbouring entries rather than the voice of a
product page.
