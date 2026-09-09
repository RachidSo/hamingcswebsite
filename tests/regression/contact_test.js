// @ts-check
const { test, expect } = require('@playwright/test');

// Promoted from tests/generated/contact_test.js (passing tests only) per
// results/contact.json. This is the module's persistent regression suite —
// see CLAUDE.md's "Promoting tests into the regression suite" section.
// Spec source: specs/contact.feature. Shared Background precondition for
// every test below: navigate to "https://hamingcs.com/#contact".
//
// This site has no backend and no contact form — every test here is a
// read-only content/layout assertion against the live production site
// (see .claude/agents/test-executor.md's "Detecting target type" section).
// All locators are scoped to the #contact section specifically, since the
// footer also repeats the email address/location/mode text and would
// otherwise produce ambiguous matches.
//
// CONTACT-009 is intentionally excluded here — retired to test.skip() in
// tests/generated/contact_test.js (issue #4: no technique available to
// headless browser automation can observe an OS-level mailto: hand-off;
// CONTACT-008 below already covers the one observable part, the href).
// Skipped tests aren't promoted, same as failing ones.
//
// Latest promotion: commit 6a76f4ebfc2c30e379d97e26bf04965278ec592e — 9
// passed / 1 failed (CONTACT-009). Updated CONTACT-001 through CONTACT-008
// and CONTACT-010 below to this run's version (Use Case Ref links now point
// at this commit); test bodies are unchanged in substance from the prior
// promotion.

const CONTACT_URL = 'https://hamingcs.com/#contact';
const CONTACT_EMAIL = 'info@hamingcs.com';
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

test.beforeEach(async ({ page }) => {
  await page.goto(CONTACT_URL);
});

// TEST-ID: CONTACT-001 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L10
test('CONTACT-001: contact section is headed CONTACT', async ({ page }) => {
  const contactSection = page.locator('#contact');
  await expect(contactSection.locator('.chip')).toHaveText(/CONTACT/);
  await expect(contactSection.locator('.chip')).toBeVisible();
});

// TEST-ID: CONTACT-002 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L11
test('CONTACT-002: sub-heading "Tell us what you\'re building." is visible', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const heading = contactSection.getByRole('heading', { name: "Tell us what you're building." });
  await expect(heading).toBeVisible();
});

// TEST-ID: CONTACT-003 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L12
test('CONTACT-003: intro copy mentions strategy, AI/data, and systems & security review', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const introText = await contactSection.locator('p').filter({ hasText: 'strategy' }).first().innerText();
  expect(introText).toMatch(/strategy/i);
  expect(introText).toMatch(/AI\/data/i);
  expect(introText).toMatch(/systems.*security review/i);
});

// TEST-ID: CONTACT-004 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L15
test('CONTACT-004: EMAIL detail row shows the correct address', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const emailRow = contactSection.locator('.contact-line').filter({ hasText: 'EMAIL' });
  await expect(emailRow.locator('.label')).toHaveText('EMAIL');
  await expect(emailRow.locator('.value')).toHaveText(CONTACT_EMAIL);
});

// TEST-ID: CONTACT-005 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L16
test('CONTACT-005: LOCATION detail row shows the correct value', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const locationRow = contactSection.locator('.contact-line').filter({ hasText: 'LOCATION' });
  await expect(locationRow.locator('.label')).toHaveText('LOCATION');
  await expect(locationRow.locator('.value')).toHaveText('United Arab Emirates');
});

// TEST-ID: CONTACT-006 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L17
test('CONTACT-006: OPERATING MODE detail row shows the correct value', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const modeRow = contactSection.locator('.contact-line').filter({ hasText: 'OPERATING MODE' });
  await expect(modeRow.locator('.label')).toHaveText('OPERATING MODE');
  await expect(modeRow.locator('.value')).toHaveText('Global / remote-first');
});

// TEST-ID: CONTACT-007 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L20
test('CONTACT-007: "Email us" CTA button is visible', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const emailUsButton = contactSection.getByRole('link', { name: 'Email us' });
  await expect(emailUsButton).toBeVisible();
});

// TEST-ID: CONTACT-008 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L21
test('CONTACT-008: "Email us" href is exactly the mailto link, no extra params/whitespace', async ({ page }) => {
  const contactSection = page.locator('#contact');
  const emailUsButton = contactSection.getByRole('link', { name: 'Email us' });
  const href = await emailUsButton.getAttribute('href');
  // Exact string match per the plan — not a prefix/contains check.
  expect(href).toBe(CONTACT_MAILTO);
});

// TEST-ID: CONTACT-010 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/contact.feature#L26
test('CONTACT-010: no Name/Email/Message contact form exists in the Contact section', async ({ page }) => {
  const contactSection = page.locator('#contact');

  // No form/input/textarea elements of any kind in the Contact section —
  // this site intentionally uses direct email contact only.
  await expect(contactSection.locator('form')).toHaveCount(0);
  await expect(contactSection.locator('input')).toHaveCount(0);
  await expect(contactSection.locator('textarea')).toHaveCount(0);

  // Explicitly confirm no field tied to a Name/Email/Message label or
  // placeholder exists either, per the plan's wording.
  for (const fieldName of ['Name', 'Email', 'Message']) {
    await expect(contactSection.getByLabel(fieldName)).toHaveCount(0);
    await expect(contactSection.getByPlaceholder(fieldName)).toHaveCount(0);
  }
});
