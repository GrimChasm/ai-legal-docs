"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

interface SignatureRequest {
  id: string
  signerEmail: string
  signerName?: string
  status: "pending" | "sent" | "signed" | "declined"
  provider: string
  createdAt: string
  updatedAt: string
}

interface SignatureStatusProps {
  draftId: string
}

export default function SignatureStatus({ draftId }: SignatureStatusProps) {
  const [requests, setRequests] = useState<SignatureRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (draftId) {
      loadSignatureRequests()
    }
  }, [draftId])

  const loadSignatureRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/signatures?draftId=${draftId}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Error loading signature requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="text-text-muted">Loading signature status...</div>
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p>No signature requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-text-main mb-4">Signature Status</h3>
      {requests.map((request) => (
        <Card key={request.id} className="border border-[#E0E5EC] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text-main">
                {request.signerName || request.signerEmail}
              </p>
              <p className="text-sm text-text-muted">
                {request.provider} • {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                request.status
              )}`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

