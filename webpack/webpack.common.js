const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    path.resolve(__dirname, '../src/')
  ],

  output: {
    filename: 'static/scripts/[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src/')
    }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    })
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.ts/,
        include: /src/,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'static/images/[name].[hash:8].[ext]'
        }
      }
    ]
  }
};
