import chalk from 'chalk'

export const log = {
  error(str: string) {
    console.log(chalk.red(str))
  }
}
