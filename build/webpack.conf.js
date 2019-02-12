// const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const PAGES = getEntrys()
const htmlConfigPlugins = []
const entrys = {}
const isProduction = process.env.NODE_ENV === 'production'
const mode = isProduction ? 'production' : 'development'

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

Object.keys(PAGES).forEach(chunk => {
  entrys[chunk] = PAGES[chunk].entry
  htmlConfigPlugins.push(new HtmlWebpackPlugin({
    filename: `${chunk}.html`,
    template: PAGES[chunk].template,
    inject: PAGES[chunk].inject,
    hash: true,
    chunks: PAGES[chunk].chunks,
    templateParameters: {
      BASE_URL: '',
      TITLE: ''
    },
    minify: process.env.NODE_ENV === 'development' ? false : {
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true // 去除属性引用
    }
  }))
})

function getEntrys() {
  const pages = {}
  glob.sync('./src/pages/**/*.js').forEach(filePath => {
    const chunk = filePath.split('./src/pages/')[1].split('/app.js')[0]
    pages[chunk] = {
      entry: filePath,
      template: resolve(`src/pages/${chunk}/index.html`),
      inject: true,
      chunks: ['chunk-vendors', 'chunk-common', 'runtime', chunk]
    }
  })
  return pages
}

module.exports = {
  entry: entrys,
  mode: mode,
  output: {
    path: resolve('dist'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': 'src'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: false
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('public')],
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader'],
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [resolve('src')]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      // include all types of chunks
      // option ['initial','async','all'] and fn
      chunks: 'async',
      // It is recommended to set splitChunks.name to false for production builds so that it doesn't change names unnecessarily.
      name: true,
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
          // chunks: 'initial',
          minChunks: 2
        },
        common: {
          name: 'chunk-common',
          priority: -20,
          minChunks: 1,
          // chunks: 'initial',
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
      })
    ]
  },
  plugins: [
    ...htmlConfigPlugins,
    new VueLoaderPlugin()
  ]
}
