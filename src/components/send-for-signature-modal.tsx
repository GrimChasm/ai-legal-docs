"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"

/**
 * Send for Signature Modal Component
 * 
 * Allows document creator to invite others to sign:
 * 1. Enter recipient name and email
 * 2. Create signature invite
 * 3. Show signing URL (or send email)
 * 
 * Usage:
 * <SendForSignatureModal 
 *   draftId="xxx"
 *   onSent={handleSent}
 *   onClose={handleClose}
 * />
 */
interface SendForSignatureModalProps {
  draftId: string
  onSent: () => void
  onClose: () => void
}

interface Recipient {
  name: string
  email: string
}

export default function SendForSignatureModal({
  draftId,
  onSent,
  onClose,
}: SendForSignatureModalProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { name: "", email: "" },
  ])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentInvites, setSentInvites] = useState<Array<{ name: string; email: string; url: string; emailSent?: boolean; emailError?: string }>>([])

  const addRecipient = () => {
    // Removed limit - support unlimited recipients
    setRecipients([...recipients, { name: "", email: "" }])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients]
    updated[index] = { ...updated[index], [field]: value }
    setRecipients(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate recipients
    const validRecipients = recipients.filter(
      (r) => r.name.trim() && r.email.trim()
    )

    if (validRecipients.length === 0) {
      setError("Please add at least one recipient")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const recipient of validRecipients) {
      if (!emailRegex.test(recipient.email)) {
        setError(`Invalid email format: ${recipient.email}`)
        return
      }
    }

    setSending(true)

    try {
      const invites = []
      for (const recipient of validRecipients) {
        const response = await fetch("/api/signature-invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draftId,
            recipientName: recipient.name.trim(),
            recipientEmail: recipient.email.trim(),
          }),
        })

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("Non-JSON response:", text.substring(0, 200))
          throw new Error("Server returned an error. Please check the console for details.")
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to send invite")
        }

        invites.push({
          name: recipient.name,
          email: recipient.email,
          url: data.signingUrl,
          emailSent: data.emailSent,
          emailError: data.emailError,
        })
      }

      setSentInvites(invites)
      onSent()
    } catch (err: any) {
      setError(err.message || "Failed to send invites")
    } finally {
      setSending(false)
    }
  }

  if (sentInvites.length > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-main">Invites Sent</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-text-main">
              Signature requests have been created. Share these links with recipients:
            </p>
            {sentInvites.map((invite, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-text-main mb-1">
                      {invite.name} ({invite.email})
                    </p>
                    {invite.emailSent ? (
                      <p className="text-xs text-green-600">✓ Email sent successfully</p>
                    ) : invite.emailError === "EMAIL_NOT_CONFIGURED" ? (
                      <div className="space-y-2">
                        <p className="text-xs text-yellow-600">⚠ Email not configured - invite created but email not sent</p>
                        <p className="text-xs text-text-muted">
                          To send emails automatically, configure an email service in your .env file.
                          See EMAIL_SETUP.md for instructions.
                        </p>
                      </div>
                    ) : invite.emailError ? (
                      <p className="text-xs text-yellow-600">⚠ Email failed to send - invite created but email not sent</p>
                    ) : null}
                  </div>
                  <div>
                    <Label className="text-xs text-text-muted mb-1 block">Signing Link (share this with the recipient):</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={invite.url}
                        readOnly
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(invite.url)}
                        className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={onClose}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-main">Send for Signature</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-text-muted mb-4">
              Add recipients who need to sign this document
            </p>
            {recipients.map((recipient, index) => (
              <div key={index} className="mb-4 p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-text-main">
                    Recipient {index + 1}
                  </Label>
                  {recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      className="text-sm text-danger hover:text-danger-hover"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <Label htmlFor={`name-${index}`} className="mb-2 block text-sm">
                    Name *
                  </Label>
                  <Input
                    id={`name-${index}`}
                    value={recipient.name}
                    onChange={(e) => updateRecipient(index, "name", e.target.value)}
                    placeholder="Recipient name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`email-${index}`} className="mb-2 block text-sm">
                    Email *
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(index, "email", e.target.value)}
                    placeholder="recipient@example.com"
                    required
                  />
                </div>
              </div>
            ))}
            {recipients.length < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={addRecipient}
                className="w-full hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                + Add Another Recipient
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={sending}
              className="flex-1"
            >
              {sending ? "Sending..." : "Send Invites"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

