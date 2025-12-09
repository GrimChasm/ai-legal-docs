"use client"

import Link from "next/link"
import Logo from "./logo"

export default function Footer() {
  return (
    <footer className="bg-bg-muted border-t border-border py-16 mt-20">
      <div className="container mx-auto px-4 md:px-6 max-w-container">
        {/* Top Row: Navigation Sections */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-text-main">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/templates-library" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Templates Library
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Bundles
                </Link>
              </li>
              <li>
                <Link href="/templates/create" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Create Template
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-text-main">Use Cases</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/templates-library?industry=Business / Startup" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Business & Startup
                </Link>
              </li>
              <li>
                <Link href="/templates-library?industry=Real Estate" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link href="/templates-library?industry=HR / Employment" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  HR & Employment
                </Link>
              </li>
              <li>
                <Link href="/templates-library?industry=Freelancers / Creators" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Freelancers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-text-main">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-text-main">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-text-main">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-text-muted hover:text-text-main transition-colors duration-150 inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand Section - Centered below Product and Use Cases */}
        <div className="flex justify-center mb-12">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={true} href="/" />
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Instant, lawyer-grade legal documents from your answers.
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} ContractVault. All rights reserved.
            </p>
            <p className="text-xs text-text-muted leading-relaxed max-w-2xl text-center md:text-right">
              This tool helps generate documents but is not a law firm and does not provide legal advice. Consult a licensed attorney for legal guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
