import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerListApiResponse, EventBrokerRedundancyApiResponse} from '../../../../src/types/broker.js'
import {printObjectAsKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection'
import {aBroker, setEnvVariables} from '../../../util/test-utils.js'

describe('missionctrl:broker:state', () => {
  setEnvVariables()
  const brokerName: string = 'MyTestBrokerName'
  const brokerId: string = 'MyTestBrokerId'
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it(`runs missionctrl:broker:state --broker-id ${brokerId}`, async () => {
    // Arrange
    const expectBrokerStateResponse: EventBrokerRedundancyApiResponse = {
      data: {
        id: brokerId,
        isHighAvailability: true,
        redundancy: {
          activeNode: 'PRIMARY',
          configSync: 'UP',
          redundancy: 'UP',
        },
        type: 'brokerState',
      },
    }
    scConnStub.returns(Promise.resolve(expectBrokerStateResponse))

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:state --broker-id ${brokerId}`)

    // Assert
    expect(scConnStub.getCall(0).calledWith(`/missionControl/eventBrokerServices/${brokerId}/brokerState`)).to.be.true
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectBrokerStateResponse.data))
  })

  it(`runs missionctrl:broker:state --name ${brokerName}`, async () => {
    // Arrange
    const expectBrokerGetResponse: EventBrokerListApiResponse = {
      data: [aBroker(brokerId, brokerName)],
      meta: {},
    }
    const expectBrokerStateResponse: EventBrokerRedundancyApiResponse = {
      data: {
        id: brokerId,
        isHighAvailability: true,
        redundancy: {
          activeNode: 'PRIMARY',
          configSync: 'UP',
          redundancy: 'UP',
        },
        type: 'brokerState',
      },
    }
    scConnStub
      .onFirstCall()
      .returns(Promise.resolve(expectBrokerGetResponse))
      .onSecondCall()
      .returns(Promise.resolve(expectBrokerStateResponse))

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:state --name ${brokerName}`)

    // Assert
    expect(scConnStub.callCount).to.be.greaterThan(1) // Should make multiple API calls for progress
    expect(scConnStub.getCall(0).args[0]).to.contain(`?customAttributes=name=="${brokerName}"`)
    expect(scConnStub.getCall(1).calledWith(`/missionControl/eventBrokerServices/${brokerId}/brokerState`)).to.be.true
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectBrokerStateResponse.data))
  })
})
