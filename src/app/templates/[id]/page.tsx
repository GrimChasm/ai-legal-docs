"use client"

import { Suspense, useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ContractForm from "@/components/contract-form"

interface Template {
  id: string
  title: string
  description: string | null
  formSchema: string
  templateCode: string
  category: string | null
  documentType: string | null
  industry: string | null
  isPublic: boolean
  userId: string
}

function TemplateContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Extract templateId immediately to avoid React DevTools serialization issues
  // useParams() returns synchronously in client components, but we extract
  // the value immediately to prevent params object from being enumerated
  const templateId = String(params?.id || "")
  const draftId = searchParams.get("draftId")
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  const loadTemplate = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      if (!response.ok) {
        throw new Error("Template not found")
      }
      const data = await response.json()
      setTemplate(data.template)
    } catch (err: any) {
      setError(err.message || "Failed to load template")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-20 text-[#6C7783]">Loading template...</div>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="border border-[#E0E5EC]">
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-semibold text-[#101623] mb-2">Template Not Found</h3>
              <p className="text-[#6C7783] mb-6">{error || "The template you're looking for doesn't exist."}</p>
              <Button
                onClick={() => router.push("/templates")}
                variant="primary"
              >
                Back to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const formSchema = JSON.parse(template.formSchema || "{}")

  return (
    <div className="min-h-screen bg-[#F3F5F7] py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-[#101623] tracking-tight">{template.title}</h1>
          <p className="text-xl text-[#6C7783] max-w-2xl mx-auto leading-relaxed">
            {template.description || "Custom legal document template"}
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            {template.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#F3F5F7] text-[#101623] border border-[#E0E5EC]">
                {template.category}
              </span>
            )}
            {template.industry && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#F3F5F7] text-[#101623] border border-[#E0E5EC]">
                {template.industry}
              </span>
            )}
            {template.isPublic && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Public
              </span>
            )}
          </div>
        </div>

        <Card className="border border-[#E0E5EC] shadow-card">
          <CardContent className="p-8 md:p-12">
            <ContractForm
              contractId={`custom-${template.id}`}
              formSchema={formSchema}
              templateCode={template.templateCode}
              draftId={draftId || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F3F5F7] py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-20 text-[#6C7783]">Loading template...</div>
        </div>
      </div>
    }>
      <TemplateContent />
    </Suspense>
  )
}

