import path from 'path'

export const isRelative = (plugin_name: string) => plugin_name.match(/^\.\.?\//)

export const relativeToConfig = (config_path: string, plugin_name: string) =>
  isRelative(plugin_name)
    ? path.resolve(path.dirname(config_path), plugin_name)
    : plugin_name
