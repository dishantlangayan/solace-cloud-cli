import { AllOperationResponse, OperationData, OperationResponse, ProgressLog } from "../../src/types/broker"

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

export function aBroker(brokerId: string, brokerName: string,) {
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

export function createTestOperationResponse(brokerId: string, numSteps: number, operationId: string, status: string): OperationResponse {
  const opsResp: OperationResponse = {
    data: createTestOperationData(brokerId, numSteps, operationId, status)
  }
  return opsResp
}

export function createTestAllOperationsResponse(brokerId: string, numSteps: number, operationId: string, status: string): AllOperationResponse {
  const opsResp: AllOperationResponse = {
    data: [createTestOperationData(brokerId, numSteps, operationId, status)]
  }
  return opsResp
}

export function createTestOperationData(brokerId: string, numSteps: number, operationId: string, status: string): OperationData {
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
      type: "operation"
    }
  }

export function createTestProgressLogs(numSteps: number, status: string): ProgressLog[] {
  const progressLogs: ProgressLog[] = []
  for (let i = 0; i < numSteps; i++) {
    const progressLog: ProgressLog = {
      message: 'This is a decription for the step',
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