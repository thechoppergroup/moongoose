const merge = require('webpack-merge');
const path = require('path');
const config = require('./webpack.base');

module.exports = [
    merge(config, {
        entry: path.resolve(__dirname + '/src/wrapper.js'),
        output: {
            filename: 'moongoose.min.js',
            libraryTarget: 'window',
            library: 'Moongoose'
        }
    }),

    merge(config, {
        entry: path.resolve(__dirname + '/src/moongoose.vue'),
        output: {
            filename: 'moongoose.js',
            libraryTarget: 'umd',
            library: 'moongoose',
            umdNamedDefine: true
        }
    }),

    merge(config, {
        entry: path.resolve(__dirname + '/src/preview.js'),
        output: {
            filename: 'preview.min.js',
            path: path.join(__dirname, 'docs'),
            libraryTarget: 'window',
            library: 'Preview'
        }
    })
];
