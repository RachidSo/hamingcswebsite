# Test plan: engagement

_Last updated: 2026-09-09_

> Scope note: the `engagement` module has no changed file of its own in this
> diff. It is in scope as an `impacted_modules` entry because the shared
> files `index.html` / `styles.css` / `site.js` changed in commit `6a76f4e`,
> a fix commit addressing site-wide mobile nav, heading hierarchy, and 404
> page bugs. This run is a verification re-run: the bulk of the plan below
> re-derives the full happy-path/boundary coverage straight from
> `specs/engagement.feature` (unchanged by this commit, but the section it
> describes renders from the shared files that did change), plus two
> targeted regression checks (ENG-018, ENG-019) tracing to the relevant
> slices of `specs/global.feature` that intersect this section specifically:
> the "HOW WE ENGAGE" heading's level in the site-wide heading-order check,
> and this section's own CTA usability at the mobile breakpoint. The 404
> page fix has no bearing on this section at all (it's a routing/shared-404
> concern, not part of engagement.feature) — see the coverage map's `— none
> —` row for that.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| ENG-001 | happy-path | "HOW WE ENGAGE" section heading is visible with the exact text | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | Heading renders with exact text "HOW WE ENGAGE" | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L11 |
| ENG-002 | happy-path | Subheading "Three ways in, one point of contact." is visible below the section heading | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | Subheading renders with the exact text | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L12 |
| ENG-003 | happy-path | Advisory card shows title "Advisory" and tag "Ongoing" | Scrolled to the "HOW WE ENGAGE" section | Both title and tag render on the Advisory card | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22 |
| ENG-004 | happy-path | Advisory card's description contains "Retained strategy input for AI, data, and security decisions" | Advisory engagement model card is visible | Description text includes the expected substring | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22 |
| ENG-005 | happy-path | Advisory card renders its own non-empty bullet list | Advisory engagement model card is visible | At least one bullet item is present inside the Advisory card specifically (not shared with other cards) | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22 |
| ENG-006 | happy-path | Advisory card has its own "Start a conversation" button linking to `#contact` | Advisory engagement model card is visible | Button is present inside the Advisory card, `href`/target is exactly `#contact` | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18 |
| ENG-007 | happy-path | Interim leadership card shows title "Interim leadership" and tag "Embedded" | Scrolled to the "HOW WE ENGAGE" section | Both title and tag render on the Interim leadership card | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23 |
| ENG-008 | happy-path | Interim leadership card's description contains "hands-on strategy, AI, data, or systems lead inside your organization" | Interim leadership engagement model card is visible | Description text includes the expected substring | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23 |
| ENG-009 | happy-path | Interim leadership card renders its own non-empty bullet list | Interim leadership engagement model card is visible | At least one bullet item is present inside the Interim leadership card specifically | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23 |
| ENG-010 | happy-path | Interim leadership card has its own "Start a conversation" button linking to `#contact` | Interim leadership engagement model card is visible | Button is present inside the Interim leadership card, `href`/target is exactly `#contact` | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18 |
| ENG-011 | happy-path | Project delivery card shows title "Project delivery" and tag "Scoped" | Scrolled to the "HOW WE ENGAGE" section | Both title and tag render on the Project delivery card | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24 |
| ENG-012 | happy-path | Project delivery card's description contains "A defined engagement against a specific outcome" | Project delivery engagement model card is visible | Description text includes the expected substring | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24 |
| ENG-013 | happy-path | Project delivery card renders its own non-empty bullet list | Project delivery engagement model card is visible | At least one bullet item is present inside the Project delivery card specifically | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24 |
| ENG-014 | happy-path | Project delivery card has its own "Start a conversation" button linking to `#contact` | Project delivery engagement model card is visible | Button is present inside the Project delivery card, `href`/target is exactly `#contact` | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18 |
| ENG-015 | boundary | Advisory card's bullets include exactly "Recurring strategy & architecture review", "Direct access for ad-hoc decisions", and "Roadmap and governance input" | Advisory engagement model card is visible | All three bullet strings are present in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L26 |
| ENG-016 | boundary | Interim leadership card's bullets include exactly "Everything in Advisory", "Hiring, structure, and budget ownership", "Operating cadence and delivery accountability", and "Handover plan built in from day one" | Interim leadership engagement model card is visible | All four bullet strings are present in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L31 |
| ENG-017 | boundary | Project delivery card's bullets include exactly "Fixed scope and timeline", "Security, cloud, or AI-specialist team", and "Clear handoff and documentation" | Project delivery engagement model card is visible | All three bullet strings are present in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L37 |
| ENG-018 | edge-case | "HOW WE ENGAGE" section heading still renders at the correct heading level (no skipped levels relative to neighboring sections) after the site-wide heading-hierarchy fix in 6a76f4e | Scrolled to the "HOW WE ENGAGE" section; full-page heading scan available | Heading tag order across the page remains logical (one h1, no skipped levels) with "HOW WE ENGAGE" in its expected position | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L81 |
| ENG-019 | edge-case | At a 375px mobile viewport, each engagement card's own "Start a conversation" CTA remains visible, tappable, and still targets `#contact` after the site-wide mobile-nav fix in 6a76f4e | Mobile viewport (375x812); scrolled to the "HOW WE ENGAGE" section | All three cards' CTAs are usable at mobile width and each still resolves to `#contact` | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L67 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to https://hamingcs.com/ and scroll to "HOW WE ENGAGE" section (shared precondition, not its own test) | ENG-001 through ENG-019 |
| Scenario: Section intro is correct | ENG-001, ENG-002 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Advisory" | ENG-003, ENG-004, ENG-005, ENG-006 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Interim leadership" | ENG-007, ENG-008, ENG-009, ENG-010 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Project delivery" | ENG-011, ENG-012, ENG-013, ENG-014 |
| Scenario: Advisory model lists its scope | ENG-015 |
| Scenario: Interim leadership model lists its scope | ENG-016 |
| Scenario: Project delivery model lists its scope | ENG-017 |
| global.feature — Scenario: Basic accessibility checks pass (heading-order slice naming "HOW WE ENGAGE", relevant to the 6a76f4e heading-hierarchy fix) | ENG-018 |
| global.feature — Scenario Outline: Site is responsive across common breakpoints (mobile example, "all navigation and CTAs remain usable", relevant to the 6a76f4e mobile-nav fix) | ENG-019 |
| global.feature — Scenario: Custom 404 page for unknown routes (part of the same 6a76f4e fix commit) | — none — (404 routing has no intersection with the "HOW WE ENGAGE" section's own content/CTAs; covered in the `global` module's own test plan, not here) |
