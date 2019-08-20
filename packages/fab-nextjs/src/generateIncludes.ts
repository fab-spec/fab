import * as globby from 'globby'
import * as fs from 'fs-extra'
import * as path from 'path'
import { error, log } from './utils'
import * as prettier from 'prettier'
import chalk from 'chalk'

export default async function generateIncludes(
  includesDir: string,
  output_dir: string,
  next_dir = '.next'
) {
  const pages_dir = path.join(next_dir, 'serverless', 'pages')
  const html = await globby([`**/*.html`, `!_*`], { cwd: pages_dir })
  const html_content = html.map((filepath) => {
    const renderer_name = path.join(
      path.dirname(filepath),
      path.basename(filepath, '.html')
    )
    return {
      path: `/${renderer_name}`,
      content: fs.readFileSync(path.join(pages_dir, filepath), 'utf8'),
    }
  })

  const files = await globby([`**/*.js`, `!_*`], { cwd: pages_dir })
  // console.log(files)

  const webpack_metadata: {
    preamble?: string
    chunks: { [key: string]: Function }
    entries: { [key: string]: string }
  } = {
    chunks: {},
    entries: {},
  }

  files.forEach((filepath) => {
    const text = fs.readFileSync(path.join(pages_dir, filepath), 'utf8')
    // console.log({ filepath })
    const match = text.match(
      /return __webpack_require__\(__webpack_require__\.s\s*=\s*"([^"]+)"\)[;\/* \n]*}\)/m
    )
    if (!match) {
      error(
        `Webpack compiled output for ${filepath} doesn't match expectations!`
      )
      throw new Error('Unexpected compiled page output')
    }

    // @ts-ignore
    const {
      0: match_str,
      1: entry,
      index,
    }: { 0: string; 1: string; index: number } = match
    console.log({ match_str, entry, index })

    const preamble = text.slice(0, index)
    if (!webpack_metadata.preamble) webpack_metadata.preamble = preamble
    if (webpack_metadata.preamble !== preamble) {
      error(`Webpack compiled output headers do not match between page files!`)
      error(webpack_metadata.preamble)
      error(`  differs to:`)
      error(preamble)
      throw new Error('Unexpected compiled page output')
    }

    const chunks = eval(text.slice(index + match_str.length))
    Object.assign(webpack_metadata.chunks, chunks)

    const renderer_name = path.join(
      path.dirname(filepath),
      path.basename(filepath, '.js')
    )
    log(`  ${chalk.yellow(renderer_name + '.js')} => ${chalk.yellow(entry)}`)
    webpack_metadata.entries[`/${renderer_name}`] = entry
  })

  log(`Writing HTML rewrite manifest`)
  const raw_manifest_js = `
  ${webpack_metadata.preamble}
  return {
    ${[
      ...html_content.map(
        ({ path, content }) => `"${path}": ${JSON.stringify(content)}`
      ),
      ...Object.keys(webpack_metadata.entries).map(
        (path) =>
          `"${toParamPath(path)}": __webpack_require__("${
            webpack_metadata.entries[path]
          }")`
      ),
    ].join(',')}
  }
})({
  ${Object.keys(webpack_metadata.chunks)
    .map((chunk) => `"${chunk}": ${webpack_metadata.chunks[chunk].toString()}`)
    .join(',')}
})`

  const manifest_output_path = path.resolve(
    path.join(output_dir, 'renderers.js')
  )
  let manifest
  try {
    manifest = prettier.format(
      raw_manifest_js,
      // @ts-ignore (babylon has been renamed, but not in @types)
      { parser: 'babel' }
    )
  } catch (e) {
    error(
      `Error prettifying ${manifest_output_path}! Check output for errors and raise an issue at https://github.com/fab-spec/fab/issues`
    )
    manifest = raw_manifest_js
  }

  await fs.writeFile(manifest_output_path, manifest)
  log(`  Wrote ${chalk.gray(output_dir + '/')}${chalk.yellow('index.js')}`)
}

const toParamPath = (next_path: string): string => {
  return next_path.replace(/\[(\w+)\]/g, ':$1')
}
