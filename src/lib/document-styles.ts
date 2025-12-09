/**
 * Document Style System
 * 
 * This file defines the document styling system that allows users to customize
 * the appearance of generated legal documents without changing the legal content.
 * 
 * To add new style options:
 * 1. Add the option to the DocumentStyle interface
 * 2. Add the option to the defaultStyle object
 * 3. Add UI controls in DocumentStylePanel component
 * 4. Apply the style in the preview (contract-form.tsx)
 * 5. Update export functions (export-utils.ts) to use the style
 */

export interface DocumentStyle {
  fontFamily: "modern" | "classic" | "mono"
  fontSize: "small" | "medium" | "large"
  lineSpacing: "single" | "onePointOneFive" | "onePointFive"
  paragraphSpacing: "compact" | "normal" | "roomy"
  headingStyle: "bold" | "regular"
  headingCase: "normal" | "uppercase"
  headingIndent: "flush" | "indented"
  layout: "standard" | "wide"
  numberingStyle: "numeric" | "decimal" | "alpha"
}

export const defaultStyle: DocumentStyle = {
  fontFamily: "modern",
  fontSize: "medium",
  lineSpacing: "onePointOneFive",
  paragraphSpacing: "normal",
  headingStyle: "bold",
  headingCase: "normal",
  headingIndent: "flush",
  layout: "standard",
  numberingStyle: "numeric",
}

/**
 * Style Presets
 * 
 * To add a new preset:
 * 1. Create a new DocumentStyle object
 * 2. Add it to the presets object below
 * 3. Add it to the preset options in DocumentStylePanel
 */
export const presets: Record<string, DocumentStyle> = {
  "standard-legal": {
    fontFamily: "classic",
    fontSize: "medium",
    lineSpacing: "onePointOneFive",
    paragraphSpacing: "normal",
    headingStyle: "bold",
    headingCase: "normal",
    headingIndent: "flush",
    layout: "standard",
    numberingStyle: "numeric",
  },
  "readable-business": {
    fontFamily: "modern",
    fontSize: "large",
    lineSpacing: "onePointFive",
    paragraphSpacing: "roomy",
    headingStyle: "bold",
    headingCase: "uppercase",
    headingIndent: "flush",
    layout: "wide",
    numberingStyle: "numeric",
  },
  "compact-print": {
    fontFamily: "modern",
    fontSize: "small",
    lineSpacing: "single",
    paragraphSpacing: "compact",
    headingStyle: "bold",
    headingCase: "normal",
    headingIndent: "indented",
    layout: "standard",
    numberingStyle: "decimal",
  },
}

/**
 * Get CSS classes for a document style
 * This maps the DocumentStyle to Tailwind CSS classes
 */
export function getDocumentStyleClasses(style: DocumentStyle): string {
  const classes: string[] = []

  // Font Family
  switch (style.fontFamily) {
    case "modern":
      classes.push("font-sans")
      break
    case "classic":
      classes.push("font-serif")
      break
    case "mono":
      classes.push("font-mono")
      break
  }

  // Font Size
  switch (style.fontSize) {
    case "small":
      classes.push("text-sm")
      break
    case "medium":
      classes.push("text-base")
      break
    case "large":
      classes.push("text-lg")
      break
  }

  // Line Spacing
  switch (style.lineSpacing) {
    case "single":
      classes.push("leading-tight")
      break
    case "onePointOneFive":
      classes.push("leading-normal")
      break
    case "onePointFive":
      classes.push("leading-relaxed")
      break
  }

  return classes.join(" ")
}

/**
 * Get inline styles for a document style
 * Some styles need inline styles for precise control
 */
export function getDocumentStyleStyles(style: DocumentStyle): React.CSSProperties {
  const styles: React.CSSProperties = {}

  // Line Spacing (precise control)
  switch (style.lineSpacing) {
    case "single":
      styles.lineHeight = "1.0"
      break
    case "onePointOneFive":
      styles.lineHeight = "1.15"
      break
    case "onePointFive":
      styles.lineHeight = "1.5"
      break
  }

  // Paragraph Spacing
  switch (style.paragraphSpacing) {
    case "compact":
      styles.marginBottom = "0.5rem"
      break
    case "normal":
      styles.marginBottom = "1rem"
      break
    case "roomy":
      styles.marginBottom = "1.5rem"
      break
  }

  // Layout / Margins
  switch (style.layout) {
    case "standard":
      styles.padding = "1.5rem"
      break
    case "wide":
      styles.padding = "2.5rem"
      break
  }

  return styles
}

/**
 * Get font family name for export
 */
export function getFontFamilyName(style: DocumentStyle): string {
  switch (style.fontFamily) {
    case "modern":
      return "Inter, system-ui, -apple-system, sans-serif"
    case "classic":
      return "Georgia, 'Times New Roman', serif"
    case "mono":
      return "'Courier New', monospace"
  }
}

/**
 * Get font size in points for export
 */
export function getFontSizePt(style: DocumentStyle): number {
  switch (style.fontSize) {
    case "small":
      return 11
    case "medium":
      return 12
    case "large":
      return 14
  }
}

/**
 * Get line spacing value for export
 */
export function getLineSpacingValue(style: DocumentStyle): number {
  switch (style.lineSpacing) {
    case "single":
      return 1.0
    case "onePointOneFive":
      return 1.15
    case "onePointFive":
      return 1.5
  }
}
