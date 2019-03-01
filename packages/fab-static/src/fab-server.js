const URL_ALIASES = {
  '/eh?no-assets-dir': '/kb/why-assets-are-important'
}

export async function route(path) {
  const alias_url = URL_ALIASES[path]

  if (alias_url) return alias_url

  return path
}
