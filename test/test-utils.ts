import { Page } from 'playwright';
import * as playwright from '@playwright/test';
import { setupPlaywright } from '../';

setupPlaywright.call(playwright);

if (global.beforeEach as any) {
  beforeEach(async () => {
    await html``;
  });
}

export const test = playwright.test.extend<{
  html: typeof html;
}>({
  async html({ page }, use) {
    const boundHTML = html.bind({ page });
    await boundHTML``;
    await use(boundHTML);
  },
});

export async function html(this: any, strings: TemplateStringsArray) {
  const string = strings.join('');

  await ((this || global).page as Page).evaluate((_html) => {
    document.body.innerHTML = _html;
  }, string);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
