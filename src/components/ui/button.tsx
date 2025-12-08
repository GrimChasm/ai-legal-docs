import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", disabled, ...props }, ref) => {
    // Base styles - consistent across all variants with enhanced feedback
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] active:transition-transform active:duration-75"
    
    // Size variants - with proper padding
    const sizeStyles = {
      sm: "h-10 px-4 text-sm rounded-button",
      md: "h-12 px-5 text-base rounded-button",
      lg: "h-14 px-6 text-lg rounded-button",
    }
    
    // Color variants using design tokens - light backgrounds for dark text with enhanced feedback
    const variantStyles = {
      primary: "bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-2 border-accent shadow-sm hover:shadow-md active:shadow-sm font-semibold disabled:bg-gray-200 disabled:border-gray-300",
      secondary: "bg-bg-muted hover:bg-border active:bg-gray-300 border border-border font-medium disabled:bg-gray-200",
      outline: "bg-white border-2 border-primary hover:bg-primary hover:text-white active:bg-primary-hover active:text-white font-semibold disabled:border-gray-400",
      ghost: "bg-transparent hover:bg-bg-muted active:bg-gray-200 font-medium",
      danger: "bg-red-50 hover:bg-red-100 active:bg-red-200 border-2 border-red-300 shadow-sm hover:shadow-md active:shadow-sm font-semibold disabled:bg-gray-200 disabled:border-gray-300",
    }
    
    // Determine text color based on variant and disabled state
    const getTextColor = () => {
      if (disabled) {
        return "#6B7280" // Medium gray text for disabled state
      } else {
        // All enabled buttons use dark text by default
        return "#101623" // Dark text for all variants
      }
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        style={{ color: getTextColor() }}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }


