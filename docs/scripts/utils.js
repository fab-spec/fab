const fs = require('fs')
const path = require('path')

const copyPackageReadmeToDocs = (source) => {
  if (!source.endsWith('README.md')) return

  const [, packageName] = source.split('/')
  const destination = path.resolve(__dirname, `../readmes/${packageName}.md`)
  fs.copyFileSync(source, destination)
  const contentWithoutFrontMatter = fs.readFileSync(source)
  const newContent = `---
name: '@fab/${packageName}'
route: '/packages/${packageName}'
menu: Packages
---
${contentWithoutFrontMatter}
`
  fs.writeFileSync(destination, newContent)
}
const copyHomePackageReadmeToDocs = (source) => {
  const destination = path.resolve(__dirname, `../readmes/home.md`)
  fs.copyFileSync(source, destination)
  const contentWithoutFrontMatter = fs.readFileSync(source)
  const newContent = `---
name: 'Home'
route: '/'
---
${contentWithoutFrontMatter}
`
  fs.writeFileSync(destination, newContent)
}

module.exports = {
  copyHomePackageReadmeToDocs,
  copyPackageReadmeToDocs,
}
