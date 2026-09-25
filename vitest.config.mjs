import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const r = (...p) => path.resolve(__dirname, ...p);

// Unit + component tests (tests/README.md). Mirrors moonshine's vitest setup:
// jsdom, ambient globals, a separate tests/ tree, imports through the Moongoose alias.
export default defineConfig({
    root: __dirname,
    resolve: {
        extensions: ['.mjs', '.js', '.json', '.vue'],
        alias: { Moongoose: r('src') }
    },
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tests/**/*.test.js'],
        exclude: ['**/node_modules/**'],
        restoreMocks: true,
        // JUnit/JSON are for CI; `reports/` is gitignored.
        reporters: ['default', ['junit', { outputFile: 'reports/vitest-junit.xml' }], ['json', { outputFile: 'reports/vitest.json' }]]
    }
});
