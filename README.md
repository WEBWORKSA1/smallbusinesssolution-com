# SmallBusinessSolution.com

Free small business calculators, plain-English guides and a free "Get Matched" lead-generation service. Static Jekyll site for GitHub Pages (free plan, `main` branch, root).

## Structure
- `_layouts/default.html` — shared layout: AdSense, top contact banner, nav, footer, cookie bar, exit-intent lead magnet
- `assets/js/main.js` — forms (AJAX relay, address assembled at runtime), wizard, countdowns, tip of the day, feeds, lite YouTube
- `assets/js/tools.js` — 9 calculators/generators
- `tools/`, `guides/` — tool pages and long-form guides
- `scripts/update_feeds.py` + `.github/workflows/update-feeds.yml` — daily auto-refresh of news & videos into `assets/data/`
- `BUILD-PROMPTS.md` — strategy and phase-wise build prompts · `RESEARCH.md` — 37-site competitive review

## Publish
1. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)`.
2. Custom domain: add a `CNAME` file containing `smallbusinesssolution.com`, then at the registrar set A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`. Enable **Enforce HTTPS**.
3. Settings → Actions → General → Workflow permissions: **Read and write** (lets the daily feed job commit).

## Config
- `_config.yml` → `donate_url`: paste a Stripe / PayPal / Ko-fi payment link to show a "Donate now" button on `/support.html`.
- Forms deliver through FormSubmit. The first submission triggers a one-time activation email to the site inbox — click it once.
- AdSense: once approved, turn on Auto ads and the Google consent message (Privacy & messaging) for EEA/UK visitors.

## Legal
"SmallBusinessSolution.com" is used descriptively as a domain name; no trademark is claimed in "small business solution(s)". See `/trademark.html`.
