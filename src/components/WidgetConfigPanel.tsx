import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { updateWidget } from '../store/slices/dashboardSlice'
import { Widget } from '../store/slices/dashboardSlice'
import { Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { NumberInput } from '@/components/ui/number-input'
import { ColorInput } from '@/components/ui/color-input'

interface WidgetConfigPanelProps {
  widget: Widget
  dashboardId: string
  onDelete: () => void
}

function WidgetConfigPanel({ widget, dashboardId, onDelete }: WidgetConfigPanelProps) {
  const dispatch = useDispatch()
  const connections = useSelector((state: RootState) => state.apiConnections.connections)
  const [config, setConfig] = useState(widget.config)

  useEffect(() => {
    setConfig(widget.config)
  }, [widget])

  const handleSave = () => {
    dispatch(
      updateWidget({
        dashboardId,
        widget: {
          ...widget,
          config,
        },
      })
    )
  }

  const handleTitleChange = (title: string) => {
    dispatch(
      updateWidget({
        dashboardId,
        widget: {
          ...widget,
          title,
        },
      })
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Widget Title</Label>
        <Input
          id="title"
          value={widget.title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold mb-2">Data Source</h3>
        {connections.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No API Connections</AlertTitle>
            <AlertDescription>
              Please add an API connection first to configure data sources.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="connection">API Connection</Label>
              <Select
                value={config.dataSource?.connectionId || ''}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    dataSource: {
                      ...config.dataSource,
                      connectionId: value || '',
                    },
                  })
                }
              >
                <SelectTrigger id="connection">
                  <SelectValue placeholder="Select connection" />
                </SelectTrigger>
                <SelectContent>
                  {connections.map((conn) => (
                    <SelectItem key={conn.id} value={conn.id}>
                      {conn.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="/api/data"
                value={config.dataSource?.endpoint || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    dataSource: {
                      ...config.dataSource,
                      endpoint: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={config.dataSource?.method || 'GET'}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    dataSource: {
                      ...config.dataSource,
                      method: (value as any) || 'GET',
                    },
                  })
                }
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataPath">Data Path (optional)</Label>
              <Input
                id="dataPath"
                placeholder="data.items"
                value={config.dataSource?.dataPath || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    dataSource: {
                      ...config.dataSource,
                      dataPath: e.target.value,
                    },
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                JSON path to extract data (e.g., 'data.items' for nested data)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
              <NumberInput
                id="refreshInterval"
                placeholder="0"
                value={config.dataSource?.refreshInterval || 0}
                onChange={(value) =>
                  setConfig({
                    ...config,
                    dataSource: {
                      ...config.dataSource,
                      refreshInterval: value || 0,
                    },
                  })
                }
                min={0}
              />
              <p className="text-xs text-muted-foreground">0 to disable auto-refresh</p>
            </div>
          </div>
        )}
      </div>

      {widget.type === 'chart' && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-2">Chart Configuration</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="chartType">Chart Type</Label>
                <Select
                  value={config.chartType || 'line'}
                  onValueChange={(value) =>
                    setConfig({ ...config, chartType: (value as any) || 'line' })
                  }
                >
                  <SelectTrigger id="chartType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xKey">X-Axis Key</Label>
                <Input
                  id="xKey"
                  placeholder="date"
                  value={config.xKey || ''}
                  onChange={(e) => setConfig({ ...config, xKey: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="yKey">Y-Axis Key</Label>
                <Input
                  id="yKey"
                  placeholder="value"
                  value={config.yKey || ''}
                  onChange={(e) => setConfig({ ...config, yKey: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chartColor">Chart Color</Label>
                <ColorInput
                  id="chartColor"
                  value={config.color || '#228be6'}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {widget.type === 'table' && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-2">Table Configuration</h3>
            <div className="grid gap-2">
              <Label htmlFor="columns">Columns (comma-separated)</Label>
              <Textarea
                id="columns"
                placeholder="id, name, email"
                value={config.tableColumns?.join(', ') || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    tableColumns: e.target.value
                      ? e.target.value.split(',').map((col) => col.trim())
                      : undefined,
                  })
                }
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Leave empty to show all columns</p>
            </div>
          </div>
        </>
      )}

      {widget.type === 'stat' && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-2">Stat Configuration</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="statValue">Value Path</Label>
                <Input
                  id="statValue"
                  placeholder="total"
                  value={config.statValue || ''}
                  onChange={(e) => setConfig({ ...config, statValue: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  JSON path to the value (e.g., 'data.total')
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statLabel">Label</Label>
                <Input
                  id="statLabel"
                  placeholder="Total Users"
                  value={config.statLabel || ''}
                  onChange={(e) => setConfig({ ...config, statLabel: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statColor">Color</Label>
                <ColorInput
                  id="statColor"
                  value={config.color || '#228be6'}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {widget.type === 'text' && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-2">Text Configuration</h3>
            <div className="grid gap-2">
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                value={config.text || ''}
                onChange={(e) => setConfig({ ...config, text: e.target.value })}
                rows={5}
              />
            </div>
          </div>
        </>
      )}

      <Separator />

      <div className="flex justify-between">
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Widget
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

export default WidgetConfigPanel
