const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  watch: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: [/node_modules/], 
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
      filename: path.join(__dirname, 'dist/index.html'),
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/data/*',
        to: 'data',
        flatten: true,
      },
    ]),
  ],
};
