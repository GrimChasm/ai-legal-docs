"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ContractDefinition, contractRegistry } from "@/lib/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const contracts = Object.values(contractRegistry)

  const filteredContracts = useMemo(() => {
    if (!searchQuery.trim()) return contracts
    
    const query = searchQuery.toLowerCase()
    return contracts.filter(
      (contract) =>
        contract.title.toLowerCase().includes(query) ||
        contract.description.toLowerCase().includes(query)
    )
  }, [searchQuery, contracts])

  return (
    <div className="min-h-screen bg-bg">
      {/* Main Content Container - Unified alignment */}
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        {/* Hero Section - Title, Subtitle, Search, Metadata */}
        <div className="pt-8 md:pt-12 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-4">
              ContractVault Templates
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-text-main mb-8 mx-auto">
              Instant, lawyer-grade legal documents from your answers.
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
                  placeholder="Search documents... (e.g., NDA, Privacy Policy)"
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

            {/* Metadata Row */}
            <div className="flex items-center justify-center gap-6 text-sm text-text-main">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{contracts.length}</span>
                <span>Document Types</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">100%</span>
                <span>Free</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Instant</span>
                <span>Generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid Section */}
        <div className="pb-12">
          {filteredContracts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-text-main mb-2">No documents found</h3>
              <p className="text-base text-text-main">Try a different search term</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-text-main">
                  {searchQuery ? `Found ${filteredContracts.length} document${filteredContracts.length !== 1 ? 's' : ''}` : 'All Documents'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredContracts.map((contract) => (
                  <TemplateCard key={contract.id} template={contract} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary text-white py-12 mt-16">
        <div className="container mx-auto px-4 md:px-6 max-w-container text-center">
          <h3 className="text-2xl font-bold mb-2">Need help choosing?</h3>
          <p className="text-base text-white mb-6">All documents are professionally crafted and legally compliant</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No Sign-up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: ContractDefinition
}

function TemplateCard({ template }: TemplateCardProps) {
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
