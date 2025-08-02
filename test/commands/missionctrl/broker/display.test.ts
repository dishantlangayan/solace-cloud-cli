import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { camelCaseToTitleCase, renderKeyValueTable } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'
import { aBroker, setEnvVariables } from '../../../util/test-utils.js'

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
    const { stdout } = await runCommand('missionctrl:broker:display')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:display -b ${brokerId}`, async () => {
    // Arrange
    const broker = {
      data: [aBroker(brokerId, brokerName)],
      meta: {
        additionalProp: {}
      }
    }
    scConnStub.returns(Promise.resolve(broker))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    const { stdout } = await runCommand(`missionctrl:broker:display -b ${brokerId}`)
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
