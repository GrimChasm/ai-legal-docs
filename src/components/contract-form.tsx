"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { exportToPDF, exportToDOCX } from "@/lib/export-utils"
import { contractRegistry } from "@/lib/contracts"
import DatePicker from "@/components/date-picker"
import JurisdictionSelector from "@/components/jurisdiction-selector"
import InterviewForm from "@/components/interview-form"
import DocumentStylePanel from "@/components/document-style-panel"
import { DocumentStyle, defaultStyle, presets } from "@/lib/document-styles"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import SignDocumentModal from "@/components/sign-document-modal"
import SendForSignatureModal from "@/components/send-for-signature-modal"
import SignaturePositioning from "@/components/signature-positioning"
import PaywallModal from "@/components/paywall-modal"
import ExportPreview from "@/components/export-preview"

export default function ContractForm({
  contractId,
  formSchema,
  templateCode,
  draftId
}: {
  contractId: string
  formSchema: Record<
    string,
    { label: string; type: "text" | "textarea" | "date" | "number" | "country/state" }
  >
  templateCode?: string
  draftId?: string
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loadingDraft, setLoadingDraft] = useState(!!draftId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [exportingPDF, setExportingPDF] = useState(false)
  const [exportingDOCX, setExportingDOCX] = useState(false)
  const [interviewMode, setInterviewMode] = useState<"step-by-step" | "grouped">("step-by-step")
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [savingDocument, setSavingDocument] = useState(false)
  const [documentSaved, setDocumentSaved] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId || null)
  const [documentStyle, setDocumentStyle] = useState<DocumentStyle>(defaultStyle)
  const [showSignModal, setShowSignModal] = useState(false)
  const [showSendForSignatureModal, setShowSendForSignatureModal] = useState(false)
  const [signatures, setSignatures] = useState<Array<{ id: string; signerName: string; signerEmail: string; signatureData: string; createdAt: string; position?: "bottom" | "custom"; customY?: number }>>([])
  const [signatureInvites, setSignatureInvites] = useState<Array<{ id: string; recipientName: string; recipientEmail: string; status: string; signedAt: string | null }>>([])
  const [showPaywallModal, setShowPaywallModal] = useState(false)
  const [paywallAction, setPaywallAction] = useState<"export" | "download" | "copy" | "save">("export")
  const [canExport, setCanExport] = useState<boolean | null>(null)
  const { data: session } = useSession()

  // Load user's preferred document style on mount
  useEffect(() => {
    if (session?.user?.id) {
      const loadUserPreferences = async () => {
        try {
          const response = await fetch("/api/user/preferences")
          if (response.ok) {
            const data = await response.json()
            if (data.documentStyle) {
              setDocumentStyle(data.documentStyle)
            }
          }
        } catch (error) {
          console.error("Error loading user preferences:", error)
          // Continue with default style if loading fails
        }
      }
      loadUserPreferences()
    }
  }, [session?.user?.id])

  // Check export permissions when draft is loaded or user changes
  useEffect(() => {
    const checkExportPermission = async () => {
      if (!session?.user?.id || !currentDraftId) {
        // If user has Pro status from session, they can export
        if (session?.user?.isPro) {
          setCanExport(true)
          return
        }
        setCanExport(false)
        return
      }

      try {
        const response = await fetch(`/api/drafts/${currentDraftId}/export-permission`)
        if (response.ok) {
          const data = await response.json()
          setCanExport(data.canExport)
        } else {
          setCanExport(false)
        }
      } catch (error) {
        console.error("Error checking export permission:", error)
        setCanExport(false)
      }
    }

    checkExportPermission()
  }, [session?.user?.id, session?.user?.isPro, currentDraftId])

  // Save user's document style preference when it changes (debounced)
  useEffect(() => {
    if (!session?.user?.id) return

    const timeoutId = setTimeout(async () => {
      try {
        await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentStyle }),
        })
      } catch (error) {
        console.error("Error saving user preferences:", error)
        // Fail silently - preferences are not critical
      }
    }, 1000) // Debounce: save 1 second after last change

    return () => clearTimeout(timeoutId)
  }, [documentStyle, session?.user?.id])

  const fields = Object.entries(formSchema)
  // Robust check for filled fields: must have actual content, not empty/whitespace/undefined/null
  const filledCount = Object.values(values).filter(v => {
    if (!v || typeof v !== 'string') return false
    const trimmed = v.trim()
    return trimmed !== "" && trimmed !== "undefined" && trimmed !== "null"
  }).length
  const progress = (filledCount / fields.length) * 100

  const handleChange = (field: string, value: string) => {
    // Normalize empty values: if value is empty, whitespace-only, or invalid, set to empty string
    const normalizedValue = (value && typeof value === 'string' && value.trim() !== "") ? value : ""
    setValues((prev) => ({ ...prev, [field]: normalizedValue }))
    setError(null)
    // Reset draft saved status when values change
    if (draftSaved) {
      setDraftSaved(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!session) {
      setError("Please sign in to save drafts")
      return
    }

    if (filledCount === 0) {
      setError("Please fill in at least one field before saving")
      return
    }

    setSavingDraft(true)
    setError(null)

    try {
      // If we have an existing draft, update it; otherwise create a new one
      const url = currentDraftId ? `/api/drafts/${currentDraftId}` : "/api/drafts"
      const method = currentDraftId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          values,
          markdown: result || null, // Include markdown if document is already generated
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft")
      }

      // If this was a new draft, save the draft ID
      if (!currentDraftId && data.draft?.id) {
        setCurrentDraftId(data.draft.id)
      }

      setDraftSaved(true)
      // Clear the success message after 3 seconds
      setTimeout(() => setDraftSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save draft")
    } finally {
      setSavingDraft(false)
    }
  }

  const handleSaveDocument = async () => {
    if (!session) {
      setError("Please sign in to save documents")
      return
    }

    if (!result) {
      setError("No document to save. Please generate a document first.")
      return
    }

    setSavingDocument(true)
    setError(null)

    try {
      // If we have an existing draft, update it; otherwise create a new one
      const url = currentDraftId ? `/api/drafts/${currentDraftId}` : "/api/drafts"
      const method = currentDraftId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          values,
          markdown: result, // Save the generated document
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save document")
      }

      // If this was a new draft, save the draft ID
      if (!currentDraftId && data.draft?.id) {
        setCurrentDraftId(data.draft.id)
      }

      setDocumentSaved(true)
      // Clear the success message after 3 seconds
      setTimeout(() => setDocumentSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save document")
    } finally {
      setSavingDocument(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          values,
          templateCode: templateCode || undefined,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setResult(data.markdown)
      setTimeout(() => {
        document.getElementById("generated-document")?.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        })
      }, 100)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load draft if draftId is provided
  useEffect(() => {
    if (draftId) {
      const loadDraft = async () => {
        setLoadingDraft(true)
        try {
          const response = await fetch(`/api/drafts/${draftId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.draft) {
              try {
                const draftValues = JSON.parse(data.draft.values || "{}")
                setValues(draftValues)
                setCurrentDraftId(draftId)
                if (data.draft.markdown) {
                  setResult(data.draft.markdown)
                }
              } catch (parseError) {
                console.error("Error parsing draft values:", parseError)
                setError("Failed to load draft data. Please try again.")
              }
            } else {
              setError("Draft not found")
            }
          } else {
            const errorData = await response.json().catch(() => ({}))
            setError(errorData.error || "Failed to load draft")
          }
        } catch (error: any) {
          console.error("Error loading draft:", error)
          setError(error.message || "Failed to load draft")
        } finally {
          setLoadingDraft(false)
        }
      }
      loadDraft()
    }
  }, [draftId])

  useEffect(() => {
    if (filledCount === fields.length && !result && !loading) {
      // Optional: auto-submit when all fields filled
    }
  }, [filledCount, fields.length, result, loading])

  // Load signatures and invites when draft is available
  useEffect(() => {
    if (currentDraftId && result) {
      loadSignatures()
      loadSignatureInvites()
    }
  }, [currentDraftId, result])

  const loadSignatures = async () => {
    if (!currentDraftId) return
    try {
      const response = await fetch(`/api/signatures?draftId=${currentDraftId}`)
      if (response.ok) {
        const data = await response.json()
        setSignatures(data.signatures || [])
      }
    } catch (error) {
      console.error("Error loading signatures:", error)
    }
  }

  const loadSignatureInvites = async () => {
    if (!currentDraftId) return
    try {
      const response = await fetch(`/api/signature-invites?draftId=${currentDraftId}`)
      if (response.ok) {
        const data = await response.json()
        setSignatureInvites(data.invites || [])
      }
    } catch (error) {
      console.error("Error loading signature invites:", error)
    }
  }

  const handleSigned = () => {
    setShowSignModal(false)
    loadSignatures()
  }

  const handleInvitesSent = () => {
    setShowSendForSignatureModal(false)
    loadSignatureInvites()
  }

  if (result) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-accent bg-blue-50">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-accent-light border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-3">Your Document is Ready!</h2>
            <p className="text-base text-text-muted font-medium">Review and customize your generated legal document below</p>
          </CardContent>
        </Card>

        {/* Document Style Panel - Above Preview */}
        <DocumentStylePanel style={documentStyle} onChange={setDocumentStyle} />

        {/* Document Preview - Full Width */}
        <Card id="generated-document" className="overflow-y-auto overflow-x-hidden">
              <div className="bg-bg-muted px-6 md:px-8 lg:px-10 py-5 md:py-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-text-main">Final Document</h3>
                    <p className="text-sm text-text-muted mt-1">Your complete, ready-to-use legal document</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-green-700">Complete</span>
                  </div>
                </div>
              </div>
              
              {/* Legal Disclaimer */}
              <div className="bg-yellow-50 border-b border-yellow-200 px-6 md:px-8 lg:px-10 py-4">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong className="font-semibold">Legal Disclaimer:</strong> This document is generated from templates and may not be suitable for your specific legal needs. ContractVault is not a law firm and does not provide legal advice. You should consult with a qualified attorney before using this document, especially for complex matters or high-value transactions. The enforceability of this document may vary by jurisdiction.{" "}
                  <Link href="/terms" className="underline hover:text-yellow-900">
                    View Terms of Service
                  </Link>
                </p>
              </div>
              
              <CardContent className="p-8 md:p-10 lg:p-12">
                <ExportPreview
                  content={result}
                  style={documentStyle}
                  signatures={signatures.length > 0 ? signatures.map(sig => ({
                    signerName: sig.signerName,
                    signerEmail: sig.signerEmail,
                    signatureData: sig.signatureData,
                    createdAt: sig.createdAt,
                  })) : undefined}
                />
              </CardContent>

              <div className="bg-gradient-to-br from-bg-muted via-bg-muted to-gray-50 px-6 md:px-8 lg:px-10 py-6 md:py-7 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  {session && (
                    <Button
                      type="button"
                      variant={documentSaved ? "primary" : "outline"}
                      size="lg"
                      onClick={handleSaveDocument}
                      disabled={savingDocument || !result}
                      className="group relative flex-1 min-w-[140px] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {savingDocument ? (
                          <>
                            <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-medium">Saving...</span>
                          </>
                        ) : documentSaved ? (
                          <>
                            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-semibold">Saved!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            <span className="font-medium">Save Document</span>
                          </>
                        )}
                      </span>
                      {documentSaved && (
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-soft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={exportingPDF || !result}
                    onClick={async () => {
                      if (!result) return
                      
                      // Check if user can export
                      if (canExport === false) {
                        setPaywallAction("export")
                        setShowPaywallModal(true)
                        return
                      }

                      // If permission check is still loading, wait a moment
                      if (canExport === null) {
                        // Wait for permission check
                        await new Promise(resolve => setTimeout(resolve, 500))
                        if (canExport === false) {
                          setPaywallAction("export")
                          setShowPaywallModal(true)
                          return
                        }
                      }

                      setExportingPDF(true)
                      try {
                        const contract = contractRegistry[contractId]
                        const stylePreset = Object.keys(presets).find(
                          key => JSON.stringify(presets[key]) === JSON.stringify(documentStyle)
                        ) || "custom"
                        const titleSlug = contract?.title ? contract.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "document"
                        const filename = `${titleSlug}-${stylePreset}-${new Date().toISOString().split('T')[0]}.pdf`
                        await exportToPDF(result, filename, documentStyle, signatures)
                      } catch (err: any) {
                        setError(err.message || "Failed to export PDF")
                      } finally {
                        setExportingPDF(false)
                      }
                    }}
                    className="group relative flex-1 min-w-[140px] overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:border-accent hover:bg-accent/5 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {exportingPDF ? (
                        <>
                          <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-medium">Exporting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:rotate-[-5deg] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold">Export PDF</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={exportingDOCX || !result}
                    onClick={async () => {
                      if (!result) return
                      
                      // Check if user can export
                      if (canExport === false) {
                        setPaywallAction("download")
                        setShowPaywallModal(true)
                        return
                      }

                      // If permission check is still loading, wait a moment
                      if (canExport === null) {
                        // Wait for permission check
                        await new Promise(resolve => setTimeout(resolve, 500))
                        if (canExport === false) {
                          setPaywallAction("download")
                          setShowPaywallModal(true)
                          return
                        }
                      }

                      setExportingDOCX(true)
                      try {
                        const contract = contractRegistry[contractId]
                        const stylePreset = Object.keys(presets).find(
                          key => JSON.stringify(presets[key]) === JSON.stringify(documentStyle)
                        ) || "custom"
                        const titleSlug = contract?.title ? contract.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "document"
                        const filename = `${titleSlug}-${stylePreset}-${new Date().toISOString().split('T')[0]}.docx`
                        await exportToDOCX(result, filename, documentStyle, signatures)
                      } catch (err: any) {
                        setError(err.message || "Failed to export DOCX")
                      } finally {
                        setExportingDOCX(false)
                      }
                    }}
                    className="group relative flex-1 min-w-[140px] overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:border-accent hover:bg-accent/5 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {exportingDOCX ? (
                        <>
                          <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-medium">Exporting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:rotate-[5deg] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-semibold">Export DOCX</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setResult(null)
                      setValues({})
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="group relative flex-1 min-w-[140px] overflow-hidden bg-gradient-to-r from-accent to-accent-soft hover:from-accent-hover hover:to-accent transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center font-semibold">
                      <svg className="w-5 h-5 mr-2 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Another
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full"></div>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Signature Actions */}
            {session && currentDraftId && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setShowSignModal(true)}
                  className="flex-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign This Document
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSendForSignatureModal(true)}
                  className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send for Signature
                </Button>
              </div>
            )}

            {/* Signature Positioning */}
            {signatures.length > 0 && (
              <SignaturePositioning
                signatures={signatures}
                onPositionChange={async (signatureId, position, customY) => {
                  // Update signature position in the database
                  try {
                    const response = await fetch(`/api/signatures/${signatureId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ position, customY }),
                    })
                    if (response.ok) {
                      // Update local state
                      setSignatures(
                        signatures.map((sig) =>
                          sig.id === signatureId
                            ? { ...sig, position, customY }
                            : sig
                        )
                      )
                    }
                  } catch (error) {
                    console.error("Error updating signature position:", error)
                  }
                }}
              />
            )}

            {/* Signature Status */}
            {signatureInvites.length > 0 && (
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-text-main mb-4">Signature Status</h3>
                  <div className="space-y-3">
                    {signatureInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 bg-bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-text-main">
                            {invite.recipientName}
                          </p>
                          <p className="text-xs text-text-muted">{invite.recipientEmail}</p>
                        </div>
                        <div className="text-right">
                          {invite.status === "signed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Signed {invite.signedAt ? new Date(invite.signedAt).toLocaleDateString() : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modals */}
            {showSignModal && currentDraftId && (
              <SignDocumentModal
                draftId={currentDraftId}
                onSigned={handleSigned}
                onClose={() => setShowSignModal(false)}
              />
            )}
            {showSendForSignatureModal && currentDraftId && (
              <SendForSignatureModal
                draftId={currentDraftId}
                onSent={handleInvitesSent}
                onClose={() => setShowSendForSignatureModal(false)}
              />
            )}
            <PaywallModal
              isOpen={showPaywallModal}
              onClose={() => setShowPaywallModal(false)}
              draftId={currentDraftId || undefined}
              action={paywallAction}
            />
      </div>
    )
  }

  // Show loading state while loading draft
  if (loadingDraft) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 md:p-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-text-muted">Loading your draft...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      {fields.length > 3 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Progress</span>
            <span className="font-medium text-text-main">{filledCount} of {fields.length} completed</span>
          </div>
          <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between bg-bg-muted rounded-lg p-4">
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-1">Interview Style</h3>
            <p className="text-xs text-text-muted">Choose how you'd like to answer questions</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={interviewMode === "step-by-step" ? "primary" : "outline"}
              size="sm"
              onClick={() => setInterviewMode("step-by-step")}
            >
              Step-by-Step
            </Button>
            <Button
              type="button"
              variant={interviewMode === "grouped" ? "primary" : "outline"}
              size="sm"
              onClick={() => setInterviewMode("grouped")}
            >
              By Section
            </Button>
          </div>
        </div>

        {/* AI Information */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-text-muted">
            <strong className="text-text-main">Powered by ChatGPT-4:</strong> All documents are generated using OpenAI's GPT-4 for professional, legally sound content.
          </p>
        </div>

        {/* Interview Form */}
        <InterviewForm
          formSchema={formSchema}
          values={values}
          onChange={handleChange}
          onFocus={setFocusedField}
          onBlur={() => setFocusedField(null)}
          mode={interviewMode}
          focusedField={focusedField}
        />

        <div className="pt-6 space-y-6">
          {/* Save Draft Button */}
          {session && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleSaveDraft}
              disabled={savingDraft || filledCount === 0}
              className="w-full hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              {savingDraft ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : draftSaved ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Draft Saved!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Draft
                </>
              )}
            </Button>
          )}

          {/* Generate Document Button */}
          <Button 
            type="submit" 
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || filledCount === 0}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating your document...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generate Document
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800 font-semibold leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {filledCount > 0 && filledCount < fields.length && (
            <p className="text-center text-sm text-text-muted">
              {fields.length - filledCount} more {fields.length - filledCount === 1 ? "field" : "fields"} to complete
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
