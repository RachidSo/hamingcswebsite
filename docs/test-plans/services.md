# Test plan: services

_Last updated: 2026-09-09_

Spec source: `specs/services.feature` (Gherkin). Target: live production site
`https://www.hamingcs.com/#services` (Playwright, per `playwright.config.js` —
no local baseURL, anchor-based single-page navigation, `chromium` +
`firefox` projects). Background (`Given I navigate to
"https://hamingcs.com/#services"`) is a shared precondition for every test
below, not its own test case: each scenario assumes the page has already
been loaded and scrolled/hash-navigated to the `#services` anchor.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| SVC-001 | happy-path | Services section intro renders with correct heading, subheading, and engagement copy | On `#services` anchor (Background) | Section heading reads "SERVICES"; subheading "Three disciplines. One engagement." is visible; intro copy states clients can engage one discipline or all three | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L9-L12 |
| SVC-002 | happy-path | "AI readiness & strategy" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "AI readiness & strategy" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L20 |
| SVC-003 | happy-path | "Interim AI & data leadership" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "Interim AI & data leadership" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L21 |
| SVC-004 | happy-path | "Data architecture & governance" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "Data architecture & governance" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L22 |
| SVC-005 | happy-path | "Technical evaluation & AI-output review" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "Technical evaluation & AI-output review" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L23 |
| SVC-006 | happy-path | "Generative AI & LLM integration" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "Generative AI & LLM integration" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L24 |
| SVC-007 | happy-path | "AI governance & responsible AI" service is listed under AI & DATA with a supporting description | On `#services` anchor (Background) | Service titled "AI governance & responsible AI" is visible under "AI & DATA" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L25 |
| SVC-008 | happy-path | "Cloud & SaaS transformation" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "Cloud & SaaS transformation" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L33 |
| SVC-009 | happy-path | "DevOps & CI/CD engineering" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "DevOps & CI/CD engineering" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L34 |
| SVC-010 | happy-path | "Security & threat architecture" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "Security & threat architecture" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L35 |
| SVC-011 | happy-path | "QA automation & release strategy" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "QA automation & release strategy" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L36 |
| SVC-012 | happy-path | "Security & compliance audits" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "Security & compliance audits" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L37 |
| SVC-013 | happy-path | "Cloud cost optimization" service is listed under SYSTEMS & SECURITY with a supporting description | On `#services` anchor (Background) | Service titled "Cloud cost optimization" is visible under "SYSTEMS & SECURITY" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L38 |
| SVC-014 | happy-path | "Business & AI strategy definition" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "Business & AI strategy definition" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L46 |
| SVC-015 | happy-path | "P&L & budget ownership" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "P&L & budget ownership" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L47 |
| SVC-016 | happy-path | "Global team leadership & scaling" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "Global team leadership & scaling" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L48 |
| SVC-017 | happy-path | "Market entry & expansion strategy" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "Market entry & expansion strategy" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L49 |
| SVC-018 | happy-path | "Innovation consulting" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "Innovation consulting" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L50 |
| SVC-019 | happy-path | "Academic & R&D partnerships" service is listed under STRATEGY & LEADERSHIP with a supporting description | On `#services` anchor (Background) | Service titled "Academic & R&D partnerships" is visible under "STRATEGY & LEADERSHIP" with a description of at least one sentence | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L51 |
| SVC-020 | boundary | Each of the 3 service categories lists exactly 6 services, no more and no fewer | On `#services` anchor (Background) | "AI & DATA" lists exactly 6 services; "SYSTEMS & SECURITY" lists exactly 6 services; "STRATEGY & LEADERSHIP" lists exactly 6 services | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L53-L56 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: navigate to `https://hamingcs.com/#services` | Shared precondition for SVC-001 through SVC-020 (not its own test case) |
| Scenario: Services section intro is correct (L9-L12) | SVC-001 |
| Scenario Outline: AI & Data services are listed — "AI readiness & strategy" (L20) | SVC-002 |
| Scenario Outline: AI & Data services are listed — "Interim AI & data leadership" (L21) | SVC-003 |
| Scenario Outline: AI & Data services are listed — "Data architecture & governance" (L22) | SVC-004 |
| Scenario Outline: AI & Data services are listed — "Technical evaluation & AI-output review" (L23) | SVC-005 |
| Scenario Outline: AI & Data services are listed — "Generative AI & LLM integration" (L24) | SVC-006 |
| Scenario Outline: AI & Data services are listed — "AI governance & responsible AI" (L25) | SVC-007 |
| Scenario Outline: Systems & Security services are listed — "Cloud & SaaS transformation" (L33) | SVC-008 |
| Scenario Outline: Systems & Security services are listed — "DevOps & CI/CD engineering" (L34) | SVC-009 |
| Scenario Outline: Systems & Security services are listed — "Security & threat architecture" (L35) | SVC-010 |
| Scenario Outline: Systems & Security services are listed — "QA automation & release strategy" (L36) | SVC-011 |
| Scenario Outline: Systems & Security services are listed — "Security & compliance audits" (L37) | SVC-012 |
| Scenario Outline: Systems & Security services are listed — "Cloud cost optimization" (L38) | SVC-013 |
| Scenario Outline: Strategy & Leadership services are listed — "Business & AI strategy definition" (L46) | SVC-014 |
| Scenario Outline: Strategy & Leadership services are listed — "P&L & budget ownership" (L47) | SVC-015 |
| Scenario Outline: Strategy & Leadership services are listed — "Global team leadership & scaling" (L48) | SVC-016 |
| Scenario Outline: Strategy & Leadership services are listed — "Market entry & expansion strategy" (L49) | SVC-017 |
| Scenario Outline: Strategy & Leadership services are listed — "Innovation consulting" (L50) | SVC-018 |
| Scenario Outline: Strategy & Leadership services are listed — "Academic & R&D partnerships" (L51) | SVC-019 |
| Scenario: Each service category totals exactly 6 items (L53-L56) | SVC-020 |
