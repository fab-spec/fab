import {FabPlugin, PluginArgs, ProtoFab, InvalidConfigError} from "@fab/core";

class InputStatic implements FabPlugin {
  build = (args: PluginArgs, proto_fab: ProtoFab) => {
    const { dir } = args

    // Todo: dir needs to exist
    if (!dir) throw new InvalidConfigError(`@fab/input-static requires an argument of 'dir'.`)

    // Todo: proto_fab needs to have no .files yet

    console.log(`I am input static! Reading files from ${dir}`)
  }

  render = () => {
    console.log("I am render time")
    return new Response('OK', {
      status: 200
    })
  }
}

export default new InputStatic()
