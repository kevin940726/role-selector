import { html } from '../../test-utils';

it('query elements', async () => {
  await html`
    <button aria-pressed="true">Button 1</button>
    <button disabled>Button 2</button>
    <button aria-expanded="true">Button 3</button>
  `;

  await expect(page.$('role=button')).resolves.toBeTruthy();
  await expect(page.$('role=button[name="Button 1"]')).resolves.toBeTruthy();
  await expect(page.$$('role=button[name=/button/i]')).resolves.toHaveLength(3);
});
