# Export System Audit - PDF Match Preview Refactor

## Current Export Implementation

### PDF Export
- **Location**: `src/server/export/pdf.ts`
- **Method**: Playwright Chromium with HTML string rendering
- **Issue**: HTML is generated server-side and doesn't match the preview exactly
- **Fonts**: Uses system fonts, not the preview fonts (Inter, etc.)
- **Styling**: Uses print.css, not the screen styles from preview

### DOCX Export
- **Location**: `src/server/export/docx.ts`
- **Method**: docx library with HTML-to-text conversion
- **Status**: Works but doesn't match preview styling

### Preview Component
- **Component**: `src/components/document-renderer.tsx` (DocumentRenderer)
- **Used in**: `src/components/contract-form.tsx` via `ExportPreview`
- **Styling**: Tailwind CSS, Inter font, screen styles
- **Location**: Documents shown in `/templates/[id]` and draft pages

### API Routes
- **PDF**: `src/app/api/export/pdf/route.ts`
- **DOCX**: `src/app/api/export/docx/route.ts`
- **Runtime**: Node.js (required for Playwright)

### Fonts Used in Preview
- **Primary**: Inter (from `next/font/google`)
- **Mono**: Geist Mono
- **Signature**: Caveat, Satisfy, Kalam
- **Loaded via**: Next.js font optimization

## Target Architecture

1. **Print Route**: `/documents/[id]/print` - renders DocumentRenderer without UI chrome
2. **PDF Export**: Playwright navigates to print route, waits for fonts, uses screen media
3. **Font Loading**: Local fonts in `/public/fonts` with @font-face
4. **Styling**: Same Tailwind/screen styles as preview

