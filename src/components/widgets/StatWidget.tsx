import { useMemo } from 'react'
import { Widget } from '../../store/slices/dashboardSlice'

interface StatWidgetProps {
  widget: Widget
  data: any
}

function StatWidget({ widget, data }: StatWidgetProps) {
  const value = useMemo(() => {
    if (!data) return widget.config.statValue || 'N/A'

    if (widget.config.statValue) {
      const path = widget.config.statValue.split('.')
      let result = data
      for (const key of path) {
        result = result?.[key]
      }
      return result ?? 'N/A'
    }

    if (typeof data === 'number') return data
    if (typeof data === 'string') return data
    if (Array.isArray(data)) return data.length
    if (typeof data === 'object') {
      const keys = Object.keys(data)
      if (keys.length === 1) return data[keys[0]]
      return JSON.stringify(data)
    }

    return 'N/A'
  }, [data, widget.config.statValue])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div
        className="text-4xl font-bold"
        style={{ color: widget.config.color || '#228be6' }}
      >
        {String(value)}
      </div>
      {widget.config.statLabel && (
        <p className="text-sm text-muted-foreground">{widget.config.statLabel}</p>
      )}
    </div>
  )
}

export default StatWidget
