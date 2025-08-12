import { Flags } from '@oclif/core'
import cliProgress from 'cli-progress'

import { ScCommand } from '../../../sc-command.js'
import { EventBrokerListApiResponse, OperationData, OperationResponse } from '../../../types/broker.js'
import { ScConnection } from '../../../util/sc-connection.js'
import { camelCaseToTitleCase, renderKeyValueTable, sleep } from '../../../util/internal.js'

export default class MissionctrlBrokerOpstatus extends ScCommand<typeof MissionctrlBrokerOpstatus> {
  static override args = {}
  static override description = `Get the status of an operation that being performed on an event broker service. 
  To get the operation, you provide identifier of the operation and the identifier of the event broker service.

  Token Permissions: [ mission_control:access or services:get or services:get:self or services:view or services:view:self ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
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
    'operation-id': Flags.string({
      char: 'o',
      description: 'The identifier of the operation being performed on the event broker service.'
    }),
    'show-progress': Flags.boolean({
      char: 'p',
      description: 'Displays a status bar of the in-progress operation. The command will wait for completion of each step of the operation.'
    }),
    'wait-ms': Flags.integer({
      char: 'w',
      description: 'The milliseconds to wait between API call in when showing progress. Default is 5000 ms.'
    }),
  }

  public async run(): Promise<OperationData> {
    const { flags } = await this.parse(MissionctrlBrokerOpstatus)

    const name = flags.name ?? ''
    let brokerId = flags['broker-id'] ?? ''
    const operationId = flags['operation-id'] ?? ''
    const showProgress = flags['show-progress'] ?? false
    const waitMs = flags['wait-ms'] ?? 5000

    const conn = new ScConnection()

    // API url
    let apiUrl: string = `/missionControl/eventBrokerServices`

    // If broker name provided, retrieve the broker service id first
    // then retrieve the operation status using the id
    if (name) {
      // API call to get broker by name
      apiUrl += `?customAttributes=name=="${name}"`
      const resp = await conn.get<EventBrokerListApiResponse>(apiUrl)
      // TODO FUTURE: show status of multiple brokers operations that match the name 
      if (resp.data.length > 1) {
        this.error(`Multiple broker services found with: ${name}. Exactly one broker service must match the provided name.`)
      } else {
        brokerId = resp.data[0]?.id
      }
    }

    // API call to retrieve status of the broker operation
    apiUrl = `/missionControl/eventBrokerServices/${brokerId}/operations/${operationId}`
    if (showProgress) {
      apiUrl += '?expand=progressLogs'
    }
    let resp = await conn.get<OperationResponse>(apiUrl)
    this.print(resp.data)

    // Display progress bar for each step included in the progress logs
    // Enable progress bar if set
    if (showProgress && resp.data.progressLogs && resp.data.progressLogs.length > 0) {
      let progressLogs = resp.data.progressLogs
      let numSteps = progressLogs.length

      // Create a new progress bar instance and use shades_classic theme
      const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

      // start the progress bar with a total value of size of the steps and start value of 0
      progressBar.start(numSteps, 0);

      // Update the progress with the steps completed
      let completedNumSteps = 0
      while (completedNumSteps < numSteps) {
        // Wait before making the next API call
        await sleep(waitMs)
        // Make another API call to get the lastest progress
        resp = await conn.get<OperationResponse>(apiUrl)
        if (resp.data.progressLogs) {
          progressLogs = resp.data.progressLogs
          for (const progressLog of progressLogs) {
            if (progressLog.step === 'success') {
              completedNumSteps++
            }
          }
          // Update progress bar
          progressBar.update(completedNumSteps)
        } else {
          break
        }
      }

      // stop the progress bar
      progressBar.stop()
    }

    return resp.data
  }

  private print(environment: OperationData): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(environment).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows))
  }
}
