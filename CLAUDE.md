# SimDirs — Agent Guide (hermes)

Static bilingual (EN default at `/`, ZH at `/zh/`) SIM card directory built with Astro.
There is **no backend/CMS** — all content lives in files under `src/content/` and is managed exclusively by the agent.

## Commands

- Dev server: `npx astro dev --background` (stop with `npx astro dev stop`, logs with `npx astro dev logs`)
- Build (always run to validate changes): `npm run build`
- Preview built site: `npm run preview`

## Managing SIM card listings (`src/content/sims/*.json`)

- One JSON file per provider. **Filename = URL slug** (kebab-case, ASCII only), e.g. `airalo.json` → `/sims/airalo/` and `/zh/sims/airalo/`.
- Localized fields (`name`, `tagline`, `description`, `features`) MUST contain both `en` and `zh` keys.
- `regions` values are restricted to: `global, asia, europe, north-america, south-america, africa, oceania, middle-east`.
- `device` is one of `esim | physical | both`; `plansFrom` is a USD number; `rating` is 0–5; `updatedAt` is `YYYY-MM-DD`.
- To feature a provider on the homepage, set `"featured": true` (keep ≤ 6).
- Schema is defined in `src/content.config.ts` — the build fails on invalid data.
- After adding/changing a provider, run `npm run og` to regenerate its Open Graph image (`public/og/sims-<slug>.png`) and commit the PNG. PNGs are committed so CI never depends on font rendering.

## Managing news posts (`src/content/news/{en,zh}/*.md`)

- Markdown files, one per language, **paired by identical filename**: `en/my-post.md` + `zh/my-post.md`. Both must exist (keeps hreflang/SEO valid). Filenames = URL slugs, kebab-case ASCII.
- Frontmatter (in the post's own language):
  ```yaml
  ---
  lang: en            # or zh — must match the folder
  title: ...          # quote it if it contains a colon
  description: ...    # 1–2 sentences, used for meta description & cards
  date: YYYY-MM-DD
  tags: [tag1, tag2]  # optional
  ---
  ```
- Internal links must use locale-prefixed paths: `/sims/x` in EN posts, `/zh/sims/x` in ZH posts.

## Editing UI text & SEO strings

All interface labels (nav, buttons, region names, SEO titles/descriptions) live in `src/i18n/ui.ts`. Keep `en` and `zh` keys in sync.

## Deployment notes

- The site URL is resolved at build time in `astro.config.mjs`, priority: `SITE_URL` env var → `CF_PAGES_URL` (auto-injected by Cloudflare Pages) → local fallback. Canonical URLs, sitemap, RSS and robots.txt all derive from it.
- On **Cloudflare Workers Builds** (no URL env var is injected): set `SITE_URL=https://<name>.<subdomain>.workers.dev` (or the custom domain) once under Settings → Build → Environment variables. Preview deployments still canonical to `SITE_URL`, which is the SEO-correct behavior.
- Deploy config is `wrangler.jsonc` (assets-only static deploy, no adapter, no bindings). CI: build `npm run build`, deploy `npx wrangler deploy`.
- Sitemap is generated at `/sitemap-index.xml`; feeds at `/rss.xml` (EN) and `/zh/rss.xml` (ZH).
- IndexNow (`astro-indexnow` integration) submits new/changed pages to search engines after each build. **Always commit `.astro-indexnow-cache.json`** — CI builds are ephemeral and without the cache every build resubmits all URLs. The key verification file is `public/<key>.txt`; the key itself is set in `astro.config.mjs` (overridable via `INDEXNOW_KEY` env var).

## Documentation

- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
