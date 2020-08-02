/**
 * =======================================
 * ========= DEV WEBPACK CONFIG ==========
 * =======================================
 */
require('dotenv').config();
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  devtool: 'inline-source-map',

  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    stats: 'minimal',
    historyApiFallback: true,
    disableHostCheck: true
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BASE_SERVICE_URL: JSON.stringify(process.env.BASE_SERVICE_URL),
        LATITUDE: JSON.stringify(process.env.LATITUDE),
        LONGITUDE: JSON.stringify(process.env.LONGITUDE),
      }
    })
  ]
});
