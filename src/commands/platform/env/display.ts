import { Command, Flags } from '@oclif/core'
import { table } from 'table'

import { Environment, EnvironmentApiResponse, EnvironmentDetail } from '../../../types/environment.js'
import { camelCaseToTitleCase } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvDisplay extends Command {
  static override args = {}
  static override description = `Display information about an Environment.
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Required token permissions: [ environments:view ]
  `
  static override examples = ['<%= config.bin %> <%= command.id %> --name=MyEnvName', '<%= config.bin %> <%= command.id %> --env-id=MyEnvId']
  static override flags = {
    'env-id': Flags.string({
      char: 'e',
      description: 'Id of the environment.',
      exactlyOne: ['env-id', 'name']
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the environment.',
      exactlyOne: ['env-id', 'name']
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PlatformEnvDisplay)

    const name = flags.name ?? ''
    const envId = flags['env-id'] ?? ''

    const conn = new ScConnection()

    // API url
    // If env name provided, get all environments matching provided name
    // If env id provided, get environment with that id
    let apiUrl: string = `/platform/environments`
    if (envId) {
      // API call to get environment by id
      apiUrl += `/${envId}`
      const resp = await conn.get<EnvironmentDetail>(apiUrl)
      this.print(resp.data)
    } else if (name) {
      // API call to get environment by name
      apiUrl += `?name=${name}`
      const resp = await conn.get<EnvironmentApiResponse>(apiUrl)
      for (const env of resp.data) {
        this.print(env)
      }
    } else {
      this.error('Either --env-id or --name must be provided.')
    }
  }

  private print(environment: Environment): void {
    this.log()
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(environment).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Table config
    const config = {
      columns: {
        1: { width: 50, wrapWord: true },
      },
      drawHorizontalLine(lineIndex: number, rowCount: number) {
        return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount
      },
    }
    this.log(table(tableRows, config))
  }
}
