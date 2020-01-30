import { FabSettings } from '@fab/core'
import { DEFAULT_INJECTIONS } from '../constants'
import { EnvInjectionConfig } from '../types'

export function addInjectionPoint($: CheerioStatic) {
  $('head').prepend('{{{ FAB_ENV_INJECTION }}}')
}

export function generateReplacements(config: EnvInjectionConfig, settings: FabSettings) {
  const name = config.name || DEFAULT_INJECTIONS.env.name
  const settings_json = JSON.stringify(settings)
  return {
    FAB_ENV_INJECTION: `<script>window.${name}=${settings_json};</script>`,
  }
}
