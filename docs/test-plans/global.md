# Test plan: global

_Last updated: 2026-09-09_

This is a **verification re-run** after fix commit `6a76f4e`, which addressed
three previously-filed bugs against the global/site-wide chrome:
- RachidSo/hamingcswebsite#1 — no mobile nav hamburger toggle (`.nav-links`
  was hidden below 900px with no way to reveal it) — fixed with a
  `.nav-toggle` button + `site.js` click handler.
- RachidSo/hamingcswebsite#2 — heading hierarchy skipped h1→h3 in the hero
  pillar cards — now h1→h2.
- RachidSo/hamingcswebsite#3 — no `404.html` existed — now a custom 404 page
  exists with a "Back to home" link.

Test cases GLB-009 through GLB-012 (MOB-01/MOB-02), GLB-025 (A11Y-02), and
GLB-030/GLB-031 (NOTFOUND-02) are the three previously-failing areas and are
marked `critical` below for priority re-verification in this run. Spec
source: `specs/global.feature`. Framework: Playwright (`playwright.config.js`
— `chromium` + `firefox` projects, tests live under `tests/`, matched by
`**/*_test.js`, JSON results written per-module per `PLAYWRIGHT_JSON_OUTPUT_NAME`).
No `baseURL` is configured — every test must navigate with the full
`https://hamingcs.com/...` URL, per `specs/README.md`'s note that this is a
single-page site using in-page anchors (`#top`, `#services`, `#about`,
`#contact`), not four separate page URLs.

| Test ID | Flow type | Description | Preconditions | Expected result | Priority | Use Case Ref |
|---------|-----------|--------------|----------------|------------------|----------|--------------|
| GLB-001 | happy-path | Site is served over HTTPS on the custom domain with no insecure redirect | Navigate to `https://hamingcs.com` | Response status 200, valid TLS certificate, no redirect to `http://` | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L9 |
| GLB-002 | happy-path | Page has correct title, meta description, Open Graph tags, and Twitter card meta | Navigate to `https://hamingcs.com/` | Status 200; title is "Hamingcs — AI, Data & IT Strategy Consulting"; meta description, og:title/og:description/og:image/og:url, and a Twitter card tag are all present | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L15 |
| GLB-003 | happy-path | "Home" nav link scrolls to the hero section | On `https://hamingcs.com/` | Clicking "Home" sets URL fragment to `#top` and scrolls to that section | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L31) |
| GLB-004 | happy-path | "Services" nav link scrolls to the services section | On `https://hamingcs.com/` | Clicking "Services" sets URL fragment to `#services` and scrolls to that section | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L32) |
| GLB-005 | happy-path | "About" nav link scrolls to the about section | On `https://hamingcs.com/` | Clicking "About" sets URL fragment to `#about` and scrolls to that section | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L33) |
| GLB-006 | happy-path | "Contact" nav link scrolls to the contact section | On `https://hamingcs.com/` | Clicking "Contact" sets URL fragment to `#contact` and scrolls to that section | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L34) |
| GLB-007 | happy-path | "Start a conversation" CTA (any instance) jumps to the contact section | On `https://hamingcs.com/` | URL fragment becomes `#contact` | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L36 |
| GLB-008 | happy-path | "See what we do" hero CTA jumps to the services section | On `https://hamingcs.com/` | URL fragment becomes `#services` | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L36 (second When, L40) |
| GLB-009 | boundary | Below 900px viewport width, nav links are hidden by default and the hamburger toggle is visible (MOB-01) | Viewport set to 375px wide (mobile), page loaded | `.nav-links` has no `is-open` class and is not visually revealed; `.nav-toggle` button is displayed (`aria-expanded="false"`) | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43 |
| GLB-010 | edge-case | Tapping the hamburger toggle opens the nav menu, revealing the nav links (MOB-01/MOB-02) | Mobile viewport (375px), menu closed | Tapping `.nav-toggle` adds `is-open` to `.nav-links` and sets `aria-expanded="true"`; Home/Services/About/Contact links become visible | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43 |
| GLB-011 | edge-case | Tapping the hamburger toggle again closes an already-open nav menu (MOB-02) | Mobile viewport (375px), menu already open via GLB-010 | Tapping `.nav-toggle` removes `is-open` from `.nav-links` and sets `aria-expanded="false"`; links are hidden again | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43 |
| GLB-012 | edge-case | Each nav link inside the open mobile menu is tappable, navigates to the correct anchor, and the menu closes afterward | Mobile viewport (375px), menu open via GLB-010 | Tapping any of Home/Services/About/Contact updates the URL fragment to the matching anchor and the menu auto-closes (`is-open` removed, `aria-expanded="false"`) | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43 |
| GLB-013 | boundary | Above 900px viewport width, nav links are visible by default and the hamburger toggle is hidden | Viewport set to 1440px wide (desktop), page loaded | `.nav-links` visible without interaction; `.nav-toggle` is not displayed | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43 |
| GLB-014 | happy-path | Footer displays the contact email | On `https://hamingcs.com/`, scrolled to footer | Footer text contains "info@hamingcs.com" | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-015 | happy-path | Footer displays the company location | On `https://hamingcs.com/`, scrolled to footer | Footer text contains "United Arab Emirates" | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-016 | happy-path | Footer displays the operating mode | On `https://hamingcs.com/`, scrolled to footer | Footer text contains "Global / remote-first" | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-017 | happy-path | Footer includes the same anchor links as the header nav | On `https://hamingcs.com/`, scrolled to footer | Footer has working Home/Services/About/Contact anchor links matching the header's `#top`/`#services`/`#about`/`#contact` | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-018 | negative | No individual personal name is displayed anywhere on the page (footer context) | On `https://hamingcs.com/`, full page text available | Rendered text contains no individual founder/employee personal name | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-019 | happy-path | Footer shows a copyright line for the current (or stated) year | On `https://hamingcs.com/`, scrolled to footer | Footer text matches "© {year} Hamingcs. All rights reserved." where year is 2026 or the current year | nice-to-have | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50 |
| GLB-020 | boundary | Page is usable at the mobile breakpoint (375x812) | Viewport set to 375x812 | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L67) |
| GLB-021 | boundary | Page is usable at the tablet breakpoint (768x1024) | Viewport set to 768x1024 | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L68) |
| GLB-022 | boundary | Page is usable at the desktop breakpoint (1440x900) | Viewport set to 1440x900 | No horizontal scrollbar; no clipped/overlapping text or elements; nav and CTAs remain usable | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L69) |
| GLB-023 | happy-path | Page load performance is acceptable | Navigate to `https://hamingcs.com/` on a simulated fast-4G connection | Largest Contentful Paint under 2.5s; no render-blocking errors in the browser console | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L71 |
| GLB-024 | happy-path | Every image, including the logo, has a non-empty alt attribute | On `https://hamingcs.com/` | All `<img>` elements (including `logo-icon.png` instances) have a non-empty `alt` attribute | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78 |
| GLB-025 | boundary | Heading tags follow a logical order with no skipped levels across the section headings (A11Y-02) | On `https://hamingcs.com/`, full DOM loaded | Exactly one `h1` on the page; heading levels never skip (e.g. no h1→h3) across WHY THREE DISCIPLINES, OUR BACKGROUND, HOW WE APPROACH STRATEGY, HOW WE WORK, SERVICES, HOW WE ENGAGE, FAQ, CONTACT and the hero pillar cards | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78 |
| GLB-026 | boundary | Text/background color contrast meets WCAG AA | On `https://hamingcs.com/` | Normal text has a contrast ratio of at least 4.5:1 against its background | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78 |
| GLB-027 | happy-path | All interactive elements are reachable and operable via keyboard | On `https://hamingcs.com/` | Nav links, CTAs, FAQ accordion, and the mailto link are all reachable via Tab and operable via Enter | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78 |
| GLB-028 | happy-path | Every internal anchor link resolves to an existing section on the page | On `https://hamingcs.com/` | Every internal `#`-anchor used in nav/footer/CTAs matches an element with that `id` present on the page | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L88 |
| GLB-029 | happy-path | The mailto link is correctly formatted | On `https://hamingcs.com/` | A link with `href="mailto:info@hamingcs.com"` is present and well-formed | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L88 |
| GLB-030 | happy-path | Navigating to an unknown route shows a custom 404 page (NOTFOUND precursor) | Navigate to `https://hamingcs.com/this-page-does-not-exist` | A custom "page not found" page is rendered (title "Page not found — Hamingcs", "404" chip, "This page doesn't exist." heading) rather than GitHub Pages' generic 404 | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L94 |
| GLB-031 | happy-path | The 404 page includes a working link back to the home page (NOTFOUND-02) | On the custom 404 page (from GLB-030) | A "Back to home" link (`href="/"`) is present and, when clicked, navigates to the site's home page | critical | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L94 |
| GLB-032 | negative | No individual founder/employee personal name appears anywhere in the rendered text of any page | Rendered text of `https://hamingcs.com/` and `https://hamingcs.com/404` both available | Neither page's rendered text contains an individual founder/employee personal name | important | https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L99 |
| GLB-033 | boundary | The `.nav-toggle`/`.nav-links` visibility flips correctly exactly at the 900px media-query boundary | Viewport set to 899px, then 901px | At 899px `.nav-toggle` is visible and `.nav-links` is hidden by default; at 901px `.nav-toggle` is hidden and `.nav-links` is visible by default | nice-to-have | inferred: CSS media query `@media (max-width: 900px)` toggling `.nav-toggle`/`.nav-links` (styles.css:316-331) |
| GLB-034 | nice-to-have | Resizing an open mobile nav menu above 900px auto-closes it | Mobile viewport (375px), menu open via GLB-010, then viewport resized to 1440px | `.nav-links` loses `is-open` and `.nav-toggle`'s `aria-expanded` becomes `false` once width exceeds 900px | nice-to-have | inferred: `window.addEventListener('resize', ...)` auto-close handler (site.js:41-43) |
| GLB-035 | nice-to-have | The 404 page has correct `<title>` and a `noindex` robots meta tag | Navigate to `https://hamingcs.com/this-page-does-not-exist` | `<title>` is "Page not found — Hamingcs" and `<meta name="robots" content="noindex">` is present | nice-to-have | inferred: 404.html head metadata (404.html:6-7) |

## Coverage map

| Spec element | Covered by |
|--------------|------------|
| Background: site deployed at https://hamingcs.com (shared precondition) | — none — (shared precondition across every scenario, not its own test case) |
| Scenario: Site is served over HTTPS on the custom domain (L9-13) | GLB-001 |
| Scenario: The site is a single page with correct metadata (L15-21) | GLB-002 |
| Scenario Outline: Navigation links scroll — Home (Examples row L31) | GLB-003 |
| Scenario Outline: Navigation links scroll — Services (Examples row L32) | GLB-004 |
| Scenario Outline: Navigation links scroll — About (Examples row L33) | GLB-005 |
| Scenario Outline: Navigation links scroll — Contact (Examples row L34) | GLB-006 |
| Scenario: "Start a conversation"/"See what we do" CTAs (L36-41) | GLB-007, GLB-008 |
| Scenario: Mobile navigation collapses into a menu (L43-48) | GLB-009, GLB-010, GLB-011, GLB-012, GLB-013 |
| Scenario: Footer displays correct company and contact information (L50-57) | GLB-014, GLB-015, GLB-016, GLB-017, GLB-018, GLB-019 |
| Scenario Outline: Responsive breakpoints — mobile (Examples row L67) | GLB-020 |
| Scenario Outline: Responsive breakpoints — tablet (Examples row L68) | GLB-021 |
| Scenario Outline: Responsive breakpoints — desktop (Examples row L69) | GLB-022 |
| Scenario: Page load performance is acceptable (L71-77) | GLB-023 |
| Parenthetical note on performance scenario ("pay particular attention to image weight and total page size", L75-76) | — none — (advisory note, not a Given/When/Then step; treated as a scope exclusion, not fabricated into its own test) |
| Scenario: Basic accessibility checks pass — image alt attributes (L78-86) | GLB-024 |
| Scenario: Basic accessibility checks pass — heading order / no skipped levels (L78-86) | GLB-025 |
| Scenario: Basic accessibility checks pass — color contrast WCAG AA (L78-86) | GLB-026 |
| Scenario: Basic accessibility checks pass — keyboard operability (L78-86) | GLB-027 |
| Scenario: No broken links on the site — internal anchors (L88-92) | GLB-028 |
| Scenario: No broken links on the site — mailto link (L88-92) | GLB-029 |
| Scenario: Custom 404 page for unknown routes — 404 shown (L94-97) | GLB-030 |
| Scenario: Custom 404 page for unknown routes — way back home (L94-97) | GLB-031 |
| Scenario: No use of individual names anywhere on the public site (L99-103) | GLB-032 |
| Inferred: exact 900px CSS media-query boundary (styles.css:316-331) — no corresponding spec element | GLB-033 |
| Inferred: resize-to-desktop auto-close behavior (site.js:41-43) — no corresponding spec element | GLB-034 |
| Inferred: 404.html `<title>`/`noindex` metadata (404.html:6-7) — no corresponding spec element | GLB-035 |
