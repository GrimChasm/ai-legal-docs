/**
 * Print Route Group Layout
 * 
 * This layout is used for the (print) route group and completely bypasses
 * the root layout to avoid including Header, Footer, and other UI chrome.
 * 
 * Route group: (print) - parentheses make it a route group that doesn't affect URL
 */

import { Inter, Geist_Mono, Caveat, Satisfy, Kalam } from "next/font/google"
import "@/app/globals.css"
import "@/styles/document.css"

// Load fonts (same as root layout for consistency)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
})

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function PrintGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout completely bypasses the root layout
  // No Header, Footer, or any UI chrome - just the document content
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document Print</title>
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} ${caveat.variable} ${satisfy.variable} ${kalam.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          background: "white",
          width: "100%",
          height: "100%",
        }}
        suppressHydrationWarning
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset and base styles */
            * {
              box-sizing: border-box;
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: white;
              overflow: visible;
            }
            
            /* Paper container - matches preview width */
            .paper {
              width: 100%;
              max-width: 8.5in;
              margin: 0 auto;
              background: white;
              padding: 2rem;
              box-sizing: border-box;
              min-height: 100vh;
            }
            
            /* Ensure document preview and renderer are visible */
            .document-preview-web {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 100%;
            }
            
            .document-renderer {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 100%;
            }
            
            .print-document-renderer {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 100%;
            }
            
            /* Hide any UI elements that might leak through - be very aggressive */
            nav, header, footer, .header, .footer,
            button, .button, .btn,
            input, select, textarea,
            .sidebar, aside,
            [role="navigation"],
            [role="banner"],
            [role="contentinfo"],
            main > header,
            main > nav,
            main > footer {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              width: 0 !important;
              overflow: hidden !important;
            }
            
            /* Hide Next.js icons, watermarks, and any branding */
            img[src*="next"], 
            img[src*="vercel"],
            img[alt*="Next.js"],
            img[alt*="Vercel"],
            [class*="next"],
            [class*="vercel"],
            [id*="next"],
            [id*="vercel"],
            svg[class*="next"],
            svg[class*="vercel"],
            /* Hide any icons in bottom corners */
            body > img:last-child,
            body > svg:last-child,
            /* Hide Playwright/Chromium watermarks */
            [class*="watermark"],
            [id*="watermark"],
            /* Hide any footer with Next.js branding */
            footer:has-text("Next.js"),
            footer:has-text("Powered by"),
            /* Hide any absolute/fixed positioned branding elements */
            [style*="position: fixed"][style*="bottom"],
            [style*="position: absolute"][style*="bottom"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              height: 0 !important;
              width: 0 !important;
            }
            
            /* Hide any elements containing Next.js text in bottom area */
            body > *:last-child:has-text("Next.js"),
            body > *:last-child:has-text("Powered by") {
              display: none !important;
            }
            
            /* Ensure .paper is visible */
            .paper {
              display: block !important;
            }
            
            /* Print-specific styles to hide watermarks */
            @media print {
              /* Hide everything except .paper content */
              body > *:not(.paper) {
                display: none !important;
              }
              
              /* Hide any watermarks in print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Hide any fixed/absolute positioned elements that might be watermarks */
              [style*="position: fixed"],
              [style*="position: absolute"] {
                display: none !important;
              }
            }
          `
        }} />
        {children}
      </body>
    </html>
  )
}

