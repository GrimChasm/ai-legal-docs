# Export System Documentation

## Overview

This directory contains the new legal-document-grade export system that replaces the previous client-side export implementation. The new system uses:

- **PDF Export**: Playwright (Chromium) for high-fidelity HTML/CSS rendering
- **DOCX Export**: Enhanced docx library with semantic document structure
- **HTML Rendering**: Semantic HTML optimized for print/export

## Architecture

```
src/server/export/
├── AUDIT.md              # Audit of old vs new system
├── README.md             # This file
├── renderHtml.ts         # HTML renderer for exports
├── pdf.ts                # Playwright PDF export
├── docx.ts               # DOCX export
├── exportService.ts      # Orchestrator service
└── __tests__/            # Regression tests
    └── export.test.ts
```

## Setup

### 1. Install Dependencies

```bash
npm install playwright --save
npx playwright install chromium
```

### 2. Environment Variables

Optional environment variable to control feature flag:

```bash
USE_NEW_EXPORT=true  # Default: true (use new export system)
```

### 3. Verify Installation

```bash
# Check if Playwright is available
npm test -- src/server/export/__tests__/export.test.ts
```

## Usage

### Server-Side (API Endpoints)

The new export system is available via API endpoints:

**PDF Export:**
```typescript
POST /api/export/pdf
Body: {
  content: string,
  style: DocumentStyle,
  signatures?: SignatureData[],
  title?: string,
  format?: "Letter" | "A4",
  margin?: { top, right, bottom, left },
  useNewExport?: boolean
}
```

**DOCX Export:**
```typescript
POST /api/export/docx
Body: {
  content: string,
  style: DocumentStyle,
  signatures?: SignatureData[],
  title?: string,
  useNewExport?: boolean
}
```

### Programmatic Usage

```typescript
import { getExportService } from "@/server/export/exportService"

const exportService = getExportService()

// Export PDF
const pdfBuffer = await exportService.exportPDF({
  content: htmlContent,
  style: documentStyle,
  signatures: signatureData,
  title: "Document Title"
})

// Export DOCX
const docxBuffer = await exportService.exportDOCX({
  content: htmlContent,
  style: documentStyle,
  signatures: signatureData,
  title: "Document Title"
})
```

## Testing Exports Locally

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test PDF Export

```bash
# Using curl
curl -X POST http://localhost:3000/api/export/pdf \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "content": "<h1>Test Document</h1><p>This is a test.</p>",
    "style": {
      "fontFamily": "modern",
      "fontSize": "medium",
      "lineSpacing": "onePointOneFive",
      "paragraphSpacing": "normal",
      "headingStyle": "bold",
      "headingCase": "normal",
      "headingIndent": "flush",
      "layout": "standard",
      "numberingStyle": "numeric"
    },
    "title": "Test Document"
  }' \
  --output test.pdf
```

### 3. Test DOCX Export

```bash
# Using curl
curl -X POST http://localhost:3000/api/export/docx \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "content": "<h1>Test Document</h1><p>This is a test.</p>",
    "style": { ... },
    "title": "Test Document"
  }' \
  --output test.docx
```

### 4. Run Regression Tests

```bash
npm test -- src/server/export/__tests__/export.test.ts
```

## Features

### PDF Export Features

- ✅ True HTML/CSS rendering (not plain text conversion)
- ✅ Deterministic page breaks
- ✅ Headers/footers with page numbers
- ✅ Professional legal document quality
- ✅ Consistent formatting across all document types
- ✅ Signature section on final page

### DOCX Export Features

- ✅ Semantic document structure
- ✅ Proper Word heading styles
- ✅ Editable numbered lists
- ✅ Page break control
- ✅ Signature section on final page
- ✅ Consistent formatting

### HTML Standardization

- ✅ Semantic HTML structure (h1, h2, h3, p, ol, ul, li)
- ✅ Print-optimized CSS (print.css)
- ✅ Proper page break rules
- ✅ Signature section container

## Migration from Old System

The old export system (client-side jsPDF/docx) is still available but deprecated. To migrate:

1. **Update Frontend**: Change export calls to use new API endpoints
2. **Test Thoroughly**: Run regression tests and manual testing
3. **Feature Flag**: Use `useNewExport` parameter to toggle between old/new
4. **Monitor**: Watch for any export failures or quality issues

## Troubleshooting

### Playwright Not Available

If you see "Playwright not available" errors:

```bash
# Reinstall Chromium
npx playwright install chromium

# Verify installation
npx playwright --version
```

### PDF Export Fails

1. Check that Chromium is installed: `npx playwright install chromium`
2. Check server logs for errors
3. Verify HTML content is valid
4. Check that print.css is accessible

### DOCX Export Fails

1. Verify docx library is installed: `npm list docx`
2. Check that content is valid HTML
3. Verify style object is complete

## Performance Considerations

- **PDF Export**: Playwright can be slower than jsPDF (~2-5 seconds per document)
- **DOCX Export**: Similar performance to old system
- **Caching**: Consider caching rendered HTML for frequently exported documents
- **Concurrency**: Playwright browser instance is shared (singleton pattern)

## Future Improvements

- [ ] Implement docxtemplater with proper Word templates
- [ ] Add support for custom headers/footers
- [ ] Add support for watermarks
- [ ] Implement export caching
- [ ] Add support for batch exports
- [ ] Add support for custom fonts

