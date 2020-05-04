import { FABRuntime, Priority } from '@fab/core'
// import { checkValidity } from 'somewhere'
const checkValidity = (str: string) => str.startsWith('AUTHED')

export default ({ Router }: FABRuntime) => {
  // Could also use Router.on('*') here
  Router.onAll(async ({ request }) => {
    const cookie = request.cookies['My-Auth']
    if (!cookie || !checkValidity(cookie)) {
      // Allow the rest of the handlers to proceed
      return undefined
    } else {
      return new Response(null, {
        status: 401,
        statusText: 'Unauthorized',
      })
    }
  }, Priority.FIRST)
}
