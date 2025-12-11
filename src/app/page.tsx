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
      {/* Hero Section - Two Column Layout */}
      <section className="relative overflow-hidden bg-bg pt-24 pb-20 md:pt-32 md:pb-32">
        {/* Subtle background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-light rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-light rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10" style={{ maxWidth: '1200px' }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-main mb-6 leading-tight">
                Instant, lawyer-grade legal documents from your answers
              </h1>
              
              <p className="text-xl md:text-2xl text-text-muted mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Create contracts, agreements, and essential legal documents in minutes. Just answer a few questions—we'll generate the rest.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/templates-library">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto">
                    Generate a document
                  </Button>
                </Link>
                <Link href="/templates-library">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View templates
                  </Button>
                </Link>
              </div>

              {/* Trust Element */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-text-muted">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Powered by GPT-4 • No legal expertise required</span>
              </div>
            </div>

            {/* Right Column - Visual/Mockup */}
            <div className="relative">
              <div className="relative bg-bg-card rounded-2xl shadow-2xl border border-border p-8 md:p-10">
                {/* Mockup Preview */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-text-main/10 rounded w-3/4"></div>
                    <div className="h-3 bg-text-main/10 rounded w-1/2"></div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="h-12 bg-accent-light rounded-lg border-2 border-accent/30 flex items-center px-4">
                      <span className="text-sm font-medium text-accent">Document Type: NDA</span>
                    </div>
                    <div className="h-12 bg-bg-muted rounded-lg border border-border flex items-center px-4">
                      <span className="text-sm text-text-muted">Fill out the form...</span>
                    </div>
                    <div className="h-12 bg-bg-muted rounded-lg border border-border flex items-center px-4">
                      <span className="text-sm text-text-muted">AI generates document</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <div className="h-32 bg-gradient-to-br from-accent-light to-secondary-light rounded-lg border-2 border-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs font-medium text-text-main">Your Legal Document</p>
                        <p className="text-xs text-text-muted mt-1">Ready in minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-accent-light rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-bg-muted">
        <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
              Everything you need to create legal documents
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Professional tools designed for entrepreneurs, freelancers, and small businesses
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature 1 */}
            <Card className="group bg-bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-light to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <svg className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3 transition-colors duration-300 group-hover:text-accent">
                  AI-Powered Generation
                </h3>
                <p className="text-text-muted leading-relaxed transition-colors duration-300 group-hover:text-text-main">
                  GPT-4 creates professional, legally structured documents tailored to your needs
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group bg-bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-light to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <svg className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3 transition-colors duration-300 group-hover:text-accent">
                  Customizable Templates
                </h3>
                <p className="text-text-muted leading-relaxed transition-colors duration-300 group-hover:text-text-main">
                  Choose from 50+ professional templates or create your own custom documents
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group bg-bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-light to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <svg className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3 transition-colors duration-300 group-hover:text-accent">
                  Export & Share
                </h3>
                <p className="text-text-muted leading-relaxed transition-colors duration-300 group-hover:text-text-main">
                  Download as PDF or DOCX, share with collaborators, and collect e-signatures
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group bg-bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-light to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                  <svg className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-main mb-3 transition-colors duration-300 group-hover:text-accent">
                  Secure & Private
                </h3>
                <p className="text-text-muted leading-relaxed transition-colors duration-300 group-hover:text-text-main">
                  Your documents are encrypted and stored securely. Your privacy is our priority
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
              How it works
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Create professional legal documents in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-accent">
                <span className="text-3xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-text-main mb-4">
                Answer a few questions
              </h3>
              <p className="text-text-muted leading-relaxed">
                Fill out a simple, interview-style form with the details needed for your document. No legal jargon required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-accent">
                <span className="text-3xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-text-main mb-4">
                AI generates your document
              </h3>
              <p className="text-text-muted leading-relaxed">
                Our AI powered by GPT-4 creates a professional, legally structured document customized to your specific needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-accent">
                <span className="text-3xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-text-main mb-4">
                Download & use
              </h3>
              <p className="text-text-muted leading-relaxed">
                Export your document as PDF or DOCX, share with others, collect signatures, and start using it right away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases / Industries */}
      <section className="py-20 md:py-28 bg-bg-muted">
        <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
              Built for everyone
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Whether you're starting a business or managing properties, we have the documents you need
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Use Case 1 */}
            <Card className="bg-bg-card border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Entrepreneurs & Startups
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  Founders' agreements, NDAs, contractor agreements, and more for your growing business
                </p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>• Founders' Agreements</li>
                  <li>• NDAs</li>
                  <li>• Contractor Agreements</li>
                </ul>
              </CardContent>
            </Card>

            {/* Use Case 2 */}
            <Card className="bg-bg-card border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Freelancers & Creators
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  Client contracts, service agreements, and licensing terms for independent professionals
                </p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>• Service Agreements</li>
                  <li>• Consulting Contracts</li>
                  <li>• Licensing Agreements</li>
                </ul>
              </CardContent>
            </Card>

            {/* Use Case 3 */}
            <Card className="bg-bg-card border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Real Estate & Landlords
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  Lease agreements, rental contracts, and property-related documents
                </p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>• Residential Leases</li>
                  <li>• Sublease Agreements</li>
                  <li>• Lease Termination</li>
                </ul>
              </CardContent>
            </Card>

            {/* Use Case 4 */}
            <Card className="bg-bg-card border border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-semibold text-text-main mb-3">
                  Small Business & Agencies
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  Employment contracts, privacy policies, terms of service, and business agreements
                </p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li>• Employment Contracts</li>
                  <li>• Privacy Policies</li>
                  <li>• Terms of Service</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Templates */}
      <section className="py-20 md:py-28 bg-bg-muted">
        <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
              Popular templates
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Get started with our most-used legal document templates
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {templates.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/templates-library">
              <Button variant="outline" size="lg">
                View all templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="container mx-auto px-4 md:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Choose the plan that works for you. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pay Per Document */}
            <Card className="bg-bg-card border-2 border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 md:p-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-text-main mb-2">Pay per document</h3>
                <div className="text-5xl font-bold text-text-main mb-2">
                  $9.99
                </div>
                <p className="text-text-muted mb-8">One-time payment per document</p>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">PDF & DOCX export</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Unlimited edits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">E-signature support</span>
                  </li>
                </ul>
                <Link href="/templates-library" className="block mt-auto">
                  <Button variant="outline" className="w-full" size="lg">
                    Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Subscription */}
            <Card className="bg-bg-card border-2 border-accent hover:shadow-xl transition-all duration-300 relative">
              <CardContent className="p-8 md:p-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-text-main mb-2">Pro Subscription</h3>
                <div className="text-5xl font-bold text-text-main mb-2">
                  $29.99<span className="text-xl text-text-muted font-normal">/month</span>
                </div>
                <p className="text-text-muted mb-8">Unlimited documents and features</p>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Unlimited document generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Advanced features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-main">Custom templates</span>
                  </li>
                </ul>
                <Link href="/pricing" className="block mt-auto">
                  <Button variant="primary" className="w-full" size="lg">
                    Start free trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-accent-light border-t border-b border-accent/20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center" style={{ maxWidth: '1200px' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Create your first legal document in minutes. No credit card required.
          </p>
          <Link href="/templates-library">
            <Button size="lg" variant="primary">
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
    <Card className="bg-bg-card border border-border hover:shadow-lg hover:border-accent/50 transition-all duration-300 flex flex-col h-full">
      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-text-main mb-3 leading-tight">
          {template.title}
        </h3>
        <p className="text-text-muted leading-relaxed mb-6 flex-grow line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{fieldCount} {fieldCount === 1 ? "field" : "fields"}</span>
          </div>
          <Link href={`/contracts/${template.id}`} className="min-w-[140px] whitespace-nowrap">
            <Button variant="primary" size="sm">
              Use Template
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
