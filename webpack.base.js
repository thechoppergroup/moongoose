const { merge } = require('webpack-merge')
const path = require('path');
// [Vue 3 Migration] vue-loader 17 exports VueLoaderPlugin from the package root
const { VueLoaderPlugin } = require('vue-loader');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env) => {

    console.log('Environment:', env);

    let plugins = [ new VueLoaderPlugin() ];

    if(env && env.disable !== 'browser-sync') {
        console.log('adding browser-sync plugin')
        plugins.push( new BrowserSyncPlugin({
            port: 3000,
            host: 'localhost',
            server: { baseDir: ['docs'] }
        }));
    } else {
        console.log('disabling browser-sync plugin');
    }

    return {
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
                // options: {
                //     presets: ['es2015']
                // }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                // [Vue 3 Migration — Phase 5.5] Native Vue 3 template compilation.
            // compatConfig removed — templates compile natively.
            }, {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },{
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
        resolve: {
            alias: {
                // [Vue 3 Migration — Phase 5.5] Native Vue 3 — @vue/compat removed.
                Docs: path.resolve(__dirname, 'src/docs/'),
                Moongoose: path.resolve(__dirname, 'src')
            }
        },
        plugins: plugins
    };
};

//module.exports.plugins.forEach(function(p,i) {
//	if (process.argv.indexOf( '--disable-' + p.name + '-plugin') === -1) {
//		module.exports.plugins[i] = p.plugin;
//	} else {
//		module.exports.plugins[i] = function() {}
//	}
//});
// module.exports.plugins.forEach(function(p,i) {
// 	if(module.exports.env.disable === p.name) {
// 		module.exports.plugins[i] = function() {}
// 	} else {
// 		module.exports.plugins[i] = p.plugin;
// 	}
// });
