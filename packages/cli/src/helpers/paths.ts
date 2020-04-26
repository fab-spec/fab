import path from 'path'

export const isRelative = (plugin_name: string) => plugin_name.match(/^\.\.?\//)

export const relativeToConfig = (
  config_path: string,
  relative_path: string,
  might_be_npm_package = true
) =>
  might_be_npm_package && !isRelative(relative_path)
    ? relative_path
    : path.resolve(path.dirname(config_path), relative_path)
