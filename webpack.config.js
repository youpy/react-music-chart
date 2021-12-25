const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  devServer: {
    static: './',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin({
      extensions: [ '.js', '.jsx' ],
      exclude: 'node_modules'
    })
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [
        { loader: 'react-hot-loader/webpack' },
        { loader: 'babel-loader' }
      ],
      include: path.join(__dirname, 'src/')
    }]
  },
  target: ['web', 'es2020'],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat"
    }
  }
};
