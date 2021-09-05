import { VNode } from './types';

export function role(vNode: VNode) {
  return window.axe.commons.aria.getRole(vNode) || '';
}

export function name(vNode: VNode) {
  return window.axe.commons.text.accessibleTextVirtual(vNode);
}

export function value(vNode: VNode) {
  if (window.axe.commons.forms.isNativeSelect(vNode)) {
    const select = vNode.actualNode as HTMLSelectElement;
    const isMultiple = select.multiple;
    const options = Array.from(select.options);
    const selectedOptions = options.filter((option) => option.selected);
    const optionValues = selectedOptions.map((option) =>
      window.axe.commons.text.accessibleText(option)
    );
    return isMultiple ? optionValues : optionValues[0];
  }

  return window.axe.commons.text.formControlValue(vNode);
}

export function placeholder(vNode: VNode) {
  return window.axe.commons.text.nativeTextMethods.placeholderText(vNode);
}

export function selected(vNode: VNode, role: string) {
  if (vNode.props.nodeName === 'option') {
    return (vNode.actualNode as HTMLOptionElement).selected;
  }

  const allowedAttributes =
    window.axe.commons.aria.lookupTable.role[role]?.attributes.allowed;
  if (!allowedAttributes.includes('aria-selected')) {
    throw new Error(`"aria-selected" is not supported on role "${role}"`);
  }
  const selected = vNode.attr('aria-selected');
  return selected === 'true';
}

export function checked(vNode: VNode, role: string) {
  if (vNode.props.nodeName === 'input' && vNode.props.type === 'checkbox') {
    const checkboxElement = vNode.actualNode as HTMLInputElement;
    return checkboxElement.indeterminate ? 'mixed' : checkboxElement.checked;
  }

  const allowedAttributes =
    window.axe.commons.aria.lookupTable.role[role]?.attributes.allowed;
  if (!allowedAttributes.includes('aria-checked')) {
    throw new Error(`"aria-checked" is not supported on role "${role}"`);
  }
  const checked = vNode.attr('aria-checked');
  return checked === 'mixed' ? 'mixed' : checked === 'true';
}

export function disabled(vNode: VNode) {
  return window.axe.commons.forms.isDisabled(vNode);
}

export function level(vNode: VNode, role: string) {
  if (role !== 'heading') {
    return 0;
  }

  const [, levelString] = vNode.props.nodeName.match(/h(\d)/) || [];
  let level = parseInt(levelString, 10);
  if (!Number.isNaN(level)) {
    return level;
  }

  const ariaLevelString = vNode.attr('aria-level') || '';
  const ariaLevel = parseInt(ariaLevelString, 10);

  /*
   * default aria-level for a role=heading is 2 if it is
   * not set or set to an incorrect value.
   * @see https://www.w3.org/TR/wai-aria-1.1/#heading
   */
  if (Number.isNaN(ariaLevel) || ariaLevel < 1) {
    return 2;
  }

  return ariaLevel;
}

export function expanded(vNode: VNode, role: string) {
  const allowedAttributes =
    window.axe.commons.aria.lookupTable.role[role]?.attributes.allowed;
  if (!allowedAttributes.includes('aria-expanded')) {
    throw new Error(`"aria-expanded" is not supported on role "${role}"`);
  }
  const expanded = vNode.attr('aria-expanded');
  return expanded === 'true';
}

export function pressed(vNode: VNode, role: string) {
  const allowedAttributes =
    window.axe.commons.aria.lookupTable.role[role]?.attributes.allowed;
  if (!allowedAttributes.includes('aria-pressed')) {
    throw new Error(`"aria-pressed" is not supported on role "${role}"`);
  }
  const pressed = vNode.attr('aria-pressed');
  return pressed === 'true';
}
