module.exports = {
  selectors: [
    {
      name: 'role',
      script: { path: require.resolve('../../../dist/role-selector-eval.js') },
    },
  ],
};
