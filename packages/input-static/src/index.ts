import {FabPlugin, PluginArgs, ProtoFab, InvalidConfigError} from "@fab/core";
import globby from 'globby'
import path from "path";

class InputStatic implements FabPlugin {
  async build(args: PluginArgs, proto_fab: ProtoFab) {
    const { dir } = args

    // Todo: dir needs to exist
    if (!dir) throw new InvalidConfigError(`@fab/input-static requires an argument of 'dir'.`)

    // Todo: proto_fab needs to have no .files yet

    console.log(`I am input static! Reading files from ${dir}`)

    const files = await globby([path.join(dir, '**', '*')])
    console.log({files})
  }

  render() {
    console.log("I am render time")
    return new Response('OK', {
      status: 200
    })
  }
}

export default new InputStatic()
