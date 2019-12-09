export interface PluginArgs {
  [arg_name: string]: string
}

export interface FabConfig {
  build: {
    [plugin_name: string]: PluginArgs
  }
  settings?: {
    [env_name: string]: {
      [var_name: string]: string
    }
  }
}

export interface FabPlugin {
  build: (args: PluginArgs, proto_fab: ProtoFab) => Promise<void>
  render: () => Response
}

export type FabFiles = Map<string, string>

export class ProtoFab {
  files: FabFiles

  constructor() {
    this.files = new Map()
  }

  readyForCompilation(): string | undefined {
    // todo: an empty directory is... valid?
    const files_in_wrong_place = []
    for (const filename of this.files.keys()) {
      if (filename !== '/server.js' && !filename.startsWith('/_assets/')) {
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
}
