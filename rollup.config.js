import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

function iifeOutputPlugin() {
  return {
    name: 'iife-output-plugin',
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

export default {
  input: 'dist/role-selector.js',
  output: {
    file: 'dist/playwright.js',
    format: 'iife',
    globals: {
      crypto: 'crypto',
    },
    plugins: [iifeOutputPlugin()],
  },
  plugins: [resolve(), commonjs()],
};
