import {
  ProtoFab,
  PluginArgs,
  PluginMetadataContent,
  FabBuildStep,
  FabPluginRuntime,
  PluginMetadata,
  FabSettings,
} from '@dev-spendesk/fab-core'

export const build: FabBuildStep = async (args: PluginArgs, proto_fab: ProtoFab) => {
  const plugin_metadata: PluginMetadataContent = {}

  for (const [filename, contents] of proto_fab.files.entries()) {
    // Look for anything looking like /blog/123-new-post-format
    const new_blog_format = filename.match(/^\/blog\/(\d+)/)
    if (new_blog_format) {
      const blog_id = new_blog_format[1]
      // Add it to our plugin_metadata that gets passed to our runtime
      plugin_metadata[blog_id] = filename
    }
  }

  proto_fab.metadata.blog_rewrites = plugin_metadata
}

export const runtime: FabPluginRuntime = (args: PluginArgs, metadata: PluginMetadata) => {
  // Runtime functions are synchronous in order to perform any setup needed
  const { blog_rewrites } = metadata

  return async ({
    request,
    settings,
    url,
  }: {
    request: Request
    settings: FabSettings
    url: URL
  }) => {
    const old_blog_format = url.pathname.match(/^\/articles\/(\d+)/)
    if (!old_blog_format) return undefined

    const blog_id = old_blog_format[1]
    const new_blog_url = blog_rewrites[blog_id]
    if (!new_blog_url) {
      return new Response(null, { status: 404 })
    } else {
      return new Response(null, {
        status: 301,
        headers: {
          Location: new_blog_url,
        },
      })
    }
  }
}
