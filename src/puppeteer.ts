import fs from 'fs';
import { createRequire } from 'module';
import type { ElementHandle, JSONObject } from 'puppeteer';
import { suggestSelectorFunction } from './suggest-selector.backend';
import type {
  SuggestedSelector,
  SuggestSelectorOptions,
} from './suggest-selector.backend';

const require = createRequire(import.meta.url);

const script = fs.readFileSync(require.resolve('../eval'), 'utf-8');

const queryHandler = {
  queryOne: new Function(
    'element',
    'selector',
    `return (${script}).query(element, selector);`
  ) as (element: Element | Document, selector: string) => Element | null,
  queryAll: new Function(
    'element',
    'selector',
    `return (${script}).queryAll(element, selector);`
  ) as (element: Element | Document, selector: string) => Element[],
};

async function suggestSelector(
  elementHandle: ElementHandle | Promise<ElementHandle | null> | null,
  options?: SuggestSelectorOptions
): Promise<SuggestedSelector> {
  const handle = await elementHandle;

  if (!handle) {
    throw new Error("Element doesn't exist");
  }

  if (!options) {
    return await handle.evaluate(suggestSelectorFunction);
  }

  return await handle.evaluate(
    suggestSelectorFunction,
    (options as unknown) as JSONObject
  );
}

export { queryHandler, suggestSelector };
