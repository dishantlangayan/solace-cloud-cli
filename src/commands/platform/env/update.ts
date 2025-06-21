import { Command, Flags } from '@oclif/core'
import { table } from 'table'

import { Environment, EnvironmentApiResponse, EnvironmentDetail } from '../../../types/environment.js'
import { camelCaseToTitleCase } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvUpdate extends Command {
  static override args = {}
  static override description = `Modify an environment's attributes
  
  Use either the Environment's ID (--env-id) or name of the Environment (--name).
  
  Token Permissions: [ environments:edit ]
  `
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyEnvName --new-name=MyNewEnvName --desc=\"My description to update" --isDefault',
    '<%= config.bin %> <%= command.id %> --env-id=MyEnvId --new-name=MyNewEnvName --desc=\"My description to update" --isDefault'
  ]
  static override flags = {
    desc: Flags.string({ char: 'd', description: 'Description of the environment to update.' }),
    'env-id': Flags.string({ char: 'e', description: 'Id of the environment.', exactlyOne: ['env-id', 'name'] }),
    isDefault: Flags.boolean({ description: 'Indicates this is the organization’s default environment. The default value is false.' }),
    name: Flags.string({ char: 'n', description: 'Current name of the environment.', exactlyOne: ['env-id', 'name'] }),
    'new-name': Flags.string({ description: 'New name of the environment.' }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PlatformEnvUpdate)

    const desc = flags.desc ?? ''
    const envId = flags['env-id'] ?? ''
    const name = flags.name ?? ''
    const newName = flags['new-name'] ?? ''

    // API body
    let body: { [key: string]: any } = {}
    body['isDefault'] = flags.isDefault ?? false
    if (desc) {
      body['description'] = desc
    }
    if (newName) {
      body['name'] = newName
    }

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/platform/environments`
    let envIdToUdpate: string | undefined = envId

    // If env name provided, get the environment matching provided name and delete. If more than one environment matches, an error will be thrown.
    // If env id provided, delete environment with that id
    if (name) {
      // API call to get environment by name
      const getEnvApiUrl = `${apiUrl}?name=${name}`
      const resp = await conn.get<EnvironmentApiResponse>(getEnvApiUrl)
      if (resp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envIdToUdpate = resp.data[0]?.id
      }
    }

    // API call to delete environment by id
    apiUrl += `/${envIdToUdpate}`
    const resp = await conn.put<EnvironmentDetail>(apiUrl, body)
    this.log(`Environment with id '${envIdToUdpate}' has been updated successfully.`)
    this.print(resp.data)
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
