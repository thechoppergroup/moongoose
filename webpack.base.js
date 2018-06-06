const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    output: {
        path: path.join(__dirname, 'dist'),
    },
    mode: 'development',
    devtool: 'source-map', // 'cheap-module-eval-source-map', 'inline-source-map'
    devServer: {
        watchContentBase: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    scss: 'vue-style-loader!css-loader!sass-loader?'
                }
            }
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader"
            }]
        }]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};