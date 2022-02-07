# `role-selector`

Accessible role selector for browsers, jsdom, Playwright, Puppeteer, Cypress, and more.



```js
import { selectors } from '@playwright/test';
import { selectorScript } from 'role-selector/playwright-test';
// import from 'role-selector/playwright' if you're using the 'playwright' package.

// Register the selector in Playwright
selectors.register('role', selectorScript, { contentScript: true });

// Given DOM of:
//   <label for="username">User Name</label>
//   <input id="username" />
//   <input type="submit" value="Submit" />

// Query the text input by its role and accessible name
const userNameInput = page.locator('role=textbox[name="User Name"]');
await userNameInput.type('My name');

// Works on any method that accepts a selector
await page.click('role=button[name="Submit"]');

// Suggest selector to use during development
console.log(await suggestSelector(userNameInput));
// Logs: { type: 'role', selector: 'role=textbox[name="User Name"]' }
```

_Only browsers, Playwright, Puppeteer, and jsdom are supported at the time._

- [`role-selector`](#role-selector)
  - [Installation](#installation)
  - [Setup](#setup)
  - [Selector](#selector)
  - [API](#api)
      - [`query(root: Element | Document, selector: string): Element`](#queryroot-element--document-selector-string-element)
      - [`queryAll(root: Element | Document, selector: string): Element[]`](#queryallroot-element--document-selector-string-element)
      - [`suggestSelector(element: Element, options?: Options): SuggestedSelector`](#suggestselectorelement-element-options-options-suggestedselector)
    - [Puppeteer and Playwright endpoints](#puppeteer-and-playwright-endpoints)
      - [(Playwright) `selectorScript: Object`](#playwright-selectorscript-object)
      - [(Puppeteer) `queryHandler: Object`](#puppeteer-queryhandler-object)
      - [`suggestSelector(elementHandle: ElementHandle | Promise<ElementHandle> | Locator, options?: Options): Promise<SuggestedSelector>`](#suggestselectorelementhandle-elementhandle--promiseelementhandle--locator-options-options-promisesuggestedselector)

## Installation

```sh
npm install -D role-selector
```

## Setup

See the examples in the [`test/integration`](https://github.com/kevin940726/role-selector/tree/main/test/integration) directory.

## Selector

The role selector syntax roughly follows the below format:

```
role=ROLE_NAME[STRING_ATTRIBUTE="STRING"][NUMBER_ATTRIBUTE=NUMBER][BOOLEAN_ATTRIBUTE]
```

While:

- `ROLE_NAME` can be any of the [WAI_ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).
- `ATTRIBUTE` is one of `name`, `value`, `placeholder`, `selected`, `checked`, `disabled`, `level`, `expanded`, `pressed`, and `current`.
- String attributes have to be wrapped with double quotes `"`.
- Number attributes can be represented as number literal.
- Boolean attributes can have value of `true` or `false`. Omitting the value and the equal sign is a shorthand of `=true`.

Other than the role name, the order of the attributes doesn't matter. You can also add intermediate spaces in-between for readability.

For instance, here's a selector which queries the element `<h2>Hello World</h2>`.

```
role=heading[name="Hello World"][level=2]
```

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

#### (Playwright) `selectorScript: Object`

An object with the path of the selector script. You can register it using [`selectors.register`](https://playwright.dev/docs/api/class-selectors#selectors-register).

```js
import { selectors } from '@playwright/test';
import { selectorScript } from 'role-selector/playwright-test';

selectors.register('role', selectorScript, { contentScript: true });
```

#### (Puppeteer) `queryHandler: Object`

The query handler object you can use to register the selector with [`puppeteer.registerCustomQueryHandler`](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerregistercustomqueryhandlername-queryhandler).

```js
import puppeteer from 'puppeteer';
import { queryHandler } from 'role-selector/puppeteer';

puppeteer.registerCustomQueryHandler('role', queryHandler);
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
import { suggestSelector } from 'role-selector/playwright-test';

await suggestSelector(page.$('#button'));
```

The options has the following type.

```typescript
interface Options {
  strict: boolean;
};
```

`strict` is default to `true` to only suggest selector that resolves to only one element. You can disable it to suggest any selector that selects the element by passing `false`.


