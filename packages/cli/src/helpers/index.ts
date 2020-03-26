import chalk from 'chalk'
import { Guid } from 'guid-typescript'
export * from './paths'
import cli from 'cli-ux'
import { IPromptOptions } from 'cli-ux/lib/prompt'

function format(str: string) {
  return str
    .replace(
      /💛([\s\S]*?)💛|❤️([\s\S]*?)❤️|💚([\s\S]*?)💚|🖤([\s\S]*?)🖤/gm,
      (susbstr, y, r, g, b) => {
        if (y) return chalk.yellow(y)
        if (r) return chalk.red(r)
        if (g) return chalk.green(g)
        if (b) return chalk.grey(b)
        return ''
      }
    )
    .split('\n')
    .map((line) => line.trim())
    .join('\n  ')
}

export const _log = (prefix: string) => {
  const log = (str: string) => {
    console.log(format(prefix ? `[🖤${prefix}🖤] ${str}` : str))
    return true
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

export const confirm = (message: string) => cli.confirm(format(message))
export const prompt = (message: string, opts?: IPromptOptions) =>
  cli.prompt(format(message), opts)

export const loadModule = (module_name: string, paths: string[]) => {
  try {
    return require(require.resolve(module_name, { paths }))
  } catch (e) {
    log.error(`ERROR: FAILED TO LOAD ${module_name}.`)
    throw e
  }
}
