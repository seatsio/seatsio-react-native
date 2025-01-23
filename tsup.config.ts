import type { Options } from 'tsup'

const env = process.env.NODE_ENV
const isProd = env === 'production'

export const tsup: Options = {
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm'],
  minify: false,
  bundle: false,
  skipNodeModulesBundle: true,
  entryPoints: ['index.ts'],
  watch: env === 'development',
  target: 'es2020',
  outDir: 'dist',
  entry: ['index.ts', 'components/*.(ts|tsx)'],
}