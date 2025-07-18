import { Command, Flags } from '@oclif/core'
import { table } from 'table'

// import {ScCommand} from '../../../sc-command.js'
import { Environment, EnvironmentApiResponse } from '../../../types/environment.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class PlatformEnvList extends Command {
  static override args = {}
  static override description = `Get a list of all Environments. 
  
  Required token permissions: [ environments:view ]`
  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --name=Default --pageNumber=1 --pageSize=10 --sort=name:ASC']
  static override flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'Name of the environment to match on.' }),
    // pageNumber (--pageNumber=VALUE)
    pageNumber: Flags.integer({ description: 'The page number to get. Defaults to 10' }),
    // pageSize (--pageSize=VALUE)
    pageSize: Flags.integer({
      description: 'The number of environments to get per page. Defaults to 1',
      max: 100,
      min: 1,
    }),
    // sort (--sort=VALUE)
    sort: Flags.string({
      description: 'The query (fieldName:<ASC/DESC>) used to sort the environment list in the response.',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(PlatformEnvList)

    const conn = new ScConnection()

    const pageSize = flags.pageSize ?? 10
    const pageNumber = flags.pageNumber ?? 1

    // API url
    let apiUrl: string = `/platform/environments?pageSize=${pageSize}&pageNumber=${pageNumber}`
    if (flags.sort) {
      apiUrl += `&sort=${flags.sort}`
    }

    // API call
    const resp = await conn.get<EnvironmentApiResponse>(apiUrl)

    // Array to output as table
    const envArray = [['Name', 'Id', 'Is Default', 'Is Production', 'Description'], ...resp.data.map((item: Environment) => [
      item.name,
      item.id,
      item.isDefault,
      item.isProduction,
      item.description,
    ])]

    // Display results as a table
    const config = {
      columns: {
        4: { width: 50, wrapWord: true },
      },
    }
    this.log()
    this.log(table(envArray, config))
  }
}
