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