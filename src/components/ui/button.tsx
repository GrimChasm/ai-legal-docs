import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", disabled, ...props }, ref) => {
    // Base styles - consistent across all variants with enhanced feedback
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed"
    
    // Size variants - with proper padding
    const sizeStyles = {
      sm: "h-10 px-4 text-sm rounded-button",
      md: "h-12 px-5 text-base rounded-button",
      lg: "h-14 px-6 text-lg rounded-button",
    }
    
    // Color variants - Modern SaaS style with dark text on light backgrounds
    // ALL buttons use dark text for visibility with dynamic hover effects
    const variantStyles = {
      primary: "bg-accent-light text-accent hover:bg-accent/20 active:bg-accent/30 border-2 border-accent shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none disabled:hover:scale-100 transition-all duration-200",
      secondary: "bg-secondary-light text-secondary hover:bg-secondary/20 active:bg-secondary/30 border-2 border-secondary shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none disabled:hover:scale-100 transition-all duration-200",
      outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent-light hover:border-accent-hover hover:shadow-md hover:scale-[1.02] active:bg-accent/20 active:scale-[0.98] font-semibold disabled:border-gray-300 disabled:text-gray-400 disabled:hover:scale-100 transition-all duration-200",
      ghost: "bg-transparent text-text-main hover:bg-bg-muted hover:scale-[1.02] active:bg-border active:scale-[0.98] font-medium disabled:text-gray-400 disabled:hover:scale-100 transition-all duration-200",
      danger: "bg-red-50 text-danger border-2 border-red-200 hover:bg-red-100 hover:border-red-300 active:bg-red-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none disabled:hover:scale-100 transition-all duration-200",
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }


