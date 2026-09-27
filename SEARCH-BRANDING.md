# Search branding maintenance

The production origin is https://withszara.com/. Root-relative favicon links intentionally use this custom domain; the old GitHub Pages address redirects here.

## Assets

- `assets/szara-logo.png`: 1024 × 1024 PNG, full SZARA wordmark in cream, ink and cobalt. Organization.logo ImageObject on all pages with Organization markup.
- `assets/szara-social.png`: 1200 × 630 PNG, shared Open Graph and Twitter large-image preview. Existing artwork retained after visual inspection.
- `favicon.ico`: 16/32/48px; `assets/favicon-48.png` and `favicon-192.png`; `assets/favicon.svg`; `assets/apple-touch-icon.png`: 180px. All nine HTML pages declare the same icon family.

All images are public static files. robots.txt allows crawling. No noimageindex or image X-Robots-Tag should be added. Crawlability is eligibility, not a guarantee of indexing or display. Google/Bing choose search-result imagery and may rewrite titles and snippets.

## Homepage metadata

Title: Web Design for Businesses & Organizations | SZARA

Description: SZARA designs professional websites and provides creative and digital support for businesses, nonprofits and organizations.

The HTML title/description, Open Graph and Twitter values match. WebSite/Organization use SZARA and https://withszara.com/. Canonicals use this HTTPS origin with trailing slashes. Every other page retains its own relevant title and description. The thank-you page remains noindex and is excluded from the sitemap.

## Bing Webmaster Tools

1. Add/verify https://withszara.com/ or import the verified property from Google Search Console. No Bing verification token is invented or embedded.
2. Submit https://withszara.com/sitemap.xml. Its eight URLs are canonical and indexable; robots.txt advertises the same sitemap.
3. Inspect the homepage, confirm the newly crawled HTML, and request a fresh crawl. Inspect service and case-study pages as needed.
4. Older search wording can remain until recrawl/reprocessing. Even then Bing can select another snippet. Do not repeatedly change correct titles to chase a cached result.

## IndexNow recommendation

IndexNow is appropriate as an optional post-deployment notification for this static GitHub Pages site. It is not required for sitemap discovery. Recommend adding it when regular publishing begins; it is not installed by this branding change. For this small site, Bing URL submission and the existing sitemap are sufficient initial steps.

If enabled: generate a unique key, publish the matching root text file, verify it returns HTTP 200 on withszara.com, then submit only changed canonical public URLs after a successful Pages deployment. Keep the submission outside visitor JavaScript. Do not submit form data, query-string URLs or the noindex thank-you page. A deployment workflow should check the live key and content before notifying https://api.indexnow.org/indexnow. HTTP 200 means received; 202 means key validation pending, neither guarantees indexing. Google does not use IndexNow as a substitute for Search Console/sitemaps.

Official protocol: https://www.indexnow.org/documentation

## Reviews: evidence and future links

The four existing highlights match `clientReviews` in the owner's portfolio source, checked 2026-09-26: https://github.com/ramphalharrilal/ramphalharrilal.github.io/blob/main/app/page.tsx. The source identifies them as condensed client feedback/written recommendations. The site retains that attribution; it does not claim independent platform verification. Original private recommendations were not independently authenticated.

The homepage section #independent-reviews reserves space for legitimate profiles, Clutch first, Trustpilot second. Both clearly say the profile is not yet published. No guessed profile URLs, stars, counts, endorsements, badges, Review or AggregateRating schema are used.

Create/claim a genuine SZARA profile on Clutch first, then Trustpilot. Complete business details truthfully and invite actual clients to give honest feedback through the platform's own process. Do not offer rewards tied to positive ratings. Verify the public SZARA profile URL before replacing each status with a profile link. Add sameAs only after confirming the URL identifies SZARA. Do not add self-serving review ratings to Organization markup.
