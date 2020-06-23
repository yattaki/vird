import strip from '@rollup/plugin-strip'
import typescript from '@rollup/plugin-typescript'
import { exec } from 'child_process'
import { terser } from 'rollup-plugin-terser'
import { name } from './package.json'

function types(options) {
  return {
    name: 'types',
    buildStart() {
      exec(`tsc --emitDeclarationOnly --declaration --outDir ${options.dir}`)
    }
  }
}

const input = 'src/index.ts'

const plugins = [typescript({ noEmitOnError: false })]

const releasePlugins = [
  typescript({ noEmitOnError: false }),
  terser(),
  strip({ include: '**/*.ts', functions: ['console.*', 'assert.*', 'dev.*'] }),
  types({ dir: 'dist' })
]

export default [
  {
    plugins,
    input,
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        name,
        file: 'dist/index.iife.js',
        format: 'iife',
        sourcemap: true
      },
      {
        name,
        file: 'dist/index.umd.js',
        format: 'umd',
        sourcemap: true
      }
    ]
  },
  {
    plugins: releasePlugins,
    input,
    output: [
      {
        file: 'dist/index.min.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.min.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        name,
        file: 'dist/index.iife.min.js',
        format: 'iife',
        sourcemap: true
      },
      {
        name,
        file: 'dist/index.umd.min.js',
        format: 'umd',
        sourcemap: true
      }
    ]
  }
]
