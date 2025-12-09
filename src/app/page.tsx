"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContractDefinition, contractRegistry } from "@/lib/contracts"
import Logo from "@/components/logo"

const popularTemplates = [
  "nda",
  "contractor-agreement",
  "privacy-policy",
  "terms-and-conditions",
  "sublease-agreement",
  "operating-agreement"
]

export default function Home() {
  const templates = popularTemplates
    .map(id => contractRegistry[id])
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-bg pt-20 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-6 max-w-container">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8 flex justify-center">
              <Logo size="lg" showText={true} href="/" />
            </div>

            {/* Tagline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 leading-tight">
              Instant, lawyer-grade legal documents from your answers.
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Create contracts, agreements, and essential legal documents in minutes. Just answer a few questions—we'll generate the rest.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/templates-library" className="inline-block active:scale-[0.98] transition-transform duration-150">
                <Button size="lg" variant="primary">
                  Generate a document
                </Button>
              </Link>
              <Link href="/templates-library" className="inline-block active:scale-[0.98] transition-transform duration-150">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
                >
                  View templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-bg-muted relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 max-w-container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              How ContractVault Works
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Create professional legal documents in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto relative">
            {/* Step 1 */}
            <Card className="hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 relative bg-white border-2 border-border group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-bg-muted border-2 border-accent/30 rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-text-main border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    1
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text-main mb-3 group-hover:text-accent transition-colors">
                  Answer a few questions
                </h3>
                <p className="text-sm md:text-base text-text-muted leading-relaxed">
                  Fill out a simple form with the details needed for your document.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 relative bg-white border-2 border-border group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-bg-muted border-2 border-accent/30 rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-text-main border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    2
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text-main mb-3 group-hover:text-accent transition-colors">
                  We generate a tailored legal document
                </h3>
                <p className="text-sm md:text-base text-text-muted leading-relaxed">
                  Our AI creates a professional, legally sound document customized to your needs.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="hover:shadow-card-hover hover:border-accent/50 active:scale-[0.98] transition-all duration-200 relative bg-white border-2 border-border group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-bg-muted border-2 border-accent/30 rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-text-main border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    3
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text-main mb-3 group-hover:text-accent transition-colors">
                  Download as PDF or DOCX
                </h3>
                <p className="text-sm md:text-base text-text-muted leading-relaxed">
                  Export your document in the format you need, ready to use or sign.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Templates */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-container">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main text-center mb-12">
            Popular Templates
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/templates-library" className="inline-block active:scale-[0.98] transition-transform duration-150">
              <Button 
                variant="outline"
                className="hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
              >
                View all templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 md:py-20 bg-bg-muted">
        <div className="container mx-auto px-4 md:px-6 max-w-container">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main text-center mb-12">
            Trust & Safety
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-main mb-1">Accurate, plain-language legal documents</h3>
                <p className="text-sm text-text-main leading-relaxed">Professionally crafted with clear, understandable language.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-main mb-1">Private & secure</h3>
                <p className="text-sm text-text-main leading-relaxed">Your documents are kept confidential and secure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-main mb-1">Edit before downloading</h3>
                <p className="text-sm text-text-main leading-relaxed">Review and customize your document before finalizing.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-main mb-1">Fast, automated, always available</h3>
                <p className="text-sm text-text-main leading-relaxed">Generate documents instantly, 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-container">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <Card>
              <CardContent className="p-6 md:p-8 pt-8 md:pt-10">
                <h3 className="text-2xl font-bold text-text-main mb-2">Per Document</h3>
                <div className="text-4xl font-bold text-primary mb-4">$9.99</div>
                <p className="text-base text-text-main mb-6">Pay only for what you need</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">One-time payment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">PDF & DOCX export</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">Unlimited edits</span>
                  </li>
                </ul>
                <Link href="/templates-library" className="block active:scale-[0.98] transition-transform duration-150">
                  <Button className="w-full" variant="primary">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent">
              <CardContent className="p-6 md:p-8 pt-8 md:pt-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-text-main">Subscription</h3>
                  <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded">Popular</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-4">
                  $29.99<span className="text-lg text-text-main font-normal">/month</span>
                </div>
                <p className="text-base text-text-main mb-6">Unlimited documents</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">Unlimited documents</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base text-text-main">Advanced features</span>
                  </li>
                </ul>
                <Link href="/templates-library" className="block active:scale-[0.98] transition-transform duration-150">
                  <Button className="w-full" variant="primary">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg md:text-xl text-white mb-8">Create your first legal document in minutes.</p>
          <Link href="/templates-library" className="inline-block active:scale-[0.98] transition-transform duration-150">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-primary hover:bg-gray-50 hover:border-accent hover:shadow-md active:bg-gray-100 active:shadow-sm transition-all duration-150"
            >
              Generate a document
            </Button>
          </Link>
        </div>
      </section>
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
