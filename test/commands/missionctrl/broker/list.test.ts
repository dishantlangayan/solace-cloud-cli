import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { table } from 'table'

import { EventBrokerServiceDetail } from '../../../../src/types/broker.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'

function anBroker(brokerName: string, brokerId: string) {
  return {
    completedTime: '',
    createdBy: 'test',
    createdTime: '2024-09-05T19:54:42.766',
    id: brokerId,
    name: brokerName,
    operationType: '',
    resourceId: '',
    resourceType: '',
    status: '',
    type: '',
  }
}

describe('missionctrl:broker:list', () => {
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
      data: [anBroker('Broker1', 'BrokerId1'), anBroker('Broker1', 'BrokerId1'),
      anBroker('Broker3', 'BrokerId3')],
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
    expect(stdout).to.contain(table(brokerArray))
  })
})
