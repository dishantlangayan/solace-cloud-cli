import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { EventBrokerCreateApiResponse } from '../../../../src/types/broker.js'
import { camelCaseToTitleCase, renderKeyValueTable } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'
import { aBroker, setEnvVariables } from '../../../util/test-utils.js'

describe('missionctrl:broker:update', () => {
  setEnvVariables()
  const brokerName: string = 'Default'
  const brokerId: string = 'MyTestBrokerId'
  let scConnStub: sinon.SinonStub
  let scPatchConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
    scPatchConnStub = sinon.stub(ScConnection.prototype, 'patch')
  })

  afterEach(() => {
    scConnStub.restore()
    scPatchConnStub.restore()
  })

  it('runs missionctrl:broker:update cmd', async () => {
    const { stdout } = await runCommand('missionctrl:broker:update')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:update -b ${brokerId} -l true`, async () => {
    // Arrange
    const broker = {
      data: [aBroker(brokerId, brokerName)],
      meta: {
        additionalProp: {}
      }
    }
    const updatedBroker: EventBrokerCreateApiResponse = {
      data: {
        completedTime: broker.data[0].completedTime,
        createdBy: broker.data[0].createdBy,
        createdTime: broker.data[0].createdTime,
        id: broker.data[0].id,
        operationType: broker.data[0].operationType,
        resourceId: broker.data[0].resourceId,
        resourceType: broker.data[0].resourceType,
        status: broker.data[0].status,
        type: broker.data[0].type
      },
      meta: {
        additionalProp: {}
      }
    }
    scConnStub.returns(Promise.resolve(broker))
    scPatchConnStub.returns(Promise.resolve(updatedBroker))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(updatedBroker.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const { stdout } = await runCommand(`missionctrl:broker:update -b ${brokerId} -l true`)

    // Assert
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
