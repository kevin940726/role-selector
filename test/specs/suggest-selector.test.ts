import { expect } from '@playwright/test';
import { test } from '../test-utils';
import { suggestSelector } from '../../playwright-test';

test.describe('suggestSelector', () => {
  test('suggest selectors', async ({ page, html }) => {
    await html`
      <button aria-pressed="true">Button</button>
      <button aria-expanded="true">Button</button>
      <h2>Heading</h2>
      <h6>Heading</h6>
      <label>
        Input
        <input />
      </label>
      <input type="checkbox" />
      <input type="checkbox" checked />
      <input type="submit" value="Submit" />
    `;

    await expect(
      suggestSelector(page.locator('button').first(), { strict: false })
    ).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button/i]',
    });

    await expect(
      suggestSelector(page.locator('input[type="submit"]').last())
    ).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/submit/i]',
    });
  });

  // FIXME: These won't work yet
  test.skip('Suggest more detailed selectors', async ({ page, html }) => {
    await html`
      <button aria-pressed="true">Button</button>
      <button aria-expanded="true">Button</button>
      <h2>Heading</h2>
      <h6>Heading</h6>
      <label>
        Input
        <input />
      </label>
      <input type="checkbox" />
      <input type="checkbox" checked />
      <input type="submit" value="Submit" />
    `;

    await expect(
      suggestSelector(page.locator('button').last())
    ).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button/i][expanded]',
    });

    await expect(suggestSelector(page.locator('h6'))).resolves.toEqual({
      type: 'role',
      selector: 'heading[name=/heading/i][level=6]',
    });

    await expect(
      suggestSelector(page.locator('input[type="checkbox"]').last())
    ).resolves.toEqual({
      type: 'role',
      selector: 'checkbox[checked]',
    });
  });

  test('support ElementHandle, Promise<ElementHandle>, or Locator', async ({
    page,
    html,
  }) => {
    await html`<button>Button 1</button>`;

    await expect(suggestSelector(await page.$('button'))).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button 1/i]',
    });
    await expect(suggestSelector(page.$('button'))).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button 1/i]',
    });
    await expect(suggestSelector(page.locator('button'))).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button 1/i]',
    });
  });

  test('suggest test id selector first', async ({ page, html }) => {
    await html`
      <button data-testid="button-1" id="button-1">Button 1</button>
      <button data-test-id="button-2">Button 2</button>
      <button data-test="button-3">Button 3</button>
    `;

    const [button1, button2, button3] = await page.$$('button');

    await expect(suggestSelector(button1)).resolves.toEqual({
      type: 'css',
      selector: '[data-testid="button-1"]',
    });
    await expect(suggestSelector(button2)).resolves.toEqual({
      type: 'css',
      selector: '[data-test-id="button-2"]',
    });
    await expect(suggestSelector(button3)).resolves.toEqual({
      type: 'css',
      selector: '[data-test="button-3"]',
    });
  });

  test('suggest role selector second', async ({ page, html }) => {
    await html`<button>Button 1</button>`;

    await expect(suggestSelector(page.locator('button'))).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/button 1/i]',
    });
  });

  test('suggest role only selector third', async ({ page, html }) => {
    await html`<input />`;

    await expect(suggestSelector(page.locator('input'))).resolves.toEqual({
      type: 'role',
      selector: 'textbox',
    });
  });

  test('suggest id selector forth', async ({ page, html }) => {
    await html`<div id="element"></button>`;

    await expect(suggestSelector(page.locator('#element'))).resolves.toEqual({
      type: 'css',
      selector: '#element',
    });
  });

  test('escape characters', async ({ page, html }) => {
    await html`<button>"Button 1"</button>`;

    await expect(suggestSelector(page.locator('button'))).resolves.toEqual({
      type: 'role',
      selector: 'button[name=/"button 1"/i]',
    });
  });
});
