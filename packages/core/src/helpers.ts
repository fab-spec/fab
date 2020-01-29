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
