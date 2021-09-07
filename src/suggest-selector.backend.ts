import fs from 'fs';
import { ElementHandle as PlaywrightElementHandle, Locator } from 'playwright';
import { ElementHandle as PuppeteerElementHandle } from 'puppeteer';

const suggestSelectorScript = fs.readFileSync(
  require.resolve('../dist/suggest-selector.eval.js')
);
const suggestSelectorFunction = (new Function(
  'element',
  'options',
  `return ${suggestSelectorScript}(element, options);`
) as any) as (element: HTMLElement, options?: Options) => SuggestedSelector;

interface SuggestedSelector {
  type: 'css' | 'role';
  selector: string;
}

interface Options {
  strict: boolean;
}

async function suggestSelector(
  elementHandle:
    | PlaywrightElementHandle<HTMLElement>
    | Promise<PlaywrightElementHandle<HTMLElement> | null>
    | null,
  options?: Options
): Promise<SuggestedSelector>;
async function suggestSelector(
  elementHandle:
    | PuppeteerElementHandle<HTMLElement>
    | Promise<PuppeteerElementHandle<HTMLElement> | null>
    | null,
  options?: Options
): Promise<SuggestedSelector>;
async function suggestSelector(
  elementHandle: Locator,
  options?: Options
): Promise<SuggestedSelector>;
async function suggestSelector(
  elementHandle:
    | PlaywrightElementHandle<HTMLElement>
    | Promise<PlaywrightElementHandle<HTMLElement> | null>
    | PuppeteerElementHandle<HTMLElement>
    | Promise<PuppeteerElementHandle<HTMLElement> | null>
    | Locator
    | null,
  options?: Options
): Promise<SuggestedSelector> {
  const handle = await elementHandle;

  if (!handle) {
    throw new Error("Element doesn't exist");
  }

  return await (handle as PlaywrightElementHandle).evaluate(
    suggestSelectorFunction,
    options
  );
}

export default suggestSelector;
