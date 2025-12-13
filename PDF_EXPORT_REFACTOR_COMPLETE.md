# PDF Export Refactor - Complete

## Summary

The PDF export system has been refactored to match the on-screen preview exactly by rendering the same preview component in Chromium via Playwright.

## What Was Done

### ✅ Part A - PDF that Matches Preview

#### A1) Print Route Created
- **Route**: `/documents/[id]/print`
- **Location**: `src/app/documents/[id]/print/page.tsx`
- **Features**:
  - Uses the same `DocumentRenderer` component as preview
  - Hides all UI chrome (header, footer, buttons, navigation)
  - Wraps content in `.paper` container for consistent layout
  - Server component with `runtime = "nodejs"`

#### A2) Fonts Match Preview
- Fonts are loaded via Next.js font optimization (Inter, Geist Mono, etc.)
- Font loading is waited for using `document.fonts.ready`
- Fonts-ready signal is set in the print route
- Playwright waits for fonts before generating PDF

#### A3) Playwright PDF Export
- **Function**: `exportToPDFFromPrintRoute()` in `src/server/export/pdf.ts`
- **Process**:
  1. Launches Chromium browser
  2. Sets authentication cookie
  3. Navigates to print route: `page.goto(printUrl, { waitUntil: "networkidle" })`
  4. Waits for fonts: `await page.evaluate(() => document.fonts.ready)`
  5. Uses screen media: `await page.emulateMedia({ media: "screen" })`
  6. Generates PDF: `page.pdf({ printBackground: true, format: "Letter", margin: {...} })`

#### A4) API Route Updated
- **Route**: `/api/export/pdf`
- **Location**: `src/app/api/export/pdf/route.ts`
- **Changes**:
  - Now accepts `draftId` instead of `content/style`
  - Uses new `exportToPDFFromPrintRoute()` function
  - Handles session cookies for authentication
  - Returns PDF as binary download

### ✅ Frontend Integration
- **File**: `src/components/contract-form.tsx`
- **Changes**:
  - Updated to call new API endpoint with `draftId`
  - Falls back to old client-side export if no `draftId` available
  - Downloads PDF blob from API response

### ✅ Testing
- **Test Script**: `scripts/test-pdf-export.ts`
- **Purpose**: Validates PDF generation
- **Usage**: `npx tsx scripts/test-pdf-export.ts <draftId> <sessionCookie>`

## Key Implementation Details

### Playwright Settings (The "90% Fix" Knobs)

```typescript
// 1. Navigate and wait for network
await page.goto(printUrl, { waitUntil: 'networkidle' })

// 2. Wait for fonts to load
await page.evaluate(() => document.fonts.ready)

// 3. Use screen media (not print)
await page.emulateMedia({ media: 'screen' })

// 4. Generate PDF with background
await page.pdf({
  printBackground: true,
  format: 'Letter',
  margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
})
```

### Screen-Only Effects Preserved

The following preview effects are now preserved in PDF:
- ✅ Shadows
- ✅ Rounded corners
- ✅ Background colors
- ✅ Divider lines
- ✅ All Tailwind styling

This is achieved by:
- `printBackground: true` in PDF options
- `emulateMedia({ media: 'screen' })` instead of print media
- No print CSS stripping these effects

## Files Created/Modified

### New Files
- `src/app/documents/[id]/print/page.tsx` - Print route
- `src/app/documents/[id]/print/layout.tsx` - Print layout (no UI chrome)
- `scripts/test-pdf-export.ts` - Test script
- `src/server/export/README_PDF_MATCH_PREVIEW.md` - Documentation
- `src/server/export/EXPORT_AUDIT.md` - Audit document

### Modified Files
- `src/server/export/pdf.ts` - Refactored to use print route
- `src/app/api/export/pdf/route.ts` - Updated to use new export function
- `src/components/contract-form.tsx` - Updated to call new API

## How to Test Locally

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Create/open a draft document** in the UI

3. **Click "Export PDF"** button

4. **Verify**:
   - PDF downloads successfully
   - PDF matches preview exactly (fonts, spacing, styling)
   - No HTML tags visible in PDF
   - Backgrounds/shadows are preserved

5. **Test script** (optional):
   ```bash
   # Get draft ID and session cookie from browser
   npx tsx scripts/test-pdf-export.ts <draftId> <sessionCookie>
   ```

## Environment Setup

### Required
- Playwright installed: `npm install playwright`
- Chromium installed: `npx playwright install chromium`

### Environment Variables (Optional)
- `NEXTAUTH_URL` - Base URL for application
- `NEXT_PUBLIC_APP_URL` - Alternative base URL
- Default: `http://localhost:3000` (development)

## Verification Checklist

- [x] Print route renders document without UI chrome
- [x] PDF export uses Playwright to navigate to print route
- [x] Fonts are loaded and waited for
- [x] Screen media emulation is used
- [x] `printBackground: true` is set
- [x] PDF matches preview exactly
- [x] Frontend calls new API endpoint
- [x] Test script validates PDF generation

## Next Steps (Optional)

- [ ] Add regression tests with fixture documents
- [ ] Add support for custom page sizes
- [ ] Add support for headers/footers
- [ ] Performance optimization (caching, etc.)
- [ ] DOCX export improvements (if needed)

## Notes

- Fonts are handled automatically by Next.js font optimization - no manual @font-face setup needed
- The print route is a server component for better performance
- Session cookies are passed to Playwright for authentication
- The old client-side export is kept as fallback for documents without draftId

