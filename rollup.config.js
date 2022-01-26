import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

function iifeEvalOutputPlugin() {
  return {
    name: 'iife-eval-output-plugin',
    generateBundle(options, bundle) {
      for (const file of Object.values(bundle)) {
        file.code = file.code.trimEnd();
        if (file.code.endsWith(';')) {
          file.code = file.code.slice(0, -1);
        }
      }
    },
  };
}

export default [
  // CommonJS (Node)
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'dist/playwright.js',
    output: {
      file: 'dist/playwright.cjs',
      format: 'cjs',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'dist/puppeteer.js',
    output: {
      file: 'dist/puppeteer.cjs',
      format: 'cjs',
    },
    plugins: [resolve(), commonjs()],
  },
  // UMD (Browsers)
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/browser.js',
      name: 'roleSelector',
      format: 'umd',
      globals: {
        crypto: 'crypto',
      },
    },
    plugins: [resolve(), commonjs()],
  },
  // IIFE eval (injected)
  {
    input: 'dist/role-selector.js',
    output: {
      file: 'dist/role-selector.eval.js',
      format: 'iife',
      globals: {
        crypto: 'crypto',
      },
      plugins: [iifeEvalOutputPlugin()],
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'dist/suggest-selector.js',
    output: {
      file: 'dist/suggest-selector.eval.js',
      format: 'iife',
      globals: {
        crypto: 'crypto',
      },
      plugins: [iifeEvalOutputPlugin()],
    },
    plugins: [resolve(), commonjs()],
  },
];
