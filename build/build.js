const webpack = require('webpack')
const rm = require('rimraf')
const path = require('path')
const webpackConfig = require('./webpack.prod.conf.js')
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora('building...')

spinner.start()

rm(path.join(__dirname, '../', './dist'), error => {
  if (error) throw error

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    )

    if (stats.hasErrors()) {
      console.log(chalk.red(' Build failed with errors.\n'))
      process.exit(1)
    }
    console.log(chalk.cyan(' Build complete.\n'))
  })
})
