import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { cn } from "@/lib/utils"

interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Drawer = ({ open, onOpenChange, children }: DrawerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    side?: "left" | "right" | "top" | "bottom"
    title?: string
    description?: string
  }
>(({ className, side = "right", title, description, children, ...props }, ref) => {
  const sideClasses = {
    right: "right-0 top-0 h-full w-[90vw] max-w-md translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-right",
    left: "left-0 top-0 h-full w-[90vw] max-w-md translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-left",
    top: "top-0 left-0 right-0 h-[90vh] max-h-screen translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-top",
    bottom: "bottom-0 left-0 right-0 h-[90vh] max-h-screen translate-x-0 translate-y-0 data-[state=closed]:slide-out-to-bottom",
  }

  return (
    <DialogContent
      ref={ref}
      className={cn(
        sideClasses[side],
        "fixed rounded-none border-l sm:rounded-l-lg bg-background text-foreground",
        className
      )}
      {...props}
    >
      <VisuallyHidden>
        <DialogTitle>{title || "Drawer"}</DialogTitle>
        <DialogDescription>{description || "Drawer content"}</DialogDescription>
      </VisuallyHidden>
      {children}
    </DialogContent>
  )
})
DrawerContent.displayName = "DrawerContent"

export { Drawer, DrawerContent }

