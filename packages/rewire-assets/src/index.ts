import path from 'path'
import mime from 'mime-types'
import hasha from 'hasha'
import {
  DEFAULT_MIME_TYPE,
  filenameOutsideFabLocations,
  InvalidConfigError,
  ProtoFab,
} from '@fab/core'
import {
  InlineAssets,
  RenamedAssets,
  RewireAssetsArgs,
  RewireAssetsMetadata,
} from './types'

const getContentType = (pathname: string) => {
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || DEFAULT_MIME_TYPE
}

export async function build(
  args: RewireAssetsArgs,
  proto_fab: ProtoFab<RewireAssetsMetadata>
) {
  const {
    'inline-threshold': inline_threshold = 8192,
    'treat-as-immutable': immutable_regexp = /\.[0-9A-F]{8,}\./i,
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
      if (contents.length > inline_threshold) {
        to_rename.push(filename)
      } else {
        to_inline.push(filename)
      }
    }
  }

  const inlined_assets: InlineAssets = new Map()
  for (const filename of to_inline) {
    inlined_assets.set(filename, {
      contents: proto_fab.files.get(filename)!,
      content_type: getContentType(filename),
    })
    // We got this, yo.
    proto_fab.files.delete(filename)
  }

  const renamed_assets: RenamedAssets = new Map()
  for (const filename of to_rename) {
    const contents = proto_fab.files.get(filename)!
    const hash = hasha(contents, { algorithm: 'md5' }).slice(0, 9)
    const immutable = !!immutable_regexp.exec(filename)
    const extname = path.extname(filename)
    const asset_path = `_assets/${
      immutable ? filename : filename.slice(0, -1 * extname.length) + '.' + hash + extname
    }`

    renamed_assets.set(filename, {
      asset_path,
      immutable,
    })

    // "Move" the file by changing its key
    proto_fab.files.set(asset_path, contents)
    proto_fab.files.delete(filename)
  }

  proto_fab.metadata.rewire_assets = { inlined_assets, renamed_assets }
}
