import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Layout } from 'react-grid-layout'

export interface Widget {
  id: string
  type: 'chart' | 'table' | 'stat' | 'text'
  title: string
  config: {
    dataSource?: {
      connectionId: string
      endpoint: string
      method?: string
      dataPath?: string
      refreshInterval?: number
    }
    chartType?: 'line' | 'bar' | 'area' | 'pie'
    xKey?: string
    yKey?: string
    statValue?: string
    statLabel?: string
    tableColumns?: string[]
    text?: string
    color?: string
  }
}

export interface Dashboard {
  id: string
  name: string
  widgets: Widget[]
  layout: Layout[]
}

interface DashboardState {
  dashboards: Dashboard[]
  activeDashboardId: string | null
}

const initialState: DashboardState = {
  dashboards: [],
  activeDashboardId: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addDashboard: (state: DashboardState, action: PayloadAction<Dashboard>) => {
      state.dashboards.push(action.payload)
    },
    updateDashboard: (state: DashboardState, action: PayloadAction<Dashboard>) => {
      const index = state.dashboards.findIndex((d: Dashboard) => d.id === action.payload.id)
      if (index !== -1) {
        state.dashboards[index] = action.payload
      }
    },
    removeDashboard: (state: DashboardState, action: PayloadAction<string>) => {
      state.dashboards = state.dashboards.filter((d: Dashboard) => d.id !== action.payload)
      if (state.activeDashboardId === action.payload) {
        state.activeDashboardId = null
      }
    },
    setActiveDashboard: (state: DashboardState, action: PayloadAction<string | null>) => {
      state.activeDashboardId = action.payload
    },
    addWidget: (state: DashboardState, action: PayloadAction<{ dashboardId: string; widget: Widget; layout: Layout }>) => {
      const dashboard = state.dashboards.find((d: Dashboard) => d.id === action.payload.dashboardId)
      if (dashboard) {
        dashboard.widgets.push(action.payload.widget)
        dashboard.layout.push(action.payload.layout)
      }
    },
    updateWidget: (state: DashboardState, action: PayloadAction<{ dashboardId: string; widget: Widget }>) => {
      const dashboard = state.dashboards.find((d: Dashboard) => d.id === action.payload.dashboardId)
      if (dashboard) {
        const index = dashboard.widgets.findIndex((w: Widget) => w.id === action.payload.widget.id)
        if (index !== -1) {
          dashboard.widgets[index] = action.payload.widget
        }
      }
    },
    removeWidget: (state: DashboardState, action: PayloadAction<{ dashboardId: string; widgetId: string }>) => {
      const dashboard = state.dashboards.find((d: Dashboard) => d.id === action.payload.dashboardId)
      if (dashboard) {
        dashboard.widgets = dashboard.widgets.filter((w: Widget) => w.id !== action.payload.widgetId)
        dashboard.layout = dashboard.layout.filter((l: Layout) => l.i !== action.payload.widgetId)
      }
    },
    updateLayout: (state: DashboardState, action: PayloadAction<{ dashboardId: string; layout: Layout[] }>) => {
      const dashboard = state.dashboards.find((d: Dashboard) => d.id === action.payload.dashboardId)
      if (dashboard) {
        dashboard.layout = action.payload.layout
      }
    },
  },
})

export const {
  addDashboard,
  updateDashboard,
  removeDashboard,
  setActiveDashboard,
  addWidget,
  updateWidget,
  removeWidget,
  updateLayout,
} = dashboardSlice.actions
export default dashboardSlice.reducer

