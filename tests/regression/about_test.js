// @ts-check
const { test, expect } = require('@playwright/test');

// Generated from docs/test-plans/about.md (ABOUT-01 .. ABOUT-05).
// Spec source: specs/about.feature (commit 6a76f4e). Shared Background
// precondition for every test below: navigate to "https://hamingcs.com/#about"
// (single-page site — #about is reached by scroll/hash-change, not a new
// page load).
//
// Markup note (see docs/test-plans/about.md): the four section titles
// ("WHY THREE DISCIPLINES", "OUR BACKGROUND", "HOW WE APPROACH STRATEGY",
// "HOW WE WORK") are `<p class="chip">` eyebrow labels, not heading-role
// elements, so they're asserted on via `#about .chip` text rather than
// getByRole('heading'). The 4 strategy steps and 3 working principles share
// identical div.principle / div.principle-mark / <h3> / <p> markup under two
// separate `<div style="margin-top: 28px;">` blocks, so selectors below are
// scoped by ordinal position within #about to avoid cross-matching the two
// lists.

const ABOUT_URL = 'https://hamingcs.com/#about';

test.beforeEach(async ({ page }) => {
  await page.goto(ABOUT_URL);
});

// TEST-ID: ABOUT-01 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L9-L13
test('ABOUT-01: "WHY THREE DISCIPLINES" explains the need to combine strategy, AI/data, and systems', async ({ page }) => {
  const aboutSection = page.locator('#about');
  const chip = aboutSection.locator('.chip').nth(0);
  await expect(chip).toHaveText(/WHY THREE DISCIPLINES/);
  await expect(chip).toBeVisible();

  const introStack = aboutSection.locator('.intro-stack').nth(0);
  const introText = await introStack.innerText();
  expect(introText).toMatch(/fail on the system underneath/i);
  expect(introText).toMatch(/strategy and leadership that never turned the plan into a running function/i);
  // Rationale for combining strategy, AI/data, and systems under one practice.
  expect(introText).toMatch(/strategy/i);
  expect(introText).toMatch(/AI and data/i);
  expect(introText).toMatch(/systems/i);
  expect(introText).toMatch(/different rooms/i);
});

// TEST-ID: ABOUT-02 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L16-L22
test('ABOUT-02: "OUR BACKGROUND" narrates the Java/automotive origins, director/CTO ownership, and regional scope', async ({ page }) => {
  const aboutSection = page.locator('#about');
  const chip = aboutSection.locator('.chip').nth(1);
  await expect(chip).toHaveText(/OUR BACKGROUND/);
  await expect(chip).toBeVisible();

  const introStack = aboutSection.locator('.intro-stack').nth(1);
  const introText = await introStack.innerText();
  expect(introText).toMatch(/Java/);
  expect(introText).toMatch(/automotive diagnostic software/i);
  expect(introText).toMatch(/architecture/i);
  expect(introText).toMatch(/director and CTO/i);
  expect(introText).toMatch(/300/);
  for (const region of ['US', 'EU', 'Japan', 'China', 'Middle East']) {
    expect(introText).toContain(region);
  }
  expect(introText).toMatch(/cloudification/i);
  expect(introText).toMatch(/digitalisation/i);
});

// TEST-ID: ABOUT-03 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L23
test('ABOUT-03: no individual personal name appears in the "OUR BACKGROUND" text', async ({ page }) => {
  const aboutSection = page.locator('#about');
  const introStack = aboutSection.locator('.intro-stack').nth(1);
  const text = await introStack.innerText();

  // Known two-consecutive-capitalized-word phrases in this block that are
  // region names, not personal names, so they don't trip the heuristic below.
  const KNOWN_NON_NAME_PHRASES = ['Middle East'];
  const candidateNames = (text.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)+\b/g) || [])
    .filter((phrase) => !KNOWN_NON_NAME_PHRASES.includes(phrase));
  expect(candidateNames, `Possible personal name(s) found: ${candidateNames.join(', ')}`).toEqual([]);

  // Sanity check the block is actually scoped to "OUR BACKGROUND" content —
  // it should still reference the Hamingcs brand and the director/CTO title
  // per the plan's "brand name and role/title references are fine" note.
  expect(text).toMatch(/Hamingcs/);
  expect(text).toMatch(/director and CTO/i);
});

// TEST-ID: ABOUT-04 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L25-L33
test('ABOUT-04: "HOW WE APPROACH STRATEGY" lists exactly 4 steps, in order, each with a description', async ({ page }) => {
  const aboutSection = page.locator('#about');
  const chip = aboutSection.locator('.chip').nth(2);
  await expect(chip).toHaveText(/HOW WE APPROACH STRATEGY/);
  await expect(chip).toBeVisible();

  // Scoped to the steps block immediately following this chip's own <h2> —
  // the "HOW WE WORK" section below reuses the identical
  // div.principle/.principle-mark/<h3>/<p> structure, so ordinal position
  // (the first of the two `div[style="margin-top: 28px;"]` blocks) is what
  // disambiguates them, per the test plan's markup note.
  const stepsContainer = aboutSection.locator('div[style="margin-top: 28px;"]').nth(0);
  const steps = stepsContainer.locator('div.principle');
  await expect(steps).toHaveCount(4);

  const expectedTitles = [
    'Define the issue',
    'Wargame the options',
    'Decide, resource, and lead',
    'Execute and adapt',
  ];

  for (let i = 0; i < expectedTitles.length; i++) {
    const step = steps.nth(i);
    await expect(step.locator('.principle-mark')).toHaveText(String(i + 1).padStart(2, '0'));
    await expect(step.locator('h3')).toHaveText(expectedTitles[i]);
    const description = await step.locator('p').innerText();
    expect(description.trim().length).toBeGreaterThan(0);
  }
});

// TEST-ID: ABOUT-05 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/about.feature#L35-L39
test('ABOUT-05: "HOW WE WORK" lists 3 working principles covering operate, security/scale, and global/remote-first', async ({ page }) => {
  const aboutSection = page.locator('#about');
  const chip = aboutSection.locator('.chip').nth(3);
  await expect(chip).toHaveText(/HOW WE WORK/);
  await expect(chip).toBeVisible();

  const principlesContainer = aboutSection.locator('div[style="margin-top: 28px;"]').nth(1);
  const principles = principlesContainer.locator('div.principle');
  await expect(principles).toHaveCount(3);

  const allText = await principlesContainer.innerText();
  expect(allText).toMatch(/operate it/i);
  expect(allText).toMatch(/security and scale are designed in/i);
  expect(allText).toMatch(/global and remote-first/i);
});
