import * as fs from 'fs-extra'
import { FabConfig, MissingConfig, InvalidConfigError, assume, ssume } from '@fab/core'
import * as jju from 'jju'

export default class JSON5Config {
  str_contents: string
  data: FabConfig

  static async readFrom(file_path: string): Promise<JSON5Config> {
    if (!(await fs.pathExists(file_path))) {
      throw new MissingConfig(file_path)
    }

    const str_contents = await assume(
      () => fs.readFile(file_path, 'utf8'),
      () => new InvalidConfigError(`Could not read file at '${file_path}'`)
    )

    const data = ssume(
      () => jju.parse(str_contents),
      () =>
        new InvalidConfigError(
          `Could not parse file at '${file_path}'. Check that it is valid JSON5.`
        )
    )

    return new JSON5Config(str_contents, data)
  }

  constructor(str_contents: string, data: FabConfig) {
    // todo: can we generate a validator from the TS definition
    if (!data.build) {
      throw new InvalidConfigError(`The FAB config file is missing a 'build' property.`)
    }

    this.str_contents = str_contents
    this.data = data
  }
}
