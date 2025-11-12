import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import dashboardReducer from './slices/dashboardSlice'
import apiConnectionsReducer from './slices/apiConnectionsSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    dashboard: dashboardReducer,
    apiConnections: apiConnectionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

