import {Command, Flags} from '@oclif/core'

import {EventBrokerListApiResponse} from '../../../types/broker.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerDelete extends Command {
  static override args = {}
  static override description = `Delete a service using its unique identifier.

Your token must have one of the permissions listed in the Token Permissions.

Token Permissions: [ \`services:delete\` **or** \`services:delete:self\` **or** \`mission_control:access\` ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --broker-id=MyBrokerId',
    '<%= config.bin %> <%= command.id %> --name=MyBrokerName',
  ]
  static override flags = {
    // flag for getting environment by id (-e, --env-id)
    'broker-id': Flags.string({
      char: 'e',
      description: 'Id of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
    // flag for getting environment by name (-n, --name=VALUE)
    name: Flags.string({
      char: 'n',
      description: 'Name of the event broker service.',
      exactlyOne: ['broker-id', 'name'],
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(MissionctrlBrokerDelete)

    const name = flags.name ?? ''
    const brokerId = flags['broker-id'] ?? ''

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices`
    let brokerIdToDelete: string | undefined = brokerId

    // If broker name was provided, get the broker matching provided name and delete. If more than one broker matches, an error will be thrown.
    // If broker id was provided, delete broker with that id
    if (name) {
      // API call to get broker by name
      const getBrokersApiUrl = `${apiUrl}?customAttributes=name=="${name}"`
      const resp = await conn.get<EventBrokerListApiResponse>(getBrokersApiUrl)
      if (resp.data.length > 1) {
        this.error(
          `Multiple event broker services found with: ${name}. Exactly one broker must match the provided name.`,
        )
      } else {
        brokerIdToDelete = resp.data[0]?.id
      }
    }

    // API call to delete environment by id
    apiUrl += `/${brokerIdToDelete}`
    await conn.delete<string>(apiUrl)
    this.log(`Event broker service with id '${brokerIdToDelete}' has been deleted successfully.`)
  }
}
