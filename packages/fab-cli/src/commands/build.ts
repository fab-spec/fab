import {Command, flags} from '@oclif/command'
import JSON5Config from "../helpers/JSON5Config";
import {DEFAULT_CONFIG_FILENAME} from "../constants";

export default class Build extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ fab hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: DEFAULT_CONFIG_FILENAME
    }),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(Build)
    const config = await JSON5Config.readFrom(flags.config!)
    console.log(config)
  }
}
