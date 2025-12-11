"use client"

import { useEffect, useState } from "react"

interface Collaborator {
  id: string
  name: string
  email: string
  role: string
}

interface CollaborationPresenceProps {
  draftId: string
}

export default function CollaborationPresence({ draftId }: CollaborationPresenceProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    if (draftId) {
      loadCollaborators()
      // Poll for updates every 5 seconds
      const interval = setInterval(loadCollaborators, 5000)
      return () => clearInterval(interval)
    }
  }, [draftId])

  const loadCollaborators = async () => {
    try {
      const response = await fetch(`/api/drafts/${draftId}/collaborators`)
      if (response.ok) {
        const data = await response.json()
        setCollaborators(data.collaborators || [])
      }
    } catch (error) {
      console.error("Error loading collaborators:", error)
    }
  }

  if (collaborators.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#F3F5F7] rounded-lg">
      <span className="text-sm text-text-muted">Active collaborators:</span>
      <div className="flex items-center gap-2">
        {collaborators.map((collab) => (
          <div
            key={collab.id}
            className="w-8 h-8 rounded-full bg-accent-light border-2 border-accent flex items-center justify-center text-accent text-xs font-semibold"
            title={`${collab.name} (${collab.role})`}
          >
            {collab.name[0]?.toUpperCase() || collab.email[0]?.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}

