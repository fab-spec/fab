import fs from 'fs-extra'
import { a_sume, FabConfig, REGEXP_VALUE_PATTERN, s_sume, JSON5ConfigI } from '@fab/core'
import jju from 'jju'
import regexParser from 'regex-parser'
import { InvalidConfigError, MissingConfig } from '../errors'
import prettier from 'prettier'

export default class JSON5Config implements JSON5ConfigI {
  str_contents: string
  data: FabConfig

  static async readFrom(file_path: string): Promise<JSON5Config> {
    if (!(await fs.pathExists(file_path))) {
      throw new MissingConfig(file_path)
    }

    const str_contents = await a_sume(
      () => fs.readFile(file_path, 'utf8'),
      () => new InvalidConfigError(`Could not read file at '${file_path}'`)
    )

    const data = s_sume(
      () => jju.parse(str_contents),
      (e) =>
        new InvalidConfigError(
          `Could not parse file at '${file_path}'. Check that it is valid JSON5.\n${e}`
        )
    )

    return new JSON5Config(str_contents, data)
  }

  static generate(data: string) {
    return new JSON5Config(data, jju.parse(data))
  }

  constructor(str_contents: string, data: FabConfig) {
    // todo: can we generate a validator from the TS definition
    if (!data.plugins) {
      throw new InvalidConfigError(`The FAB config file is missing a 'plugins' property.`)
    }

    for (const [plugin, args] of Object.entries(data.plugins)) {
      for (const [k, v] of Object.entries(args)) {
        if (typeof v === 'string' && v.match(REGEXP_VALUE_PATTERN)) {
          args[k] = regexParser(v as string)
        }
      }
    }

    this.str_contents = str_contents
    this.data = data
  }

  async write(file_path: string) {
    await fs.writeFile(
      file_path,
      prettier.format(jju.update(this.str_contents, this.data), {
        parser: 'json5',
        singleQuote: true,
      })
    )
  }
}
