import plugin from '../src'
import { expect } from 'chai'
import { ProtoFab } from '@fab/core'

const shouldThrow = async (async_fn: () => any, message: string) => {
  try {
    await async_fn()
    throw new Error('Should have thrown!')
  } catch (err) {
    expect(err.message).to.equal(message)
  }
}

describe('@fab/input-static', () => {
  it('should be a function', () => {
    expect(plugin.build).to.be.a('function')
  })

  it('should require a dir argument', async () => {
    await shouldThrow(
      () => plugin.build({}, new ProtoFab()),
      'Config file contains errors!'
    )
  })
})
