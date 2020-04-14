/*
 * Copies files from build/{esm,lib}/[pkg-name]/src to packages/[pkg-name]/{esm,lib}
 * */

import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs-extra'

const package_dir = path.resolve(__dirname, '../packages')

chokidar
  .watch(path.resolve(__dirname, '{esm,lib}/**/*.{js,map}'))
  .on('all', (event, source) => {
    const match = source.match(/fab\/build\/(esm|lib)\/([\w-]+)/)
    if (match) {
      const [_, target, pkg] = match
      console.log(source)
      const from = path.join(__dirname, target, pkg, 'src')
      console.log(from)
      const built_path = path.relative(from, source)
      console.log({ built_path })
      const target_path = path.join(package_dir, pkg, target, built_path)
      console.log({ target_path })
      fs.ensureFile(target_path).then(() =>
        fs.copyFile(source, target_path).then(() => {
          console.log(`✅ ${target_path}`)
        })
      )
    } else {
      console.log('❌ ' + source)
    }
  })
