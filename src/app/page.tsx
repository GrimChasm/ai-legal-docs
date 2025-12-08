"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { contractRegistry } from "@/lib/contracts"

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
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">ContractVault</h1>
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
              <Link href="/contracts">
                <Button size="lg" variant="primary">
                  Generate a document
                </Button>
              </Link>
              <Link href="/contracts">
                <Button size="lg" variant="outline">
                  View templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-bg-muted">
        <div className="container mx-auto px-4 md:px-6 max-w-container">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main text-center mb-12">
            How ContractVault Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5 md:p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-text-main mb-2">Answer a few questions</h3>
                <p className="text-sm text-text-main leading-relaxed">
                  Fill out a simple form with the details needed for your document.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5 md:p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-text-main mb-2">We generate a tailored legal document</h3>
                <p className="text-sm text-text-main leading-relaxed">
                  Our AI creates a professional, legally sound document customized to your needs.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5 md:p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-text-main mb-2">Download as PDF or DOCX</h3>
                <p className="text-sm text-text-main leading-relaxed">
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
              <Link key={template.id} href={`/contracts/${template.id}`}>
                <Card className="hover:shadow-card-hover transition-all cursor-pointer h-full flex flex-col">
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-text-main mb-3">{template.title}</h3>
                    <p className="text-sm text-text-main line-clamp-2 leading-relaxed flex-1">{template.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contracts">
              <Button variant="outline">
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
                <Button className="w-full" variant="primary">
                  Get Started
                </Button>
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
                <Button className="w-full" variant="primary">
                  Start Free Trial
                </Button>
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
          <Link href="/contracts">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-bg-muted">
              Generate a document
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
