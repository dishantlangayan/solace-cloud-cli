import { Flags } from '@oclif/core'

import { ScCommand } from '../../../sc-command.js'
import { Environment, EnvironmentDetail } from '../../../types/environment.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvCreate extends ScCommand<typeof PlatformEnvCreate> {
  static override args = {}
  static override description = `Create a new environment.

  Token Permissions: [ environments:edit ]`
  static override examples = ['<%= config.bin %> <%= command.id %> --name=MyEnvironment --desc="My environment description" --isDefault --isProduction']
  static override flags = {
    description: Flags.string({
      char: 'd',
      description: 'Description of the environment to create.'
    }),
    isDefault: Flags.boolean({
      description: 'Indicates this is the organization’s default environment.'
    }),
    isProduction: Flags.boolean({
      description: `Indicates this is an organization’s production environment. 
      This is an immutable field. If an environment needs to be migrated, 
      architecture can be migrated to a new environment with the desired 
      environment type instead.`,
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the environment to create.',
      required: true
    }),
  }

  public async run(): Promise<Environment> {
    const { flags } = await this.parse(PlatformEnvCreate)

    const name = flags.name ?? ''
    const desc = flags.description ?? ''
    const isDefault = flags.isDefault ?? false
    const isProduction = flags.isProduction ?? false

    const conn = new ScConnection()

    // API url
    const apiUrl: string = `/platform/environments`
    // API body
    const body = {
      ...(desc && { description: desc }),
      isDefault,
      isProduction,
      name,
    }

    // API call
    const resp = await conn.post<EnvironmentDetail>(apiUrl, body)

    // Display results
    this.log('Environment created successfully.')
    this.print(resp.data)

    // Return raw json if --json flag is set
    return resp.data
  }

  private print(environment: Environment): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(environment).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows))
  }
}
