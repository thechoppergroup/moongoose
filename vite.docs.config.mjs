import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const r = (...p) => path.resolve(__dirname, ...p);

// Vite 8 docs site (replaces the old webpack + browser-sync `serve`/`build-docs`).
// `npm run serve` runs the dev server against the root index.html (which loads
// src/preview.js → Docs/index.vue); `npm run build-docs` builds it to docs/.
// The logo lives in public/ and is served at /moon_goose_logo.svg.
// Prereq: scripts/svg-to-module.js generates src/icons_all.js (the scripts run it).
export default defineConfig({
    root: __dirname,
    publicDir: r('public'),
    resolve: {
        extensions: ['.mjs', '.js', '.json', '.vue'],
        alias: {
            Moongoose: r('src'),
            Docs: r('src/docs')
        }
    },
    plugins: [vue()],
    build: {
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        outDir: r('docs'),
        emptyOutDir: true,
        sourcemap: true
    }
});
