import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {EnvironmentApiResponse, EnvironmentListApiResponse} from '../../../types/environment.js'
import {printObjectAsKeyValueTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class PlatformEnvDisplay extends ScCommand<typeof PlatformEnvDisplay> {
  static override args = {}
  static override description = `Display information about an Environment.
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Required token permissions: [ environments:view ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyEnvName',
    '<%= config.bin %> <%= command.id %> --env-id=MyEnvId',
  ]
  static override flags = {
    'env-id': Flags.string({
      char: 'e',
      description: 'Id of the environment.',
      exactlyOne: ['env-id', 'name'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the environment.',
      exactlyOne: ['env-id', 'name'],
    }),
  }

  public async run(): Promise<EnvironmentApiResponse | EnvironmentListApiResponse> {
    const {flags} = await this.parse(PlatformEnvDisplay)

    const name = flags.name ?? ''
    const envId = flags['env-id'] ?? ''

    const conn = new ScConnection()

    // API url
    // If env name provided, get all environments matching provided name
    // If env id provided, get environment with that id
    let apiUrl: string = `/platform/environments`
    let resp: EnvironmentApiResponse | EnvironmentListApiResponse
    if (envId) {
      // API call to get environment by id
      apiUrl += `/${envId}`
      resp = await conn.get<EnvironmentApiResponse>(apiUrl)
      this.log(printObjectAsKeyValueTable(resp.data as unknown as Record<string, unknown>))
    } else {
      // API call to get environment by name
      apiUrl += `?name=${name}`
      resp = await conn.get<EnvironmentListApiResponse>(apiUrl)
      for (const env of resp.data) {
        this.log(printObjectAsKeyValueTable(env as unknown as Record<string, unknown>))
      }
    }

    // Return raw json if --json flag is set
    return resp
  }
}
