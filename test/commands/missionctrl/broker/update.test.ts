import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerListApiResponse, EventBrokerOperationApiResponse} from '../../../../src/types/broker.js'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, createTestOperationResponse, setEnvVariables} from '../../../util/test-utils.js'

describe('missionctrl:broker:update', () => {
  setEnvVariables()
  const brokerName: string = 'Default'
  const brokerId: string = 'MyTestBrokerId'
  let scGetConnStub: sinon.SinonStub
  let scPatchConnStub: sinon.SinonStub

  beforeEach(() => {
    scGetConnStub = sinon.stub(ScConnection.prototype, 'get')
    scPatchConnStub = sinon.stub(ScConnection.prototype, 'patch')
  })

  afterEach(() => {
    scGetConnStub.restore()
    scPatchConnStub.restore()
  })

  it('runs missionctrl:broker:update cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:update')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:update -b ${brokerId} -l true`, async () => {
    // Arrange
    const expectBody = {
      locked: true,
    }
    const updatedBrokerOpResponse: EventBrokerOperationApiResponse = createTestOperationResponse(
      brokerId,
      1,
      'MyTestOperationId',
      'SUCCEEDED',
    )
    scPatchConnStub.returns(Promise.resolve(updatedBrokerOpResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(updatedBrokerOpResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:update -b ${brokerId} -l true`)

    // Assert
    expect(scPatchConnStub.getCall(0).calledWith(`/missionControl/eventBrokerServices/${brokerId}`, expectBody)).to.be
      .true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs missionctrl:broker:update -n ${brokerName} -l true`, async () => {
    // Arrange
    const expectBody = {
      locked: true,
    }
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker(brokerId, brokerName)],
    }
    const updatedBrokerOpResponse: EventBrokerOperationApiResponse = createTestOperationResponse(
      brokerId,
      1,
      'MyTestOperationId',
      'SUCCEEDED',
    )
    scGetConnStub.returns(Promise.resolve(expectBrokerResponse))
    scPatchConnStub.returns(Promise.resolve(updatedBrokerOpResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(updatedBrokerOpResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:update -n ${brokerName} -l true`)

    // Assert
    expect(scGetConnStub.getCall(0).args[0]).to.contain(`?customAttributes=name=="${brokerName}"`)
    expect(scPatchConnStub.getCall(0).calledWith(`/missionControl/eventBrokerServices/${brokerId}`, expectBody)).to.be
      .true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
