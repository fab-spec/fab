import chalk from 'chalk'

export const log = {
  error(str: string) {
    console.log(chalk.red(str))
  }
}



export async function a_ssume<T> (fn: () => Promise<T>, throws: (e: Error) => Error) {
  try {
    return await fn()
  } catch (e) {
    throw throws(e)
  }
}

export function s_ssume<T> (fn: () => T, throws: (e: Error) => Error) {
  try {
    return fn()
  } catch (e) {
    throw throws(e)
  }
}
