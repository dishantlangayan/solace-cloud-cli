import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerApiResponse} from '../../../../src/types/broker.js'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, setEnvVariables} from '../../../util/test-utils.js'

describe('missionctrl:broker:display', () => {
  setEnvVariables()
  const brokerName: string = 'Default'
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

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectBroker.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    const {stdout} = await runCommand(`missionctrl:broker:display -b ${brokerId}`)
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
