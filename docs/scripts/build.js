const glob = require('fast-glob')
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

const entries = glob.sync(path.resolve(__dirname, '../../packages/*/README.md'))
for (const entry of entries) {
  copyPackageReadmeToDocs(entry)
}
const examples = glob.sync(path.resolve(__dirname, '../examples/*/README.md'))
for (const example of examples) {
  copyExampleReadmeToDocs(example)
}
const homeReadme = path.resolve(__dirname, '../../README.md')
copyHomePackageReadmeToDocs(homeReadme)
