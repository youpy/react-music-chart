const config = require('./webpack.config');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

config.devtool = 'source-map';
config.mode = 'production'
config.entry = [
  './src/index'
];

module.exports = config;
