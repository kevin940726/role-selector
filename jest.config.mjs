export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  transform: {
    '\\.(j|t)sx?$': 'ts-jest',
  },
};
