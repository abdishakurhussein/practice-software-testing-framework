import { defineConfig } from '@playwright/test';
import { config } from './utilities/env';

// ========================================
// Playwright Config
// ========================================
export default defineConfig({
  testDir: './tests',

  retries: 1,
  timeout: 45000,
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: config.baseUrl,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },

  reporter: [
    ['list'],
    ['html']
  ]
});
