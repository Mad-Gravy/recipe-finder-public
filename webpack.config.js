const path = require('path');
const Dotenv = require('dotenv-webpack');
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './public',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      inject: "body",
      filename: "index.html",
    }),
  ],
  mode: 'development'
};