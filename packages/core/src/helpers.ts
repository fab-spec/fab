import chalk from 'chalk'

export const log = {
  error(str: string) {
    console.log(chalk.red(str))
  }
}

export async function assume<T> (fn: () => Promise<T>, throws: (e: Error) => Error) {
  try {
    return await fn()
  } catch (e) {
    throw throws(e)
  }
}
