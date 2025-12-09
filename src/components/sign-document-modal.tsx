"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import SignaturePad from "./signature-pad"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

/**
 * Sign Document Modal Component
 * 
 * Handles the self-signing workflow:
 * 1. Collect signer details (name, email)
 * 2. Capture signature using SignaturePad
 * 3. Submit signature to API
 * 
 * Usage:
 * <SignDocumentModal 
 *   draftId="xxx"
 *   onSigned={handleSigned}
 *   onClose={handleClose}
 * />
 */
interface SignDocumentModalProps {
  draftId: string
  onSigned: () => void
  onClose: () => void
}

export default function SignDocumentModal({
  draftId,
  onSigned,
  onClose,
}: SignDocumentModalProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState<"details" | "signature">("details")
  const [signerName, setSignerName] = useState(session?.user?.name || "")
  const [signerEmail, setSignerEmail] = useState(session?.user?.email || "")
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signerName.trim() || !signerEmail.trim()) {
      setError("Please fill in all fields")
      return
    }
    setError(null)
    setStep("signature")
  }

  const handleSignature = async (
    signatureData: string,
    signatureType: "drawn" | "typed" | "uploaded",
    typedText?: string
  ) => {
    setSigning(true)
    setError(null)

    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId,
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          signatureData,
          signatureType,
          role: "creator",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign document")
      }

      onSigned()
    } catch (err: any) {
      setError(err.message || "Failed to sign document")
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-main">Sign Document</h2>
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

        <div className="p-6">
          {step === "details" ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <Label htmlFor="signerName" className="mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="signerName"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signerEmail" className="mb-2 block">
                  Email *
                </Label>
                <Input
                  id="signerEmail"
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
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
                  className="flex-1"
                >
                  Continue to Signature
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>{signerName}</strong> ({signerEmail})
                </p>
              </div>
              
              {/* E-Signature Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong className="font-semibold">E-Signature Notice:</strong> Electronic signatures are generally legally binding in many jurisdictions, but their enforceability may vary by location and document type. By signing, you acknowledge that you have read and agree to the document terms. ContractVault does not guarantee the legal enforceability of electronic signatures. Consult with legal counsel if you have questions about signature requirements for your specific situation.{" "}
                  <Link href="/terms" className="underline hover:text-yellow-900">
                    View Terms
                  </Link>
                </p>
              </div>
              
              <SignaturePad
                onSign={handleSignature}
                onCancel={() => setStep("details")}
                initialName={signerName}
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              {signing && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-muted">Signing document...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

