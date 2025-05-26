import {Command, Flags} from '@oclif/core'
import {table} from 'table'

import {EventBrokerCreateApiResponse, EventBrokerCreateDetail} from '../../../types/broker.js'
import {camelCaseToTitleCase} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerCreate extends Command {
  static override args = {}
  static override description = `Create an event broker service. You must provide a unique name and select a service class and datacenter. You can optionally define other properties for the event broker service.

Your token must have one of the permissions listed in the Token Permissions.

Token Permissions: [ \`services:post\` ]`
  static override examples = ['<%= config.bin %> <%= command.id %> --datacenter-id=MyDatacenterId --name=MyBrokerName --service-class-id=DEVELOPER']
  static override flags = {
    'datacenter-id': Flags.string({
      char: 'd',
      description: 'The identifier of the datacenter.',
      required: true,
    }),
    'env-name': Flags.string({
      char: 'e',
      description:
        'The name of the environment environment where you want to create the service. If no name is provided, the service will be created in the default environment.',
    }),
    locked: Flags.boolean({
      char: 'l',
      default: false,
      description:
        'Indicates if you can delete the event broker service after creating it. The default value is false.',
    }),
    'max-spool-usage': Flags.string({
      char: 's',
      description:
        'The message spool size, in gigabytes (GB). A default message spool size is provided if this is not specified.',
    }),
    'msg-vpn-name': Flags.string({
      char: 'm',
      description: 'The message VPN name. A default message VPN name is provided when this is not specified.',
    }),
    name: Flags.string({char: 'n', description: 'Name of the event broker service to create.', required: true}),
    'service-class-id': Flags.string({
      char: 'c',
      description: 'Supported service classes.',
      required: true,
    }),
    version: Flags.string({
      char: 'v',
      description: 'The event broker version. A default version is provided when this is not specified.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(MissionctrlBrokerCreate)

    const datacenterId = flags['datacenter-id'] ?? ''
    let envName = flags['env-name'] ?? ''
    const locked = flags.locked ?? false
    // const maxSpoolUsage = flags['max-spool-usage'] ?? ''
    // const msgVpnName = flags['msg-vpn-name'] ?? ''
    const name = flags.name ?? ''
    const redundancyGroupSslEnabled = false // This flag is not defined yet, but it is used in the API body
    const serviceClassId = flags['service-class-id'] ?? 'DEVELOPER'
    // const version = flags.version ?? ''

    const conn = new ScConnection()

    // API url
    const apiUrl: string = `/missionControl/eventBrokerServices`

    // If envName is provided, retrieve the environment ID
    if (envName) {
      const envApiUrl = `/platform/environments?name=${envName}`
      const envResp = await conn.get<{data: {id: string}[]}>(envApiUrl)
      if( envResp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envName = envResp.data[0]?.id
      }
    }

    // API body
    const body: Record<string, unknown> = {
      datacenterId,
      envName,
      // eventBrokerVersion: version,
      locked,
      // maxSpoolUsage,
      // msgVpnName,
      name,
      redundancyGroupSslEnabled,
      serviceClassId,
    }

    // API call
    const resp = await conn.post<EventBrokerCreateApiResponse>(apiUrl, body)
    // Display results
    this.log('Event broker service created successfully.')
    this.print(resp.data)
  }

  private print(broker: EventBrokerCreateDetail): void {
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
