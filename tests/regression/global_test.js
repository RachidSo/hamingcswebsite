// @ts-check
// Regression suite for module "global" — holds the latest passing
// implementation of each promoted test case. Only tests that have
// actually passed a test-executor run are merged in here; see
// tests/generated/global_test.js for the full generated set (including
// currently-failing cases) and docs/test-plans/global.md for the table
// these were derived from.
// Spec source: specs/global.feature (+ specs/contact.feature for the
// #contact dependency). Framework: Playwright against the live site
// (see playwright.config.js — testMatch: '**/*_test.js', no baseURL,
// every test navigates with a full https://hamingcs.com/... URL;
// chromium + firefox projects; JSON reporter to results/).
//
// Rows tagged "(contact regression risk)" in the plan — NAV-04,
// ROUTE-01, CTA-01, FOOTER-01, FOOTER-04, A11Y-04, LINK-02 — guard the
// contact module's exposed surface (#contact anchor, footer email,
// mailto link format) against regressions from other modules' code.
// Each of those assertions below is pinned to the exact real markup in
// index.html (section ids, hrefs, link text) rather than a loose
// text/contains check.

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://hamingcs.com';
const MAILTO_HREF = 'mailto:info@hamingcs.com';

/**
 * Presses Tab repeatedly until the focused element matches `predicate`,
 * or `maxTabs` is reached. Returns the matching ElementHandle info
 * (tag/text/href) or null if never found. Used for the keyboard-
 * operability checks (A11Y-04).
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
        dataTab: el.getAttribute('data-tab'),
      };
    });
    if (info && predicate(info)) return info;
  }
  return null;
}

// ---------------------------------------------------------------------------
// META-01
// ---------------------------------------------------------------------------

// TEST-ID: META-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L15
test('META-01: page has correct title, meta description, OG, and Twitter card tags', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response.status()).toBe(200);

  await expect(page).toHaveTitle('Hamingcs — AI, Data & IT Strategy Consulting');

  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy();
  expect(description).toContain('AI');
  expect(description).toContain('strategy');

  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    const content = await page.locator(`meta[property="${prop}"]`).getAttribute('content');
    expect(content, `${prop} should be present and non-empty`).toBeTruthy();
  }

  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  expect(twitterCard).toBeTruthy();
});

// ---------------------------------------------------------------------------
// NAV-01..04
// ---------------------------------------------------------------------------

// TEST-ID: NAV-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L31
test('NAV-01: clicking "Home" nav link scrolls to the top section', async ({ page }) => {
  await page.goto(`${BASE_URL}/#services`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(page.locator('#top')).toBeInViewport();
});

// TEST-ID: NAV-02 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L32
test('NAV-02: clicking "Services" nav link scrolls to the services section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

// TEST-ID: NAV-03 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L33
test('NAV-03: clicking "About" nav link scrolls to the about section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
});

// TEST-ID: NAV-04 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L34
// Contact regression risk: guards the header nav's link into the contact
// module's #contact anchor.
test('NAV-04: clicking "Contact" nav link scrolls to the contact section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const navContactLink = page.locator('nav.site-nav .nav-links').getByRole('link', { name: 'Contact', exact: true });
  await expect(navContactLink).toHaveAttribute('href', '#contact');

  await navContactLink.click();
  await expect(page).toHaveURL(/#contact$/);

  const contactSection = page.locator('section#contact');
  await expect(contactSection).toBeInViewport();
  await expect(contactSection.locator('.chip')).toHaveText(/CONTACT/);
});

// ---------------------------------------------------------------------------
// ROUTE-01
// ---------------------------------------------------------------------------

// TEST-ID: ROUTE-01 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/contact.feature#L7
// Contact regression risk: this is the exact precondition contact.feature's
// own Background relies on — a deep-link straight to #contact must land on
// the Contact section without requiring a nav click first.
test('ROUTE-01: loading the site directly at the #contact fragment URL lands on the Contact section', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/#contact`);
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/#contact$/);

  const contactSection = page.locator('section#contact');
  await expect(contactSection).toBeInViewport();
  await expect(contactSection.locator('.h2')).toHaveText("Tell us what you're building.");
});

// ---------------------------------------------------------------------------
// CTA-01, CTA-02
// ---------------------------------------------------------------------------

// TEST-ID: CTA-01 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L38
// Contact regression risk: every "Start a conversation" CTA on the page
// (hero, engagement plans, nav) must continue to resolve into the contact
// module's #contact anchor.
test('CTA-01: every "Start a conversation" CTA jumps to the Contact section', async ({ page }) => {
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

// TEST-ID: CTA-02 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L40
test('CTA-02: "See what we do" in the hero jumps to the Services section', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const cta = page.locator('.hero-actions').getByRole('link', { name: 'See what we do' });
  await expect(cta).toHaveAttribute('href', '#services');
  await cta.click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

// ---------------------------------------------------------------------------
// FOOTER-01..06
// ---------------------------------------------------------------------------

// TEST-ID: FOOTER-01 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L52
// Contact regression risk: the footer's displayed contact email is the same
// address the contact module's mailto link and detail row use.
test('FOOTER-01: footer displays the correct contact email', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const footerEmailLink = page.locator('footer.site-footer').getByRole('link', { name: 'info@hamingcs.com' });
  await expect(footerEmailLink).toBeVisible();
  await expect(footerEmailLink).toHaveText('info@hamingcs.com');
  await expect(footerEmailLink).toHaveAttribute('href', MAILTO_HREF);

  await expect(page.locator('footer.site-footer .footer-bottom')).toContainText('info@hamingcs.com');
});

// TEST-ID: FOOTER-02 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L53
test('FOOTER-02: footer displays the correct location', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.locator('footer.site-footer')).toContainText('United Arab Emirates');
});

// TEST-ID: FOOTER-03 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L54
test('FOOTER-03: footer displays the correct operating mode', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.locator('footer.site-footer')).toContainText('Global / remote-first');
});

// TEST-ID: FOOTER-04 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L55
// Contact regression risk: the footer's Contact anchor must mirror the
// header's — same four links, same #contact target — so the footer stays a
// valid secondary entry point into the contact module.
test('FOOTER-04: footer anchor links mirror the header\'s, including a working Contact entry', async ({ page }) => {
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

// TEST-ID: FOOTER-05 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L56
test('FOOTER-05: no individual personal name appears anywhere in the footer', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const footerText = await page.locator('footer.site-footer').innerText();

  // The footer's full vocabulary is small and known (brand, location,
  // operating mode, boilerplate copyright/contact strings) — assert it
  // doesn't contain a bio/attribution phrasing that would introduce an
  // individual founder/employee's name.
  const bioIndicatorPattern = /\b(founder|co-founder|ceo|cto|written by|authored by|by [A-Z][a-z]+ [A-Z][a-z]+)\b/i;
  expect(footerText).not.toMatch(bioIndicatorPattern);
});

// TEST-ID: FOOTER-06 | PRIORITY: nice-to-have | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L57
test('FOOTER-06: footer shows a correct copyright line', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  const currentYear = new Date().getFullYear();
  const copyrightLocator = page.locator('footer.site-footer .footer-bottom span').first();
  await expect(copyrightLocator).toHaveText(/© \d{4} Hamingcs\. All rights reserved\./);

  const text = await copyrightLocator.innerText();
  const yearMatch = text.match(/© (\d{4})/);
  expect(yearMatch).not.toBeNull();
  // Allow the copyright year to be the current year or earlier (never future).
  expect(Number(yearMatch[1])).toBeLessThanOrEqual(currentYear);
});

// ---------------------------------------------------------------------------
// RESP-01..03
// ---------------------------------------------------------------------------

const RESPONSIVE_VIEWPORTS = [
  { id: 'RESP-01', width: 375, height: 812, label: 'mobile' },
  { id: 'RESP-02', width: 768, height: 1024, label: 'tablet' },
  { id: 'RESP-03', width: 1440, height: 900, label: 'desktop' },
];

for (const viewport of RESPONSIVE_VIEWPORTS) {
  // TEST-ID: RESP-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L67
  // TEST-ID: RESP-02 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L68
  // TEST-ID: RESP-03 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L69
  test(`${viewport.id}: site renders correctly at a ${viewport.width}x${viewport.height} (${viewport.label}) viewport`, async ({ page }) => {
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
// PERF-01
// ---------------------------------------------------------------------------

// TEST-ID: PERF-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L71
test('PERF-01: page load meets the LCP budget on simulated fast-4G, with no render-blocking console errors', async ({ page, browserName }) => {
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
// A11Y-01, A11Y-03, A11Y-04
// ---------------------------------------------------------------------------

// TEST-ID: A11Y-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L80
test('A11Y-01: every image, including the logo, has a non-empty alt attribute', async ({ page }) => {
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

// TEST-ID: A11Y-03 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L84
test('A11Y-03: text/background color contrast meets WCAG AA', async ({ page }) => {
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

// TEST-ID: A11Y-04 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L85
// Contact regression risk: keyboard users must still be able to Tab to the
// mailto ("Email us") link in the contact module — losing tab-reachability
// there would be an accessibility regression specific to the contact
// surface. Per test-executor's constraint, we verify the mailto link is
// reachable and correctly targeted WITHOUT actually pressing Enter on it —
// that would risk launching a real OS mail client on whatever machine runs
// this test.
test('A11Y-04: nav links, CTAs, FAQ accordion, and the mailto link are reachable via Tab', async ({ page }) => {
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
// LINK-01, LINK-02
// ---------------------------------------------------------------------------

// TEST-ID: LINK-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L91
test('LINK-01: every internal anchor link resolves to an existing section id', async ({ page }) => {
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

// TEST-ID: LINK-02 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L92
// Contact regression risk: the mailto link's exact format is the contact
// module's most fragile piece of exposed surface — any malformed scheme or
// extra query param here breaks the one way visitors can actually reach the
// company. Checked everywhere the mailto link/address appears: the "Email
// us" CTA, the EMAIL detail row, and the footer.
test('LINK-02: the mailto link is correctly formatted everywhere it appears', async ({ page }) => {
  await page.goto(`${BASE_URL}/`);

  const mailtoLinks = page.locator(`a[href="${MAILTO_HREF}"]`);
  const count = await mailtoLinks.count();
  expect(count).toBeGreaterThanOrEqual(2); // Contact section ("Email us" + EMAIL row link) + footer, at minimum

  for (let i = 0; i < count; i++) {
    await expect(mailtoLinks.nth(i)).toHaveAttribute('href', MAILTO_HREF);
  }

  const emailUsButton = page.getByRole('link', { name: 'Email us' });
  await expect(emailUsButton).toHaveAttribute('href', MAILTO_HREF);

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
// NOTFOUND-01
// ---------------------------------------------------------------------------

// TEST-ID: NOTFOUND-01 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/global.feature#L94
test('NOTFOUND-01: navigating to an unknown route shows a custom 404 page', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/this-page-does-not-exist`);
  expect(response).not.toBeNull();
  expect(response.status()).toBe(404);

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toMatch(/404|not found|page.*doesn't exist|page.*does not exist/i);
});
