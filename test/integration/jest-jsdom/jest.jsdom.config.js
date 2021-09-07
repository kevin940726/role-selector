module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [require.resolve('./setup.js')],
  testMatch: ['**/test/integration/jest-jsdom/**/test.ts'],
  transform: {
    '\\.(j|t)sx?$': 'ts-jest',
  },
};
