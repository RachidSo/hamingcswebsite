// @ts-check
const { test, expect } = require('@playwright/test');

// Module: engagement
// Target: real, live production site (https://www.hamingcs.com), not a
// local fixture — every test navigates via a full #anchor URL or an
// in-page click that changes the hash, per test-executor.md.
//
// The "HOW WE ENGAGE" section's actual DOM id is "engage" (confirmed in
// index.html), and each engagement-model card is a `.plan` element inside
// it, identified by its `.plan__label` title ("Advisory",
// "Interim leadership", "Project delivery"). Each card has its OWN CTA
// (`.btn` with text "Start a conversation" linking to "#contact") — all
// card-scoped assertions below use `engagementCard()` to scope selectors to
// one specific card's subtree so the three CTAs/bullet-lists are never
// conflated with each other.

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

// TEST-ID: ENG-001 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L10
test('ENG-001: section heading and subheading render with exact text', async ({ page }) => {
  await gotoEngagementSection(page);

  await expect(page.locator('#engage .chip')).toHaveText('HOW WE ENGAGE');
  await expect(page.locator('#engage h2.h2')).toHaveText('Three ways in, one point of contact.');
});

// TEST-ID: ENG-002 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L22
test('ENG-002: Advisory card shows title, tag, description, bullets, and its own CTA', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Advisory');
  await expect(card).toBeVisible();
  await expect(card.locator('.plan__label')).toHaveText('Advisory');
  await expect(card.locator('.plan__mode')).toHaveText('Ongoing');
  await expect(card.locator('.plan__blurb')).toContainText(
    'Retained strategy input for AI, data, and security decisions'
  );
  await expect(card.locator('.plan__rows')).toBeVisible();
  await expect(card.locator('.plan__rows li')).toHaveCount(3);
  await expect(card.getByRole('link', { name: 'Start a conversation' })).toBeVisible();
});

// TEST-ID: ENG-003 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L23
test('ENG-003: Interim leadership card shows title, tag, description, bullets, and its own CTA', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Interim leadership');
  await expect(card).toBeVisible();
  await expect(card.locator('.plan__label')).toHaveText('Interim leadership');
  await expect(card.locator('.plan__mode')).toHaveText('Embedded');
  await expect(card.locator('.plan__blurb')).toContainText(
    'hands-on strategy, AI, data, or systems lead inside your organization'
  );
  await expect(card.locator('.plan__rows')).toBeVisible();
  await expect(card.locator('.plan__rows li')).toHaveCount(4);
  await expect(card.getByRole('link', { name: 'Start a conversation' })).toBeVisible();
});

// TEST-ID: ENG-004 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L24
test('ENG-004: Project delivery card shows title, tag, description, bullets, and its own CTA', async ({ page }) => {
  await gotoEngagementSection(page);

  const card = engagementCard(page, 'Project delivery');
  await expect(card).toBeVisible();
  await expect(card.locator('.plan__label')).toHaveText('Project delivery');
  await expect(card.locator('.plan__mode')).toHaveText('Scoped');
  await expect(card.locator('.plan__blurb')).toContainText(
    'A defined engagement against a specific outcome'
  );
  await expect(card.locator('.plan__rows')).toBeVisible();
  await expect(card.locator('.plan__rows li')).toHaveCount(3);
  await expect(card.getByRole('link', { name: 'Start a conversation' })).toBeVisible();
});

/**
 * Shared assertion for ENG-005/006/007: verifies the given card's OWN
 * "Start a conversation" CTA links to "#contact" and, on click, navigates/
 * scrolls to the Contact section without a full page reload.
 * @param {import('@playwright/test').Page} page
 * @param {string} cardTitle
 */
async function verifyCardCtaNavigatesToContact(page, cardTitle) {
  await gotoEngagementSection(page);

  const card = engagementCard(page, cardTitle);
  await expect(card).toBeVisible();

  const cta = card.getByRole('link', { name: 'Start a conversation' });
  await expect(cta).toHaveAttribute('href', '#contact');

  // Marker set before the click: if the click caused a full page reload,
  // this property would be lost, which is how we confirm it was purely an
  // in-page hash navigation/scroll.
  await page.evaluate(() => {
    // @ts-ignore
    window.__eng_no_reload_marker__ = true;
  });

  await cta.click();

  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
  const markerSurvived = await page.evaluate(() => {
    // @ts-ignore
    return window.__eng_no_reload_marker__ === true;
  });
  expect(markerSurvived).toBe(true);
}

// TEST-ID: ENG-005 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18
test('ENG-005: Advisory card CTA links to and navigates to #contact', async ({ page }) => {
  await verifyCardCtaNavigatesToContact(page, 'Advisory');
});

// TEST-ID: ENG-006 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18
test('ENG-006: Interim leadership card CTA links to and navigates to #contact', async ({ page }) => {
  await verifyCardCtaNavigatesToContact(page, 'Interim leadership');
});

// TEST-ID: ENG-007 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L18
test('ENG-007: Project delivery card CTA links to and navigates to #contact', async ({ page }) => {
  await verifyCardCtaNavigatesToContact(page, 'Project delivery');
});

// TEST-ID: ENG-008 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L26
test('ENG-008: Advisory card bullets are exactly the three expected items', async ({ page }) => {
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

// TEST-ID: ENG-009 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L31
test('ENG-009: Interim leadership card bullets are exactly the four expected items', async ({ page }) => {
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

// TEST-ID: ENG-010 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/5285ec33b95d4582360dbe68df042274fa906d3b/specs/engagement.feature#L37
test('ENG-010: Project delivery card bullets are exactly the three expected items', async ({ page }) => {
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
