import fs from 'fs-extra'
import pkgUp from 'pkg-up'
import path from 'path'
import semver from 'semver'
import findYarnWorkspaceRoot from 'find-yarn-workspace-root'

import { FabInitError, installDependencies, JSON5Config, prompt, useYarn } from '../'
import {
  BASE_CONFIG,
  DEFAULT_DEPS,
  DEPRECATED_PACKAGES,
  GITIGNORE_LINES,
  GUESSED_OUTPUT_DIRS,
  OUTPUT_DIR_EXAMPLES,
  PackageJson,
} from './constants'
import { FRAMEWORK_NAMES, FrameworkInfo, Frameworks, GenericStatic } from './frameworks'
import { log, mergeScriptsAfterBuild } from './utils'
import { BuildConfig } from '@fab/core'
import execa from 'execa'
import fetch from 'cross-fetch'

const promptWithDefault = async (
  message: string,
  examples: string,
  def: any,
  yes: boolean
) => {
  // console.log({message, examples, def, yes})
  log(message)
  if (yes) {
    if (def) {
      log(`  -y set, using 💛${def}💛\n`)
      return def
    }
    throw new FabInitError('-y specified but no default found!')
  }
  return await (def ? prompt('> ', { default: def }) : prompt(examples))
}

const getLatestFabCli = async () => {
  const response = await fetch('https://registry.npmjs.org/@fab/cli/latest')
  const data = await response.json()
  if (data && data.version) {
    const installed = JSON.parse(
      await fs.readFile(path.resolve(__dirname, '../../package.json'), 'utf8')
    )
    if (installed.version !== data.version) {
      log(
        `💚NOTE💚: You have 🖤@fab/cli🖤 💛${installed.version}💛, latest available on NPM is 💛${data.version}💛.`
      )
    }
  }
  return data
}

const getLatestSupportedFrameworks = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/fab-spec/fab/master/tests/latest-supported-version/package.json'
  )
  return await response.json()
}

let version_info: Promise<{
  latest_cli: unknown | { version: string }
  latest_frameworks: undefined | { dependencies: { next: string } }
}>
const getLatestVersionInfo = () => {
  if (!version_info) {
    const timeout = new Promise((res) => setTimeout(res, 4000))
    version_info = Promise.all([
      Promise.race([timeout, getLatestFabCli()]).catch(() => null),
      Promise.race([timeout, getLatestSupportedFrameworks()]).catch(() => null),
    ]).then(([latest_cli, latest_frameworks]) => ({
      latest_cli,
      latest_frameworks,
    }))
  }
  return version_info
}

export default class Initializer {
  static description = `Auto-configure a repo for generating FABs`
  static yes: boolean

  static async init(
    config_filename: string,
    yes: boolean,
    skip_install: boolean,
    version: string | undefined,
    skip_framework_detection: boolean,
    empty: boolean
  ) {
    this.yes = yes || empty
    log.announce(`fab init — ${this.description}`)
    // Kick off the version check early but don't await it here7
    getLatestVersionInfo()

    /* First, figure out the nearest package.json */
    const package_json_path = await pkgUp()
    if (!package_json_path) {
      throw new FabInitError(`Cannot find a package.json in this or any parent directory`)
    }
    const root_dir = path.dirname(package_json_path)
    if (root_dir !== process.cwd()) {
      if (this.yes) {
        throw new FabInitError(
          `Note: fab init -y must be run from the root of your project (where your package.json lives) since it will automatically change files.`
        )
      } else {
        log(
          `❤️Warning:❤️ There's no package.json in this directory, the nearest is at 💚${path.relative(
            process.cwd(),
            package_json_path
          )}💚`
        )
        const confirmed = await log.confirmAndRespond(
          `💛Are you sure you want to configure a FAB here?💛`
        )
        if (!confirmed) return
      }
    }

    /* Then, figure out what kind of project we are */
    const package_json = await this.getPackageJson(package_json_path)

    // if our current directory is managed as a yarn workspace, the yarn.lock file will
    // be located in the project root instead of the current package directory - so
    // useYarn should check there to see if this project uses yarn
    const yarn_root = findYarnWorkspaceRoot(root_dir) || root_dir
    const use_yarn = await useYarn(yarn_root)
    const additional_dependencies = []

    if (empty) {
      /* Generate/update the FAB config file */
      await this.updateConfig(root_dir, config_filename, {}, true)
    } else {
      const framework = await this.getFramework(
        package_json,
        root_dir,
        skip_framework_detection
      )
      if (!framework) return

      if (this.yes) {
        log.info(`Proceeding...`)
      } else {
        log(`💚Ready to proceed.💚 This process will:
        • Generate a 💛fab.config.json5💛 file for your project
        • Add 💛build:fab💛 and related scripts to your 💛package.json💛
        • Add 💛.fab💛 and 💛fab.zip💛 to your 💛.gitignore💛
        • Install 💛@fab/cli💛 and related dependencies using 💛${
          use_yarn ? 'yarn' : 'npm'
        }💛`)
        const confirmed = await log.confirmAndRespond(`Good to go? [y/N]`)
        if (!confirmed) return
      }

      /* Next, generate/update the FAB config file */
      await this.updateConfig(root_dir, config_filename, framework.plugins)

      /* Then, update the package.json to add a build:fab script */
      await this.addBuildFabScript(package_json_path, package_json, framework)

      additional_dependencies.push(...Object.keys(framework.plugins))

      /* Add any framework-specific config required */
      if (framework.customConfig)
        additional_dependencies.push(
          ...(await framework.customConfig(root_dir, package_json))
        )
    }

    /* Update the .gitignore file (if it exists) to add .fab and fab.zip */
    await this.addGitIgnores(root_dir)

    /* Finally, install the dependencies */
    if (!skip_install) {
      await this.installDependencies(root_dir, version, use_yarn, additional_dependencies)
    } else {
      log(`Skipping dependency installation as 💛--skip-install💛 is set.
      We would have installed: 🖤${additional_dependencies.join(' ')}🖤`)
    }

    await this.finalChecks(root_dir, package_json)

    // Should already be finished or awaited elsewhere, but just to clean things up:
    await getLatestVersionInfo()

    log(`💎 All good 💎`) /**/
  }

  private static async getFramework(
    package_json: PackageJson,
    root_dir: string,
    skip_framework_detection: boolean
  ) {
    const framework = skip_framework_detection
      ? null
      : await this.determineProjectType(package_json)

    if (framework) {
      log(
        `💚Success!💚 Found a 💛${framework.name}💛 project. We know exactly how to configure this 👍`
      )
      return framework
    } else {
      if (skip_framework_detection) {
        log(`❤️Skipping framework detection.❤️`)
      } else {
        log(`❤️Warning: Could not find a known framework to auto-generate config.❤️
        Currently supported frameworks for auto-detection are:
        • 💛${FRAMEWORK_NAMES.join('\n• ')}💛

        If your project uses one of these but wasn't detected, please raise an issue: https://github.com/fab-spec/fab/issues.
      `)
      }
      log(`
        💚NOTE: if your site is statically-rendered (e.g. JAMstack) we can still set things up.💚
        Check https://fab.dev/kb/static-sites for more info.

        We'll need your:
        • Build command (usually 💛npm run build💛)
        • Output directory (usually ${OUTPUT_DIR_EXAMPLES})
      `)

      const attempt_static =
        this.yes || (await log.confirmAndRespond(`Would you like to proceed?`))
      if (!attempt_static) return

      return await this.setupStaticFramework(package_json, root_dir)
    }
  }

  private static async setupStaticFramework(
    package_json: PackageJson,
    root_dir: string
  ): Promise<FrameworkInfo> {
    const npm_build_exists: boolean | undefined = !!package_json.scripts?.build
    const npm_run_build = `npm run build`
    const build_cmd = await promptWithDefault(
      `What command do you use to build your project?`,
      `(usually something like "npm run xyz")`,
      npm_build_exists && npm_run_build,
      this.yes
    )
    // console.log({ build_cmd })

    let found_output_dir
    for (const dir of GUESSED_OUTPUT_DIRS) {
      const joined_path = path.join(root_dir, dir)
      if (await fs.pathExists(joined_path)) {
        found_output_dir = dir
        break
      }
    }

    const output_dir = await promptWithDefault(
      `Where is your project built into?`,
      `(e.g. ${OUTPUT_DIR_EXAMPLES})`,
      found_output_dir,
      this.yes
    )

    return GenericStatic(build_cmd, output_dir)
  }

  private static async getPackageJson(package_json_path: string) {
    try {
      return JSON.parse(await fs.readFile(package_json_path, 'utf8'))
    } catch (e) {
      throw new FabInitError(`Something went wrong parsing ${package_json_path}!`)
    }
  }

  static async determineProjectType(package_json: PackageJson) {
    log(`Searching for a 💛known project type💛...
    🖤If your project is not correctly detected,🖤
    🖤or if the generated config is incorrect,🖤
    🖤please leave some feedback at🖤 💛https://fab.dev/guides/known-project-types💛`)
    return (
      (await this.isNext9(package_json)) ||
      (await this.isCreateReactApp(package_json)) ||
      (await this.isGatsby(package_json)) ||
      (await this.isExpo(package_json)) ||
      (await this.isFlareact(package_json)) ||
      null
    )
  }

  static async isNext9(package_json: PackageJson) {
    const nextjs_version =
      package_json.dependencies?.['next'] || package_json.devDependencies?.['next']
    if (!nextjs_version) return false
    const next_build = package_json.scripts?.build?.match(/next build/)
    const next_build_export = package_json.scripts?.build?.match(/next export/)
    const next_export = package_json.scripts?.export?.match(/next export/)
    const activeNextProject =
      (await fs.pathExists('.next')) || next_build || next_build_export || next_export
    if (!activeNextProject) {
      throw new FabInitError(
        `Detected NextJS as a dependency but no .next directory found & npm run build doesn't contain 'next build'!`
      )
    }
    if (semver.valid(nextjs_version)) {
      const current_version = semver.coerce(nextjs_version)!
      if (semver.lt(current_version, '9.0.0')) {
        throw new FabInitError(
          `Detected a NextJS project but using an older version (${nextjs_version}). FABs currently only support NextJS v9 or later.`
        )
      }
      const { latest_frameworks } = await getLatestVersionInfo()
      if (latest_frameworks) {
        const latest_supported = latest_frameworks.dependencies.next
        if (semver.lt(semver.coerce(latest_supported)!, current_version)) {
          log.warn(
            `WARNING: NextJS on FABs only tested up until ${latest_supported}. You have ${current_version}.`
          )
          log(`If you have trouble, consider rolling back your local NextJS version.`)
        }
      }
    }
    if (next_build_export) {
      return Frameworks.Next9({ export_build: true, build_cmd: 'npm run build' })
    } else if (next_export) {
      if (!next_build) {
        return Frameworks.Next9({ export_build: true, build_cmd: 'npm run export' })
      }
      log(`You have both 💛next build💛 and 💛next export💛 in your npm scripts.
        What command do you use to build your project?
        • for dynamic (serverless) sites, this is 💛npm run build💛,
        • or for static sites this is 💛npm run export💛
      `)
      const build_cmd = await promptWithDefault(
        `Your build command`,
        ``,
        'npm run export',
        this.yes
      )
      const export_build =
        this.yes || build_cmd === 'npm run export'
          ? true
          : await log.confirmAndRespond(`Is this a static (i.e. 💛next export💛) site?`)
      return Frameworks.Next9({ export_build, build_cmd })
    } else {
      return Frameworks.Next9({ export_build: false, build_cmd: 'npm run build' })
    }
  }

  static async isCreateReactApp(package_json: PackageJson) {
    const react_scripts_version =
      package_json.dependencies?.['react-scripts'] ||
      package_json.devDependencies?.['react-scripts']
    if (!react_scripts_version) return false

    if (
      semver.valid(react_scripts_version) &&
      semver.lt(semver.coerce(react_scripts_version)!, '2.0.0')
    ) {
      throw new FabInitError(
        `Detected a Create React App project but using an older version of react-scripts (${react_scripts_version}). FABs only support v2+.`
      )
    }

    return Frameworks.CreateReactApp()
  }

  static async isGatsby(package_json: PackageJson) {
    const gatsby_dep =
      package_json.dependencies?.['gatsby'] || package_json.devDependencies?.['gatsby']
    if (!gatsby_dep) return false

    if (!package_json.scripts?.build?.match(/gatsby build/)) {
      throw new FabInitError(
        `Detected Gatsby as a dependency but npm run build doesn't contain 'gatsby build'`
      )
    }
    return Frameworks.Gatsby()
  }

  static async isExpo(package_json: PackageJson) {
    const expo_dep =
      package_json.dependencies?.['expo'] || package_json.devDependencies?.['expo']
    if (!expo_dep) return false

    if (
      package_json.scripts?.web?.match(/expo start/) ||
      package_json.scripts?.start?.match(/expo start/)
    ) {
      return Frameworks.Expo()
    } else {
      log(
        `❤️Warning:❤️ Detected a project with a dependency on 💛expo💛 but no 💛expo start💛 scripts in 💛package.json💛. Skipping.`
      )
    }

    return false
  }

  static async isFlareact(package_json: PackageJson) {
    const expo_dep =
      package_json.dependencies?.['flareact'] ||
      package_json.devDependencies?.['static_dir']
    if (!expo_dep) return false

    if (package_json.scripts?.build?.match(/flareact/)) {
      return Frameworks.Flareact()
    } else {
      log(
        `❤️Warning:❤️ Detected a project with a dependency on 💛flareact💛 but no mention of 💛flareact💛 in 💛npm run build💛. Skipping.`
      )
    }

    return false
  }

  private static async installDependencies(
    root_dir: string,
    version: string | undefined,
    use_yarn: boolean,
    plugin_deps: string[]
  ) {
    const versioned = (deps: string[]) =>
      deps.map((dep) => (version ? `${dep}@${version}` : dep))
    const core_deps = versioned(DEFAULT_DEPS)
    const framework_deps = versioned(plugin_deps)

    log.note(`Installing required 💛FAB core💛 dependencies:
      ${core_deps.map((d) => `• ${d}`).join('\n  ')}`)
    log(`and the following 💛project-specific💛 plugins:
      ${framework_deps.map((d) => `• ${d}`).join('\n  ')}`)
    log(`using 💛${use_yarn ? 'yarn' : 'npm'}...💛`)
    await installDependencies(use_yarn, [...core_deps, ...framework_deps], root_dir)
    log(`💚Done!💚`)
    log(
      `Now run 💛${
        use_yarn ? 'yarn' : 'npm run'
      } build:fab💛 to build your project and generate a FAB from it!
      or visit 💛https://fab.dev/guides/getting-started💛 for more info.`
    )
  }

  private static async updateConfig(
    root_dir: string,
    config_filename: string,
    plugins: BuildConfig,
    auto_skip_if_exists: boolean = false
  ) {
    const config_path = path.resolve(root_dir, config_filename)
    const config = await this.readExistingConfig(config_path)
    if (Object.keys(config.data.plugins).length > 0) {
      if (auto_skip_if_exists) return
      log.warn(`Existing config has a "plugins" section.`)
      const confirmed =
        (this.yes && log(`Overwriting since -y is set.`)) ||
        (await log.confirmAndRespond(
          `Would you like to overwrite it?`,
          `Ok, overwriting...`,
          `Ok, leaving as-is.`
        ))
      if (!confirmed) return
    }
    config.data.plugins = plugins
    await config.write(config_filename)
    try {
      await execa.command(`git add ${config_filename}`)
    } catch (e) {
      log.warn(`Error adding ${config_filename} to git. Skipping...`)
    }
  }

  private static async readExistingConfig(config_path: string) {
    if (await fs.pathExists(config_path)) {
      return await JSON5Config.readFrom(config_path)
    } else {
      return JSON5Config.generate(BASE_CONFIG)
    }
  }

  private static async addBuildFabScript(
    package_json_path: string,
    package_json: any,
    framework: FrameworkInfo
  ) {
    if (!this.yes && package_json.scripts?.['build:fab']) {
      log.info(`Already detected a build:fab command.`)
      log(`We want to add/overwrite the following lines to your 💛package.json💛:
        💛${JSON.stringify(framework.scripts, null, 2)}💛
      `)
      const ok = await log.confirmAndRespond(`Overwrite existing scripts?`)
      if (!ok) return
    }
    await fs.writeFile(
      package_json_path,
      JSON.stringify(
        {
          ...package_json,
          scripts: mergeScriptsAfterBuild(package_json.scripts, framework.scripts),
        },
        null,
        2
      )
    )
  }

  private static async addGitIgnores(root_dir: string) {
    const gitignore_path = path.join(root_dir, '.gitignore')
    if (await fs.pathExists(gitignore_path)) {
      const gitignore = await fs.readFile(gitignore_path, 'utf8')
      const ignore_lines = gitignore.split('\n').map((line) => line.trim())
      const lines_set = new Set(ignore_lines)
      const lines_to_add = GITIGNORE_LINES.filter(
        (line) => !lines_set.has(line) && !lines_set.has(line.slice(1))
      )
      if (lines_to_add.length > 0) {
        await fs.writeFile(
          gitignore_path,
          [...ignore_lines, ...lines_to_add].join('\n') + '\n'
        )
      }
    }
  }

  /* Make sure the repo is OK */
  private static async finalChecks(root_dir: string, package_json: PackageJson) {
    const deprecated = DEPRECATED_PACKAGES
    const deps = new Set([
      ...Object.keys(package_json.dependencies || {}),
      ...Object.keys(package_json.devDependencies || {}),
    ])
    const warn_about = deprecated.filter((dep) => deps.has(dep))
    if (warn_about.length > 0) {
      log(
        `❤️WARNING:❤️ you have deprecated FAB dependencies in your package.json: 💛${warn_about.join(
          ', '
        )}💛`
      )
    }

    const old_prod_settings_file = 'production-settings.json'
    if (await fs.pathExists(path.join(root_dir, old_prod_settings_file))) {
      log(
        `❤️WARNING:❤️ you have a 💛${old_prod_settings_file}💛 file in this directory.\nSettings are now part of 💛fab.config.json5💛, read more at 🖤https://fab.dev/kb/settings🖤.`
      )
    }
  }
}
