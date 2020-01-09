import chalk from 'chalk'
import { Guid } from 'guid-typescript'

export const log = {
  notify(str: string) {
    console.log(chalk.yellow(str))
  },
  info(str: string) {
    console.log(chalk.green(str))
  },
  error(str: string) {
    console.log(chalk.red(str))
  },
  warn(str: string) {
    console.log(chalk.red(str))
  },
}

export const short_guid = () =>
  Guid.create()
    .toString()
    .split('-')[0]
