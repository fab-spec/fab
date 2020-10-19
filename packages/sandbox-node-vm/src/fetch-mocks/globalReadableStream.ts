import { ReadableStream as WebReadableStream } from 'web-streams-polyfill/es2018'

// @ts-ignore
global.ReadableStream = WebReadableStream
