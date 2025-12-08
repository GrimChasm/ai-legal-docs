"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { contractRegistry } from "@/lib/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-4">
            ContractVault Templates
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-text-main mb-8 max-w-2xl">
            Instant, lawyer-grade legal documents from your answers.
          </p>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
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
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-main transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-6 text-sm text-text-main">
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

        {/* Documents Grid Section */}
        <div className="pb-12">
          {filteredContracts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContracts.map((contract) => {
                  const fieldCount = Object.keys(contract.formSchema).length
                  
                  return (
                    <Link
                      key={contract.id}
                      href={`/contracts/${contract.id}`}
                      className="group block"
                    >
                      <Card className="h-full hover:shadow-card-hover transition-all cursor-pointer">
                        <CardContent className="p-6 pt-8">
                          {/* Title and Arrow */}
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-semibold text-text-main group-hover:text-accent transition-colors duration-200 flex-1">
                              {contract.title}
                            </h3>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 flex-shrink-0">
                              <svg
                                className="w-6 h-6 text-accent transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
                            {contract.description}
                          </p>

                          {/* Footer Info */}
                          <div className="flex items-center gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-1.5 text-xs text-text-muted">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>{fieldCount} fields</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-text-muted">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>Quick</span>
                            </div>
                            <div className="ml-auto">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                                Start →
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
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
