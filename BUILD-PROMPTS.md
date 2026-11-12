# SmallBusinessSolution.com — Strategy & Phase-Wise Build Prompts

## 1. The winning idea (and why)

**Concept:** *The free small-business toolkit that pays for itself* — interactive calculators, plain-English playbooks, and a **"Get Matched"** service that connects owners with vetted help (funding, websites, marketing, bookkeeping, legal, insurance).

**Why this beats a plain blog or directory on this domain:**

| Lever | Logic | Numbers (industry ranges) |
|---|---|---|
| AdSense RPM | Small-business finance keywords (business loans, payroll, merchant services, business insurance, LLC formation) are among the highest-CPC ad categories. Calculators produce long sessions and repeat visits. | Finance/business pages commonly earn $15–$45 RPM vs $2–$8 for general content. Tools typically get 2–4× pages/session. |
| Lead generation | Every calculator result ends in a matching CTA. SMB leads sell to lenders, agencies and accountants per qualified lead. | $25–$200 per qualified SMB lead (funding leads at the top). 1–3% of tool users converting = the main profit line. |
| Sponsorships | "Featured provider" slots, tool sponsorship, contest prize sponsors. | Flat monthly fees; scales with traffic, independent of AdSense. |
| Community revenue | Supporter donations, contests that harvest emails, contributor network. | Low $ but high trust + email list growth. |

**Positioning line:** "Small business problems, solved in plain numbers."

**Bold path vs safe path:** Safe = AdSense + guides only (slow, ~12–18 months to meaningful RPM). Bold = treat the site as a lead-gen engine with AdSense as the floor; sell leads/sponsorships from month 3 using the provider-network form. This build ships the bold path.

---

## 2. Phase-wise prompts

Each phase is a self-contained prompt you can hand to a builder (human or AI). Global constraints apply to every phase.

### Global constraints (paste on top of every phase)
```
Domain: SmallBusinessSolution.com. Static site on GitHub Pages (free plan, branch main, root), Jekyll layouts only (no plugins beyond jekyll-sitemap).
AdSense: include in <head> of every content page:
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>
ads.txt: google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0
Top of every page: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linking to https://web.works/contact
All forms and mail links route to ONE address, never printed anywhere in HTML/text; assemble it in JS at runtime only.
No trademark claim on "small business solution(s)"; include a trademark/copyright disclosure page.
Mobile-first, WCAG AA contrast, Lighthouse 90+, no external frameworks.
```

### Phase 0 — Research & information architecture
```
Review 35+ leading small-business sites (SBA, SCORE, NerdWallet, Lendio, Nav, Clutch, Capterra, G2, Shopify Tools, HubSpot, QuickBooks, FreshBooks, LegalZoom, ZenBusiness, BDC, business.gov.au, GOV.UK, Canada.ca, etc.).
Output: feature matrix (tools, lead forms, trust signals, content hubs, UX), and a sitemap of:
Home, Tools hub + 9 tools, Guides hub + 10 guides, Get Matched (lead gen), Provider Network, Videos, News (auto), Resources, Contest, Support (donations), Careers, Advertise, About, Contact, Privacy, Terms, Disclaimer, Cookies, Trademark, 404.
```

### Phase 1 — Foundation & design system
```
Create _config.yml, _layouts/default.html, assets/css/site.css, assets/js/main.js.
Design: "ledger paper" editorial look — warm paper background, deep ink navy, signal orange accent, money green for results; Fraunces headings, Instrument Sans body, JetBrains Mono for figures.
Layout includes: top contact banner, sticky header + mobile drawer, breadcrumbs-ready page hero, footer with legal links, cookie-consent bar, mobile sticky "Get matched" bar, exit-intent lead-magnet modal (once per session).
SEO: unique title/description per page, canonical, Open Graph, JSON-LD Organization + WebSite, sitemap via jekyll-sitemap, robots.txt.
```

### Phase 2 — Money tools (traffic + session depth)
```
Build client-side calculators in assets/js/tools.js, each with instant results, formula explanation, and a "Get expert help with this" CTA that pre-fills Get Matched:
1 Business loan payment + amortization  2 Break-even  3 Profit margin / markup / price-from-margin
4 Startup cost estimator (editable rows)  5 Cash runway  6 True cost of an employee
7 Invoice generator (print/PDF, saves locally)  8 Business name generator  9 Business health check (scored quiz → lead).
```

### Phase 3 — Content for AdSense approval
```
Write 10 original long-form guides (700–1,000 words each) with H2 structure, checklists, and internal links to tools:
start a business checklist, business structures, funding options, pricing, cash flow, local marketing on a budget,
hiring the first employee, a website that converts, bookkeeping basics, cybersecurity basics.
Plus About, Contact, Privacy (AdSense/cookies/third-party vendors disclosure), Terms, Disclaimer, Cookies, Trademark.
No thin pages, no placeholder text, no "coming soon".
```

### Phase 4 — Lead generation engine
```
Get Matched page: 5-step form (need → stage/revenue → budget/timeline → industry/location → contact + consent),
progress bar, autosave to localStorage, URL pre-fill (?need=funding), honeypot anti-spam, AJAX submit, thank-you state.
Supporting captures: newsletter, exit-intent checklist, tool-result CTAs, health-check score email, provider-network signup (supply side).
```

### Phase 5 — Monetization & community
```
Support page: donation tiers (one-time/monthly) earmarked for operations, promotions & marketing, hiring talent, contests & prizes; pledge form + optional payment link from _config donate_url.
Contest page: monthly "Small Business Spotlight" with auto countdown, prizes, official rules (no purchase necessary), entry form, sponsor-a-prize CTA.
Careers page: contributor writers, mentors, partnership sales (commission), video creator, community moderator + application form.
Advertise page: sponsorship packages + media-kit request.
```

### Phase 6 — Automation (self-updating)
```
GitHub Action (daily cron + manual): Python stdlib script pulls small-business news RSS and YouTube channel feeds into assets/data/*.json and commits to main → Pages rebuilds automatically.
Client-side automation: tip of the day (rotates by date), tax-deadline countdowns, contest countdown to month end, auto copyright year.
```

### Phase 7 — QA, compliance & launch
```
Check: no exposed email in any file, all internal links resolve, mobile screenshots at 390px and desktop at 1280px, forms submit, ads.txt live, privacy policy names Google/AdSense cookies.
Publish: GitHub Pages from main /(root); add CNAME smallbusinesssolution.com; DNS A records 185.199.108-111.153 + CNAME www → <user>.github.io; enable "Enforce HTTPS".
Then apply to AdSense, enable Auto ads and the Google CMP (Privacy & messaging) for EEA/UK visitors.
```

### Phase 8 — Growth (post-launch)
```
Programmatic SEO: "/tools/<industry>-break-even" variants; state/province guide pages; monthly contest winner stories;
email newsletter to the captured list; sell lead batches to provider-network members; add affiliate links (with disclosure) for software categories.
```
