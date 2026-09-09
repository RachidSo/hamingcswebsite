// @ts-check
// Regression suite for module "global" — holds the latest passing
// implementation of each promoted test case. Only tests that have
// actually passed a test-executor run are merged in here; see
// tests/generated/global_test.js for the full generated set (including
// currently-failing cases) and docs/test-plans/global.md for the table
// these were derived from.
//
// Test IDs were renumbered from the old MOB-xx/A11Y-xx/etc. scheme to
// the GLB-xxx scheme when the plan was regenerated for commit 6a76f4e's
// verification pass; both schemes covered the same underlying spec
// scenarios (specs/global.feature, + specs/contact.feature for the
// #contact dependency), so this file holds only the GLB-xxx versions
// rather than keeping both side by side. GLB-025 (heading hierarchy) and
// GLB-032 (no individual names) are still failing in
// tests/generated/global_test.js and are therefore NOT present here —
// they'll be added on a future run once they pass. GLB-001 (HTTPS/
// security details) was also failing as of commit 6a76f4e — a one-line
// test-script bug (`security.protocol()` called as a method instead of
// read as the property it actually is), tracked as issue #5 — fixed and
// promoted here now that it passes.
//
// Framework: Playwright against the live site (see playwright.config.js
// — testMatch: '**/*_test.js', no baseURL, every test navigates with a
// full https://hamingcs.com/... URL; chromium + firefox projects; JSON
// reporter to results/).
//
// GLB-006, GLB-014, GLB-017, GLB-028, GLB-029 guard the contact module's
// exposed surface (#contact anchor, footer email, mailto link format)
// against regressions from other modules' code — each assertion is
// pinned to the exact real markup in index.html (section ids, hrefs,
// link text) rather than a loose text/contains check.

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://hamingcs.com';
const MAILTO_HREF = 'mailto:info@hamingcs.com';
const MOBILE_VIEWPORT = { width: 375, height: 812 };
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };

/**
 * Presses Tab repeatedly until the focused element matches `predicate`,
 * or `maxTabs` is reached. Returns the matching element's info
 * (tag/text/href) or null if never found. Used for the keyboard-
 * operability check (GLB-027).
 */
async function tabUntil(page, predicate, maxTabs = 60) {
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return {
        tag: el.tagName,
        text: (el.textContent || '').trim(),
        href: el.getAttribute('href'),
      };
    });
    if (info && predicate(info)) return info;
  }
  return null;
}

// ---------------------------------------------------------------------------
// GLB-001 — HTTPS/security
// ---------------------------------------------------------------------------

// TEST-ID: GLB-001 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L9
test('GLB-001: site is served over HTTPS on the custom domain with no insecure redirect', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response).not.toBeNull();
  expect(response.status()).toBe(200);
  expect(response.url().startsWith('https://')).toBe(true);
  expect(response.url().startsWith('http://')).toBe(false);

  const security = await response.securityDetails();
  expect(security).not.toBeNull();
  // `securityDetails()` resolves to a plain object — `protocol` is a
  // string property, not a method. Calling it as `security.protocol()`
  // throws a TypeError before this assertion ever runs (issue #5).
  expect(security?.protocol).toMatch(/TLS/i);
});

// ---------------------------------------------------------------------------
// GLB-002 — metadata
// ---------------------------------------------------------------------------

// TEST-ID: GLB-002 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L15
test('GLB-002: page has correct title, meta description, OG, and Twitter card tags', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response.status()).toBe(200);

  await expect(page).toHaveTitle('Hamingcs — AI, Data & IT Strategy Consulting');

  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy();

  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    const content = await page.locator(`meta[property="${prop}"]`).getAttribute('content');
    expect(content, `${prop} should be present and non-empty`).toBeTruthy();
  }

  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  expect(twitterCard).toBeTruthy();
});

// ---------------------------------------------------------------------------
// GLB-003..006 — nav link scrolling
// ---------------------------------------------------------------------------

// TEST-ID: GLB-003 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L31)
test('GLB-003: "Home" nav link scrolls to the hero section', async ({ page }) => {
  await page.goto(`${BASE_URL}/#services`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page.locator('#top')).toBeInViewport();
});

// TEST-ID: GLB-004 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L32)
test('GLB-004: "Services" nav link scrolls to the services section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

// TEST-ID: GLB-005 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L33)
test('GLB-005: "About" nav link scrolls to the about section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
});

// TEST-ID: GLB-006 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L23 (Examples row L34)
// Contact regression risk: guards the header nav's link into the contact
// module's #contact anchor.
test('GLB-006: "Contact" nav link scrolls to the contact section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const navContactLink = page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Contact', exact: true });
  await expect(navContactLink).toHaveAttribute('href', '#contact');

  await navContactLink.click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('section#contact')).toBeInViewport();
});

// ---------------------------------------------------------------------------
// GLB-007, GLB-008 — CTAs
// ---------------------------------------------------------------------------

// TEST-ID: GLB-007 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L36
// Contact regression risk: every "Start a conversation" CTA on the page
// (hero, engagement plans, nav) must continue to resolve into the contact
// module's #contact anchor.
test('GLB-007: every "Start a conversation" CTA jumps to the contact section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const ctas = page.getByRole('link', { name: 'Start a conversation' });
  const count = await ctas.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(ctas.nth(i)).toHaveAttribute('href', '#contact');
  }

  await ctas.first().click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('section#contact')).toBeInViewport();
});

// TEST-ID: GLB-008 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L36 (second When, L40)
test('GLB-008: "See what we do" hero CTA jumps to the services section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const cta = page.locator('.hero-actions').getByRole('link', { name: 'See what we do' });
  await expect(cta).toHaveAttribute('href', '#services');
  await cta.click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

// ---------------------------------------------------------------------------
// GLB-009..013 — mobile hamburger menu
// ---------------------------------------------------------------------------

// TEST-ID: GLB-009 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43
test('GLB-009: below 900px, nav links are hidden by default and the hamburger toggle is visible', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  const navLinks = page.locator('#nav-links');
  await expect(navLinks).not.toHaveClass(/is-open/);
  await expect(navLinks).toBeHidden();

  const navToggle = page.locator('.nav-toggle');
  await expect(navToggle).toBeVisible();
  await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navToggle).toHaveAttribute('aria-controls', 'nav-links');
});

// TEST-ID: GLB-010 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43
test('GLB-010: tapping the hamburger toggle opens the nav menu, revealing the nav links', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  const navToggle = page.locator('.nav-toggle');
  const navLinks = page.locator('#nav-links');
  await expect(navLinks).toBeHidden();

  await navToggle.click();

  await expect(navLinks).toHaveClass(/is-open/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navLinks).toBeVisible();
  for (const label of ['Home', 'Services', 'About', 'Contact']) {
    await expect(navLinks.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
});

// TEST-ID: GLB-011 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43
test('GLB-011: tapping the hamburger toggle again closes an already-open nav menu', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  const navToggle = page.locator('.nav-toggle');
  const navLinks = page.locator('#nav-links');

  // Open it first (precondition: menu already open via GLB-010's flow).
  await navToggle.click();
  await expect(navLinks).toHaveClass(/is-open/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

  // Tap again to close.
  await navToggle.click();
  await expect(navLinks).not.toHaveClass(/is-open/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navLinks).toBeHidden();
});

// TEST-ID: GLB-012 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43
test('GLB-012: each nav link inside the open mobile menu navigates correctly and the menu auto-closes', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  const navToggle = page.locator('.nav-toggle');
  const navLinks = page.locator('#nav-links');

  const expectedPairs = [
    ['Home', '#top'],
    ['Services', '#services'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ];

  for (const [label, anchor] of expectedPairs) {
    await navToggle.click();
    await expect(navLinks).toHaveClass(/is-open/);
    await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

    const link = navLinks.getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', anchor);
    await link.click();

    await expect(page).toHaveURL(new RegExp(`${anchor}$`));
    await expect(navLinks).not.toHaveClass(/is-open/);
    await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
  }
});

// TEST-ID: GLB-013 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L43
test('GLB-013: above 900px, nav links are visible by default and the hamburger toggle is hidden', async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  await expect(page.locator('#nav-links')).toBeVisible();
  await expect(page.locator('.nav-toggle')).toBeHidden();
});

// ---------------------------------------------------------------------------
// GLB-014..019 — footer
// ---------------------------------------------------------------------------

// TEST-ID: GLB-014 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
// Contact regression risk: the footer's displayed contact email is the same
// address the contact module's mailto link and detail row use.
test('GLB-014: footer displays the contact email', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const footerEmailLink = page.locator('footer.site-footer').getByRole('link', { name: 'info@hamingcs.com' });
  await expect(footerEmailLink).toBeVisible();
  await expect(footerEmailLink).toHaveText('info@hamingcs.com');
  await expect(footerEmailLink).toHaveAttribute('href', MAILTO_HREF);
});

// TEST-ID: GLB-015 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
test('GLB-015: footer displays the company location', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.locator('footer.site-footer')).toContainText('United Arab Emirates');
});

// TEST-ID: GLB-016 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
test('GLB-016: footer displays the operating mode', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.locator('footer.site-footer')).toContainText('Global / remote-first');
});

// TEST-ID: GLB-017 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
// Contact regression risk: the footer's Contact anchor must mirror the
// header's — same four links, same #contact target — so the footer stays a
// valid secondary entry point into the contact module.
test('GLB-017: footer includes the same anchor links as the header nav', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const headerLinks = page.locator('nav.site-nav .nav-links a');
  const footerLinks = page.locator('footer.site-footer .footer-col').first().locator('a');

  const expectedPairs = [
    ['Home', '#top'],
    ['Services', '#services'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ];

  await expect(headerLinks).toHaveCount(expectedPairs.length);
  await expect(footerLinks).toHaveCount(expectedPairs.length);

  for (let i = 0; i < expectedPairs.length; i++) {
    const [label, anchor] = expectedPairs[i];
    await expect(headerLinks.nth(i)).toHaveText(label);
    await expect(headerLinks.nth(i)).toHaveAttribute('href', anchor);
    await expect(footerLinks.nth(i)).toHaveText(label);
    await expect(footerLinks.nth(i)).toHaveAttribute('href', anchor);
  }

  const footerContactLink = footerLinks.nth(expectedPairs.length - 1);
  await footerContactLink.click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('section#contact')).toBeInViewport();
});

// TEST-ID: GLB-018 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
test('GLB-018: no individual personal name is displayed anywhere in the footer', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const footerText = await page.locator('footer.site-footer').innerText();

  const bioIndicatorPattern = /\b(founder|co-founder|ceo|cto|written by|authored by|by [A-Z][a-z]+ [A-Z][a-z]+)\b/i;
  expect(footerText).not.toMatch(bioIndicatorPattern);
});

// TEST-ID: GLB-019 | PRIORITY: nice-to-have | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L50
test('GLB-019: footer shows a correct copyright line for the current (or stated) year', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const currentYear = new Date().getFullYear();
  const copyrightLocator = page.locator('footer.site-footer .footer-bottom span').first();
  await expect(copyrightLocator).toHaveText(/© \d{4} Hamingcs\. All rights reserved\./);

  const text = await copyrightLocator.innerText();
  const yearMatch = text.match(/© (\d{4})/);
  expect(yearMatch).not.toBeNull();
  // Allow the stated year to be 2026 (per the plan) or the current year,
  // but never a future year relative to "now".
  expect(Number(yearMatch[1])).toBeLessThanOrEqual(currentYear);
});

// ---------------------------------------------------------------------------
// GLB-020..022 — responsive breakpoints
// ---------------------------------------------------------------------------

const RESPONSIVE_VIEWPORTS = [
  { id: 'GLB-020', width: 375, height: 812, label: 'mobile' },
  { id: 'GLB-021', width: 768, height: 1024, label: 'tablet' },
  { id: 'GLB-022', width: 1440, height: 900, label: 'desktop' },
];

for (const viewport of RESPONSIVE_VIEWPORTS) {
  // TEST-ID: GLB-020 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L67)
  // TEST-ID: GLB-021 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L68)
  // TEST-ID: GLB-022 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L59 (Examples row L69)
  test(`${viewport.id}: site is usable at a ${viewport.width}x${viewport.height} (${viewport.label}) viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE_URL}/`);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1);

    // Nav and at least one CTA stay usable (visible + have a non-zero
    // bounding box) at every breakpoint.
    await expect(page.locator('nav.site-nav')).toBeVisible();
    const primaryCta = page.getByRole('link', { name: 'Start a conversation' }).first();
    await expect(primaryCta).toBeVisible();
    const box = await primaryCta.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });
}

// ---------------------------------------------------------------------------
// GLB-023 — performance
// ---------------------------------------------------------------------------

// TEST-ID: GLB-023 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L71
test('GLB-023: page load meets the LCP budget on simulated fast-4G, with no render-blocking console errors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Network throttling via CDP is only available on Chromium.');

  const client = await page.context().newCDPSession(page);
  // Fast 4G approximation (matches common Lighthouse/DevTools presets).
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (0.75 * 1024 * 1024) / 8,
    latency: 150,
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });

  const lcp = await page.evaluate(() => new Promise((resolve) => {
    let value = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) value = last.startTime;
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(value);
    }, 500);
  }));

  expect(lcp).toBeGreaterThan(0);
  expect(lcp).toBeLessThan(2500);
  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('; ')}`).toEqual([]);
});

// ---------------------------------------------------------------------------
// GLB-024, GLB-026, GLB-027 — accessibility
// ---------------------------------------------------------------------------

// TEST-ID: GLB-024 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78
test('GLB-024: every image, including the logo, has a non-empty alt attribute', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const images = page.locator('img');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt, `image #${i} should have a non-empty alt attribute`).toBeTruthy();
    expect(alt.trim().length).toBeGreaterThan(0);
  }
});

// TEST-ID: GLB-026 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78
test('GLB-026: text/background color contrast meets WCAG AA', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const ratios = await page.evaluate(() => {
    function parseColor(str) {
      const match = str.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(',').map((n) => parseFloat(n.trim()));
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    }
    function relativeLuminance({ r, g, b }) {
      const srgb = [r, g, b].map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    }
    function effectiveBackground(el) {
      let node = el;
      while (node) {
        const bg = parseColor(getComputedStyle(node).backgroundColor);
        if (bg && bg.a > 0) return bg;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    }
    function contrastRatio(fg, bg) {
      const l1 = relativeLuminance(fg);
      const l2 = relativeLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    const selectors = ['p.lede', '.intro-p', '.nav-links a', 'footer.site-footer p', '.contact-line .value'];
    const results = [];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const style = getComputedStyle(el);
      const fg = parseColor(style.color);
      const bg = effectiveBackground(el);
      if (!fg) continue;
      results.push({ selector, ratio: contrastRatio(fg, bg) });
    }
    return results;
  });

  expect(ratios.length).toBeGreaterThan(0);
  for (const { selector, ratio } of ratios) {
    expect(ratio, `${selector} contrast ratio ${ratio.toFixed(2)}:1 should be >= 4.5:1`).toBeGreaterThanOrEqual(4.5);
  }
});

// TEST-ID: GLB-027 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L78
// Contact regression risk: keyboard users must still be able to Tab to the
// mailto ("Email us") link in the contact module — losing tab-reachability
// there would be an accessibility regression specific to the contact
// surface. Per test-executor's constraint, we verify the mailto link is
// reachable and correctly targeted WITHOUT actually pressing Enter on it —
// that would risk launching a real OS mail client on whatever machine runs
// this test.
test('GLB-027: nav links, CTAs, FAQ accordion, and the mailto link are reachable via Tab', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const foundNavLink = await tabUntil(page, (info) => info.tag === 'A' && info.href === '#services', 40);
  expect(foundNavLink, 'Tab traversal should reach a nav link (Services)').not.toBeNull();

  const foundCta = await tabUntil(page, (info) => info.tag === 'A' && info.text === 'Start a conversation', 80);
  expect(foundCta, 'Tab traversal should reach a "Start a conversation" CTA').not.toBeNull();

  // Activate the FAQ accordion via Enter: target a <summary> that starts
  // closed ("Who do you work with?"), confirm Enter opens it.
  const faqSummary = page.locator('.faq-set.is-active >> details.qa:not([open]) >> summary').first();
  await faqSummary.focus();
  await expect(faqSummary).toBeFocused();
  await page.keyboard.press('Enter');
  const faqDetails = page.locator('.faq-set.is-active >> details.qa', { has: page.locator('summary', { hasText: 'Who do you work with?' }) });
  await expect(faqDetails).toHaveAttribute('open', '');

  // Reach the mailto link by Tab and confirm it's correctly targeted —
  // reachability + correct href is verified; Enter is deliberately not
  // pressed on it (see comment above).
  const foundMailto = await tabUntil(page, (info) => info.tag === 'A' && info.href === MAILTO_HREF, 80);
  expect(foundMailto, 'Tab traversal should reach the mailto ("Email us") link').not.toBeNull();
  await expect(page.locator(`a[href="${MAILTO_HREF}"]:focus`)).toHaveCount(1);
});

// ---------------------------------------------------------------------------
// GLB-028, GLB-029 — links
// ---------------------------------------------------------------------------

// TEST-ID: GLB-028 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L88
test('GLB-028: every internal anchor link resolves to an existing section id', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const hashLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="#"]'))
      .map((a) => a.getAttribute('href'))
      .filter((href) => href && href.length > 1)
  );
  expect(hashLinks.length).toBeGreaterThan(0);

  const uniqueIds = [...new Set(hashLinks.map((href) => href.slice(1)))];
  for (const id of uniqueIds) {
    const exists = await page.locator(`#${id}`).count();
    expect(exists, `anchor "#${id}" should resolve to an existing element id`).toBeGreaterThan(0);
  }
});

// TEST-ID: GLB-029 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L88
// Contact regression risk: the mailto link's exact format is the contact
// module's most fragile piece of exposed surface — any malformed scheme or
// extra query param here breaks the one way visitors can actually reach the
// company.
test('GLB-029: the mailto link is correctly formatted', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const mailtoLinks = page.locator(`a[href="${MAILTO_HREF}"]`);
  const count = await mailtoLinks.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(mailtoLinks.nth(i)).toHaveAttribute('href', MAILTO_HREF);
  }

  // No link anywhere on the page uses a malformed mailto (extra params,
  // wrong address, or a different scheme disguised as mailto).
  const allMailtoHrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) => a.getAttribute('href'))
  );
  for (const href of allMailtoHrefs) {
    expect(href).toBe(MAILTO_HREF);
  }
});

// ---------------------------------------------------------------------------
// GLB-030, GLB-031, GLB-035 — custom 404 page
// ---------------------------------------------------------------------------

// TEST-ID: GLB-030 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L94
test('GLB-030: navigating to an unknown route shows the custom 404 page, not a generic GitHub Pages 404', async ({ page }) => {
  await page.goto(`${BASE_URL}/this-page-does-not-exist`);

  await expect(page).toHaveTitle('Page not found — Hamingcs');
  await expect(page.locator('.chip')).toContainText('404');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page doesn't exist.");
});

// TEST-ID: GLB-031 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L94
test('GLB-031: the 404 page includes a working "Back to home" link', async ({ page }) => {
  await page.goto(`${BASE_URL}/this-page-does-not-exist`);

  const homeLink = page.getByRole('link', { name: 'Back to home' });
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute('href', '/');

  await homeLink.click();
  await expect(page).toHaveURL(new RegExp(`^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?(#top)?$`));
});

// TEST-ID: GLB-035 | PRIORITY: nice-to-have | USE-CASE: inferred: 404.html head metadata (404.html:6-7)
test('GLB-035: the 404 page has the correct title and a noindex robots meta tag', async ({ page }) => {
  await page.goto(`${BASE_URL}/this-page-does-not-exist`);

  await expect(page).toHaveTitle('Page not found — Hamingcs');
  const robotsMeta = page.locator('meta[name="robots"]');
  await expect(robotsMeta).toHaveAttribute('content', 'noindex');
});

// ---------------------------------------------------------------------------
// GLB-033, GLB-034 — 900px media-query boundary
// ---------------------------------------------------------------------------

// TEST-ID: GLB-033 | PRIORITY: nice-to-have | USE-CASE: inferred: CSS media query @media (max-width: 900px) toggling .nav-toggle/.nav-links (styles.css:316-331)
test('GLB-033: .nav-toggle/.nav-links visibility flips correctly exactly at the 900px media-query boundary', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  await page.setViewportSize({ width: 899, height: 900 });
  await expect(page.locator('.nav-toggle')).toBeVisible();
  await expect(page.locator('#nav-links')).toBeHidden();

  await page.setViewportSize({ width: 901, height: 900 });
  await expect(page.locator('.nav-toggle')).toBeHidden();
  await expect(page.locator('#nav-links')).toBeVisible();
});

// TEST-ID: GLB-034 | PRIORITY: nice-to-have | USE-CASE: inferred: window.addEventListener('resize', ...) auto-close handler (site.js:41-43)
test('GLB-034: resizing an open mobile nav menu above 900px auto-closes it', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto(`${BASE_URL}/`);

  const navToggle = page.locator('.nav-toggle');
  const navLinks = page.locator('#nav-links');

  await navToggle.click();
  await expect(navLinks).toHaveClass(/is-open/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

  await page.setViewportSize(DESKTOP_VIEWPORT);
  // site.js's resize handler only auto-closes once width exceeds 900px;
  // give the resize event a moment to fire and the handler to run.
  await expect(navLinks).not.toHaveClass(/is-open/);
  await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
});
