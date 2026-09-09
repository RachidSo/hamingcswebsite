# Hamingcs Website — QA Specifications

This folder contains the functional specifications for the Hamingcs website
(hamingcs.com), written in **Gherkin** (`Given / When / Then`), so they can be
fed directly into the QA agent framework and executed as automated tests.

## Why Gherkin

- **Human-readable**: you (or a client) can review `.feature` files without
  reading code.
- **Directly executable**: Playwright supports Gherkin via `playwright-bdd`
  (or Cucumber.js / Behave), so the orchestrator/subagents in the QA framework
  can turn each scenario straight into a browser test — no translation step.
- **Diffable & versionable**: plain text, so changes to the spec show up as a
  normal Git diff.

## Where to keep them / what free tool to use

You already run everything through GitHub, so the simplest and cheapest path
is to **not add a new tool at all**:

**Option A — GitHub-native (recommended to start)**
- Commit this `specs/` folder into the `hamingcs-website` repo (or the QA
  framework repo, whichever the agent reads from).
- Track scenario-level work (e.g. "fix broken link on About page") as
  **GitHub Issues**, optionally grouped in a **GitHub Project** (kanban
  board) — both are free on GitHub for public/private repos on your plan.
- Test *results* (pass/fail per scenario) can be published via **GitHub
  Actions** running the QA framework on a schedule or on each push, with the
  JUnit/HTML report attached as a build artifact.
- Cost: $0, no new account, no import step — specs and code live together.

**Option B — dedicated test-case management (if you outgrow Option A)**
- **Kiwi TCMS** — open source, self-hostable for free (or a small hosted free
  tier). Gives you a proper test-case/test-plan UI, supports importing test
  cases from CSV/JSON/XML, and can ingest automated results as JUnit XML —
  so your Gherkin scenarios can still be the source of truth, just mirrored
  into Kiwi TCMS for reporting/dashboards.
- **TestLink** — older open-source alternative, also free/self-hosted, CSV
  import for test cases. Less actively maintained than Kiwi TCMS.
- Both are worth considering only once you want stakeholders (e.g. a client)
  to see a dashboard rather than reading `.feature` files in GitHub.

**Verdict:** start with Option A (GitHub + this `specs/` folder + Issues/
Projects) since it costs nothing extra and plugs straight into the QA agent
framework. Move to Kiwi TCMS later only if you need a client-facing test
dashboard.

## Site structure (verified against the live site)

hamingcs.com is a **single page** with in-page anchor navigation, not four
separate page URLs. "Home / Services / About / Contact" in the nav are
anchors (`#top`, `#services`, `#about`, `#contact`) on one long page. All
specs below have been written against the actual live content.

## Files in this set

| File | Covers |
|---|---|
| `global.feature` | Site-wide: metadata, anchor navigation, footer, responsiveness, performance, accessibility, broken links, no-personal-names rule |
| `home.feature` | Hero, CTAs, three-discipline summary cards, stat strip |
| `about.feature` | "Why three disciplines", "Our background", 4-step strategy approach, "How we work" principles |
| `services.feature` | The 3 service categories × 6 services each (18 total) |
| `engagement.feature` | "How We Engage" — Advisory / Interim leadership / Project delivery models |
| `faq.feature` | The FAQ section and its 10 questions |
| `contact.feature` | Contact details + mailto CTA (there is no contact form — confirmed) |

## Notes for the QA framework

- Since this is a single page, most scenarios scroll to an anchor rather than
  navigating to a new URL — the framework's step definitions should treat
  `click "<label>" nav link` as an in-page scroll/hash-change, not a page load.
- Content-matching scenarios (exact headings, stat labels, FAQ questions) will
  need updating here whenever the copy changes — keep this repo in sync with
  copy edits the same way you'd keep code and tests in sync.
- Substack newsletter integration wasn't found on the current live page — no
  scenario was written for it. Add one if/when it's live.
