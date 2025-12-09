"use client"

import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

/**
 * ContractVault Logo Component
 * 
 * A simple but iconic logo for ContractVault that can be used throughout the application.
 * Features a vault/lock icon with the brand name.
 * 
 * @param size - Size variant: "sm" (small), "md" (medium), "lg" (large)
 * @param showText - Whether to show the "ContractVault" text next to the icon
 * @param href - Optional link URL (defaults to "/")
 * @param className - Additional CSS classes
 */
export default function Logo({ 
  size = "md", 
  showText = true, 
  href = "/",
  className = ""
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: "w-6 h-6",
      text: "text-lg",
      gap: "gap-2"
    },
    md: {
      icon: "w-8 h-8",
      text: "text-xl md:text-2xl",
      gap: "gap-3"
    },
    lg: {
      icon: "w-12 h-12",
      text: "text-3xl md:text-4xl",
      gap: "gap-4"
    }
  }

  const currentSize = sizeClasses[size]

  const logoContent = (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Icon - Vault/Lock - Simple but iconic with dark colors */}
      <div className={`${currentSize.icon} rounded-lg bg-accent/10 border-2 border-accent flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {/* Main Vault/Lock Icon */}
        <svg 
          className="w-4/5 h-4/5 text-primary" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <span className={`font-bold text-primary transition-all ${currentSize.text}`}>
          ContractVault
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className="flex items-center hover:opacity-95 active:scale-[0.98] transition-all duration-150"
        aria-label="ContractVault Home"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

