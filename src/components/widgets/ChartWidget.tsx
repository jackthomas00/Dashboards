import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Widget } from '../../store/slices/dashboardSlice'

interface ChartWidgetProps {
  widget: Widget
  data: any
}

function ChartWidget({ widget, data }: ChartWidgetProps) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    if (widget.config.xKey && widget.config.yKey) {
      return data.map((item) => ({
        x: item[widget.config.xKey!],
        y: item[widget.config.yKey!],
        ...item,
      }))
    }

    return data
  }, [data, widget.config])

  const colors = ['#228be6', '#40c057', '#fab005', '#fa5252', '#ae3ec9', '#fd7e14']

  if (!chartData || chartData.length === 0) {
    return <p className="text-sm text-muted-foreground">No data available</p>
  }

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 5, left: 5, bottom: 5 },
  }

  switch (widget.config.chartType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={widget.config.xKey || 'x'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={widget.config.yKey || 'y'}
              stroke={widget.config.color || '#228be6'}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={widget.config.xKey || 'x'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={widget.config.yKey || 'y'} fill={widget.config.color || '#228be6'} />
          </BarChart>
        </ResponsiveContainer>
      )

    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={widget.config.xKey || 'x'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={widget.config.yKey || 'y'}
              stroke={widget.config.color || '#228be6'}
              fill={widget.config.color || '#228be6'}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      )

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey={widget.config.yKey || 'y'}
              nameKey={widget.config.xKey || 'x'}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )

    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={widget.config.xKey || 'x'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={widget.config.yKey || 'y'}
              stroke={widget.config.color || '#228be6'}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )
  }
}

export default ChartWidget

