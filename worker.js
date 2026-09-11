// simdirs canonical-host worker: www -> apex 301, single hop.
// Uses the ASSETS binding for all normal traffic; binding must be declared
// in wrangler.jsonc (assets.binding = "ASSETS") and run_worker_first = true.
const HOST_REDIR = [
  { from: "www.simdirs.com", to: "https://simdirs.com", code: 301 },
];

// EN is the default locale at "/", so /en and /en/ have no page. Bing has
// been probing both (4xx crawl noise since launch); 301 them to the correct
// canonical instead of serving the assets 404.
// 2026-09-11: legacy /post/* URLs still holding Bing impressions (12i total)
// were 404ing after the content restructure; mapped to the closest live page.
const PATH_REDIR = [
  { prefix: "/en", code: 301 },
  { from: "/post/hong-kong-sim-card-esim-guide-2026", to: "/sims/3hk-diy/", code: 301 },
  { from: "/post/united-kingdom-sim-card-esim-guide-2026", to: "/sims/giffgaff/", code: 301 },
  { from: "/post/united-states-sim-card-esim-guide-2026", to: "/news/how-to-choose-travel-esim-2026/", code: 301 },
  { from: "/post/eskimo-esim-review", to: "/sims/", code: 301 },
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    for (const r of HOST_REDIR) {
      if (url.hostname === r.from) {
        const dest = new URL(url.pathname + url.search, r.to);
        return Response.redirect(dest.href, r.code);
      }
    }
    for (const r of PATH_REDIR) {
      // exact-match entries first (from+to), then prefix entries
      if (r.from) {
        if (url.pathname === r.from) {
          return Response.redirect(new URL(r.to, "https://simdirs.com").href, r.code);
        }
        continue;
      }
      // match "/en" exactly or any "/en/..." path; strip the segment
      if (url.pathname === r.prefix || url.pathname.startsWith(r.prefix + "/")) {
        const rest = url.pathname.slice(r.prefix.length);
        const dest = new URL((rest || "/") + url.search, "https://simdirs.com");
        return Response.redirect(dest.href, r.code);
      }
    }
    // normal traffic -> static assets; binding must be declared
    // in wrangler.jsonc (assets.binding = "ASSETS") + run_worker_first = true.
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      // Static-asset 307s (no-slash -> slash) are temporary by default; make
      // them permanent 301s so crawlers consolidate link equity on one form.
      const res = await env.ASSETS.fetch(request);
      if (res.status === 307 || res.status === 302) {
        const loc = res.headers.get("Location");
        if (loc) {
          return new Response(null, {
            status: 301,
            headers: { Location: loc, "Cache-Control": "public, max-age=3600" },
          });
        }
      }
      return res;
    }
    return new Response(
      "asset binding unavailable — check wrangler.jsonc assets.binding",
      { status: 502, headers: { "content-type": "text/plain" } }
    );
  },
};
