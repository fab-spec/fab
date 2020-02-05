import { mergeWebpacks } from './mergeWebpacks'
import path from 'path'
import fs from 'fs-extra'
import { FabFilesObject } from '@fab/core'

export default async function generateRenderer(
  js_renderers: string[],
  pages_dir: string
) {
  if (js_renderers.length > 0) {
    const renderer_files: FabFilesObject = {}

    await Promise.all(
      js_renderers.map(async (filepath) => {
        const url_path =
          '/' + path.join(path.dirname(filepath), path.basename(filepath, '.js'))
        const param_path = toParamPath(url_path)

        renderer_files[param_path] = await fs.readFile(
          path.join(pages_dir, filepath),
          'utf8'
        )
      })
    )

    return mergeWebpacks(renderer_files)
  } else {
    return `export default {}`
  }
}

const toParamPath = (next_path: string): string => {
  return next_path.replace(/\[(\w+)\]/g, '{:$1}')
}
