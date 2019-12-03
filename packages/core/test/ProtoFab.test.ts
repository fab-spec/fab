import { expect } from 'chai';
import { ProtoFab } from '@fab/core';

describe('ProtoFab', () => {
  it('should be able to be created with no args', () => {
    expect(new ProtoFab()).to.be.instanceOf(ProtoFab)
  })
})
