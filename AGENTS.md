# SimDirs — Agent Guide (hermes)

Static bilingual (EN default at `/`, ZH at `/zh/`) SIM card directory built with Astro.
There is **no backend/CMS** — all content lives in files under `src/content/` and is managed exclusively by the agent.

## Commands

- Dev server: `npx astro dev --background` (stop with `npx astro dev stop`, logs with `npx astro dev logs`)
- Build (always run to validate changes): `npm run build`
- Preview built site: `npm run preview`
- Link check after a build: `npm run audit:links` — fails on dead targets and on internal links missing the trailing slash. `npm run links:fix` rewrites those slashes in `src/content`.

## Managing SIM card listings (`src/content/sims/*.json`)

- One JSON file per provider. **Filename = URL slug** (kebab-case, ASCII only), e.g. `airalo.json` → `/sims/airalo/` and `/zh/sims/airalo/`.
- Localized fields (`name`, `tagline`, `description`, `features`) MUST contain both `en` and `zh` keys.
- `regions` values are restricted to: `global, asia, europe, north-america, south-america, africa, oceania, middle-east`.
- `device` is one of `esim | physical | both`; `plansFrom` is a USD number; `rating` is 0–5; `updatedAt` is `YYYY-MM-DD`.
- `plansFrom: 0` means "free trial / free to apply" and renders as *Free tier* instead of `$0.00`; the Product JSON-LD omits `offers` for those entries. Never use 0 as a placeholder for an unknown price.
- To feature a provider on the homepage, set `"featured": true`. The homepage grid is 3×3, so keep exactly 9 featured — if fewer are marked, the gap is filled with the next best ratings, which muddies what "featured" means.
- Schema is defined in `src/content.config.ts` — the build fails on invalid data.
- After adding/changing a provider, regenerate its Open Graph image and commit the PNG: `npm run og -- <slug>` (bare `npm run og` re-renders all 50 and rewrites every file, because PNG bytes differ between sharp builds).
- **Removing or merging a provider**: delete the JSON, delete `public/og/sims-<slug>.png`, then add 301s for both slash forms in `worker.js` (`/sims/<slug>`, `/sims/<slug>/`, plus the `/zh/` pair) and rewrite every inbound link in `src/content/news/`. Leftover links to a deleted slug are the main way a merge leaks traffic.
- Two slugs on the same `website` are always a duplicate: merge into the stronger slug (more inbound links, cleaner brand name) rather than keeping two thin pages, and fold the weaker entry's distinct facts into the survivor so no verified detail is lost.

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

## Interaction rules

- **The directory filter lives in the URL** (`/sims/?q=…&region=…`), written with `replaceState`. Keep it that way: the filter has to survive the trip to a detail page and back, and a filtered view has to be shareable.
- **Search covers what the data actually has**: carrier name, tagline, region labels and network, in both languages, via the `data-search` haystack on each card. There is no per-country field, so the placeholder must not promise country search.
- **Cards are one link each.** The title anchor carries a stretched `::after`; the "Details" row is a `div`, not a second anchor. Do not add nested links inside a card without rethinking that overlay.
- **Anything that hides cards must also hide the frame** — the grid draws its own top/left hairline, so an empty grid reads as a broken table.

## Writing style (applies to every string users can read)

The site is written as one editor's notes, not as marketing copy. Rules that keep it that way:

- **Open with the concrete thing, not the category.** "Prepaid data in 200+ destinations, from $4 for 1GB/3 days" beats "the world's leading eSIM marketplace".
- **One number or clause per sentence.** If a sentence has no fact in it, delete it.
- **No em dashes as glue in short strings.** Labels, taglines and "who it is for" lines use a comma, a colon, parentheses or a second sentence. Long-form notes may still use `——` where Chinese prose calls for it, just not as the default connector.
- **Avoid the stock adjective set:** seamless, robust, flexible, affordable, premium, privacy-first, all-in-one, 一站式, 灵活, 实惠, 全方位, 赋能. If a claim needs one of these, it needs evidence instead.
- **Say the downside in the same breath as the upside.** Every "who it is for" line carries its cost ("每 GB 贵一点，换来基本不出问题").
- **Keep the sourcing visible.** Verified facts cite the date (`官方 2026-09`); community reports say so and are marked unverified.
- Do not stack parallel triads ("coverage, price and validity, all in one place"). Vary sentence length instead.

## Visual system (why the pages look the way they do)

The site reads as a data catalogue, not a landing page. Type and colour carry that, so treat these as rules rather than defaults:

- **Typefaces are self-hosted in `public/fonts/`.** IBM Plex Sans (variable, Latin) for text and headings; IBM Plex Mono for figures, prices, eyebrows, spec keys and dates. No Google Fonts, no third-party font CDN — the `@font-face` blocks live at the top of `src/styles/global.css`. Chinese falls through to the system stack in `--font-sans`.
- **Both font stacks must carry the CJK sans at the tail.** Plex has no Han glyphs, so Chinese inside a mono label (spec keys, section heads, dates — a third of the mono nodes on a detail page) resolves to the first face in the stack that has them. Leave the CJK list off `--font-mono` and Windows drops to the OS *mono* default, SimSun, putting a Song serif next to YaHei body copy. Keep `'PingFang SC' … 'Microsoft YaHei'` after the Latin mono faces and before generic `monospace`.
- **Mono is a signal, not decoration.** Anything that is a number, a label, a key or a timestamp uses `label-mono` (12px, 0.11em tracking, uppercase) or `font-mono`. Never set a sentence in mono.
- **One signal colour: `--color-accent: #0f4c81`.** Links, focus rings, the hero tick, the "best for" rule. Filled surfaces are `ink-950` on white, never accent-blue buttons or gradients.
- **Neutrals stay one step darker than they look right.** `ink-500` is the floor for informational small text (5.7:1 on white); `ink-400` is for rules, icons and marks only. Do not reintroduce `#95a1ac`-grade greys for labels — at 10px they read as washed out and fail contrast.
- **Nothing informational sits below 12px.** `label-mono` is 12px and every label inherits it; only the device chip and the logo kicker (both 11px) are smaller, because they are marks, not information. Per-instance `text-[10px]` overrides on `label-mono` are how the small type drifted before — do not add them back.
- **A phone detail page answers price, validity and IP exit before the article.** The sidebar column stacks *below* every section on a phone, so those three facts once sat 3,000px down. `SimDetailView` prints a `lg:hidden` "at a glance" list under the header; the full spec table stays where it is. Do not remove one without the other.
- **Grids are hairline-separated, not gapped.** A card row is `grid border-t border-l border-line` with each cell carrying `border-r border-b`, so a short final row cannot leave grey patches behind. Do not go back to `gap-px` + a background colour.
- **Mobile is verified at 390px, not at a desktop window resized.** Chrome on Windows will not open narrower than ~500px; use a 390px iframe on the built site, and check `documentElement.scrollWidth` for overflow. Any single-column `grid` needs explicit `grid-cols-1` (`minmax(0,1fr)`), otherwise the implicit `auto` column sizes to max-content and the page scrolls sideways.
- **The bottom card row states a fact, never a bare imperative.** Notes read `5 min read` / `约 5 分钟`, computed by `readingTime()` in `src/lib/format.ts` — not `Read`. A single word there left the row mostly empty with the arrow stranded at the far edge, which is what made the old cards look unfinished. The figure is the anchor; the arrow stays the only affordance.

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
