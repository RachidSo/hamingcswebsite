// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  testMatch: '**/*_test.js',
  fullyParallel: false,
  retries: 1,
  // Read these env vars ourselves rather than relying on Playwright's own
  // env-var auto-detection — confirmed in qa-agents-framework that
  // auto-detection does NOT override an outputFile/outputDir already set
  // here, so an explicit fallback is the only way this actually works.
  // Every test-executor invocation should set both per-module (and, for
  // artifacts, per-commit) so concurrent runs and later unrelated runs
  // don't race or clobber each other's report/evidence.
  reporter: [
    ['list'],
    ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'results/playwright-report.json' }],
  ],
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'results/artifacts',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Real live site, not a local file:// fixture — no baseURL needed
    // since every test navigates with a full https://www.hamingcs.com/#...
    // URL directly (see test-executor.md).
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
