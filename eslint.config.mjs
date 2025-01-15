// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint';
import globals from 'globals'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        plugins: {
            '@stylistic': stylistic
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@stylistic/indent': ['error', 4]
        },
    }
).concat({
    ignores: ['release.mjs'],
})