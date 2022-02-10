import { configure, queryAllByRole } from '@testing-library/dom';
import parse from './parse';
import { getDisabled, getPlaceholder, getValueText } from './attributes';
import { is } from './utils';

configure({
  computedStyleSupportsPseudoElements: true,
});

const ALLOWED_CURRENT_VALUES = [
  'page',
  'step',
  'location',
  'date',
  'time',
] as const;
type AllowedCurrentValues = typeof ALLOWED_CURRENT_VALUES[number];

const ALLOWED_ATTRIBUTES = [
  'name',
  'pressed',
  'expanded',
  'selected',
  'checked',
  'level',
  'current',
  'placeholder',
  'valuetext',
  'disabled',
] as const;
type AllowedAttributes = typeof ALLOWED_ATTRIBUTES[number];

const attributeValidators: Partial<
  Record<AllowedAttributes, (value: unknown) => true | string>
> = {
  level: (value) =>
    [1, 2, 3, 4, 5, 6].includes(value as number) ||
    `"level" can only be one of [1, 2, 3, 4, 5, 6], received \`${JSON.stringify(
      value
    )}\``,
  current: (value) =>
    typeof value === 'boolean' ||
    (typeof value === 'string' &&
      ALLOWED_CURRENT_VALUES.includes(value as AllowedCurrentValues)) ||
    `"level" can only be one of [true, false, ${ALLOWED_CURRENT_VALUES.join(
      ', '
    )}], received \`${JSON.stringify(value)}\``,
};

function queryAll(root: Element | Document, selector: string) {
  const { role, attributes } = parse(selector);

  const disallowedAttributes = attributes.filter(
    (attribute) =>
      !ALLOWED_ATTRIBUTES.includes(attribute.name as AllowedAttributes)
  );
  if (disallowedAttributes.length) {
    throw new Error(
      `Unsupported attribute${
        disallowedAttributes.length > 1 ? 's' : ''
      } ${disallowedAttributes
        .map((attribute) => `"${attribute.name}"`)
        .join(', ')} in selector \`${selector}\``
    );
  }

  for (const attribute of attributes) {
    if (attributeValidators.hasOwnProperty(attribute.name)) {
      const validate = attributeValidators[attribute.name as AllowedAttributes];
      const validation = validate!(attribute.value);

      if (validation !== true) {
        throw new Error(
          `Unexpected value in selector \`${selector}\`: ${validation}`
        );
      }
    }
  }

  const rootElement =
    root instanceof Document ? root.documentElement : (root as HTMLElement);

  const options = Object.fromEntries(
    attributes.map((attribute) => [attribute.name, attribute.value])
  );

  let elements = queryAllByRole(rootElement, role, options);

  if (typeof options.placeholder !== 'undefined') {
    elements = elements.filter((element) =>
      is(getPlaceholder(element), options.placeholder)
    );
  }

  if (typeof options.valuetext !== 'undefined') {
    elements = elements.filter((element) => {
      const values = getValueText(element, role);
      return Array.isArray(values)
        ? values.some((value) => is(value, options.valuetext))
        : is(values, options.valuetext);
    });
  }

  if (typeof options.disabled !== 'undefined') {
    elements = elements.filter((element) =>
      is(getDisabled(element), options.disabled)
    );
  }

  return elements;
}

function query(root: Element, selector: string) {
  return queryAll(root, selector)[0] || null;
}

export default {
  query,
  queryAll,
};
