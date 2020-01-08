import fs from 'fs-extra'
import pkgUp from 'pkg-up'
import { FabInitError } from '../errors'
import path from 'path'
import semver from 'semver'
import { log } from '../helpers'

enum KnownFrameworkTypes {
  Unknown,
  CreateReactApp,
  Next9,
}
const FrameworkNames: { [key in KnownFrameworkTypes]: string } = {
  [KnownFrameworkTypes.CreateReactApp]: 'Create React App',
  [KnownFrameworkTypes.Next9]: 'NextJS v9+',
  [KnownFrameworkTypes.Unknown]: '',
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
  static async init(config_filename: string, yes: boolean) {
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

    if (project_type === KnownFrameworkTypes.Unknown) {
      log.warn(`Could not find a known framework to auto-generate config!`)
      log.warn(
        `Visit https://fab.dev/kb/configuration for a guide to manually creating one.`
      )
    } else {
      console.log(`Found a ${FrameworkNames[project_type]} project, proceeding...`)
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
    } else {
      return KnownFrameworkTypes.Unknown
    }
  }

  static async isNext9(package_json: PackageJson) {
    const nextjs_version = (package_json.dependencies || package_json.devDependencies)
      ?.next
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
    const react_scripts_version = (package_json.dependencies ||
      package_json.devDependencies)?.['react-scripts']
    if (!react_scripts_version) return false

    if (semver.lt(react_scripts_version, '2.0.0')) {
      throw new FabInitError(
        `Detected a Create React App project but using an older version of react-scripts (${react_scripts_version}). FABs support `
      )
    }

    return true
  }
}
