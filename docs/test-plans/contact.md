# Test plan: contact

_Last updated: 2026-09-09_

Spec source: `specs/contact.feature` (Gherkin). All scenarios share the
`Background` precondition `Given I navigate to "https://hamingcs.com/#contact"`
(treated as a shared precondition below, not its own test case). Framework
is Playwright against the live site (see `playwright.config.js` —
`testMatch: '**/*_test.js'`, no `baseURL`, every test navigates with a full
`https://...#contact` URL; chromium + firefox projects; JSON reporter to
`results/`). No local contact form exists, so per the spec's own
parenthetical note, form validation/submission/confirmation states are
explicitly out of scope and are not represented by any test case below.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| CONTACT-001 | happy-path | Contact section is headed "CONTACT". | Navigated to `https://hamingcs.com/#contact`. | The section's chip/heading text "CONTACT" is visible. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L10 |
| CONTACT-002 | happy-path | The sub-heading "Tell us what you're building." is visible. | Navigated to `https://hamingcs.com/#contact`. | Heading text "Tell us what you're building." renders in the Contact section. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L11 |
| CONTACT-003 | happy-path | Intro copy mentions strategy, AI/data, and systems & security review. | Navigated to `https://hamingcs.com/#contact`. | Intro paragraph text contains references to strategy, AI/data, and systems-and-security review. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L12 |
| CONTACT-004 | happy-path | EMAIL detail row shows the correct address. | Navigated to `https://hamingcs.com/#contact`. | Row labeled "EMAIL" displays "info@hamingcs.com". | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L15 |
| CONTACT-005 | happy-path | LOCATION detail row shows the correct value. | Navigated to `https://hamingcs.com/#contact`. | Row labeled "LOCATION" displays "United Arab Emirates". | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L16 |
| CONTACT-006 | happy-path | OPERATING MODE detail row shows the correct value. | Navigated to `https://hamingcs.com/#contact`. | Row labeled "OPERATING MODE" displays "Global / remote-first". | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L17 |
| CONTACT-007 | happy-path | "Email us" CTA button is visible in the Contact section. | Navigated to `https://hamingcs.com/#contact`. | A button/link with visible text "Email us" is rendered and visible. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L20 |
| CONTACT-008 | boundary | "Email us" button's href is exactly the mailto link, with no extra params or whitespace. | Navigated to `https://hamingcs.com/#contact`; "Email us" button present. | `href` attribute equals exactly `mailto:info@hamingcs.com` (exact string match, not just a prefix/contains check). | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L21 |
| CONTACT-009 | happy-path | Clicking "Email us" triggers the visitor's mail client with the recipient pre-filled. | Navigated to `https://hamingcs.com/#contact`; "Email us" button present and its href already verified. | Click on the button fires a navigation/intent to `mailto:info@hamingcs.com` (verified via Playwright's mailto/protocol-handler interception, since no real OS mail client opens in CI) with `info@hamingcs.com` as the recipient. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L22-L23 |
| CONTACT-010 | negative | No Name/Email/Message contact form exists anywhere in the Contact section. | Navigated to `https://hamingcs.com/#contact`. | Querying the Contact section for form/input elements tied to Name, Email, or Message labels/placeholders returns none. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L26 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to `https://hamingcs.com/#contact` (specs/contact.feature#L6-L7) | Shared precondition for CONTACT-001 .. CONTACT-010 — not its own test case |
| Scenario: Contact section intro is correct (specs/contact.feature#L9-L12) | CONTACT-001, CONTACT-002, CONTACT-003 |
| Scenario: Contact details are displayed correctly (specs/contact.feature#L14-L17) | CONTACT-004, CONTACT-005, CONTACT-006 |
| Scenario: "Email us" button opens the visitor's mail client (specs/contact.feature#L19-L24) | CONTACT-007, CONTACT-008, CONTACT-009 |
| Scenario: There is no contact form on this page (specs/contact.feature#L25-L26) | CONTACT-010 |
| Parenthetical scope exclusion: form validation/submission/confirmation states (specs/contact.feature#L27-L28) | — none — (explicit scope exclusion per the spec's own note: this site uses direct email contact only, there is no form to validate/submit/confirm, so no test case is fabricated for it) |
