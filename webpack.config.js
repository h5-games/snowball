const path = require('path');

module.exports = {
  mode: 'production',
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname),
    filename: 'dist.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
}
