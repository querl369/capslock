import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Capslock Walk-In Bath landing page test suite.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel. */
  fullyParallel: true,
  /* Fail the build on CI if a test.only was left in the source. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    /* Base URL so tests can navigate with page.goto('/'). */
    baseURL: 'https://test-qa.capslock.global',
    /* Capture artifacts to make CI failures diagnosable. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
