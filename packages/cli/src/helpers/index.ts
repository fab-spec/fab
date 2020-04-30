import chalk from 'chalk'
import cli from 'cli-ux'
import { IPromptOptions } from 'cli-ux/lib/prompt'

export * from './paths'
export * from './modules'

export const confirmAndRespond = async (
  log: Logger,
  message: string,
  if_yes: string = `Ok, proceeding...`,
  if_no: string = `Ok, exiting`
) => {
  const response = await confirm(message)
  if (response) {
    log(if_yes)
  } else {
    log(if_no)
  }
  return response
}

function format(str: string, indent = 0, first_line_indent = 0) {
  return (
    ' '.repeat(first_line_indent) +
    str
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
      .join(`\n${' '.repeat(indent)}`)
  )
}

const WIDTH = 14
type StrFn = (d: string) => string
export const _log = (full_prefix: string) => {
  let needs_shortening = full_prefix.length > WIDTH
  const prefix = needs_shortening
    ? `🖤[…${full_prefix.slice(1 - WIDTH)}]🖤`
    : `🖤${`${' '.repeat(WIDTH)}[${full_prefix}]`.slice(-2 - WIDTH)}🖤`

  const indent = WIDTH + 5
  const log = (str: string) => {
    if (!full_prefix) {
      console.log(format(str))
    } else {
      if (needs_shortening) {
        const first = full_prefix.slice(0, WIDTH - 1)
        console.log(format(`🖤[${first}…]🖤 ${str}`, indent))
        needs_shortening = false
      } else {
        console.log(format(`${prefix} ${str}`, indent))
      }
    }
    return true
  }
  log._last_time = 0
  log.continue = (str: string) => {
    console.log(format(str, indent, indent))
  }
  log.time = (fn: string | StrFn): void => {
    if (typeof fn === 'string') return log.time(() => fn)
    const now = +new Date()
    log(fn(`💛${((now - log._last_time) / 1000).toFixed(2)} seconds💛`))
    log._last_time = now
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
  log.note = (str: string) => {
    log(`💚NOTE:💚 ${str}`)
  }
  log.announce = (str: string) => {
    log(`💎 💚${str}💚 💎`)
  }
  log.confirmAndRespond = (message: string, if_yes?: string, if_no?: string) =>
    confirmAndRespond(log, message, if_yes, if_no)
  return log
}

export const log = _log('')

export const confirm = (message: string) => cli.confirm(format(message))
export const prompt = (message: string, opts?: IPromptOptions) =>
  cli.prompt(format(message), opts)

export type Logger = ReturnType<typeof _log>
