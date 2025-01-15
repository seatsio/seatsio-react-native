// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    ignores: [
        './release.mjs'
    ],
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        }
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    }
  }
);