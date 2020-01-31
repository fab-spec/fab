import chalk from 'chalk'
import { Guid } from 'guid-typescript'
export * from './paths'

export const log = (str: string) => {
  console.log(
    str
      .replace(/💛(.*?)💛|❤️(.*?)❤️/g, (susbstr, y, r) => {
        if (y) return chalk.yellow(y)
        if (r) return chalk.red(r)
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

export const short_guid = () =>
  Guid.create()
    .toString()
    .split('-')[0]
