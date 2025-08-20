import {Flags} from '@oclif/core'

import {ScCommand} from '../../../sc-command.js'
import {EventBrokerOperationApiResponse, EventBrokerOperationDetail} from '../../../types/broker.js'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../util/internal.js'
import {ScConnection} from '../../../util/sc-connection.js'

export default class MissionctrlBrokerCreate extends ScCommand<typeof MissionctrlBrokerCreate> {
  static override args = {}
  static override description = `Create an event broker service. You must provide a unique name and select a service class and datacenter. You can optionally define other properties for the event broker service.

Your token must have one of the permissions listed in the Token Permissions.

Token Permissions: [ \`services:post\` ]`
  static override examples = [
    '<%= config.bin %> <%= command.id %> --name=MyBrokerName --datacenter-id=eks-ca-central-1a --service-class-id=DEVELOPER',
  ]
  static override flags = {
    'datacenter-id': Flags.string({
      char: 'd',
      description: 'The identifier of the datacenter.',
      required: true,
    }),
    'env-name': Flags.string({
      char: 'e',
      description: `The name of the environment environment where you want to create the service. 
        You can only specify an environment identifier when creating services in a Public Region. 
        You cannot specify an environment identifier when creating a service in a Dedicated Region. 
        If no name is provided, the service will be created in the default environment.`,
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
    name: Flags.string({
      char: 'n',
      description: 'Name of the event broker service to create.',
      required: true,
    }),
    'redundancy-group-ssl-enabled': Flags.boolean({
      char: 'r',
      default: false,
      description:
        'Enable or disable SSL for the redundancy group (for mate-link encryption). The default value is false (disabled)',
    }),
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

  public async run(): Promise<EventBrokerOperationDetail> {
    const {flags} = await this.parse(MissionctrlBrokerCreate)

    const datacenterId = flags['datacenter-id'] ?? ''
    const envName = flags['env-name'] ?? ''
    const locked = flags.locked ?? false
    const maxSpoolUsage = flags['max-spool-usage'] ?? ''
    const msgVpnName = flags['msg-vpn-name'] ?? ''
    const name = flags.name ?? ''
    const redundancyGroupSslEnabled = flags['redundancy-group-ssl-enabled']
    const serviceClassId = flags['service-class-id'] ?? 'DEVELOPER'
    const eventBrokerVersion = flags.version ?? ''
    let envId: string = ''

    const conn = new ScConnection()

    // API url
    const apiUrl: string = `/missionControl/eventBrokerServices`

    // If envName is provided, retrieve the environment ID
    if (envName) {
      const envApiUrl = `/platform/environments?name=${envName}`
      const envResp = await conn.get<{data: {id: string}[]}>(envApiUrl)
      if (envResp.data.length > 1) {
        this.error(`Multiple environments found with: ${name}. Exactly one environment must match the provided name.`)
      } else {
        envId = envResp.data[0]?.id
      }
    }

    // API body
    const body = {
      ...(datacenterId && {datacenterId}),
      ...(envId && {environmentId: envId}),
      ...(eventBrokerVersion && {eventBrokerVersion}),
      locked,
      ...(maxSpoolUsage && {maxSpoolUsage}),
      ...(msgVpnName && {msgVpnName}),
      name,
      redundancyGroupSslEnabled,
      serviceClassId,
    }

    // API call
    const resp = await conn.post<EventBrokerOperationApiResponse>(apiUrl, body)
    // Display results
    this.log('Event broker service created successfully.')
    this.print(resp.data)
    return resp.data
  }

  private print(broker: EventBrokerOperationDetail): void {
    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]
    this.log()
    this.log(renderKeyValueTable(tableRows))
  }
}
