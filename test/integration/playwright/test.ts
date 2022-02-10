import { selectors, chromium, ElementHandle } from 'playwright';
import { strict as assert } from 'assert';
import { selectorScript, suggestSelector } from '../../../playwright';

(async () => {
  selectors.register('role', selectorScript, { contentScript: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(`
    <button aria-pressed="true">Button 1</button>
    <button disabled>Button 2</button>
    <button aria-expanded="true">Button 3</button>
  `);

  const button = (await page.$('role=button')) as ElementHandle<HTMLElement>;
  const namedButton = await page.$('role=button[name="Button 1"]');
  const buttons = await page.$$('role=button[name=/button/i]');

  assert.strictEqual(
    await button!.evaluate((node) => node.textContent),
    'Button 1'
  );
  assert.strictEqual(
    await namedButton!.evaluate((node) => node.textContent),
    'Button 1'
  );
  assert.strictEqual(buttons.length, 3);

  const suggestedSelector = await suggestSelector(button);
  assert.deepStrictEqual(suggestedSelector, {
    type: 'role',
    selector: 'button[name=/button 1/i]',
  });

  await browser.close();
})();
