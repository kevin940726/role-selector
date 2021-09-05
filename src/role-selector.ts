import parse, { NOOP } from './parse';
import * as attributeGetters from './attributes';
import { VNode } from './types';

// Conditionally evaluate axe script
if (!window.axe) {
  require('axe-core');
}

function is(
  value: string | number | boolean,
  attrValue: string | number | boolean | RegExp
): boolean {
  if (attrValue instanceof RegExp) {
    const valueAsString = value.toString();
    return !!valueAsString.match(attrValue);
  }

  return Object.is(value, attrValue);
}

function flattenVNodes(vNode: VNode): VNode[] {
  return [vNode, ...vNode.children.flatMap((child) => flattenVNodes(child))];
}

function queryAll(root: Element, selector: string) {
  // This noop token is used for library's internals to inject axe
  // into the frame without having to select anything.
  if (selector === NOOP) {
    return [];
  }

  const { role, attributes } = parse(selector);

  function filter(vNode: VNode) {
    return [
      role === '*' || attributeGetters.role(vNode) === role,
      ...attributes.map((attribute) => {
        if (
          !Object.prototype.hasOwnProperty.call(
            attributeGetters,
            attribute.name
          )
        ) {
          throw new Error(`Unsupported attribute ${attribute.name}`);
        }

        const getAttribute =
          attributeGetters[attribute.name as keyof typeof attributeGetters];
        const value = getAttribute(vNode, role);

        if (Array.isArray(value)) {
          return value.some((value) => is(value, attribute.value));
        }

        return is(value, attribute.value);
      }),
    ].every(Boolean);
  }

  const rootVNode = window.axe.setup(root);
  const vNodes = flattenVNodes(rootVNode);
  const vNodesWithActualNode = vNodes.filter((vNode) => vNode.actualNode);
  const matchedVNodes = vNodesWithActualNode.filter(filter);
  const nodes = matchedVNodes.map((vNode) => vNode.actualNode);
  window.axe.teardown();
  return nodes;
}

function query(root: Element, selector: string) {
  return queryAll(root, selector)[0] || null;
}

export default {
  query,
  queryAll,
};
