const paramsArgv = [... process.argv]

let params = []

if (!isDevServer(paramsArgv)) {
  params = paramsArgv.slice(2)
} else {
  params = paramsArgv.slice(6)
}

function isDevServer(argvArray) {
  return argvArray.some(argv => argv.includes('webpack.dev.conf'))
}

module.exports = params
