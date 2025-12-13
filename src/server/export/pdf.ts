/**
 * PDF Export via Playwright
 * 
 * This module exports documents to PDF by rendering the print route in Chromium.
 * This ensures the PDF matches the on-screen preview exactly:
 * - Same fonts (Inter, etc.)
 * - Same screen styles (not print CSS)
 * - Same component rendering (DocumentRenderer)
 * - Exact visual match with preview
 * 
 * Requirements:
 * - Playwright must be installed: npm install playwright
 * - Chromium browser must be available (installed via: npx playwright install chromium)
 */

import { chromium, Browser, Page } from "playwright"
import type { DocumentData } from "./renderHtml"

let browser: Browser | null = null

/**
 * Initialize Playwright browser (singleton)
 */
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some environments
    })
  }
  return browser
}

/**
 * Get base URL for print route
 */
function getBaseUrl(): string {
  // Try environment variables first
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Fallback to localhost for development
  return "http://localhost:3000"
}

/**
 * Export document to PDF by rendering the print route
 * 
 * This function navigates to the /documents/[id]/print route and generates a PDF
 * that matches the on-screen preview exactly.
 * 
 * @param draftId - Draft ID to export
 * @param sessionCookie - Session cookie for authentication
 * @param options - PDF export options
 * @returns PDF buffer
 */
export async function exportToPDFFromPrintRoute(
  draftId: string,
  sessionCookie: string,
  options: {
    format?: "Letter" | "A4"
    margin?: { top: string; right: string; bottom: string; left: string }
    displayHeaderFooter?: boolean
    headerTemplate?: string
    footerTemplate?: string
    userId?: string // User ID to pass to print route (bypasses cookie requirement)
  } = {}
): Promise<Buffer> {
  const {
    format = "Letter",
    margin = { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    displayHeaderFooter = false, // No headers/footers by default to match preview
    headerTemplate = "",
    footerTemplate = "",
    userId,
  } = options

  const baseUrl = getBaseUrl()
  // Route group (print) doesn't affect URL, so the route is still /documents/[id]/print
  // Use userId from options if provided (bypasses cookie requirement)
  let printUrl = `${baseUrl}/documents/${draftId}/print`
  
  if (options.userId) {
    printUrl = `${printUrl}?userId=${options.userId}`
    console.log("PDF Export - Using userId query param:", options.userId)
  } else {
    // Fallback: try to get user ID from draft
    try {
      const { prisma } = await import("@/lib/prisma")
      const draft = await prisma.draft.findUnique({
        where: { id: draftId },
        select: { userId: true },
      })
      if (draft?.userId) {
        printUrl = `${printUrl}?userId=${draft.userId}`
        console.log("PDF Export - Got userId from draft:", draft.userId)
      }
    } catch (error) {
      console.warn("Could not get user ID from draft, proceeding without query param:", error)
    }
  }
  
  console.log("PDF Export - Navigating to print URL:", printUrl)

  // Get browser instance
  const browserInstance = await getBrowser()
  const page = await browserInstance.newPage()

  // Set up error handlers BEFORE navigation
  const jsErrors: string[] = []
  page.on("pageerror", (error) => {
    jsErrors.push(error.message)
    console.error("JavaScript error on page:", error.message)
  })
  
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      jsErrors.push(msg.text())
      console.error("Console error:", msg.text())
    }
  })

  try {
    // Set up authentication cookie (only if we have a cookie)
    // Note: Since we're using userId query param, cookies are optional
    if (sessionCookie && sessionCookie.trim().length > 0) {
      try {
        const context = browserInstance.contexts()[0]
        const url = new URL(baseUrl)
        const domain = url.hostname
        const isSecure = url.protocol === "https:" || process.env.NODE_ENV === "production"
        
        // Only add the cookie if it's a valid format
        // Playwright requires specific cookie format
        const cookie = {
          name: "next-auth.session-token", // Use standard name
          value: sessionCookie,
          domain: domain.startsWith(".") ? domain : `.${domain}`, // Playwright may need leading dot
          path: "/",
          httpOnly: false, // Playwright can't set httpOnly cookies
          secure: isSecure,
          sameSite: "Lax" as const,
        }
        
        await context.addCookies([cookie])
        console.log("Added session cookie to Playwright context")
      } catch (cookieError: any) {
        console.warn("Failed to add session cookie to Playwright (this is OK if using userId query param):", cookieError.message)
        // This is OK - we're using userId query param as fallback
      }
    } else {
      console.log("No session cookie provided - using userId query param for authentication")
    }

    // Navigate to print route and wait for network to be idle
    console.log("Navigating to:", printUrl)
    
    const response = await page.goto(printUrl, {
      waitUntil: "networkidle",
      timeout: 30000, // 30 second timeout
    })
    
    // Check if page loaded successfully
    if (!response || !response.ok()) {
      const status = response?.status() || "unknown"
      const statusText = response?.statusText() || "unknown"
      console.error(`Page load failed: ${status} ${statusText}`)
      const pageContent = await page.content()
      const screenshot = await page.screenshot({ fullPage: true })
      const fs = await import("fs")
      fs.writeFileSync("debug-page-load-failed.png", screenshot)
      fs.writeFileSync("debug-page-load-failed.html", pageContent)
      console.error("Page content:", pageContent.substring(0, 1000))
      throw new Error(`Failed to load print route: ${status} ${statusText}`)
    }
    
    console.log("Page loaded successfully:", response.status())
    
    // Get the actual page content to debug
    const pageContentAfterLoad = await page.content()
    console.log("Page content length:", pageContentAfterLoad.length)
    console.log("Page content preview:", pageContentAfterLoad.substring(0, 500))
    
    // Check if we're on the right page (not redirected)
    const currentUrl = page.url()
    console.log("Current URL after load:", currentUrl)
    if (!currentUrl.includes("/documents/") || !currentUrl.includes("/print")) {
      console.error("WARNING: Page may have been redirected. Expected print route, got:", currentUrl)
    }

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded")
    
    // Wait for the .paper container to appear (this is the main wrapper)
    // First, let's see what's actually on the page
    const initialContent = await page.evaluate(() => {
      return {
        bodyHTML: document.body.innerHTML.substring(0, 1000),
        bodyText: document.body.textContent?.substring(0, 200) || "",
        hasPaper: !!document.querySelector('.paper'),
        hasDocumentRenderer: !!document.querySelector('.document-renderer'),
        allClasses: Array.from(document.body.querySelectorAll('*')).map(el => el.className).filter(Boolean).slice(0, 10),
      }
    })
    console.log("Initial page content check:", JSON.stringify(initialContent, null, 2))
    
    try {
      await page.waitForSelector('.paper', { timeout: 10000 })
      console.log("Paper container found")
    } catch (e) {
      console.error("Paper container not found after 10 seconds")
      // Get more debug info
      const debugInfo = await page.evaluate(() => {
        return {
          bodyHTML: document.body.innerHTML,
          bodyText: document.body.textContent,
          title: document.title,
          url: window.location.href,
          allSelectors: {
            paper: !!document.querySelector('.paper'),
            documentRenderer: !!document.querySelector('.document-renderer'),
            documentPreviewWeb: !!document.querySelector('.document-preview-web'),
            anyDiv: document.querySelectorAll('div').length,
            anyContent: document.body.children.length,
          }
        }
      })
      console.error("Debug info:", JSON.stringify(debugInfo, null, 2))
      
      const screenshot = await page.screenshot({ fullPage: true })
      const pageContent = await page.content()
      const fs = await import("fs")
      fs.writeFileSync("debug-paper-not-found.png", screenshot)
      fs.writeFileSync("debug-paper-not-found.html", pageContent)
      throw new Error(`Paper container not found - page may not be loading correctly. Body has ${debugInfo.allSelectors.anyDiv} divs, ${debugInfo.allSelectors.anyContent} children.`)
    }
    
    // Wait for React to hydrate client components (DocumentRenderer is a client component)
    // Wait for the document-renderer to appear and have content
    try {
      await page.waitForSelector('.document-renderer', { timeout: 15000 })
      console.log("Document renderer found")
    } catch (e) {
      console.error("Document renderer not found after 15 seconds")
      const screenshot = await page.screenshot({ fullPage: true })
      const fs = await import("fs")
      fs.writeFileSync("debug-renderer-not-found.png", screenshot)
      throw new Error("Document renderer not found - React may not be hydrating")
    }
    
    // Wait for actual content to be visible (not just the element to exist)
    await page.waitForFunction(
      () => {
        const renderer = document.querySelector('.document-renderer')
        if (!renderer) return false
        const text = renderer.textContent || ""
        // Check if there's actual content (more than just whitespace)
        return text.trim().length > 50 // At least 50 characters of content
      },
      { timeout: 15000 }
    )
    console.log("Document content is visible")
    
    // Additional wait for React hydration to complete
    await page.waitForTimeout(1000)
    
    // Check if content is visible and if UI chrome is present
    const contentCheck = await page.evaluate(() => {
      const renderer = document.querySelector('.document-renderer')
      const previewWeb = document.querySelector('.document-preview-web')
      const paper = document.querySelector('.paper')
      const header = document.querySelector('header, .header, [role="banner"]')
      const footer = document.querySelector('footer, .footer, [role="contentinfo"]')
      
      return {
        hasRenderer: renderer !== null,
        hasPreviewWeb: previewWeb !== null,
        hasPaper: paper !== null,
        hasHeader: header !== null,
        hasFooter: footer !== null,
        rendererText: renderer?.textContent?.trim().substring(0, 100) || "none",
        rendererTextLength: renderer?.textContent?.trim().length || 0,
        bodyText: document.body.textContent?.trim().substring(0, 200) || "none",
        url: window.location.href,
        rendererVisible: renderer ? window.getComputedStyle(renderer).display !== "none" : false,
      }
    })
    
    console.log("Content check:", JSON.stringify(contentCheck, null, 2))
    
    // Check if UI chrome is present (should not be)
    if (contentCheck.hasHeader || contentCheck.hasFooter) {
      console.warn("WARNING: Header or footer detected in print route - route group may not be working")
    }
    
    if (!contentCheck.hasRenderer || !contentCheck.hasPaper) {
      // Get page content for debugging
      const pageContent = await page.content()
      const screenshot = await page.screenshot({ fullPage: true })
      const fs = await import("fs")
      fs.writeFileSync("debug-no-content.html", pageContent)
      fs.writeFileSync("debug-no-content.png", screenshot)
      console.error("Document content not found in print route")
      console.error("Page content length:", pageContent.length)
      console.error("Page content preview:", pageContent.substring(0, 2000))
      throw new Error(`Document content not found. Renderer: ${contentCheck.hasRenderer}, Paper: ${contentCheck.hasPaper}`)
    }
    
    if (contentCheck.rendererTextLength < 50) {
      console.warn("WARNING: Document renderer has very little content:", contentCheck.rendererTextLength, "characters")
      const screenshot = await page.screenshot({ fullPage: true })
      const fs = await import("fs")
      fs.writeFileSync("debug-low-content.png", screenshot)
    }
    
    // Check for JavaScript errors
    if (jsErrors.length > 0) {
      console.warn("JavaScript errors detected on page:", jsErrors)
      // Don't fail if there are JS errors, but log them
    }

    // Wait for fonts to load - critical for font fidelity
    await page.evaluate(() => document.fonts.ready)

    // Wait for the fonts-ready signal from the page
    await page.waitForSelector('[data-fonts-ready="true"]', {
      timeout: 5000,
    }).catch(() => {
      // If signal not found, continue anyway (fonts may already be loaded)
      console.warn("Fonts-ready signal not found, continuing anyway")
    })

    // Use screen media emulation (not print) to match preview exactly
    await page.emulateMedia({ media: "screen" })

    // Wait a bit more to ensure all content is fully rendered
    await page.waitForTimeout(1000) // Increased timeout for rendering

    // Hide any Next.js icons or watermarks before PDF generation
    // Be very specific to avoid hiding document content
    const watermarkInfo = await page.evaluate(() => {
      const watermarks: Array<{ tag: string; src?: string; text?: string; className?: string; id?: string }> = []
      
      // Only target specific elements that are likely watermarks, not document content
      // 1. Images/SVGs with Next.js/Vercel in src or alt
      const images = document.querySelectorAll('img, svg')
      images.forEach((img) => {
        const src = (img as HTMLImageElement).src || ''
        const alt = (img as HTMLImageElement).alt || ''
        const id = (img as HTMLElement).id || ''
        const className = typeof img.className === 'string' 
          ? img.className 
          : (img.className?.baseVal || img.className?.toString() || '')
        const classNameStr = String(className).toLowerCase()
        const idStr = String(id).toLowerCase()
        
        // Only hide if it's clearly a Next.js/Vercel branding element
        if (
          (src.includes('next') || src.includes('vercel')) ||
          (alt.toLowerCase().includes('next') || alt.toLowerCase().includes('vercel')) ||
          (classNameStr.includes('next') && (classNameStr.includes('logo') || classNameStr.includes('brand') || classNameStr.includes('watermark'))) ||
          (idStr.includes('next') && (idStr.includes('logo') || idStr.includes('brand') || idStr.includes('watermark')))
        ) {
          watermarks.push({
            tag: img.tagName,
            src: src || undefined,
            alt: alt || undefined,
            className: classNameStr || undefined,
            id: id || undefined,
          })
          
          ;(img as HTMLElement).style.display = 'none'
          ;(img as HTMLElement).style.visibility = 'hidden'
        }
      })
      
      // 2. Small text elements in bottom corners that mention Next.js
      const allElements = document.querySelectorAll('*')
      allElements.forEach((el) => {
        // Skip document content areas
        if (el.closest('.paper') || el.closest('.document-renderer') || el.closest('.document-preview-web')) {
          return
        }
        
        const computedStyle = window.getComputedStyle(el)
        const position = computedStyle.position
        const bottom = computedStyle.bottom
        const fontSize = parseFloat(computedStyle.fontSize)
        const text = el.textContent || ''
        const textLower = text.toLowerCase()
        
        // Only hide small text elements in bottom corners that explicitly mention Next.js
        const isBottomCorner = (position === 'fixed' || position === 'absolute') && 
                               (bottom !== 'auto' && parseFloat(bottom) < 50)
        const isSmallText = fontSize < 14
        const mentionsNext = textLower.includes('next.js') || textLower.includes('powered by next')
        
        if (isBottomCorner && isSmallText && mentionsNext && text.length < 100) {
          watermarks.push({
            tag: el.tagName,
            text: text.substring(0, 50),
            className: typeof el.className === 'string' ? el.className : '',
          })
          
          ;(el as HTMLElement).style.display = 'none'
          ;(el as HTMLElement).style.visibility = 'hidden'
        }
      })
      
      return watermarks
    })
    
    if (watermarkInfo.length > 0) {
      console.log("Found and hiding potential watermarks:", watermarkInfo)
    }

    // Generate PDF with screen styles
    // Note: Playwright doesn't add watermarks by default, but we ensure none are shown
    const pdfBuffer = await page.pdf({
      format,
      margin,
      printBackground: true, // Essential for backgrounds, shadows, etc.
      displayHeaderFooter: false, // Disable header/footer to avoid any watermarks
      headerTemplate: '<div></div>', // Empty header
      footerTemplate: '<div></div>', // Empty footer
      preferCSSPageSize: false, // Use format/margin instead of CSS @page
      tagged: false, // Disable PDF tags (might help with watermarks)
    })

    return pdfBuffer
  } finally {
    await page.close()
  }
}

/**
 * Legacy export function - kept for backward compatibility
 * @deprecated Use exportToPDFFromPrintRoute instead
 */
export async function exportToPDF(
  data: DocumentData,
  options: {
    format?: "Letter" | "A4"
    margin?: { top: string; right: string; bottom: string; left: string }
    displayHeaderFooter?: boolean
    headerTemplate?: string
    footerTemplate?: string
  } = {}
): Promise<Buffer> {
  // This is a fallback - should not be used in new code
  throw new Error(
    "Legacy exportToPDF is deprecated. Use exportToPDFFromPrintRoute instead."
  )
}

/**
 * Cleanup browser instance (call on server shutdown)
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

/**
 * Check if Playwright is available
 */
export async function isPlaywrightAvailable(): Promise<boolean> {
  try {
    const browserInstance = await getBrowser()
    return browserInstance !== null
  } catch (error) {
    console.error("Playwright not available:", error)
    return false
  }
}

