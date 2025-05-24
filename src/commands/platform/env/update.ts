import {Args, Command, Flags} from '@oclif/core'

export default class PlatformEnvUpdate extends Command {
  static override args = {
    file: Args.string({description: 'file to read'}),
  }
  static override description = 'This command has not been implemented yet. It is a placeholder for future functionality related to updating platform environments.'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PlatformEnvUpdate)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/dishantlangayan/Dev/solace-cloud-cli/src/commands/platform/env/update.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
