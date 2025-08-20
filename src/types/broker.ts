export interface ProgressLog {
  message: string
  status: string
  step: string
  stepId: string
  timestamp: string // ISO timestamp
}

export interface EventBrokerOperationDetail {
  completedTime?: string
  createdBy?: string
  createdTime?: string
  error?: {
    errorId: string
    message: string
  }
  id: string
  operationType?: string
  progressLogs?: ProgressLog[]
  resourceId?: string
  resourceType?: string
  status?: string
  type?: string
}

export interface EventBrokerOperationApiResponse {
  data: EventBrokerOperationDetail
  meta?: {
    additionalProp?: Record<string, unknown>
  }
}

export interface EventBrokerAllOperationsApiResponse {
  data: EventBrokerOperationDetail[]
  meta?: {
    additionalProp?: Record<string, unknown>
  }
}

export interface EventBrokerListApiResponse {
  data: EventBrokerServiceDetail[]
  meta?: {
    pagination?: {
      count: number
      nextPage: null | string
      pageNumber: number
      pageSize: number
      totalPages: number
    }
  }
}

export interface EventBrokerApiResponse {
  data: EventBrokerServiceDetail
  meta?: {
    pagination?: {
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
  allowedActions?: string[]
  broker?: {
    clientCertificateAuthorities?: Array<{
      name: string
    }>
    cluster?: {
      backupRouterName?: string
      monitoringRouterName?: string
      name?: string
      password?: string
      primaryRouterName?: string
      remoteAddress?: string
      supportedAuthenticationMode?: string[]
    }
    configSyncSslEnabled?: boolean
    diskSize?: number
    domainCertificateAuthorities?: Array<{
      name: string
    }>
    ldapProfiles?: Array<{
      name: string
    }>
    managementReadOnlyLoginCredential?: {
      password?: string
      token?: string
      username?: string
    }
    maxSpoolUsage?: number
    monitoringAgentEnabled?: boolean
    monitoringMode?: string
    msgVpns?: Array<{
      authenticationBasicEnabled?: boolean
      authenticationBasicType?: string
      authenticationClientCertAllowApiProvidedUsernameEnabled?: boolean
      authenticationClientCertEnabled?: boolean
      authenticationClientCertUsernameSource?: string
      authenticationClientCertValidateDateEnabled?: boolean
      authenticationOauthEnabled?: boolean
      clientProfiles?: Array<{
        name: string
      }>
      enabled?: boolean
      eventLargeMsgThreshold?: number
      managementAdminLoginCredential?: {
        password?: string
        token?: string
        username?: string
      }
      maxConnectionCount?: number
      maxEgressFlowCount?: number
      maxEndpointCount?: number
      maxIngressFlowCount?: number
      maxMsgSpoolUsage?: number
      maxSubscriptionCount?: number
      maxTransactedSessionCount?: number
      maxTransactionCount?: number
      missionControlManagerLoginCredential?: {
        password?: string
        token?: string
        username?: string
      }
      msgVpnName?: string
      sempOverMessageBus?: {
        sempAccessToAdminCmdsEnabled?: boolean
        sempAccessToCacheCmdsEnabled?: boolean
        sempAccessToClientAdminCmdsEnabled?: boolean
        sempAccessToShowCmdsEnabled?: boolean
        sempOverMsgBusEnabled?: boolean
      }
      serviceLoginCredential?: {
        password?: string
        username?: string
      }
      subDomainName?: string
      truststoreUri?: string
    }>
    redundancyGroupSslEnabled?: boolean
    solaceDatadogAgentImage?: string
    tlsStandardDomainCertificateAuthoritiesEnabled?: boolean
    version?: string
    versionFamily?: string
  }
  createdBy?: string
  createdTime?: string
  creationState?: string
  datacenterId?: string
  defaultManagementHostname?: string
  environmentId?: string
  errorId?: string
  errorMessage?: string
  eventBrokerServiceVersion?: string
  eventBrokerServiceVersionDetails?: {
    releaseStatus?: string
    releaseStatusDetails?: string
  }
  eventMeshId?: string
  id: string
  infrastructureDetails?: {
    backupNodeHostname?: string
    infrastructureId?: string
    monitoringNodeHostname?: string
    primaryNodeHostname?: string
  }
  infrastructureId?: string
  locked?: boolean
  messageSpoolDetails?: {
    defaultGbSize?: number
    expandedGbBilled?: number
    totalGbSize?: number
  }
  msgVpnName?: string
  name: string
  ongoingOperationIds?: string[]
  ownedBy?: string
  serviceClassId?: string
  serviceConnectionEndpoints?: Array<{
    accessType?: string
    description?: string
    hostNames?: string[]
    id?: string
    k8sServiceId?: string
    k8sServiceType?: string
    name?: string
    ports?: Array<{
      port?: number
      protocol?: string
    }>
    type?: string
  }>
  type?: string
  updatedBy?: string
  updatedTime?: string
}
