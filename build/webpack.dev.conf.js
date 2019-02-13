const baseWebpackConfig = require('./webpack.base.conf.js')
const merge = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const utils = require('./utils.js')
const webpack = require('webpack')
const entrys = utils.entrys
const htmlConfigPlugins = utils.HtmlPluginsArray
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')

const webpackConfig = merge(baseWebpackConfig, {
  context: path.resolve(__dirname, '../'),
  mode: 'development',
  devtool: 'source-map',
  entry: entrys,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    clientLogLevel: 'warning',
    // historyApiFallback: true,
    hot: true,
    host: '127.0.0.1',
    port: 9500,
    open: true,
    compress: true,
    // 出现错误会出现遮罩
    overlay: true,
    // publicPath: '/',
    proxy: {

    },
    quiet: true,
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ...htmlConfigPlugins,
    new VueLoaderPlugin()
  ]
})

module.exports = new Promise((resolve, reject) => {
  webpackConfig.plugins.push(new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [`Your application is running here: http://${
        webpackConfig.devServer.host
      }:${webpackConfig.devServer.port}`],
      onErrors: 'error'
    }
  }))
  resolve(webpackConfig)
})

