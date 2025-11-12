import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ColorInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex gap-2">
        <Input
          type="color"
          ref={ref}
          className={cn("h-10 w-20 p-1", className)}
          {...props}
        />
        <Input
          type="text"
          value={props.value || "#000000"}
          onChange={props.onChange}
          className="flex-1"
          placeholder="#000000"
        />
      </div>
    )
  }
)
ColorInput.displayName = "ColorInput"

export { ColorInput }

