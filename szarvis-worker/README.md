# SZARVIS AI — activation guide

This folder contains a real server-side Cloudflare Workers AI chat API.

## What is already installed?
The GitHub Pages website loads /assets/szarvis-assistant.js on eight public pages.
The visible walker, optional browser speech, and local document matching already work.
The frontend POSTs to /api/szarvis and falls back to website search if there is no AI service.

## Cloudflare setup required once
1. From a machine with Node.js installed and access to the **same Cloudflare account that manages withszara.com**:
   `cd szarvis-worker`
   `npx wrangler login`
   `npx wrangler deploy`
2. Confirm the worker `https://withszara-szarvis.<your-subdomain>.workers.dev/api/szarvis` reports `"ready":true` on GET.
3. In Cloudflare DNS, ensure the records that serve withszara.com are compatible with Cloudflare-proxied (orange-cloud) routing. **Do not alter DNS blindly**: verify GitHub Pages SSL and custom domain behavior first.
4. In **Workers & Pages → withszara-szarvis → Settings → Domains & Routes → Add → Route**, choose zone `withszara.com` and route `withszara.com/api/szarvis*`. This directs only that endpoint to the Worker, leaving all other website paths served by GitHub Pages.
   Alternatively add the commented `[[routes]]` section in `wrangler.toml` and run deploy.
5. GET `https://withszara.com/api/szarvis` should return `{"service":"szarvis-ai","ready":true}`. Then test a visitor chat question with speaker on/off on iPhone Safari.
6. Check Cloudflare usage and billing; Workers AI is metered. Free allocations, if available, may vary by account.
7. For production, consider Turnstile and stricter Cloudflare WAF/request limits, as the included per-IP limits are approximate and can be circumvented.

## Safety properties
- No AI API key is ever placed in the public browser JS.
- The AI model is called only via Cloudflare's Worker-side `AI` binding.
- Requests allowed only from the With Szara site Origin, plus basic data-size caps and rate limiting.
- Conversations stay in the current page memory, not browser storage, and are submitted to the Worker when AI is available.
- Not a lead-capture system: the existing contact form continues to handle enquiries.
- A deployed Worker needs a Cloudflare account and permissions; committing this folder to GitHub alone does not deploy it.

Docs: https://developers.cloudflare.com/workers-ai/configuration/bindings/
Docs: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
