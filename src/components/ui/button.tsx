import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    // Base styles - consistent across all variants
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
    
    // Size variants
    const sizeStyles = {
      sm: "h-9 px-3 text-sm rounded-button",
      md: "h-11 px-4 text-base rounded-button",
      lg: "h-12 px-6 text-lg rounded-button",
    }
    
    // Color variants using design tokens
    const variantStyles = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md",
      secondary: "bg-bg-muted text-text-main hover:bg-border border border-border",
      outline: "bg-white text-[#0A1B2A] border-2 border-primary hover:bg-primary hover:text-white font-semibold",
      ghost: "bg-transparent text-[#101623] hover:bg-bg-muted hover:text-[#101623] font-medium",
      danger: "bg-danger text-white hover:bg-danger-hover shadow-sm hover:shadow-md",
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }


