"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Modal from "./modal"

interface ShareDialogProps {
  draftId: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareDialog({ draftId, isOpen, onClose }: ShareDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"viewer" | "editor" | "commenter">("viewer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/drafts/${draftId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to share document")
      }

      setSuccess(true)
      setEmail("")
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document">
      <form onSubmit={handleShare} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Document shared successfully!
          </div>
        )}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Permission Level</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "viewer" | "editor" | "commenter")}
            className="mt-1 w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none"
          >
            <option value="viewer">Viewer - Can view only</option>
            <option value="commenter">Commenter - Can view and comment</option>
            <option value="editor">Editor - Can view, comment, and edit</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

