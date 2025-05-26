import {Command, Flags} from '@oclif/core'
import {table} from 'table'

import {EventBrokerListApiResponse, EventBrokerServiceDetail} from '../../../types/broker.js'
import {camelCaseToTitleCase} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerDisplay extends Command {
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

  public async run(): Promise<void> {
    const {flags} = await this.parse(MissionctrlBrokerDisplay)

    const name = flags.name ?? ''
    const brokerId = flags['broker-id'] ?? ''

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices`

    // If broker name provided, get all brokers matching provided name
    // If broker id provided, get broker with that id
    if (brokerId) {
      // API call to get broker by id
      apiUrl += `/${brokerId}`
      const resp = await conn.get<EventBrokerServiceDetail>(apiUrl)
      this.print(resp)
    } else if (name) {
      // API call to get broker by name
      apiUrl += `?customAttributes=name=="${name}"`
      const resp = await conn.get<EventBrokerListApiResponse>(apiUrl)
      for (const broker of resp.data) {
        this.print(broker)
      }
    } else {
      this.error('Either --broker-id or --name must be provided.')
    }
  }

  private print(broker: EventBrokerServiceDetail): void {
    this.log()
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
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
