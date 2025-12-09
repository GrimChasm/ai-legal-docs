// src/app/contracts/[contractId]/page.tsx

import { contractRegistry } from "@/lib/contracts"
import { notFound } from "next/navigation"
import ContractForm from "@/components/contract-form"

export default async function ContractPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ contractId: string }>
  searchParams: Promise<{ draftId?: string }>
}) {
  const { contractId } = await params
  const { draftId } = await searchParams
  const contract = contractRegistry[contractId]

  if (!contract) {
    return notFound() // built-in Next.js 404 handler
  }

  return (
    <div className="min-h-screen bg-bg-muted">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-main">
            {contract.title}
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            {contract.description}
          </p>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 text-sm text-text-muted bg-bg px-4 py-2 rounded-full border border-border shadow-sm">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Quick & Easy • Takes just a few minutes</span>
            </div>
          </div>
        </div>

        <div className="bg-bg rounded-card shadow-card border border-border p-6 md:p-10 lg:p-12 max-w-3xl mx-auto">
          <ContractForm 
            contractId={contractId} 
            formSchema={contract.formSchema}
            draftId={draftId}
          />
        </div>
      </div>
    </div>
  )
}
