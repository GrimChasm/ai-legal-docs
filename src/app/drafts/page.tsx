"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
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

interface SignatureStatus {
  userSigned: boolean
  recipientSignatures: Array<{
    name: string
    email: string
    status: "signed" | "pending"
    signedAt?: string
  }>
  totalSignatures: number
  pendingSignatures: number
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [signatureStatuses, setSignatureStatuses] = useState<Record<string, SignatureStatus>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/drafts")
      if (response.ok) {
        const data = await response.json()
        setDrafts(data.drafts || [])
        setError(null)
        
        // Load signature status for each draft (only if user is logged in)
        if (session?.user?.id && data.drafts && data.drafts.length > 0) {
          const statuses: Record<string, SignatureStatus> = {}
          
          // Load all signature statuses in parallel
          const statusPromises = (data.drafts || []).map(async (draft: Draft) => {
            try {
              // Fetch signatures and invites for this draft
              const [signaturesRes, invitesRes] = await Promise.all([
                fetch(`/api/signatures?draftId=${draft.id}`).catch(() => null),
                fetch(`/api/signature-invites?draftId=${draft.id}`).catch(() => null),
              ])
              
              const signatures = signaturesRes?.ok ? (await signaturesRes.json()).signatures || [] : []
              const invites = invitesRes?.ok ? (await invitesRes.json()).invites || [] : []
              
              // Check if current user has signed (signature with role "creator" or matching user email)
              const userEmail = session?.user?.email?.toLowerCase()
              const userSigned = signatures.some((sig: any) => 
                sig.role === "creator" || 
                (userEmail && sig.signerEmail?.toLowerCase() === userEmail && sig.role !== "counterparty")
              )
              
              // Get recipient signatures (exclude recipients that match the current user's email to avoid duplicates)
              const recipientSignatures = invites
                .filter((invite: any) => {
                  // Filter out invites sent to the current user (they'll show as "You signed" instead)
                  return !userEmail || invite.recipientEmail?.toLowerCase() !== userEmail
                })
                .map((invite: any) => {
                  const signature = signatures.find((sig: any) => 
                    sig.signerEmail?.toLowerCase() === invite.recipientEmail?.toLowerCase() && 
                    sig.role === "counterparty"
                  )
                  return {
                    name: invite.recipientName,
                    email: invite.recipientEmail,
                    status: signature ? "signed" : invite.status === "signed" ? "signed" : "pending",
                    signedAt: signature?.createdAt || invite.signedAt,
                  }
                })
              
              return {
                draftId: draft.id,
                status: {
                  userSigned,
                  recipientSignatures,
                  totalSignatures: signatures.length,
                  pendingSignatures: recipientSignatures.filter((r: any) => r.status === "pending").length,
                }
              }
            } catch (err) {
              // If signature fetch fails, just continue without status
              console.warn(`Failed to load signature status for draft ${draft.id}:`, err)
              return {
                draftId: draft.id,
                status: {
                  userSigned: false,
                  recipientSignatures: [],
                  totalSignatures: 0,
                  pendingSignatures: 0,
                }
              }
            }
          })
          
          const results = await Promise.all(statusPromises)
          results.forEach(({ draftId, status }) => {
            statuses[draftId] = status
          })
          
          setSignatureStatuses(statuses)
        }
      } else {
        // Try to parse error message, but handle non-JSON responses
        let errorMessage = "Failed to load drafts"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        console.error("Error loading drafts:", errorMessage, `(Status: ${response.status})`)
        setError(errorMessage)
        
        // If unauthorized, suggest logging in
        if (response.status === 401) {
          setError("Please sign in to view your drafts")
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Error loading drafts:", errorMessage)
      setError("Failed to load drafts. Please try again.")
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
        ) : error ? (
          <Card>
            <CardContent className="p-8 md:p-10 pt-12 text-center">
              <h3 className="text-2xl font-semibold text-text-main mb-3">Error Loading Drafts</h3>
              <p className="text-base text-text-muted mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={loadDrafts}>
                  Try Again
                </Button>
                {error.includes("sign in") && (
                  <Link href="/auth/signin">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-10 pt-12 text-center">
              <h3 className="text-2xl font-semibold text-text-main mb-3">No drafts yet</h3>
              <p className="text-base text-text-muted mb-8">
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

              return (
                <Card
                  key={draft.id}
                  className="hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 h-full flex flex-col cursor-pointer"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-text-main">
                            {contract?.title || "Unknown Document"}
                          </h3>
                          {draft.markdown && draft.markdown.trim().length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Generated
                            </span>
                          )}
                        </div>
                      </div>
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
                    
                    {/* Signature Status Indicators */}
                    {(() => {
                      const status = signatureStatuses[draft.id]
                      if (!status || (status.totalSignatures === 0 && status.recipientSignatures.length === 0)) {
                        return null
                      }
                      
                      return (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="space-y-2">
                            {/* User Signature Status */}
                            {status.userSigned && (
                              <div className="flex items-center gap-2 text-xs">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-green-700 font-medium">You signed</span>
                              </div>
                            )}
                            
                            {/* Recipient Signatures */}
                            {status.recipientSignatures.length > 0 && (
                              <div className="space-y-1">
                                {status.recipientSignatures.map((recipient, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs">
                                    {recipient.status === "signed" ? (
                                      <>
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-green-700 font-medium">
                                          {recipient.name} signed
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-yellow-700">
                                          {recipient.name} pending
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Summary */}
                            {status.recipientSignatures.length > 0 && (
                              <div className="pt-2 border-t border-blue-300 text-xs text-blue-700">
                                {status.recipientSignatures.filter(r => r.status === "signed").length} of {status.recipientSignatures.length} signed
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    
                    {(() => {
                      // Check if this is a template-based draft (contractId starts with "custom-")
                      const isTemplate = draft.contractId.startsWith("custom-")
                      const templateId = isTemplate ? draft.contractId.replace("custom-", "") : null
                      const href = isTemplate 
                        ? `/templates/${templateId}?draftId=${draft.id}`
                        : `/contracts/${draft.contractId}?draftId=${draft.id}`
                      
                      // Check if draft has generated content (markdown) - more robust check
                      const hasGeneratedContent = !!(
                        draft.markdown && 
                        typeof draft.markdown === "string" && 
                        draft.markdown.trim().length > 0
                      )
                      
                      return (
                        <div className="mt-auto space-y-2">
                          {/* Always show View Preview button if markdown exists */}
                          {hasGeneratedContent && (
                            <Link 
                              href={href} 
                              className="block active:scale-[0.98] transition-transform duration-150"
                              onClick={(e) => {
                                // Ensure we go to preview by adding a hash or query param
                                // The contract form will detect markdown and show preview
                                e.stopPropagation()
                              }}
                            >
                              <Button variant="primary" className="w-full">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Preview
                              </Button>
                            </Link>
                          )}
                          <Link 
                            href={href} 
                            className="block active:scale-[0.98] transition-transform duration-150"
                            onClick={(e) => {
                              // If there's generated content, we might want to edit instead of preview
                              e.stopPropagation()
                            }}
                          >
                            <Button 
                              variant={hasGeneratedContent ? "outline" : "primary"} 
                              className="w-full"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {hasGeneratedContent ? "Edit Document" : "Continue Editing"}
                            </Button>
                          </Link>
                        </div>
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
