import type { Selectors } from 'playwright';

export function setup(this: Selectors | void, selectorName: string = 'role') {
  const selectors = this || require('playwright').selectors;

  selectors.register(selectorName, {
    path: require.resolve('../eval'),
  });
}

export { default as suggestSelector } from './suggest-selector.backend';
