/**
 * =======================================
 * ======== PROD WEBPACK CONFIG ==========
 * =======================================
 */

require('dotenv').config();
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(common, {
	devtool: 'source-map',

	plugins: [
		// new UglifyJSPlugin({
		// 	sourceMap: true,
		// 	uglifyOptions: { ecma: 8 }
		// }),

		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),

		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				BASE_SERVICE_URL: JSON.stringify(process.env.BASE_SERVICE_URL),
				LATITUDE: JSON.stringify(process.env.LATITUDE),
				LONGITUDE: JSON.stringify(process.env.LONGITUDE),
			}
		})
	]
});
