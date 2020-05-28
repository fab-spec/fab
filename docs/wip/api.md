---
title: 'API Reference'
position: 400
category: API
---

# API Reference

## `ProtoFab`

Part of `@fab/core`. Represents an in-memory FAB being built.

### `ProtoFab.files`

A `Map<string, Buffer>` that represents in-memory all the files that will be added to the FAB. Plugins can read & write to this map instead of talking directly to the filesystem. Whatever is in here at the end of the build process will be zipped up into the FAB itself.

Note: most FAB builds will end with `@fab/plugin-rewire-assets` that will take anything `.files` that doesn't match FAB's structure and move/fingerprint them and generate a server component as required.

### `ProtoFab.getMetadata<T extends PluginMetadata = PluginMetadata>`

A typesafe way to access the `metadata` object, e.g.:

```ts
import { PluginMetadata } from '@fab/core'

// types.ts
export interface TsExampleMetadata extends PluginMetadata {
  my_plugin_name: {
    my_metadata_key: string
  }
}
```

```ts
// runtime.ts
import { Runtime } from '@fab/core/runtime'
import { TsExampleMetadata } from './types'

const metadata = Runtime.getMetadata<TsExampleMetadata>()
// metadata will now have: my_plugin_name.my_metadata_key
```
