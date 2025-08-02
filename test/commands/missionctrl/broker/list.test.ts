import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { EventBrokerServiceDetail } from '../../../../src/types/broker.js'
import { renderTable } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'
import { aBroker, setEnvVariables } from '../../../util/test-utils.js'

describe('missionctrl:broker:list', () => {
  setEnvVariables()
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs missionctrl:broker:list cmd', async () => {
    // Arrange
    const brokers = {
      data: [aBroker('BrokerId1', 'Broker1'), aBroker('BrokerId2', 'Broker2'),
        aBroker('BrokerId3', 'Broker3')],
      meta: {
        pagination: {
          count: 3,
          nextPage: null,
          pageNumber: 1,
          pageSize: 5,
          totalPages: 1
        }
      }
    }
    scConnStub.returns(Promise.resolve(brokers))

    // Expected
    const brokerArray = [
      ['Name', 'Id', 'Type', 'Version', 'Owned By', 'Datacenter Id', 'Service Class Id'],
      ...brokers.data.map((item: EventBrokerServiceDetail) => [
        item.name,
        item.id,
        item.type,
        item.eventBrokerServiceVersion,
        item.ownedBy,
        item.datacenterId,
        item.serviceClassId,
      ]),
    ]

    const { stdout } = await runCommand('missionctrl:broker:list')
    expect(stdout).to.contain(renderTable(brokerArray))
  })
})
