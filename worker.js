// simdirs canonical-host worker: www -> apex 301, single hop.
// Uses the ASSETS binding for all normal traffic; binding must be declared
// in wrangler.jsonc (assets.binding = "ASSETS") and run_worker_first = true.
const HOST_REDIR = [
  { from: "www.simdirs.com", to: "https://simdirs.com", code: 301 },
];

// EN is the default locale at "/", so /en and /en/ have no page. Bing has
// been probing both (4xx crawl noise since launch); 301 them to the correct
// canonical instead of serving the assets 404.
const PATH_REDIR = [
  { prefix: "/en", code: 301 },
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
      // match "/en" exactly or any "/en/..." path; strip the segment
      if (url.pathname === r.prefix || url.pathname.startsWith(r.prefix + "/")) {
        const rest = url.pathname.slice(r.prefix.length);
        const dest = new URL((rest || "/") + url.search, "https://simdirs.com");
        return Response.redirect(dest.href, r.code);
      }
    }
    // normal traffic -> static assets; guard against missing binding so a
    // config regression 500s loudly in tail instead of silently.
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return new Response(
      "asset binding unavailable — check wrangler.jsonc assets.binding",
      { status: 502, headers: { "content-type": "text/plain" } }
    );
  },
};
