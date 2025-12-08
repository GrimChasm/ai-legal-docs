"use client"

import { contractRegistry } from "@/lib/contracts"
import HomeButton from "./home-button"

interface ContractHeaderProps {
  contractId: string
}

export default function ContractHeader({ contractId }: ContractHeaderProps) {
  const contract = contractRegistry[contractId]

  if (!contract) return null

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <HomeButton />
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {contract.title}
              </h1>
              <p className="text-sm text-gray-500 truncate max-w-md">
                {contract.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

