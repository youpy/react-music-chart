var path = require('path');
var webpack = require('webpack');

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
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [
        { loader: 'react-hot-loader/webpack' },
        { loader: 'babel-loader' }
      ],
      include: path.join(__dirname, 'src')
    }]
  },
  target: ['web', 'es2020']
};
