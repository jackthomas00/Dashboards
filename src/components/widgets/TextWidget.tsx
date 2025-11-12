import { Widget } from '../../store/slices/dashboardSlice'

interface TextWidgetProps {
  widget: Widget
}

function TextWidget({ widget }: TextWidgetProps) {
  return (
    <p className="text-sm whitespace-pre-wrap">
      {widget.config.text || 'Enter text in widget configuration'}
    </p>
  )
}

export default TextWidget
