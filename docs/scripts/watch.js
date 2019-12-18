const chokidar = require('chokidar')
const path = require('path')
const { copyHomePackageReadmeToDocs, copyPackageReadmeToDocs } = require('./utils')

try {
  fs.mkdirSync(path.resolve(__dirname, `../readmes`))
} catch (err) {}

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
