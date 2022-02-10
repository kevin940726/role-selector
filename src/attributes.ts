import { queryAllByRole, getNodeText } from '@testing-library/dom';
import { parentElementOrShadowHost } from './utils';

function getPlaceholder(element: HTMLElement): string | null {
  return (
    element.getAttribute('placeholder') ||
    element.getAttribute('aria-placeholder')
  );
}

function getValueText(
  element: HTMLElement,
  role: string
): string | string[] | null {
  // aria-valuetext: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuetext
  if (
    ['meter', 'scrollbar', 'separator', 'slider', 'spinbutton'].includes(role)
  ) {
    if (element.hasAttribute('aria-valuetext')) {
      return element.getAttribute('aria-valuetext');
    } else if (element.hasAttribute('aria-valuenow')) {
      return element.getAttribute('aria-valuenow');
    }
  }

  // aria-selected: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected
  if (['grid', 'listbox', 'tablist', 'tree', 'combobox'].includes(role)) {
    const isMultiSelectable =
      element.getAttribute('aria-multiselectable') === 'true' ||
      (element.tagName === 'SELECT' && element.hasAttribute('multiple'));

    const selectedOptions = ['gridcell', 'option', 'row', 'tab'].flatMap(
      (role) =>
        queryAllByRole(element, role, {
          selected: true,
        })
    );

    if (!selectedOptions.length) {
      return null;
    }

    if (selectedOptions.length === 1 || !isMultiSelectable) {
      return getNodeText(selectedOptions[0]);
    }

    return selectedOptions.map((option) => getNodeText(option));
  }

  // input or textarea
  if (['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return (element as HTMLInputElement | HTMLTextAreaElement).value;
  }

  // contenteditable or textbox
  if (element.isContentEditable || role === 'textbox') {
    return getNodeText(element);
  }

  return null;
}

// Copied and changed from https://github.com/microsoft/playwright/blob/b0cd5b1420741ce79c8ed74cab6dd20101011c7c/packages/playwright-core/src/server/injected/injectedScript.ts#L1227-L1255.
function getDisabled(element: HTMLElement): boolean {
  function hasDisabledFieldSet(element: HTMLElement | null): boolean {
    if (!element) {
      return false;
    }

    if (element.tagName === 'FIELDSET' && element.hasAttribute('disabled')) {
      return true;
    }

    // fieldset does not work across shadow boundaries
    return hasDisabledFieldSet(element.parentElement);
  }

  function hasAriaDisabled(element: Element | undefined): boolean {
    if (!element) {
      return false;
    }

    const attribute = (
      element.getAttribute('aria-disabled') || ''
    ).toLowerCase();

    if (attribute === 'true') {
      return true;
    } else if (attribute === 'false') {
      return false;
    }

    return hasAriaDisabled(parentElementOrShadowHost(element));
  }

  if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
    if (element.hasAttribute('disabled')) {
      return true;
    }
    if (hasDisabledFieldSet(element)) {
      return true;
    }
  }

  if (hasAriaDisabled(element)) {
    return true;
  }

  return false;
}

export { getPlaceholder, getValueText, getDisabled };
