import { Flags } from '@oclif/core'
import { MultiBar, Presets, SingleBar } from 'cli-progress'

import { ScCommand } from '../../../sc-command.js'
import { AllOperationResponse, EventBrokerListApiResponse, OperationData, OperationResponse } from '../../../types/broker.js'
import { renderTable, sleep } from '../../../util/internal.js'
import { ScConnection } from '../../../util/sc-connection.js'

export default class MissionctrlBrokerOpstatus extends ScCommand<typeof MissionctrlBrokerOpstatus> {
  static override args = {}
  static override description = `Get the status of all operations being performed on an event broker service. 
  To get the operation status, you must provide the identifier or name of the event broker service.

  Token Permissions: [ mission_control:access or services:get or services:get:self or services:view or services:view:self ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> -b <broker-id>',
    '<%= config.bin %> <%= command.id %> -n <broker-name>',
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
    'show-progress': Flags.boolean({
      char: 'p',
      description: 'Displays a status bar of the in-progress operations. The command will wait for completion of each step of the operation.'
    }),
    'wait-ms': Flags.integer({
      char: 'w',
      description: 'The milliseconds to wait between API calls for checking progress of the operation. Default is 5000 ms.'
    }),
  }

  public async run(): Promise<OperationData[]> {
    const { flags } = await this.parse(MissionctrlBrokerOpstatus)

    const name = flags.name ?? ''
    let brokerId = flags['broker-id'] ?? ''
    const showProgress = flags['show-progress'] ?? false
    const waitMs = flags['wait-ms'] ?? 5000

    const conn = new ScConnection()

    // Base API url
    let apiUrl: string = `/missionControl/eventBrokerServices`

    // If broker name provided, retrieve the broker service id first
    // then retrieve the operation status using the id
    if (name) {
      // API call to get broker by name
      apiUrl += `?customAttributes=name=="${name}"`
      const resp = await conn.get<EventBrokerListApiResponse>(apiUrl)
      // FUTURE: show status of multiple brokers operations that match the name 
      if (resp.data.length > 1) {
        this.error(`Multiple broker services found with: ${name}. Exactly one broker service must match the provided name.`)
      } else {
        brokerId = resp.data[0]?.id
      }
    }

    // API call to retrieve status of the broker operation
    apiUrl = `/missionControl/eventBrokerServices/${brokerId}/operations`
    
    const resp = await conn.get<AllOperationResponse>(apiUrl)
    const opStatusArray = [
      ['Operation Id', 'Operation Type', 'Status', 'Created Time', 'Completed Time'],
      ...resp.data.map((item: OperationData) => [
        item.id,
        item.operationType,
        item.status,
        item.createdTime,
        item.completedTime,
      ]),
    ]

    // Display results as a table
    this.log(renderTable(opStatusArray))

    // If show-progress flag is set, display progress bars for each operation
    if(showProgress && resp.data.length > 0) {
      // Create progress bar for each operation
      const multiProgressBar = new MultiBar({
        clearOnComplete: false,
        format: ' {bar} | {operationType} | {value}/{total}',
        hideCursor: true,
      }, Presets.shades_classic)
      
      // Get the initial progress for each operation
      const progressBars: [string, SingleBar][] = []
      let completedOperations = 0
      let allCompleted = false
      for (const operationData of resp.data) {
        const opStatusApiUrl = `/missionControl/eventBrokerServices/${brokerId}/operations/${operationData.id}?expand=progressLogs`
        // eslint-disable-next-line no-await-in-loop
        const opStatusResp = await conn.get<OperationResponse>(opStatusApiUrl)
        this.debug(`Operation ID: ${operationData.id}, Type: ${operationData.operationType}, Status: ${operationData.status}`)
        if (opStatusResp.data.progressLogs) {
          const numSteps = opStatusResp.data.progressLogs.length
          // start a new progress bar for the operation with a total value of size of the steps
          const progressBar = multiProgressBar.create(numSteps, 0, { operationType: operationData.operationType })
          // Update the progress with the steps completed
          const completedNumSteps = opStatusResp.data.progressLogs.filter(log => log.status === 'success').length
          progressBar.update(completedNumSteps)
          if (completedNumSteps === numSteps || opStatusResp.data.status === 'SUCCEEDED' || opStatusResp.data.status === 'FAILED') {
            completedOperations += 1
            progressBar.stop()
          }
          
          // Add the operation ID and progress bar to the list
          progressBars.push([operationData.id, progressBar])
        }
      }

      // Check if all operations are completed
      if(completedOperations === progressBars.length) {
        allCompleted = true
      }

      // Loop until all operations are completed
      while (!allCompleted) {
        // Wait before making the next API call
        sleep(waitMs)
        // Poll the status of all operations and update the progress bars
        // eslint-disable-next-line no-await-in-loop
        allCompleted = await this.pollAllOperationStatus(conn, brokerId, progressBars)
      }
      
      multiProgressBar.stop()
      this.log() // Add a new line for better readability
    }

    return resp.data
  }

  private async pollAllOperationStatus(conn: ScConnection, brokerId: string, progressBars: [string, SingleBar][]): Promise<boolean> {
    let completedOperations = 0
    let allCompleted = false
    // For each operation, get the latest status and update the progress bar
    for (const [operationId, progressBar] of progressBars) {
      const opStatusApiUrl = `/missionControl/eventBrokerServices/${brokerId}/operations/${operationId}?expand=progressLogs`
      // eslint-disable-next-line no-await-in-loop
      const opStatusResp = await conn.get<OperationResponse>(opStatusApiUrl)
      if (opStatusResp.data.progressLogs) {
        const numSteps = opStatusResp.data.progressLogs.length
        const completedNumSteps = opStatusResp.data.progressLogs.filter(log => log.status === 'success').length
        // Update progress bar
        progressBar.setTotal(numSteps)
        progressBar.update(completedNumSteps)
        if (completedNumSteps === numSteps || opStatusResp.data.status === 'SUCCEEDED' || opStatusResp.data.status === 'FAILED') {
          completedOperations += 1
          progressBar.stop()
        }
      } else {
        progressBar.stop()
      }
    }

    // Check if all operations are completed
    if(completedOperations === progressBars.length) {
      allCompleted = true
    }

    return allCompleted
  }
}