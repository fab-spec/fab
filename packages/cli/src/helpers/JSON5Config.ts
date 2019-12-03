import {FabConfig} from "@fab/core";
import * as fs from 'fs-extra';
import {MissingConfig} from "@fab/core";
import * as jju from 'jju'

export default class JSON5Config {
  str_contents: string;
  data: FabConfig;

  static async readFrom(file_path: string) : Promise<JSON5Config> {
    if (!await fs.pathExists(file_path)) {
      throw new MissingConfig(file_path)
    }

    // TODO: catch exception here
    const str_contents = await fs.readFile(file_path, 'utf8')

    // TODO: catch parsing exceptions here
    const data = jju.parse(str_contents)

    // TODO: validate that it matches the expected FabConfig schema

    return new JSON5Config(str_contents, data)
  }

  constructor(str_contents: string, data: FabConfig) {
    this.str_contents = str_contents;
    this.data = data
  }
}
