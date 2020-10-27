import path from 'path'
import hasha from 'hasha'

export const isRelative = (plugin_name: string) => plugin_name.match(/^\.\.?\//)

export const relativeToConfig = (
  config_path: string,
  relative_path: string,
  might_be_npm_package = true
) =>
  might_be_npm_package && !isRelative(relative_path)
    ? relative_path
    : path.resolve(path.dirname(config_path), relative_path)

export const getFingerprintedName = (contents: Buffer, filename: string) => {
  const hash = hasha(contents, { algorithm: 'md5' }).slice(0, 9)
  const extname = path.extname(filename)
  return extname
    ? `${filename.slice(0, -1 * extname.length)}.${hash}${extname}`
    : `${filename}_${hash}`
}
