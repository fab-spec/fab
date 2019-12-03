import chalk from 'chalk'

const PROJECT_NAME = `[FAB:Static]`
const _log = (colour: (str: string) => string) => (str: string) =>
  console.log(
    `${chalk.gray(PROJECT_NAME)} ${colour(
      str.split(/\n\s*/).join(`\n${PROJECT_NAME.replace(/./g, ' ')} `)
    )}`
  )
export const log = _log(str => str)
export const note = _log(chalk.yellow)
export const good = _log(chalk.green)
export const error = _log(chalk.red)
