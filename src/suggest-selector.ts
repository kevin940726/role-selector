import { getSuggestedQuery } from '@testing-library/dom';
// import * as attributeGetters from './attributes';
import roleSelector from './role-selector';

// const ATTRIBUTES_ORDER: (keyof typeof attributeGetters)[] = [
//   'name',
//   'value',
//   'level',
//   'disabled',
//   'placeholder',
//   'selected',
//   'checked',
//   'expanded',
//   'pressed',
// ];

function stringify(json: any, space?: number | string): string {
  return JSON.stringify(
    json,
    (_key, value) => (value instanceof RegExp ? value.toString() : value),
    space
  );
}

function suggestSelector(
  element: HTMLElement | null,
  options: { strict?: boolean } = {}
) {
  const { strict = true } = options;

  if (!element) {
    throw new Error('Element not found');
  }

  // Priority 1: Select by test ids
  {
    if (element.dataset.testid) {
      return {
        type: 'css',
        selector: `[data-testid=${JSON.stringify(element.dataset.testid)}]`,
      };
    } else if (element.dataset.testId) {
      return {
        type: 'css',
        selector: `[data-test-id=${JSON.stringify(element.dataset.testId)}]`,
      };
    } else if (element.dataset.test) {
      return {
        type: 'css',
        selector: `[data-test=${JSON.stringify(element.dataset.test)}]`,
      };
    }
  }

  const suggestedQuery = getSuggestedQuery(element, 'get', 'Role');

  if (suggestedQuery) {
    // Priority 2: Select by roles and aria attributes
    const checkSelector = (selector: string) => {
      const selectedElements = roleSelector.queryAll(
        element.ownerDocument.documentElement,
        selector
      );
      if (!selectedElements.length) return false;
      else if (strict && selectedElements.length > 1) return false;
      return selectedElements[0] === element;
    };

    const [role, attributes] = suggestedQuery.queryArgs;

    const attributesSelector = Object.entries(attributes || {})
      .map(
        ([key, value]) =>
          `[${key}=${
            value instanceof RegExp ? value.toString() : JSON.stringify(value)
          }]`
      )
      .join('');

    let selector = `${role}${attributesSelector}`;
    if (checkSelector(selector)) {
      return { type: 'role', selector };
    }

    throw new Error(`Unable to find accessible selector for this element. Consider using text selector or CSS selector instead.
Parsed attributes:
${stringify({ role, ...attributes }, 2)}`);
  }

  // Priority 4: Select by ids
  {
    if (element.id) {
      return { type: 'css', selector: `#${element.id}` };
    }
  }

  throw new Error(`Unable to find suggested selector for this element.`);
}

export default suggestSelector;
