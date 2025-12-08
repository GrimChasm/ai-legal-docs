"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DocumentViewer from "@/components/document-viewer"
import { contractRegistry } from "@/lib/contracts"

interface SharedDraft {
  id: string
  contractId: string
  values: Record<string, string>
  markdown: string | null
  createdAt: string
  updatedAt: string
}

interface ShareInfo {
  role: string
  email: string
}

export default function SharedDocumentPage() {
  const params = useParams()
  const token = params.token as string
  const [draft, setDraft] = useState<SharedDraft | null>(null)
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      loadSharedDocument()
    }
  }, [token])

  const loadSharedDocument = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/shared/${token}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to load shared document")
      }
      const data = await response.json()
      setDraft(data.draft)
      setShareInfo(data.share)
    } catch (err: any) {
      setError(err.message || "Failed to load shared document")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-20 text-[#6C7783]">Loading shared document...</div>
        </div>
      </div>
    )
  }

  if (error || !draft) {
    return (
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="border border-[#E0E5EC]">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold text-[#101623] mb-2">Document Not Available</h3>
              <p className="text-[#6C7783] mb-6">{error || "The shared document is not available."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const contract = contractRegistry[draft.contractId]

  return (
    <div className="min-h-screen bg-[#F3F5F7] py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Shared Document</strong> • You are viewing this document as a {shareInfo?.role || "viewer"}
            </p>
          </div>
          <h1 className="text-4xl font-bold text-[#101623] mb-2">
            {contract?.title || "Shared Document"}
          </h1>
          <p className="text-[#6C7783]">
            {contract?.description || "A shared legal document"}
          </p>
        </div>

        {draft.markdown ? (
          <Card className="border border-[#E0E5EC] shadow-card">
            <CardContent className="p-8">
              <DocumentViewer markdown={draft.markdown} />
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-[#E0E5EC]">
            <CardContent className="p-12 text-center">
              <p className="text-[#6C7783]">This document has not been generated yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

