const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',

  devtool: false,

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, '../public'),
          filter: resourcePath => {
            // 手动过滤 index.html
            return (
              resourcePath !== path.resolve(__dirname, '../public/index.html')
            );
          }
        }
      ]
    })
  ]
});
