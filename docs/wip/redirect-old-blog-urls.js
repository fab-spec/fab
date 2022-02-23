// server/redirect-old-blog-urls/runtime.js

import { Runtime } from '@dev-spendesk/fab-core/runtime'

// We register a handler to match the old posts
Runtime.on('/posts/:id', async (matches, { request, settings, url }) => {
  // grab the :id off the request and look it up in the metadata
  const { id } = matches
  const new_article_url = Runtime.metadata.article_urls[id]

  // If the ID matches, we can return a 301 that points to it
  if (new_article_url) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: new_article_url,
      },
    })
  } else {
    // If the :id doesn't match anything we know of, we could render
    // a 404 ourselves here, but we could also just return undefined
    // to let the rest of the FAB runtime handle it.
    return undefined
  }
})
