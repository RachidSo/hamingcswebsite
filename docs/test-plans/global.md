# Test plan: global

_Last updated: 2026-09-09_

Spec source: `specs/global.feature` (commit `5285ec33b95d4582360dbe68df042274fa906d3b`).
Shared precondition (Background, `specs/global.feature:7`): the Hamingcs
website is deployed at `https://hamingcs.com`. Applied to every test case
below; not broken out as its own row per the Background-mapping rule.

This module has no changed file of its own — it's in scope because
`specs/contact.feature` changed and `specs/global.feature` references the
contact module in the nav table (line 34), the `#contact` URL-fragment test
(line 39), the footer contact email (line 52), and the mailto link
formatting (line 92). Rows tagged **(contact regression risk)** below are
the ones pulled into scope for that reason and should be prioritized first.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| SEC-01 | happy-path | Site is served over HTTPS on the custom domain with no insecure redirect. | Background: site deployed at https://hamingcs.com. | Response status 200, TLS certificate valid, no redirect to `http://`. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L9 |
| META-01 | happy-path | Single page loads with correct title, meta description, Open Graph, and Twitter card tags. | Background; navigate to `https://hamingcs.com/`. | Status 200; title is "Hamingcs — AI, Data & IT Strategy Consulting"; meta description present and on-brand; og:title/og:description/og:image/og:url present; Twitter card tag present. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L15 |
| NAV-01 | happy-path | Clicking the "Home" nav link scrolls to the top section. | On https://hamingcs.com/. | URL fragment becomes `#top`; page scrolls to the associated section. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L31 |
| NAV-02 | happy-path | Clicking the "Services" nav link scrolls to the services section. | On https://hamingcs.com/. | URL fragment becomes `#services`; page scrolls to the associated section. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L32 |
| NAV-03 | happy-path | Clicking the "About" nav link scrolls to the about section. | On https://hamingcs.com/. | URL fragment becomes `#about`; page scrolls to the associated section. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L33 |
| NAV-04 | happy-path | **(contact regression risk)** Clicking the "Contact" nav link scrolls to the contact section. | On https://hamingcs.com/. | URL fragment becomes `#contact`; page scrolls to the Contact section. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L34 |
| ROUTE-01 | edge-case | **(contact regression risk)** Loading the site directly at the `#contact` fragment URL (no nav click) lands on/scrolls to the Contact section. | Browser navigates straight to https://hamingcs.com/#contact (this is the precondition `contact.feature`'s own Background relies on). | Page loads with `#contact` in the URL; Contact section is visible/scrolled-to on initial paint, not only after a nav click. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L7 |
| CTA-01 | happy-path | **(contact regression risk)** Clicking any "Start a conversation" CTA anywhere on the page jumps to the Contact section. | On https://hamingcs.com/. | URL fragment becomes `#contact`. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L38 |
| CTA-02 | happy-path | Clicking "See what we do" in the hero jumps to the Services section. | On https://hamingcs.com/. | URL fragment becomes `#services`. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L40 |
| MOB-01 | edge-case | At a 375px mobile viewport, nav collapses into a hamburger icon and expands to show all links on tap. | Viewport set to 375px wide. | Nav shows hamburger icon; tapping it reveals nav links; each link is tappable and navigates correctly. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L43 |
| MOB-02 | edge-case | **(contact regression risk)** At a 375px mobile viewport, tapping "Contact" inside the expanded hamburger menu navigates to `#contact`. | Viewport set to 375px wide; hamburger menu open. | Contact link is tappable; URL fragment becomes `#contact`. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L48 |
| FOOTER-01 | happy-path | **(contact regression risk)** Footer displays the correct contact email. | On https://hamingcs.com/. | Footer shows "info@hamingcs.com". | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L52 |
| FOOTER-02 | happy-path | Footer displays the correct location. | On https://hamingcs.com/. | Footer shows "United Arab Emirates". | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L53 |
| FOOTER-03 | happy-path | Footer displays the correct operating mode. | On https://hamingcs.com/. | Footer shows "Global / remote-first". | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L54 |
| FOOTER-04 | happy-path | **(contact regression risk)** Footer anchor links (Home/Services/About/Contact) mirror the header's, including a working Contact entry. | On https://hamingcs.com/. | Footer has the same four anchor links as the header; footer's Contact link targets `#contact`. | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L55 |
| FOOTER-05 | negative | No individual personal name appears anywhere in the footer. | On https://hamingcs.com/. | Footer text contains no founder/employee personal name. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L56 |
| FOOTER-06 | happy-path | Footer shows a correct copyright line. | On https://hamingcs.com/. | Footer reads "© 2026 Hamingcs. All rights reserved." (or current year). | nice-to-have | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L57 |
| RESP-01 | boundary | Site renders correctly at a 375x812 mobile viewport. | Viewport set to 375x812. | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L67 |
| RESP-02 | boundary | Site renders correctly at a 768x1024 tablet viewport. | Viewport set to 768x1024. | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L68 |
| RESP-03 | boundary | Site renders correctly at a 1440x900 desktop viewport. | Viewport set to 1440x900. | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L69 |
| PERF-01 | boundary | Page load performance meets the LCP budget on a simulated fast-4G connection, with reasonable image/page weight. | Navigate to https://hamingcs.com/ under simulated fast-4G throttling. | Largest Contentful Paint under 2.5s; no render-blocking console errors; total page/image weight is not excessive for a long single-page site. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L71 |
| A11Y-01 | boundary | Every image, including the logo, has a non-empty `alt` attribute. | On https://hamingcs.com/. | No `<img>` (incl. logo) with missing/empty `alt`. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L80 |
| A11Y-02 | boundary | Heading tags follow a logical order across all sections (one h1, no skipped levels). | On https://hamingcs.com/. | Exactly one `h1`; heading levels across all section headings (WHY THREE DISCIPLINES, OUR BACKGROUND, HOW WE APPROACH STRATEGY, HOW WE WORK, SERVICES, HOW WE ENGAGE, FAQ, CONTACT) don't skip a level. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L81 |
| A11Y-03 | boundary | Text/background color contrast meets WCAG AA. | On https://hamingcs.com/. | Normal text contrast ratio >= 4.5:1. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L84 |
| A11Y-04 | boundary | **(contact regression risk)** All interactive elements — nav links, CTAs, FAQ accordion, and the mailto link — are reachable and operable via Tab/Enter. | On https://hamingcs.com/. | Keyboard-only traversal (Tab) reaches every nav link, CTA, the FAQ accordion, and the mailto link; Enter activates each, including triggering the mailto link. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L85 |
| LINK-01 | negative | Every internal anchor link resolves to an existing section on the page. | On https://hamingcs.com/. | No internal anchor link (`#...`) points to a missing section id. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L91 |
| LINK-02 | negative | **(contact regression risk)** The mailto link is correctly formatted. | On https://hamingcs.com/. | Link href is exactly `mailto:info@hamingcs.com` (no malformed scheme, no extra params breaking the address). | critical | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L92 |
| NOTFOUND-01 | negative | Navigating to an unknown route shows a custom 404 page. | Navigate to https://hamingcs.com/this-page-does-not-exist. | A 404 (or equivalent "page not found") page is shown. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L94 |
| NOTFOUND-02 | negative | The custom 404 page provides a way back to the home page. | On the 404 page. | A link/button back to the home page is present and functional. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L97 |
| NAME-01 | negative | No individual founder/employee personal name appears anywhere on the rendered page text. | Background: the two founding CVs were intentionally combined under the Hamingcs brand. | Full-page text search finds no individual personal name. | important | https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L99 |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Scenario: Site is served over HTTPS on the custom domain (global.feature#L9) | SEC-01 |
| Scenario: The site is a single page with correct metadata (global.feature#L15) | META-01 |
| Scenario Outline: Navigation links scroll to the correct section — Home (global.feature#L31) | NAV-01 |
| Scenario Outline: Navigation links scroll to the correct section — Services (global.feature#L32) | NAV-02 |
| Scenario Outline: Navigation links scroll to the correct section — About (global.feature#L33) | NAV-03 |
| Scenario Outline: Navigation links scroll to the correct section — Contact (global.feature#L34) | NAV-04 |
| Dependency: direct `#contact` URL-fragment load (contact.feature#L7 Background) | ROUTE-01 |
| Scenario: CTAs jump to the right section — "Start a conversation" -> #contact (global.feature#L38) | CTA-01 |
| Scenario: CTAs jump to the right section — "See what we do" -> #services (global.feature#L40) | CTA-02 |
| Scenario: Mobile navigation collapses into a menu — general collapse/expand/tap (global.feature#L43) | MOB-01 |
| Scenario: Mobile navigation collapses into a menu — Contact link specifically (global.feature#L48) | MOB-02 |
| Scenario: Footer displays correct info — contact email (global.feature#L52) | FOOTER-01 |
| Scenario: Footer displays correct info — location (global.feature#L53) | FOOTER-02 |
| Scenario: Footer displays correct info — operating mode (global.feature#L54) | FOOTER-03 |
| Scenario: Footer displays correct info — footer nav mirrors header incl. Contact (global.feature#L55) | FOOTER-04 |
| Scenario: Footer displays correct info — no personal name (global.feature#L56) | FOOTER-05 |
| Scenario: Footer displays correct info — copyright line (global.feature#L57) | FOOTER-06 |
| Scenario Outline: Responsive across breakpoints — mobile (global.feature#L67) | RESP-01 |
| Scenario Outline: Responsive across breakpoints — tablet (global.feature#L68) | RESP-02 |
| Scenario Outline: Responsive across breakpoints — desktop (global.feature#L69) | RESP-03 |
| Scenario: Page load performance is acceptable, incl. image/page weight note (global.feature#L71) | PERF-01 |
| Scenario: Basic accessibility checks pass — alt attributes (global.feature#L80) | A11Y-01 |
| Scenario: Basic accessibility checks pass — heading order (global.feature#L81) | A11Y-02 |
| Scenario: Basic accessibility checks pass — color contrast (global.feature#L84) | A11Y-03 |
| Scenario: Basic accessibility checks pass — keyboard operability incl. mailto link (global.feature#L85) | A11Y-04 |
| Scenario: No broken links on the site — internal anchors resolve (global.feature#L91) | LINK-01 |
| Scenario: No broken links on the site — mailto link correctly formatted (global.feature#L92) | LINK-02 |
| Scenario: Custom 404 page for unknown routes — 404 shown (global.feature#L94) | NOTFOUND-01 |
| Scenario: Custom 404 page for unknown routes — way back to home (global.feature#L97) | NOTFOUND-02 |
| Scenario: No use of individual names anywhere on the public site (global.feature#L99) | NAME-01 |
