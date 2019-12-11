import path from "path";

export const relativeToConfig = (config_path: string, plugin_name: string) =>
  plugin_name.match(/^\.\.?\//)
    ? path.relative(config_path, plugin_name)
    : plugin_name
