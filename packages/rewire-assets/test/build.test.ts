import plugin from '../src'
import { expect } from 'chai';

describe('Build time', () => {
  it('should be a function', () => {
    expect(plugin.build).to.be.a('function')
    plugin.build()
  })
})
