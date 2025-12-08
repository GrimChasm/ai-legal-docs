import * as React from "react"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-12 w-full rounded-lg border border-border bg-bg px-4 py-3 text-base text-text-main placeholder:text-text-muted transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:text-text-muted disabled:bg-bg-muted ${className}`}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }


