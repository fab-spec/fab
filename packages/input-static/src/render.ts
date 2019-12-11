import { InputStaticMetadata } from './types'

export async function render(metadata: InputStaticMetadata) {
  console.log('I am render time')
  return new Response('OK', {
    status: 200,
  })
}
