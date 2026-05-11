import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// ========================================
// Load environment file first
// ========================================
const envFile =
  process.env.TEST_ENV === 'buggy'
    ? '.env.buggy'
    : '.env.main';

dotenv.config({ path: envFile });

// ========================================
// Import AFTER dotenv loads variables
// ========================================
import { config } from './utilities/env';

// ========================================
// Playwright Config
// ========================================
export default defineConfig({
  testDir: './tests',

  retries: 1,
  timeout: 15000,

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