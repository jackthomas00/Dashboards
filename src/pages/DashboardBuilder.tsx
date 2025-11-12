import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GridLayout, { Layout } from 'react-grid-layout'
import { RootState } from '../store'
import {
  updateLayout,
  updateWidget,
  removeWidget,
  addWidget,
  setActiveDashboard,
} from '../store/slices/dashboardSlice'
import WidgetRenderer from '../components/WidgetRenderer'
import ApiConnectionManager from '../components/ApiConnectionManager'
import WidgetConfigPanel from '../components/WidgetConfigPanel'
import { Plus, Plug, ArrowLeft } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import 'react-grid-layout/css/styles.css'

function DashboardBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [configDrawerOpened, setConfigDrawerOpened] = useState(false)
  const [apiDrawerOpened, setApiDrawerOpened] = useState(false)
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)

  const dashboard = useSelector((state: RootState) =>
    state.dashboard.dashboards.find((d) => d.id === id)
  )
  const connections = useSelector((state: RootState) => state.apiConnections.connections)

  useEffect(() => {
    if (id) {
      dispatch(setActiveDashboard(id))
    }
  }, [id, dispatch])

  if (!dashboard) {
    return (
      <div className="container mx-auto py-8">
        <p>Dashboard not found</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  const handleLayoutChange = (layout: Layout[]) => {
    dispatch(updateLayout({ dashboardId: dashboard.id, layout }))
  }

  const handleAddWidget = (type: 'chart' | 'table' | 'stat' | 'text') => {
    const widgetId = uuidv4()
    const newWidget = {
      id: widgetId,
      type,
      title: `New ${type}`,
      config: {
        color: '#228be6',
      },
    }

    const newLayout: Layout = {
      i: widgetId,
      x: 0,
      y: 0,
      w: type === 'stat' ? 2 : 4,
      h: type === 'stat' ? 2 : 4,
      minW: 2,
      minH: 2,
    }

    dispatch(addWidget({ dashboardId: dashboard.id, widget: newWidget, layout: newLayout }))
    setSelectedWidgetId(widgetId)
    setConfigDrawerOpened(true)
  }

  const handleWidgetClick = (widgetId: string) => {
    setSelectedWidgetId(widgetId)
    setConfigDrawerOpened(true)
  }

  const handleDeleteWidget = (widgetId: string) => {
    dispatch(removeWidget({ dashboardId: dashboard.id, widgetId }))
    if (selectedWidgetId === widgetId) {
      setConfigDrawerOpened(false)
      setSelectedWidgetId(null)
    }
  }

  const selectedWidget = dashboard.widgets.find((w) => w.id === selectedWidgetId)

  return (
    <div className="flex h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">{dashboard.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setApiDrawerOpened(true)}>
              <Plug className="mr-2 h-4 w-4" />
              API Connections
            </Button>
            <Badge variant="secondary">
              {connections.length} connection{connections.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-64 border-r bg-background p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Add Widget</h3>
          <Separator />
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddWidget('chart')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Chart
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddWidget('table')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Table
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddWidget('stat')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Stat Card
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddWidget('text')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Text
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-16 p-4 overflow-auto">
        <GridLayout
          className="layout"
          layout={dashboard.layout}
          cols={12}
          rowHeight={60}
          width={1200}
          onLayoutChange={handleLayoutChange}
          isDraggable
          isResizable
        >
          {dashboard.widgets.map((widget) => (
            <div key={widget.id} onClick={() => handleWidgetClick(widget.id)}>
              <WidgetRenderer widget={widget} />
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Config Drawer */}
      <Drawer open={configDrawerOpened} onOpenChange={setConfigDrawerOpened}>
        <DrawerContent 
          side="right" 
          className="w-full sm:max-w-2xl"
          title="Widget Configuration"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Widget Configuration</h2>
            {selectedWidget && (
              <WidgetConfigPanel
                widget={selectedWidget}
                dashboardId={dashboard.id}
                onDelete={() => handleDeleteWidget(selectedWidget.id)}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* API Drawer */}
      <Drawer open={apiDrawerOpened} onOpenChange={setApiDrawerOpened}>
        <DrawerContent 
          side="right" 
          className="w-full sm:max-w-2xl"
          title="API Connections"
        >
          <div className="p-6">
            <ApiConnectionManager />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DashboardBuilder
