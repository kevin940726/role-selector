process.env.JEST_PLAYWRIGHT_CONFIG = require.resolve(
  './jest-playwright.config.js'
);

module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/test/integration/jest-playwright/test.ts'],
  transform: {
    '\\.(j|t)sx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['expect-playwright'],
};
