"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === "loading" || !session) {
    return null
  }

  const userInitial = session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F5F7] active:scale-95 active:bg-gray-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-semibold text-sm">
          {userInitial}
        </div>
        <span className="text-[#101623] font-medium hidden sm:block">
          {session.user?.name || session.user?.email}
        </span>
        <svg
          className={`w-4 h-4 text-[#6C7783] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E0E5EC] rounded-lg shadow-lg z-20">
            <div className="py-1">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-[#101623] hover:bg-[#F3F5F7] active:bg-gray-200 transition-all duration-150 focus:outline-none focus:bg-[#F3F5F7]"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/drafts"
                className="block px-4 py-2 text-sm text-[#101623] hover:bg-[#F3F5F7] active:bg-gray-200 transition-all duration-150 focus:outline-none focus:bg-[#F3F5F7]"
                onClick={() => setIsOpen(false)}
              >
                My Drafts
              </Link>
              <div className="border-t border-[#E0E5EC] my-1" />
              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#101623] hover:bg-[#F3F5F7] active:bg-gray-200 transition-all duration-150 focus:outline-none focus:bg-[#F3F5F7]"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

