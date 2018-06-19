const config = require('./webpack.base');
const merge = require('webpack-merge');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = merge(config, {
    entry: path.resolve(__dirname + '/demo/src/main.js'),
    output: {
        path: path.join(__dirname, 'demo'),
        filename: 'app.min.js',
        libraryTarget: 'window',
        library: 'Moongoose'
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['demo'] }
        })
    ]
});


