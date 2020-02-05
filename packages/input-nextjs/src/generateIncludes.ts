import { mergeWebpacks } from './mergeWebpacks'
import path from 'path'

export default async function generateIncludes(
  js_renderers: string[],
  pages_dir: string
) {
  return `export default [ "hi", "there" ];`
  //
  // if (js_renderers.length > 0) {
  //   const renderer_files = js_renderers.map((filepath) => {
  //     const url_path =
  //       '/' + path.join(path.dirname(filepath), path.basename(filepath, '.js'))
  //     const param_path = toParamPath(url_path)
  //     console.log({ url_path, param_path })
  //   })
  //
  //   console.log({ js_renderers })
  //   // mergeWebpacks()
  // } else {
  //   // return a noop
  //   return `
  //     export function runtime() {
  //       return async function responder() {}
  //     }
  //   `
  // }
}

const toParamPath = (next_path: string): string => {
  return next_path.replace(/\[(\w+)\]/g, '{:$1}')
}
