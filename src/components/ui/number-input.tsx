import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value?: number
  onChange?: (value: number | undefined) => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <Input
        type="number"
        ref={ref}
        className={cn(className)}
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value
          onChange?.(val === "" ? undefined : Number(val))
        }}
        {...props}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }

