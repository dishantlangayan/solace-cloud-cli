import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {Environment, EnvironmentListApiResponse} from '../../../types/environment.js'
import {renderTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class PlatformEnvList extends ScCommand<typeof PlatformEnvList> {
  static override args = {}
  static override description = `Get a list of all Environments. 
  
  Required token permissions: [ environments:view ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --name=Default --pageNumber=1 --pageSize=10 --sort=name:ASC',
  ]
  static override flags = {
    name: Flags.string({
      char: 'n',
      description: 'Name of the environment to match on.',
    }),
    pageNumber: Flags.integer({
      char: 'p',
      description: 'The page number to get. Defaults to 10',
    }),
    pageSize: Flags.integer({
      char: 's',
      description: 'The number of environments to get per page. Defaults to 1',
      max: 100,
      min: 1,
    }),
    sort: Flags.string({
      description: 'The query (fieldName:<ASC/DESC>) used to sort the environment list in the response.',
    }),
  }

  public async run(): Promise<EnvironmentListApiResponse> {
    const {flags} = await this.parse(PlatformEnvList)

    const conn = new ScConnection()

    const pageSize = flags.pageSize ?? 10
    const pageNumber = flags.pageNumber ?? 1

    // API url
    let apiUrl: string = `/platform/environments?pageSize=${pageSize}&pageNumber=${pageNumber}`
    if (flags.sort) {
      apiUrl += `&sort=${flags.sort}`
    }

    // API call
    const resp = await conn.get<EnvironmentListApiResponse>(apiUrl)

    // Array to output as table
    const envArray = [
      ['Name', 'Id', 'Is Default', 'Is Production', 'Description'],
      ...resp.data.map((item: Environment) => [
        item.name,
        item.id,
        item.isDefault,
        item.isProduction,
        item.description,
      ]),
    ]

    // Display results as a table
    this.log(renderTable(envArray, {4: {width: 50, wrapWord: true}}))

    // Return raw json if --json flag is set
    return resp
  }
}
