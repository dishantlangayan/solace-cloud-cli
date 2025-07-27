import { Flags } from '@oclif/core'

import { ScCommand } from '../../../sc-command.js'
import { Environment, EnvironmentApiResponse, EnvironmentDetail } from '../../../types/environment.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvDisplay extends ScCommand<typeof PlatformEnvDisplay> {
  static override args = {}
  static override description = `Display information about an Environment.
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Required token permissions: [ environments:view ]`
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

  public async run(): Promise<Environment[]> {
    const { flags } = await this.parse(PlatformEnvDisplay)

    const name = flags.name ?? ''
    const envId = flags['env-id'] ?? ''

    const conn = new ScConnection()

    // API url
    // If env name provided, get all environments matching provided name
    // If env id provided, get environment with that id
    let apiUrl: string = `/platform/environments`
    let rawResp: Environment[]
    if (envId) {
      // API call to get environment by id
      apiUrl += `/${envId}`
      const resp = await conn.get<EnvironmentDetail>(apiUrl)
      this.print(resp.data)
      rawResp = [resp.data]
    } else if (name) {
      // API call to get environment by name
      apiUrl += `?name=${name}`
      const resp = await conn.get<EnvironmentApiResponse>(apiUrl)
      for (const env of resp.data) {
        this.print(env)
      }
      
      rawResp = resp.data
    } else {
      this.error('Either --env-id or --name must be provided.')
    }

    // Return raw json if --json flag is set
    return rawResp
  }

  private print(environment: Environment): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(environment).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows, { 1: { width: 50, wrapWord: true } }))
  }
}
