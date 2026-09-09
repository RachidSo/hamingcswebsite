// @ts-check
const { test, expect } = require('@playwright/test');

// Promoted from tests/generated/faq_test.js (passing tests only) per
// results/faq.json. This is the module's persistent regression suite — see
// CLAUDE.md's "Promoting tests into the regression suite" section.
//
// First-ever promotion for this module: commit 6a76f4e — 21 passed / 0
// failed, so all of TC-FAQ-001 through TC-FAQ-021 are included below,
// unchanged in substance from tests/generated/faq_test.js.
//
// Spec source: specs/faq.feature. Target: live production site
// https://hamingcs.com (canonical per index.html's <link rel="canonical">
// and og:url — matches the convention already used in
// tests/regression/contact_test.js / global_test.js). Framework: Playwright
// (chromium + firefox projects, no baseURL — every test navigates with a
// full https://hamingcs.com/#faq URL, a single-page anchor navigation, not
// a separate page load).
//
// Markup verified directly against index.html:
//   <section class="block" id="faq"> ... <div class="faq-tabs" data-tabs="faq">
//     <button data-tab="general|engagement|security">...
//   <div data-tabset="faq">
//     <div class="faq-set" data-tabpanel="general|engagement|security">
//       <details class="qa"[ open]><summary>...</summary><div class="qa__a">...</div></details>
// and site.js (lines 46-59): the `[data-tabs]` click handler toggles
// `.is-active` on the clicked button and the matching panel only — it
// never touches the native `open` attribute of any `<details>` under it.
//
// Three questions ship with `open` already set (one per tab): "What does
// Hamingcs actually do?" (general), "How does an engagement start?"
// (engagement), "Do you work under NDA?" (security). Tests for those are
// boundary-type — a plain click on their <summary> would COLLAPSE the
// answer (since <details>/<summary> toggles), so they assert the
// already-open state directly instead of clicking.

const BASE_URL = 'https://hamingcs.com';
const FAQ_URL = `${BASE_URL}/#faq`;

/** Locator for a tab panel (`[data-tabpanel="general|engagement|security"]`) inside #faq. */
function panelLocator(page, tabKey) {
  return page.locator(`#faq [data-tabset="faq"] [data-tabpanel="${tabKey}"]`);
}

/** Locator for a tab button (`button[data-tab="general|engagement|security"]`) inside #faq. */
function tabButtonLocator(page, tabKey) {
  return page.locator(`#faq [data-tabs="faq"] button[data-tab="${tabKey}"]`);
}

/** Locator for the `<details class="qa">` whose `<summary>` exactly matches `summaryText`, within `panel`. */
function questionByText(page, panel, summaryText) {
  return panel.locator('details.qa').filter({ has: page.locator('summary', { hasText: summaryText }) });
}

test.beforeEach(async ({ page }) => {
  await page.goto(FAQ_URL);
});

// ---------------------------------------------------------------------------
// Section intro + tab filter (TC-FAQ-001, TC-FAQ-002)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-001 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L10-L12
test('TC-FAQ-001: FAQ section is headed "FAQ" with the correct subheading', async ({ page }) => {
  const faqSection = page.locator('#faq');
  await expect(faqSection.locator('.chip')).toBeVisible();
  await expect(faqSection.locator('.chip')).toHaveText(/FAQ/);
  await expect(faqSection.locator('.h2')).toHaveText('Answers to the questions that come up most.');
});

// TEST-ID: TC-FAQ-002 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L13
test('TC-FAQ-002: General/Engagement/Security tab filter is available and labeled correctly', async ({ page }) => {
  const tabs = page.locator('#faq [data-tabs="faq"] button');
  await expect(tabs).toHaveCount(3);

  const expectedLabels = ['General', 'Engagement', 'Security'];
  for (let i = 0; i < expectedLabels.length; i++) {
    await expect(tabs.nth(i)).toBeVisible();
    await expect(tabs.nth(i)).toHaveText(expectedLabels[i]);
  }
});

// ---------------------------------------------------------------------------
// General tab questions (TC-FAQ-003, TC-FAQ-004, TC-FAQ-005)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-003 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L22
test('TC-FAQ-003: "What does Hamingcs actually do?" ships open, with its answer already visible', async ({ page }) => {
  const generalPanel = panelLocator(page, 'general');
  await expect(generalPanel).toHaveClass(/is-active/); // General is the default active tab

  const question = questionByText(page, generalPanel, 'What does Hamingcs actually do?');
  await expect(question).toBeVisible();
  // Boundary: this item starts open — clicking the summary would collapse
  // it instead of expanding it, so no click happens in this test.
  await expect(question).toHaveAttribute('open', '');

  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-004 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L23
test('TC-FAQ-004: "Who do you work with?" expands to reveal a non-empty answer', async ({ page }) => {
  const generalPanel = panelLocator(page, 'general');
  const question = questionByText(page, generalPanel, 'Who do you work with?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-005 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L24
test('TC-FAQ-005: "Do you work remotely?" expands to reveal a non-empty answer', async ({ page }) => {
  const generalPanel = panelLocator(page, 'general');
  const question = questionByText(page, generalPanel, 'Do you work remotely?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// Engagement tab questions (TC-FAQ-006 .. TC-FAQ-009)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-006 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L25
test('TC-FAQ-006: "How does an engagement start?" ships open on the Engagement tab, with its answer already visible', async ({ page }) => {
  await tabButtonLocator(page, 'engagement').click();
  const engagementPanel = panelLocator(page, 'engagement');
  await expect(engagementPanel).toHaveClass(/is-active/);

  const question = questionByText(page, engagementPanel, 'How does an engagement start?');
  await expect(question).toBeVisible();
  // Boundary: this item starts open — no click, same reasoning as TC-FAQ-003.
  await expect(question).toHaveAttribute('open', '');

  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-007 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L26
test('TC-FAQ-007: "Can you cover strategy, AI, and systems architecture together?" expands to reveal a non-empty answer', async ({ page }) => {
  await tabButtonLocator(page, 'engagement').click();
  const engagementPanel = panelLocator(page, 'engagement');
  const question = questionByText(page, engagementPanel, 'Can you cover strategy, AI, and systems architecture together?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-008 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L27
test('TC-FAQ-008: "Can you take P&L or leadership ownership, not just advise?" expands to reveal a non-empty answer', async ({ page }) => {
  await tabButtonLocator(page, 'engagement').click();
  const engagementPanel = panelLocator(page, 'engagement');
  const question = questionByText(page, engagementPanel, 'Can you take P&L or leadership ownership, not just advise?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-009 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L28
test('TC-FAQ-009: "Do you work on retainer or fixed scope?" expands to reveal a non-empty answer', async ({ page }) => {
  await tabButtonLocator(page, 'engagement').click();
  const engagementPanel = panelLocator(page, 'engagement');
  const question = questionByText(page, engagementPanel, 'Do you work on retainer or fixed scope?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// Security tab questions (TC-FAQ-010 .. TC-FAQ-012)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-010 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L29
test('TC-FAQ-010: "Do you work under NDA?" ships open on the Security tab, with its answer already visible', async ({ page }) => {
  await tabButtonLocator(page, 'security').click();
  const securityPanel = panelLocator(page, 'security');
  await expect(securityPanel).toHaveClass(/is-active/);

  const question = questionByText(page, securityPanel, 'Do you work under NDA?');
  await expect(question).toBeVisible();
  // Boundary: this item starts open — no click, same reasoning as TC-FAQ-003/006.
  await expect(question).toHaveAttribute('open', '');

  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-011 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L30
test('TC-FAQ-011: "Do you help with compliance frameworks?" expands to reveal a non-empty answer', async ({ page }) => {
  await tabButtonLocator(page, 'security').click();
  const securityPanel = panelLocator(page, 'security');
  const question = questionByText(page, securityPanel, 'Do you help with compliance frameworks?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// TEST-ID: TC-FAQ-012 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L15-L31
test('TC-FAQ-012: "Is security part of the AI work too?" expands to reveal a non-empty answer', async ({ page }) => {
  await tabButtonLocator(page, 'security').click();
  const securityPanel = panelLocator(page, 'security');
  const question = questionByText(page, securityPanel, 'Is security part of the AI work too?');
  await expect(question).toBeVisible();
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();

  await expect(question).toHaveAttribute('open', '');
  const answer = question.locator('.qa__a');
  await expect(answer).toBeVisible();
  expect((await answer.innerText()).trim().length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// Answer content consistency (TC-FAQ-013, TC-FAQ-014)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-013 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L33-L35
test('TC-FAQ-013: "Do you work remotely?" answer confirms global/remote-first with on-site work where needed', async ({ page }) => {
  const generalPanel = panelLocator(page, 'general');
  const question = questionByText(page, generalPanel, 'Do you work remotely?');
  await question.locator('summary').click();

  const answerText = await question.locator('.qa__a').innerText();
  expect(answerText).toMatch(/global/i);
  expect(answerText).toMatch(/remote-first/i);
  expect(answerText).toMatch(/on-site/i);
});

// TEST-ID: TC-FAQ-014 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L33,L36-L37
test('TC-FAQ-014: "Do you work under NDA?" answer confirms confidentiality is standard and agreed before the engagement starts', async ({ page }) => {
  await tabButtonLocator(page, 'security').click();
  const securityPanel = panelLocator(page, 'security');
  const question = questionByText(page, securityPanel, 'Do you work under NDA?');
  // Ships open already — no click needed to read the answer (see TC-FAQ-010).

  const answerText = await question.locator('.qa__a').innerText();
  expect(answerText).toMatch(/standard/i);
  expect(answerText).toMatch(/confidentiality/i);
  expect(answerText).toMatch(/before any engagement begins/i);
});

// ---------------------------------------------------------------------------
// Tab behavior (TC-FAQ-015 .. TC-FAQ-018, TC-FAQ-021)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-015 | PRIORITY: important | USE-CASE: inferred: `[data-tabs="faq"]` / `[data-tabset="faq"]` default state (index.html `.is-active` on General button + panel, site.js lines 46-59)
test('TC-FAQ-015: on load, the General tab button and panel are the default active state', async ({ page }) => {
  await expect(tabButtonLocator(page, 'general')).toHaveClass(/is-active/);
  await expect(tabButtonLocator(page, 'engagement')).not.toHaveClass(/is-active/);
  await expect(tabButtonLocator(page, 'security')).not.toHaveClass(/is-active/);

  const generalPanel = panelLocator(page, 'general');
  const engagementPanel = panelLocator(page, 'engagement');
  const securityPanel = panelLocator(page, 'security');

  await expect(generalPanel).toBeVisible();
  await expect(generalPanel.locator('details.qa')).toHaveCount(3);
  await expect(engagementPanel).toBeHidden();
  await expect(securityPanel).toBeHidden();
});

// TEST-ID: TC-FAQ-016 | PRIORITY: critical | USE-CASE: inferred: `data-tabs` click handler, `site.js` lines 46-59
test('TC-FAQ-016: clicking "Engagement" shows only its 4 questions and hides General/Security', async ({ page }) => {
  await tabButtonLocator(page, 'engagement').click();
  await expect(tabButtonLocator(page, 'engagement')).toHaveClass(/is-active/);

  const generalPanel = panelLocator(page, 'general');
  const engagementPanel = panelLocator(page, 'engagement');
  const securityPanel = panelLocator(page, 'security');

  await expect(engagementPanel).toBeVisible();
  await expect(engagementPanel.locator('details.qa')).toHaveCount(4);
  await expect(generalPanel).toBeHidden();
  await expect(securityPanel).toBeHidden();
});

// TEST-ID: TC-FAQ-017 | PRIORITY: critical | USE-CASE: inferred: `data-tabs` click handler, `site.js` lines 46-59
test('TC-FAQ-017: clicking "Security" shows only its 3 questions and hides General/Engagement', async ({ page }) => {
  // Precondition per plan: "General or Engagement tab active" — exercise
  // the transition via Engagement to also cover that starting point.
  await tabButtonLocator(page, 'engagement').click();
  await tabButtonLocator(page, 'security').click();
  await expect(tabButtonLocator(page, 'security')).toHaveClass(/is-active/);

  const generalPanel = panelLocator(page, 'general');
  const engagementPanel = panelLocator(page, 'engagement');
  const securityPanel = panelLocator(page, 'security');

  await expect(securityPanel).toBeVisible();
  await expect(securityPanel.locator('details.qa')).toHaveCount(3);
  await expect(generalPanel).toBeHidden();
  await expect(engagementPanel).toBeHidden();
});

// TEST-ID: TC-FAQ-018 | PRIORITY: important | USE-CASE: inferred: `data-tabs` click handler, `site.js` lines 46-59
test('TC-FAQ-018: switching General -> Engagement -> General round-trips correctly', async ({ page }) => {
  const generalButton = tabButtonLocator(page, 'general');
  const engagementButton = tabButtonLocator(page, 'engagement');
  const generalPanel = panelLocator(page, 'general');
  const engagementPanel = panelLocator(page, 'engagement');
  const securityPanel = panelLocator(page, 'security');

  await expect(generalButton).toHaveClass(/is-active/);

  await engagementButton.click();
  await expect(engagementPanel).toBeVisible();
  await expect(generalPanel).toBeHidden();

  await generalButton.click();

  await expect(generalButton).toHaveClass(/is-active/);
  await expect(engagementButton).not.toHaveClass(/is-active/);
  await expect(generalPanel).toBeVisible();
  await expect(generalPanel.locator('details.qa')).toHaveCount(3);
  await expect(engagementPanel).toBeHidden();
  await expect(securityPanel).toBeHidden();
});

// TEST-ID: TC-FAQ-021 | PRIORITY: nice-to-have | USE-CASE: inferred: `data-tabs` click handler re-applies the same `.is-active` state idempotently, `site.js` lines 46-59
test('TC-FAQ-021: re-clicking the already-active tab button is a no-op', async ({ page }) => {
  const generalButton = tabButtonLocator(page, 'general');
  const generalPanel = panelLocator(page, 'general');
  const question = questionByText(page, generalPanel, 'Who do you work with?');

  await question.locator('summary').click();
  await expect(question).toHaveAttribute('open', '');
  await expect(generalButton).toHaveClass(/is-active/);

  await generalButton.click(); // re-click the already-active General tab

  await expect(generalButton).toHaveClass(/is-active/);
  await expect(generalPanel).toBeVisible();
  // Neither the active tab state nor the expanded <details> underneath it
  // should have changed, and clicking does not throw/error.
  await expect(question).toHaveAttribute('open', '');
});

// ---------------------------------------------------------------------------
// Cross-tab state and content invariants (TC-FAQ-019, TC-FAQ-020)
// ---------------------------------------------------------------------------

// TEST-ID: TC-FAQ-019 | PRIORITY: important | USE-CASE: inferred: `site.js` tab handler only toggles `.is-active`, never touches native `<details>` state
test('TC-FAQ-019: expanding a question survives switching tabs away and back', async ({ page }) => {
  const generalPanel = panelLocator(page, 'general');
  const question = questionByText(page, generalPanel, 'Who do you work with?');
  await expect(question).not.toHaveAttribute('open', '');

  await question.locator('summary').click();
  await expect(question).toHaveAttribute('open', '');

  await tabButtonLocator(page, 'engagement').click();
  await expect(generalPanel).toBeHidden();

  await tabButtonLocator(page, 'general').click();
  await expect(generalPanel).toBeVisible();

  // Tab switching only toggled panel visibility — the native `open`
  // attribute on this <details> was never touched.
  await expect(question).toHaveAttribute('open', '');
});

// TEST-ID: TC-FAQ-020 | PRIORITY: important | USE-CASE: inferred: index.html FAQ markup (`data-tabpanel="general/engagement/security"`) cross-checked against spec Examples table, https://github.com/RachidSo/hamingcswebsite/blob/6a76f4ebfc2c30e379d97e26bf04965278ec592e/specs/faq.feature#L21-L31
test('TC-FAQ-020: each tab panel contains exactly its expected question set with no duplicates or omissions', async ({ page }) => {
  const expectedByTab = {
    general: [
      'What does Hamingcs actually do?',
      'Who do you work with?',
      'Do you work remotely?',
    ],
    engagement: [
      'How does an engagement start?',
      'Can you cover strategy, AI, and systems architecture together?',
      'Can you take P&L or leadership ownership, not just advise?',
      'Do you work on retainer or fixed scope?',
    ],
    security: [
      'Do you work under NDA?',
      'Do you help with compliance frameworks?',
      'Is security part of the AI work too?',
    ],
  };

  const allQuestions = [];
  for (const [tabKey, expectedQuestions] of Object.entries(expectedByTab)) {
    const panel = panelLocator(page, tabKey);
    const summaries = panel.locator('details.qa summary');
    await expect(summaries).toHaveCount(expectedQuestions.length);

    const texts = (await summaries.allTextContents()).map((t) => t.trim());
    expect(new Set(texts).size).toBe(texts.length); // no duplicates within this panel
    for (const expectedQuestion of expectedQuestions) {
      expect(texts).toContain(expectedQuestion);
    }
    allQuestions.push(...texts);
  }

  // All 10 spec questions accounted for exactly once across all three panels.
  expect(allQuestions.length).toBe(10);
  expect(new Set(allQuestions).size).toBe(10);
});
