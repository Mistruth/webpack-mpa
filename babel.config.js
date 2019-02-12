module.exports = {
  presets: ['env', {
    targets: {
      browsers: ['last 2 versions', 'safari >= 7']
    },
    // ployfill
    useBuiltIns: 'usage'
    // modules: 'commonjs'
  }],
  plugins: ['transform-runtime']
}
