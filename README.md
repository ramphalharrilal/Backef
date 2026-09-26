# SZARA

Static HTML/CSS/JavaScript business website for SZARA / withszara.com.

- `/index.html`: BUILD / GROW / RUN services, selected real work and contact.
- `/small-business-websites/index.html`: website-and-care offer, scope and FAQ.
- `/assets/style.css`: shared responsive design, including layered project previews.
- `/assets/site.js`: retained script entry; forms use native POST to FormSubmit.

No build or dependencies are required. Serve this directory with any static HTTP server. All asset and internal links are relative so the site works both under `/Backef/` and at a custom-domain root.

## Contact and launch status

Contact links use `hello@withszara.com`, which forwards through Cloudflare Email Routing to the verified owner Gmail inbox. Routing is enabled. Outgoing branded email is not configured. The forms POST to FormSubmit with native validation, honeypot protection and the service’s default CAPTCHA. User authorization to use FormSubmit was recorded on 2026-09-25. The activation request was submitted from the live site; the owner must click Activate Form in the forwarded email. Inbox delivery is not yet verified. The original mailto-draft behavior was removed, and a thank-you page added.\n\nBefore paid traffic: set up and test the branded mailbox, connect and test a real form-delivery service if desired, and agree the applicable privacy disclosures. No ads, analytics or conversion tracking were activated by this change.

`withszara.com` is connected through Cloudflare DNS to GitHub Pages. The repository CNAME is `withszara.com`; GitHub DNS validation passed and Enforce HTTPS is enabled. The `www` CNAME points to `ramphalharrilal.github.io` and redirects to the apex domain. Both the homepage and `/small-business-websites/` were verified on HTTPS. Email forwarding is enabled; a separate mailbox and outgoing service are not configured.

## Offer

$999 setup + $149/month SZARA Care, 12-month initial agreement, $2,787 initial-term total before applicable taxes and approved extras. The monthly care component is mandatory in this offer. The written proposal must specify the editing allowance, response times, revisions, billing, ownership/handover, renewal and cancellation before contracting. No unapproved numeric allowance or unlimited-support promise is invented.

## Portfolio provenance

Content checked on 2026-09-25 against the owner's existing business site, portfolio source and project READMEs.

| Work | Evidence |
| --- | --- |
| Kenswick Meadows website and management | https://github.com/ramphalharrilal/ramphalharrilal.github.io/blob/main/app/page.tsx |
| Gaining Ground Youth Services website | Same portfolio source; https://gaininggroundyouthservices.com/ |
| Dreamhouse retail creative | Same portfolio source, `visualWork` and `featuredWork` |
| ON TYME Transportation and Tru Luv Homes | Existing Backef homepage and landing page at base commit `a83d3449ed98f01071ce6b67adeb50f0444290e6` |
| SiteCare | https://github.com/ramphalharrilal/website-care-monitor/blob/main/README.md — explicitly a demo with fictional businesses/sample data |
| RelayDesk | https://github.com/ramphalharrilal/whatsapp-support-operations/blob/main/README.md — portfolio edition with synthetic data; not a production WhatsApp delivery claim |
| Founder portrait, email and phone | Owner's portfolio source above |

Images are copied from the owner's portfolio repository: `public/images/gallery/kmca-site.webp`, `gaining-ground-site.webp`, `dreamhouse-christmas.webp`, and `public/images/ramphal-hero-cutout.webp` (saved here as `ramphal.webp`). No invented projects, testimonials, ratings, awards, metrics or performance results are used. The SiteCare visual is a text composition of capabilities, not an invented dashboard screenshot.

## Verification

Both pages were checked in Chromium at 320, 375, 390, 768, 1024 and 1440px widths for horizontal overflow, image loading, in-page anchors, a single H1 and JavaScript errors. Native validation and the direct form POST payload were checked with an intercepted test request; no delivery claim is made by that test. `/Backef/` subpath hosting was checked. Desktop and mobile screenshots were visually reviewed. Reduced-motion preferences are respected; the site has no autoplay or essential animation.


## About-section stock photograph

The founder portrait is no longer used. The About section uses Annie Spratt’s stock photograph: https://unsplash.com/photos/group-of-people-using-laptop-computer-QckxruozjRg (Unsplash License: https://unsplash.com/license, checked 2026-09-25). The licensed photograph is hosted locally as assets/team-stock.avif. Attribution is retained here; the optional visible caption is omitted. Its alt text identifies stock imagery, not actual SZARA staff. No AI-generated team image is used.


