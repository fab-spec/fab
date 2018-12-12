import * as globby from 'globby'
import * as fs from 'fs-extra'
import * as path from 'path'

export default async function generateIncludes(includesDir: string, output_dir: string) {
  const files = await globby(['.next/**/*'], { cwd: includesDir })
  console.log(files)
  const contents = await Promise.all(
    files.map(file => fs.readFile(file, { encoding: 'base64' }))
  )
  const urls: { [key: string]: string } = {}
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
  module.exports = async () => {
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
  }
  `

  await fs.writeFile(path.join(output_dir, 'includes.js'), code)
}
