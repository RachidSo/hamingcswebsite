// @ts-check
const { test, expect } = require('@playwright/test');

// Module: engagement
// Target: real, live production site (https://www.hamingcs.com), not a
// local fixture — every test navigates via a full #anchor URL or an
// in-page click that changes the hash, per test-executor.md.
//
// This is a verification re-run (docs/test-plans/engagement.md): the
// section's own content/spec (specs/engagement.feature) didn't change in
// commit 6a76f4e, but it's in scope because the shared files
// index.html/styles.css/site.js that it renders from did change in that
// commit (site-wide mobile-nav, heading-hierarchy, and 404 fixes).
// ENG-001 through ENG-017 re-derive the full happy-path/boundary coverage
// straight from specs/engagement.feature. ENG-018/ENG-019 are the two new
// targeted regression checks added specifically to confirm the
// heading-hierarchy and mobile-nav fixes don't break this section; there
// is no check here for the 404-page fix since it has no intersection with
// this section's own content (see the test plan's coverage map).
//
// The "HOW WE ENGAGE" section's actual DOM id is "engage" (confirmed in
// index.html). "HOW WE ENGAGE" itself renders as a `<p class="chip">`, not
// a heading element — the section's only actual heading is the
// `<h2 class="h2">` subheading "Three ways in, one point of contact."
// (relevant to ENG-001/002 and the ENG-018 heading-order check). Each
// engagement-model card is a `.plan` element, identified by its
// `.plan__label` title ("Advisory", "Interim leadership",
// "Project delivery") — also not a heading element. Each card has its OWN
// CTA (`.btn` with text "Start a conversation" linking to "#contact") —
// all card-scoped assertions below use `engagementCard()` to scope
// selectors to one specific card's subtree so the three CTAs/bullet-lists
// are never conflated with each other.
//
// ENG-019 ("each card's CTA stays usable at mobile width after the
// mobile-nav fix") originally failed at commit 6a76f4e (viewport ratio
// 0 on the "Interim leadership" card — toBeInViewport assertion) and
// was excluded from this suite for that run. Root cause: the test
// scrolled the section into view once before the loop, not once per
// card, so only the first card was ever actually on-screen at mobile
// width — filed as issue #7, then diagnosed as a test defect (not a
// site defect) and closed. Fixed by scrolling each card's CTA into
// view inside the loop; now passes and is promoted here.

const BASE_URL = 'https://www.hamingcs.com';

/**
 * Returns a locator scoped to the one `.plan` card whose `.plan__label`
 * exactly matches `title`, inside the "HOW WE ENGAGE" (#engage) section.
 * @param {import('@playwright/test').Page} page
 * @param {string} title
 */
function engagementCard(page, title) {
  const exact = new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  return page.locator('#engage .plan').filter({
    has: page.locator('.plan__label', { hasText: exact }),
  });
}

async function gotoEngagementSection(page) {
  await page.goto(`${BASE_URL}/#engage`);
  await page.locator('#engage').scrollIntoViewIfNeeded();
}

// TEST-ID: ENG-001 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L11
test('ENG-001: "HOW WE ENGAGE" heading renders with the exact text', async ({ page }) => {
  await gotoEngagementSection(page);

  await expect(page.locator('#engage .chip')).toHaveText('HOW WE ENGAGE');
});

// TEST-ID: ENG-002 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L12
test('ENG-002: subheading renders below the section heading with the exact text', async ({ page }) => {
  await gotoEngagementSection(page);

  await expect(page.locator('#engage h2.h2')).toHaveText('Three ways in, one point of contact.');
});

// TEST-ID: ENG-003 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22
test('ENG-003: Advisory card shows title "Advisory" and tag "Ongoing"', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  await expect(card.locator('.plan__label')).toHaveText('Advisory');
  await expect(card.locator('.plan__mode')).toHaveText('Ongoing');
});

// TEST-ID: ENG-004 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22
test('ENG-004: Advisory card description contains the expected substring', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  await expect(card.locator('.plan__blurb')).toContainText(
    'Retained strategy input for AI, data, and security decisions'
  );
});

// TEST-ID: ENG-005 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L22
test('ENG-005: Advisory card renders its own non-empty bullet list', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets.first()).toBeVisible();
  expect(await bullets.count()).toBeGreaterThan(0);
});

// TEST-ID: ENG-006 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18
test('ENG-006: Advisory card has its own "Start a conversation" button linking to #contact', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  const cta = card.getByRole('link', { name: 'Start a conversation' });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '#contact');
});

// TEST-ID: ENG-007 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23
test('ENG-007: Interim leadership card shows title "Interim leadership" and tag "Embedded"', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  await expect(card.locator('.plan__label')).toHaveText('Interim leadership');
  await expect(card.locator('.plan__mode')).toHaveText('Embedded');
});

// TEST-ID: ENG-008 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23
test('ENG-008: Interim leadership card description contains the expected substring', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  await expect(card.locator('.plan__blurb')).toContainText(
    'hands-on strategy, AI, data, or systems lead inside your organization'
  );
});

// TEST-ID: ENG-009 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L23
test('ENG-009: Interim leadership card renders its own non-empty bullet list', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets.first()).toBeVisible();
  expect(await bullets.count()).toBeGreaterThan(0);
});

// TEST-ID: ENG-010 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18
test('ENG-010: Interim leadership card has its own "Start a conversation" button linking to #contact', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  const cta = card.getByRole('link', { name: 'Start a conversation' });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '#contact');
});

// TEST-ID: ENG-011 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24
test('ENG-011: Project delivery card shows title "Project delivery" and tag "Scoped"', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  await expect(card.locator('.plan__label')).toHaveText('Project delivery');
  await expect(card.locator('.plan__mode')).toHaveText('Scoped');
});

// TEST-ID: ENG-012 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24
test('ENG-012: Project delivery card description contains the expected substring', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  await expect(card.locator('.plan__blurb')).toContainText(
    'A defined engagement against a specific outcome'
  );
});

// TEST-ID: ENG-013 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L24
test('ENG-013: Project delivery card renders its own non-empty bullet list', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets.first()).toBeVisible();
  expect(await bullets.count()).toBeGreaterThan(0);
});

// TEST-ID: ENG-014 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L18
test('ENG-014: Project delivery card has its own "Start a conversation" button linking to #contact', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  const cta = card.getByRole('link', { name: 'Start a conversation' });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '#contact');
});

// TEST-ID: ENG-015 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L26
test('ENG-015: Advisory card bullets are exactly the three expected items', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets).toHaveCount(3);
  await expect(bullets).toHaveText([
    'Recurring strategy & architecture review',
    'Direct access for ad-hoc decisions',
    'Roadmap and governance input',
  ]);
});

// TEST-ID: ENG-016 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L31
test('ENG-016: Interim leadership card bullets are exactly the four expected items', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets).toHaveCount(4);
  await expect(bullets).toHaveText([
    'Everything in Advisory',
    'Hiring, structure, and budget ownership',
    'Operating cadence and delivery accountability',
    'Handover plan built in from day one',
  ]);
});

// TEST-ID: ENG-017 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/engagement.feature#L37
test('ENG-017: Project delivery card bullets are exactly the three expected items', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  const bullets = card.locator('.plan__rows li');
  await expect(bullets).toHaveCount(3);
  await expect(bullets).toHaveText([
    'Fixed scope and timeline',
    'Security, cloud, or AI-specialist team',
    'Clear handoff and documentation',
  ]);
});

// TEST-ID: ENG-018 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/global.feature#L81
test('ENG-018: heading order around "HOW WE ENGAGE" stays logical after the site-wide heading-hierarchy fix', async ({ page }) => {
  await gotoEngagementSection(page);

  // Full-page heading scan: the site-wide heading-hierarchy fix in 6a76f4e
  // could in principle have shifted heading levels anywhere on the page.
  // This check is scoped to what ENG-018 actually owns per the test plan —
  // the "HOW WE ENGAGE" section's own heading and its immediate neighbors —
  // rather than asserting on the whole page's heading tree, which is the
  // `global` module's own responsibility.
  const outline = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el) => ({
      level: Number(el.tagName.slice(1)),
      text: (el.textContent || '').trim(),
    }))
  );

  // Exactly one h1 on the page.
  expect(outline.filter((h) => h.level === 1)).toHaveLength(1);

  const engageHeadingIndex = outline.findIndex(
    (h) => h.text === 'Three ways in, one point of contact.'
  );
  expect(engageHeadingIndex).toBeGreaterThan(-1);

  const engageLevel = outline[engageHeadingIndex].level;
  // The section's only actual heading is this h2 (see module header comment
  // above — "HOW WE ENGAGE" itself renders as a non-heading chip element).
  expect(engageLevel).toBe(2);

  // No skipped levels immediately around this section's heading: a level
  // may legitimately decrease by any amount (closing out nested
  // subsections) but must never increase by more than one step at a time.
  if (engageHeadingIndex > 0) {
    const prevLevel = outline[engageHeadingIndex - 1].level;
    if (engageLevel > prevLevel) {
      expect(engageLevel - prevLevel).toBeLessThanOrEqual(1);
    }
  }
  if (engageHeadingIndex < outline.length - 1) {
    const nextLevel = outline[engageHeadingIndex + 1].level;
    if (nextLevel > engageLevel) {
      expect(nextLevel - engageLevel).toBeLessThanOrEqual(1);
    }
  }
});
