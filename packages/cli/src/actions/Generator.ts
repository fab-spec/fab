import { BuildFailedError, ProtoFab } from '@fab/core'
import fs from 'fs-extra'
import path from 'path'
import util from 'util'
// @ts-ignore
import _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export class Generator {
  static async generate(proto_fab: ProtoFab) {
    // After build, there should only be files in the expected places (server.js, _assets)
    const invalid_reason = proto_fab.errorsPreventingCompilation()
    if (invalid_reason) {
      throw new BuildFailedError(`FAB is not ready for compilation.
${invalid_reason}
You might need to add @fab/rewire-assets to your 'build' config. See https://fab.dev/packages/rewire-assets for more information about what this module is and why it's needed.
`)
    }

    console.log(`Writing all files to .fab/build`)
    await fs.emptyDir('.fab/build')
    for (const [filename, contents] of proto_fab.files.entries()) {
      const path = `.fab/build${filename}`
      await fs.ensureFile(path)
      await fs.writeFile(path, contents)
    }

    console.log(`Zipping it up into a FAB`)
    const zipfile = path.resolve('fab.zip')
    const build_dir = path.resolve('.fab/build')
    const options = {
      includes: ['./server.js', './_assets/**'],
      cwd: build_dir,
    }
    await zip(build_dir, zipfile, options)
    const stats2 = await fs.stat(zipfile)
    console.log(
      `    ${path.relative(process.cwd(), zipfile)} (${Math.round(stats2.size / 1024) +
        'KB'})`
    )
  }
}
