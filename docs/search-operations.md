# SZARA search operations

Search Console: https://search.google.com/search-console — verify domain property, submit https://withszara.com/sitemap.xml, inspect priority URLs and check AI feature inclusion if offered. Google Indexing API is not for general service pages.

Bing Webmaster Tools: https://www.bing.com/webmasters — import verified Search Console property or verify domain, submit sitemap, inspect URLs and view AI citations when available. IndexNow key is publicly hosted and submission is automated via GitHub Actions; HTTP 200/202 means accepted or pending verification, not guaranteed indexing.

Cloudflare: AI Crawl Control and Security Events — allow verified Googlebot, Bingbot, OAI-SearchBot and other desired search bots, including PerplexityBot where available. Review WAF and managed robots.txt; do not disable site-wide protections. Training bot policies are separate. Existing robots.txt permits all crawlers; this does not prove Cloudflare allows them.

Cloudflare Redirect Rules: configure permanent 301 exact-path rules for /advice and /advice/ -> https://withszara.com/insights/#website-advice and /small-business-websites and /small-business-websites/ -> https://withszara.com/web-design/#pricing. Preserve query strings. Do not match article subpaths. GitHub Pages currently uses immediate HTML redirects as fallback; _redirects is not supported there. Verify with curl -I.

Measurement: GA4 consent-only ai_search_visit event classifies known AI referral domains or campaign source. Register event parameter ai_source as an event-scoped custom dimension in GA4; no prompts or form values are sent. Existing generate_lead event uses successful form acceptance, not verified email delivery. Check Google/Bing actual indexing and citations, not just technical eligibility.

Publishing: keep original URLs and unique useful content, link commercial articles to their matching services, use a genuine editorial byline, update dates only when content changes, and avoid duplicate city pages. No invented reviews, claims or rankings. External links and directory profiles require genuine relationships and accurate details. Ask clients for voluntary credits or honest reviews, without pressure or incentives.

Performance: use PageSpeed Insights on home, web-design, quick-fixes, resources and payments; check mobile and desktop LCP, INP, CLS (field data if available), and use the browser QA workflow for lab diagnostics. Don't rewrite the approved design before measuring.
