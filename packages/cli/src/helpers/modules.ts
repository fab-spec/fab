import fs from 'fs-extra'
import path from 'path'
import { Logger } from './index'
import execa from 'execa'

export function useYarn(root_dir: string) {
  return fs.pathExists(path.join(root_dir, 'yarn.lock'))
}

function tryLoading(module_name: string, paths?: string[]) {
  return require(require.resolve(module_name, {
    paths: paths ? paths : [process.cwd()],
  }))
}

export function loadModule(log: Logger, module_name: string, paths?: string[]) {
  try {
    return tryLoading(module_name, paths)
  } catch (e) {
    log.error(`ERROR: FAILED TO LOAD ${module_name}.`)
    throw e
  }
}

async function tryLoadingMultiple(module_names: string[], use_execa = false) {
  const attempts: { [name: string]: { module?: any; error?: Error } } = {}
  await Promise.all(
    module_names.map(async (name) => {
      try {
        if (use_execa) {
          const this_we_run = `console.log(require.resolve('${name}'))`
          const module_path = (await execa(`node`, ['-e', this_we_run])).stdout.trim()
          const module = tryLoading(module_path)
          attempts[name] = { module }
        } else {
          const module = tryLoading(name)
          attempts[name] = { module }
        }
      } catch (error) {
        attempts[name] = { error }
      }
    })
  )
  return attempts
}

export async function loadOrInstallModules(
  log: Logger,
  module_names: string[]
): Promise<any[]> {
  const root_dir = process.cwd()
  const first_attempt = await tryLoadingMultiple(module_names)
  const missing_modules = module_names.filter((name) => first_attempt[name].error)
  console.log({ missing_modules })

  if (missing_modules.length === 0) {
    return module_names.map((name) => first_attempt[name].module)
  }

  const use_yarn = await useYarn(root_dir)
  log(`❤️WARNING❤️: Missing required modules:
  ${missing_modules.map((name) => `💛${name}💛`).join('\n')}`)
  const proceed = await log.confirmAndRespond(
    `Would you like to install them using 💛${use_yarn ? 'yarn' : 'npm'}💛?`
  )
  if (!proceed) {
    log.error(`Cannot continue without these modules`)
    throw first_attempt[missing_modules[0]].error
  }
  await installDependencies(use_yarn, missing_modules, root_dir)

  const second_attempt = await tryLoadingMultiple(missing_modules, true)
  const still_missing = missing_modules.filter((name) => second_attempt[name].error)
  if (still_missing.length > 0) {
    log.error(`Still cannot resolve these modules: ${still_missing.join(',')}`)
    throw second_attempt[still_missing[0]].error
  }

  return module_names.map(
    (name) => second_attempt[name].module || first_attempt[name].module
  )
}
export async function loadOrInstallModule(
  log: Logger,
  module_name: string
): Promise<any> {
  return (await loadOrInstallModules(log, [module_name]))[0]
}

export async function installDependencies(
  use_yarn: boolean,
  dependencies: string[],
  root_dir: string
) {
  if (use_yarn) {
    await execa('yarn', ['add', '--dev', ...dependencies], { cwd: root_dir })
  } else {
    await execa('npm', ['i', '--save-dev', ...dependencies], { cwd: root_dir })
  }
}
