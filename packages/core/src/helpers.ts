import chalk from 'chalk'

export const log = {
  error(str: string) {
    console.log(chalk.red(str))
  },
}

export async function a_sume<T>(fn: () => Promise<T>, throws: (e: Error) => Error) {
  try {
    return await fn()
  } catch (e) {
    throw throws(e)
  }
}

export function s_sume<T>(fn: () => T, throws: (e: Error) => Error) {
  try {
    return fn()
  } catch (e) {
    throw throws(e)
  }
}

export function filenameOutsideFabLocations(filename: string) {
  return filename !== 'server.js' && !filename.startsWith('_assets/')
}
