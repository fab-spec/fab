@fab/nextjs
===========

FAB compiler for NextJS projects

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/nextjs.svg)](https://npmjs.org/package/@fab/nextjs)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/nextjs.svg)](https://npmjs.org/package/@fab/nextjs)
[![License](https://img.shields.io/npm/l/@fab/nextjs.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fab/nextjs
$ fab-nextjs COMMAND
running command...
$ fab-nextjs (-v|--version|version)
@fab/nextjs/0.0.0 darwin-x64 node-v11.1.0
$ fab-nextjs --help [COMMAND]
USAGE
  $ fab-nextjs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab-nextjs hello [FILE]`](#fab-nextjs-hello-file)
* [`fab-nextjs help [COMMAND]`](#fab-nextjs-help-command)

## `fab-nextjs hello [FILE]`

describe the command here

```
USAGE
  $ fab-nextjs hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ fab-nextjs hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/fab-spec/fab/blob/v0.0.0/src/commands/hello.ts)_

## `fab-nextjs help [COMMAND]`

display help for fab-nextjs

```
USAGE
  $ fab-nextjs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_
<!-- commandsstop -->
