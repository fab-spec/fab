@fab/afterjs
============

FAB compiler for After.js projects

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/afterjs.svg)](https://npmjs.org/package/@fab/afterjs)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/afterjs.svg)](https://npmjs.org/package/@fab/afterjs)
[![License](https://img.shields.io/npm/l/@fab/afterjs.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fab/afterjs
$ fab-afterjs COMMAND
running command...
$ fab-afterjs (-v|--version|version)
@fab/afterjs/0.1.2 darwin-x64 node-v11.1.0
$ fab-afterjs --help [COMMAND]
USAGE
  $ fab-afterjs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab-afterjs build [DIRECTORY]`](#fab-afterjs-build-directory)
* [`fab-afterjs help [COMMAND]`](#fab-afterjs-help-command)
* [`fab-afterjs setup [DIRECTORY]`](#fab-afterjs-setup-directory)
* [`fab-afterjs teardown [DIRECTORY]`](#fab-afterjs-teardown-directory)

## `fab-afterjs build [DIRECTORY]`

describe the command here

```
USAGE
  $ fab-afterjs build [DIRECTORY]

OPTIONS
  -h, --help                     show CLI help
  -o, --output=output            [default: fab.zip] Output FAB file
  -v, --version                  show CLI version
  -w, --working-dir=working-dir  [default: .fab] Working FAB directory
  --intermediate-only

EXAMPLE
  $ fab-afterjs build ~/src/my-project
```

_See code: [src/commands/build.ts](https://github.com/fab-spec/fab/blob/v0.1.2/src/commands/build.ts)_

## `fab-afterjs help [COMMAND]`

display help for fab-afterjs

```
USAGE
  $ fab-afterjs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_

## `fab-afterjs setup [DIRECTORY]`

describe the command here

```
USAGE
  $ fab-afterjs setup [DIRECTORY]

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

_See code: [src/commands/setup.ts](https://github.com/fab-spec/fab/blob/v0.1.2/src/commands/setup.ts)_

## `fab-afterjs teardown [DIRECTORY]`

describe the command here

```
USAGE
  $ fab-afterjs teardown [DIRECTORY]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/teardown.ts](https://github.com/fab-spec/fab/blob/v0.1.2/src/commands/teardown.ts)_
<!-- commandsstop -->
