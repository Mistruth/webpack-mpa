const glob = require('glob')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entrys = {}

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

const getEntrys = () => {
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

const pages = getEntrys()

const HtmlPluginsArray = (() => {
  const htmlConfigPlugins = []
  Object.keys(pages).forEach(chunk => {
    entrys[chunk] = pages[chunk].entry
    htmlConfigPlugins.push(new HtmlWebpackPlugin({
      filename: `pages/${chunk}.html`,
      template: pages[chunk].template,
      inject: pages[chunk].inject,
      hash: true,
      path: path.join(__dirname, '../', 'dist'),
      chunks: pages[chunk].chunks,
      templateParameters: {
        BASE_URL: '',
        TITLE: ''
      },
      minify: !isProduction ? false : {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true // 去除属性引用
      }
    }))
  })
  return htmlConfigPlugins
})()

module.exports = {
  pages,
  resolve,
  HtmlPluginsArray,
  entrys
}
