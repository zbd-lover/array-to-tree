import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const extensions = ['.js']

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
)

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
].map(name => RegExp(`^${name}($|/)`))

console.log(external)

export default defineConfig([
  // CommonJS
  {
    input: './src/index.js',
    output: { file: 'lib/array-to-tree.js', format: 'cjs', indent: false },
    external,
    plugins: [
      nodeResolve({
        extensions
      }),
      babel({
        extensions,
        plugins: [
          ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
        ],
        babelHelpers: 'runtime'
      })
    ]
  },

  // ES
  {
    input: './src/index.js',
    output: { file: 'es/array-to-tree.js', format: 'es', indent: false },
    external,
    plugins: [
      commonjs(),
      nodeResolve({
        extensions
      }),
      babel({
        extensions,
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            { version: babelRuntimeVersion, useESModules: true }
          ],
        ],
        babelHelpers: 'runtime'
      })
    ]
  },

  // ES for Browsers
  {
    input: './src/index.js',
    output: { file: 'es/array-to-tree.mjs', format: 'es', indent: false },
    external,
    plugins: [
      commonjs(),
      nodeResolve({
        extensions
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled'
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  },

  // UMD Development
  {
    input: './src/index.js',
    output: {
      file: 'dist/array-to-tree.js',
      format: 'umd',
      name: 'ATT',
      indent: false,
      exports: 'named'
    },
    plugins: [
      commonjs(),
      nodeResolve({
        extensions
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: './src/index.js',
    output: {
      file: 'dist/array-to-tree.min.js',
      format: 'umd',
      name: 'ATT',
      indent: false,
      exports: 'named'
    },
    plugins: [
      commonjs(),
      nodeResolve({
        extensions
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  }
])