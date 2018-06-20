const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
		{
			name: 'vue-loader',
			plugin: new VueLoaderPlugin()
        },
		{
			name: 'browser-sync',
			plugin: new BrowserSyncPlugin({
				port: 3000,
				host: 'localhost',
                server: { baseDir: ['dist'] }
			})
		}
    ]
};

module.exports.plugins.forEach(function(p,i) {
	if (process.argv.indexOf( '--disable-' + p.name + '-plugin') === -1) {
		module.exports.plugins[i] = p.plugin;
	} else {
		module.exports.plugins[i] = function() {}
	}
});
