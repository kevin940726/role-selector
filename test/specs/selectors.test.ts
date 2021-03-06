import { expect } from '@playwright/test';
import { test } from '../test-utils';

test('query elements', async ({ page, html }) => {
  await html`
    <div>
      <button aria-pressed="true">Button 1</button>
      <button disabled>Button 2</button>
      <button aria-expanded="true">Button 3</button>

      <label for="input-1">Input 1</label>
      <input id="input-1" placeholder="placeholder" />
      <label>
        Input 2
        <input value="value" />
      </label>
      <input aria-label="Input 3" />

      <select>
        <option value="option-1">Option 1</option>
        <option value="option-2" selected>Option 2</option>
      </select>

      <h1>Heading 1</h1>
      <h2>Heading 2</h2>

      <a href="#" aria-current="page">Link</a>
    </div>
  `;

  await expect(page.locator('role=button').first()).toHaveText('Button 1');
  await expect(page.locator('role=button')).toHaveCount(3);

  await expect(page.locator('role=button[name="Button 1"]')).toHaveText(
    'Button 1'
  );
  await expect(page.locator('role=button[name=/Button/]')).toHaveCount(3);
  await expect(page.locator('role=button[name=/button/i]')).toHaveCount(3);

  await expect(page.locator('role=textbox[name="Input 1"]')).toHaveId(
    'input-1'
  );
  await expect(page.locator('role=textbox[name="Input 2"]')).toHaveValue(
    'value'
  );
  await expect(page.locator('role=textbox[name="Input 3"]')).toHaveAttribute(
    'aria-label',
    'Input 3'
  );

  await expect(
    page.locator('role=textbox[placeholder="placeholder"]')
  ).toHaveAttribute('placeholder', 'placeholder');

  await expect(page.locator('role=textbox[valuetext="value"]')).toHaveValue(
    'value'
  );
  const selectHandleLocator = page.locator(
    'role=combobox[valuetext="Option 2"]'
  );
  await expect(selectHandleLocator).toHaveValue('option-2');
  await selectHandleLocator.selectOption('option-1');
  await expect(page.locator('role=combobox[valuetext="Option 1"]')).toHaveValue(
    'option-1'
  );

  await expect(page.locator('role=heading[name="Heading 1"]')).toHaveText(
    'Heading 1'
  );
  await expect(page.locator('role=heading[level=2]')).toHaveText('Heading 2');

  await expect(page.locator('role=button[pressed]')).toHaveText('Button 1');

  await expect(page.locator('role=button[disabled]')).toHaveText('Button 2');

  await expect(page.locator('role=button[expanded]')).toHaveText('Button 3');

  await expect(page.locator('role=link[current="page"]')).toHaveText('Link');
});

test('query partial elements', async ({ page, html }) => {
  await html`
    <div>
      <button data-id="button-1">Button</button>
      <div id="target">
        <button data-id="button-2">Button</button>
      </div>
    </div>
  `;

  const target = await page.$('#target')!;
  const button = await target.$('role=button[name="Button"]')!;

  await expect(button.evaluate((node) => node.dataset.id)).resolves.toBe(
    'button-2'
  );
});
