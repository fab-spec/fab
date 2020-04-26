import {
  FabFileMetadata,
  FabFiles,
  FabFilesObject,
  FabMetadata,
  PluginMetadata,
} from '../types'
import { filenameOutsideFabLocations, getContentType } from '../helpers'
import jsonKeysSort from 'json-keys-sort'

export class ProtoFab<U extends PluginMetadata = PluginMetadata> {
  files: FabFiles
  metadata: U
  hypotheticals: FabFilesObject

  constructor(init_files: FabFilesObject = {}, init_hypotheticals: FabFilesObject = {}) {
    this.files = new Map(
      Object.entries(init_files).map(([filename, contents]) => [
        filename,
        Buffer.from(contents),
      ])
    )
    this.metadata = {} as U
    this.hypotheticals = init_hypotheticals
  }

  errorsPreventingCompilation(): string | undefined {
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
    return JSON.stringify(jsonKeysSort.sort(this.serialisable()))
  }

  // For testing

  _getEntries() {
    return [...this.files.entries()].map(([filename, contents]) => [
      filename,
      contents.toString('utf8'),
    ])
  }
}
