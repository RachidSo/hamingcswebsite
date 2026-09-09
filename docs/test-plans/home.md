# Test plan: home

_Last updated: 2026-09-09_

**Scope note — why `home` is in this run:** `home` has no changed spec file of
its own, but it is in scope because `index.html`, `styles.css`, and `site.js`
(shared files) changed in commit `6a76f4e`. This is a **verification re-run**
after a fix commit addressing site-wide mobile-nav, heading-hierarchy, and
404-page bugs. Unlike the prior revision of this plan (triggered by a
`specs/contact.feature` edit elsewhere, an indirect dependency), this trigger
directly touched the literal markup/styles/script that render the hero,
the three discipline cards, and the stat strip — `index.html` is the single
page's one file, so every element `specs/home.feature` asserts on lives in
the file that just changed. Every test case below therefore doubles as a
regression check for this fix, not only a fresh feature verification.

The fix's three named bug categories (mobile nav, heading hierarchy, 404
page) are themselves specified in `specs/global.feature` (mobile-nav
collapse/expand scenario, the one-`h1`/no-skipped-levels accessibility
scenario, and the custom-404 scenario respectively), not in
`specs/home.feature` — per `specs/README.md`'s file-to-module mapping,
those belong to the `global` module's own test plan and aren't duplicated
here. The one point of direct overlap — the hero headline at
`index.html:82` is literally the page's single `<h1>`, and the pillar-card
titles at lines 93/98/103 are `<h2>` — is flagged in the coverage map below
as a dependency to watch, but no separate test case is added for it in this
module's plan, consistent with the same non-duplication rule the prior
revision of this plan applied to the CTA-navigation overlap with `global`.

Spec read: `specs/home.feature` (repo state as of commit `6a76f4e`). Also
consulted `specs/global.feature` (to confirm the mobile-nav/heading-
hierarchy/404 bug categories are owned elsewhere) and `specs/README.md` /
`playwright.config.js` for framework conventions (Playwright, Gherkin-style
specs under `specs/`, tests under `tests/**/*_test.js` matched by
`testMatch: '**/*_test.js'`, real `https://hamingcs.com/...` URLs rather
than a local fixture, chromium + firefox projects, `fullyParallel: false`,
1 retry, JSON + list reporters writing under `results/`).

Markup checked directly in `index.html` to disambiguate selectors, since
"Start a conversation" appears four times on the page (nav bar `.nav-cta`,
hero `.hero-actions .btn.btn-primary`, and two later CTAs inside
`services`/`engagement` sections) but `specs/home.feature` only makes a
claim about the **hero** instance (`header.hero#top .hero-actions`).

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| HOME-01 | happy-path | Hero eyebrow, headline, and supporting paragraph display the correct positioning copy and mention strategy, hands-on leadership, AI/data expertise, and systems/security/DevOps architecture. | Browser navigated to `https://hamingcs.com/`. | Eyebrow text "STRATEGY, AI & IT CONSULTING — GLOBAL, REMOTE-FIRST" (`p.chip` in `header.hero#top`) is visible; headline "Strategy that ships, on systems built to run it." is visible in the page's `<h1>`; lede paragraph (`p.lede`) text contains all four required concepts (strategy, hands-on leadership, AI/data expertise, systems/security/DevOps architecture). | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L9-L13 |
| HOME-02 | negative | No individual personal name (e.g. a founder's name) appears anywhere in the rendered hero section text. | Browser navigated to `https://hamingcs.com/`; hero section (`header.hero#top`) rendered. | Rendered text of the hero section contains no individual personal name — only the "Hamingcs" brand/company name. | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L14 |
| HOME-03 | happy-path | The hero's "Start a conversation" CTA (`.hero-actions .btn.btn-primary`, distinct from the nav-bar/services/engagement CTAs of the same label) is visible and its `href` resolves to `#contact`. | Browser navigated to `https://hamingcs.com/`; hero CTA located via `.hero-actions .btn.btn-primary` (not `.nav-cta`). | Button is visible with `href="#contact"`; clicking it changes the URL fragment to `#contact` and scrolls to the contact section. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L17 |
| HOME-04 | happy-path | The hero's "See what we do" CTA is visible and links to `#services`. | Browser navigated to `https://hamingcs.com/`; hero CTA located via `.hero-actions .btn.btn-ghost`. | Button is visible with `href="#services"`; clicking it changes the URL fragment to `#services`. | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L18 |
| HOME-05 | happy-path | All three discipline summary cards ("AI & DATA", "SYSTEMS & SECURITY", "STRATEGY & LEADERSHIP") are visible, each with a short title and one sentence of supporting copy. | Browser navigated to `https://hamingcs.com/`; hero `.console` panel rendered. | Exactly three `.pillar` cards are visible, labelled "01 — AI & DATA" / "02 — SYSTEMS & SECURITY" / "03 — STRATEGY & LEADERSHIP" via `.pillar-label`, each containing an `<h2>` title and one supporting `<p>` sentence. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L20-L23 |
| HOME-06 | boundary | The "STRATEGY & LEADERSHIP" card's copy specifically references director/CTO-level experience and a 300-person team across the US, EU, Japan, China, and the Middle East. | Browser navigated to `https://hamingcs.com/`; "STRATEGY & LEADERSHIP" `.pillar` card (third `.pillar`) rendered. | Card's `<p>` copy contains "director and CTO level" (or equivalent), "300-person team" (or "300 people"), and all five regions (US, EU, Japan, China, Middle East). | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L24-L25 |
| HOME-07 | happy-path | The stat strip renders all three stats with their exact numbers/labels: "20+ yrs", "Automotive, banking, tech", and "Strategy to production", each with its full supporting label text. | Browser navigated to `https://hamingcs.com/`; `.stat-row` section rendered below the hero. | Three `.stat-card` elements are visible with `.stat-num` text exactly "20+ yrs" / "Automotive, banking, tech" / "Strategy to production" and matching `.stat-label` text for each, as specified. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L27-L33 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to `https://hamingcs.com/` (specs/home.feature#L7) | shared precondition for HOME-01–HOME-07 (not its own test case) |
| Scenario: Hero communicates positioning and identity (specs/home.feature#L9-L14) | HOME-01, HOME-02 |
| Scenario: Hero has two calls-to-action (specs/home.feature#L16-L18) | HOME-03, HOME-04 |
| Scenario: Three-discipline summary cards are shown (specs/home.feature#L20-L25) | HOME-05, HOME-06 |
| Scenario: Stat strip renders correctly (specs/home.feature#L27-L33) | HOME-07 |
| Fix-verification driver: shared `index.html`/`styles.css`/`site.js` edit in commit `6a76f4e` addressing mobile-nav / heading-hierarchy / 404 bugs | HOME-01–HOME-07 (all re-verified as regression checks against this commit, since it directly edited the file rendering every element above) |
| Dependency to watch (no separate test case): hero `<h1>` at `index.html:82` and pillar `<h2>` titles at lines 93/98/103 are the concrete markup the heading-hierarchy fix (specs/global.feature's accessibility scenario) operates on | — none — (owned by the `global` module's own test plan; flagged here only as a cross-reference, consistent with this plan's prior non-duplication of the CTA-navigation overlap with `global`) |
| Mobile-nav fix (specs/global.feature's mobile-navigation scenario) | — none — (global navigation chrome, not a `home.feature` scenario; owned by the `global` module's test plan) |
| Custom 404 page fix (specs/global.feature's 404 scenario) | — none — (not a `home.feature` scenario; owned by the `global` module's test plan) |
