module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: require.resolve('./puppeteer-environment.js'),
  testMatch: ['**/test/integration/jest-puppeteer/test.ts'],
  transform: {
    '\\.(j|t)sx?$': 'ts-jest',
  },
};
