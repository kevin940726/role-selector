import { VNode } from './types';

function is(
  value: string | number | boolean,
  attrValue: string | number | boolean | RegExp,
  caseSensitive?: boolean
): boolean {
  if (attrValue instanceof RegExp) {
    const valueAsString = value.toString();
    return !!valueAsString.match(attrValue);
  }

  if (
    caseSensitive === false &&
    typeof attrValue === 'string' &&
    typeof value === 'string'
  ) {
    return Object.is(value.toLowerCase(), attrValue.toLowerCase());
  }

  return Object.is(value, attrValue);
}

function flattenVNodes(vNode: VNode): VNode[] {
  return [vNode, ...vNode.children.flatMap((child) => flattenVNodes(child))];
}

function findVNode(
  rootVNode: VNode,
  targetElement: Element | Document
): VNode | undefined {
  // The target element is a Document, returns the root vNode
  if (!targetElement.ownerDocument) {
    return rootVNode;
  }

  if (rootVNode.actualNode === targetElement) {
    return rootVNode;
  }

  for (const child of rootVNode.children) {
    const vNode = findVNode(child, targetElement);
    if (vNode) {
      return vNode;
    }
  }
}

export { is, flattenVNodes, findVNode };
