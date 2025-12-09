"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { contractRegistry, ContractDefinition } from "@/lib/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type IndustryFilter = "All" | "Business / Startup" | "Real Estate" | "Freelancers / Creators" | "HR / Employment" | "E-Commerce / Online Business"
type DocumentTypeFilter = "All" | "Agreement" | "Policy" | "Letter" | "Contract"

const industries: IndustryFilter[] = [
  "All",
  "Business / Startup",
  "Real Estate",
  "Freelancers / Creators",
  "HR / Employment",
  "E-Commerce / Online Business",
]

const documentTypes: DocumentTypeFilter[] = [
  "All",
  "Agreement",
  "Policy",
  "Letter",
  "Contract",
]

export default function TemplatesLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryFilter>("All")
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentTypeFilter>("All")
  const [previewTemplate, setPreviewTemplate] = useState<ContractDefinition | null>(null)
  const [viewMode, setViewMode] = useState<"grouped" | "all">("grouped")

  const contracts = Object.values(contractRegistry)

  // Group templates by industry
  const templatesByIndustry = useMemo(() => {
    const grouped: Record<string, ContractDefinition[]> = {}
    
    contracts.forEach((contract) => {
      const industry = contract.industry || "Other"
      if (!grouped[industry]) {
        grouped[industry] = []
      }
      grouped[industry].push(contract)
    })
    
    return grouped
  }, [contracts])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = contracts

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contract) =>
          contract.title.toLowerCase().includes(query) ||
          contract.description.toLowerCase().includes(query) ||
          contract.industry?.toLowerCase().includes(query) ||
          contract.documentType?.toLowerCase().includes(query)
      )
    }

    // Industry filter
    if (selectedIndustry !== "All") {
      filtered = filtered.filter((contract) => contract.industry === selectedIndustry)
    }

    // Document type filter
    if (selectedDocumentType !== "All") {
      filtered = filtered.filter((contract) => contract.documentType === selectedDocumentType)
    }

    return filtered
  }, [contracts, searchQuery, selectedIndustry, selectedDocumentType])

  // Get unique industries from templates
  const availableIndustries = useMemo(() => {
    const industries = new Set<string>()
    contracts.forEach((contract) => {
      if (contract.industry) {
        industries.add(contract.industry)
      }
    })
    return Array.from(industries).sort()
  }, [contracts])

  // Get unique document types from templates
  const availableDocumentTypes = useMemo(() => {
    const types = new Set<string>()
    contracts.forEach((contract) => {
      if (contract.documentType) {
        types.add(contract.documentType)
      }
    })
    return Array.from(types).sort()
  }, [contracts])

  const handlePreview = (template: ContractDefinition) => {
    setPreviewTemplate(template)
  }

  const closePreview = () => {
    setPreviewTemplate(null)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="bg-bg-muted border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-container py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-4">
              Templates Library
            </h1>
            <p className="text-lg md:text-xl text-text-main mb-8">
              Browse our collection of professional legal document templates organized by industry
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Input
                  type="text"
                  placeholder="Search templates... (e.g., NDA, Lease, Privacy Policy)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-main active:scale-90 transition-all duration-150 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    aria-label="Clear search"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-main">Industry:</span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value as IndustryFilter)}
                  className="px-3 py-1.5 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent hover:border-accent/50 transition-all duration-200 outline-none text-sm cursor-pointer"
                >
                  <option value="All">All Industries</option>
                  {availableIndustries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-main">Type:</span>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value as DocumentTypeFilter)}
                  className="px-3 py-1.5 border border-border rounded-lg bg-bg text-text-main focus:ring-2 focus:ring-accent focus:border-accent hover:border-accent/50 transition-all duration-200 outline-none text-sm cursor-pointer"
                >
                  <option value="All">All Types</option>
                  {availableDocumentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {(selectedIndustry !== "All" || selectedDocumentType !== "All" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedIndustry("All")
                    setSelectedDocumentType("All")
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-container py-12">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-text-main mb-2">No templates found</h3>
            <p className="text-base text-text-main">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* View Mode Toggle */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-text-main">
                  {searchQuery || selectedIndustry !== "All" || selectedDocumentType !== "All"
                    ? `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""} found`
                    : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""} available`}
                </h2>
              </div>
              {!searchQuery && selectedIndustry === "All" && selectedDocumentType === "All" && (
                <div className="flex items-center gap-2 bg-bg-muted rounded-lg p-1">
                  <Button
                    type="button"
                    variant={viewMode === "grouped" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grouped")}
                    className="active:scale-[0.98]"
                  >
                    By Industry
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "all" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("all")}
                    className="active:scale-[0.98]"
                  >
                    All Templates
                  </Button>
                </div>
              )}
            </div>

            {/* Show filtered results, grouped view, or all templates view */}
            {searchQuery || selectedIndustry !== "All" || selectedDocumentType !== "All" ? (
              // Filtered view - always flat grid
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            ) : viewMode === "all" ? (
              // All templates view - flat grid without grouping
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            ) : (
              // Industry sections view
              <div className="space-y-16">
                {industries.slice(1).map((industry) => {
                  const industryTemplates = templatesByIndustry[industry] || []
                  if (industryTemplates.length === 0) return null

                  return (
                    <section key={industry} className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-3xl font-bold text-text-main">{industry}</h2>
                        <p className="text-text-muted mt-2">
                          {industryTemplates.length} template{industryTemplates.length !== 1 ? "s" : ""} available
                        </p>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industryTemplates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onPreview={handlePreview}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="bg-bg rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-bg border-b border-border px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#FFFFFF' }}>
              <h3 className="text-xl font-semibold text-text-main">{previewTemplate.title}</h3>
              <button
                onClick={closePreview}
                className="text-text-muted hover:text-text-main active:scale-90 transition-all duration-150 rounded p-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="Close preview"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
              <div>
                <p className="text-text-main leading-relaxed">{previewTemplate.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewTemplate.industry && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 font-medium">
                    {previewTemplate.industry}
                  </span>
                )}
                {previewTemplate.documentType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 font-medium">
                    {previewTemplate.documentType}
                  </span>
                )}
                {previewTemplate.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 font-medium">
                    {previewTemplate.category}
                  </span>
                )}
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-text-main mb-2">What you'll need to fill out:</p>
                <ul className="space-y-2">
                  {Object.entries(previewTemplate.formSchema).map(([key, config]) => (
                    <li key={key} className="text-sm text-text-main">
                      • {config.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 flex gap-3">
                <Link href={`/contracts/${previewTemplate.id}`} className="flex-1 active:scale-[0.98] transition-transform duration-150">
                  <Button variant="primary" className="w-full">
                    Use This Template
                  </Button>
                </Link>
                <Button variant="outline" onClick={closePreview}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: ContractDefinition
  onPreview: (template: ContractDefinition) => void
}

function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const fieldCount = Object.keys(template.formSchema).length

  return (
    <Card className="h-full hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 flex flex-col">
      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
        {/* Header Section */}
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-text-main mb-3 leading-tight">
            {template.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {template.industry && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">
              {template.industry}
            </span>
          )}
          {template.documentType && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
              {template.documentType}
            </span>
          )}
        </div>

        {/* Footer Section - Spacer to push to bottom */}
        <div className="mt-auto pt-6 border-t border-border">
          {/* Field Count - Better organized */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-muted rounded-lg border border-border">
              <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-text-main">
                {fieldCount} {fieldCount === 1 ? "field" : "fields"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={(e) => {
                e.preventDefault()
                onPreview(template)
              }}
              className="flex-1 hover:bg-gray-50 hover:border-accent hover:shadow-md active:scale-[0.98] active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Preview
            </Button>
            <Link href={`/contracts/${template.id}`} className="flex-1 inline-block active:scale-[0.98] transition-transform duration-150">
              <Button variant="primary" size="md" className="w-full">
                Use Template
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

