const fs = require('fs')
const path = require('path')

const relativizeLinks = (str) =>
  str
    .replace(/\(https:\/\/fab.dev\/([\/\w_-]+)\)/g, '(/$1)')
    .replace(/href=['"]https:\/\/fab.dev\/([\/\w_-]+)['"]/g, 'href="/$1"')

const replaceHomepageVideo = (str) => {
  return str.replace(
    /<!-- VIDEO_START[\s\S]*VIDEO_END -->/m,
    `
<div class="inline-video">
  <iframe src="https://www.youtube.com/embed/yIiGBU10SH8?rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>
</div>
    `
  )
}

const copyPackageReadmeToDocs = (source) => {
  if (!source.endsWith('README.md')) return

  const [_, packageName] = source.match(/\/packages\/([^\/]+)\//)

  const destination = path.resolve(__dirname, `../readmes/${packageName}.md`)
  fs.copyFileSync(source, destination)
  const contentWithoutFrontMatter = fs.readFileSync(source, 'utf8')
  const newContent = `---
name: '@fab/${packageName}'
route: '/packages/${packageName}'
menu: Packages
---
${relativizeLinks(contentWithoutFrontMatter)}
`
  fs.writeFileSync(destination, newContent)
}

const copyExampleReadmeToDocs = (source) => {
  if (!source.endsWith('README.md')) return

  const [_, exampleName] = source.match(/\/examples\/([^\/]+)\//)

  const destination = path.resolve(__dirname, `../readmes/${exampleName}.md`)
  fs.copyFileSync(source, destination)
  const contentWithoutFrontMatter = fs.readFileSync(source, 'utf8')
  const title = contentWithoutFrontMatter
    .split('\n')[0]
    .trim()
    .replace(/^#+|with FABs$/g, '')
    .trim()
  const newContent = `---
name: '${title}'
route: '/examples/${exampleName}'
menu: Examples
---
${relativizeLinks(contentWithoutFrontMatter)}
`
  fs.writeFileSync(destination, newContent)
}

const copyHomePackageReadmeToDocs = (source) => {
  const destination = path.resolve(__dirname, `../readmes/home.md`)
  fs.copyFileSync(source, destination)
  const contentWithoutFrontMatter = fs.readFileSync(source, 'utf8')
  const newContent = `---
name: 'Home'
route: '/'
---
${relativizeLinks(replaceHomepageVideo(contentWithoutFrontMatter))}
`
  fs.writeFileSync(destination, newContent)
}

module.exports = {
  copyHomePackageReadmeToDocs,
  copyPackageReadmeToDocs,
  copyExampleReadmeToDocs,
}
