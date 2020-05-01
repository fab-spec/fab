import fs from 'fs-extra'
import path from 'path'
import { Logger } from './index'
import execa from 'execa'
import resolve from 'resolve'

export function useYarn(root_dir: string) {
  return fs.pathExists(path.join(root_dir, 'yarn.lock'))
}

function tryLoading(module_name: string) {
  return require(resolve.sync(module_name, { basedir: process.cwd() }))
}

export function loadModule(log: Logger, module_name: string) {
  try {
    return tryLoading(module_name)
  } catch (e) {
    log.error(`ERROR: FAILED TO LOAD ${module_name}.`)
    throw e
  }
}

async function tryLoadingMultiple(module_names: string[]) {
  const attempts: { [name: string]: { module?: any; error?: Error } } = {}
  await Promise.all(
    module_names.map(async (name) => {
      try {
        const module = tryLoading(name)
        attempts[name] = { module }
      } catch (error) {
        attempts[name] = { error }
      }
    })
  )
  return attempts
}

export async function loadOrInstallModules(
  log: Logger,
  module_names: string[],
  auto_install: boolean
): Promise<any[]> {
  const root_dir = process.cwd()
  const first_attempt = await tryLoadingMultiple(module_names)
  const missing_modules = module_names.filter((name) => first_attempt[name].error)

  if (missing_modules.length === 0) {
    return module_names.map((name) => first_attempt[name].module)
  }

  const use_yarn = await useYarn(root_dir)
  log(`${
    auto_install
      ? `💚NOTE💚: Installing required modules due to 💛--auto-install💛 flag:`
      : `❤️WARNING❤️: Missing required modules:`
  }
  ${missing_modules.map((name) => `💛${name}💛`).join('\n')}`)
  const proceed = auto_install
    ? log(`using 💛${use_yarn ? 'yarn' : 'npm'}💛.`)
    : await log.confirmAndRespond(
        `Would you like to install them using 💛${use_yarn ? 'yarn' : 'npm'}💛?`
      )
  if (!proceed) {
    log.error(`Cannot continue without these modules`)
    throw first_attempt[missing_modules[0]].error
  }
  await installDependencies(use_yarn, missing_modules, root_dir)

  const second_attempt = await tryLoadingMultiple(missing_modules)
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
  module_name: string,
  auto_install: boolean
): Promise<any> {
  return (await loadOrInstallModules(log, [module_name], auto_install))[0]
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
