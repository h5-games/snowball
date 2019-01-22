const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',

  resolve: {
    extensions: ['.js', '.ts']
  },

  entry: [
    'babel-polyfill',
    './src'
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.ts$/,
        use: [
          'babel-loader',
          'ts-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('', 'src/index.html')
    })
  ],

  devServer: {
    inline: true,
    contentBase: './src',
    progress: true,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 9999
  }
};
