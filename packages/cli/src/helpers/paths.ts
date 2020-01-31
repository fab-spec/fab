import path from 'path'

export const isRelative = (plugin_name: string) => plugin_name.match(/^\.\.?\//)

export const relativeToConfig = (config_path: string, relative_path: string) =>
  isRelative(relative_path)
    ? path.resolve(path.dirname(config_path), relative_path)
    : relative_path
