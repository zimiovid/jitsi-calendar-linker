import { defineConfig } from 'vitest/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{ts,js}'],
            exclude: [
                'src/assets/**',
                'src/templates/**',
                'dist/**',
                // entrypoints and barrels without unit value
                'src/main.ts',
                'src/options.ts',
                'src/popup.ts',
                'src/calendar/index.ts',
                'src/calendar/google/v1/index.ts',
                'src/calendar/google/v2/index.ts'
            ]
        }
    },
    assetsInclude: ['**/*.html'],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@calendar': resolve(__dirname, 'src/calendar'),
            '@templates': resolve(__dirname, 'src/templates')
        }
    }
})
