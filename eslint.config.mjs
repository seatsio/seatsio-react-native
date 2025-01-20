// @ts-check
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
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
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/quotes': ['error', 'single'],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    }
).concat({
    ignores: [
        'dist/',
        'lib/',
        'example/metro.config.js',
        'release.mjs',
        '*.config.ts'
    ],
})