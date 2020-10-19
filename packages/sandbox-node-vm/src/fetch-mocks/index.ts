/*

# Fetch mocks for FAB Node env

> Note: See https://github.com/fab-spec/fab/issues/264 for more info

This directory collects all the dark wizardry required to make `node-fetch` (which gives us a fetch-like interface on Node) _appear_ exactly like Fetch & Web Streams.

The complication comes from code like `fetch(x).then(response => response.json()` which `node-fetch` handles internally using _Node_ streams, not Web streams. So we can't just blindly convert all Responses to Web streams.

This is a temporary state of affairs. See the above referenced issue for the surrounding discussion.

*/

// Map global.ReadableStream before importing anything else
import './globalReadableStream'

export * from './HybridReadableStream'
export * from './isRequest'
export * from './enhanced_fetch'
