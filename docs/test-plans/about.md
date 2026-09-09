# Test plan: about

_Last updated: 2026-09-09_

**Scope note:** `about` is in scope this run because `index.html`,
`styles.css`, and `site.js` (shared, site-wide files) changed in commit
`6a76f4e`, not because `specs/about.feature` itself changed. No test plan
has ever been produced for this module before — this is a from-scratch
plan, not an update. Because the trigger is a shared-file change rather
than a content/spec change, every test case below is derived straight from
`specs/about.feature`'s own scenarios (there is no separate dependency-risk
row the way `home`'s plan has one for its `contact`-module CTA
dependency) — the goal here is simply to have full regression coverage of
the About section in place in case the shared CSS/JS edit broke its
layout, reveal animations, or anchor scroll behavior.

Spec read: `specs/about.feature` (commit `6a76f4e`). Also consulted
`specs/README.md` and `playwright.config.js` for framework conventions:
Playwright (chromium + firefox projects), Gherkin-style specs under
`specs/`, generated tests under `tests/**/*_test.js`, tests run against the
real live site `https://www.hamingcs.com/#...` (no local baseURL, no
fixture), single-page site with anchor-based navigation rather than
separate page loads — `#about` is reached by scroll/hash-change, not a new
page load. Also skimmed `specs/global.feature` for the cross-cutting
heading-order and no-personal-names scenarios that touch this section but
are owned by the `global` module, so as not to duplicate them here beyond
a cross-reference.

Markup checked directly in `index.html` (lines 129-220) to disambiguate
selectors:
- The four section titles referenced by the spec ("WHY THREE DISCIPLINES",
  "OUR BACKGROUND", "HOW WE APPROACH STRATEGY", "HOW WE WORK") are rendered
  as `<p class="chip">` eyebrow labels, **not** literal `<h1>`-`<h6>` heading
  tags — test-generator should assert on `#about .chip` text content rather
  than a heading-role locator for these four. Each of the latter two chips
  is followed by its own real `<h2>` sub-heading ("Define the issue before
  you solve it." / "A few working principles") that is not itself named by
  the spec and doesn't need its own assertion.
- The four strategy steps and three working principles are both rendered
  with the same `div.principle` / `div.principle-mark` / `<h3>` / `<p>`
  structure, under two different `<div style="margin-top: 28px;">` blocks —
  one per chip section — so selectors must scope to the chip that precedes
  them (or ordinal position within `#about`) to avoid cross-matching the
  two lists.
- Scenario 3's 4-step table text matches the live `<h3>` titles exactly
  ("Define the issue", "Wargame the options", "Decide, resource, and lead",
  "Execute and adapt").

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| ABOUT-01 | happy-path | "WHY THREE DISCIPLINES" section is visible and explains that AI initiatives usually fail on the underlying system or on strategy/leadership that never became a running function, and states the reason Hamingcs combines strategy, AI/data, and systems under one practice. | Browser navigated to `https://www.hamingcs.com/#about`. | `#about .chip` text "WHY THREE DISCIPLINES" is visible; the section's `.intro-stack` paragraphs contain the "fail on the system underneath" / "strategy and leadership that never turned the plan into a running function" framing and the rationale for combining all three disciplines under one practice. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L9-L13 |
| ABOUT-02 | happy-path | "OUR BACKGROUND" section is visible and narrates hands-on automotive diagnostic software (Java) and architecture origins, progression to director/CTO-level ownership of a 300-person AI and data function across the US, EU, Japan, China, and the Middle East, and references leading cloudification/digitalisation of the technology stack. | Browser navigated to `https://www.hamingcs.com/#about`. | `#about .chip` text "OUR BACKGROUND" is visible; the section's `.intro-stack` paragraphs mention Java/automotive diagnostic software and architecture work, director/CTO-level ownership, "300" people, all five named regions (US, EU, Japan, China, Middle East), and cloudification/digitalisation of the technology stack. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L16-L22 |
| ABOUT-03 | negative | No individual founder/employee personal name appears anywhere in the rendered "OUR BACKGROUND" section text. | Browser navigated to `https://www.hamingcs.com/#about`; "OUR BACKGROUND" `.intro-stack` block rendered (the block immediately following the "OUR BACKGROUND" `.chip`). | Rendered text of that block contains no individual personal name — only the "Hamingcs" brand/company name and role/title references (e.g. "director and CTO"). | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L23 |
| ABOUT-04 | boundary | "HOW WE APPROACH STRATEGY" section lists exactly 4 steps, in order, with the exact titles "Define the issue" / "Wargame the options" / "Decide, resource, and lead" / "Execute and adapt", each paired with a supporting description. | Browser navigated to `https://www.hamingcs.com/#about`. | `#about .chip` text "HOW WE APPROACH STRATEGY" is visible; exactly 4 `div.principle` elements appear in this section (no more, no fewer); their `.principle-mark` values read "01"-"04" in that order; their `<h3>` titles exactly match the 4 titles above in that order; each has a non-empty supporting `<p>` description. | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L25-L33 |
| ABOUT-05 | happy-path | "HOW WE WORK" section lists 3 working principles, including one stating strategy is only useful if someone can operate it, one about security/scale being designed in from the start, and one about working globally / remote-first. | Browser navigated to `https://www.hamingcs.com/#about`. | `#about .chip` text "HOW WE WORK" is visible; 3 `div.principle` elements appear in this section; among their `<h3>`/`<p>` text, one references operating/running the strategy (not just handing over a slide deck), one references security and scale being designed in from the start (not added later), and one references working globally / remote-first. | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L35-L39 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to `https://hamingcs.com/#about` (specs/about.feature#L6-7) | shared precondition for ABOUT-01–ABOUT-05 (not its own test case) |
| Scenario: "Why three disciplines" framing is present (specs/about.feature#L9-13) | ABOUT-01 |
| Scenario: "Our background" narrative is present and names no individuals (specs/about.feature#L16-23) | ABOUT-02, ABOUT-03 |
| Scenario: Four-step strategy approach is presented in order (specs/about.feature#L25-33) | ABOUT-04 |
| Scenario: Working principles are presented (specs/about.feature#L35-39) | ABOUT-05 |
| Cross-cutting heading-order assertion naming all four About chips (specs/global.feature#L81-83, owned by the `global` module, not re-derived here) | — none — (out of scope for this module's plan; owned by global module's own test plan) |
| Cross-cutting no-personal-names site rule (specs/global.feature#L99-102, owned by the `global` module; ABOUT-03 is this module's own scoped instance per the about.feature scenario, not a duplicate of the global test) | ABOUT-03 (module-scoped instance only) |
