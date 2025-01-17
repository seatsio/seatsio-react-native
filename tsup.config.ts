import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: false,
  sourcemap: env === 'prod',
  clean: true,
  dts: true,
  format: ['esm'],
  minify: env === 'production',
  bundle: env === 'production',
  skipNodeModulesBundle: true,
  entryPoints: ['index.ts'],
  watch: env === 'development',
  target: 'es2020',
  outDir: env === 'production' ? 'dist' : 'lib',
  entry: ['index.ts', 'components/*.(ts|tsx)'],
}