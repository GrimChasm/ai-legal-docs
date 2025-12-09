"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { contractRegistry } from "@/lib/contracts"

interface Draft {
  id: string
  contractId: string
  values: string
  markdown: string | null
  createdAt: string
  updatedAt: string
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/drafts")
      if (response.ok) {
        const data = await response.json()
        setDrafts(data.drafts || [])
      }
    } catch (error) {
      console.error("Error loading drafts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return

    try {
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadDrafts()
      }
    } catch (error) {
      console.error("Error deleting draft:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">My Drafts</h1>
            <p className="text-base text-text-muted">Manage your saved document drafts</p>
          </div>
          <Link href="/contracts">
            <Button variant="outline">
              Browse Documents
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading drafts...</div>
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-semibold text-text-main mb-2">No drafts yet</h3>
              <p className="text-base text-text-muted mb-6">
                Start creating a document to save your first draft.
              </p>
              <Link href="/contracts">
                <Button variant="primary">
                  Browse Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => {
              const contract = contractRegistry[draft.contractId]
              const values = JSON.parse(draft.values || "{}")

              return (
                <Card
                  key={draft.id}
                  className="hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 h-full flex flex-col cursor-pointer"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-main">
                        {contract?.title || "Unknown Document"}
                      </h3>
                      <button
                        onClick={() => handleDelete(draft.id)}
                        className="text-text-muted hover:text-danger active:scale-90 transition-all duration-150 rounded p-1 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
                        aria-label="Delete draft"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-text-muted mb-4">
                      Last updated: {formatDate(draft.updatedAt)}
                    </p>
                    <div className="space-y-2 mb-6 flex-1">
                      {Object.entries(values)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium text-text-main">{key}:</span>{" "}
                            <span className="text-text-muted">
                              {String(value).substring(0, 30)}
                              {String(value).length > 30 ? "..." : ""}
                            </span>
                          </div>
                        ))}
                    </div>
                    {(() => {
                      // Check if this is a template-based draft (contractId starts with "custom-")
                      const isTemplate = draft.contractId.startsWith("custom-")
                      const templateId = isTemplate ? draft.contractId.replace("custom-", "") : null
                      const href = isTemplate 
                        ? `/templates/${templateId}?draftId=${draft.id}`
                        : `/contracts/${draft.contractId}?draftId=${draft.id}`
                      
                      return (
                        <Link href={href} className="mt-auto inline-block active:scale-[0.98] transition-transform duration-150">
                          <Button variant="primary" className="w-full">
                            Continue Editing
                          </Button>
                        </Link>
                      )
                    })()}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
