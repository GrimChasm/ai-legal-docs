import * as React from "react"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-text-main leading-tight mb-2 peer-disabled:cursor-not-allowed peer-disabled:text-text-muted ${className}`}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }


