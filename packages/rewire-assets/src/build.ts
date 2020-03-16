import { ProtoFab, filenameOutsideFabLocations, getContentType } from '@fab/core'
import {
  InlineAssets,
  RenamedAssets,
  RewireAssetsArgs,
  RewireAssetsMetadata,
} from './types'
import hasha from 'hasha'
import path from 'path'
import { InvalidConfigError } from '@fab/cli'
// @ts-ignore
import { isBinaryPromise } from 'istextorbinary'
import { DEFAULT_IMMUTABILITY_CHECK } from './constants'

export async function build(
  args: RewireAssetsArgs,
  proto_fab: ProtoFab<RewireAssetsMetadata>
) {
  const {
    'inline-threshold': inline_threshold = 8192,
    'treat-as-immutable': immutable_regexp = DEFAULT_IMMUTABILITY_CHECK,
  } = args

  if (Number.isNaN(inline_threshold)) {
    throw new InvalidConfigError(`'inline-threshold' value must be a number!`)
  }
  if (!(immutable_regexp instanceof RegExp)) {
    throw new InvalidConfigError(
      `'treat-as-immutable' value must be a regex-parser compatible RegExp string!`
    )
  }

  const to_inline = []
  const to_rename = []
  for (const [filename, contents] of proto_fab.files.entries()) {
    if (filenameOutsideFabLocations(filename)) {
      if (
        contents.length > inline_threshold ||
        (await isBinaryPromise(filename, contents))
      ) {
        to_rename.push(filename)
      } else {
        to_inline.push(filename)
      }
    }
  }

  const inlined_assets: InlineAssets = {}
  for (const filename of to_inline) {
    inlined_assets[filename] = {
      contents: proto_fab.files.get(filename)!.toString('utf8'),
      content_type: getContentType(filename),
      immutable: !!immutable_regexp.exec(filename),
    }
    // We got this, yo.
    proto_fab.files.delete(filename)
  }

  const renamed_assets: RenamedAssets = {}
  for (const filename of to_rename) {
    const contents = proto_fab.files.get(filename)!
    const hash = hasha(contents, { algorithm: 'md5' }).slice(0, 9)
    const immutable = !!immutable_regexp.exec(filename)
    const extname = path.extname(filename)
    const asset_path = `/_assets${
      immutable ? filename : filename.slice(0, -1 * extname.length) + '.' + hash + extname
    }`

    renamed_assets[filename] = {
      asset_path,
      immutable,
    }

    // "Move" the file by changing its key
    proto_fab.files.set(asset_path, contents)
    proto_fab.files.delete(filename)
  }

  proto_fab.metadata.rewire_assets = { inlined_assets, renamed_assets }
}
