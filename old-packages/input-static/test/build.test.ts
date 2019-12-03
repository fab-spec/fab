import plugin from '../src'
import * as expect from "expect";
import {ProtoFab} from "@fab/core";

describe('@fab/input-static', () => {
  it('should be a function', () => {
    expect(typeof(plugin.build)).toBe('function')
  })

  it('should require a dir argument', () => {
    expect(() => plugin.build({}, new ProtoFab())).toThrow('Config file contains errors!')
  })
})
