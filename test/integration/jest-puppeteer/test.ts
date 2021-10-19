import { html } from '../../test-utils';
import { suggestSelector } from '../../../puppeteer';

test('role selector', async () => {
  await html`
    <button aria-pressed="true">Button 1</button>
    <button disabled>Button 2</button>
    <button aria-expanded="true">Button 3</button>
  `;

  await expect(page.$('role/button')).resolves.toBeTruthy();
  await expect(page.$('role/button[name="Button 1"]')).resolves.toBeTruthy();
  await expect(page.$$('role/button[name=/button/i]')).resolves.toHaveLength(3);

  const button = await page.$('button');
  await expect(suggestSelector(button)).resolves.toEqual({
    type: 'role',
    selector: 'button[name="Button 1"]',
  });
  await expect(suggestSelector(page.$('button'))).resolves.toEqual({
    type: 'role',
    selector: 'button[name="Button 1"]',
  });
});
