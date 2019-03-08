---
name: "@fab/nextjs"
route: "/packages/fab-nextjs"
menu: Packages
---

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
@fab/nextjs/0.1.0-2 darwin-x64 node-v11.1.0
$ fab-nextjs --help [COMMAND]
USAGE
  $ fab-nextjs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab-nextjs build [DIRECTORY]`](#fab-nextjs-build-directory)
* [`fab-nextjs help [COMMAND]`](#fab-nextjs-help-command)

## `fab-nextjs build [DIRECTORY]`

Build a NextJS project into a FAB

```
USAGE
  $ fab-nextjs build [DIRECTORY]

OPTIONS
  -h, --help                     show CLI help
  -o, --output=output            [default: fab.zip] Output FAB file
  -v, --version                  show CLI version
  -w, --working-dir=working-dir  [default: .fab] Working FAB directory
  --intermediate-only

EXAMPLE
  $ fab-nextjs build
```

_See code: [src/commands/build.ts](https://github.com/fab-spec/fab/blob/v0.1.0-2/src/commands/build.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
