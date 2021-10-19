const { setup } = require('../../../puppeteer');
const JestPuppeteerEnvironment = require('jest-environment-puppeteer');

class PuppeteerEnvironment extends JestPuppeteerEnvironment {
  async setup() {
    await super.setup();
    setup();
  }
}

module.exports = PuppeteerEnvironment;
