import {
  FabFileMetadata,
  FabFiles,
  FabFilesObject,
  FabMetadata,
  PluginMetadata,
} from '../types'
import { filenameOutsideFabLocations, getContentType } from '../helpers'

export class ProtoFab<U extends PluginMetadata = PluginMetadata> {
  files: FabFiles
  metadata: U

  constructor(init_files: FabFilesObject = {}) {
    this.files = new Map(Object.entries(init_files))
    this.metadata = {} as U
  }

  errorsPreventingCompilation(): string | undefined {
    // todo: an empty directory is... valid?
    const files_in_wrong_place = []
    for (const filename of this.files.keys()) {
      console.log(filename)
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

  serialisable(): FabMetadata {
    const file_metadata: FabFileMetadata = {}
    for (const [filename, contents] of this.files.entries()) {
      file_metadata[filename] = {
        content_type: getContentType(filename),
        content_length: contents.length,
      }
    }
    return {
      file_metadata,
      plugin_metadata: this.metadata,
    }
  }

  toJSON(): string {
    return JSON.stringify(this.serialisable())
  }
}
