import * as globby from 'globby'
import * as fs from 'fs-extra'
import * as path from 'path'
import {error, log} from "@fab/static/lib/log";
import * as prettier from "prettier";
import chalk from "chalk";

export default async function generateIncludes(
  includesDir: string,
  output_dir: string,
  next_dir = '.next'
) {
  const files: string[] = await globby([`${next_dir}/serverless/pages/*`], { cwd: includesDir })
  console.log(files)

  log(`Writing HTML rewrite manifest`)
  const raw_manifest_js = `module.exports = {
  ${files
    .map(
      renderer_name =>
        `"/${renderer_name}": require('./pages/${path.basename(renderer_name)}'),`
    )
    .join('')}
}`
  const manifest_output_path = path.resolve(path.join(output_dir, 'renderers.js'))
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
