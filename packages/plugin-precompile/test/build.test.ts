import { expect } from 'chai'
import { ProtoFab } from '@fab/core'
import { build } from '../src/build'
import { NodeCompatMetadata } from '../src/types'
import path from 'path'

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })
})
