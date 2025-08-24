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

  const defaultPageSize = 10
  const defaultPageNumber = 1

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
    expect(
      scConnStub
        .getCall(0)
        .calledWith(`/missionControl/eventBrokerServices?pageSize=${defaultPageSize}&pageNumber=${defaultPageNumber}`),
    ).to.be.true
    expect(stdout).to.contain(renderTable(expectBrokerArray))
  })

  it('runs missionctrl:broker:list --pageSize=1 --pageNumber=2', async () => {
    // Arrange
    const pageSize = 1
    const pageNumber = 2
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker('BrokerId2', 'Broker2')],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber,
          pageSize,
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
    const {stdout} = await runCommand(`missionctrl:broker:list --pageSize=${pageSize} --pageNumber=${pageNumber}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    expect(stdout).to.contain(renderTable(expectBrokerArray))
  })

  it('runs missionctrl:broker:list --name=Broker2', async () => {
    // Arrange
    const brokerName = 'Broker2'
    const expectBrokerResponse: EventBrokerListApiResponse = {
      data: [aBroker('BrokerId2', brokerName)],
      meta: {
        pagination: {
          count: 1,
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
    const {stdout} = await runCommand(`missionctrl:broker:list --name=${brokerName}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`customAttributes=name=="${brokerName}"`)
    expect(stdout).to.contain(renderTable(expectBrokerArray))
  })
})
