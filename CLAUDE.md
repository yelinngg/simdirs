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
- `plansFrom: 0` means "free trial / free to apply" and renders as *Free tier* instead of `$0.00`; the Product JSON-LD omits `offers` for those entries. Never use 0 as a placeholder for an unknown price.
- To feature a provider on the homepage, set `"featured": true`. The homepage grid is 3×3, so keep exactly 9 featured — if fewer are marked, the gap is filled with the next best ratings, which muddies what "featured" means.
- Schema is defined in `src/content.config.ts` — the build fails on invalid data.
- After adding/changing a provider, regenerate its Open Graph image and commit the PNG: `npm run og -- <slug>` (bare `npm run og` re-renders all 51 and rewrites every file, because PNG bytes differ between sharp builds).

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

## Writing style (applies to every string users can read)

The site is written as one editor's notes, not as marketing copy. Rules that keep it that way:

- **Open with the concrete thing, not the category.** "Prepaid data in 200+ destinations, from $4 for 1GB/3 days" beats "the world's leading eSIM marketplace".
- **One number or clause per sentence.** If a sentence has no fact in it, delete it.
- **No em dashes as glue in short strings.** Labels, taglines and "who it is for" lines use a comma, a colon, parentheses or a second sentence. Long-form notes may still use `——` where Chinese prose calls for it, just not as the default connector.
- **Avoid the stock adjective set:** seamless, robust, flexible, affordable, premium, privacy-first, all-in-one, 一站式, 灵活, 实惠, 全方位, 赋能. If a claim needs one of these, it needs evidence instead.
- **Say the downside in the same breath as the upside.** Every "who it is for" line carries its cost ("每 GB 贵一点，换来基本不出问题").
- **Keep the sourcing visible.** Verified facts cite the date (`官方 2026-09`); community reports say so and are marked unverified.
- Do not stack parallel triads ("coverage, price and validity, all in one place"). Vary sentence length instead.

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
