import {
  EventBrokerAllOperationsApiResponse,
  EventBrokerOperationApiResponse,
  EventBrokerOperationDetail,
  EventBrokerServiceDetail,
  ProgressLog,
} from '../../src/types/broker'

export function setEnvVariables(): void {
  process.env.SC_ACCESS_TOKEN = 'TEST'
}

export function anEnv(name: string, isDefault: boolean, isProd: boolean) {
  return {
    bgColor: '#DA162D',
    createdBy: 'someuser',
    createdTime: '2024-09-05T19:54:42.766',
    description: `This is a description for the the environment ${name}`,
    fgColor: '#FFFFFF',
    icon: 'ROCKET_LAUNCH',
    id: `id${name}`,
    isDefault,
    isProduction: isProd,
    name,
    updatedBy: 'someuser',
    updatedTime: '2024-09-05T19:54:42.766',
  }
}

export function aBroker(brokerId: string, brokerName: string): EventBrokerServiceDetail {
  return {
    adminState: 'START',
    createdTime: '2025-08-20T18:15:47Z',
    creationState: 'COMPLETED',
    datacenterId: 'eks-ca-central-1a',
    environmentId: 'some-env-id',
    eventBrokerServiceVersion: '10.25.0.61-7',
    id: brokerId,
    infrastructureId: 'some-infrastructure-id',
    locked: false,
    msgVpnName: `msgvpn-${brokerId}`,
    name: brokerName,
    ownedBy: 'some-user',
    serviceClassId: 'DEVELOPER',
    type: 'service',
  }
}

export function createTestOperationResponse(
  brokerId: string,
  numSteps: number,
  operationId: string,
  status: string,
): EventBrokerOperationApiResponse {
  const opsResp: EventBrokerOperationApiResponse = {
    data: createTestOperationData(brokerId, numSteps, operationId, status),
  }
  return opsResp
}

export function createTestAllOperationsResponse(
  brokerId: string,
  numSteps: number,
  operationId: string,
  status: string,
): EventBrokerAllOperationsApiResponse {
  const opsResp: EventBrokerAllOperationsApiResponse = {
    data: [createTestOperationData(brokerId, numSteps, operationId, status)],
  }
  return opsResp
}

export function createTestOperationData(
  brokerId: string,
  numSteps: number,
  operationId: string,
  status: string,
): EventBrokerOperationDetail {
  return {
    completedTime: '2025-08-02T16:29:34Z',
    createdBy: '67tr8tku4l',
    createdTime: '2025-08-02T16:26:40Z',
    id: operationId,
    operationType: 'createService',
    progressLogs: createTestProgressLogs(numSteps, status),
    resourceId: brokerId,
    resourceType: 'service',
    status,
    type: 'operation',
  }
}

export function createTestProgressLogs(numSteps: number, status: string): ProgressLog[] {
  const progressLogs: ProgressLog[] = []
  for (let i = 0; i < numSteps; i++) {
    const progressLog: ProgressLog = {
      message: 'This is a description for the step',
      status,
      step: `This is step number ${i}`,
      stepId: `${i}`,
      timestamp: '025-08-02T16:26:41.272Z',
    }
    progressLogs.push(progressLog)
  }

  return progressLogs
}

export function createProgressLogsWithStatus(completedSteps: number, totalSteps: number): ProgressLog[] {
  const logs: ProgressLog[] = []
  for (let i = 0; i < totalSteps; i++) {
    logs.push({
      message: `This is step ${i + 1}`,
      status: i < completedSteps ? 'completed' : 'in-progress',
      step: i < completedSteps ? 'success' : 'in-progress',
      stepId: `${i}`,
      timestamp: '2025-08-02T16:26:41.272Z',
    })
  }

  return logs
}
