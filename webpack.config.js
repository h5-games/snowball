const path = require('path')

module.exports = {
  entry: ['babel-polyfill', './js/app.js'],
  output: {
    path: path.resolve(__dirname),
    filename: 'dist.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  mode: 'production'
}
