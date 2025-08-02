import { Flags } from '@oclif/core'

import { ScCommand } from '../../../sc-command.js'
import { EventBrokerListApiResponse, EventBrokerServiceDetail } from '../../../types/broker.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class MissionctrlBrokerDisplay extends ScCommand<typeof MissionctrlBrokerDisplay> {
  static override args = {}
  static override description = `Get the details of an event broker service using its identifier or name.
  
  Use either the Event Broker's ID (--broker-id) or name of the Event Broker (--name).
  
  Token Permissions: [ \`mission_control:access\` **or** \`services:get\` **or** \`services:get:self\` **or** \`services:view\` **or** \`services:view:self\` ]`
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    'broker-id': Flags.string({
      char: 'b',
      description: 'Id of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
  }

  public async run(): Promise<EventBrokerServiceDetail[]> {
    const { flags } = await this.parse(MissionctrlBrokerDisplay)

    const name = flags.name ?? ''
    const brokerId = flags['broker-id'] ?? ''

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices`

    // If broker name provided, get all brokers matching provided name
    // If broker id provided, get broker with that id
    let rawResp: EventBrokerServiceDetail[]
    if (brokerId) {
      // API call to get broker by id
      apiUrl += `/${brokerId}`
      const resp = await conn.get<EventBrokerServiceDetail>(apiUrl)
      this.print(resp)
      rawResp = [resp]
    } else if (name) {
      // API call to get broker by name
      apiUrl += `?customAttributes=name=="${name}"`
      const resp = await conn.get<EventBrokerListApiResponse>(apiUrl)
      for (const broker of resp.data) {
        this.print(broker)
      }

      rawResp = resp.data
    } else {
      this.error('Either --broker-id or --name must be provided.')
    }

    // Return raw json if --json flag is set
    return rawResp
  }

  private print(broker: EventBrokerServiceDetail): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows))
  }
}
