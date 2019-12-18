import { expect } from 'chai'

export const shouldThrow = async (async_fn: () => any, message: string) => {
  const logs: string[] = []
  try {
    // @ts-ignore
    console._log = console.log
    console.log = (...args: any[]) => logs.push(...args)
    await async_fn()
    // @ts-ignore
    console.log = console._log
    throw new Error('Should have thrown!')
  } catch (err) {
    // @ts-ignore
    console.log = console._log
    expect(logs.join('')).to.contain(message)
  }
}
