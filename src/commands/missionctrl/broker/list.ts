import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {EventBrokerListApiResponse, EventBrokerServiceDetail} from '../../../types/broker.js'
import {renderTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerList extends ScCommand<typeof MissionctrlBrokerList> {
  static override args = {}
  static override description = `Get a listing of event broker services.

Your token must have one of the permissions listed in the Token Permissions.

Token Permissions: [ \`mission_control:access\` **or** \`services:get\` **or** \`services:get:self\` **or** \`services:view\` **or** \`services:view:self\` ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyBrokerName --pageNumber=1 --pageSize=10 --sort=name:asc',
  ]
  static override flags = {
    name: Flags.string({
      char: 'n',
      description: 'Name of the event broker service to match on.',
    }),
    pageNumber: Flags.integer({
      description: 'The page number to get. Defaults to 1',
    }),
    pageSize: Flags.integer({
      description: 'The number of event broker services to return per page. Defaults to 10',
      max: 100,
      min: 1,
    }),
    sort: Flags.string({
      description: `Sort the returned event broker services by attribute.

      You can use the following value formats for the sort order:

      * attributes-names 
      * attributes-names:sort-order`,
    }),
  }

  public async run(): Promise<EventBrokerServiceDetail[]> {
    const {flags} = await this.parse(MissionctrlBrokerList)

    const conn = new ScConnection()

    const pageSize = flags.pageSize ?? 10
    const pageNumber = flags.pageNumber ?? 1

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices?pageSize=${pageSize}&pageNumber=${pageNumber}`
    if (flags.sort) {
      apiUrl += `&sort=${flags.sort}`
    }

    if (flags.name) {
      apiUrl += `&customAttributes=name=="${flags.name}"`
    }

    // API call
    const resp = await conn.get<EventBrokerListApiResponse>(apiUrl)

    // Array to output as table
    const brokerArray = [
      ['Name', 'Id', 'Type', 'Version', 'Owned By', 'Datacenter Id', 'Service Class Id'],
      ...resp.data.map((item: EventBrokerServiceDetail) => [
        item.name,
        item.id,
        item.type,
        item.eventBrokerServiceVersion,
        item.ownedBy,
        item.datacenterId,
        item.serviceClassId,
      ]),
    ]
    // Display results as a table
    this.log()
    this.log(renderTable(brokerArray))

    // Return raw json if --json flag is set
    return resp.data
  }
}
