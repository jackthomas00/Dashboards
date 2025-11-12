import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiConnection } from '../api/apiSlice'

interface ApiConnectionsState {
  connections: ApiConnection[]
  activeConnectionId: string | null
}

const initialState: ApiConnectionsState = {
  connections: [],
  activeConnectionId: null,
}

const apiConnectionsSlice = createSlice({
  name: 'apiConnections',
  initialState,
  reducers: {
    addConnection: (state: ApiConnectionsState, action: PayloadAction<ApiConnection>) => {
      state.connections.push(action.payload)
    },
    updateConnection: (state: ApiConnectionsState, action: PayloadAction<ApiConnection>) => {
      const index = state.connections.findIndex((c: ApiConnection) => c.id === action.payload.id)
      if (index !== -1) {
        state.connections[index] = action.payload
      }
    },
    removeConnection: (state: ApiConnectionsState, action: PayloadAction<string>) => {
      state.connections = state.connections.filter((c: ApiConnection) => c.id !== action.payload)
      if (state.activeConnectionId === action.payload) {
        state.activeConnectionId = null
      }
    },
    setActiveConnection: (state: ApiConnectionsState, action: PayloadAction<string | null>) => {
      state.activeConnectionId = action.payload
    },
  },
})

export const { addConnection, updateConnection, removeConnection, setActiveConnection } =
  apiConnectionsSlice.actions
export default apiConnectionsSlice.reducer

