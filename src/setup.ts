import fs from 'fs';
import type { Selectors } from 'playwright';
import type { Puppeteer } from 'puppeteer';

export function setupPlaywright(
  this: { selectors: Selectors } | void,
  selectorName: string = 'role'
) {
  const playwright = this || require('playwright');

  playwright.selectors.register(selectorName, {
    path: require.resolve('../eval'),
  });
}

export function setupPuppeteer(
  this: Puppeteer | void,
  selectorName: string = 'role'
) {
  const script = fs.readFileSync(require.resolve('../eval'), 'utf-8');
  const puppeteer = this || require('puppeteer');

  puppeteer.registerCustomQueryHandler(selectorName, {
    queryOne: new Function(
      'element',
      'selector',
      `return (${script}).query(element, selector);`
    ) as any,
    queryAll: new Function(
      'element',
      'selector',
      `return (${script}).queryAll(element, selector);`
    ) as any,
  });
}
