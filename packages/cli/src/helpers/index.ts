import chalk from 'chalk'
import { Guid } from 'guid-typescript'
export * from './paths'

export const _log = (prefix: string) => {
  const log = (str: string) => {
    console.log(
      (prefix + str)
        .replace(/💛(.*?)💛|❤️(.*?)❤️|💚(.*?)💚/g, (susbstr, y, r, g) => {
          if (y) return chalk.yellow(y)
          if (r) return chalk.red(r)
          if (g) return chalk.green(g)
          return ''
        })
        .split('\n')
        .map((line) => line.trim())
        .join('\n  ')
    )
  }

  log.notify = (str: string) => {
    log(chalk.yellow(str))
  }
  log.info = (str: string) => {
    log(chalk.green(str))
  }
  log.error = (str: string) => {
    log(chalk.red(str))
  }
  log.warn = (str: string) => {
    log(chalk.red(str))
  }
  return log
}

export const log = _log('')

export const short_guid = () =>
  Guid.create()
    .toString()
    .split('-')[0]
