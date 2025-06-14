import {Command, Flags} from '@oclif/core'
import {table} from 'table'

import {Environment, EnvironmentApiResponse, EnvironmentDetail} from '../../../types/environment.js'
import {camelCaseToTitleCase} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class PlatformEnvUpdate extends Command {
  static override args = {}
  static override description = `Modify an environment's attributes using the environment's name or unique identifier
  
  Token Permissions: [ environments:edit ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyEnvName --new-name=MyNewEnvName --desc="Updated description" --isDefault',
    '<%= config.bin %> <%= command.id %> --env-id=MyEnvId --new-name=MyNewEnvName --desc="Updated description" --isDefault',
  ]
  static override flags = {
    desc: Flags.string({char: 'd', description: 'Description of the environment to update.'}),
    'env-id': Flags.string({char: 'e', description: 'Id of the environment.', exactlyOne: ['env-id', 'name']}),
    isDefault: Flags.boolean({description: 'Indicates this is the organization’s default environment.'}),
    name: Flags.string({char: 'n', description: 'Existing name of the environment.', exactlyOne: ['env-id', 'name']}),
    'new-name': Flags.string({description: 'New name of the environment.'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(PlatformEnvUpdate)

    const name = flags.name ?? ''
    const newName = flags['new-name'] ?? ''
    const envId = flags['env-id'] ?? ''
    const desc = flags.desc ?? ''
    const isDefault = flags.isDefault ?? false

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/platform/environments`
    // API body
    const body = {
      description: desc,
      isDefault,
      newName,
    }

    let envIdToUpdate: string | undefined = envId

    // If env name provided, get all environments matching provided name
    if (name) {
      // API call to get environment by name
      apiUrl += `?name=${name}`
      const resp = await conn.get<EnvironmentApiResponse>(apiUrl)
      if (resp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envIdToUpdate = resp.data[0]?.id
      }
    } else {
      this.error('Either --env-id or --name must be provided.')
    }

    // API call to update environment by id
    apiUrl += `/${envIdToUpdate}`
    const resp = await conn.put<EnvironmentDetail>(apiUrl, body)
    this.log(`Environment with id '${envIdToUpdate}' has been updated successfully.`)
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
        1: {width: 50, wrapWord: true},
      },
      drawHorizontalLine(lineIndex: number, rowCount: number) {
        return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount
      },
    }
    this.log(table(tableRows, config))
  }
}
