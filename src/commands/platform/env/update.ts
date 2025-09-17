import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {EnvironmentApiResponse, EnvironmentListApiResponse} from '../../../types/environment.js'
import {printObjectAsKeyValueTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class PlatformEnvUpdate extends ScCommand<typeof PlatformEnvUpdate> {
  static override args = {}
  static override description = `Modify an environment's attributes
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Token Permissions: [ environments:edit ]
  `
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyEnvName --new-name=MyNewEnvName --description="My description to update" --isDefault',
    '<%= config.bin %> <%= command.id %> --env-id=MyEnvId --new-name=MyNewEnvName --description="My description to update" --isDefault',
  ]
  static override flags = {
    description: Flags.string({
      char: 'd',
      description: 'Description of the environment to update.',
    }),
    'env-id': Flags.string({
      char: 'e',
      description: 'Id of the environment.',
      exactlyOne: ['env-id', 'name'],
    }),
    isDefault: Flags.boolean({
      description: `Indicates this is the organization's default environment. The default value is false.`,
    }),
    name: Flags.string({
      char: 'n',
      description: 'Current name of the environment.',
      exactlyOne: ['env-id', 'name'],
    }),
    'new-name': Flags.string({
      description: 'New name of the environment.',
    }),
  }

  public async run(): Promise<EnvironmentApiResponse> {
    const {flags} = await this.parse(PlatformEnvUpdate)

    const desc = flags.description ?? ''
    const envId = flags['env-id'] ?? ''
    const name = flags.name ?? ''
    const newName = flags['new-name'] ?? ''

    // API body
    const body = {
      ...(flags.isDefault && {isDefault: flags.isDefault}),
      ...(desc && {description: desc}),
      ...(newName && {name: newName}),
    }

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/platform/environments`
    let envIdToUpdate: string | undefined = envId

    // If env name provided, get the environment matching provided name and delete. If more than one environment matches, an error will be thrown.
    // If env id provided, delete environment with that id
    if (name) {
      // API call to get environment by name
      const getEnvApiUrl = `${apiUrl}?name=${name}`
      const resp = await conn.get<EnvironmentListApiResponse>(getEnvApiUrl)
      if (resp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envIdToUpdate = resp.data[0]?.id
      }
    }

    // API call to update environment by id
    apiUrl += `/${envIdToUpdate}`
    const resp = await conn.put<EnvironmentApiResponse>(apiUrl, body)

    this.log(printObjectAsKeyValueTable(resp.data as unknown as Record<string, unknown>))

    return resp
  }
}
