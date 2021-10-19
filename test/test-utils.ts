import { Page } from 'playwright';
import { selectors, test as playwrightTest } from '@playwright/test';
import { setup } from '../playwright';

setup.call(selectors);

if (global.beforeEach as any) {
  beforeEach(async () => {
    await html``;
  });
}

export const test = playwrightTest.extend<{
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
