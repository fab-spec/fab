import { expect } from 'chai'
import { build } from '../src/build'

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })
})
