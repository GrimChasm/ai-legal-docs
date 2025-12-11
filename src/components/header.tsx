"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import UserMenu from "./user-menu"
import Logo from "./logo"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-bg-card border-b border-border-light backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? "py-3 shadow-md" : "py-4 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
        <div className="flex items-center justify-between gap-4 min-h-[64px] relative">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Logo 
              size="md" 
              showText={true}
              href="/"
            />
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/templates-library" className="text-text-main hover:text-accent transition-colors font-medium text-sm">
              Templates
            </Link>
            <Link href="/pricing" className="text-text-main hover:text-accent transition-colors font-medium text-sm">
              Pricing
            </Link>
            <Link href="/#features" className="text-text-main hover:text-accent transition-colors font-medium text-sm">
              Features
            </Link>
          </nav>

          {/* Right Side Actions - Anchored to the right */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 overflow-visible relative ml-auto">
            {status === "loading" ? (
              <div className="w-20 h-8" /> // Placeholder to prevent layout shift
            ) : session ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/auth/signin" className="hidden md:inline-block">
                  <Button variant="ghost" size="sm" className="text-text-main hover:text-accent">
                    Log in
                  </Button>
                </Link>
                <Link href="/templates-library" className="inline-block">
                  <Button variant="primary" size="sm">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
