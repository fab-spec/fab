const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const {
  copyHomePackageReadmeToDocs,
  copyPackageReadmeToDocs,
  copyExampleReadmeToDocs,
} = require('./utils')

try {
  fs.mkdirSync(path.resolve(__dirname, `../readmes`))
} catch (err) {}

chokidar
  .watch(path.resolve(__dirname, '../../packages/*/README.md'))
  .on('all', (event, source) => {
    copyPackageReadmeToDocs(source)
  })

chokidar
  .watch(path.resolve(__dirname, '../../examples/*/README.md'))
  .on('all', (event, source) => {
    copyExampleReadmeToDocs(source)
  })

chokidar.watch(path.resolve(__dirname, '../../README.md')).on('all', (event, source) => {
  copyHomePackageReadmeToDocs(source)
})
