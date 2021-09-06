import fs from 'fs';
import { selectors } from 'playwright';
import puppeteer from 'puppeteer';

export function setupPlaywright(selectorName: string = 'role') {
  selectors.register(selectorName, {
    path: require.resolve('../playwright'),
  });
}

export function setupPuppeteer(selectorName: string = 'role') {
  const script = fs.readFileSync(
    require.resolve('../dist/role-selector-eval'),
    'utf-8'
  );

  puppeteer.registerCustomQueryHandler(selectorName, {
    queryOne: new Function(
      'element',
      'selector',
      `return window.eval(${script}).query(element, selector);`
    ) as any,
    queryAll: new Function(
      'element',
      'selector',
      `return window.eval(${script}).queryAll(element, selector);`
    ) as any,
  });
}
