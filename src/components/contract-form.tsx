"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { exportToPDF, exportToDOCX } from "@/lib/export-utils"
import { contractRegistry } from "@/lib/contracts"
import DatePicker from "@/components/date-picker"
import JurisdictionSelector from "@/components/jurisdiction-selector"
import AIModelSelector from "@/components/ai-model-selector"
import InterviewForm from "@/components/interview-form"
import DocumentStylePanel from "@/components/document-style-panel"
import { DocumentStyle, defaultStyle, getDocumentStyleClasses, getDocumentStyleStyles, getFontFamilyName, getFontSizePt, getLineSpacingValue, presets } from "@/lib/document-styles"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
  const [selectedModel, setSelectedModel] = useState("auto")
  const [interviewMode, setInterviewMode] = useState<"step-by-step" | "grouped">("step-by-step")
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [savingDocument, setSavingDocument] = useState(false)
  const [documentSaved, setDocumentSaved] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId || null)
  const [documentStyle, setDocumentStyle] = useState<DocumentStyle>(defaultStyle)
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
          requestedModel: selectedModel
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
              const draftValues = JSON.parse(data.draft.values || "{}")
              setValues(draftValues)
              setCurrentDraftId(draftId)
              if (data.draft.markdown) {
                setResult(data.draft.markdown)
              }
            }
          }
        } catch (error) {
          console.error("Error loading draft:", error)
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

  if (result) {
    // Apply document styles to preview
    const styleClasses = getDocumentStyleClasses(documentStyle)
    const styleStyles = getDocumentStyleStyles(documentStyle)
    
    // Apply heading styles
    const headingWeight = documentStyle.headingStyle === "bold" ? "font-bold" : "font-normal"
    const headingCase = documentStyle.headingCase === "uppercase" ? "uppercase" : ""
    const headingIndent = documentStyle.headingIndent === "indented" ? "ml-4" : ""

    return (
      <div className="space-y-6">
        <Card className="border-2 border-accent bg-blue-50">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#101623] mb-3">Your Document is Ready!</h2>
            <p className="text-base text-[#4A5568] font-medium">Review and customize your generated legal document below</p>
          </CardContent>
        </Card>

        {/* Document Style Panel - Above Preview */}
        <DocumentStylePanel style={documentStyle} onChange={setDocumentStyle} />

        {/* Document Preview - Full Width */}
        <Card id="generated-document" className="overflow-hidden">
              <div className="bg-bg-muted px-6 md:px-8 lg:px-10 py-5 md:py-6 border-b border-border">
                <h3 className="text-xl font-semibold text-text-main">Document Preview</h3>
                <p className="text-sm text-text-muted mt-1">Your professional legal document</p>
              </div>
              
              <CardContent 
                className="p-8 md:p-10 lg:p-12"
                style={{
                  minHeight: "600px",
                  padding: documentStyle.layout === "wide" ? "2.5rem" : "1.5rem",
                }}
              >
                <div 
                  className={`prose prose-sm max-w-none text-text-main ${styleClasses}`}
                  style={{
                    fontFamily: getFontFamilyName(documentStyle),
                    lineHeight: getLineSpacingValue(documentStyle),
                    fontSize: getFontSizePt(documentStyle) + "pt",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1
                          style={{
                            fontWeight: documentStyle.headingStyle === "bold" ? 700 : 400,
                            textTransform: documentStyle.headingCase === "uppercase" ? "uppercase" : "none",
                            marginLeft: documentStyle.headingIndent === "indented" ? "1rem" : "0",
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            fontWeight: documentStyle.headingStyle === "bold" ? 700 : 400,
                            textTransform: documentStyle.headingCase === "uppercase" ? "uppercase" : "none",
                            marginLeft: documentStyle.headingIndent === "indented" ? "1rem" : "0",
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            fontWeight: documentStyle.headingStyle === "bold" ? 700 : 400,
                            textTransform: documentStyle.headingCase === "uppercase" ? "uppercase" : "none",
                            marginLeft: documentStyle.headingIndent === "indented" ? "1rem" : "0",
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{
                            color: "#101623",
                            marginBottom: documentStyle.paragraphSpacing === "compact" ? "0.5rem" : documentStyle.paragraphSpacing === "roomy" ? "1.5rem" : "1rem",
                          }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ color: "#101623" }}>{children}</li>
                      ),
                      strong: ({ children }) => <strong style={{ color: "#101623" }}>{children}</strong>,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              </CardContent>

              <div className="bg-bg-muted px-6 md:px-8 lg:px-10 py-5 md:py-6 border-t border-border flex flex-col sm:flex-row gap-4">
            {session && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSaveDocument}
                disabled={savingDocument || !result}
                className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                {savingDocument ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : documentSaved ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Document Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Document
                  </>
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
                setExportingPDF(true)
                try {
                  const contract = contractRegistry[contractId]
                  const stylePreset = Object.keys(presets).find(
                    key => JSON.stringify(presets[key]) === JSON.stringify(documentStyle)
                  ) || "custom"
                  const filename = `${contract?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}-${stylePreset}-${new Date().toISOString().split('T')[0]}.pdf`
                  await exportToPDF(result, filename, documentStyle)
                } catch (err: any) {
                  setError(err.message || "Failed to export PDF")
                } finally {
                  setExportingPDF(false)
                }
              }}
              className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              {exportingPDF ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Export PDF
                </>
              )}
            </Button>
            <Button 
              type="button"
              variant="outline"
              size="lg"
              disabled={exportingDOCX || !result}
              onClick={async () => {
                if (!result) return
                setExportingDOCX(true)
                try {
                  const contract = contractRegistry[contractId]
                  const stylePreset = Object.keys(presets).find(
                    key => JSON.stringify(presets[key]) === JSON.stringify(documentStyle)
                  ) || "custom"
                  const filename = `${contract?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}-${stylePreset}-${new Date().toISOString().split('T')[0]}.docx`
                  await exportToDOCX(result, filename, documentStyle)
                } catch (err: any) {
                  setError(err.message || "Failed to export DOCX")
                } finally {
                  setExportingDOCX(false)
                }
              }}
              className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              {exportingDOCX ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export DOCX
                </>
              )}
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
              className="flex-1"
            >
              Create Another
            </Button>
              </div>
            </Card>
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

        {/* AI Model Selector */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 md:p-8">
          <AIModelSelector value={selectedModel} onChange={setSelectedModel} />
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
