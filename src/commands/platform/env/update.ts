import { Flags } from '@oclif/core'

import { ScCommand } from '../../../sc-command.js'
import { Environment, EnvironmentApiResponse, EnvironmentDetail } from '../../../types/environment.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvUpdate extends ScCommand<typeof PlatformEnvUpdate> {
  static override args = {}
  static override description = `Modify an environment's attributes
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Token Permissions: [ environments:edit ]
  `
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyEnvName --new-name=MyNewEnvName --desc="My description to update" --isDefault',
    '<%= config.bin %> <%= command.id %> --env-id=MyEnvId --new-name=MyNewEnvName --desc="My description to update" --isDefault'
  ]
  static override flags = {
    description: Flags.string({
      char: 'd',
      description: 'Description of the environment to update.'
    }),
    'env-id': Flags.string({
      char: 'e',
      description: 'Id of the environment.',
      exactlyOne: ['env-id', 'name']
    }),
    isDefault: Flags.boolean({
      description: `Indicates this is the organization's default environment. The default value is false.`
    }),
    name: Flags.string({
      char: 'n', description: 'Current name of the environment.',
      exactlyOne: ['env-id', 'name']
    }),
    'new-name': Flags.string({
      description: 'New name of the environment.'
    }),
  }

  public async run(): Promise<Environment> {
    const { flags } = await this.parse(PlatformEnvUpdate)

    const desc = flags.description ?? ''
    const envId = flags['env-id'] ?? ''
    const name = flags.name ?? ''
    const newName = flags['new-name'] ?? ''

    // API body
    const body = {
      ...(flags.isDefault && { isDefault: flags.isDefault }),
      ...(desc && { description: desc }),
      ...(newName && { name: newName }),
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
      const resp = await conn.get<EnvironmentApiResponse>(getEnvApiUrl)
      if (resp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envIdToUpdate = resp.data[0]?.id
      }
    }

    // API call to update environment by id
    apiUrl += `/${envIdToUpdate}`
    const resp = await conn.put<EnvironmentDetail>(apiUrl, body)
    this.log(`Environment with id '${envIdToUpdate}' has been updated successfully.`)
    this.print(resp.data)
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
