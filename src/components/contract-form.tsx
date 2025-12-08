"use client"

import { useState, useEffect } from "react"
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

export default function ContractForm({
  contractId,
  formSchema,
  templateCode
}: {
  contractId: string
  formSchema: Record<
    string,
    { label: string; type: "text" | "textarea" | "date" | "number" | "country/state" }
  >
  templateCode?: string
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [exportingPDF, setExportingPDF] = useState(false)
  const [exportingDOCX, setExportingDOCX] = useState(false)
  const [selectedModel, setSelectedModel] = useState("auto")

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

  useEffect(() => {
    if (filledCount === fields.length && !result && !loading) {
      // Optional: auto-submit when all fields filled
    }
  }, [filledCount, fields.length, result, loading])

  if (result) {
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
            <p className="text-base text-[#4A5568] font-medium">Review your generated legal document below</p>
          </CardContent>
        </Card>

        <Card id="generated-document" className="overflow-hidden">
          <div className="bg-bg-muted px-6 md:px-8 lg:px-10 py-5 md:py-6 border-b border-border">
            <h3 className="text-xl font-semibold text-text-main">Generated Document</h3>
            <p className="text-sm text-text-muted mt-1">Your professional legal document</p>
          </div>
          
          <CardContent className="p-8 md:p-10 lg:p-12">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-[#101623] leading-relaxed text-base" style={{ lineHeight: '1.8' }}>
                {result}
              </div>
            </div>
          </CardContent>

          <div className="bg-bg-muted px-6 md:px-8 lg:px-10 py-5 md:py-6 border-t border-border flex flex-col sm:flex-row gap-4">
            <Button 
              variant="secondary" 
              disabled={exportingPDF}
              onClick={async () => {
                if (!result) return
                setExportingPDF(true)
                try {
                  const contract = contractRegistry[contractId]
                  const filename = `${contract?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf`
                  await exportToPDF(result, filename)
                } catch (err: any) {
                  setError(err.message || "Failed to export PDF")
                } finally {
                  setExportingPDF(false)
                }
              }}
              className="flex-1"
            >
              {exportingPDF ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Export PDF
                </>
              )}
            </Button>
            <Button 
              variant="secondary" 
              disabled={exportingDOCX}
              onClick={async () => {
                if (!result) return
                setExportingDOCX(true)
                try {
                  const contract = contractRegistry[contractId]
                  const filename = `${contract?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.docx`
                  await exportToDOCX(result, filename)
                } catch (err: any) {
                  setError(err.message || "Failed to export DOCX")
                } finally {
                  setExportingDOCX(false)
                }
              }}
              className="flex-1"
            >
              {exportingDOCX ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export DOCX
                </>
              )}
            </Button>
            <Button 
              onClick={() => {
                setResult(null)
                setValues({})
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              variant="primary"
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
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
        {/* AI Model Selector */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 md:p-8">
          <AIModelSelector value={selectedModel} onChange={setSelectedModel} />
        </div>

        {fields.map(([field, config]) => {
          const isFocused = focusedField === field
          // More robust check: ensure value exists, is not empty, not just whitespace, and not placeholder-like values
          const fieldValue = values[field]
          const hasValue = fieldValue && 
                          typeof fieldValue === 'string' && 
                          fieldValue.trim() !== "" && 
                          fieldValue.trim() !== "undefined" && 
                          fieldValue.trim() !== "null"
          
          // Normalize field type to ensure consistent matching (handle both standard and custom templates)
          const fieldType = config.type?.toLowerCase().trim() || "text"
          
          return (
            <div key={field} className="space-y-3">
              <Label 
                htmlFor={field}
                className={isFocused ? "text-accent" : ""}
              >
                {config.label}
                {!config.label.includes("(Optional)") && (
                  <span className="text-danger ml-1">*</span>
                )}
              </Label>

              {fieldType === "textarea" ? (
                <Textarea
                  id={field}
                  value={values[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField(null)}
                  required={!config.label.includes("(Optional)")}
                  placeholder={`Enter ${config.label.toLowerCase()}...`}
                  className={hasValue && !isFocused ? "border-blue-300 bg-blue-50" : ""}
                />
              ) : fieldType === "date" ? (
                <DatePicker
                  id={field}
                  value={values[field] || ""}
                  onChange={(value) => handleChange(field, value)}
                  required={!config.label.includes("(Optional)")}
                  placeholder={`Select ${config.label.toLowerCase()}...`}
                  label={config.label}
                />
              ) : fieldType === "country/state" ? (
                <JurisdictionSelector
                  id={field}
                  value={values[field] || ""}
                  onChange={(value) => handleChange(field, value)}
                  required={!config.label.includes("(Optional)")}
                  placeholder={`Select ${config.label.toLowerCase()}...`}
                  includeState={true}
                  label={config.label}
                />
              ) : (
                <Input
                  id={field}
                  type={fieldType === "number" ? "number" : "text"}
                  value={values[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField(null)}
                  required={!config.label.includes("(Optional)")}
                  placeholder={`Enter ${config.label.toLowerCase()}...`}
                  className={hasValue && !isFocused ? "border-blue-300 bg-blue-50" : ""}
                />
              )}

              {hasValue && !isFocused && (
                <div className="flex items-center text-blue-700 text-sm font-semibold">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Field completed</span>
                </div>
              )}
            </div>
          )
        })}

        <div className="pt-6 space-y-6">
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
