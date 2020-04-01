import fs from 'fs-extra'
import pkgUp from 'pkg-up'
import path from 'path'
import semver from 'semver'
import execa from 'execa'

import { BuildConfig } from '@fab/core'

import { FabInitError } from '../errors'
import { confirm, log, prompt } from '../helpers'
import JSON5Config from '../helpers/JSON5Config'

enum KnownFrameworkTypes {
  CreateReactApp,
  Next9,
}

type FrameworkInfo = {
  name: string
  plugins: BuildConfig
  scripts: { [name: string]: string }
  customConfig?: (root_dir: string) => void
}

const DEFAULT_DEPS = ['@fab/cli', '@fab/server']
const GITIGNORE_LINES = ['/.fab', '/fab.zip']
const GUESSED_OUTPUT_DIRS = ['build', 'dist', 'public']
const OUTPUT_DIR_EXAMPLES =
  GUESSED_OUTPUT_DIRS.slice(0, GUESSED_OUTPUT_DIRS.length - 2)
    .map((dir) => `💛${dir}💛`)
    .join(', ') + ` or 💛${GUESSED_OUTPUT_DIRS.slice(-1)}💛`

function STATIC_SITE(build_cmd: string, found_output_dir: string) {
  return {
    name: 'Static Site',
    scripts: {
      'build:fab': `${build_cmd} && npm run fab:build`,
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-static': {
        dir: found_output_dir,
      },
      '@fab/serve-html': {
        fallback: '/index.html',
      },
      '@fab/rewire-assets': {},
    },
  }
}

const Frameworks: {
  [key in KnownFrameworkTypes]: FrameworkInfo
} = {
  [KnownFrameworkTypes.CreateReactApp]: {
    name: 'Create React App',
    scripts: {
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-static': {
        dir: 'build',
      },
      '@fab/serve-html': {
        fallback: '/index.html',
      },
      '@fab/rewire-assets': {},
    },
  },
  [KnownFrameworkTypes.Next9]: {
    name: 'NextJS v9+',
    scripts: {
      // Potentially, we should clear the .next dir before building, to make sure
      // this FAB isn't publishing anything from a previous build.
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-nextjs': {
        dir: '.next',
      },
      '@fab/serve-html': {
        fallback: false,
      },
      '@fab/rewire-assets': {},
    },
    async customConfig(root_dir: string) {
      const config_path = path.join(root_dir, 'next.config.js')
      if (await fs.pathExists(config_path)) {
        const next_config = require(config_path)
        if (next_config.target !== 'serverless') {
          throw new FabInitError(
            `Your NextJS project needs to be configured for a serverless build.
            ${
              next_config.target
                ? `Add 💛target: 'serverless'💛 to your 💛next.config.js💛 file.`
                : `Currently your app is configured to build in 💛${next_config.target ||
                    'server'}💛 mode.
                Update this in your 💛next.config.js💛 by setting 💛target: 'serverless'💛`
            }`
          )
        } else {
          log(`Your app is already configured for a severless build. Proceeding.`)
        }
      } else {
        log(`No 💛next.config.js💛 found, adding one to set 💛target: 'serverless'💛`)
        await fs.writeFile(config_path, `module.exports = {\n  target: 'serverless'\n}\n`)
      }
    },
  },
}
const FRAMEWORK_NAMES = Object.values(Frameworks).map((f) => f.name)

const BASE_CONFIG: string = `// For more information, see https://fab.dev/kb/configuration
{
  plugins: {
    // This section defines your build & runtime toolchains. See https://fab.dev/kb/plugins
  },
  settings: {
    // This section defines the variables that are injected, depending on environment.
    // See https://fab.dev/kb/settings for more info.
    production: {
      // This environment is special. These variables get compiled into the FAB itself,
      // allowing for many production-specific optimisations. See https://fab.dev/kb/production
      // Example setting:
      // API_URL: 'https://api.example.com/graphql'
    },
  },
}
`

type StringMap = {
  [key: string]: string
}
type PackageJson = {
  scripts?: StringMap
  dependencies?: StringMap
  devDependencies?: StringMap
}

const confirmAndRespond = async (
  message: string,
  if_yes: string = `Ok, proceeding...\n`,
  if_no: string = `Ok, exiting`
) => {
  const response = await confirm(message)
  if (response) {
    log(if_yes)
  } else {
    log(if_no)
  }
  return response
}

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

export default class Initializer {
  static description = `Auto-configure a repo for generating FABs`
  static async init(
    config_filename: string,
    yes: boolean,
    skip_install: boolean,
    version: string | undefined,
    skip_framework_detection: boolean
  ) {
    log.continue(`💎 💚fab init: ${this.description}💚 💎\n`)
    /* First, figure out the nearest package.json */
    const package_json_path = await pkgUp()
    if (!package_json_path) {
      throw new FabInitError(`Cannot find a package.json in this or any parent directory`)
    }
    const root_dir = path.dirname(package_json_path)
    if (root_dir !== process.cwd()) {
      if (yes) {
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
        const confirmed = await confirmAndRespond(
          `💛Are you sure you want to configure a FAB here?💛`
        )
        if (!confirmed) return
      }
    }

    /* Then, figure out what kind of project we are */
    const package_json = await this.getPackageJson(package_json_path)
    const framework = await this.getFramework(
      package_json,
      yes,
      root_dir,
      skip_framework_detection
    )
    if (!framework) return

    const use_yarn = await fs.pathExists(path.join(root_dir, 'yarn.lock'))

    if (yes) {
      log.info(`Proceeding...`)
    } else {
      const confirmed = await confirmAndRespond(
        `💚Ready to proceed.💚 This process will:
        • Generate a 💛fab.config.json5💛 file for your project
        • Add 💛build:fab💛 and related scripts to your 💛package.json💛
        • Add 💛.fab💛 and 💛fab.zip💛 to your 💛.gitignore💛
        • Install 💛@fab/cli💛 and related dependencies using 💛${
          use_yarn ? 'yarn' : 'npm'
        }💛

        Good to go? [yN]`
      )
      if (!confirmed) return
    }

    /* Next, generate/update the FAB config file */
    await this.updateConfig(root_dir, config_filename, framework, yes)

    /* Then, update the package.json to add a build:fab script */
    await this.addBuildFabScript(package_json_path, package_json, framework, yes)

    /* Update the .gitignore file (if it exists) to add .fab and fab.zip */
    await this.addGitIgnores(root_dir)

    /* Add any framework-specific config required */
    if (framework.customConfig) await framework.customConfig(root_dir)

    /* Finally, install the dependencies */
    if (!skip_install) {
      await this.installDependencies(root_dir, version, framework, use_yarn)
    }

    await this.finalChecks(root_dir, package_json)

    log(`💎 All good 💎`)
  }

  private static async getFramework(
    package_json: PackageJson,
    yes: boolean,
    root_dir: string,
    skip_framework_detection: boolean
  ) {
    const project_type = skip_framework_detection
      ? null
      : await this.determineProjectType(package_json)

    if (typeof project_type !== 'number') {
      if (skip_framework_detection) {
        log(`❤️Skipping framework detection.❤️`)
      } else {
        log(`❤️Warning: Could not find a known framework to auto-generate config.❤️
        Currently supported frameworks for auto-detection are:
        • 💛${FRAMEWORK_NAMES.join('\n• ')}💛

        If your project uses one of these but wasn't detected, please raise an issue: https://github.com/fab-spec/fab/issues.
      `)
      }
      log.continue(`
        💚NOTE: if your site is statically-rendered (e.g. JAMstack) we can still set things up.💚
        Check https://fab.dev/kb/static-sites for more info.

        We'll need your:
        • Build command (usually 💛npm run build💛)
        • Output directory (usually ${OUTPUT_DIR_EXAMPLES})
      `)

      const attempt_static =
        yes || (await confirmAndRespond(`Would you like to proceed?`))
      if (!attempt_static) return

      return await this.setupStaticFramework(package_json, yes, root_dir)
    } else {
      const framework = Frameworks[project_type]
      log(
        `Found a 💛${framework.name}💛 project. We know exactly how to configure this 👍\n`
      )
      return framework
    }
  }

  private static async setupStaticFramework(
    package_json: PackageJson,
    yes: boolean,
    root_dir: string
  ): Promise<FrameworkInfo> {
    const npm_build_exists: boolean | undefined = !!package_json.scripts?.build
    const npm_run_build = `npm run build`
    const build_cmd = await promptWithDefault(
      `What command do you use to build your project?`,
      `(usually something like "npm run xyz")`,
      npm_build_exists && npm_run_build,
      yes
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
      `(usually something like ${OUTPUT_DIR_EXAMPLES})`,
      found_output_dir,
      yes
    )
    // console.log({ output_dir })

    return STATIC_SITE(build_cmd, output_dir)
  }

  private static async getPackageJson(package_json_path: string) {
    try {
      return JSON.parse(await fs.readFile(package_json_path, 'utf8'))
    } catch (e) {
      throw new FabInitError(`Something went wrong parsing ${package_json_path}!`)
    }
  }

  static async determineProjectType(package_json: PackageJson) {
    if (await this.isNext9(package_json)) {
      return KnownFrameworkTypes.Next9
    } else if (await this.isCreateReactApp(package_json)) {
      return KnownFrameworkTypes.CreateReactApp
    }
    return null
  }

  static async isNext9(package_json: PackageJson) {
    const nextjs_version =
      package_json.dependencies?.['next'] || package_json.devDependencies?.['next']
    if (!nextjs_version) return false
    const activeNextProject =
      (await fs.pathExists('.next')) || package_json.scripts?.build?.match(/next build/)
    if (!activeNextProject) {
      throw new FabInitError(
        `Detected NextJS as a dependency but no .next directory found & npm run build doesn't contain 'next build'!`
      )
    }
    if (semver.lt(semver.coerce(nextjs_version)!, '9.0.0')) {
      throw new FabInitError(
        `Detected a NextJS project but using an older version (${nextjs_version}). FABs currently only support NextJS v9 or later.`
      )
    }
    return true
  }

  static async isCreateReactApp(package_json: PackageJson) {
    const react_scripts_version =
      package_json.dependencies?.['react-scripts'] ||
      package_json.devDependencies?.['react-scripts']
    if (!react_scripts_version) return false

    if (semver.lt(semver.coerce(react_scripts_version)!, '2.0.0')) {
      throw new FabInitError(
        `Detected a Create React App project but using an older version of react-scripts (${react_scripts_version}). FABs support `
      )
    }

    return true
  }

  private static async installDependencies(
    root_dir: string,
    version: string | undefined,
    framework: FrameworkInfo,
    use_yarn: boolean
  ) {
    const dependencies = [...DEFAULT_DEPS, ...Object.keys(framework.plugins)].map((dep) =>
      version ? `${dep}@${version}` : dep
    )

    log(
      `💚Installing required development dependencies💚:\n  ${dependencies.join(
        '\n  '
      )}\nusing 💛${use_yarn ? 'yarn' : 'npm'}💛`
    )
    if (use_yarn) {
      await execa('yarn', ['add', '--dev', ...dependencies], { cwd: root_dir })
    } else {
      await execa('npm', ['i', '--save-dev', ...dependencies], { cwd: root_dir })
    }
    log(`
      💚Done!💚

      Now run 💛${
        use_yarn ? 'yarn' : 'npm run'
      } build:fab💛 to build your project and generate a FAB from it!
    `)
  }

  private static async updateConfig(
    root_dir: string,
    config_filename: string,
    framework: FrameworkInfo,
    yes: boolean
  ) {
    const config_path = path.resolve(root_dir, config_filename)
    const config = await this.readExistingConfig(config_path)
    if (Object.keys(config.data.plugins).length > 0) {
      log.warn(`Existing config has a "plugins" section.`)
      const confirmed =
        (yes && log(`Overwriting since -y is set.`)) ||
        (await confirmAndRespond(
          `Would you like to overwrite it?`,
          `Ok, overwriting...`,
          `Ok, leaving as-is.`
        ))
      if (!confirmed) return
    }
    config.data.plugins = framework.plugins
    await config.write(config_filename)
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
    framework: FrameworkInfo,
    yes: boolean
  ) {
    if (!yes && package_json.scripts?.['build:fab']) {
      log.info(`Already detected a build:fab command.`)
      log(`We want to add/overwrite the following lines to your 💛package.json💛:
        💛${JSON.stringify(framework.scripts, null, 2)}💛
      `)
      const ok = await confirmAndRespond(`Overwrite existing scripts?`)
      if (!ok) return
    }
    await fs.writeFile(
      package_json_path,
      JSON.stringify(
        {
          ...package_json,
          scripts: {
            ...package_json.scripts,
            ...framework.scripts,
          },
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
    const deprecated = ['@fab/static', '@fab/compile', '@fab/nextjs']
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
