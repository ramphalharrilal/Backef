# SZARA search operations

## Confirmed business constraints

- SZARA operates entirely remotely (owner confirmed November 28, 2026).
- Google Business Profile is blocked, per the owner. Do not create a duplicate or replacement local listing. Search Console verification is separate and remains completed.
- Owner tested the contact form and confirmed it works; enquiry delivery is closed as owner-verified. Do not submit another test enquiry.

## Completion checklist — November 28, 2026

- [x] Google Search Console verified; sitemap successful with 31 discovered pages (earlier completed work). Priority service URL indexing requests already submitted.
- [x] Imported https://withszara.com/ from Google Search Console into Bing with approved read-only access. Submitted https://withszara.com/sitemap.xml; Bing now shows Success, 31 URLs, zero errors/warnings and a November 28 crawl.
- [x] Bing AI Performance beta available without an upgrade. Report showed zero citations; new property reports may need 48 hours. No separate activation was required.
- [x] Existing IndexNow workflow succeeded with HTTP 200 for 17 URLs. Bing's new-property dashboard still showed onboarding; acceptance does not guarantee indexing.
- [x] Reviewed Cloudflare AI Crawl Control: Googlebot, BingBot, OAI-SearchBot, PerplexityBot and Claude-SearchBot were not blocked. Existing security protection was preserved.
- [x] Deployed enabled 301 Redirect Rules for the two landing paths below, preserving query strings. Enabled Cloudflare proxy on the four existing apex A records and existing www CNAME so edge rules can execute; record targets were unchanged.
- [x] Reviewed successful existing Pages, smoke, responsive/Lighthouse and search-quality workflows before additional QA.
- [x] Desktop/mobile visual checks, mobile menu/contact navigation and native required-field validation passed. Existing automated tests cover form recovery with intercepted responses, not external form submission.
- [x] All seven fixed-price Stripe checkouts loaded the expected products. Pay-page groups and the custom-payment button rendered. No payment, contact enquiry or synthetic analytics event was submitted.
- [x] GA4 event-scoped AI source dimension is registered (earlier completed work); consent-aware referral classification and enquiry_returned key event remain unchanged.

## Redirect configuration and remaining verification

Exact host match: withszara.com or www.withszara.com.

| Exact paths | Permanent destination |
| --- | --- |
| /advice and /advice/ | https://withszara.com/insights/ |
| /small-business-websites and /small-business-websites/ | https://withszara.com/web-design/ |

These rules do not match article subpaths. Preserve every individual article URL and all 16 articles. GitHub Pages HTML redirect fallbacks remain in the repository; GitHub Pages does not implement _redirects files.

- [x] Live verification passed in [Actions run 46121987286](https://github.com/ramphalharrilal/Backef/actions/runs/46121987286): eight host/slash variants return HTTP 301 with query strings preserved; all 16 article URLs, sitemap and IndexNow key return HTTP 200. The check remains in the search-quality workflow.
- [x] Revisited Bing: sitemap Success confirmed with 31 URLs.
- [ ] Revisit Bing IndexNow reporting and AI citations: IndexNow still shows onboarding and AI Performance still shows zero citations. Zero citations on a newly imported property is not evidence of a configuration failure.
- [x] Added 960px versions of the original day/night photographs with responsive srcset selection. Mobile pair is 229,740 bytes versus about 1.17 MB originally; larger screens retain the original 1920px images. Attribution, design and animations are preserved. [Commit 68460dc](https://github.com/ramphalharrilal/Backef/commit/68460dc7225e113e3ab1ebc54bd8908a81c89956).
- [x] Re-ran existing responsive/Lighthouse workflow: all 40 page/viewport checks passed. Mobile performance 71 -> 76, LCP 9.97s -> 5.41s; desktop performance 93 -> 92, LCP 1.80s; CLS zero for both. Lab results, not live field Core Web Vitals. Mobile LCP still needs improvement.
- [x] Fixed generic Python user-agent rejection for automated key/sitemap checks by identifying the client as SZARA-IndexNow. The live verification uses SZARA-Search-Check. No Cloudflare security protections were disabled. [Commit 4abf31d](https://github.com/ramphalharrilal/Backef/commit/4abf31df39c5c83766a1cfb6b502e43d1cace517). The optimization run's IndexNow notification failed before this fix; a later no-page-change job does not prove resubmission of that homepage update.

## Free listings and genuine referral opportunities

Prioritize customer enquiries and consistent business identity; check for an existing listing before creating one. Use accurate name, public contact information, service area and business hours. These are researched opportunities, not submitted listings.

| Priority | Opportunity | Commercial focus and next action |
| --- | --- | --- |
| 1 | [Google Business Profile](https://www.about.google/business/) | Free Search/Maps presence for Houston web design and IT support. Eligible only if SZARA makes real in-person contact with customers; [Google eligibility](https://support.google.com/business/answer/13763036). SZARA is entirely remote and its Google profile is blocked; do not pursue a new local profile. |
| 2 | [Bing Places](https://www.bing.com/forbusiness/) | Free local listing, separate from Webmaster Tools. Entirely remote operation is now confirmed. Establish eligibility before any local listing; do not import the blocked Google profile or invent an address. |
| 3 | [Clutch](https://help.clutch.co/en/knowledge/free-features-clutch-offers) | Free profile, client reviews and inclusion on The Manifest. Focus on Houston small-business/nonprofit web design, maintenance and documented portfolio work. Basic listing is sufficient; no paid verification or subscription is required for a profile. |
| 4 | [Yelp](https://www.yelp-support.com/article/What-is-a-claimed-business?l=en_US) | Claiming is free. Confirm eligibility for an entirely remote business before proceeding; do not invent a local presence. Decline advertising offers. |

Genuine backlink prospects based on the existing portfolio:

- [Gaining Ground Youth Services](https://gaininggroundyouthservices.com/) has a Partners section and is Houston based. If the existing working relationship supports it, ask its owner for a factual project credit or partner acknowledgement linking to SZARA's nonprofit service. Placement is discretionary; do not imply a partnership that has not been agreed.
- [Kenswick Meadows Community Association](https://kenswickmeadows.org/) publishes community updates and a newsletter. A voluntary credit for actual delivered work or a useful website-safety contribution could introduce SZARA to local organizations. Confirm the work and obtain the association's agreement before publication.
- Clutch's free contributed-content option is a relevant editorial route for a practical nonprofit website or small-business maintenance article based on actual experience. Acceptance and links are not guaranteed.

Voluntary project-credit requests were sent to existing Gaining Ground Youth Services and Kenswick Meadows contacts on November 28; wording makes any credit subject to their approval and the relevant work being ready. No backlink has been secured yet.

Clutch Basic setup was started with the owner's approval of its terms and Google sign-in. Company copy, founding year 2022 and team size 2–9 (four people) were saved through onboarding. Location requires a street address and ZIP, with no hide-address option visible. The owner instructed leaving the profile unfinished, so it was not submitted or published. The SZARA Canva brand kit was located (kAGnR9L7iN4); no replacement logo or website rebrand was made. Do not resume Clutch publication without resolving the approved public-address requirement.

Bing Places and Yelp have not been created; entirely remote operation requires eligibility verification before any local listing. Avoid paid link schemes, invented reviews, forced footer credits and duplicate city pages. Map commercial terms to existing /web-design/, /nonprofit-web-design/ and /website-maintenance/ pages; do not create unnecessary pages.

## Ongoing measurement

Keep GA4 consent requirements and the ai_source parameter; never transmit prompts or form values. Existing generate_lead indicates successful form acceptance, not verified email delivery. Measure enquiries, actual Google/Bing indexing and citations rather than technical eligibility alone. Google Indexing API is not intended for general service pages.

Use existing Actions/Lighthouse artifacts before rerunning checks. Preserve design, branding, Houston positioning, prices, services, animations and article URLs. Update editorial dates only when content changes.
