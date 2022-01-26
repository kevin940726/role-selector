const puppeteer = require('puppeteer');
const { queryHandler } = require('../../../puppeteer');
const JestPuppeteerEnvironment = require('jest-environment-puppeteer');

class PuppeteerEnvironment extends JestPuppeteerEnvironment {
  async setup() {
    await super.setup();
    puppeteer.registerCustomQueryHandler('role', queryHandler);
  }
}

module.exports = PuppeteerEnvironment;
