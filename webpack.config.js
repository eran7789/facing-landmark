const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const src = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'server', 'dist', 'app');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  context: src,
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  entry: path.join(src, 'js/index.js'), 
  target: "web",
  output: {
    path: buildPath, 
    filename: 'bundle.js',
    publicPath: '/app/'
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              require('@babel/plugin-proposal-object-rest-spread'),
              require('@babel/plugin-proposal-class-properties')
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|woff|woff2|ttf|otf|ogg)(\?.*)?$/i,
        use: 'url-loader?limit=5120&name=[path][name].[hash].[ext]'
      }
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      src
    ]
  },
  
  serve: { 
    port: 1337,
    content: './dist'
  },

  devServer: {
    publicPath:'/app',
    compress: true, // enable gzip compression
    host: '0.0.0.0'
  },

  plugins: [
    new CleanWebpackPlugin([buildPath]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({ 
      template: 'index.html'
    }),
    new CopyWebpackPlugin([{ from: path.join(src, 'images'), to: path.join(buildPath, 'images'), force: true }]),
    new Dotenv()
  ],
  // list of additional plugins
  /* Advanced configuration (click to show) */}