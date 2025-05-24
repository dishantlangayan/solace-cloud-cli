import {Command, Flags} from '@oclif/core'

import { EnvironmentApiResponse } from '../../../types/environment.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class PlatformEnvDelete extends Command {
  static override args = {}
  static override description = `Delete an environment using either its name or unique identifier. The default environment cannot be deleted.

  Token Permissions: [ environments:edit ]`
  static override examples = ['<%= config.bin %> <%= command.id %> --name=MyEnvName', '<%= config.bin %> <%= command.id %> --env-id=MyEnvId']
  static override flags = {
    // flag for getting environment by id (-e, --env-id)
    'env-id': Flags.string({char: 'e', description: 'Id of the environment.', exactlyOne: ['env-id', 'name']}),
    // flag for getting environment by name (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'Name of the environment.', exactlyOne: ['env-id', 'name']}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(PlatformEnvDelete)

    const name = flags.name ?? ''
    const envId = flags['env-id'] ?? ''

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/platform/environments`
    let envIdToDelete: string | undefined = envId

    // If env name provided, get the environment matching provided name and delete. If more than one environment matches, an error will be thrown.
    // If env id provided, delete environment with that id
    if (name) {
      // API call to get environment by name
      const getEnvApiUrl = `${apiUrl}?name=${name}`
      const resp = await conn.get<EnvironmentApiResponse>(getEnvApiUrl)
      if( resp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envIdToDelete = resp.data[0]?.id
      }
    }

    // API call to delete environment by id
    apiUrl += `/${envIdToDelete}`
    await conn.delete<string>(apiUrl)
    this.log(`Environment with id '${envIdToDelete}' has been deleted successfully.`)
  }
}
