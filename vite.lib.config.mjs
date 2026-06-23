import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const r = (...p) => path.resolve(__dirname, ...p);

// Vite 8 library build for the moongoose icon component. Replaces the old
// webpack UMD build (webpack.config.js). Emits BOTH:
//   - dist/moongoose.js  (UMD, keeps the `main` entry — drop-in for webpack /
//     script-tag / Rollup-CJS consumers; attaches to window.moongoose)
//   - dist/moongoose.mjs (clean ESM for the `module`/`exports` entry — Vite
//     consumers resolve this; it imports named symbols from 'vue' with no
//     require()/default, which is what lets moonscape/moonshine drop their old
//     `requireReturnsDefault: vue→namespace` commonjs interop.)
// vue is externalized (consuming app provides it) — no duplicate Vue runtime.
//
// Prereq: `node scripts/svg-to-module.js` must have generated src/icons_all.js
// (the icon name → SVG string map the component reads). The build script runs it.

// Inline the SFC's <style lang="scss"> into the JS bundle, matching the old
// webpack style-loader behavior so consumers need no separate CSS import.
// (Same approach as moonshine's vite.config.lib.mjs.)
function cssInjectedByJs() {
    return {
        name: 'moongoose-css-injected-by-js',
        apply: 'build',
        enforce: 'post',
        generateBundle(_opts, bundle) {
            let css = '';
            for (const key of Object.keys(bundle)) {
                const asset = bundle[key];
                if (asset.type === 'asset' && key.endsWith('.css')) {
                    css += typeof asset.source === 'string' ? asset.source : Buffer.from(asset.source).toString('utf8');
                    delete bundle[key];
                }
            }
            if (!css) return;
            const entry = Object.values(bundle).find((c) => c.type === 'chunk' && c.isEntry);
            if (!entry) return;
            const injector =
                '(function(){try{var s=document.createElement("style");' +
                's.setAttribute("type","text/css");s.textContent=' +
                JSON.stringify(css) +
                ';(document.head||document.documentElement).appendChild(s);}' +
                'catch(e){console.error("moongoose css inject failed",e);}})();\n';
            entry.code = injector + entry.code;
        }
    };
}

export default defineConfig({
    publicDir: false,
    resolve: {
        extensions: ['.mjs', '.js', '.json', '.vue'],
        alias: { Moongoose: r('src') }
    },
    plugins: [vue(), cssInjectedByJs()],
    build: {
        // Pin the explicit browser list (Vite's pre-7 'modules' default expansion);
        // see memory vite7-modules-target-removed. Consumers re-transpile downstream.
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        sourcemap: true,
        cssCodeSplit: false,
        emptyOutDir: true,
        lib: {
            entry: r('src/index.js'),
            name: 'moongoose', // UMD global
            formats: ['es', 'umd'],
            fileName: (format) => (format === 'es' ? 'moongoose.mjs' : 'moongoose.js')
        },
        rollupOptions: {
            external: ['vue'],
            output: { globals: { vue: 'Vue' } }
        }
    }
});
