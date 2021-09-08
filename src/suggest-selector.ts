import * as attributeGetters from './attributes';
import roleSelector from './role-selector';
import { flattenVNodes } from './utils';

const ATTRIBUTES_ORDER: (keyof typeof attributeGetters)[] = [
  'name',
  'value',
  'level',
  'disabled',
  'placeholder',
  'selected',
  'checked',
  'expanded',
  'pressed',
];

function suggestSelector(
  element: HTMLElement | null,
  options: { strict?: boolean } = {}
) {
  const { strict = true } = options;

  if (!element) {
    throw new Error('Element not found');
  }

  // Priority 1: Select by test ids.
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

  // Priority 2: Select by ids.
  {
    if (element.id) {
      return { type: 'css', selector: `#${element.id}` };
    }
  }

  // Make sure axe is injected.
  if (!window.axe) {
    throw new Error('Axe is not injected');
  }

  const rootVNode = window.axe.setup(element.ownerDocument);
  const vNodes = flattenVNodes(rootVNode);
  const vNode = vNodes.find((node) => node.actualNode === element)!;

  const { role: getRole, ...ariaAttributeGetters } = attributeGetters;

  const role = getRole(vNode);

  if (!role) {
    throw new Error(
      `Unable to compute aria role for this element. Consider using other selectors like text selector or CSS selector instead.`
    );
  }

  // Priority 3: Select by roles and aria attributes.
  const attributeEntries = Object.entries(ariaAttributeGetters).map(
    ([attributeKey, getAttribute]) => {
      try {
        return [attributeKey, getAttribute(vNode, role)];
      } catch (err) {
        return [attributeKey, null];
      }
    }
  );
  const attributes: {
    [Key in keyof typeof ariaAttributeGetters]: ReturnType<
      typeof ariaAttributeGetters[Key]
    >;
  } = Object.fromEntries(attributeEntries.filter(([_key, value]) => value));
  window.axe.teardown();

  const checkSelector = (selector: string) => {
    const selectedElements = roleSelector.queryAll(
      element.ownerDocument.documentElement,
      selector
    );
    if (!selectedElements.length) return false;
    else if (strict && selectedElements.length > 1) return false;
    return selectedElements[0] === element;
  };

  let selector = role;
  for (const attributeKey of ATTRIBUTES_ORDER) {
    const attribute = attributes[attributeKey as keyof typeof attributes];
    const serializedAttribute =
      typeof attribute === 'string' ? JSON.stringify(attribute) : attribute;

    if (attribute) {
      const selectorCandidate =
        selector +
        (serializedAttribute === true
          ? `[${attributeKey}]`
          : `[${attributeKey}=${serializedAttribute}]`);
      if (checkSelector(selectorCandidate)) {
        return { type: 'role', selector: selectorCandidate };
      }
      selector = selectorCandidate;
    }
  }

  throw new Error(`Unable to find accessible selector for this element.
Parsed attributes:
${JSON.stringify({ role, ...attributes }, null, 2)}`);
}

export default suggestSelector;
