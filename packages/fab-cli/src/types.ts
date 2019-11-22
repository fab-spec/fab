export interface FabConfig {
  settings?: {
    [env_name: string]: {
      [var_name: string]: string
    }
  }
}
