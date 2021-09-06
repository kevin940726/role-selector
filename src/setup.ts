import fs from 'fs';
import playwright from 'playwright';
import puppeteer from 'puppeteer';

export function setupPlaywright(
  this: typeof playwright,
  selectorName: string = 'role'
) {
  (this || playwright).selectors.register(selectorName, {
    path: require.resolve('../dist/role-selector-eval.js'),
  });
}

export function setupPuppeteer(
  this: typeof puppeteer,
  selectorName: string = 'role'
) {
  const script = fs.readFileSync(
    require.resolve('../dist/role-selector-eval.js'),
    'utf-8'
  );

  (this || puppeteer).registerCustomQueryHandler(selectorName, {
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
