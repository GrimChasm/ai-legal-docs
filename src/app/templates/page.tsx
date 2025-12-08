"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Template {
  id: string
  title: string
  description: string | null
  category: string | null
  documentType: string | null
  industry: string | null
  isPublic: boolean
  createdAt: string
  userId: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "mine" | "public">("all")

  useEffect(() => {
    loadTemplates()
  }, [filter])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === "mine") {
        params.append("mine", "true")
      } else if (filter === "public") {
        params.append("public", "true")
      }

      const response = await fetch(`/api/templates?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Template Library</h1>
            <p className="text-base text-text-muted">Create and manage custom document templates</p>
          </div>
          <Link href="/templates/create">
            <Button variant="primary">
              Create Template
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Templates
          </Button>
          <Button
            variant={filter === "mine" ? "primary" : "outline"}
            onClick={() => setFilter("mine")}
            size="sm"
          >
            My Templates
          </Button>
          <Button
            variant={filter === "public" ? "primary" : "outline"}
            onClick={() => setFilter("public")}
            size="sm"
          >
            Public Templates
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading templates...</div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-semibold text-text-main mb-2">No templates found</h3>
              <p className="text-base text-text-muted mb-6">
                {filter === "mine"
                  ? "You haven't created any templates yet."
                  : "No templates match your filter."}
              </p>
              <Link href="/templates/create">
                <Button variant="primary">
                  Create Your First Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Link key={template.id} href={`/templates/${template.id}`}>
                <Card className="h-full hover:shadow-card-hover transition-all cursor-pointer flex flex-col">
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-main">{template.title}</h3>
                      {template.isPublic && (
                        <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed flex-1">
                      {template.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                      {template.category && (
                        <span className="bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded text-xs">{template.category}</span>
                      )}
                      {template.industry && (
                        <span className="bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded text-xs">{template.industry}</span>
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-auto">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
