import type { Options } from 'tsdown'

const env = process.env.NODE_ENV

export default {
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['esm'],
  minify: false,
  unbundle: true,
  deps: { skipNodeModulesBundle: true },
  entry: ['index.ts', 'components/*.{ts,tsx}'],
  watch: env === 'development',
  target: 'es2020',
  outDir: 'dist',
} satisfies Options
