import { expect } from 'chai'
import { PluginMetadata, ProtoFab } from '@fab/core'
import { build } from '../src/build'

describe('@fab/input-nextjs', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })
})
