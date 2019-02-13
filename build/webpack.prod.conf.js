// const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.js')
const { VueLoaderPlugin } = require('vue-loader')
const utils = require('./utils.js')
const htmlConfigPlugins = utils.HtmlPluginsArray
const webpackConfig = merge(baseWebpackConfig, {
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      // include all types of chunks
      // option ['initial','async','all'] and fn
      chunks: 'all',
      // It is recommended to set splitChunks.name to false for production builds so that it doesn't change names unnecessarily.
      name: true,
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial', // 只打包初始时依赖的第三方
          minChunks: 2
        },
        common: {
          name: 'chunk-common',
          priority: -20,
          minChunks: 1,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: false
          }
        },
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    }),
    ...htmlConfigPlugins,
    new VueLoaderPlugin()
  ]
}
)

module.exports = webpackConfig
