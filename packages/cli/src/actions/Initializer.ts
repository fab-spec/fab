import fs from 'fs-extra'
import pkgUp from 'pkg-up'
import path from 'path'
import semver from 'semver'
import execa from 'execa'

import { BuildConfig, FabConfig } from '@fab/core'

import { FabInitError } from '../errors'
import { log } from '../helpers'
import JSON5Config from '../helpers/JSON5Config'

enum KnownFrameworkTypes {
  CreateReactApp,
  Next9,
}

type FrameworkInfo = {
  name: string
  plugins: BuildConfig
  scripts: { [name: string]: string }
}

const DEFAULT_DEPS = ['@fab/cli', '@fab/server']
const GITIGNORE_LINES = ['/.fab', '/fab.zip']

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
      '@fab/serve-html': {},
      '@fab/rewire-assets': {},
    },
  },
  [KnownFrameworkTypes.Next9]: {
    name: 'NextJS v9+',
    scripts: {
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-nextjs': {},
      '@fab/serve-html': {},
      '@fab/rewire-assets': {},
    },
  },
}

const BASE_CONFIG: FabConfig = {
  build: {},
  runtime: [],
  settings: {},
}

type StringMap = {
  [key: string]: string
}
type PackageJson = {
  scripts?: StringMap
  dependencies?: StringMap
  devDependencies?: StringMap
}

export default class Initializer {
  static async init(
    config_filename: string,
    yes: boolean,
    skip_install: boolean,
    version: string | undefined
  ) {
    if (!yes)
      throw new FabInitError(`Haven't figured out prompting the user yet, use -y!`)
    /* First, figure out the nearest package.json */
    const package_json_path = await pkgUp()
    if (!package_json_path) {
      throw new FabInitError(`Cannot find a package.json in this or any parent directory`)
    }
    const root_dir = path.dirname(package_json_path)
    if (root_dir !== process.cwd() && yes) {
      throw new FabInitError(
        `Note: fab init -y must be run from the root of your project (where your package.json lives) since it will automatically change files.`
      )
    }

    /* Then, figure out what kind of project we are */
    const package_json = await this.getPackageJson(package_json_path)
    const project_type = await this.determineProjectType(package_json)

    if (typeof project_type !== 'number') {
      log.warn(`Could not find a known framework to auto-generate config!`)
      log.warn(
        `Visit https://fab.dev/kb/configuration for a guide to manually creating one.`
      )
      return
    }

    const framework = Frameworks[project_type]
    log.info(`Found a ${framework.name} project, proceeding...`)

    /* Next, generate/update the FAB config file */
    await this.updateConfig(root_dir, config_filename, framework)

    /* Then, update the package.json to add a build:fab script */
    await this.addBuildFabScript(package_json_path, package_json, framework)

    console.log('GITIGNORE!')
    /* Update the .gitignore file (if it exists) to add .fab and fab.zip */
    await this.addGitIgnores(root_dir)

    /* Finally, install the dependencies */
    if (!skip_install) {
      await this.installDependencies(root_dir, version, framework)
    }
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
    if (semver.lt(nextjs_version, '9.0.0')) {
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

    if (semver.lt(react_scripts_version, '2.0.0')) {
      throw new FabInitError(
        `Detected a Create React App project but using an older version of react-scripts (${react_scripts_version}). FABs support `
      )
    }

    return true
  }

  private static async installDependencies(
    root_dir: string,
    version: string | undefined,
    framework: FrameworkInfo
  ) {
    const dependencies = [...DEFAULT_DEPS, ...Object.keys(framework.plugins)].map((dep) =>
      version ? `${dep}@${version}` : dep
    )
    const use_yarn = fs.pathExists(path.join(root_dir, 'yarn.lock'))
    log.info(
      `Installing required development dependencies:\n  ${dependencies.join(
        '\n  '
      )}\nusing ${use_yarn ? 'yarn' : 'npm'}`
    )
    if (use_yarn) {
      await execa('yarn', ['add', '--dev', ...dependencies], { cwd: root_dir })
    } else {
      await execa('npm', ['i', '--save-dev', ...dependencies], { cwd: root_dir })
    }
    log.info(`Done!`)
  }

  private static async updateConfig(
    root_dir: string,
    config_filename: string,
    framework: FrameworkInfo
  ) {
    const config_path = path.join(root_dir, config_filename)
    const config = await this.readExistingConfig(config_path)
    if (Object.keys(config.data.build).length > 0) {
      log.warn(`Existing config has a "build" section. Overwriting since -y is set.`)
    }
    config.data.build = framework.plugins
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
    framework: FrameworkInfo
  ) {
    if (package_json.scripts?.build?.['build:fab']) {
      log.info(`Already detected a build:fab command, skipping`)
      return
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
      const lines_to_add = GITIGNORE_LINES.filter((line) => !lines_set.has(line))
      if (lines_to_add.length > 0) {
        await fs.writeFile(
          gitignore_path,
          [...ignore_lines, ...lines_to_add].join('\n') + '\n'
        )
      }
    }
  }
}
