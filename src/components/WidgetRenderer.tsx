import { useEffect, useState } from 'react'
import { useLazyFetchApiDataQuery } from '../store/api/apiSlice'
import { Widget } from '../store/slices/dashboardSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import ChartWidget from './widgets/ChartWidget'
import TableWidget from './widgets/TableWidget'
import StatWidget from './widgets/StatWidget'
import TextWidget from './widgets/TextWidget'

interface WidgetRendererProps {
  widget: Widget
}

function WidgetRenderer({ widget }: WidgetRendererProps) {
  const [fetchData, { data, isLoading, error }] = useLazyFetchApiDataQuery()
  const [localData, setLocalData] = useState<any>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (widget.config.dataSource) {
      const { connectionId, endpoint, method, refreshInterval: interval } = widget.config.dataSource

      const loadData = () => {
        fetchData({ connectionId, endpoint, method: method || 'GET' })
      }

      loadData()

      if (interval && interval > 0) {
        const intervalId = setInterval(loadData, interval * 1000)
        setRefreshInterval(intervalId)
        return () => {
          clearInterval(intervalId)
        }
      }
    }
  }, [widget.config.dataSource, fetchData])

  useEffect(() => {
    if (data) {
      let processedData = data.data

      // Apply data path if specified
      if (widget.config.dataSource?.dataPath) {
        const path = widget.config.dataSource.dataPath.split('.')
        for (const key of path) {
          processedData = processedData?.[key]
        }
      }

      setLocalData(processedData)
    }
  }, [data, widget.config.dataSource])

  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [refreshInterval])

  const renderWidget = () => {
    if (isLoading && !localData) {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load data: {error && 'status' in error ? String(error.status) : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )
    }

    switch (widget.type) {
      case 'chart':
        return <ChartWidget widget={widget} data={localData} />
      case 'table':
        return <TableWidget widget={widget} data={localData} />
      case 'stat':
        return <StatWidget widget={widget} data={localData} />
      case 'text':
        return <TextWidget widget={widget} />
      default:
        return (
          <div className="p-4">
            <p>Unknown widget type</p>
          </div>
        )
    }
  }

  return (
    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-sm">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] overflow-auto">
        {renderWidget()}
      </CardContent>
    </Card>
  )
}

export default WidgetRenderer
