/// <reference types="jest-playwright-preset" />
/// <reference types="expect-playwright" />
import { html } from './test-utils';

it('query elements', async () => {
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
    </div>
  `;

  await expect(page).toHaveSelector('role=button');
  await expect(page).toHaveSelectorCount('role=button', 3);

  await expect(page).toHaveSelector('role=button[name="Button 1"]');
  await expect(page).toHaveSelectorCount('role=button[name=/Button/]', 3);
  await expect(page).toHaveSelectorCount('role=button[name=/button/i]', 3);

  await expect(page).toHaveSelector('role=textbox[name="Input 1"]');
  await expect(page).toHaveSelector('role=textbox[name="Input 2"]');
  await expect(page).toHaveSelector('role=textbox[name="Input 3"]');

  await expect(page).toHaveSelector('role=textbox[placeholder="placeholder"]');

  await expect(page).toHaveSelector('role=textbox[value="value"]');
  const selectHandlePromise = page.$('role=combobox[value="Option 2"]');
  await expect(selectHandlePromise).resolves.toBeTruthy();
  const select = await selectHandlePromise;
  await select!.selectOption('option-1');
  await expect(page).toHaveSelector('role=combobox[value="Option 1"]');

  await expect(page).toHaveSelector('role=heading[name="Heading 1"]');
  await expect(page).toHaveSelector('role=heading[level=2]');

  await expect(page).toHaveSelectorCount('role=button[disabled]', 1);

  await expect(page).toHaveSelectorCount('role=button[pressed]', 1);

  await expect(page).toHaveSelectorCount('role=button[expanded]', 1);
});
