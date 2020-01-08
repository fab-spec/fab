import chalk from 'chalk'

export const log = {
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
