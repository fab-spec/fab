const REDIRECTS = {
  '/eh?no-assets-dir': '/kb/why-assets-are-important'
}

export async function route(path) {
  const maybe_redirect = REDIRECTS[path]

  if (maybe_redirect) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: maybe_redirect
      }
    })
  }

  return path
}
