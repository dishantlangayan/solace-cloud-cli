export interface EventBrokerCreateDetail {
  completedTime?: string
  createdBy?: string
  createdTime?: string
  error?: {
    errorId: string
    message: string
  }
  id: string
  operationType?: string
  progressLogs?: {
    message: string
    step: string
    timestamp: string
  }[]
  resourceId?: string
  resourceType?: string
  status?: string
  type?: string
}

export interface EventBrokerCreateApiResponse {
  data: EventBrokerCreateDetail
  meta: {
    additionalProp?: Record<string, unknown>
  }
}

export interface EventBrokerDeleteListApiResponse {
  data: EventBrokerCreateDetail[]
  meta: {
    additionalProp?: Record<string, unknown>
  }
}

export interface EventBrokerListApiResponse {
  data: EventBrokerServiceDetail[]
  meta: {
    pagination: {
      count: number
      nextPage: null | string
      pageNumber: number
      pageSize: number
      totalPages: number
    }
  }
}

export interface EventBrokerServiceDetail {
  adminState?: string
  createdTime?: string
  creationState?: string
  datacenterId?: string
  environmentId?: string
  eventBrokerServiceVersion?: string
  id: string
  infrastructureId?: string
  locked?: boolean
  msgVpnName?: string
  name: string
  ownedBy?: string
  serviceClassId?: string
  type?: string
}

/**
 * For Broker Operation Status
 */
export interface AllOperationResponse {
  data: OperationData[]
}

export interface OperationResponse {
  data: OperationData
}

export interface OperationData {
  completedTime: string // ISO timestamp
  createdBy: string
  createdTime: string // ISO timestamp
  id: string
  operationType: string
  progressLogs?: ProgressLog[]
  resourceId: string
  resourceType: string
  status: string
  type: "operation"
}

export interface ProgressLog {
  message: string
  status: string
  step: string
  stepId: string
  timestamp: string // ISO timestamp
}