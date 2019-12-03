import plugin from '../src'
import { expect } from 'chai';
import {ProtoFab} from "@fab/core";

describe('@fab/input-static', () => {
  it('should be a function', () => {
    expect(plugin.build).to.be.a('function')
  })

  it('should require a dir argument', () => {
    expect(() => plugin.build({}, new ProtoFab())).to.throw('Config file contains errors!')
  })
})
