const { selectorScript } = require('../../../playwright');

module.exports = {
  selectors: [
    {
      name: 'role',
      script: selectorScript,
    },
  ],
};
