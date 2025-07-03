import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { table } from 'table'

import { camelCaseToTitleCase } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'

function anBroker(brokerName: string, brokerId: string) {
  return {
    completedTime: '',
    createdBy: 'test',
    createdTime: '2024-09-05T19:54:42.766',
    id: brokerId,
    operationType: '',
    resourceId: '',
    resourceType: '',
    status: '',
    type: '',
  }
}

describe('missionctrl:broker:display', () => {
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
      data: [anBroker(brokerName, brokerId)],
      meta: {
        additionalProp: {}
      }
    }
    scConnStub.returns(Promise.resolve(broker))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(broker).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Table config
    const config = {
      columns: {
        1: { width: 50, wrapWord: true },
      },
      drawHorizontalLine(lineIndex: number, rowCount: number) {
        return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount
      },
    }

    const { stdout } = await runCommand(`missionctrl:broker:display -b ${brokerId}`)
    expect(stdout).to.contain(table(tableRows, config))
  })
})
