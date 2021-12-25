const config = require('./webpack.config');
const webpack = require('webpack');

config.devtool = 'source-map';
config.mode = 'production'
config.entry = [
  './src/index'
];

module.exports = config;
