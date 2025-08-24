import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {EventBrokerListApiResponse, EventBrokerRedundancyApiResponse} from '../../../types/broker.js'
import {printObjectAsKeyValueTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerState extends ScCommand<typeof MissionctrlBrokerState> {
  static override args = {}
  static override description = `Get the availability state of an event broker service and the name of the active messaging node using the service's unique identifier.

  Your token must have one of the permissions listed in the Token Permissions.
  
  Token Permissions: [ mission_control:access or services:get or services:get:self or services:view or services:view:self ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --broker-id=MyBrokerServiceId',
    '<%= config.bin %> <%= command.id %> --name=MyBrokerName',
  ]
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

  public async run(): Promise<EventBrokerRedundancyApiResponse> {
    const {flags} = await this.parse(MissionctrlBrokerState)

    const name = flags.name ?? ''
    let brokerId = flags['broker-id'] ?? ''

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices`

    if (name) {
      // If broker name provided, get the broker matching provided name. If more than one broker matches, an error will be thrown.
      const resp = await conn.get<EventBrokerListApiResponse>(`${apiUrl}?customAttributes=name=="${name}"`)
      if (resp.data.length === 0) {
        this.error(`No brokers found with name: ${name}.`)
      } else if (resp.data.length > 1) {
        this.error(
          `Multiple brokers found with name: ${name}. Exactly one event broker service must match the provided name.`,
        )
      } else {
        brokerId = resp.data[0]?.id
      }
    }

    // API call to update broker by id
    apiUrl += `/${brokerId}/brokerState`
    const resp = await conn.get<EventBrokerRedundancyApiResponse>(apiUrl)
    this.log(printObjectAsKeyValueTable(resp.data))

    return resp
  }
}
