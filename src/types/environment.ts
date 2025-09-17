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

export interface EnvironmentListApiResponse {
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

export interface EnvironmentApiResponse {
  data: Environment
}
