@solacecloud/cli
=================

The Solace Cloud CLI


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@solacecloud/cli.svg)](https://npmjs.org/package/@solacecloud/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@solacecloud/cli.svg)](https://npmjs.org/package/@solacecloud/cli)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/license/apache-2-0)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @solacecloud/cli
$ sc COMMAND
running command...
$ sc (--version)
@solacecloud/cli/0.0.0 darwin-arm64 node-v23.7.0
$ sc --help [COMMAND]
USAGE
  $ sc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sc platform env create`](#sc-platform-env-create)
* [`sc platform env delete`](#sc-platform-env-delete)
* [`sc platform env display`](#sc-platform-env-display)
* [`sc platform env list`](#sc-platform-env-list)
* [`sc help [COMMAND]`](#sc-help-command)
* [`sc plugins`](#sc-plugins)
* [`sc plugins add PLUGIN`](#sc-plugins-add-plugin)
* [`sc plugins:inspect PLUGIN...`](#sc-pluginsinspect-plugin)
* [`sc plugins install PLUGIN`](#sc-plugins-install-plugin)
* [`sc plugins link PATH`](#sc-plugins-link-path)
* [`sc plugins remove [PLUGIN]`](#sc-plugins-remove-plugin)
* [`sc plugins reset`](#sc-plugins-reset)
* [`sc plugins uninstall [PLUGIN]`](#sc-plugins-uninstall-plugin)
* [`sc plugins unlink [PLUGIN]`](#sc-plugins-unlink-plugin)
* [`sc plugins update`](#sc-plugins-update)

## `sc platform env create`

Create a new environment.

```
USAGE
  $ sc platform env create -n <value> [-d <value>] [--isDefault] [--isProduction]

FLAGS
  -d, --desc=<value>  Description of the environment to create.
  -n, --name=<value>  (required) Name of the environment to create.
      --isDefault     Indicates this is the organization’s default environment.
      --isProduction  Indicates this is an organization’s production environment.
                      This is an immutable field. If an environment needs to be migrated,
                      architecture can be migrated to a new environment with the desired
                      environment type instead.

DESCRIPTION
  Create a new environment.

  Token Permissions: [ environments:edit ]

EXAMPLES
  $ sc platform env create
```

_See code: [src/commands/platform/env/create.ts](https://github.com/dishantlangayan/solace-cloud-cli/blob/v0.0.0/src/commands/platform/env/create.ts)_

## `sc platform env delete`

Delete an environment using either its name or unique identifier. The default environment cannot be deleted.

```
USAGE
  $ sc platform env delete [-e <value>] [-n <value>]

FLAGS
  -e, --env-id=<value>  Id of the environment.
  -n, --name=<value>    Name of the environment.

DESCRIPTION
  Delete an environment using either its name or unique identifier. The default environment cannot be deleted.

  Token Permissions: [ environments:edit ]

EXAMPLES
  $ sc platform env delete --name=MyEnvName

  $ sc platform env delete --env-id=MyEnvId
```

_See code: [src/commands/platform/env/delete.ts](https://github.com/dishantlangayan/solace-cloud-cli/blob/v0.0.0/src/commands/platform/env/delete.ts)_

## `sc platform env display`

Display information about an Environment.

```
USAGE
  $ sc platform env display [-e <value>] [-n <value>]

FLAGS
  -e, --env-id=<value>  Id of the environment.
  -n, --name=<value>    Name of the environment.

DESCRIPTION
  Display information about an Environment.

  Use either the Environment's ID (--env-id) or name of the Environment (--name).

  Required token permissions: [ environments:view ]


EXAMPLES
  $ sc platform env display --name=MyEnvName

  $ sc platform env display --env-id=MyEnvId
```

_See code: [src/commands/platform/env/display.ts](https://github.com/dishantlangayan/solace-cloud-cli/blob/v0.0.0/src/commands/platform/env/display.ts)_

## `sc platform env list`

Get a list of all Environments.

```
USAGE
  $ sc platform env list [--json] [--log-level debug|warn|error|info|trace] [-n <value>] [--pageNumber <value>] [--pageSize <value>] [--sort <value>]

FLAGS
  -n, --name=<value>        Name of the environment to match on.
      --pageNumber=<value>  The page number to get. Defaults to 10
      --pageSize=<value>    The number of environments to get per page. Defaults to 1
      --sort=<value>        The query (fieldName:<ASC/DESC>) used to sort the environment list in the response.

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Get a list of all Environments.

  Required token permissions: [ environments:view ]

EXAMPLES
  $ sc platform env list

  $ sc platform env list --name=Default --pageNumber=1 --pageSize=10 --sort=name:ASC
```

_See code: [src/commands/platform/env/list.ts](https://github.com/dishantlangayan/solace-cloud-cli/blob/v0.0.0/src/commands/platform/env/list.ts)_

## `sc help [COMMAND]`

Display help for sc.

```
USAGE
  $ sc help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sc.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `sc plugins`

List installed plugins.

```
USAGE
  $ sc plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ sc plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/index.ts)_

## `sc plugins add PLUGIN`

Installs a plugin into sc.

```
USAGE
  $ sc plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into sc.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ sc plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ sc plugins add myplugin

  Install a plugin from a github url.

    $ sc plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ sc plugins add someuser/someplugin
```

## `sc plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ sc plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ sc plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/inspect.ts)_

## `sc plugins install PLUGIN`

Installs a plugin into sc.

```
USAGE
  $ sc plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into sc.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ sc plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ sc plugins install myplugin

  Install a plugin from a github url.

    $ sc plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ sc plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/install.ts)_

## `sc plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ sc plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ sc plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/link.ts)_

## `sc plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ sc plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sc plugins unlink
  $ sc plugins remove

EXAMPLES
  $ sc plugins remove myplugin
```

## `sc plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ sc plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/reset.ts)_

## `sc plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ sc plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sc plugins unlink
  $ sc plugins remove

EXAMPLES
  $ sc plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/uninstall.ts)_

## `sc plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ sc plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ sc plugins unlink
  $ sc plugins remove

EXAMPLES
  $ sc plugins unlink myplugin
```

## `sc plugins update`

Update installed plugins.

```
USAGE
  $ sc plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/update.ts)_
<!-- commandsstop -->
