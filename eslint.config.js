import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import sonarjs from 'eslint-plugin-sonarjs'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        files: ['src/**/*.{ts,js}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                // enable type-aware linting without hardcoding tsconfig path
                projectService: true
            },
            globals: {
                chrome: 'readonly',
            }
        },
        plugins: { '@typescript-eslint': ts, sonarjs, 'simple-import-sort': simpleImportSort },
        rules: {
            // import sorting
            'simple-import-sort/imports': ['error', {
                groups: [
                    // side effects
                    ['^\u0000'],
                    // node builtins
                    ['^node:', `^(${['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'http2', 'https', 'inspector', 'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'].join('|')})(/|$)`],
                    // packages
                    ['^@?\\w'],
                    // absolute aliases
                    ['^@/', '^@calendar/', '^@templates/'],
                    // relative
                    ['^\./?'],
                ]
            }],
            'simple-import-sort/exports': 'error',
            ...js.configs.recommended.rules,
            // TS-aware: disable JS no-undef and rely on TS
            'no-undef': 'off',
            'no-unused-vars': 'off',
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'max-lines': ['error', { max: 175, skipBlankLines: true, skipComments: true }],
            // complexity & nesting
            'max-depth': ['error', 3],
            'complexity': ['error', 10],
            'sonarjs/cognitive-complexity': ['error', 15],
            'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
            'max-statements': ['warn', 30],
            'no-else-return': 'error',
            'no-lonely-if': 'error',
            // formatting
            'semi': ['error', 'never'],
            'semi-style': ['error', 'last'],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' }
            ],
            'no-console': 'off',
            // highlight deprecated APIs (TS-aware)
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        }
    },
    {
        files: ['src/**/*.test.ts'],
        rules: {
            'max-lines': 'off',
            'max-lines-per-function': 'off',
            // allow using deprecated DOM APIs in tests when emulating events
            '@typescript-eslint/no-deprecated': 'off'
        }
    }
];


