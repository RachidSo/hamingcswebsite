# Test plan: home

_Last updated: 2026-09-09_

**Scope note:** `home` has no changed file of its own in this run. It is in
scope only because `specs/contact.feature` changed and `home` depends on it:
`specs/home.feature:17` asserts the hero's "Start a conversation" button
"links to `#contact`" — the anchor target the contact module exposes. Test
case HOME-03 below exists specifically to cover that dependency/regression
risk, per the orchestrator's instructions for this run; every other test
case is derived straight from `specs/home.feature`'s own scenarios,
independent of the contact-module trigger.

Spec read: `specs/home.feature` (commit `5285ec3`). Also consulted
`specs/global.feature` (for the cross-cutting CTA-navigation scenario that
overlaps with HOME-03/HOME-04, attributed to `global` not `home`, so not
duplicated here beyond a cross-reference) and `specs/README.md` /
`playwright.config.js` for framework conventions (Playwright, Gherkin-style
specs under `specs/`, tests under `tests/**/*_test.js`, real
`https://hamingcs.com/...` URLs rather than a local fixture, chromium +
firefox projects).

Markup checked directly in `index.html` to disambiguate selectors, since
"Start a conversation" appears four times on the page (nav bar `.nav-cta`,
hero `.hero-actions .btn.btn-primary`, and two later CTAs inside
`services`/`engagement` sections) but `specs/home.feature` only makes a claim
about the **hero** instance (`header.hero#top .hero-actions`).

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| HOME-01 | happy-path | Hero eyebrow, headline, and supporting paragraph display the correct positioning copy and mention strategy, hands-on leadership, AI/data expertise, and systems/security/DevOps architecture. | Browser navigated to `https://hamingcs.com/`. | Eyebrow text "STRATEGY, AI & IT CONSULTING — GLOBAL, REMOTE-FIRST" visible; headline "Strategy that ships, on systems built to run it." visible; lede paragraph text contains all four required concepts (strategy, hands-on leadership, AI/data expertise, systems/security/DevOps architecture). | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L9-L13 |
| HOME-02 | negative | No individual personal name (e.g. a founder's name) appears anywhere in the rendered hero section text. | Browser navigated to `https://hamingcs.com/`; hero section (`header.hero#top`) rendered. | Rendered text of the hero section contains no individual personal name — only the "Hamingcs" brand/company name. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L14 |
| HOME-03 | boundary | The hero's "Start a conversation" CTA (`.hero-actions .btn.btn-primary`, distinct from the nav-bar/services/engagement CTAs of the same label) is visible and its `href` resolves to `#contact`, and following it lands on the section the contact module actually renders there. | Browser navigated to `https://hamingcs.com/`; hero CTA located via `.hero-actions .btn.btn-primary` (not `.nav-cta`). | Button is visible with `href="#contact"`; clicking it changes the URL fragment to `#contact` and scrolls to `section.cta#contact`, which is the same section `specs/contact.feature`'s "Contact section intro is correct" scenario asserts is headed "CONTACT" — confirming the contact module's exposed anchor target hasn't moved or been renamed. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L17 |
| HOME-04 | happy-path | The hero's "See what we do" CTA is visible and links to `#services`. | Browser navigated to `https://hamingcs.com/`; hero CTA located via `.hero-actions .btn.btn-ghost`. | Button is visible with `href="#services"`; clicking it changes the URL fragment to `#services`. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L18 |
| HOME-05 | happy-path | All three discipline summary cards ("AI & DATA", "SYSTEMS & SECURITY", "STRATEGY & LEADERSHIP") are visible, each with a short title and one sentence of supporting copy. | Browser navigated to `https://hamingcs.com/`; hero `.console` panel rendered. | Exactly three `.pillar` cards are visible with labels "01 — AI & DATA", "02 — SYSTEMS & SECURITY", "03 — STRATEGY & LEADERSHIP" (or equivalent visible labels), each containing a `<h3>` title and a supporting `<p>` sentence. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L20-L23 |
| HOME-06 | boundary | The "STRATEGY & LEADERSHIP" card's copy specifically references director/CTO-level experience and a 300-person team across the US, EU, Japan, China, and the Middle East. | Browser navigated to `https://hamingcs.com/`; "STRATEGY & LEADERSHIP" `.pillar` card rendered. | Card copy text contains "director and CTO level" (or equivalent), "300-person team" (or "300 people"), and all five regions (US, EU, Japan, China, Middle East). | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L24-L25 |
| HOME-07 | happy-path | The stat strip renders all three stats with their exact numbers/labels: "20+ yrs", "Automotive, banking, tech", and "Strategy to production", each with its full supporting label text. | Browser navigated to `https://hamingcs.com/`; `.stat-row` section rendered below the hero. | Three `.stat-card` elements are visible with `.stat-num` text exactly "20+ yrs" / "Automotive, banking, tech" / "Strategy to production" and matching `.stat-label` text for each, as specified. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/home.feature#L27-L33 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to `https://hamingcs.com/` (specs/home.feature#L7) | shared precondition for HOME-01–HOME-07 (not its own test case) |
| Scenario: Hero communicates positioning and identity (specs/home.feature#L9-L14) | HOME-01, HOME-02 |
| Scenario: Hero has two calls-to-action (specs/home.feature#L16-L18) | HOME-03, HOME-04 |
| Scenario: Three-discipline summary cards are shown (specs/home.feature#L20-L25) | HOME-05, HOME-06 |
| Scenario: Stat strip renders correctly (specs/home.feature#L27-L33) | HOME-07 |
| Dependency risk: contact module's `#contact` anchor target referenced by hero CTA (specs/contact.feature, specs/home.feature#L17) | HOME-03 |
| Cross-cutting CTA navigation assertion (specs/global.feature#L36-L41, overlaps hero CTAs but belongs to the `global` module, not re-derived here) | — none — (out of scope for this module's plan; owned by global module's own test plan) |
