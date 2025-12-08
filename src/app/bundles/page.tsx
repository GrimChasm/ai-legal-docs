"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { documentBundles } from "@/lib/bundles"
import { contractRegistry } from "@/lib/contracts"

export default function BundlesPage() {
  return (
    <div className="min-h-screen bg-[#F3F5F7] py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#101623] mb-2">Document Bundles</h1>
          <p className="text-xl text-[#6C7783] max-w-2xl mx-auto">
            Save time and money with curated bundles of related legal documents
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentBundles.map((bundle) => {
            const documents = bundle.documentIds
              .map((id) => contractRegistry[id])
              .filter(Boolean)

            return (
              <Card
                key={bundle.id}
                className={`border-2 ${
                  bundle.popular
                    ? "border-[#1A73E8] shadow-card-hover"
                    : "border-[#E0E5EC]"
                } hover:shadow-card-hover transition-all`}
              >
                <CardContent className="p-6 pt-8">
                  {bundle.popular && (
                    <div className="mb-3">
                      <span className="bg-[#1A73E8] text-white text-xs font-semibold px-2 py-1 rounded">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#101623] mb-2">{bundle.name}</h3>
                  <p className="text-[#6C7783] mb-4">{bundle.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#101623] mb-2">
                      Includes {documents.length} documents:
                    </p>
                    <ul className="space-y-1 text-sm text-[#6C7783]">
                      {documents.slice(0, 5).map((doc) => (
                        <li key={doc.id} className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-[#1A73E8]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {doc.title}
                        </li>
                      ))}
                      {documents.length > 5 && (
                        <li className="text-xs text-[#6C7783] pl-6">
                          +{documents.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#E0E5EC]">
                    {bundle.price ? (
                      <span className="text-2xl font-bold text-[#101623]">${bundle.price}</span>
                    ) : (
                      <span className="text-lg font-semibold text-[#1A73E8]">Free</span>
                    )}
                    <Button
                      className="bg-[#0A1B2A] hover:bg-[#0f2538] text-white"
                      asChild
                    >
                      <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

