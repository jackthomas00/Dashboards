import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ApiConnection {
  id: string
  name: string
  baseUrl: string
  headers?: Record<string, string>
  authType?: 'none' | 'bearer' | 'basic' | 'apiKey'
  authConfig?: {
    token?: string
    username?: string
    password?: string
    apiKey?: string
    apiKeyHeader?: string
  }
}

export interface ApiResponse {
  data: any
  status: number
  headers: Record<string, string>
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['ApiConnection'],
  endpoints: (builder) => ({
    fetchApiData: builder.query<ApiResponse, { connectionId: string; endpoint: string; method?: string; body?: any }>({
      queryFn: async ({ connectionId, endpoint, method = 'GET', body }, { getState }) => {
        const state = getState() as any
        const connection = state.apiConnections.connections.find(
          (conn: ApiConnection) => conn.id === connectionId
        )

        if (!connection) {
          return { error: { status: 404, data: 'Connection not found' } }
        }

        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...connection.headers,
          }

          // Add authentication headers
          if (connection.authType === 'bearer' && connection.authConfig?.token) {
            headers['Authorization'] = `Bearer ${connection.authConfig.token}`
          } else if (connection.authType === 'basic' && connection.authConfig?.username && connection.authConfig?.password) {
            const credentials = btoa(`${connection.authConfig.username}:${connection.authConfig.password}`)
            headers['Authorization'] = `Basic ${credentials}`
          } else if (connection.authType === 'apiKey' && connection.authConfig?.apiKey) {
            const headerName = connection.authConfig.apiKeyHeader || 'X-API-Key'
            headers[headerName] = connection.authConfig.apiKey
          }

          const url = `${connection.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
          
          const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
          })

          const data = await response.json().catch(() => ({}))
          
          return {
            data: {
              data,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
            },
          }
        } catch (error: any) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error.message || 'Failed to fetch data',
            },
          }
        }
      },
    }),
  }),
})

export const { useFetchApiDataQuery, useLazyFetchApiDataQuery } = apiSlice

