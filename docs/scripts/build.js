const glob = require('fast-glob')
const path = require('path')
const { copyHomePackageReadmeToDocs, copyPackageReadmeToDocs } = require('./utils')

const entries = glob.sync('packages/*/README.md')
for (const entry of entries) {
  copyPackageReadmeToDocs(entry)
}
const homeReadme = path.resolve(__dirname, '../../README.md')
copyHomePackageReadmeToDocs(homeReadme)
