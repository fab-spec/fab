import { StringMap } from './constants'

const isBuildScript = (script_name: string) => script_name.match(/^build/)

export const mergeScriptsAfterBuild = (
  existing_scripts: StringMap,
  framework_scripts: StringMap
) => {
  const merged_scripts: StringMap = {}
  const script_names = Object.keys(existing_scripts)
  let merged = false
  script_names.forEach((script_name, i) => {
    if (
      !merged &&
      i !== 0 &&
      isBuildScript(script_names[i - 1]) &&
      !isBuildScript(script_name)
    ) {
      Object.assign(merged_scripts, framework_scripts)
      merged = true
    }
    merged_scripts[script_name] = existing_scripts[script_name]
  })
  if (!merged) Object.assign(merged_scripts, framework_scripts)
  return merged_scripts
}
