module.exports = {
  preset: 'jest-playwright-preset',
  transform: {
    '\\.(j|t)sx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['expect-playwright'],
};
