# Export System Audit

## Current Implementation (Pre-Refactor)

### PDF Export
- **Library**: `jsPDF` (v3.0.4)
- **Location**: `src/lib/export-utils.ts` → `exportToPDF()`
- **Method**: Client-side export
- **Process**: 
  1. Converts HTML to plain text via `htmlToPlainText()`
  2. Parses markdown structure manually
  3. Uses jsPDF API to build PDF programmatically
  4. Limited formatting support (basic text, headings, lists)
- **Issues**: 
  - No true HTML rendering (converts to plain text first)
  - Limited styling control
  - No proper page break control
  - No headers/footers
  - Client-side only (browser dependency)

### DOCX Export
- **Library**: `docx` (v9.5.1)
- **Location**: `src/lib/export-utils.ts` → `exportToDOCX()`
- **Method**: Client-side export
- **Process**:
  1. Converts HTML to plain text via `contentToPlainText()`
  2. Parses markdown structure manually
  3. Uses docx library to build DOCX programmatically
  4. Limited formatting support
- **Issues**:
  - No true HTML rendering (converts to plain text first)
  - Brittle list numbering
  - Inconsistent spacing
  - No proper page breaks
  - Client-side only

### HTML Generation
- **Component**: `DocumentRenderer` (`src/components/document-renderer.tsx`)
- **Method**: React component rendering
- **Content Format**: HTML stored in database, rendered via React
- **Styling**: Inline styles + CSS classes
- **Structure**: Semantic HTML (h1-h3, p, ul/ol, etc.) but not optimized for print

### Export Endpoints
- **Location**: Client-side only (no API endpoints)
- **Trigger**: User clicks export button in `contract-form.tsx`
- **Flow**: Direct function call → browser download

## Target Architecture (Post-Refactor)

### PDF Export
- **Library**: Playwright (Chromium)
- **Method**: Server-side HTML rendering → PDF
- **Benefits**: 
  - True HTML/CSS rendering
  - Full CSS print support
  - Deterministic page breaks
  - Headers/footers support
  - Professional legal document quality

### DOCX Export
- **Library**: docxtemplater (preferred) or Pandoc
- **Method**: Template-based or semantic model → DOCX
- **Benefits**:
  - Consistent formatting
  - Proper Word heading styles
  - Editable numbered lists
  - Page break control
  - Professional legal document quality

### HTML Standardization
- **Export Mode**: Dedicated export HTML renderer
- **Structure**: Semantic HTML optimized for print
- **CSS**: Dedicated `print.css` for legal documents
- **Signatures**: Dedicated `<section class="signatures">` container

### Export Endpoints
- **Location**: `src/app/api/export/` (new API routes)
- **Method**: Server-side API endpoints
- **Flow**: Frontend → API → Server-side export → Download

