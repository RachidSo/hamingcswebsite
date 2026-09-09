// @ts-check
const { test, expect } = require('@playwright/test');

// Generated from docs/test-plans/services.md (SVC-001 .. SVC-020).
// Spec source: specs/services.feature. Shared Background precondition for
// every test below: navigate to "https://hamingcs.com/#services".
//
// This site has no backend — every test here is a read-only content/layout
// assertion against the live production site (see
// .claude/agents/test-executor.md's "Detecting target type" section). All
// locators are scoped to the #services section specifically, since each
// category chip (e.g. "AI & DATA") is repeated inside its own
// .service-group-head and must not be confused with the top-level "SERVICES"
// section chip, or with any similarly-worded copy elsewhere on the page.

const SERVICES_URL = 'https://hamingcs.com/#services';

test.beforeEach(async ({ page }) => {
  await page.goto(SERVICES_URL);
});

/**
 * Locates the .service-group whose category chip (e.g. "AI & DATA")
 * matches categoryName, scoped to the #services section.
 */
function categoryGroup(page, categoryName) {
  return page.locator('#services .service-group').filter({
    has: page.locator('.service-group-head p.chip', { hasText: categoryName }),
  });
}

/**
 * Locates the .service-card (title + description) for a given service
 * title within a given category's group.
 */
function serviceCard(page, categoryName, serviceTitle) {
  return categoryGroup(page, categoryName).locator('.service-card').filter({
    has: page.getByRole('heading', { level: 4, name: serviceTitle, exact: true }),
  });
}

/**
 * Asserts a service card is visible under the given category, and that its
 * description paragraph reads as at least one real sentence (non-empty,
 * multi-word, sentence-terminated) rather than e.g. an empty/placeholder
 * <p>.
 */
async function expectServiceWithDescription(page, categoryName, serviceTitle) {
  const card = serviceCard(page, categoryName, serviceTitle);
  await expect(card).toBeVisible();
  await expect(card.getByRole('heading', { level: 4, name: serviceTitle, exact: true })).toBeVisible();

  const description = (await card.locator('p').first().innerText()).trim();
  expect(description.length).toBeGreaterThan(0);
  expect(description.split(/\s+/).length).toBeGreaterThanOrEqual(5);
  expect(description).toMatch(/[.!?]$/);
}

// ---------------------------------------------------------------------------
// SVC-001
// ---------------------------------------------------------------------------

// TEST-ID: SVC-001 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L9-L12
test('SVC-001: Services section intro renders with correct heading, subheading, and engagement copy', async ({ page }) => {
  const servicesSection = page.locator('#services');

  // Top-level section chip — scoped to a direct child of .wrap so it isn't
  // confused with the per-category chips nested inside .service-group-head.
  const sectionChip = servicesSection.locator('> .wrap > p.chip');
  await expect(sectionChip).toHaveText(/SERVICES/);
  await expect(sectionChip).toBeVisible();

  const subheading = servicesSection.getByRole('heading', { name: 'Three disciplines. One engagement.' });
  await expect(subheading).toBeVisible();

  const introText = await servicesSection.locator('> .wrap > p.lede').innerText();
  expect(introText).toMatch(/one discipline/i);
  expect(introText).toMatch(/all three/i);
});

// ---------------------------------------------------------------------------
// SVC-002..007 — AI & DATA
// ---------------------------------------------------------------------------

const AI_DATA_SERVICES = [
  { id: 'SVC-002', title: 'AI readiness & strategy' },
  { id: 'SVC-003', title: 'Interim AI & data leadership' },
  { id: 'SVC-004', title: 'Data architecture & governance' },
  { id: 'SVC-005', title: 'Technical evaluation & AI-output review' },
  { id: 'SVC-006', title: 'Generative AI & LLM integration' },
  { id: 'SVC-007', title: 'AI governance & responsible AI' },
];

// TEST-ID: SVC-002 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L20
// TEST-ID: SVC-003 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L21
// TEST-ID: SVC-004 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L22
// TEST-ID: SVC-005 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L23
// TEST-ID: SVC-006 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L24
// TEST-ID: SVC-007 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L25
for (const { id, title } of AI_DATA_SERVICES) {
  test(`${id}: "${title}" service is listed under AI & DATA with a supporting description`, async ({ page }) => {
    await expectServiceWithDescription(page, 'AI & DATA', title);
  });
}

// ---------------------------------------------------------------------------
// SVC-008..013 — SYSTEMS & SECURITY
// ---------------------------------------------------------------------------

const SYSTEMS_SECURITY_SERVICES = [
  { id: 'SVC-008', title: 'Cloud & SaaS transformation' },
  { id: 'SVC-009', title: 'DevOps & CI/CD engineering' },
  { id: 'SVC-010', title: 'Security & threat architecture' },
  { id: 'SVC-011', title: 'QA automation & release strategy' },
  { id: 'SVC-012', title: 'Security & compliance audits' },
  { id: 'SVC-013', title: 'Cloud cost optimization' },
];

// TEST-ID: SVC-008 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L33
// TEST-ID: SVC-009 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L34
// TEST-ID: SVC-010 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L35
// TEST-ID: SVC-011 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L36
// TEST-ID: SVC-012 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L37
// TEST-ID: SVC-013 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L38
for (const { id, title } of SYSTEMS_SECURITY_SERVICES) {
  test(`${id}: "${title}" service is listed under SYSTEMS & SECURITY with a supporting description`, async ({ page }) => {
    await expectServiceWithDescription(page, 'SYSTEMS & SECURITY', title);
  });
}

// ---------------------------------------------------------------------------
// SVC-014..019 — STRATEGY & LEADERSHIP
// ---------------------------------------------------------------------------

const STRATEGY_LEADERSHIP_SERVICES = [
  { id: 'SVC-014', title: 'Business & AI strategy definition' },
  { id: 'SVC-015', title: 'P&L & budget ownership' },
  { id: 'SVC-016', title: 'Global team leadership & scaling' },
  { id: 'SVC-017', title: 'Market entry & expansion strategy' },
  { id: 'SVC-018', title: 'Innovation consulting' },
  { id: 'SVC-019', title: 'Academic & R&D partnerships' },
];

// TEST-ID: SVC-014 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L46
// TEST-ID: SVC-015 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L47
// TEST-ID: SVC-016 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L48
// TEST-ID: SVC-017 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L49
// TEST-ID: SVC-018 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L50
// TEST-ID: SVC-019 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L51
for (const { id, title } of STRATEGY_LEADERSHIP_SERVICES) {
  test(`${id}: "${title}" service is listed under STRATEGY & LEADERSHIP with a supporting description`, async ({ page }) => {
    await expectServiceWithDescription(page, 'STRATEGY & LEADERSHIP', title);
  });
}

// ---------------------------------------------------------------------------
// SVC-020
// ---------------------------------------------------------------------------

// TEST-ID: SVC-020 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/services.feature#L53-L56
test('SVC-020: each of the 3 service categories lists exactly 6 services', async ({ page }) => {
  for (const categoryName of ['AI & DATA', 'SYSTEMS & SECURITY', 'STRATEGY & LEADERSHIP']) {
    const group = categoryGroup(page, categoryName);
    await expect(group).toHaveCount(1);
    await expect(group.locator('.service-card')).toHaveCount(6);
  }
});
