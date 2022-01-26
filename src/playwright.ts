import { createRequire } from 'module';
import type { ElementHandle, Locator } from 'playwright';
import { suggestSelectorFunction } from './suggest-selector.backend';
import type {
  SuggestedSelector,
  SuggestSelectorOptions,
} from './suggest-selector.backend';

const require = createRequire(import.meta.url);

const selectorScript = {
  path: require.resolve('../eval'),
};

async function suggestSelector(
  elementHandle: ElementHandle | Locator | Promise<ElementHandle | null> | null,
  options?: SuggestSelectorOptions
): Promise<SuggestedSelector> {
  const handle = await elementHandle;

  if (!handle) {
    throw new Error("Element doesn't exist");
  }

  return await (handle as ElementHandle).evaluate(
    suggestSelectorFunction,
    options
  );
}

export { selectorScript, suggestSelector, SuggestedSelector };
