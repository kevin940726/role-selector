const { setupPuppeteer } = require('../../../');
const JestPuppeteerEnvironment = require('jest-environment-puppeteer');

class PuppeteerEnvironment extends JestPuppeteerEnvironment {
  async setup() {
    await super.setup();
    setupPuppeteer();
  }
}

module.exports = PuppeteerEnvironment;
