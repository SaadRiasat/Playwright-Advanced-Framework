// // @ts-check
// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',

//   fullyParallel: false,

//   retries: 0,

//   reporter: 'html',

//   use: {
//     baseURL: 'https://www.saucedemo.com/',
//     headless: false,
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     acceptDownloads: true, // ✅ FIXED
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         ...devices['Desktop Chrome'],
//       },
//     }
//   ],
// });

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'always' }]],
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});