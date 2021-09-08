import parse from './parse';
import * as attributeGetters from './attributes';
import { VNode } from './types';
import { flattenVNodes, is, findVNode } from './utils';

// Conditionally evaluate axe script
if (!window.axe) {
  require('axe-core');
}

function queryAll(root: Element | Document, selector: string) {
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

  const rootElement = root.ownerDocument
    ? root.ownerDocument.documentElement
    : root;
  // Always parse the whole DOM to form the accurate AOM
  const rootVNode = window.axe.setup(rootElement);
  const targetVNode = findVNode(rootVNode, root)!;
  const vNodes = flattenVNodes(targetVNode);
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
