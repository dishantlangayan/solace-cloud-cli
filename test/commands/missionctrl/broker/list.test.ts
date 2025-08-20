import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EventBrokerListApiResponse, EventBrokerServiceDetail} from '../../../../src/types/broker.js'
import {renderTable} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {aBroker, setEnvVariables} from '../../../util/test-utils.js'

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
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker('BrokerId1', 'Broker1'), aBroker('BrokerId2', 'Broker2'), aBroker('BrokerId3', 'Broker3')],
      meta: {
        pagination: {
          count: 3,
          nextPage: null,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    }
    scConnStub.returns(Promise.resolve(expectBrokerResponse))

    // Expected
    const expectBrokerArray = [
      ['Name', 'Id', 'Type', 'Version', 'Owned By', 'Datacenter Id', 'Service Class Id'],
      ...expectBrokerResponse.data.map((item: EventBrokerServiceDetail) => [
        item.name,
        item.id,
        item.type,
        item.eventBrokerServiceVersion,
        item.ownedBy,
        item.datacenterId,
        item.serviceClassId,
      ]),
    ]

    // Act
    const {stdout} = await runCommand('missionctrl:broker:list')

    // Assert
    expect(stdout).to.contain(renderTable(expectBrokerArray))
  })

  it('runs missionctrl:broker:list --pageSize=1 --pageNumber=2', async () => {
    // Arrange
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker('BrokerId2', 'Broker2')],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber: 2,
          pageSize: 1,
          totalPages: 3,
        },
      },
    }
    scConnStub.returns(Promise.resolve(expectBrokerResponse))

    // Expected
    const expectBrokerArray = [
      ['Name', 'Id', 'Type', 'Version', 'Owned By', 'Datacenter Id', 'Service Class Id'],
      ...expectBrokerResponse.data.map((item: EventBrokerServiceDetail) => [
        item.name,
        item.id,
        item.type,
        item.eventBrokerServiceVersion,
        item.ownedBy,
        item.datacenterId,
        item.serviceClassId,
      ]),
    ]

    // Act
    const {stdout} = await runCommand('missionctrl:broker:list --pageSize=1 --pageNumber=2')

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain('?pageSize=1&pageNumber=2')
    expect(stdout).to.contain(renderTable(expectBrokerArray))
  })
})
