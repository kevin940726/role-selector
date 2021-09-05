import { ElementHandle } from 'playwright';
import * as attributeGetters from './attributes';
import { NOOP } from './parse';

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

async function suggestSelector(
  elementHandle:
    | ElementHandle<Element>
    | null
    | Promise<ElementHandle<Element>>
    | Promise<null>,
  options: { strict?: boolean } = {}
) {
  const { strict = false } = options;

  const handle = await elementHandle;

  if (!handle) {
    throw new Error('Element not found');
  }

  const frame = await handle.ownerFrame();

  if (!frame) {
    throw new Error('Element not attached to a frame');
  }

  // Priority 1: Select by test ids.
  const testIdSelector = await handle.evaluate((node: HTMLElement) => {
    if (node.dataset.testid) {
      return `data-testid="${node.dataset.testid}"`;
    } else if (node.dataset.testId) {
      return `data-test-id="${node.dataset.testId}"`;
    } else if (node.dataset.test) {
      return `data-test="${node.dataset.test}"`;
    }
    return null;
  });
  if (testIdSelector) {
    return testIdSelector;
  }

  // Priority 2: Select by ids.
  const id = await handle.evaluate((node) => node.id);
  if (id) {
    return `id="${id}"`;
  }

  // Make sure axe is injected.
  await frame.$(`role=${NOOP}`);

  const vNode = await handle.evaluateHandle((node) => window.axe.setup(node));

  const { role: getRole, ...ariaAttributeGetters } = attributeGetters;

  const role = await vNode.evaluate(getRole);

  if (!role) {
    throw new Error(
      `Unable to compute aria role for this element. Consider using other selectors like text selector or CSS selector instead.`
    );
  }

  // Priority 3: Select by roles and aria attributes.
  const attributePromiseEntries = Object.entries(ariaAttributeGetters).map(
    async ([attributeKey, getAttribute]) => {
      try {
        return [
          attributeKey,
          (await vNode.evaluate(getAttribute, role)) as ReturnType<
            typeof getAttribute
          >,
        ];
      } catch (err) {
        return [attributeKey, null];
      }
    }
  );
  const attributeEntries = await Promise.all(attributePromiseEntries);
  const attributes: {
    [Key in keyof typeof ariaAttributeGetters]: ReturnType<
      typeof ariaAttributeGetters[Key]
    >;
  } = Object.fromEntries(attributeEntries.filter(([_key, value]) => value));
  await frame.evaluate(() => window.axe.teardown());

  const checkSelector = async (selector: string) => {
    const selectedElement = await frame.$(selector, { strict });
    if (!selectedElement) return false;
    const isEqual = await handle.evaluate(
      (node, target) => node === target,
      selectedElement
    );
    return isEqual;
  };

  let selector = `role=${role}`;
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
      if (await checkSelector(selectorCandidate)) {
        return selectorCandidate;
      }
      selector = selectorCandidate;
    }
  }

  throw new Error(`Unable to find accessible selector for this element.
Parsed attributes:
${JSON.stringify({ role, ...attributes }, null, 2)}`);
}

export default suggestSelector;
