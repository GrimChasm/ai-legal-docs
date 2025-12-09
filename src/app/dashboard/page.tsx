"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center py-20 text-[#6C7783]">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F3F5F7] py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#101623] mb-2">Dashboard</h1>
          <p className="text-[#6C7783]">Welcome back, {session.user?.name || session.user?.email}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/drafts" className="block active:scale-[0.98] transition-transform duration-150">
            <Card className="border border-[#E0E5EC] hover:shadow-card-hover hover:border-accent/50 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-[#101623] mb-2">My Drafts</h3>
                <p className="text-[#6C7783] text-sm">View and manage your saved document drafts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates" className="block active:scale-[0.98] transition-transform duration-150">
            <Card className="border border-[#E0E5EC] hover:shadow-card-hover hover:border-accent/50 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-[#101623] mb-2">Templates</h3>
                <p className="text-[#6C7783] text-sm">Browse and create custom document templates</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates-library" className="block active:scale-[0.98] transition-transform duration-150">
            <Card className="border border-[#E0E5EC] hover:shadow-card-hover hover:border-accent/50 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-6 pt-8">
                <h3 className="text-xl font-semibold text-[#101623] mb-2">Templates Library</h3>
                <p className="text-[#6C7783] text-sm">Browse all available document templates</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Card className="border border-[#E0E5EC]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#101623] mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/templates-library" className="inline-block active:scale-[0.98] transition-transform duration-150">
                  <Button className="bg-[#0A1B2A] hover:bg-[#0f2538] hover:shadow-md active:bg-[#0D1F2E] active:shadow-sm text-white transition-all duration-150">
                    Create New Document
                  </Button>
                </Link>
                <Link href="/templates/create" className="inline-block active:scale-[0.98] transition-transform duration-150">
                  <Button 
                    variant="outline" 
                    className="border-[#0A1B2A] text-[#0A1B2A] hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                  >
                    Create Custom Template
                  </Button>
                </Link>
                <Link href="/bundles" className="inline-block active:scale-[0.98] transition-transform duration-150">
                  <Button 
                    variant="outline" 
                    className="border-[#0A1B2A] text-[#0A1B2A] hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                  >
                    View Bundles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

