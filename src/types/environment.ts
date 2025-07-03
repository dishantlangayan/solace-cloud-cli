// This file contains the TypeScript interfaces for the environment data structure.
// It is used to define the structure of the environment data returned by the API.
// The interfaces are used to ensure that the data returned by the API matches the expected structure.
export interface Environment {
  bgColor?: string
  createdBy?: string
  createdTime?: string
  description?: string
  fgColor?: string
  icon?: string
  id?: string
  isDefault?: boolean
  isProduction?: boolean
  name: string
  organization?: {
    id: string
    internal: boolean
    name: string
    organizationType: string
  }
  type?: string
  updatedBy?: string
  updatedTime?: string
}
// Example of an Environment object
// {
//    name: 'Default',
//    description: 'Use this environment to get started. You can rename, edit, or delete it at any time. You must have at least one environment.',
//    isDefault: false,
//    isProduction: true,
//    id: 'g9bh4gy9qtz',
//    createdBy: 'system',
//    createdTime: '2024-09-05T19:54:42.766',
//    updatedBy: '67tr8tku4l',
//    updatedTime: '2025-04-08T20:38:57.443',
//    organization: {
//        id: 'customertraining',
//        name: 'Customer Training',
//        internal: false,
//        organizationType: 'ENTERPRISE'
//      },
//    type: 'environment'
//  }

export interface EnvironmentApiResponse {
  data: Environment[]
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

export interface EnvironmentDetail {
  data: Environment
}
