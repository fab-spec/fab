// @ts-ignore
import renderers from 'generated-nextjs-renderers.js'

export function runtime() {
  console.log(renderers)
  return async function responder() {}
}
