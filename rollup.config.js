import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

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

const basePlugins = [resolve(), commonjs()];
const evalPlugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  }),
  terser({
    compress: {
      negate_iife: false,
      expression: true,
    },
  }),
];

export default [
  // CommonJS (Node)
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    plugins: basePlugins,
  },
  {
    input: 'dist/playwright.js',
    output: {
      file: 'dist/playwright.cjs',
      format: 'cjs',
    },
    plugins: basePlugins,
  },
  {
    input: 'dist/puppeteer.js',
    output: {
      file: 'dist/puppeteer.cjs',
      format: 'cjs',
    },
    plugins: basePlugins,
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
    plugins: basePlugins,
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
    plugins: [...basePlugins, ...evalPlugins],
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
    plugins: [...basePlugins, ...evalPlugins],
  },
];
