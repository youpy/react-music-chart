const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = path.join(__dirname, 'dist');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: outputPath,
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ESLintPlugin({
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { loader: 'react-hot-loader/webpack' },
          { loader: 'babel-loader' },
        ],
        include: path.join(__dirname, 'src/'),
      },
    ],
  },
  target: ['web', 'es2020'],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
}
