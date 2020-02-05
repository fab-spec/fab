import renderers from 'generated-nextjs-renderers'

export function runtime() {
  console.log(renderers)
  return async function responder() {}
}
