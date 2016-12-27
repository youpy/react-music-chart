var config = require('./webpack.config');
var webpack = require('webpack');

config.devtool = 'source-map';
config.plugins.push(new webpack.optimize.UglifyJsPlugin())
config.entry = [
  './src/index'
];

module.exports = config;
