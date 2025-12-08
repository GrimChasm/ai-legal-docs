"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import HomeButton from "./home-button"
import { Button } from "./ui/button"
import UserMenu from "./user-menu"

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

  const isHomePage = pathname === "/"

  return (
    <header
      className={`sticky top-0 z-50 bg-bg border-b transition-all duration-300 ${
        isScrolled ? "border-border shadow-sm py-2" : "border-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        <div className="flex items-center justify-between gap-4 min-h-[60px]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className={`font-bold text-primary transition-all ${isScrolled ? "text-xl" : "text-2xl"}`}>
                ContractVault
              </span>
            </Link>
            {!isHomePage && <HomeButton />}
          </div>


          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 overflow-visible">
            {status === "loading" ? (
              <div className="w-20 h-8" /> // Placeholder to prevent layout shift
            ) : session ? (
              <>
                <Link href="/drafts" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    My Drafts
                  </Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
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
