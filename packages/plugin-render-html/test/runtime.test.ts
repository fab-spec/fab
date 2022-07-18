import { expect } from 'chai'
import {
  FabFilesObject,
  FabResponderArgs,
  FABRuntime,
  FabSettings,
  ProtoFab,
} from '@dev-spendesk/fab-core'
import { build } from '../src/build'
import { RenderHtmlArgs, RenderHtmlMetadata } from '../src/types'

import runtime from '../src/runtime'
// todo: must be a better way to define this for the test run
import { Request, Response } from 'cross-fetch'
// @ts-ignore
global.Request = Request
// @ts-ignore
global.Response = Response

async function doBuild(files: FabFilesObject, args: RenderHtmlArgs) {
  const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
  await build(args, proto_fab)
  return proto_fab
}

function requestObj(path: string, settings: FabSettings): FabResponderArgs {
  // @ts-ignore our renderer only uses these two parts of the context
  return {
    url: new URL(`https://example.com${path}`),
    settings,
  }
}

describe('Runtime', () => {
  it('should inject settings', async () => {
    const args = {}
    const files = {
      '/index.html': `<html><head><title>HTML Test</title></head><body>here</body></html>`,
    }
    const proto_fab = await doBuild(files, args)
    const Runtime = new FABRuntime(proto_fab.metadata, {}, { bundle_id: '' })
    // @ts-ignore
    runtime(Runtime, args)
    const renderer = Runtime.getPipeline()[0]
    const response = (await renderer(
      requestObj('/', { SOME_VAR: 'some value', _SECRET_VAR: 'secret_value' })
    )) as Response
    expect(await response?.text()).to.equal(
      '<html><head><script>window.FAB_SETTINGS={"SOME_VAR":"some value"};</script><title>HTML Test</title></head><body>here</body></html>'
    )

    const reponse2 = (await renderer(
      requestObj('/', { MULTIPLE: 'vars', ARE: 'ok too' })
    )) as Response
    expect(await reponse2?.text()).to.equal(
      '<html><head><script>window.FAB_SETTINGS={"MULTIPLE":"vars","ARE":"ok too"};</script><title>HTML Test</title></head><body>here</body></html>'
    )
  })

  it('should ignore existing mustache templates', async () => {
    const args = {}
    const files = {
      '/index.html': `<html><head><title>{{{ titleStr }}}</title></head><body>{{ bodyText }}</body></html>`,
    }
    const proto_fab = await doBuild(files, args)
    const Runtime = new FABRuntime(proto_fab.metadata, {}, { bundle_id: '' })
    // @ts-ignore
    runtime(Runtime, args)
    const renderer = Runtime.getPipeline()[0]
    const response = (await renderer(
      requestObj('/', { SOME_VAR: 'some value' })
    )) as Response
    expect(await response?.text()).to.equal(
      '<html><head><script>window.FAB_SETTINGS={"SOME_VAR":"some value"};</script><title>{{{ titleStr }}}</title></head><body>{{ bodyText }}</body></html>'
    )
  })

  it('should inject settings with a different global', async () => {
    const args = {
      injections: {
        env: {
          name: 'ANOTHER_GLOBAL_NAME',
        },
      },
    }
    const files = {
      '/index.html': `<html><head><title>HTML Test</title></head><body>here</body></html>`,
    }
    const proto_fab = await doBuild(files, args)
    const Runtime = new FABRuntime(proto_fab.metadata, {}, { bundle_id: '' })
    // @ts-ignore
    runtime(Runtime, args)
    const renderer = Runtime.getPipeline()[0]
    const response = (await renderer(
      requestObj('/', { SOME_VAR: 'some value' })
    )) as Response
    expect(await response?.text()).to.equal(
      '<html><head><script>window.ANOTHER_GLOBAL_NAME={"SOME_VAR":"some value"};</script><title>HTML Test</title></head><body>here</body></html>'
    )
  })
})
