"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import AIModelSelector from "@/components/ai-model-selector"

type FieldType = "text" | "textarea" | "date" | "number" | "country/state"

interface FormField {
  name: string
  label: string
  type: FieldType
}

export default function CreateTemplatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [industry, setIndustry] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  // Step 2: Form Schema
  const [formSchema, setFormSchema] = useState<Record<string, { label: string; type: FieldType }>>({})
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldType, setNewFieldType] = useState<FieldType>("text")

  // Step 3: Template Code
  const [codeGenerated, setCodeGenerated] = useState(false)
  const [selectedModel, setSelectedModel] = useState("auto")
  const [templateCode, setTemplateCode] = useState("")
  const [generatingCode, setGeneratingCode] = useState(false)

  const addField = () => {
    if (!newFieldName.trim()) {
      alert("Field name is required")
      return
    }
    if (formSchema[newFieldName]) {
      alert("Field name must be unique")
      return
    }

    setFormSchema({
      ...formSchema,
      [newFieldName]: {
        label: newFieldLabel || newFieldName,
        type: newFieldType,
      },
    })

    setNewFieldName("")
    setNewFieldLabel("")
    setNewFieldType("text")
  }

  const removeField = (fieldName: string) => {
    const newSchema = { ...formSchema }
    delete newSchema[fieldName]
    setFormSchema(newSchema)
  }

  const generateCode = async () => {
    if (!title || !description || Object.keys(formSchema).length === 0) {
      setError("Please complete steps 1 and 2 before generating code")
      return
    }

    setGeneratingCode(true)
    setError(null)

    try {
      const response = await fetch("/api/templates/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          formSchema,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate template code")
      }

      const data = await response.json()
      setTemplateCode(data.templateCode)
      setCodeGenerated(true)
    } catch (err: any) {
      setError(err.message || "Failed to generate template code")
    } finally {
      setGeneratingCode(false)
    }
  }

  const handleSubmit = async () => {
    if (!title || !description || !templateCode) {
      setError("Please complete all steps")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          formSchema,
          templateCode,
          category: category || null,
          documentType: documentType || null,
          industry: industry || null,
          isPublic,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create template")
      }

      const data = await response.json()
      router.push(`/templates/${data.template.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create template")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Create Custom Template</h1>
          <p className="text-base text-text-muted">Build your own legal document template</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? "bg-accent text-white"
                    : "bg-border text-text-muted"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 font-medium px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-text-main mb-6">
                    Step 1: Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-2 block">
                      Template Title *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Custom Service Agreement"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-2 block">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this template is for..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="mb-2 block">
                        Category (Optional)
                      </Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Business, Legal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="documentType" className="mb-2 block">
                        Document Type (Optional)
                      </Label>
                      <Input
                        id="documentType"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        placeholder="e.g., Agreement, Policy"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="industry" className="mb-2 block">
                      Industry (Optional)
                    </Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isPublic" className="cursor-pointer">
                      Make this template public
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button
                    variant="primary"
                    onClick={() => setStep(2)}
                    disabled={!title || !description}
                  >
                    Next: Form Fields
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Form Fields */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-text-main mb-6">
                    Step 2: Form Fields
                  </h2>
                  <p className="text-base text-text-muted mb-6">
                    Define the fields that users will fill out to generate the document
                  </p>
                </div>

                {/* Add Field Form */}
                <div className="bg-bg-muted p-4 md:p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-text-main">Add New Field</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fieldName" className="mb-2 block text-sm">
                        Field Name *
                      </Label>
                      <Input
                        id="fieldName"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="e.g., clientName"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldLabel" className="mb-2 block text-sm">
                        Label
                      </Label>
                      <Input
                        id="fieldLabel"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="e.g., Client Name"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fieldType" className="mb-2 block text-sm">
                        Type
                      </Label>
                      <select
                        id="fieldType"
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm bg-bg text-text-main"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="date">Date</option>
                        <option value="number">Number</option>
                        <option value="country/state">Country/State</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={addField}
                    disabled={!newFieldName.trim()}
                    variant="primary"
                  >
                    Add Field
                  </Button>
                </div>

                {/* Existing Fields */}
                {Object.keys(formSchema).length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-text-main">Fields</h3>
                    {Object.entries(formSchema).map(([name, config]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between p-4 bg-bg border border-border rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-text-main">{config.label}</span>
                          <span className="text-sm text-text-muted ml-2">
                            ({name}) - {config.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeField(name)}
                          className="text-danger hover:text-danger-hover text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <p>No fields added yet. Add fields above to get started.</p>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setStep(3)}
                    disabled={Object.keys(formSchema).length === 0}
                  >
                    Next: Generate Code
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Template Code */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-text-main mb-6">
                    Step 3: Template Code
                  </h2>
                  <p className="text-base text-text-muted mb-6">
                    AI will automatically generate the template code based on your form fields
                  </p>
                </div>

                <AIModelSelector value={selectedModel} onChange={setSelectedModel} />

                {!codeGenerated ? (
                  <div className="text-center py-8">
                    <Button
                      onClick={generateCode}
                      disabled={generatingCode}
                      variant="primary"
                    >
                      {generatingCode ? "Generating Code..." : "Generate Template Code"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Generated Template Code</Label>
                      <Textarea
                        value={templateCode}
                        onChange={(e) => setTemplateCode(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                        placeholder="Template code will appear here..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={generateCode}
                        disabled={generatingCode}
                        variant="outline"
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!templateCode || loading}
                  >
                    {loading ? "Creating..." : "Create Template"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

