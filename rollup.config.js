import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser,
      format: 'umd',
    },
    name: 'capturePdfText',
    plugins: [
      resolve({
        preferBuiltins: true,
      }), // so Rollup can find dependencies
      builtins(), // so Rollup can include node global depencencies
      commonjs(), // so Rollup can convert dependencies to an ES module
      babel({
        exclude: 'node_modules/**', // only transpile our source code
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/main.js',
    external: [
      'lodash/fp/orderBy',
      'lodash/fp/flatten',
      'lodash/fp/trimEnd',
      'lodash/fp/trimStart',
      'lodash/fp/conforms',
      'lodash/fp/isNumber',
      'lodash/fp/isString',
      'lodash/fp/isObject',
      'lodash/fp/flow',
      'lodash/fp/get',
      'lodash/fp/uniq',
      'lodash/fp/curry',
      'lodash/fp/isFunction',
      'lodash/mapValues',
      'lodash/without',
      'lodash/fp/isEqual',
      'lodash/fp/map',
      'lodash/fp/reject',
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**', // only transpile our source code
      }),
    ],
  },
]
