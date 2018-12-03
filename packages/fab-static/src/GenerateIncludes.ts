const globby = require('globby')
const path = require('path')
const fse = require('fs-extra')

export default async function run(includesDir: string) {
  const files = await globby([
    '.next/**/*'
  ], { cwd: includesDir })
  console.log(files)
  const contents = await Promise.all(
    files.map(file => fse.readFile(file, { encoding: 'base64' }))
  )
  const urls = {}
  files.forEach((file, index) => {
    const bytes = `Buffer.from('${contents[index]}', 'base64')`
    urls[file] = `{ bytes: ${bytes}, headers: ${JSON.stringify({})} }`
  })

  const code = `
  const urls = {}
  ${Object.keys(urls)
    .map(url => `urls['/${url}'] = ${urls[url]};`)
    .join('\n')}
  
  const fs = require('fs')
  const path = require('path')
  module.exports = ${async () => {
    for (const url of Object.keys(urls)) {
      await new Promise((resolve, reject) =>
        fs.mkdir(
          path.dirname(url),
          { recursive: true },
          err => (err ? reject(err) : resolve())
        )
      )
      await new Promise((resolve, reject) =>
        fs.writeFile(
          url,
          urls[url].bytes,
          'base64',
          (err, ok) => (err ? reject(err) : resolve(ok))
        )
      )
    }
  }}
  `

  await fse.writeFile(path.join(includesDir, 'build', '_includes.js'), code)
}
