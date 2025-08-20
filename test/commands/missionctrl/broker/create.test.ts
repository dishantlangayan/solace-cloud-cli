import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerOperationApiResponse} from '../../../../src/types/broker.js'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, anEnv, setEnvVariables} from '../../../util/test-utils'

describe('missionctrl:broker:create', () => {
  setEnvVariables()
  let scConnPostStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'
  const brokerName: string = 'MyEventBrokerName'
  const brokerDC: string = 'eks-ca-central-1a'
  const brokerSvcClassId: string = 'DEVELOPER'

  beforeEach(() => {
    scConnPostStub = sinon.stub(ScConnection.prototype, 'post')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnPostStub.restore()
    scConnGetStub.restore()
  })

  it('runs missionctrl:broker:create cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:create')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`, async () => {
    // Arrange
    const expectBody = {
      datacenterId: brokerDC,
      locked: false,
      name: brokerName,
      redundancyGroupSslEnabled: false,
      serviceClassId: brokerSvcClassId,
    }
    const expectResponse: EventBrokerOperationApiResponse = {
      data: aBroker(brokerName, brokerDC),
      meta: {},
    }

    scConnPostStub.returns(expectResponse)

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(
      `missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`,
    )

    // Assert
    expect(scConnPostStub.getCall(0).calledWith('/missionControl/eventBrokerServices', expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId} -l -s 10 -m MyTestMsgVpn -r -v 10.0.0.1`, async () => {
    // Arrange
    const expectBody = {
      datacenterId: brokerDC,
      eventBrokerVersion: '10.0.0.1',
      locked: true,
      maxSpoolUsage: '10',
      msgVpnName: 'MyTestMsgVpn',
      name: brokerName,
      redundancyGroupSslEnabled: true,
      serviceClassId: brokerSvcClassId,
    }
    const expectResponse: EventBrokerOperationApiResponse = {
      data: aBroker(brokerName, brokerDC),
      meta: {},
    }

    scConnPostStub.returns(expectResponse)

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(
      `missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId} -l -s 10 -m MyTestMsgVpn -r -v 10.0.0.1`,
    )

    // Assert
    expect(scConnPostStub.getCall(0).calledWith('/missionControl/eventBrokerServices', expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs missionctrl:broker:create -e ${envName} -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`, async () => {
    // Arrange
    const envs = {
      data: [anEnv(envName, false, false)],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    }
    const expectBody = {
      datacenterId: brokerDC,
      environmentId: envs.data[0].id,
      locked: false,
      name: brokerName,
      redundancyGroupSslEnabled: false,
      serviceClassId: brokerSvcClassId,
    }
    const expectResponse: EventBrokerOperationApiResponse = {
      data: aBroker(brokerName, brokerDC),
      meta: {},
    }

    scConnGetStub.returns(Promise.resolve(envs))
    scConnPostStub.returns(expectResponse)

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(
      `missionctrl:broker:create -e ${envName} -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`,
    )

    // Assert
    expect(scConnGetStub.getCall(0).args[0]).to.contain(`?name=${envName}`)
    expect(scConnPostStub.getCall(0).calledWith('/missionControl/eventBrokerServices', expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
