import fs from 'fs';
import type { Puppeteer } from 'puppeteer';

export function setup(this: Puppeteer | void, selectorName: string = 'role') {
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

export { default as suggestSelector } from './suggest-selector.backend';
