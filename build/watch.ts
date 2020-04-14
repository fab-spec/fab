/*
 * Copies files from build/{esm,lib}/[pkg-name]/src to packages/[pkg-name]/{esm,lib}
 * */

import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'

const package_dir = path.resolve(__dirname, '../packages')

const seen_once: Set<string> = new Set()

chokidar
  .watch(path.resolve(__dirname, '{esm,lib}/**/*.{js,map}'))
  .on('all', (event, source) => {
    const match = source.match(/fab\/build\/(esm|lib)\/([\w-]+)/)
    if (match) {
      const [_, target, pkg] = match
      const from = path.join(__dirname, target, pkg, 'src')
      const built_path = path.relative(from, source)
      const target_file = path.join(pkg, target, built_path)
      const target_path = path.join(package_dir, target_file)
      fs.ensureFile(target_path).then(() =>
        fs.copyFile(source, target_path).then(() => {
          if (target_path.match(/\/lib\/|\.map$/)) return
          if (!seen_once.has(target_path)) {
            seen_once.add(target_path)
          } else {
            console.log(`  ${chalk.green('✔')} ${chalk.gray(target_file)}`)
          }
        })
      )
    } else {
      console.log('❌ ' + source)
    }
  })
