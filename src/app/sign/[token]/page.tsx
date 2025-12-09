"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import SignaturePad from "@/components/signature-pad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/**
 * Public Signing Page
 * 
 * Allows recipients to sign documents via a secure token link.
 * 
 * Route: /sign/[token]
 */
export default function SignPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [invite, setInvite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"details" | "signature">("details")
  const [signerName, setSignerName] = useState("")
  const [signerEmail, setSignerEmail] = useState("")
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    if (token) {
      loadInvite()
    }
  }, [token])

  const loadInvite = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/signature-invites/${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invite not found")
      }

      setInvite(data.invite)
      setSignerName(data.invite.recipientName)
      setSignerEmail(data.invite.recipientEmail)
    } catch (err: any) {
      setError(err.message || "Failed to load invite")
    } finally {
      setLoading(false)
    }
  }

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
      const response = await fetch(`/api/signature-invites/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          signatureData,
          signatureType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign document")
      }

      setSigned(true)
    } catch (err: any) {
      setError(err.message || "Failed to sign document")
    } finally {
      setSigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-text-main mb-4">Error</h2>
            <p className="text-text-muted mb-6">{error}</p>
            <Button
              variant="primary"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-text-main mb-4">Document Signed!</h2>
            <p className="text-text-muted mb-6">
              Thank you for signing the document. The document creator has been notified.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/")}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">
            Sign Document
          </h1>
          <p className="text-text-muted">
            Please review and sign the document below
          </p>
        </div>

        {/* Document Preview */}
        {invite?.draft?.markdown && (
          <Card className="mb-6 border-2 border-border">
            <CardContent className="p-8">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {invite.draft.markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signing Form */}
        <Card className="border-2 border-border">
          <CardContent className="p-6 md:p-8">
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
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                >
                  Continue to Signature
                </Button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

