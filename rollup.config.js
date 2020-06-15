import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { name } from './package.json'

const plugins = [
  typescript({ noEmitOnError: false }),
  resolve()
]

export default {
  plugins,
  input: 'src/index.ts',
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
    },
    {
      file: 'dist/index.min.js',
      format: 'es',
      plugins: [terser()]
    },
    {
      file: 'dist/index.cjs.min.js',
      format: 'cjs',
      plugins: [terser()]
    },
    {
      name,
      file: 'dist/index.iife.min.js',
      format: 'iife',
      plugins: [terser()]
    },
    {
      name,
      file: 'dist/index.umd.min.js',
      format: 'umd',
      plugins: [terser()]
    }
  ]
}
