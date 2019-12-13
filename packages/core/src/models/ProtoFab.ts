import { filenameOutsideFabLocations, getContentType } from '../helpers'
import { FabFileMetadata, FabFiles, PluginMetadata } from '../types'

export class ProtoFab<U extends PluginMetadata> {
  files: FabFiles
  metadata: U

  constructor(init_files: { [k: string]: string } = {}) {
    this.files = new Map(Object.entries(init_files))
    this.metadata = {} as U
  }

  readyForCompilation(): string | undefined {
    // todo: an empty directory is... valid?
    const files_in_wrong_place = []
    for (const filename of this.files.keys()) {
      if (filenameOutsideFabLocations(filename)) {
        files_in_wrong_place.push(filename)
      }
    }

    if (files_in_wrong_place.length > 0) {
      return `Build config leaves files outside of _assets dir: ${files_in_wrong_place.join(
        ', '
      )}`
    }
    return undefined
  }

  toJSON(): string {
    const file_metadata: FabFileMetadata = {}
    for (const [filename, contents] of this.files.entries()) {
      file_metadata[filename] = {
        content_type: getContentType(filename),
        content_length: contents.length,
      }
    }

    return JSON.stringify({
      files: file_metadata,
    })
  }
}
