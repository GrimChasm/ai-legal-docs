"use client"

import { useState } from "react"
import { Button } from "./ui/button"

interface ContractFiltersProps {
  onFilterChange: (filters: {
    category?: string
    documentType?: string
    industry?: string
    sortBy?: string
  }) => void
}

export default function ContractFilters({ onFilterChange }: ContractFiltersProps) {
  const [category, setCategory] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [industry, setIndustry] = useState("")
  const [sortBy, setSortBy] = useState("")

  const handleFilterChange = () => {
    onFilterChange({
      category: category || undefined,
      documentType: documentType || undefined,
      industry: industry || undefined,
      sortBy: sortBy || undefined,
    })
  }

  const clearFilters = () => {
    setCategory("")
    setDocumentType("")
    setIndustry("")
    setSortBy("")
    onFilterChange({})
  }

  return (
    <div className="bg-white border border-[#E0E5EC] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-main">Filter & Sort</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-text-muted hover:text-text-main"
        >
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none text-sm"
          >
            <option value="">All Categories</option>
            <option value="Business">Business</option>
            <option value="Legal">Legal</option>
            <option value="Employment">Employment</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Technology">Technology</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => {
              setDocumentType(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none text-sm"
          >
            <option value="">All Types</option>
            <option value="Agreement">Agreement</option>
            <option value="Policy">Policy</option>
            <option value="Contract">Contract</option>
            <option value="Notice">Notice</option>
            <option value="Letter">Letter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Industry</label>
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none text-sm"
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Real Estate">Real Estate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              handleFilterChange()
            }}
            className="w-full px-3 py-2 border border-[#E0E5EC] rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-[#1A73E8] outline-none text-sm"
          >
            <option value="">Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </div>
  )
}

