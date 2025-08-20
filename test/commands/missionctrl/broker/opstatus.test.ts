import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {
  EventBrokerAllOperationsApiResponse,
  EventBrokerOperationApiResponse,
  EventBrokerOperationDetail,
} from '../../../../src/types/broker.js'
import {renderTable, sleepModule} from '../../../../src/util/internal.js'
import {ScConnection} from '../../../../src/util/sc-connection.js'
import {
  createProgressLogsWithStatus,
  createTestAllOperationsResponse,
  setEnvVariables,
} from '../../../util/test-utils.js'

describe('missionctrl:broker:opstatus', () => {
  setEnvVariables()
  const brokerName: string = 'MyTestBrokerName'
  const brokerId: string = 'MyTestBrokerId'
  const operationId: string = 'MyOperationId'
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs missionctrl:broker:opstatus cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:opstatus')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:opstatus -b ${brokerId}`, async () => {
    // Arrange
    const opsResponse = createTestAllOperationsResponse(brokerId, 5, operationId, 'in-progress')
    scConnStub.returns(Promise.resolve(opsResponse))

    const opStatusArray = [
      ['Operation Id', 'Operation Type', 'Status', 'Created Time', 'Completed Time'],
      ...opsResponse.data.map((item: EventBrokerOperationDetail) => [
        item.id,
        item.operationType,
        item.status,
        item.createdTime,
        item.completedTime,
      ]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:opstatus -b ${brokerId}`)

    // Assert
    expect(stdout).to.contain(renderTable(opStatusArray))
  })

  it(`runs missionctrl:broker:opstatus -n ${brokerName}`, async () => {
    // Arrange
    // Mock response for broker lookup by name
    const brokerListResponse = {
      data: [
        {
          adminState: 'enabled',
          createdBy: 'test-user',
          createdTime: '2025-08-02T16:26:40Z',
          id: brokerId,
          name: brokerName,
        },
      ],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1,
        },
      },
    }

    const opsResponse = createTestAllOperationsResponse(brokerId, 5, operationId, 'in-progress')

    // First call gets broker by name, second call gets operation status
    scConnStub
      .onFirstCall()
      .returns(Promise.resolve(brokerListResponse))
      .onSecondCall()
      .returns(Promise.resolve(opsResponse))

    const opStatusArray = [
      ['Operation Id', 'Operation Type', 'Status', 'Created Time', 'Completed Time'],
      ...opsResponse.data.map((item: EventBrokerOperationDetail) => [
        item.id,
        item.operationType,
        item.status,
        item.createdTime,
        item.completedTime,
      ]),
    ]

    // Act
    const {stdout} = await runCommand(`missionctrl:broker:opstatus -n ${brokerName}`)

    // Assert
    expect(scConnStub.callCount).to.equal(2) // Should make two API calls
    expect(scConnStub.firstCall.args[0]).to.contain(`customAttributes=name=="${brokerName}"`) // First call should lookup by name
    expect(scConnStub.secondCall.args[0]).to.contain(`/missionControl/eventBrokerServices/${brokerId}/operations`) // Second call should use found broker ID
    expect(stdout).to.contain(renderTable(opStatusArray))
  })

  it(`runs missionctrl:broker:opstatus -b ${brokerId} --show-progress --wait-ms 100`, async () => {
    // Arrange
    // First response - 1 of 3 steps completed
    const inProgressResponse: EventBrokerAllOperationsApiResponse = {
      data: [
        {
          completedTime: '',
          createdBy: '67tr8tku4l',
          createdTime: '2025-08-02T16:26:40Z',
          id: operationId,
          operationType: 'createService',
          progressLogs: createProgressLogsWithStatus(1, 3),
          resourceId: brokerId,
          resourceType: 'service',
          status: 'INPROGRESS',
          type: 'operation',
        },
      ],
    }

    // Second response - all 3 steps completed
    const completedResponse: EventBrokerOperationApiResponse = {
      data: {
        completedTime: '2025-08-02T16:29:34Z',
        createdBy: '67tr8tku4l',
        createdTime: '2025-08-02T16:26:40Z',
        id: operationId,
        operationType: 'createService',
        progressLogs: createProgressLogsWithStatus(3, 3),
        resourceId: brokerId,
        resourceType: 'service',
        status: 'SUCCEEDED',
        type: 'operation',
      },
    }

    // Mock the API calls - first returns in-progress, second returns completed
    scConnStub
      .onFirstCall()
      .returns(Promise.resolve(inProgressResponse))
      .onSecondCall()
      .returns(Promise.resolve(completedResponse))

    // Stub the sleep function to make the test run faster
    const sleepStub = sinon.stub(sleepModule, 'sleep').resolves()

    const opStatusArray = [
      ['Operation Id', 'Operation Type', 'Status', 'Created Time', 'Completed Time'],
      ...inProgressResponse.data.map((item: EventBrokerOperationDetail) => [
        item.id,
        item.operationType,
        item.status,
        item.createdTime,
        item.completedTime,
      ]),
    ]

    try {
      // Act
      const {stdout} = await runCommand(`missionctrl:broker:opstatus -b ${brokerId} --show-progress --wait-ms 100`)

      // Assert
      expect(scConnStub.callCount).to.be.greaterThan(1) // Should make multiple API calls for progress
      expect(scConnStub.secondCall.args[0]).to.contain('expand=progressLogs') // Second call should include expand parameter
      expect(stdout).to.contain(renderTable(opStatusArray))
    } finally {
      // Restore stubs
      sleepStub.restore()
    }
  })
})
