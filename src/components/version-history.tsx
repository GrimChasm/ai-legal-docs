"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

interface Version {
  id: string
  createdAt: string
  markdown: string
}

interface VersionHistoryProps {
  draftId: string
  onVersionSelect?: (version: Version) => void
}

export default function VersionHistory({ draftId, onVersionSelect }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (draftId) {
      loadVersions()
    }
  }, [draftId])

  const loadVersions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/drafts/${draftId}/versions`)
      if (response.ok) {
        const data = await response.json()
        setVersions(data.versions || [])
      }
    } catch (error) {
      console.error("Error loading versions:", error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return <div className="text-[#6C7783]">Loading versions...</div>
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-[#6C7783]">
        <p>No version history available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-[#101623] mb-4">Version History</h3>
      {versions.map((version) => (
        <Card
          key={version.id}
          className="border border-[#E0E5EC] p-4 hover:border-[#1A73E8] transition-colors cursor-pointer"
          onClick={() => onVersionSelect?.(version)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#101623]">{formatDate(version.createdAt)}</p>
              <p className="text-sm text-[#6C7783]">
                {version.markdown.substring(0, 100)}...
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onVersionSelect?.(version)
              }}
            >
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

