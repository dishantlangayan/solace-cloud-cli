import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { DefaultBaseUrl, EnvironmentVariable, envVars } from '../config/env-vars.js'

export class ScConnection {
    private axiosInstance: AxiosInstance
    private endpointUrl: string = ''

    constructor(baseURL: string = envVars.getString(EnvironmentVariable.SC_BASE_URL, DefaultBaseUrl),
        accessToken: string = envVars.getString(EnvironmentVariable.SC_ACCESS_TOKEN, ''),
        timeout: number = 10_000) {
        const apiVersion = envVars.getString(EnvironmentVariable.SC_API_VERSION, 'v2')
        this.endpointUrl = this.joinPaths(baseURL, `/api/${apiVersion}`)
        this.axiosInstance = axios.create({
            baseURL: this.endpointUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            timeout,
        })
        // Add interceptors if needed
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.response?.data || error.message)
                return Promise.reject(error)
            }
        )
    }

    // DELETE request
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config)
        return response.data
    }

    // GET request
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config)
        return response.data
    }

    // POST request
    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config)
        return response.data
    }

    // PUT request
    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config)
        return response.data
    }

    private joinPaths(base: string, path: string): string {
        return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
    }
}

export default ScConnection