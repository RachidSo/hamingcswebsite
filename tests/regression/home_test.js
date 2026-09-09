// @ts-check
const { test, expect } = require('@playwright/test');

// Target: real, live production site (https://www.hamingcs.com/), a single
// page with anchor navigation — no local fixture, no backend, no forms.
// See playwright.config.js and .claude/agents/test-executor.md.
const BASE_URL = 'https://www.hamingcs.com/';

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // TEST-ID: HOME-01 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L9-L13
  test('HOME-01: hero eyebrow, headline, and lede communicate positioning', async ({ page }) => {
    const hero = page.locator('header.hero#top');

    await expect(hero.locator('.chip')).toHaveText(
      'STRATEGY, AI & IT CONSULTING — GLOBAL, REMOTE-FIRST'
    );
    await expect(hero.locator('h1')).toHaveText(
      'Strategy that ships, on systems built to run it.'
    );

    const lede = hero.locator('.lede');
    await expect(lede).toBeVisible();
    const ledeText = (await lede.innerText()).toLowerCase();
    expect(ledeText).toContain('strategy');
    expect(ledeText).toContain('hands-on leadership');
    expect(ledeText).toContain('ai/data expertise');
    expect(ledeText).toMatch(/systems,\s*security,?\s*and\s*devops architecture/);
  });

  // TEST-ID: HOME-03 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L17
  test('HOME-03: hero "Start a conversation" CTA links to and lands on #contact', async ({ page }) => {
    // Scoped specifically to the hero instance — "Start a conversation" also
    // appears in the nav bar (.nav-cta) and inside the services/engagement
    // sections, so this selector must stay exactly `.hero-actions .btn.btn-primary`.
    const heroCta = page.locator('.hero-actions .btn.btn-primary');

    await expect(heroCta).toBeVisible();
    await expect(heroCta).toHaveText('Start a conversation');
    await expect(heroCta).toHaveAttribute('href', '#contact');

    await heroCta.click();

    await expect(page).toHaveURL(/#contact$/);

    const contactSection = page.locator('section.cta#contact');
    await expect(contactSection).toBeInViewport();
    // Confirms the contact module's exposed anchor target hasn't moved or
    // been renamed out from under the hero CTA (specs/contact.feature's
    // "Contact section intro is correct" scenario asserts this same heading).
    await expect(contactSection.locator('.chip')).toContainText('CONTACT');
  });

  // TEST-ID: HOME-04 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L18
  test('HOME-04: hero "See what we do" CTA links to #services', async ({ page }) => {
    const servicesCta = page.locator('.hero-actions .btn.btn-ghost');

    await expect(servicesCta).toBeVisible();
    await expect(servicesCta).toHaveText('See what we do');
    await expect(servicesCta).toHaveAttribute('href', '#services');

    await servicesCta.click();

    await expect(page).toHaveURL(/#services$/);
  });

  // TEST-ID: HOME-05 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L20-L23
  test('HOME-05: three discipline summary cards are visible with title and copy', async ({ page }) => {
    const pillars = page.locator('header.hero#top .console .pillar');
    await expect(pillars).toHaveCount(3);

    const expectedLabels = [
      '01 — AI & DATA',
      '02 — SYSTEMS & SECURITY',
      '03 — STRATEGY & LEADERSHIP',
    ];

    for (let i = 0; i < expectedLabels.length; i++) {
      const pillar = pillars.nth(i);
      await expect(pillar).toBeVisible();
      await expect(pillar.locator('.pillar-label')).toHaveText(expectedLabels[i]);
      // Heading level updated to <h2> per the heading-hierarchy fix in commit
      // 6a76f4e (was <h3> in the prior revision of this plan/test).
      await expect(pillar.locator('h2')).toBeVisible();
      await expect(pillar.locator('h2')).not.toBeEmpty();
      await expect(pillar.locator('p:not(.pillar-label)')).toBeVisible();
      await expect(pillar.locator('p:not(.pillar-label)')).not.toBeEmpty();
    }
  });

  // TEST-ID: HOME-06 | PRIORITY: important | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L24-L25
  test('HOME-06: "STRATEGY & LEADERSHIP" card references director/CTO level and 300-person global team', async ({ page }) => {
    const leadershipPillar = page
      .locator('header.hero#top .console .pillar')
      .filter({ hasText: 'STRATEGY & LEADERSHIP' });

    await expect(leadershipPillar).toHaveCount(1);

    const copy = await leadershipPillar.locator('p:not(.pillar-label)').innerText();

    expect(copy).toContain('director and CTO level');
    expect(copy).toContain('300-person team');
    for (const region of ['US', 'EU', 'Japan', 'China', 'Middle East']) {
      expect(copy).toContain(region);
    }
  });

  // TEST-ID: HOME-07 | PRIORITY: critical | USE-CASE: https://github.com/RachidSo/hamingcswebsite/blob/6a76f4e/specs/home.feature#L27-L33
  test('HOME-07: stat strip renders all three stats with exact numbers and labels', async ({ page }) => {
    const statCards = page.locator('.stat-row .stat-card');
    await expect(statCards).toHaveCount(3);

    const expectedStats = [
      {
        num: '20+ yrs',
        label: 'Combined leadership across strategy, AI, data, and enterprise systems',
      },
      {
        num: 'Automotive, banking, tech',
        label: 'Industries our team has delivered in, across three continents',
      },
      {
        num: 'Strategy to production',
        label: 'From AI vision and data governance through to secure, running systems',
      },
    ];

    for (let i = 0; i < expectedStats.length; i++) {
      const card = statCards.nth(i);
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-num')).toHaveText(expectedStats[i].num);
      await expect(card.locator('.stat-label')).toHaveText(expectedStats[i].label);
    }
  });
});
