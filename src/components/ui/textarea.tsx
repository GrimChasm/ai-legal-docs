import * as React from "react"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`flex min-h-[100px] w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-base text-text-main placeholder:text-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-muted resize-y ${className}`}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }


