module.exports = {
  browsers: ['chromium', 'firefox', 'webkit'],
  selectors: [
    {
      name: 'role',
      script: { path: require.resolve('../playwright') },
    },
  ],
};
