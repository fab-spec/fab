export interface FabConfig {
  build: {
    [plugin_name: string]: {
      [arg_name: string]: string
    }
  },
  settings?: {
    [env_name: string]: {
      [var_name: string]: string
    }
  }
}
