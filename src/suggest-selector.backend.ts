import fs from 'fs';

interface SuggestedSelector {
  type: 'css' | 'role';
  selector: string;
}

interface SuggestSelectorOptions {
  strict: boolean;
}

const suggestSelectorScript = fs.readFileSync(
  new URL('../dist/suggest-selector.eval.js', import.meta.url)
);
const suggestSelectorFunction = (new Function(
  'element',
  'options',
  `return ${suggestSelectorScript}(element, options);`
) as any) as (
  element: Element,
  options?: SuggestSelectorOptions
) => SuggestedSelector;

export { suggestSelectorFunction, SuggestedSelector, SuggestSelectorOptions };
