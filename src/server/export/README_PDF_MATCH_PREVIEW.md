# PDF Export - Match Preview Exactly

## Overview

The PDF export system has been refactored to match the on-screen preview exactly by rendering the same preview component in Chromium via Playwright.

## Architecture

### Print Route
- **Route**: `/documents/[id]/print`
- **Purpose**: Renders the document without UI chrome (no header, footer, buttons)
- **Component**: Uses the same `DocumentRenderer` component as the preview
- **Styling**: Uses screen styles (not print CSS) to match preview exactly

### PDF Export Process

1. **Frontend** calls `/api/export/pdf` with `draftId`
2. **API Route** (`/api/export/pdf/route.ts`):
   - Authenticates user
   - Gets session cookie
   - Calls `exportToPDFFromPrintRoute()`
3. **PDF Export** (`src/server/export/pdf.ts`):
   - Launches Playwright Chromium
   - Navigates to `/documents/[id]/print`
   - Waits for fonts to load (`document.fonts.ready`)
   - Uses screen media emulation (`page.emulateMedia({ media: 'screen' })`)
   - Generates PDF with `printBackground: true`

## Key Features

### Font Fidelity
- Uses the same fonts as preview (Inter, etc.)
- Waits for fonts to load before generating PDF
- Fonts are loaded via Next.js font optimization

### Screen Styling
- Uses `page.emulateMedia({ media: 'screen' })` instead of print media
- Preserves shadows, rounded corners, background colors
- Matches preview styling exactly

### Page Sizing
- Default: Letter format
- Margins: 0.5in all sides (matches preview spacing)
- Paper container: max-width 8.5in with 2rem padding

## Usage

### Frontend (Client-Side)

```typescript
// In contract-form.tsx or similar
const response = await fetch("/api/export/pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    draftId: currentDraftId,
    format: "Letter",
    margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
  }),
})

const blob = await response.blob()
// Download blob as PDF
```

### Backend (Server-Side)

```typescript
import { exportToPDFFromPrintRoute } from "@/server/export/pdf"

const pdfBuffer = await exportToPDFFromPrintRoute(
  draftId,
  sessionCookie,
  {
    format: "Letter",
    margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
  }
)
```

## Testing

### Manual Testing

1. Start the dev server: `npm run dev`
2. Create or open a draft document
3. Click "Export PDF"
4. Verify the PDF matches the preview exactly

### Automated Testing

```bash
# Test PDF export script
npx tsx scripts/test-pdf-export.ts <draftId> <sessionCookie>
```

The script will:
- Generate a PDF
- Validate PDF header
- Check file size
- Save to `test-export.pdf` for inspection

## Troubleshooting

### PDF doesn't match preview

1. **Check fonts**: Ensure fonts are loading in the print route
2. **Check media emulation**: Verify `page.emulateMedia({ media: 'screen' })` is set
3. **Check printBackground**: Must be `true` for backgrounds/shadows
4. **Check wait times**: Ensure fonts are loaded before PDF generation

### Fonts not loading

1. Check that Next.js font optimization is working
2. Verify `document.fonts.ready` resolves
3. Check browser console in Playwright for font loading errors

### Authentication issues

1. Ensure session cookie is passed correctly
2. Check that the print route can access the draft
3. Verify user has permission to view the draft

## Environment Variables

- `NEXTAUTH_URL`: Base URL for the application (used for print route)
- `NEXT_PUBLIC_APP_URL`: Alternative base URL
- Default: `http://localhost:3000` (development)

## Requirements

- Playwright installed: `npm install playwright`
- Chromium installed: `npx playwright install chromium`
- Node.js runtime (not Edge) for API route: `export const runtime = "nodejs"`

## Future Improvements

- [ ] Add support for custom page sizes
- [ ] Add support for headers/footers
- [ ] Add support for watermarks
- [ ] Cache rendered pages for performance
- [ ] Add support for batch exports

