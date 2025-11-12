import { useMemo } from 'react'
import { Widget } from '../../store/slices/dashboardSlice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TableWidgetProps {
  widget: Widget
  data: any
}

function TableWidget({ widget, data }: TableWidgetProps) {
  const tableData = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'object') return [data]
    return []
  }, [data])

  const columns = useMemo(() => {
    if (widget.config.tableColumns && widget.config.tableColumns.length > 0) {
      return widget.config.tableColumns
    }
    if (tableData.length > 0) {
      return Object.keys(tableData[0])
    }
    return []
  }, [tableData, widget.config.tableColumns])

  if (!tableData || tableData.length === 0) {
    return <p className="text-sm text-muted-foreground">No data available</p>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.slice(0, 10).map((row: any, index: number) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col] ?? '')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TableWidget
