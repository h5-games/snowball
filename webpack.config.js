const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts']
  },

  entry: './src',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public'
        }
      ]
    })
  ],

  devServer: {
    inline: true,
    progress: true,
    contentBase: './public',
    hot: true,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 9999
  }
};
