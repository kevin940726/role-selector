# `role-selector`

Accessible role selector for browsers, jsdom, Playwright, Puppeteer, Cypress, and more.

```js
import { setup } from 'role-selector/playwright';

// Register the selector in Playwright
setup();

// Given DOM of:
//   <label for="username">User Name</label>
//   <input id="username" />
//   <input type="submit" value="Submit" />

// Query the text input by its role and accessible name
const userNameInput = await page.$('role=textbox[name="User Name"]');
await userNameInput.type('My name');

// Works on any method that accepts a selector
await page.click('role=button[name="Submit"]');

// Suggest selector to use during development
console.log(await suggestSelector(userNameInput));
// Logs: { type: 'role', selector: 'role=textbox[name="User Name"]' }
```

_Only Playwright, Puppeteer, and jsdom are supported at the time._

- [`role-selector`](#role-selector)
  - [Installation](#installation)
  - [Setup](#setup)
  - [API](#api)
      - [`query(root: Element | Document, selector: string): Element`](#queryroot-element--document-selector-string-element)
      - [`queryAll(root: Element | Document, selector: string): Element[]`](#queryallroot-element--document-selector-string-element)
      - [`suggestSelector(element: Element, options?: Options): SuggestedSelector`](#suggestselectorelement-element-options-options-suggestedselector)
    - [Puppeteer and Playwright endpoints](#puppeteer-and-playwright-endpoints)
      - [(Playwright) `setup(selectorName: string = 'role'): void`](#playwright-setupselectorname-string--role-void)
      - [(Puppeteer) `setup(selectorName: string = 'role'): void`](#puppeteer-setupselectorname-string--role-void)
      - [`suggestSelector(elementHandle: ElementHandle | Promise<ElementHandle> | Locator, options?: Options): Promise<SuggestedSelector>`](#suggestselectorelementhandle-elementhandle--promiseelementhandle--locator-options-options-promisesuggestedselector)

## Installation

```sh
npm install -D role-selector
```

## Setup

See the examples in the [`test/integration`](https://github.com/kevin940726/role-selector/tree/main/test/integration) directory.

## API

#### `query(root: Element | Document, selector: string): Element`

Query an element that matches the role selector. Note that the selector doesn't have the `role=` or `role/` prefix.

```js
import { query } from 'role-selector';

query(document.body, 'button[name="Button"]');
```

#### `queryAll(root: Element | Document, selector: string): Element[]`

Query all the elements that match the role selector. Note that the selector doesn't have the `role=` or `role/` prefix.

```js
import { query } from 'role-selector';

queryAll(document.body, 'button[name=/button/i]');
```

#### `suggestSelector(element: Element, options?: Options): SuggestedSelector`

Suggest a selector for the element. See promise-based [`suggestSelector`](#suggestselectorelementhandle-elementhandle--locator-options-options-promisesuggestedselector) for more information.

```js
import { suggestSelector } from 'role-selector/browser';

suggestSelector(document.getElementById('button'));
```

### Puppeteer and Playwright endpoints

#### (Playwright) `setup(selectorName: string = 'role'): void`

Register the role selector in Playwright. Once registered, the selector is available globally under `[selectorName]=` prefix. By default it will try to register to the `selectors` instance from the `playwright` import. If you're using `@playwright/test` or other setup, use that instance as `this` when calling this function.

```js
import { selectors } from '@playwright/test';
import { setup } from 'role-selector/playwright';

setup.call(selectors);
```

#### (Puppeteer) `setup(selectorName: string = 'role'): void`

Register the role selector in Puppeteer. Once registered, the selector is available globally under `[selectorName]/` prefix. By default it will try to register to the `puppeteer` import. If you're using other setup, use that instance as `this` when calling this function.

```js
import puppeteer from 'puppeteer-core';
import { setup } from 'role-selector/puppeteer';

setup.call(puppeteer);
```

#### `suggestSelector(elementHandle: ElementHandle | Promise<ElementHandle> | Locator, options?: Options): Promise<SuggestedSelector>`

Given a element handle (either in Playwright or Puppeteer), returns a promise of an object describing the suggested selector to use. The object has the following signature.

```typescript
interface SuggestedSelector {
  type: 'css' | 'role';
  selector: string;
};
```

You can log it when first writing your test, then replace it with the suggested selector. If the suggested selector has `type` of `role`, remember to prefix your selector with the registered `selectorName` (defaults to `role=` in Playwright and `role/` in Puppeteer).

```js
import { suggestSelector } from 'role-selector/playwright';

await suggestSelector(page.$('#button'));
```

The options has the following type.

```typescript
interface Options {
  strict: boolean;
};
```

`strict` is default to `true` to only suggest selector that resolves to only one element. You can disable it to suggest any selector that selects the element by passing `false`.


