# Document Rendering Architecture

## Overview

This document explains the architecture of the document rendering system, which ensures that the on-screen preview matches the exported PDF and DOCX files.

## Single Source of Truth

### Canonical Renderer: `DocumentRenderer`

**Location:** `src/components/document-renderer.tsx`

This is the **single source of truth** for document rendering. It:
- Takes document content (markdown) and styling props
- Renders semantic HTML with consistent styling
- Is used by both preview AND export functions
- Applies the same typography, spacing, margins, and layout rules

**Key Features:**
- Consistent heading styles (H1, H2, H3)
- Proper paragraph spacing
- List formatting
- Signature blocks
- Export mode (black text) vs Web mode (theme colors)

### Document Viewer: `DocumentViewer`

**Location:** `src/components/document-viewer.tsx`

Provides a page-based preview with:
- A4 page dimensions (210mm × 297mm)
- Zoom controls (50%, 75%, 100%, 125%, 150%, 200%)
- Fit modes (Fit to Width, Fit to Page)
- Page break estimation
- Responsive design

Uses `DocumentRenderer` internally for consistent rendering.

### Export Preview: `ExportPreview`

**Location:** `src/components/export-preview.tsx`

Provides three preview modes:
- **Web Preview**: Direct `DocumentRenderer` output
- **PDF Preview**: `DocumentViewer` with pagination
- **DOCX Preview**: `DocumentViewer` with pagination (same as PDF)

## Styling System

### Document Styles

**Location:** `src/lib/document-styles.ts`

Defines the `DocumentStyle` interface and helper functions:
- `getFontFamilyName()` - Returns font family string
- `getFontSizePt()` - Returns font size in points
- `getLineSpacingValue()` - Returns line spacing multiplier

**All rendering (preview and exports) uses these same functions.**

### Shared Stylesheet

**Location:** `src/styles/document.css`

Contains CSS classes for:
- Document headings
- Paragraphs
- Lists
- Code blocks
- Signatures
- Print/export styles

## Export Functions

### PDF Export

**Location:** `src/lib/export-utils.ts` - `exportToPDF()`

**How it aligns with preview:**
- Uses the same `DocumentStyle` calculations
- Same font sizes (`getFontSizePt()`)
- Same line spacing (`getLineSpacingValue()`)
- Same margins (based on layout setting)
- Same heading styles (bold, uppercase, indentation)
- Same paragraph spacing

**Implementation:**
- Uses jsPDF library
- Parses markdown structure
- Applies styles matching `DocumentRenderer`
- Handles page breaks automatically

### DOCX Export

**Location:** `src/lib/export-utils.ts` - `exportToDOCX()`

**How it aligns with preview:**
- Uses the same `DocumentStyle` calculations
- Maps to DOCX HeadingLevel (H1, H2, H3)
- Same font sizes and families
- Same paragraph spacing
- Same margins

**Implementation:**
- Uses docx library
- Creates Paragraph objects with matching styles
- Maps markdown structure to DOCX elements

## Document HTML Generator

**Location:** `src/lib/document-html.ts`

Utility function `generateDocumentHTML()` that:
- Generates HTML from document content
- Uses the same styling as `DocumentRenderer`
- Can be used for PDF export via html2pdf (future enhancement)

## Usage Flow

1. **User generates document**
   - Content is stored as markdown
   - DocumentStyle is applied

2. **Preview rendering**
   - `ExportPreview` component renders
   - Web mode: `DocumentRenderer` directly
   - PDF/DOCX mode: `DocumentViewer` → `DocumentRenderer`

3. **Export rendering**
   - User clicks "Export as PDF" or "Export as DOCX"
   - `exportToPDF()` or `exportToDOCX()` is called
   - Uses the same `DocumentStyle` and calculations
   - Output matches the preview

## Consistency Guarantees

1. **Same Style Calculations**
   - All components use `getFontSizePt()`, `getLineSpacingValue()`, etc.
   - No duplicate calculations

2. **Same Structure**
   - Headings, paragraphs, lists rendered the same way
   - Same semantic HTML structure

3. **Same Dimensions**
   - A4 page size (210mm × 297mm)
   - Same margins (20mm standard, 25mm wide)

4. **Same Typography**
   - Font families match
   - Font sizes match
   - Line spacing matches

## Future Improvements

1. **Better Page Break Calculation**
   - Measure actual rendered content height
   - Split content across multiple pages accurately
   - Show page breaks in preview

2. **HTML-to-PDF Export**
   - Use html2pdf or Puppeteer
   - Render `DocumentRenderer` to HTML
   - Convert HTML directly to PDF
   - Ensures pixel-perfect match

3. **Real-time Preview Updates**
   - Optimize re-rendering
   - Cache rendered content
   - Only regenerate on style changes

## File Structure

```
src/
├── components/
│   ├── document-renderer.tsx    # Canonical renderer (SINGLE SOURCE OF TRUTH)
│   ├── document-viewer.tsx      # Page-based preview with zoom
│   └── export-preview.tsx        # Preview mode selector
├── lib/
│   ├── document-styles.ts        # Style definitions and helpers
│   ├── document-html.ts          # HTML generation utility
│   └── export-utils.ts           # PDF/DOCX export functions
└── styles/
    └── document.css              # Shared document stylesheet
```

## Key Principles

1. **Single Source of Truth**: `DocumentRenderer` is the canonical renderer
2. **Shared Calculations**: All styling uses the same helper functions
3. **Consistent Structure**: Same HTML/semantic structure everywhere
4. **Matching Dimensions**: Same page size and margins
5. **Export Alignment**: Exports use the same styling as preview


