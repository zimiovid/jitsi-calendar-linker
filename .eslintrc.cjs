// ESLint config for extension content scripts (browser environment)
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/strict',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
        'no-var': 'error',
        'prefer-const': ['error', { destructuring: 'all' }],
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all']
    },
    ignorePatterns: ['dist/**', 'node_modules/**']
};


