"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Modal from "./modal"

interface SignatureRequestDialogProps {
  draftId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function SignatureRequestDialog({
  draftId,
  isOpen,
  onClose,
  onSuccess,
}: SignatureRequestDialogProps) {
  const [signerEmail, setSignerEmail] = useState("")
  const [signerName, setSignerName] = useState("")
  const [provider, setProvider] = useState<"docusign" | "hellosign">("docusign")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId,
          signerEmail,
          signerName,
          provider,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send signature request")
      }

      onSuccess?.()
      onClose()
      setSignerEmail("")
      setSignerName("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send for Signature">
      <form onSubmit={handleSend} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="provider">Signature Provider</Label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as "docusign" | "hellosign")}
            className="mt-1 w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none"
          >
            <option value="docusign">DocuSign</option>
            <option value="hellosign">HelloSign</option>
          </select>
        </div>
        <div>
          <Label htmlFor="signerName">Signer Name</Label>
          <Input
            id="signerName"
            type="text"
            required
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="signerEmail">Signer Email</Label>
          <Input
            id="signerEmail"
            type="email"
            required
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            placeholder="signer@example.com"
            className="mt-1"
          />
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
            className="flex-1 bg-[#0A1B2A] hover:bg-[#0f2538] text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send for Signature"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

