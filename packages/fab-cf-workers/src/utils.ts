import chalk from "chalk";
import {Guid} from "guid-typescript";

const _log = (str: string) =>
  `${chalk.gray(`[FAB:CFWorkers]`)} ${str.split(/\n\s*/).join('\n             ')}`
export const log = (str: string) => console.log(_log(str))
export const info = (str: string) => console.log(_log(chalk.yellow(str)))
export const error = (str: string) => console.log(_log(chalk.red(str)))

export const short_guid = () => Guid.create().toString().split('-')[0]
