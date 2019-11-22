@fab/cli
========

The CLI entry-point for the FAB ecosystem

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/cli.svg)](https://npmjs.org/package/@fab/cli)
[![CircleCI](https://circleci.com/gh/fab-spec/fab/tree/master.svg?style=shield)](https://circleci.com/gh/fab-spec/fab/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/cli.svg)](https://npmjs.org/package/@fab/cli)
[![License](https://img.shields.io/npm/l/@fab/cli.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fab/cli
$ fab COMMAND
running command...
$ fab (-v|--version|version)
@fab/cli/0.0.1 darwin-x64 node-v12.6.0
$ fab --help [COMMAND]
USAGE
  $ fab COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab build`](#fab-build)
* [`fab help [COMMAND]`](#fab-help-command)

## `fab build`

describe the command here

```
USAGE
  $ fab build

OPTIONS
  -c, --config=config  [default: fab.config.json5] Path to config file
  -h, --help           show CLI help

EXAMPLE
  $ fab hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/build.ts](https://github.com/fab-spec/fab/blob/v0.0.1/src/commands/build.ts)_

## `fab help [COMMAND]`

display help for fab

```
USAGE
  $ fab help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
