import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Retry on CI, no retries locally
  retries: process.env.CI ? 2 : 0,

  // Workers — limit to 2 locally to keep SauceDemo sessions stable
  workers: process.env.CI ? 1 : 2,

  // Reporters: rich HTML + console list + Allure report + JUnit XML (for Jenkins)
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    // All tests target SauceDemo
    baseURL: 'https://www.saucedemo.com/',

    // Run headless by default; use --headed flag to override
    headless: true,

    // Capture screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Retain video on failure
    video: 'retain-on-failure',

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});