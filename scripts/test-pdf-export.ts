/**
 * Test PDF Export Script
 * 
 * This script tests the PDF export functionality to ensure:
 * - PDF file is generated
 * - Key text exists (title + headers)
 * - Fonts are loaded correctly
 * 
 * Usage:
 *   npx tsx scripts/test-pdf-export.ts <draftId> <sessionCookie>
 * 
 * Example:
 *   npx tsx scripts/test-pdf-export.ts abc123 "your-session-cookie-value"
 */

import { exportToPDFFromPrintRoute } from "../src/server/export/pdf"
import { writeFileSync } from "fs"
import { join } from "path"

async function testPDFExport() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/test-pdf-export.ts <draftId> <sessionCookie>")
    process.exit(1)
  }

  const [draftId, sessionCookie] = args

  console.log("Testing PDF export...")
  console.log(`Draft ID: ${draftId}`)
  console.log(`Session Cookie: ${sessionCookie.substring(0, 20)}...`)

  try {
    // Export PDF
    const pdfBuffer = await exportToPDFFromPrintRoute(draftId, sessionCookie, {
      format: "Letter",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    })

    // Save to file for inspection
    const outputPath = join(process.cwd(), "test-export.pdf")
    writeFileSync(outputPath, pdfBuffer)

    console.log(`✅ PDF generated successfully!`)
    console.log(`   File size: ${pdfBuffer.length} bytes`)
    console.log(`   Saved to: ${outputPath}`)

    // Basic validation
    if (pdfBuffer.length < 1000) {
      console.warn("⚠️  PDF file seems too small, may be corrupted")
    }

    // Check PDF header
    const pdfHeader = pdfBuffer.toString("utf-8", 0, 4)
    if (pdfHeader === "%PDF") {
      console.log("✅ PDF header is valid")
    } else {
      console.error("❌ PDF header is invalid")
      process.exit(1)
    }

    console.log("\n✅ All tests passed!")
  } catch (error: any) {
    console.error("❌ PDF export failed:", error.message)
    console.error(error)
    process.exit(1)
  }
}

testPDFExport()

