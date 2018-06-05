const merge = require('webpack-merge');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
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
        entry: path.resolve(__dirname + '/src/wrapper.js'),
        output: {
            filename: 'moongoose.js',
            libraryTarget: 'umd',
            library: 'moongoose',
            umdNamedDefine: true
        }
    })
];
