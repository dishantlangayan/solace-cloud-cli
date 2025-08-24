import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerApiResponse, EventBrokerListApiResponse} from '../../../../src/types/broker.js'
import {printObjectAsKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, setEnvVariables} from '../../../util/test-utils.js'

describe('missionctrl:broker:display', () => {
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

  it('runs missionctrl:broker:display cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:display')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:display -b ${brokerId}`, async () => {
    // Arrange
    const expectBroker: EventBrokerApiResponse = {
      data: aBroker(brokerId, brokerName),
      meta: {},
    }
    scConnStub.returns(Promise.resolve(expectBroker))

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:display -b ${brokerId}`)

    // Assert
    expect(scConnStub.getCall(0).calledWith(`/missionControl/eventBrokerServices/${brokerId}`)).to.be.true
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectBroker.data as unknown as Record<string, unknown>))
  })

  it(`runs missionctrl:broker:display -n ${brokerName}`, async () => {
    // Arrange
    const expectBroker: EventBrokerListApiResponse = {
      data: [aBroker(brokerId, brokerName)],
      meta: {},
    }
    scConnStub.returns(Promise.resolve(expectBroker))

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:display -n ${brokerName}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`?customAttributes=name=="${brokerName}"`)
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectBroker.data[0] as unknown as Record<string, unknown>))
  })
})
