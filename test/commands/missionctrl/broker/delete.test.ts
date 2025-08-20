import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerListApiResponse, EventBrokerOperationApiResponse} from '../../../../src/types/broker.js'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, createTestOperationResponse, setEnvVariables} from '../../../util/test-utils'

describe('missionctrl:broker:delete', () => {
  setEnvVariables()
  let scConnDeleteStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const brokerId: string = 'MyTestBrokerId'
  const brokerName: string = 'MyTestBrokerName'

  beforeEach(() => {
    scConnDeleteStub = sinon.stub(ScConnection.prototype, 'delete')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnDeleteStub.restore()
    scConnGetStub.restore()
  })

  it('runs missionctrl:broker:delete cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:delete')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:delete -b ${brokerId}`, async () => {
    // Arrange
    const expectBrokerOpResponse: EventBrokerOperationApiResponse = createTestOperationResponse(
      brokerId,
      1,
      'MyTestOperationId',
      'PENDING',
    )

    scConnDeleteStub.returns(expectBrokerOpResponse)

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectBrokerOpResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:delete -b ${brokerId}`)

    // Assert
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs missionctrl:broker:delete -n ${brokerName}`, async () => {
    // Arrange
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker(brokerId, brokerName)],
    }
    const expectBrokerOpResponse: EventBrokerOperationApiResponse = createTestOperationResponse(
      brokerId,
      1,
      'MyTestOperationId',
      'PENDING',
    )

    scConnGetStub.returns(Promise.resolve(expectBrokerResponse))
    scConnDeleteStub.returns(Promise.resolve(expectBrokerOpResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectBrokerOpResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:delete -n ${brokerName}`)

    // Assert
    expect(scConnGetStub.getCall(0).args[0]).to.contain(`?customAttributes=name=="${brokerName}"`)
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
