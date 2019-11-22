import {FabConfig} from "../types";
import * as fs from 'fs-extra';
import MissingConfig from "../errors/MissingConfig";

export default class JSON5Config implements FabConfig {
  static async readFrom(file_path: string) : Promise<FabConfig> {
    if (!await fs.pathExists(file_path)) {
      throw new MissingConfig(file_path)
    }

    return new JSON5Config()
  }
}
