import queries from './role-selector';

export const query = queries.query;
export const queryAll = queries.queryAll;
export { default as suggestSelector } from './suggest-selector';

export function getAll(root: Element, selector: string) {
  const elements = queryAll(root, selector);

  if (elements.length === 0) {
    throw new Error(
      `Unable to find any elements with the selector "${selector}"`
    );
  }

  return elements;
}

export function get(root: Element, selector: string) {
  const elements = getAll(root, selector);

  if (elements.length > 1) {
    throw new Error(`Found multiple elements with the selector "${selector}"`);
  }

  return elements[0];
}

export function within(root: Element) {
  return {
    query: query.bind(root),
    queryAll: queryAll.bind(root),
    get: get.bind(root),
    getAll: getAll.bind(root),
  };
}
