import { FabBuildStep } from '@fab/core/lib'

export const build: FabBuildStep = async function build() {
  return [
    {
      runtime: './plugins/foo',
      plugin_args: {
        somewhere: 'over the rainbow',
      },
    },
  ]
}
