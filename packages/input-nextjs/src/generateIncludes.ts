import fs from 'fs-extra'
import path from 'path'
import { BuildFailedError } from '@fab/cli/src'
import { error, log } from '../../../old-packages/fab-nextjs/src/utils'
import chalk from 'chalk'
import * as prettier from 'prettier'
import { mergeWebpacks } from './mergeWebpacks'

export default async function generateIncludes(
  js_renderers: string[],
  pages_dir: string
) {
  if (js_renderers.length > 0) {
    mergeWebpacks
  } else {
    // return something simpler
  }
}
