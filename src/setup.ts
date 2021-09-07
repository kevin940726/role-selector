import fs from 'fs';
import playwright from 'playwright';
import puppeteer from 'puppeteer';

export function setupPlaywright(
  this: typeof playwright | void,
  selectorName: string = 'role'
) {
  (this || playwright).selectors.register(selectorName, {
    path: require.resolve('../eval'),
  });
}

export function setupPuppeteer(
  this: typeof puppeteer | void,
  selectorName: string = 'role'
) {
  const script = fs.readFileSync(require.resolve('../eval'), 'utf-8');

  (this || puppeteer).registerCustomQueryHandler(selectorName, {
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
