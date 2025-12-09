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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest('.menu-container')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isHomePage = pathname === "/"

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/drafts", label: "My Drafts", requiresAuth: true },
    { href: "/templates-library", label: "Templates Library" },
    { href: "/templates/create", label: "Create Template", requiresAuth: true },
    { href: "/bundles", label: "Bundles" },
  ]

  const visibleItems = navigationItems.filter(item => !item.requiresAuth || session)

  return (
    <header
      className={`sticky top-0 z-50 bg-bg border-b border-border shadow-sm transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        <div className="flex items-center justify-between gap-4 min-h-[60px]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Logo 
              size={isScrolled ? "sm" : "md"} 
              showText={true}
              href="/"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 overflow-visible relative menu-container">
            {status === "loading" ? (
              <div className="w-20 h-8" /> // Placeholder to prevent layout shift
            ) : session ? (
              <>
                <UserMenu />
                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-bg-muted transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label="Open navigation menu"
                >
                  <svg
                    className="w-6 h-6 text-text-main"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="py-1">
                      {visibleItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-3 text-sm text-text-main hover:bg-bg-muted transition-colors active:bg-gray-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="inline-block active:scale-[0.98] transition-transform duration-150">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="inline-block active:scale-[0.98] transition-transform duration-150">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
                {/* Hamburger Menu Button for non-authenticated users */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-bg-muted transition-colors active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label="Open navigation menu"
                >
                  <svg
                    className="w-6 h-6 text-text-main"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>

                {/* Dropdown Menu for non-authenticated users */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="py-1">
                      {navigationItems
                        .filter(item => !item.requiresAuth)
                        .map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-sm text-text-main hover:bg-bg-muted transition-colors active:bg-gray-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
