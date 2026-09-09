# Test plan: faq

_Last updated: 2026-09-09_

Spec source: `specs/faq.feature` (commit `6a76f4ebfc2c30e379d97e26bf04965278ec592e`).
Target: live production site `https://www.hamingcs.com/` (no local baseURL per
`playwright.config.js` — every test navigates with a full
`https://www.hamingcs.com/#faq` URL, single-page anchor navigation, not a
separate page load). Framework: Playwright (`chromium` + `firefox` projects),
`retries: 1`.

Markup/behavior verified directly against `index.html` (`<section id="faq">`,
`data-tabs="faq"` / `data-tab="general|engagement|security"` buttons,
`data-tabset="faq"` / `data-tabpanel="general|engagement|security"` panels,
each question a native `<details class="qa"><summary>...</summary><div
class="qa__a">...</div></details>`) and `site.js` (`[data-tabs]` click handler
toggles `.is-active` on the clicked button and the matching panel only — it
does not touch the native `<details open>` state of any accordion item
underneath).

Two implementation details that affect test design and aren't explicit in
the Gherkin text:
- Three of the ten questions ship with the `open` attribute already set
  (`What does Hamingcs actually do?`, `How does an engagement start?`, `Do
  you work under NDA?` — one per tab/category). For these, the spec's "When
  I click/expand it" step would actually **collapse** the answer on a plain
  click, since `<details>`/`<summary>` toggles. These are called out as
  `boundary` tests below rather than `happy-path`, with a precondition note.
- Tab switching only toggles a CSS-visibility class on the panel; it never
  touches the `open` attribute of the `<details>` elements inside it. So an
  expanded question's state should survive a switch away and back to its
  tab — worth its own test, not assumed.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| TC-FAQ-001 | happy-path | FAQ section is headed "FAQ" with subheading "Answers to the questions that come up most." | On `https://www.hamingcs.com/#faq`, scrolled into view of the FAQ section | Chip/heading reads "FAQ"; `h2` reads "Answers to the questions that come up most." | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L10-L12 |
| TC-FAQ-002 | happy-path | A filter/grouping by "General", "Engagement", and "Security" is available and labeled correctly | Same as above | Three tab buttons are visible, labeled exactly "General", "Engagement", "Security" | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L13 |
| TC-FAQ-003 | boundary | Question "What does Hamingcs actually do?" is visible and its answer is displayed and non-empty | General tab active (default); this item ships with `open` already set | Question visible in General panel; answer text is visible and non-empty without needing a click (clicking `<summary>` would collapse it instead, since it starts open) | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L22 |
| TC-FAQ-004 | happy-path | Question "Who do you work with?" is visible and expandable with a non-empty answer | General tab active; item starts collapsed | Clicking the summary reveals a non-empty `.qa__a` answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L23 |
| TC-FAQ-005 | happy-path | Question "Do you work remotely?" is visible and expandable with a non-empty answer | General tab active; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L24 |
| TC-FAQ-006 | boundary | Question "How does an engagement start?" is visible and its answer is displayed and non-empty | Engagement tab selected; this item ships with `open` already set | Answer visible and non-empty without needing a click | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L25 |
| TC-FAQ-007 | happy-path | Question "Can you cover strategy, AI, and systems architecture together?" is visible and expandable with a non-empty answer | Engagement tab selected; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L26 |
| TC-FAQ-008 | happy-path | Question "Can you take P&L or leadership ownership, not just advise?" is visible and expandable with a non-empty answer | Engagement tab selected; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L27 |
| TC-FAQ-009 | happy-path | Question "Do you work on retainer or fixed scope?" is visible and expandable with a non-empty answer | Engagement tab selected; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L28 |
| TC-FAQ-010 | boundary | Question "Do you work under NDA?" is visible and its answer is displayed and non-empty | Security tab selected; this item ships with `open` already set | Answer visible and non-empty without needing a click | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L29 |
| TC-FAQ-011 | happy-path | Question "Do you help with compliance frameworks?" is visible and expandable with a non-empty answer | Security tab selected; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L30 |
| TC-FAQ-012 | happy-path | Question "Is security part of the AI work too?" is visible and expandable with a non-empty answer | Security tab selected; item starts collapsed | Clicking the summary reveals a non-empty answer | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L31 |
| TC-FAQ-013 | happy-path | "Do you work remotely?" answer confirms Hamingcs is global/remote-first with on-site work available where needed | General tab selected, question expanded | Answer text matches the global/remote-first + on-site-where-needed claim, consistent with the rest of the site | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L33-L35 |
| TC-FAQ-014 | happy-path | "Do you work under NDA?" answer confirms NDA/confidentiality is standard, agreed before engagement starts | Security tab selected, question expanded | Answer text matches the "standard practice, agreed before engagement begins" claim, consistent with the rest of the site | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L33,L36-L37 |
| TC-FAQ-015 | edge-case | On load, "General" tab button and panel are the default active state | Fresh load, no tab clicked yet | "General" button has `is-active`; only the General panel (3 questions) is visible; Engagement/Security panels are hidden | important | inferred: `[data-tabs="faq"]` / `[data-tabset="faq"]` default state (index.html `.is-active` on General button + panel, site.js lines 46-59) |
| TC-FAQ-016 | happy-path | Clicking "Engagement" tab shows only its 4 questions and hides General/Security | General tab active | "Engagement" button becomes active; Engagement panel (4 questions) visible; General and Security panels hidden | critical | inferred: `data-tabs` click handler, `site.js` lines 46-59 |
| TC-FAQ-017 | happy-path | Clicking "Security" tab shows only its 3 questions and hides General/Engagement | General or Engagement tab active | "Security" button becomes active; Security panel (3 questions) visible; other panels hidden | critical | inferred: `data-tabs` click handler, `site.js` lines 46-59 |
| TC-FAQ-018 | edge-case | Switching General -> Engagement -> General round-trips correctly | General tab active initially | After the round trip, General panel (and only it) is visible again and its button is marked active | important | inferred: `data-tabs` click handler, `site.js` lines 46-59 |
| TC-FAQ-019 | edge-case | Expanding a question, switching tabs away and back preserves that question's open/closed state | A collapsed question (e.g. "Who do you work with?") is expanded, then another tab is clicked, then the original tab is clicked again | The question is still expanded after returning to its tab, since tab switching only toggles panel visibility, not the `<details open>` attribute | important | inferred: `site.js` tab handler only toggles `.is-active`, never touches native `<details>` state |
| TC-FAQ-020 | boundary | Each tab panel contains exactly its expected question set with no duplicates or omissions across all three panels | All three tabs inspected | General = 3 questions, Engagement = 4 questions, Security = 3 questions; all 10 spec questions accounted for exactly once | important | inferred: index.html FAQ markup (`data-tabpanel="general/engagement/security"`) cross-checked against spec Examples table, https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L21-L31 |
| TC-FAQ-021 | edge-case | Re-clicking the already-active tab button is a no-op | A tab (e.g. General) is already active | Active button/panel and any expanded `<details>` state remain unchanged; no error thrown | nice-to-have | inferred: `data-tabs` click handler re-applies the same `.is-active` state idempotently, `site.js` lines 46-59 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to site and scroll to FAQ section (shared precondition) | — none — (shared setup applied by every test case above, not its own test) |
| Scenario: FAQ section intro is correct — heading/subheading | TC-FAQ-001 |
| Scenario: FAQ section intro is correct — filter/grouping by General/Engagement/Security available | TC-FAQ-002, TC-FAQ-015, TC-FAQ-016, TC-FAQ-017, TC-FAQ-018, TC-FAQ-020, TC-FAQ-021 |
| Scenario Outline example: "What does Hamingcs actually do?" | TC-FAQ-003 |
| Scenario Outline example: "Who do you work with?" | TC-FAQ-004 |
| Scenario Outline example: "Do you work remotely?" | TC-FAQ-005 |
| Scenario Outline example: "How does an engagement start?" | TC-FAQ-006 |
| Scenario Outline example: "Can you cover strategy, AI, and systems architecture together?" | TC-FAQ-007 |
| Scenario Outline example: "Can you take P&L or leadership ownership, not just advise?" | TC-FAQ-008 |
| Scenario Outline example: "Do you work on retainer or fixed scope?" | TC-FAQ-009 |
| Scenario Outline example: "Do you work under NDA?" | TC-FAQ-010 |
| Scenario Outline example: "Do you help with compliance frameworks?" | TC-FAQ-011 |
| Scenario Outline example: "Is security part of the AI work too?" | TC-FAQ-012 |
| Scenario: FAQ answers are consistent with the rest of the site — remote/on-site claim | TC-FAQ-013 |
| Scenario: FAQ answers are consistent with the rest of the site — NDA claim | TC-FAQ-014 |
| Code-derived: tab-switch preserves accordion open/closed state underneath (not in spec text, found in site.js) | TC-FAQ-019 |
| Code-derived: exact question count/distribution per tab (not in spec text, found in index.html) | TC-FAQ-020 |
| Code-derived: idempotent re-click of active tab (not in spec text, found in site.js) | TC-FAQ-021 |
