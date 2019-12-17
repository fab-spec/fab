const chokidar = require('chokidar')
const path = require('path')
const { copyHomePackageReadmeToDocs, copyPackageReadmeToDocs } = require('./utils')

chokidar
  .watch('packages/*/README.md', { cwd: path.resolve(__dirname, '../../') })
  .on('all', (event, source) => {
    copyPackageReadmeToDocs(source)
  })

chokidar
  .watch('README.md', { cwd: path.resolve(__dirname, '../../') })
  .on('all', (event, source) => {
    copyHomePackageReadmeToDocs(source)
  })
