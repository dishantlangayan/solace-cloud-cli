import { Flags } from '@oclif/core'

import { ScCommand } from '../../../sc-command.js'
import { EventBrokerCreateApiResponse, EventBrokerCreateDetail, EventBrokerListApiResponse } from '../../../types/broker.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class MissionctrlBrokerUpdate extends ScCommand<typeof MissionctrlBrokerUpdate> {
  static override args = {}
  static override description = `Update the configuration of an existing event broker service. 
  You can provide any combination of supported flags. If a flag is not provided, then it will not be updated.
  
  Your token must have one of the permissions listed in the Token Permissions.

  Token Permissions: [ mission_control:access or services:put ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {
    'broker-id': Flags.string({
      char: 'b',
      description: 'Id of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
    locked: Flags.string({
      char: 'l',
      description: `Indicates whether the event broker service has deletion protection enabled. The valid values are 'true' (enabled) or 'false' (disabled).`
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
    'new-name': Flags.string({
      description: 'New name of the event broker service. The new service name must be unique within an organization.'
    }),
  }

  public async run(): Promise<EventBrokerCreateDetail> {
    const { flags } = await this.parse(MissionctrlBrokerUpdate)

    const brokerId = flags['broker-id'] ?? ''
    const locked = flags.locked ?? ''
    const lockedBoolValue: boolean = (locked === 'true')
    const name = flags.name ?? ''
    const newName = flags['new-name'] ?? ''

    // API body
    const body = {
      ...(locked && { locked: lockedBoolValue }),
      ...(newName && { name: newName }),
    }

    const conn = new ScConnection()

    // API url
    let apiUrl = `/missionControl/eventBrokerServices`
    let brokerIdToUpdate: string | undefined = brokerId

    if (name) {
      // If broker name provided, get the broker matching provided name. If more than one broker matches, an error will be thrown.
      const resp = await conn.get<EventBrokerListApiResponse>(`${apiUrl}?customAttributes=name=="${name}"`)
      if (resp.data.length === 0) {
        this.error(`No brokers found with name: ${name}.`)
      } else if (resp.data.length > 1) {
        this.error(`Multiple brokers found with name: ${name}. Exactly one event broker service must match the provided name.`)
      } else {
        brokerIdToUpdate = resp.data[0]?.id
      }
    }

    // API call to update broker by id
    apiUrl += `/${brokerIdToUpdate}`
    const resp = await conn.patch<EventBrokerCreateApiResponse>(apiUrl, body)
    this.log(`Broker with id '${brokerIdToUpdate}' has been updated successfully.`)
    this.print(resp.data)

    return resp.data
  }

  private print(broker: EventBrokerCreateDetail): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows))
  }
}
