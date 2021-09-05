# `role-selector`

Accessible role selector for Playwright, Puppeteer, Cypress, jsdom, and browsers.

## Quick Start

Only Playwright is supported at the time.

```js
import { selectors } from 'playwright';

selectors.register('role', { path: require.resolve('role-selector/playwright') });

// Given DOM of:
//   <label for="username">User Name</label>
//   <input id="username" />
//   <input type="submit" value="Submit" />

const userNameInput = await page.$('role=textbox[name="User Name"]');
await userNameInput.type('My name');

await page.click('role=button[name="Submit"]');
```
