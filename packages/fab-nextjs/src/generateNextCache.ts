import * as globby from 'globby'
import * as fs from 'fs-extra'
import * as path from 'path'

export default async function generateNextCache(
  includesDir: string,
  output_dir: string
) {
  const build_id = await fs.readFile(
    path.join(includesDir, '.next', 'BUILD_ID'),
    'utf8'
  )

  const files = await globby(
    [
      '.next/*.json',
      '.next/server/*.json',
      `.next/server/static/${build_id}/**/*`
    ],
    { cwd: includesDir }
  )

  await Promise.all(
    files.map(async file => {
      const input = path.join(includesDir, file)
      const output = path.join(output_dir, file)
      await fs.ensureDir(path.dirname(output))
      console.log(`  ${file} => ${output}`)
      if (file.endsWith('js')) {
        const file_contents = await fs.readFile(input, 'utf8')
        await fs.writeFile(
          output,
          file_contents.replace("require('../../../ssr-module-cache.js')", '{}')
        )
      } else {
        await fs.copy(input, output)
      }
    })
  )

  const code = `
    const NEXT_CACHE = {
      ${files
        .map(file => {
          // Insert keys for /xyz/document.js and /xyz/document
          const keys = file.endsWith('.js')
            ? [file, file.replace(/\.js$/, '')]
            : [file]
          return keys
            .map(key => `  '/${key}': require('./${file}')`)
            .join(',\n')
        })
        .join(',\n')}
    }
    module.exports = NEXT_CACHE
  `

  await fs.writeFile(path.join(output_dir, 'next-cache.js'), code)
}
