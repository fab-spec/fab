@fab/cf-workers
===============

FAB releaser for Cloudflare Workers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/cf-workers.svg)](https://npmjs.org/package/@fab/cf-workers)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/cf-workers.svg)](https://npmjs.org/package/@fab/cf-workers)
[![License](https://img.shields.io/npm/l/@fab/cf-workers.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fab/cf-workers
$ fab-cf-workers COMMAND
running command...
$ fab-cf-workers (-v|--version|version)
@fab/cf-workers/0.0.0 darwin-x64 node-v12.6.0
$ fab-cf-workers --help [COMMAND]
USAGE
  $ fab-cf-workers COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab-cf-workers hello [FILE]`](#fab-cf-workers-hello-file)
* [`fab-cf-workers help [COMMAND]`](#fab-cf-workers-help-command)

## `fab-cf-workers hello [FILE]`

describe the command here

```
USAGE
  $ fab-cf-workers hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ fab-cf-workers hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/fab-spec/fab/blob/v0.0.0/src/commands/hello.ts)_

## `fab-cf-workers help [COMMAND]`

display help for fab-cf-workers

```
USAGE
  $ fab-cf-workers help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
