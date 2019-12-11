import { RewireAssetsMetadata } from './types'

export async function render(metadata: RewireAssetsMetadata) {
  console.log('I am render time')
  return new Response('OK', {
    status: 200,
  })
}
