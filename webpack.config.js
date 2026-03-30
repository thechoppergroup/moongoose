const { merge } = require('webpack-merge');
const path = require('path');
const config = require('./webpack.base');

module.exports = (env) => {
    return [
        merge(config(env), {
            entry: path.resolve(__dirname + '/src/wrapper.js'),
            output: {
                filename: 'moongoose.min.js',
                libraryTarget: 'window',
                library: 'Moongoose'
            }
        }),

        merge(config(env), {
            entry: path.resolve(__dirname + '/src/moongoose.vue'),
            output: {
                filename: 'moongoose.js',
                libraryTarget: 'umd',
                library: 'moongoose',
                umdNamedDefine: true
            },
            // [Vue 3 Migration — Phase 5.5] Externalize vue so moongoose uses the
            // consuming app's Vue instance instead of bundling its own copy.
            // This prevents duplicate Vue runtimes and keeps the bundle small.
            externals: {
                vue: {
                    commonjs: 'vue',
                    commonjs2: 'vue',
                    amd: 'vue',
                    root: 'Vue'
                }
            }
        }),

        merge(config(env), {
            entry: path.resolve(__dirname + '/src/preview.js'),
            output: {
                filename: 'preview.min.js',
                path: path.join(__dirname, 'docs'),
                libraryTarget: 'window',
                library: 'Preview'
            }
        })
    ];
};
