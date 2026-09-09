# Test plan: engagement

_Last updated: 2026-09-09_

> Scope note: the `engagement` module has no changed file of its own in this
> diff. It is in scope only because `impacted_modules` flagged a dependency
> chain `specs/contact.feature -> engagement (CTA link targets)`: every
> engagement-model CTA in `specs/engagement.feature:18` links to `#contact`,
> so a change to the contact module's anchor/section could silently break
> engagement's CTAs. ENG-005/006/007 below exist specifically to cover that
> regression risk — each verifies one engagement-model CTA still links to and
> navigates to `#contact`.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| ENG-001 | happy-path | Section is headed "HOW WE ENGAGE" with subheading "Three ways in, one point of contact." visible | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | Both heading and subheading render with the exact text | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L10 |
| ENG-002 | happy-path | Advisory engagement model card shows title "Advisory", tag "Ongoing", description containing "Retained strategy input for AI, data, and security decisions", its own bullet list, and its own "Start a conversation" button | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | All five elements (title, tag, description, bullets, CTA) are visible on the Advisory card specifically | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L22 |
| ENG-003 | happy-path | Interim leadership engagement model card shows title "Interim leadership", tag "Embedded", description containing "hands-on strategy, AI, data, or systems lead inside your organization", its own bullet list, and its own "Start a conversation" button | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | All five elements (title, tag, description, bullets, CTA) are visible on the Interim leadership card specifically | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L23 |
| ENG-004 | happy-path | Project delivery engagement model card shows title "Project delivery", tag "Scoped", description containing "A defined engagement against a specific outcome", its own bullet list, and its own "Start a conversation" button | On https://hamingcs.com/, scrolled to the "HOW WE ENGAGE" section | All five elements (title, tag, description, bullets, CTA) are visible on the Project delivery card specifically | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L24 |
| ENG-005 | boundary | Advisory card's "Start a conversation" CTA links to and, on click, navigates/scrolls to `#contact` | Advisory engagement model card is visible | CTA's `href` is exactly `#contact`; clicking it moves focus/scroll to the Contact section (id="contact") without a full page reload | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18 |
| ENG-006 | boundary | Interim leadership card's "Start a conversation" CTA links to and, on click, navigates/scrolls to `#contact` | Interim leadership engagement model card is visible | CTA's `href` is exactly `#contact`; clicking it moves focus/scroll to the Contact section (id="contact") without a full page reload | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18 |
| ENG-007 | boundary | Project delivery card's "Start a conversation" CTA links to and, on click, navigates/scrolls to `#contact` | Project delivery engagement model card is visible | CTA's `href` is exactly `#contact`; clicking it moves focus/scroll to the Contact section (id="contact") without a full page reload | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18 |
| ENG-008 | happy-path | Advisory card's bullets include exactly "Recurring strategy & architecture review", "Direct access for ad-hoc decisions", and "Roadmap and governance input" | Advisory engagement model card is visible | All three bullet strings are present, in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L26 |
| ENG-009 | happy-path | Interim leadership card's bullets include exactly "Everything in Advisory", "Hiring, structure, and budget ownership", "Operating cadence and delivery accountability", and "Handover plan built in from day one" | Interim leadership engagement model card is visible | All four bullet strings are present, in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L31 |
| ENG-010 | happy-path | Project delivery card's bullets include exactly "Fixed scope and timeline", "Security, cloud, or AI-specialist team", and "Clear handoff and documentation" | Project delivery engagement model card is visible | All three bullet strings are present, in the card's bullet list, no more/fewer | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L37 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to https://hamingcs.com/ and scroll to "HOW WE ENGAGE" section (shared precondition, not its own test) | ENG-001, ENG-002, ENG-003, ENG-004, ENG-005, ENG-006, ENG-007, ENG-008, ENG-009, ENG-010 |
| Scenario: Section intro is correct | ENG-001 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Advisory" | ENG-002, ENG-005 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Interim leadership" | ENG-003, ENG-006 |
| Scenario Outline: Each engagement model is presented with its own CTA — Examples row "Project delivery" | ENG-004, ENG-007 |
| Scenario: Advisory model lists its scope | ENG-008 |
| Scenario: Interim leadership model lists its scope | ENG-009 |
| Scenario: Project delivery model lists its scope | ENG-010 |
